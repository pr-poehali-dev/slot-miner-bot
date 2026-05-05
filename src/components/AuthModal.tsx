import TelegramLoginButton from "./TelegramLoginButton";
import Icon from "@/components/ui/icon";

interface Props {
  open: boolean;
  onClose: () => void;
  onAuth: (data: Record<string, string>) => Promise<unknown>;
  loading?: boolean;
}

export default function AuthModal({ open, onClose, onAuth, loading }: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="glass-card rounded-2xl p-8 border neon-border-cyan w-full max-w-sm relative"
        style={{ background: "rgba(10,14,20,0.97)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-foreground/40 hover:text-foreground transition-colors"
          onClick={onClose}
        >
          <Icon name="X" size={20} />
        </button>

        <div className="text-center mb-6">
          <div
            className="w-14 h-14 rounded-2xl btn-neon flex items-center justify-center mx-auto mb-4"
          >
            <span className="relative z-10 text-2xl">⚡</span>
          </div>
          <h2
            className="text-2xl font-black tracking-tight mb-2"
            style={{ fontFamily: "Oswald, sans-serif" }}
          >
            ВХОД В <span className="neon-text-cyan">SYNCTOOLS</span>
          </h2>
          <p className="text-foreground/50 text-sm">
            Войдите через Telegram — быстро и безопасно
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">
          {loading ? (
            <div className="flex items-center gap-2 text-foreground/50">
              <div
                className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: "var(--neon-cyan)", borderTopColor: "transparent" }}
              />
              <span className="text-sm">Входим...</span>
            </div>
          ) : (
            <TelegramLoginButton onAuth={onAuth} buttonSize="large" />
          )}

          <div className="flex items-center gap-2 text-xs text-foreground/30 mt-2">
            <Icon name="Shield" size={12} />
            <span>Данные передаются безопасно через Telegram</span>
          </div>
        </div>
      </div>
    </div>
  );
}
