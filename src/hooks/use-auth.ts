import { useState, useEffect } from "react";

const TG_AUTH_URL = "https://functions.poehali.dev/2b9ffb3c-a306-4f0a-b566-34bb59b336af";
const SESSION_KEY = "synctools_token";

export interface TgUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

export function useAuth() {
  const [user, setUser] = useState<TgUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(SESSION_KEY);
    if (!token) { setLoading(false); return; }
    fetch(TG_AUTH_URL + "/me", {
      headers: { "X-Auth-Token": token },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.user) setUser(data.user);
        else localStorage.removeItem(SESSION_KEY);
      })
      .catch(() => localStorage.removeItem(SESSION_KEY))
      .finally(() => setLoading(false));
  }, []);

  const loginWithTelegram = async (tgData: Record<string, string>) => {
    const res = await fetch(TG_AUTH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tgData),
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem(SESSION_KEY, data.token);
      setUser(data.user);
    }
    return data;
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  return { user, loading, loginWithTelegram, logout };
}
