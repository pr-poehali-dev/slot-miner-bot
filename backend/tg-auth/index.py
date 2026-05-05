import os
import json
import hashlib
import hmac
import time
import secrets
import psycopg2

SCHEMA = os.environ.get("MAIN_DB_SCHEMA", "t_p41903620_slot_miner_bot")

def get_db():
    return psycopg2.connect(os.environ["DATABASE_URL"])

def verify_telegram_data(data: dict) -> bool:
    """Проверяет подпись данных от Telegram Login Widget."""
    bot_token = os.environ["TELEGRAM_BOT_TOKEN"]
    check_hash = data.pop("hash", None)
    if not check_hash:
        return False
    data_check_string = "\n".join(f"{k}={v}" for k, v in sorted(data.items()))
    secret_key = hashlib.sha256(bot_token.encode()).digest()
    computed_hash = hmac.new(secret_key, data_check_string.encode(), hashlib.sha256).hexdigest()
    auth_date = int(data.get("auth_date", 0))
    if time.time() - auth_date > 86400:
        return False
    return hmac.compare_digest(computed_hash, check_hash)

def handler(event: dict, context) -> dict:
    """Авторизация через Telegram Login Widget. Верифицирует данные, сохраняет пользователя и возвращает сессионный токен."""
    cors = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, X-User-Id, X-Auth-Token",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors, "body": ""}

    if event.get("httpMethod") == "GET":
        path = event.get("path", "")
        if path.endswith("/me"):
            token = (event.get("headers") or {}).get("X-Auth-Token", "")
            if not token:
                return {"statusCode": 401, "headers": cors, "body": json.dumps({"error": "no token"})}
            conn = get_db()
            cur = conn.cursor()
            cur.execute(
                f"SELECT u.id, u.first_name, u.last_name, u.username, u.photo_url FROM {SCHEMA}.sessions s JOIN {SCHEMA}.users u ON s.user_id = u.id WHERE s.token = %s AND s.expires_at > NOW()",
                (token,)
            )
            row = cur.fetchone()
            conn.close()
            if not row:
                return {"statusCode": 401, "headers": cors, "body": json.dumps({"error": "invalid or expired token"})}
            user = {"id": row[0], "first_name": row[1], "last_name": row[2], "username": row[3], "photo_url": row[4]}
            return {"statusCode": 200, "headers": cors, "body": json.dumps({"user": user})}

    if event.get("httpMethod") == "POST":
        body = json.loads(event.get("body") or "{}")
        tg_data = dict(body)
        if not verify_telegram_data(tg_data):
            return {"statusCode": 403, "headers": cors, "body": json.dumps({"error": "invalid telegram data"})}

        user_id = int(body["id"])
        first_name = body.get("first_name", "")
        last_name = body.get("last_name")
        username = body.get("username")
        photo_url = body.get("photo_url")
        auth_date = int(body.get("auth_date", 0))

        conn = get_db()
        cur = conn.cursor()
        cur.execute(
            f"""INSERT INTO {SCHEMA}.users (id, first_name, last_name, username, photo_url, auth_date, last_login)
                VALUES (%s, %s, %s, %s, %s, %s, NOW())
                ON CONFLICT (id) DO UPDATE SET
                    first_name = EXCLUDED.first_name,
                    last_name = EXCLUDED.last_name,
                    username = EXCLUDED.username,
                    photo_url = EXCLUDED.photo_url,
                    auth_date = EXCLUDED.auth_date,
                    last_login = NOW()""",
            (user_id, first_name, last_name, username, photo_url, auth_date)
        )
        token = secrets.token_hex(32)
        cur.execute(
            f"INSERT INTO {SCHEMA}.sessions (token, user_id) VALUES (%s, %s)",
            (token, user_id)
        )
        conn.commit()
        conn.close()

        return {
            "statusCode": 200,
            "headers": cors,
            "body": json.dumps({
                "token": token,
                "user": {
                    "id": user_id,
                    "first_name": first_name,
                    "last_name": last_name,
                    "username": username,
                    "photo_url": photo_url,
                }
            })
        }

    return {"statusCode": 405, "headers": cors, "body": json.dumps({"error": "method not allowed"})}
