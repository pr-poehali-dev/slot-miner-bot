CREATE TABLE IF NOT EXISTS t_p41903620_slot_miner_bot.users (
    id BIGINT PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT,
    username TEXT,
    photo_url TEXT,
    auth_date BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p41903620_slot_miner_bot.sessions (
    token TEXT PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES t_p41903620_slot_miner_bot.users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP DEFAULT NOW() + INTERVAL '30 days'
);
