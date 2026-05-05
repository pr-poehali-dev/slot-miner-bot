import { useState } from "react";
import Icon from "@/components/ui/icon";
import { useAuth } from "@/hooks/use-auth";
import AuthModal from "@/components/AuthModal";

type IconName = React.ComponentProps<typeof Icon>["name"];

const HERO_IMG = "https://cdn.poehali.dev/projects/b54fc404-8bf6-4b90-a0f4-9679b3752d6b/files/33b87167-961e-4ecb-97d2-ca540262aabd.jpg";
const COLLAB_IMG = "https://cdn.poehali.dev/projects/b54fc404-8bf6-4b90-a0f4-9679b3752d6b/files/47f1e8da-cd3c-43df-b661-36bf5c2bcfc3.jpg";

const NAV_ITEMS = [
  { id: "home", label: "Главная" },
  { id: "tools", label: "Инструменты" },
  { id: "pricing", label: "Тарифы" },
  { id: "docs", label: "Справка" },
  { id: "cabinet", label: "Кабинет" },
  { id: "about", label: "О нас" },
  { id: "contact", label: "Контакты" },
];

const TOOLS: { icon: IconName; label: string; desc: string; color: string; border: string; tag: string | null }[] = [
  { icon: "FileEdit", label: "Редактор документов", desc: "Совместное редактирование с историей версий", color: "rgba(0,245,212,0.15)", border: "rgba(0,245,212,0.5)", tag: "Популярно" },
  { icon: "Kanban", label: "Доска задач", desc: "Канбан-доска для командного трекинга", color: "rgba(155,89,255,0.15)", border: "rgba(155,89,255,0.5)", tag: null },
  { icon: "Video", label: "Видеоконференции", desc: "HD-звонки прямо в браузере без плагинов", color: "rgba(57,255,20,0.12)", border: "rgba(57,255,20,0.5)", tag: "Новинка" },
  { icon: "BarChart3", label: "Аналитика", desc: "Графики и отчёты по работе команды", color: "rgba(255,107,0,0.12)", border: "rgba(255,107,0,0.5)", tag: null },
  { icon: "MessageSquare", label: "Чат", desc: "Мессенджер с тредами и реакциями", color: "rgba(255,0,110,0.12)", border: "rgba(255,0,110,0.5)", tag: null },
  { icon: "FolderOpen", label: "Хранилище файлов", desc: "Облачное хранилище с умным поиском", color: "rgba(0,245,212,0.12)", border: "rgba(0,245,212,0.4)", tag: null },
];

const PLANS = [
  {
    name: "Старт",
    price: "Бесплатно",
    period: "",
    desc: "Для частных лиц и малых команд",
    features: ["3 проекта", "5 участников", "2 ГБ хранилища", "Базовые инструменты"],
    cta: "Начать бесплатно",
    popular: false,
  },
  {
    name: "Команда",
    price: "1 490 ₽",
    period: "/ месяц",
    desc: "Для растущих команд и стартапов",
    features: ["Неограничено проектов", "До 25 участников", "50 ГБ хранилища", "Все инструменты", "Приоритетная поддержка"],
    cta: "Выбрать план",
    popular: true,
  },
  {
    name: "Бизнес",
    price: "4 990 ₽",
    period: "/ месяц",
    desc: "Для крупных компаний с высокой нагрузкой",
    features: ["Всё из Команды", "Неограничено участников", "1 ТБ хранилища", "SSO и аудит", "Персональный менеджер"],
    cta: "Связаться с нами",
    popular: false,
  },
];

const DOCS: { icon: IconName; title: string; desc: string }[] = [
  { icon: "BookOpen", title: "Быстрый старт", desc: "Создайте первый проект за 5 минут" },
  { icon: "Users", title: "Совместная работа", desc: "Как пригласить команду и настроить роли" },
  { icon: "Settings", title: "Настройки рабочего пространства", desc: "Кастомизация под нужды вашей команды" },
  { icon: "Shield", title: "Безопасность и доступы", desc: "Управление правами и двухфакторная аутентификация" },
  { icon: "Zap", title: "Интеграции", desc: "Подключение Slack, GitHub, Jira и других сервисов" },
  { icon: "HelpCircle", title: "Частые вопросы", desc: "Ответы на популярные вопросы пользователей" },
];

const TEAM = [
  { name: "Алексей", role: "CEO & Co-founder", emoji: "👨‍💼", color: "rgba(0,245,212,0.2)" },
  { name: "Мария", role: "CTO", emoji: "👩‍💻", color: "rgba(155,89,255,0.2)" },
  { name: "Дмитрий", role: "Head of Design", emoji: "🎨", color: "rgba(57,255,20,0.15)" },
  { name: "Анна", role: "Head of Growth", emoji: "📈", color: "rgba(255,107,0,0.15)" },
];

const ONLINE_USERS = [
  { emoji: "👩‍💻", color: "#9b59ff" },
  { emoji: "👨‍🎨", color: "#00f5d4" },
  { emoji: "👩‍🚀", color: "#39ff14" },
  { emoji: "🧑‍💼", color: "#ff6b00" },
  { emoji: "👩‍🔬", color: "#ff006e" },
];

export default function Index() {
  const [activeSection, setActiveSection] = useState("home");
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const { user, loading: userLoading, loginWithTelegram, logout } = useAuth();

  const scrollTo = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleTgAuth = async (tgData: Record<string, string>) => {
    setAuthLoading(true);
    await loginWithTelegram(tgData);
    setAuthLoading(false);
    setAuthOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground mesh-bg grid-bg">
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} onAuth={handleTgAuth} loading={authLoading} />
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollTo("home")}>
            <div className="w-8 h-8 rounded-lg btn-neon flex items-center justify-center">
              <span className="relative z-10 text-sm">⚡</span>
            </div>
            <span className="font-bold text-lg tracking-tight" style={{ fontFamily: "Oswald, sans-serif", letterSpacing: "0.05em" }}>
              SYNC<span className="neon-text-cyan">TOOLS</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                className={`nav-link ${activeSection === item.id ? "active" : ""}`}
                onClick={() => scrollTo(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {userLoading ? (
              <div className="w-7 h-7 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "var(--neon-cyan)", borderTopColor: "transparent" }} />
            ) : user ? (
              <div className="flex items-center gap-2">
                <button className="hidden md:flex items-center gap-2 glass-card border border-border/50 px-3 py-2 rounded-lg text-sm" onClick={() => scrollTo("cabinet")}>
                  {user.photo_url
                    ? <img src={user.photo_url} className="w-6 h-6 rounded-full" alt="" />
                    : <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "rgba(0,245,212,0.2)", color: "var(--neon-cyan)" }}>{user.first_name[0]}</span>
                  }
                  <span className="neon-text-cyan font-semibold">{user.first_name}</span>
                </button>
                <button className="btn-outline-neon px-3 py-2 rounded-lg text-sm" onClick={logout}>
                  <Icon name="LogOut" size={16} />
                </button>
              </div>
            ) : (
              <>
                <button className="hidden md:block btn-outline-neon px-4 py-2 rounded-lg text-sm" onClick={() => setAuthOpen(true)}>
                  Войти
                </button>
                <button className="btn-neon px-4 py-2 rounded-lg text-sm" onClick={() => setAuthOpen(true)}>
                  <span>Регистрация</span>
                </button>
              </>
            )}
            <button className="md:hidden text-foreground/70" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Icon name={mobileMenuOpen ? "X" : "Menu"} size={22} />
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden glass-card border-t border-border/50 px-6 py-4 flex flex-col gap-3">
            {NAV_ITEMS.map((item) => (
              <button key={item.id} className={`nav-link text-left py-2 ${activeSection === item.id ? "active" : ""}`} onClick={() => scrollTo(item.id)}>
                {item.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* HERO */}
      <section id="home" className="pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
            <div className="flex flex-col gap-6">
              <div className="fade-in-up stagger-1 opacity-0">
                <span className="tag-badge">🚀 Совместная работа в реальном времени</span>
              </div>
              <h1 className="fade-in-up stagger-2 opacity-0 text-5xl md:text-6xl lg:text-7xl font-black leading-none tracking-tight" style={{ fontFamily: "Oswald, sans-serif" }}>
                ИНСТРУМЕНТЫ<br />
                <span className="gradient-text">ДЛЯ КОМАНД</span><br />
                <span className="text-foreground/40 text-4xl md:text-5xl font-light">нового уровня</span>
              </h1>
              <p className="fade-in-up stagger-3 opacity-0 text-foreground/60 text-lg leading-relaxed max-w-md">
                Всё что нужно команде в одном месте: редактор, задачи, видеозвонки, аналитика. Работайте вместе, где бы вы ни находились.
              </p>

              <div className="fade-in-up stagger-3 opacity-0 flex items-center gap-4 py-3 px-4 glass-card rounded-xl w-fit">
                <div className="flex" style={{ display: "flex" }}>
                  {ONLINE_USERS.map((u, i) => (
                    <div
                      key={i}
                      style={{
                        width: 36, height: 36, borderRadius: "50%",
                        background: u.color,
                        border: "2px solid rgba(0,245,212,0.5)",
                        marginLeft: i === 0 ? 0 : -10,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 16, zIndex: 5 - i, position: "relative"
                      }}
                    >
                      {u.emoji}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="online-dot" />
                    <span className="text-sm font-semibold neon-text-green">1 247 онлайн</span>
                  </div>
                  <span className="text-xs text-foreground/40">прямо сейчас в SyncTools</span>
                </div>
              </div>

              <div className="fade-in-up stagger-4 opacity-0 flex flex-wrap gap-3">
                <button className="btn-neon px-6 py-3 rounded-xl text-base font-bold" onClick={() => scrollTo("tools")}>
                  <span>Смотреть инструменты →</span>
                </button>
                <button className="btn-outline-neon px-6 py-3 rounded-xl text-base" onClick={() => scrollTo("pricing")}>
                  Посмотреть тарифы
                </button>
              </div>

              <div className="fade-in-up stagger-5 opacity-0 grid grid-cols-3 gap-4 pt-4">
                {[{ value: "50 000+", label: "команд" }, { value: "99.9%", label: "uptime" }, { value: "< 50мс", label: "задержка" }].map((s, i) => (
                  <div key={i} className="text-center">
                    <div className="text-2xl font-black gradient-text" style={{ fontFamily: "Oswald, sans-serif" }}>{s.value}</div>
                    <div className="text-xs text-foreground/40 mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="fade-in-up stagger-2 opacity-0 relative float-anim">
              <div className="relative rounded-2xl overflow-hidden neon-glow-cyan">
                <img src={HERO_IMG} alt="SyncTools" className="w-full object-cover rounded-2xl" style={{ maxHeight: 520 }} />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
              </div>
              <div className="absolute -bottom-4 -left-4 glass-card neon-border-purple rounded-xl px-4 py-3 border">
                <div className="flex items-center gap-2">
                  <Icon name="Users" size={16} className="neon-text-purple" />
                  <span className="text-sm font-semibold">Команда редактирует</span>
                </div>
                <div className="text-xs text-foreground/40 mt-1">3 человека онлайн</div>
              </div>
              <div className="absolute -top-4 -right-4 glass-card neon-border-cyan rounded-xl px-4 py-3 border">
                <div className="flex items-center gap-2">
                  <span className="online-dot" />
                  <span className="text-sm font-semibold neon-text-cyan">Синхронизация</span>
                </div>
                <div className="text-xs text-foreground/40 mt-1">обновлено 2 сек. назад</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-separator mx-6" />

      {/* TOOLS */}
      <section id="tools" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="tag-badge">Инструменты</span>
            <h2 className="text-4xl md:text-5xl font-black mt-4 tracking-tight" style={{ fontFamily: "Oswald, sans-serif" }}>
              ВСЁ ДЛЯ <span className="gradient-text">ПРОДУКТИВНОЙ</span> РАБОТЫ
            </h2>
            <p className="text-foreground/50 mt-4 max-w-xl mx-auto">Больше не нужно переключаться между десятками приложений. Всё в одном месте.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {TOOLS.map((tool, i) => (
              <div key={i} className="glass-card glass-card-hover rounded-2xl p-6 cursor-pointer border" style={{ borderColor: tool.border }}>
                <div className="flex items-start gap-4">
                  <div className="tool-icon-wrap" style={{ background: tool.color }}>
                    <Icon name={tool.icon} size={24} style={{ color: tool.border.replace("0.5", "1") }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-bold text-base">{tool.label}</span>
                      {tool.tag && (
                        <span style={{ background: tool.color, border: `1px solid ${tool.border}`, color: tool.border.replace("0.5", "1"), fontSize: "0.65rem", fontWeight: 700, padding: "2px 8px", borderRadius: 999, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                          {tool.tag}
                        </span>
                      )}
                    </div>
                    <p className="text-foreground/50 text-sm">{tool.desc}</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button className="text-xs font-semibold flex items-center gap-1 hover:gap-2 transition-all" style={{ color: tool.border.replace("0.5", "1") }}>
                    Открыть <Icon name="ArrowRight" size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-separator mx-6" />

      {/* COLLAB BANNER */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-3xl overflow-hidden relative" style={{ minHeight: 320 }}>
            <img src={COLLAB_IMG} alt="Совместная работа" className="w-full h-80 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/60 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-center px-10 max-w-xl">
              <span className="tag-badge mb-4 w-fit">⚡ Live collaboration</span>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4" style={{ fontFamily: "Oswald, sans-serif" }}>
                РАБОТАЙТЕ ВМЕСТЕ<br /><span className="neon-text-cyan">В РЕАЛЬНОМ ВРЕМЕНИ</span>
              </h2>
              <p className="text-foreground/60 text-base leading-relaxed mb-6">
                Видите курсоры коллег, правки появляются мгновенно. Никаких конфликтов версий.
              </p>
              <button className="btn-neon px-6 py-3 rounded-xl text-sm font-bold w-fit" onClick={() => scrollTo("tools")}>
                <span>Попробовать →</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="section-separator mx-6" />

      {/* PRICING */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="tag-badge">Тарифы</span>
            <h2 className="text-4xl md:text-5xl font-black mt-4 tracking-tight" style={{ fontFamily: "Oswald, sans-serif" }}>
              ЧЕСТНЫЕ <span className="gradient-text">ЦЕНЫ</span>
            </h2>
            <p className="text-foreground/50 mt-4 max-w-md mx-auto">Начните бесплатно, масштабируйтесь по мере роста команды</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-start">
            {PLANS.map((plan, i) => (
              <div key={i} className={`rounded-2xl p-8 border relative ${plan.popular ? "price-card-popular" : "glass-card border-border/50"}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="btn-neon px-4 py-1 rounded-full text-xs font-bold"><span>⭐ Популярный</span></span>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-xl font-black tracking-wide mb-1" style={{ fontFamily: "Oswald, sans-serif" }}>{plan.name.toUpperCase()}</h3>
                  <p className="text-foreground/40 text-sm mb-4">{plan.desc}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black" style={{ fontFamily: "Oswald, sans-serif", color: plan.popular ? "var(--neon-cyan)" : "hsl(var(--foreground))" }}>{plan.price}</span>
                    {plan.period && <span className="text-foreground/40 text-sm">{plan.period}</span>}
                  </div>
                </div>
                <ul className="flex flex-col gap-3 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm">
                      <Icon name="Check" size={16} className="neon-text-cyan flex-shrink-0" />
                      <span className="text-foreground/70">{f}</span>
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 rounded-xl font-bold text-sm ${plan.popular ? "btn-neon" : "btn-outline-neon"}`}>
                  <span>{plan.cta}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-separator mx-6" />

      {/* DOCS */}
      <section id="docs" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="tag-badge">Справка</span>
            <h2 className="text-4xl md:text-5xl font-black mt-4 tracking-tight" style={{ fontFamily: "Oswald, sans-serif" }}>
              РУКОВОДСТВА<br /><span className="gradient-text-green">И ДОКУМЕНТАЦИЯ</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {DOCS.map((doc, i) => (
              <div key={i} className="glass-card glass-card-hover rounded-2xl p-6 border border-border/50 cursor-pointer group">
                <div className="flex items-start gap-4">
                  <div className="tool-icon-wrap" style={{ background: "rgba(0,245,212,0.1)" }}>
                    <Icon name={doc.icon} size={22} className="neon-text-cyan" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1 group-hover:text-[var(--neon-cyan)] transition-colors">{doc.title}</h3>
                    <p className="text-foreground/50 text-sm">{doc.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 glass-card rounded-2xl p-6 border border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="tool-icon-wrap" style={{ background: "rgba(155,89,255,0.15)" }}>
                <Icon name="Bot" size={24} className="neon-text-purple" />
              </div>
              <div>
                <h3 className="font-bold">Нужна помощь?</h3>
                <p className="text-foreground/50 text-sm">Наш ИИ-ассистент ответит на любой вопрос за секунды</p>
              </div>
            </div>
            <button className="btn-neon px-6 py-3 rounded-xl text-sm font-bold whitespace-nowrap"><span>Спросить ассистента →</span></button>
          </div>
        </div>
      </section>

      <div className="section-separator mx-6" />

      {/* CABINET */}
      <section id="cabinet" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="tag-badge">Личный кабинет</span>
              <h2 className="text-4xl md:text-5xl font-black mt-4 mb-6 tracking-tight" style={{ fontFamily: "Oswald, sans-serif" }}>
                ВАШИ ПРОЕКТЫ<br /><span className="gradient-text">ПОД РУКОЙ</span>
              </h2>
              <p className="text-foreground/60 leading-relaxed mb-8">
                Все ваши рабочие пространства, история изменений, статистика использования и управление командой — в едином дашборде.
              </p>
              <div className="flex flex-col gap-4">
                {[
                  { icon: "LayoutDashboard", text: "Дашборд с активными проектами" },
                  { icon: "Clock", text: "История активности команды" },
                  { icon: "Bell", text: "Уведомления и упоминания" },
                  { icon: "UserCog", text: "Управление участниками и ролями" },
                ].map((item: { icon: IconName; text: string }, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(0,245,212,0.1)" }}>
                      <Icon name={item.icon} size={16} className="neon-text-cyan" />
                    </div>
                    <span className="text-foreground/70 text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 border neon-border-cyan">
              {user ? (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      {user.photo_url
                        ? <img src={user.photo_url} className="w-10 h-10 rounded-full border-2" style={{ borderColor: "var(--neon-cyan)" }} alt="" />
                        : <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold" style={{ background: "rgba(0,245,212,0.2)", color: "var(--neon-cyan)" }}>{user.first_name[0]}</div>
                      }
                      <div>
                        <div className="font-bold text-sm">{user.first_name} {user.last_name ?? ""}</div>
                        <div className="text-xs text-foreground/40">{user.username ? `@${user.username}` : `ID: ${user.id}`}</div>
                      </div>
                    </div>
                    <span className="tag-badge">Активен</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {[{ val: "12", label: "Проектов" }, { val: "8", label: "Участников" }, { val: "34 ГБ", label: "Хранилище" }].map((s, i) => (
                      <div key={i} className="rounded-xl p-3 text-center" style={{ background: "rgba(255,255,255,0.04)" }}>
                        <div className="text-xl font-black neon-text-cyan" style={{ fontFamily: "Oswald, sans-serif" }}>{s.val}</div>
                        <div className="text-xs text-foreground/40 mt-1">{s.label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col gap-2 mb-5">
                    <div className="text-xs text-foreground/40 mb-1 uppercase tracking-widest">Последние проекты</div>
                    {["Дизайн-система Q3", "Маркетинговый план", "Продуктовый roadmap"].map((p, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
                        <div className="flex items-center gap-3">
                          <Icon name="Folder" size={14} className="neon-text-purple" />
                          <span className="text-sm">{p}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="online-dot" />
                          <span className="text-xs text-foreground/40">Live</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full btn-outline-neon py-3 rounded-xl text-sm font-bold" onClick={logout}>
                    Выйти из аккаунта
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center gap-6 py-8">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl" style={{ background: "rgba(0,245,212,0.1)" }}>🔐</div>
                  <div className="text-center">
                    <h3 className="font-black text-lg mb-2" style={{ fontFamily: "Oswald, sans-serif" }}>ВОЙДИТЕ В АККАУНТ</h3>
                    <p className="text-foreground/50 text-sm">Чтобы видеть свои проекты и результаты</p>
                  </div>
                  <button className="btn-neon px-6 py-3 rounded-xl text-sm font-bold" onClick={() => setAuthOpen(true)}>
                    <span>Войти через Telegram →</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="section-separator mx-6" />

      {/* ABOUT */}
      <section id="about" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="tag-badge">О нас</span>
            <h2 className="text-4xl md:text-5xl font-black mt-4 tracking-tight" style={{ fontFamily: "Oswald, sans-serif" }}>
              МИССИЯ <span className="gradient-text">SYNCTOOLS</span>
            </h2>
            <p className="text-foreground/50 mt-6 max-w-2xl mx-auto text-lg leading-relaxed">
              Мы верим, что великие продукты создаются командами, а не одиночками. Наша миссия — убрать все технические барьеры между идеей и её воплощением.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
            {TEAM.map((member, i) => (
              <div key={i} className="glass-card glass-card-hover rounded-2xl p-6 text-center border border-border/50 cursor-pointer">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4" style={{ background: member.color }}>{member.emoji}</div>
                <h3 className="font-bold text-base">{member.name}</h3>
                <p className="text-foreground/40 text-sm mt-1">{member.role}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              { icon: "Zap", title: "Скорость", desc: "Инструменты без задержек и тормозов. Любой ценой.", color: "rgba(255,107,0,0.15)", textColor: "#ff6b00" },
              { icon: "Lock", title: "Безопасность", desc: "Шифрование E2E, серверы в России. Ваши данные защищены.", color: "rgba(57,255,20,0.1)", textColor: "#39ff14" },
              { icon: "Heart" as IconName, title: "Забота", desc: "Поддержка 24/7, персональный подход к каждой команде.", color: "rgba(255,0,110,0.1)", textColor: "#ff006e" },
            ].map((v, i) => (
              <div key={i} className="glass-card rounded-2xl p-6 border" style={{ borderColor: v.textColor + "50" }}>
                <div className="tool-icon-wrap mb-4" style={{ background: v.color }}>
                  <Icon name={v.icon} size={22} style={{ color: v.textColor }} />
                </div>
                <h3 className="font-bold text-lg mb-2" style={{ fontFamily: "Oswald, sans-serif", color: v.textColor }}>{v.title.toUpperCase()}</h3>
                <p className="text-foreground/50 text-sm">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-separator mx-6" />

      {/* CONTACT */}
      <section id="contact" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <span className="tag-badge">Контакты</span>
              <h2 className="text-4xl md:text-5xl font-black mt-4 mb-6 tracking-tight" style={{ fontFamily: "Oswald, sans-serif" }}>
                СВЯЖИТЕСЬ<br /><span className="gradient-text">С НАМИ</span>
              </h2>
              <p className="text-foreground/60 leading-relaxed mb-8">
                Есть вопросы? Хотите демо или нужна помощь с выбором тарифа — пишите, ответим в течение часа.
              </p>
              <div className="flex flex-col gap-4">
                {[
                  { icon: "Mail" as IconName, label: "Email", value: "hello@synctools.ru" },
                  { icon: "MessageSquare" as IconName, label: "Telegram", value: "@synctools_support" },
                  { icon: "Phone" as IconName, label: "Телефон", value: "+7 (800) 555-35-35" },
                ].map((c, i) => (
                  <div key={i} className="flex items-center gap-4 glass-card rounded-xl p-4 border border-border/50">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(0,245,212,0.1)" }}>
                      <Icon name={c.icon} size={18} className="neon-text-cyan" />
                    </div>
                    <div>
                      <div className="text-xs text-foreground/40">{c.label}</div>
                      <div className="font-semibold text-sm">{c.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-2xl p-8 border neon-border-purple">
              <h3 className="font-black text-xl mb-6" style={{ fontFamily: "Oswald, sans-serif" }}>НАПИШИТЕ НАМ</h3>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-xs text-foreground/40 uppercase tracking-widest mb-2 block">Ваше имя</label>
                  <input type="text" className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--neon-cyan)] transition-colors" placeholder="Иван Петров" value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs text-foreground/40 uppercase tracking-widest mb-2 block">Email</label>
                  <input type="email" className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--neon-cyan)] transition-colors" placeholder="ivan@company.ru" value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs text-foreground/40 uppercase tracking-widest mb-2 block">Сообщение</label>
                  <textarea className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--neon-cyan)] transition-colors resize-none" placeholder="Расскажите о вашей задаче..." rows={4} value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} />
                </div>
                <button className="btn-neon py-3 rounded-xl text-sm font-bold"><span>Отправить сообщение →</span></button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-6 border-t border-border/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg btn-neon flex items-center justify-center">
              <span className="relative z-10 text-sm">⚡</span>
            </div>
            <span className="font-bold text-lg" style={{ fontFamily: "Oswald, sans-serif", letterSpacing: "0.05em" }}>
              SYNC<span className="neon-text-cyan">TOOLS</span>
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {NAV_ITEMS.map((item) => (
              <button key={item.id} className="nav-link" onClick={() => scrollTo(item.id)}>{item.label}</button>
            ))}
          </div>
          <div className="text-foreground/30 text-sm">© 2024 SyncTools</div>
        </div>
      </footer>
    </div>
  );
}