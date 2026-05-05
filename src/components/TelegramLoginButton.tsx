import { useEffect, useRef } from "react";

interface Props {
  onAuth: (data: Record<string, string>) => void;
  buttonSize?: "large" | "medium" | "small";
}

declare global {
  interface Window {
    onTelegramAuth?: (user: Record<string, string>) => void;
  }
}

export default function TelegramLoginButton({ onAuth, buttonSize = "large" }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.onTelegramAuth = onAuth;

    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute("data-telegram-login", "ghgggfg_bot");
    script.setAttribute("data-size", buttonSize);
    script.setAttribute("data-onauth", "onTelegramAuth(user)");
    script.setAttribute("data-request-access", "write");
    script.async = true;
    containerRef.current.appendChild(script);

    return () => {
      delete window.onTelegramAuth;
    };
  }, [onAuth, buttonSize]);

  return <div ref={containerRef} />;
}
