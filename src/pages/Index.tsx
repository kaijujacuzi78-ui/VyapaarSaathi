import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import {
  ArrowUpRight, BadgeIndianRupee, BarChart3, BookOpen, Bot, BrainCircuit, BriefcaseBusiness,
  Building2, CalendarDays, CheckCircle2, ChevronRight, FileCheck2, HomeIcon, Landmark,
  LayoutDashboard, LineChart as LineChartIcon, MessageSquareText, Moon, Scale, Search,
  Settings, ShieldCheck, Sparkles, Sun, Target, TrendingUp, UserCircle2, Users, WalletCards, Zap
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/integrations/supabase/client";
import {
  LANG, LangKey, STATES, BUSINESS_TYPES, REGION_TRACKS,
  CHECKLIST, SCHEMES, CALENDAR, GLOSSARY, FAQ, QUIZ,
  WHATS_NEW, PORTALS, TEMPLATES, WIZARD_STEPS,
  getTagClasses, buildSearchIndex,
} from "@/lib/vyapaar-data";

type TabId = "home" | "checklist" | "wizard" | "schemes" | "calendar" | "learn" | "chat";
type Msg = { role: "user" | "assistant"; content: string };

const SEARCH_INDEX = buildSearchIndex();
const TAB_ICONS: Record<TabId, typeof HomeIcon> = {
  home: HomeIcon,
  checklist: CheckCircle2,
  wizard: LayoutDashboard,
  schemes: BriefcaseBusiness,
  calendar: CalendarDays,
  learn: BookOpen,
  chat: Bot,
};

const growthData = [
  { month: "Jan", score: 42, funding: 18 },
  { month: "Mar", score: 54, funding: 28 },
  { month: "May", score: 63, funding: 44 },
  { month: "Jul", score: 76, funding: 58 },
  { month: "Sep", score: 84, funding: 68 },
  { month: "Nov", score: 91, funding: 82 },
];

const ecosystemData = [
  { name: "Schemes", value: 74 },
  { name: "Loans", value: 68 },
  { name: "Permits", value: 52 },
  { name: "Hiring", value: 81 },
];

const insightCategories = [
  { id: "Loans", icon: WalletCards, accent: "from-amber to-gold" },
  { id: "Schemes", icon: Landmark, accent: "from-sage to-sky" },
  { id: "Registrations", icon: FileCheck2, accent: "from-earth to-clay" },
  { id: "Restrictions", icon: Scale, accent: "from-accent to-amber" },
  { id: "Hiring", icon: Users, accent: "from-sky to-sage" },
  { id: "Tax Benefits", icon: BadgeIndianRupee, accent: "from-gold to-amber" },
];

const quickPrompts = [
  "Build my 30-day startup compliance plan",
  "Find loans and subsidies for my business",
  "What licenses do I need before launch?",
  "Compare GST, Udyam, and Shop Act steps",
];

const PageShell = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 md:py-8 lg:px-8 xl:py-10 ${className}`}>
    {children}
  </div>
);

const SectionHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="mb-6 sm:mb-8">
    <h1 className="text-3xl font-black leading-tight text-earth sm:text-4xl lg:text-5xl">{title}</h1>
    {subtitle && <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">{subtitle}</p>}
  </div>
);

export default function Index() {
  const [lang, setLang] = useState<LangKey>("en");
  const [tab, setTab] = useState<TabId>("home");
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [schemeFilter, setSchemeFilter] = useState("All");
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calFilter, setCalFilter] = useState("all");
  const [glossSearch, setGlossSearch] = useState("");
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [qi, setQi] = useState(0);
  const [qa, setQa] = useState<number | null>(null);
  const [qs, setQs] = useState(0);
  const [qd, setQd] = useState(false);
  const [qr, setQr] = useState<{ correct: boolean }[]>([]);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Namaste! 🙏 I'm VyapaarSaathi — your business law guide.\n\nI can help you with:\n• How to register your business (step-by-step)\n• Which licenses you actually need\n• Government loans & schemes you qualify for\n• Tax deadlines you must not miss\n• Your workers' legal rights\n\nWhat would you like to know today?" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [region, setRegion] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [wizStep, setWizStep] = useState(0);
  const [wizData, setWizData] = useState<Record<string, string>>({});
  const [wizErrors, setWizErrors] = useState<Record<string, string | null>>({});
  const [selTemplate, setSelTemplate] = useState<typeof TEMPLATES[0] | null>(null);
  const [searchQ, setSearchQ] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [feedback, setFeedback] = useState({ rating: 0, comment: "", submitted: false });
  const [expandedChecklist, setExpandedChecklist] = useState<Record<string, boolean>>({});
  const [savedBadge, setSavedBadge] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [insightTab, setInsightTab] = useState("Loans");
  const msgEnd = useRef<HTMLDivElement>(null);
  const { signOut } = useAuth();
  const T = LANG[lang] || LANG.en;
  const checkDone = Object.values(done).filter(Boolean).length;

  // Persistence
  useEffect(() => {
    try {
      const saved = localStorage.getItem("vs_progress");
      if (saved) { const p = JSON.parse(saved); setDone(p.done || {}); setRegion(p.region || ""); setBusinessType(p.businessType || ""); }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("vs_theme");
      const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
      setDarkMode(savedTheme ? savedTheme === "dark" : prefersDark);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    try {
      localStorage.setItem("vs_theme", darkMode ? "dark" : "light");
    } catch { /* ignore */ }
  }, [darkMode]);

  const saveProgress = useCallback(() => {
    try {
      localStorage.setItem("vs_progress", JSON.stringify({ done, region, businessType }));
      setSavedBadge(true);
      setTimeout(() => setSavedBadge(false), 2000);
    } catch { /* ignore */ }
  }, [done, region, businessType]);

  useEffect(() => { msgEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, aiLoading]);

  // Chat
  const sendChat = async (text?: string) => {
    const msg = text || chatInput.trim();
    if (!msg) return;
    setChatInput("");
    const newMsgs: Msg[] = [...messages, { role: "user", content: msg }];
    setMessages(newMsgs);
    setAiLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("vyapaar-chat", {
        body: { messages: newMsgs, region, businessType, lang },
      });
      if (error) throw error;
      setMessages(prev => [...prev, { role: "assistant", content: data?.reply || "Sorry, please try again." }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "⚠️ Connection issue. Please check your internet and try again." }]);
    }
    setAiLoading(false);
  };

  // Quiz
  const handleQ = (i: number) => { if (qa !== null) return; const ok = i === QUIZ[qi].a; setQa(i); if (ok) setQs(s => s + 1); setQr(r => [...r, { correct: ok }]); };
  const nextQ = () => { if (qi < QUIZ.length - 1) { setQi(i => i + 1); setQa(null); } else setQd(true); };
  const resetQ = () => { setQi(0); setQa(null); setQs(0); setQd(false); setQr([]); };

  // Wizard validation
  const validateWizStep = () => {
    const step = WIZARD_STEPS[wizStep];
    if (!("fields" in step) || !step.fields) return true;
    const errs: Record<string, string | null> = {};
    step.fields.forEach(f => { if (f.required && !wizData[f.id]) errs[f.id] = T.errorRequired; });
    setWizErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const wizRecs = () => {
    const r: { label: string; url?: string; must: boolean; time: string; note?: string }[] = [
      { label: "Udyam Registration (Free)", url: "https://udyamregistration.gov.in", must: true, time: "10 min" },
    ];
    if (wizData.btype?.includes("Food")) r.push({ label: "FSSAI License", url: "https://foscos.fssai.gov.in", must: true, time: "30–60 days" });
    const t = wizData.turnover || "";
    if (t.includes("40") || t.includes("1 Cr") || t.includes("Crore")) r.push({ label: "GST Registration", url: "https://gst.gov.in", must: true, time: "7 days" });
    const w = wizData.workers || "";
    if (w.includes("10") || w.includes("19") || w.includes("20")) r.push({ label: "ESI Registration", url: "https://esic.gov.in", must: true, time: "7 days" });
    if (w.includes("20")) r.push({ label: "Provident Fund (PF)", url: "https://epfindia.gov.in", must: true, time: "7 days" });
    const st = wizData.state;
    if (st && REGION_TRACKS[st]) REGION_TRACKS[st].extra.forEach(e => r.push({ label: e, must: false, time: "Varies" }));
    r.push({ label: "Shop & Establishment Act", must: true, time: "1–3 days", note: "Required in most states within 30 days" });
    return r;
  };

  const srx = useMemo(() => searchQ.trim().length > 1 ? SEARCH_INDEX.filter(i =>
    i.title.toLowerCase().includes(searchQ.toLowerCase()) ||
    i.body.toLowerCase().includes(searchQ.toLowerCase())
  ).slice(0, 8) : [], [searchQ]);

  const intelligenceCards = useMemo(() => {
    const selectedSchemes = SCHEMES.filter(s =>
      businessType ? `${s.name} ${s.who} ${s.cat}`.toLowerCase().includes(businessType.split(" ")[0].toLowerCase()) || s.cat !== "All" : true
    ).slice(0, 4);
    const stateExtras = region && REGION_TRACKS[region] ? REGION_TRACKS[region].extra : [];
    const baseContext = `${region || "your state"}${businessType ? ` + ${businessType}` : ""}`;

    return [
      {
        category: "Loans",
        title: "Capital readiness map",
        short: `${selectedSchemes.length || SCHEMES.length} public funding paths surfaced for ${baseContext}.`,
        eligibility: businessType ? `MSME founders in ${businessType}` : "MSME founders, women entrepreneurs, first-time business owners",
        benefits: "Working capital, collateral-light loans, subsidy discovery",
        documents: "Udyam, PAN, bank statement, project note",
        cta: "Open schemes",
        go: "schemes" as TabId,
      },
      {
        category: "Schemes",
        title: "Government support radar",
        short: region ? `${region} compliance and support signals are ready.` : "Select a state to unlock local support signals.",
        eligibility: "Registered micro and small businesses",
        benefits: "MSME support, local incentives, portal shortcuts",
        documents: "Aadhaar, Udyam, state registration, turnover proof",
        cta: "Review opportunities",
        go: "schemes" as TabId,
      },
      {
        category: "Registrations",
        title: "Launch compliance stack",
        short: stateExtras.length ? `${stateExtras.length} state-specific requirements detected.` : "Udyam, GST, Shops Act and sector permits prioritized.",
        eligibility: businessType || "Retail, food, services, manufacturing, online businesses",
        benefits: "Faster launch checklist with fewer missed filings",
        documents: "Address proof, identity proof, business proof",
        cta: "Build plan",
        go: "wizard" as TabId,
      },
      {
        category: "Restrictions",
        title: "Risk and permit scan",
        short: "AI flags sector permits, labor thresholds, and tax triggers before they become blockers.",
        eligibility: "Businesses hiring staff, selling regulated goods, or operating premises",
        benefits: "Lower legal risk and cleaner audit trail",
        documents: "License category, worker count, turnover estimate",
        cta: "Ask advisor",
        go: "chat" as TabId,
      },
      {
        category: "Hiring",
        title: "Employment opportunity lens",
        short: "Estimate worker compliance, ESI/PF triggers, and hiring readiness.",
        eligibility: "Teams from 1 to 20+ workers",
        benefits: "Payroll, rights, benefits, and social security readiness",
        documents: "Worker count, payroll range, location",
        cta: "View checklist",
        go: "checklist" as TabId,
      },
      {
        category: "Tax Benefits",
        title: "Tax calendar intelligence",
        short: "Upcoming GST, tax, license, and recurring obligations are organized by month.",
        eligibility: "GST-registered and turnover-threshold businesses",
        benefits: "Deadline clarity and compliance rhythm",
        documents: "GSTIN, invoices, monthly sales records",
        cta: "Open calendar",
        go: "calendar" as TabId,
      },
    ];
  }, [businessType, region]);

  const activeInsights = intelligenceCards.filter(card => card.category === insightTab);
  const readinessScore = Math.min(96, 44 + (region ? 18 : 0) + (businessType ? 18 : 0) + Math.round((checkDone / CHECKLIST.length) * 16));

  const downloadT = (t: typeof TEMPLATES[0]) => {
    const b = new Blob([t.content], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(b);
    a.download = `${t.name.replace(/ /g, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const TABS: { id: TabId; icon: string; label: string }[] = [
    { id: "home", icon: "🏠", label: T.home },
    { id: "checklist", icon: "✅", label: T.checklist },
    { id: "wizard", icon: "🧭", label: T.wizard },
    { id: "schemes", icon: "💰", label: T.schemes },
    { id: "learn", icon: "📖", label: T.learn },
    { id: "chat", icon: "💬", label: T.chat },
  ];

  // ── SECTIONS ──

  const NAV_ITEMS: { id: TabId; label: string }[] = [
    { id: "home", label: T.home },
    { id: "checklist", label: T.checklist },
    { id: "wizard", label: T.wizard },
    { id: "schemes", label: T.schemes },
    { id: "calendar", label: "Calendar" },
    { id: "learn", label: T.learn },
    { id: "chat", label: T.chat },
  ];

  const Home = () => (
    <PageShell className="flex flex-col gap-8 lg:gap-10">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="relative overflow-hidden rounded-[2rem] border border-cream/20 bg-[linear-gradient(135deg,hsl(24_38%_17%),hsl(21_55%_30%)_48%,hsl(42_87%_41%))] p-6 shadow-2xl shadow-earth/25 sm:p-8 lg:p-10 xl:p-12"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(250,221,154,0.28),transparent_26%),radial-gradient(circle_at_84%_18%,rgba(255,255,255,0.24),transparent_24%),linear-gradient(120deg,rgba(255,255,255,0.1),transparent_42%)]" />
        <div className="absolute right-8 top-10 hidden h-48 w-48 rounded-full border border-gold/20 bg-gold/10 blur-2xl lg:block" />
        <div className="relative grid gap-10 xl:grid-cols-[minmax(0,1.02fr)_minmax(460px,0.98fr)] xl:items-center">
          <div className="relative z-10 min-w-0">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-white/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-gold backdrop-blur">
              <BrainCircuit className="h-4 w-4" />
              AI Business Intelligence Platform
            </motion.div>
            <h1 className="max-w-4xl text-4xl font-black leading-[1.02] text-cream sm:text-5xl lg:text-6xl xl:text-7xl">
              Your AI strategist for Indian business launch, funding, and compliance.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-cream/82 sm:text-lg">
              VyapaarSaathi turns state rules, startup schemes, tax deadlines, and license requirements into a clear execution plan for founders, MSMEs, and operators.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <label className="rounded-2xl border border-gold/25 bg-white/10 p-2 backdrop-blur transition focus-within:border-gold focus-within:bg-white/15">
                <span className="px-2 text-[10px] font-black uppercase tracking-[0.18em] text-gold">Operating state</span>
                <select value={region} onChange={e => setRegion(e.target.value)}
                  className="app-select mt-1 w-full rounded-xl border-0 bg-white/95 p-2 text-sm font-bold text-[hsl(30_30%_8%)] outline-none">
                  <option value="" className="text-foreground">Select state</option>
                  {STATES.map(s => <option key={s} value={s} className="text-foreground">{s}</option>)}
                </select>
              </label>
              <label className="rounded-2xl border border-gold/25 bg-white/10 p-2 backdrop-blur transition focus-within:border-gold focus-within:bg-white/15">
                <span className="px-2 text-[10px] font-black uppercase tracking-[0.18em] text-gold">Business model</span>
                <select value={businessType} onChange={e => setBusinessType(e.target.value)}
                  className="app-select mt-1 w-full rounded-xl border-0 bg-white/95 p-2 text-sm font-bold text-[hsl(30_30%_8%)] outline-none">
                  <option value="" className="text-foreground">Select business type</option>
                  {BUSINESS_TYPES.map(b => <option key={b} value={b} className="text-foreground">{b}</option>)}
                </select>
              </label>
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <button onClick={() => setTab("wizard")} className="inline-flex items-center gap-2 rounded-2xl bg-gold px-5 py-3 text-sm font-black text-earth shadow-xl shadow-black/15 transition hover:-translate-y-1 hover:bg-cream focus:outline-none focus:ring-4 focus:ring-gold/35">
                Generate launch plan <ChevronRight className="h-4 w-4" />
              </button>
              <button onClick={() => setAssistantOpen(true)} className="inline-flex items-center gap-2 rounded-2xl border border-cream/25 bg-white/10 px-5 py-3 text-sm font-bold text-cream backdrop-blur transition hover:-translate-y-1 hover:bg-white/20 focus:outline-none focus:ring-4 focus:ring-cream/20">
                <Bot className="h-4 w-4" /> Talk to AI advisor
              </button>
            </div>
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.12 }} className="relative z-10 min-w-0 xl:pl-4">
            <div className="rounded-[1.75rem] border border-cream/20 bg-cream/12 p-4 shadow-2xl backdrop-blur-xl sm:p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-black text-cream">Founder intelligence cockpit</div>
                  <div className="text-xs text-cream/60">{region || "India"} intelligence graph</div>
                </div>
                <div className="rounded-full bg-sage/80 px-3 py-1 text-xs font-black text-cream">LIVE</div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-cream/15 bg-white/10 p-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-cream/70"><Zap className="h-4 w-4 text-gold" /> AI signal</div>
                  <div className="mt-2 text-2xl font-black text-cream">{readinessScore}%</div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-cream/55">Launch readiness</div>
                </div>
                {[
                  { label: "Funding paths", value: SCHEMES.length, icon: Landmark },
                  { label: "Compliance tasks", value: CHECKLIST.length, icon: FileCheck2 },
                  { label: "Portals linked", value: PORTALS.length, icon: Building2 },
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="rounded-2xl border border-cream/15 bg-white/10 p-3">
                      <Icon className="mb-3 h-4 w-4 text-gold" />
                      <div className="text-2xl font-black text-cream">{item.value}</div>
                      <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-cream/55">{item.label}</div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 h-44 rounded-2xl border border-cream/15 bg-earth/35 p-3">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={growthData}>
                    <defs>
                      <linearGradient id="growthFill" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--gold))" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="hsl(var(--gold))" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "rgba(255,255,255,0.55)", fontSize: 10 }} />
                    <Tooltip contentStyle={{ borderRadius: 14, border: "0", background: "hsl(var(--earth))", color: "hsl(var(--cream))" }} />
                    <Area type="monotone" dataKey="score" stroke="hsl(var(--gold))" strokeWidth={3} fill="url(#growthFill)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 rounded-2xl border border-cream/15 bg-white/10 p-4">
                <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-gold text-earth shadow-lg shadow-gold/20">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-cream">AI advisor preview</div>
                    <p className="mt-1 text-xs leading-5 text-cream/70">Select your state and business model to get scheme eligibility, license paths, and risk priorities.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>
      {/* Hero */}
      <div className="hidden relative overflow-hidden rounded-3xl bg-gradient-to-br from-earth via-clay to-amber p-6 shadow-2xl shadow-earth/20 sm:p-8 lg:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(238,190,83,0.28),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_48%)]" />
        <div className="relative grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-gold">
              <Sparkles className="h-3.5 w-3.5" />
              Legal-tech compliance coach
            </div>
            <h1 className="max-w-3xl whitespace-pre-line text-4xl font-black leading-tight text-cream sm:text-5xl lg:text-6xl">
              {T.heroTitle}{"\n"}<span className="text-gold">{T.heroHL}</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-cream/85 sm:text-lg">{T.heroSub}</p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <select value={region} onChange={e => setRegion(e.target.value)}
            className="w-full rounded-xl border border-gold/30 bg-white/10 p-3 text-sm font-semibold text-cream shadow-inner outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/40">
            <option value="" className="text-foreground">— {T.statePH} —</option>
            {STATES.map(s => <option key={s} value={s} className="text-foreground">{s}</option>)}
          </select>
          <select value={businessType} onChange={e => setBusinessType(e.target.value)}
            className="w-full rounded-xl border border-gold/30 bg-white/10 p-3 text-sm font-semibold text-cream shadow-inner outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/40">
            <option value="" className="text-foreground">— {T.bizPH} —</option>
            {BUSINESS_TYPES.map(b => <option key={b} value={b} className="text-foreground">{b}</option>)}
          </select>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={() => setTab("wizard")} className="inline-flex items-center gap-2 rounded-xl bg-gold px-5 py-3 text-sm font-black text-earth shadow-lg shadow-black/15 transition hover:-translate-y-0.5 hover:bg-cream">
                Start plan <ChevronRight className="h-4 w-4" />
              </button>
              <button onClick={() => setTab("chat")} className="inline-flex items-center gap-2 rounded-xl border border-cream/25 bg-white/10 px-5 py-3 text-sm font-bold text-cream transition hover:-translate-y-0.5 hover:bg-white/20">
                Ask AI coach
              </button>
            </div>
          </div>
          <div className="rounded-2xl border border-cream/15 bg-cream/10 p-5 shadow-2xl backdrop-blur md:p-6">
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {[
                { label: "Checklist progress", value: `${checkDone}/${CHECKLIST.length}`, tone: "text-gold" },
                { label: "Verified schemes", value: SCHEMES.length, tone: "text-cream" },
                { label: "Official portals", value: PORTALS.length, tone: "text-cream" },
              ].map(item => (
                <div key={item.label} className="rounded-2xl border border-cream/15 bg-white/10 p-4">
                  <div className={`text-3xl font-black ${item.tone}`}>{item.value}</div>
                  <div className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-cream/65">{item.label}</div>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-2xl bg-earth/35 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-bold text-cream">
                <ShieldCheck className="h-4 w-4 text-gold" />
                Saved locally
              </div>
              <p className="text-sm leading-6 text-cream/75">{T.securityNote}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Save + security */}
      <div className="flex justify-between items-center flex-wrap gap-2">
        <button onClick={saveProgress} className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-1.5 border transition-colors ${savedBadge ? "bg-sage text-cream border-sage" : "bg-muted text-foreground border-border"}`}>
          {savedBadge ? <>✓ {T.savedBadge}</> : <>💾 {T.saveProgress}</>}
        </button>
        <span className="text-xs text-muted-foreground flex items-center gap-1">🔒 {T.securityNote}</span>
      </div>

      {/* Search */}
      <div className="relative mx-auto w-full max-w-4xl">
        <input value={searchQ} onChange={e => setSearchQ(e.target.value)} onFocus={() => setSearchOpen(true)} onBlur={() => setTimeout(() => setSearchOpen(false), 180)}
          placeholder={T.searchPH} className="w-full rounded-2xl border border-border bg-card py-4 pl-12 pr-11 text-sm shadow-xl shadow-earth/5 outline-none transition focus:border-amber focus:ring-4 focus:ring-amber/20 sm:text-base" />
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-amber" />
        {searchQ && <button onClick={() => setSearchQ("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">✕</button>}
        {!searchQ && (
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {["GST registration", "MSME loan", "FSSAI license", "startup subsidy"].map(term => (
              <button key={term} onMouseDown={e => e.preventDefault()} onClick={() => { setSearchQ(term); setSearchOpen(true); }}
                className="rounded-full border border-border bg-card/80 px-3 py-1.5 text-xs font-bold text-muted-foreground shadow-sm transition hover:border-amber hover:text-earth">
                Trending: {term}
              </button>
            ))}
          </div>
        )}
        {searchOpen && searchQ.length > 1 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="absolute top-full mt-2 left-0 right-0 bg-card rounded-2xl border border-border shadow-2xl shadow-earth/15 z-50 max-h-80 overflow-y-auto">
            <div className="border-b border-border p-3 text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">Intelligent results</div>
            {srx.length === 0 ? <div className="p-5 text-sm text-muted-foreground">No exact match yet. Try loans, GST, license, compliance, or schemes.</div>
              : srx.map((r, i) => (
                <div key={i} onClick={() => { setTab(r.go as TabId); setSearchQ(""); }}
                  className="p-4 border-b border-border cursor-pointer hover:bg-muted transition-colors">
                  <div className="flex gap-2 items-center mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${getTagClasses(r.type)}`}>{r.type}</span>
                    <span className="font-bold text-sm">{r.title}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{r.body.slice(0, 80)}…</div>
                </div>
              ))}
          </motion.div>
        )}
      </div>

      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="vs-card overflow-hidden p-5 md:p-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-amber/15 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-amber">
                <Target className="h-3.5 w-3.5" /> State business intelligence
              </div>
              <h2 className="text-2xl font-black text-earth md:text-3xl">Personalized opportunity map</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                {region && businessType
                  ? `AI-ready view for ${businessType} founders in ${region}: funding, permits, registrations, hiring, and tax priorities.`
                  : "Choose a state and business type above to unlock a sharper business intelligence brief."}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-paper/70 p-4 text-center">
              <div className="text-3xl font-black text-earth">{readinessScore}</div>
              <div className="text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground">Ecosystem score</div>
            </div>
          </div>
          <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
            {insightCategories.map(cat => {
              const Icon = cat.icon;
              return (
                <button key={cat.id} onClick={() => setInsightTab(cat.id)}
                  className={`inline-flex whitespace-nowrap items-center gap-2 rounded-full border px-3 py-2 text-xs font-black transition ${insightTab === cat.id ? "border-earth bg-earth text-cream shadow-lg shadow-earth/10" : "border-border bg-card text-muted-foreground hover:border-amber hover:text-earth"}`}>
                  <Icon className="h-3.5 w-3.5" />
                  {cat.id}
                </button>
              );
            })}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={insightTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="grid gap-4 md:grid-cols-2">
              {activeInsights.map(card => {
                const category = insightCategories.find(c => c.id === card.category) || insightCategories[0];
                const Icon = category.icon;
                return (
                  <div key={card.title} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                    <div className={`mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br ${category.accent} text-cream shadow-lg shadow-earth/10`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-black text-earth">{card.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{card.short}</p>
                    <div className="mt-4 grid gap-3 text-xs">
                      <div><span className="font-black text-earth">Eligibility:</span> <span className="text-muted-foreground">{card.eligibility}</span></div>
                      <div><span className="font-black text-earth">Benefits:</span> <span className="text-muted-foreground">{card.benefits}</span></div>
                      <div><span className="font-black text-earth">Documents:</span> <span className="text-muted-foreground">{card.documents}</span></div>
                    </div>
                    <button onClick={() => setTab(card.go)} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-black text-primary-foreground transition hover:-translate-y-0.5 hover:shadow-lg">
                      {card.cta} <ArrowUpRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="grid gap-4">
          <div className="vs-card p-5 md:p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-earth">Growth intelligence</h3>
                <p className="text-xs text-muted-foreground">Funding and readiness signals</p>
              </div>
              <LineChartIcon className="h-5 w-5 text-amber" />
            </div>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ecosystemData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                  <Tooltip contentStyle={{ borderRadius: 14, border: "1px solid hsl(var(--border))" }} />
                  <Bar dataKey="value" radius={[10, 10, 0, 0]} fill="hsl(var(--amber))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="vs-card bg-gradient-to-br from-card to-paper/70 p-5 md:p-6">
            <div className="flex items-start gap-4">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gold blur-lg opacity-50" />
                <div className="relative grid h-12 w-12 place-items-center rounded-full bg-earth text-gold">
                  <BrainCircuit className="h-6 w-6" />
                </div>
              </div>
              <div>
                <h3 className="font-black text-earth">AI recommendation</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {region && businessType
                    ? `Prioritize Udyam, state licenses for ${region}, and funding discovery before hiring.`
                    : "Start by choosing your state and sector. The advisor will personalize registrations, permits, tax triggers, and schemes."}
                </p>
                <button onClick={() => setAssistantOpen(true)} className="mt-4 inline-flex items-center gap-2 text-sm font-black text-amber">
                  Ask for strategy <MessageSquareText className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Quick nav */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { icon: "🧭", label: T.wizard, sub: "Step-by-step guide", go: "wizard" as TabId },
          { icon: "💰", label: T.schemes, sub: `${SCHEMES.length} schemes`, go: "schemes" as TabId },
          { icon: "✅", label: T.checklist, sub: `${checkDone}/${CHECKLIST.length} done`, go: "checklist" as TabId },
          { icon: "💬", label: T.chat, sub: "Ask in plain language", go: "chat" as TabId },
        ].map(({ icon, label, sub, go }) => (
          <div key={go} onClick={() => setTab(go)} className="vs-card flex h-full cursor-pointer flex-col p-5 md:p-6">
            <div className="mb-4 text-3xl">{icon}</div>
            <div className="text-base font-bold">{label}</div>
            <div className="mt-1 text-sm font-semibold text-amber">{sub}</div>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div className="vs-card p-5 md:p-6">
        <div className="flex justify-between mb-2.5">
          <span className="font-bold">{T.progressLabel}</span>
          <span className="text-sm text-amber font-bold">{checkDone}/{CHECKLIST.length}</span>
        </div>
        <div className="bg-muted rounded-md h-2.5 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-sage to-amber rounded-md transition-all duration-500" style={{ width: `${(checkDone / CHECKLIST.length) * 100}%` }} />
        </div>
        <div className="text-sm text-muted-foreground mt-2">
          {checkDone === 0 ? T.startJourney : checkDone === CHECKLIST.length ? T.fullyCompliant : `${CHECKLIST.length - checkDone} ${T.remaining}`}
        </div>
      </div>

      {/* What's New */}
      <div>
        <h2 className="text-lg font-bold text-earth mb-3 flex items-center gap-2">
          🆕 {T.newSection}
          <span className="text-xs bg-amber/20 text-amber px-2 py-0.5 rounded-full font-bold">VERIFIED</span>
        </h2>
        <div className="grid gap-4 lg:grid-cols-3">
        {WHATS_NEW.map((n, i) => (
          <div key={i} className="vs-card h-full p-4 border-l-4 border-l-amber">
            <div className="flex justify-between mb-1 flex-wrap gap-1">
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${getTagClasses(n.tag)}`}>{n.tag}</span>
              <span className="text-xs text-muted-foreground">{n.date}</span>
            </div>
            <div className="font-bold text-sm mb-1">{n.title}</div>
            <div className="text-xs text-muted-foreground leading-relaxed">{n.body}</div>
          </div>
        ))}
        </div>
      </div>

      {/* Portals */}
      <div>
        <h2 className="text-lg font-bold text-earth mb-3">🔗 Official Government Portals</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PORTALS.map((p, i) => (
            <a key={i} href={p.url} target="_blank" rel="noopener noreferrer">
              <div className="vs-card h-full p-4">
                <div className="text-xl mb-1">{p.icon}</div>
                <div className="font-bold text-xs mb-0.5">{p.name}</div>
                <div className="text-xs text-sky">{p.desc}</div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Feedback */}
      <div className="vs-card p-5 md:p-6">
        <h2 className="text-lg font-bold mb-1">{T.feedbackTitle}</h2>
        <p className="text-sm text-muted-foreground mb-4">{T.feedbackSub}</p>
        {!feedback.submitted ? (
          <>
            <div className="flex gap-1 mb-3">
              {[1, 2, 3, 4, 5].map(s => (
                <button key={s} onClick={() => setFeedback(f => ({ ...f, rating: s }))} className={`text-2xl transition-opacity ${feedback.rating >= s ? "opacity-100" : "opacity-25"}`}>⭐</button>
              ))}
            </div>
            <textarea value={feedback.comment} onChange={e => setFeedback(f => ({ ...f, comment: e.target.value }))} placeholder="What could be better?" rows={3}
              className="w-full p-3 rounded-lg border border-border text-sm resize-none mb-3" />
            <button onClick={() => setFeedback(f => ({ ...f, submitted: true }))} className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold">Submit Feedback</button>
          </>
        ) : <div className="text-center p-3 text-sage font-bold">✅ Thank you! Your feedback helps improve this guide.</div>}
      </div>
    </PageShell>
  );

  const ChecklistSection = () => (
    <PageShell>
      <SectionHeader title="3-Step Starter Checklist" subtitle="Tap each item for full details. Tick when done." />
      <div className="grid gap-5 lg:grid-cols-3">
      {[1, 2, 3].map(s => (
        <div key={s} className="min-w-0">
          <div className="flex items-center gap-2.5 mb-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-cream font-bold text-sm ${s === 1 ? "bg-sage" : s === 2 ? "bg-amber" : "bg-accent"}`}>
              {CHECKLIST.filter(c => c.step === s).every(c => done[c.id]) ? "✓" : s}
            </div>
            <div className="font-bold text-earth">Step {s}: {["Register", "License & Tax", "Ongoing Compliance"][s - 1]}</div>
          </div>
          <div className="flex flex-col gap-3">
          {CHECKLIST.filter(c => c.step === s).map(c => (
            <div key={c.id} className={`vs-card p-4 border-l-4 md:p-5 ${done[c.id] ? "border-l-sage" : "border-l-border"}`}>
              <div className="flex gap-3">
                <button onClick={() => setDone(d => ({ ...d, [c.id]: !d[c.id] }))}
                  className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${done[c.id] ? "bg-sage border-sage" : "bg-card border-border"}`}>
                  {done[c.id] && <span className="text-cream text-xs font-bold">✓</span>}
                </button>
                <div className="flex-1">
                  <div className={`font-bold text-sm mb-1 ${done[c.id] ? "text-sage line-through" : ""}`}>{c.title}</div>
                  <div className="text-xs text-muted-foreground mb-2">{c.summary}</div>
                  <div className="flex gap-2 flex-wrap items-center">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${getTagClasses(c.tag)}`}>{c.tag}</span>
                    <span className="text-xs text-muted-foreground">⏱ {c.time}</span>
                    <span className="text-xs text-sage">💰 {c.cost}</span>
                    <button onClick={() => setExpandedChecklist(e => ({ ...e, [c.id]: !e[c.id] }))} className="text-xs text-sky font-semibold underline">
                      {expandedChecklist[c.id] ? "Hide details" : "How to do this →"}
                    </button>
                  </div>
                </div>
              </div>
              {expandedChecklist[c.id] && (
                <div className="mt-3 p-3 bg-paper rounded-lg text-xs leading-relaxed">
                  <p className="mb-2">{c.desc}</p>
                  {c.url && c.url !== "#" && (
                    <a href={c.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 bg-sky text-cream px-3 py-1.5 rounded-lg text-xs font-bold">
                      🔗 Open Official Portal ↗
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
          </div>
        </div>
      ))}
      </div>
      {region && REGION_TRACKS[region] && (
        <div className="bg-sky/10 border border-sky/30 rounded-xl p-5 mt-2">
          <div className="font-bold text-sm text-sky mb-2.5">📍 {region}-Specific Requirements</div>
          {REGION_TRACKS[region].extra.map((e, i) => (
            <div key={i} className="text-sm py-1.5 border-b border-border flex gap-2.5">
              <span className="text-sky">›</span>{e}
            </div>
          ))}
          <div className="mt-3 text-sm text-sky">📞 State Helpline: <strong>{REGION_TRACKS[region].helpline}</strong></div>
        </div>
      )}
    </PageShell>
  );

  const Wizard = () => {
    const step = WIZARD_STEPS[wizStep];
    const total = WIZARD_STEPS.length;
    return (
      <PageShell className="max-w-5xl">
        <SectionHeader title={T.wizardTitle} subtitle={T.wizardSub} />
        <div className="text-xs text-amber font-bold mb-2.5">{T.stepOf.replace("{n}", String(wizStep + 1)).replace("{total}", String(total))}</div>
        <div className="flex gap-1.5 mb-5">
          {WIZARD_STEPS.map((_, i) => (
            <div key={i} className={`flex-1 h-1.5 rounded-full transition-colors ${i <= wizStep ? "bg-amber" : "bg-muted"}`} />
          ))}
        </div>

        <div className="vs-card p-6 mb-4 animate-slide-in md:p-8">
          <div className="text-3xl mb-2.5">{step.icon}</div>
          <h2 className="text-xl font-bold text-earth mb-6 md:text-2xl">{step.title}</h2>

          {"fields" in step && step.fields?.map(f => (
            <div key={f.id} className="mb-5">
              <label className="block font-bold text-sm mb-1.5 text-earth">
                {f.label}
                <span className={`ml-1.5 text-xs font-normal ${f.required ? "text-destructive" : "text-muted-foreground"}`}>
                  ({f.required ? T.required : T.optional})
                </span>
              </label>
              <select value={wizData[f.id] || ""} onChange={e => { setWizData(d => ({ ...d, [f.id]: e.target.value })); setWizErrors(er => ({ ...er, [f.id]: null })); }}
                className={`app-select w-full p-3 rounded-lg border text-sm font-semibold text-foreground ${wizErrors[f.id] ? "border-destructive bg-destructive/5" : "border-border bg-card"}`}>
                <option value="">— Select —</option>
                {f.options.map(o => <option key={o}>{o}</option>)}
              </select>
              {wizErrors[f.id] && <div className="text-destructive text-xs mt-1 flex items-center gap-1">⚠ {wizErrors[f.id]}</div>}
            </div>
          ))}

          {"summary" in step && step.summary && (
            <div>
              <div className="font-bold text-sm text-earth mb-3">Based on your answers, here's what you need:</div>
              {wizRecs().map((r, i) => (
                <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border mb-2 ${r.must ? "border-amber bg-amber/5" : "border-border"}`}>
                  <span className="text-lg mt-0.5">{r.must ? "✅" : "📌"}</span>
                  <div className="flex-1">
                    <div className="font-bold text-sm">{r.label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">⏱ {r.time}</div>
                    {r.note && <div className="text-xs text-sky mt-1">{r.note}</div>}
                  </div>
                  {r.must && <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full font-bold whitespace-nowrap">REQUIRED</span>}
                </div>
              ))}
            </div>
          )}

          {"final" in step && step.final && (
            <div className="text-center">
              <div className="text-5xl mb-3">🎉</div>
              <h2 className="text-xl font-black text-earth mb-2">You're Ready to Start!</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">Your personalised checklist is ready. Use AI Help if you get stuck.</p>
              <div className="flex gap-2.5">
                <button onClick={() => setTab("checklist")} className="flex-1 py-3 rounded-xl bg-sage text-cream text-sm font-semibold">Go to Checklist</button>
                <button onClick={() => { setWizStep(0); setWizData({}); setWizErrors({}); }} className="flex-1 py-3 rounded-xl bg-muted text-sm font-semibold">Start Over</button>
              </div>
            </div>
          )}
        </div>

        {!("final" in step && step.final) && (
          <div className="flex gap-2.5">
            {wizStep > 0 && <button onClick={() => setWizStep(s => s - 1)} className="py-3 px-5 rounded-xl bg-muted text-sm font-semibold">← Back</button>}
            <button onClick={() => { if (validateWizStep()) setWizStep(s => s + 1); }} className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold">
              {wizStep === WIZARD_STEPS.length - 2 ? "See My Plan →" : "Next →"}
            </button>
          </div>
        )}

        {/* Templates */}
        <div className="mt-8">
          <h2 className="text-lg font-bold text-earth mb-1.5">📂 {T.templateTitle}</h2>
          <p className="text-sm text-muted-foreground mb-4">{T.templateSub}</p>
          <div className="grid gap-3 md:grid-cols-2">
          {TEMPLATES.map((t, i) => (
            <div key={i} className="vs-card flex items-center gap-3 p-4">
              <div className="text-2xl">{t.icon}</div>
              <div className="flex-1">
                <div className="font-bold text-sm">{t.name}</div>
                <span className="text-xs bg-sky/20 text-sky px-2 py-0.5 rounded-full font-bold">{t.type}</span>
              </div>
              <button onClick={() => setSelTemplate(t)} className="px-3 py-1.5 rounded-lg bg-amber/20 text-clay text-xs font-semibold">👁</button>
              <button onClick={() => downloadT(t)} className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold">⬇</button>
            </div>
          ))}
          </div>
        </div>
      </PageShell>
    );
  };

  const SchemesSection = () => (
    <PageShell>
      <h1 className="text-2xl font-black text-earth mb-1">Government Schemes</h1>
      <p className="text-sm text-muted-foreground mb-4">Loans, grants & subsidies — verified official sources only</p>
      <div className="bg-sage/10 border border-sage/25 rounded-lg p-3 mb-4 text-xs text-sage">
        🔒 All schemes listed here are FREE to apply. If anyone charges a fee, it is a scam.
      </div>
      <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
        {["All", ...new Set(SCHEMES.map(s => s.cat))].map(cat => (
          <button key={cat} onClick={() => setSchemeFilter(cat)}
            className={`px-4 py-1.5 rounded-full text-xs whitespace-nowrap font-semibold border transition-colors ${schemeFilter === cat ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border"}`}>
            {cat}
          </button>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
      {SCHEMES.filter(s => schemeFilter === "All" || s.cat === schemeFilter).map((s, i) => (
        <div key={i} className="vs-card h-full p-5 md:p-6">
          <div className="flex gap-3">
            <div className="text-3xl flex-shrink-0">{s.icon}</div>
            <div className="flex-1">
              <div className="flex justify-between flex-wrap gap-1 mb-1.5">
                <div className="font-extrabold">{s.name}</div>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${getTagClasses(s.cat)}`}>{s.cat}</span>
              </div>
              <div className="text-lg font-bold text-amber mb-2">{s.amount}</div>
              <div className="text-sm text-muted-foreground mb-1">👤 <strong>Who:</strong> {s.who}</div>
              <div className="text-sm text-muted-foreground mb-3">📋 <strong>Apply:</strong> {s.how}</div>
              <a href={s.url} target="_blank" rel="noopener noreferrer">
                <button className="px-4 py-2 rounded-lg bg-sky text-cream text-sm font-semibold">Apply Now →</button>
              </a>
            </div>
          </div>
        </div>
      ))}
      </div>
    </PageShell>
  );

  const CalendarSection = () => {
    const cm = CALENDAR[calMonth];
    const filteredTasks = calFilter === "all" ? cm.tasks : cm.tasks.filter(t => t.type === calFilter);
    return (
      <PageShell>
        <h1 className="text-2xl font-black text-earth mb-1">Tax & Compliance Calendar</h1>
        <p className="text-sm text-muted-foreground mb-4">Never miss a deadline</p>
        <div className="flex gap-1.5 overflow-x-auto pb-3 mb-4 scrollbar-hide">
          {CALENDAR.map((m, i) => (
            <button key={i} onClick={() => setCalMonth(i)}
              className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-semibold border transition-colors ${calMonth === i ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border"}`}>
              {m.month.slice(0, 3)}
            </button>
          ))}
        </div>
        <div className="flex gap-2 mb-4 flex-wrap">
          {["all", "gst", "tax", "license", "other"].map(f => (
            <button key={f} onClick={() => setCalFilter(f)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${calFilter === f ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <h2 className="text-lg font-bold text-earth mb-3">{cm.month} 2025</h2>
        {filteredTasks.length === 0 ? (
          <div className="text-center p-8 text-muted-foreground text-sm">No tasks for this filter in {cm.month}.</div>
        ) : <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{filteredTasks.map((t, i) => (
          <div key={i} className={`vs-card flex gap-3 items-center border-l-4 p-4 ${t.type === "gst" ? "border-l-amber" : t.type === "tax" ? "border-l-accent" : t.type === "license" ? "border-l-sky" : "border-l-sage"}`}>
            <div className="text-center flex-shrink-0">
              <div className="text-lg font-black text-amber">{t.d}</div>
              <div className="text-xs text-muted-foreground">DUE</div>
            </div>
            <div className="flex-1">
              <div className="font-bold text-sm mb-1">{t.t}</div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${getTagClasses(t.type)}`}>{t.type.toUpperCase()}</span>
            </div>
          </div>
        ))}</div>}
      </PageShell>
    );
  };

  const LearnSection = () => (
    <PageShell>
      <SectionHeader title="Learn" />
      <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">

      {/* FAQ */}
      <div>
        <h2 className="text-lg font-bold text-earth mb-3">❓ FAQ & Common Pitfalls</h2>
        {FAQ.map((f, i) => (
          <div key={i} className="vs-card mb-2.5 overflow-hidden">
            <div onClick={() => setFaqOpen(faqOpen === i ? null : i)} className="p-4 flex justify-between items-center cursor-pointer">
              <div className="font-semibold text-sm flex-1 pr-3">{f.q}</div>
              <span className={`text-amber transition-transform ${faqOpen === i ? "rotate-180" : ""}`}>↓</span>
            </div>
            {faqOpen === i && <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border pt-3">{f.a}</div>}
          </div>
        ))}
      </div>

      {/* Glossary */}
      <div>
        <h2 className="text-lg font-bold text-earth mb-3">📚 Glossary</h2>
        <input value={glossSearch} onChange={e => setGlossSearch(e.target.value)} placeholder="Search terms…"
          className="w-full p-3 rounded-lg border border-border text-sm mb-3" />
        {GLOSSARY.filter(g => !glossSearch || g.term.toLowerCase().includes(glossSearch.toLowerCase()) || g.def.toLowerCase().includes(glossSearch.toLowerCase())).map((g, i) => (
          <div key={i} className="vs-card mb-2.5 p-4">
            <div className="font-extrabold text-sm text-amber mb-1">{g.term}</div>
            <div className="text-sm text-muted-foreground leading-relaxed">{g.def}</div>
          </div>
        ))}
      </div>

      {/* Quiz */}
      <div className="lg:col-span-2">
        <h2 className="text-lg font-bold text-earth mb-3">🧠 Knowledge Quiz</h2>
        {!qd ? (
          <div className="vs-card p-6">
            <div className="flex justify-between mb-3">
              <span className="text-sm text-muted-foreground">Question {qi + 1} of {QUIZ.length}</span>
              <span className="text-sm text-amber font-bold">Score: {qs}</span>
            </div>
            <div className="bg-muted rounded h-1 mb-5">
              <div className="h-full bg-amber rounded transition-all" style={{ width: `${(qi / QUIZ.length) * 100}%` }} />
            </div>
            <div className="font-bold leading-relaxed mb-5">{QUIZ[qi].q}</div>
            <div className="flex flex-col gap-2.5">
              {QUIZ[qi].o.map((opt, i) => {
                let cls = "border-border bg-card";
                if (qa !== null) {
                  if (i === QUIZ[qi].a) cls = "border-sage bg-sage/10 text-sage";
                  else if (i === qa) cls = "border-destructive bg-destructive/5 text-destructive";
                }
                return (
                  <button key={i} onClick={() => handleQ(i)}
                    className={`p-3 rounded-lg border-2 text-sm text-left font-medium transition-all ${cls} ${qa === null ? "cursor-pointer hover:border-amber" : "cursor-default"}`}>
                    {String.fromCharCode(65 + i)}. {opt}
                  </button>
                );
              })}
            </div>
            {qa !== null && <div className="mt-4 p-3 bg-sky/10 border border-sky/25 rounded-lg text-sm text-sky leading-relaxed">💡 {QUIZ[qi].exp}</div>}
            {qa !== null && <button onClick={nextQ} className="mt-4 w-full py-3 rounded-lg bg-primary text-primary-foreground text-sm font-bold">{qi < QUIZ.length - 1 ? "Next →" : "See Results →"}</button>}
          </div>
        ) : (
          <div className="vs-card p-6 text-center">
            <div className="text-5xl mb-2.5">{qs >= 4 ? "🏆" : qs >= 2 ? "📚" : "💪"}</div>
            <div className="text-2xl font-black text-earth mb-2">{qs}/{QUIZ.length}</div>
            <p className="text-sm text-muted-foreground mb-4">{qs >= 4 ? "Excellent!" : qs >= 2 ? "Good effort!" : "Keep learning!"}</p>
            <div className="mb-4">{qr.map((r, i) => <span key={i} className="text-xl mx-0.5">{r.correct ? "✅" : "❌"}</span>)}</div>
            <button onClick={resetQ} className="px-7 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-semibold">Try Again</button>
          </div>
        )}
      </div>
      </div>
    </PageShell>
  );

  const ChatSection = () => (
    <div className="mx-auto flex h-[calc(100vh-68px)] w-full max-w-5xl flex-col overflow-hidden rounded-none bg-card shadow-none md:my-8 md:h-[calc(100vh-136px)] md:rounded-3xl md:border md:border-border md:shadow-2xl md:shadow-earth/10">
      <div className="px-4 pt-3 bg-paper border-b border-border md:px-6 md:pt-5">
        <div className="text-xs font-bold text-muted-foreground mb-2 tracking-wider">QUICK QUESTIONS</div>
        <div className="flex gap-2 overflow-x-auto pb-2.5 scrollbar-hide">
          {["How to register my business?", "Do I need GST?", "Best loan scheme for me?", "Which licenses do I need?"].map(q => (
            <button key={q} onClick={() => sendChat(q)} className="whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold bg-amber/20 text-clay border border-amber/30">{q}</button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5 md:p-6">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-fade-up`}>
            {m.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-earth to-amber flex items-center justify-center text-base flex-shrink-0 mr-2.5 mt-0.5">🌿</div>
            )}
            <div className={`max-w-[82%] md:max-w-[68%] px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${m.role === "user"
              ? "rounded-2xl rounded-br-sm bg-primary text-primary-foreground"
              : "rounded-2xl rounded-bl-sm bg-card border border-border shadow-sm"}`}>
              {m.role === "assistant" ? (
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              ) : m.content}
            </div>
          </div>
        ))}
        {aiLoading && (
          <div className="flex items-end gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-earth to-amber flex items-center justify-center text-base">🌿</div>
            <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-card border border-border">
              <span className="typing-dot" /><span className="typing-dot ml-1" /><span className="typing-dot ml-1" />
            </div>
          </div>
        )}
        <div ref={msgEnd} />
      </div>
      <div className="p-3 bg-card border-t border-border flex gap-2.5 md:p-5">
        <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendChat()}
          placeholder="Ask about laws, schemes, licenses…" className="flex-1 py-3 px-4 rounded-full border border-border text-sm bg-paper" />
        <button onClick={() => sendChat()} disabled={aiLoading || !chatInput.trim()}
          className={`w-11 h-11 rounded-full flex items-center justify-center text-xl text-cream transition-colors ${chatInput.trim() ? "bg-primary" : "bg-muted"}`}>↑</button>
      </div>
    </div>
  );

  const renderSection = () => {
    switch (tab) {
      case "home":
        return Home();
      case "checklist":
        return ChecklistSection();
      case "wizard":
        return Wizard();
      case "schemes":
        return SchemesSection();
      case "calendar":
        return CalendarSection();
      case "learn":
        return LearnSection();
      case "chat":
        return ChatSection();
      default:
        return Home();
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="ambient-drift absolute left-[-8rem] top-24 h-80 w-80 rounded-full bg-gold/15 blur-3xl" />
        <div className="ambient-drift absolute right-[-10rem] top-32 h-96 w-96 rounded-full bg-sky/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(120,90,48,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(120,90,48,0.06)_1px,transparent_1px)] bg-[size:44px_44px]" />
      </div>
      {/* Desktop header */}
      <header className="sticky top-0 z-50 hidden border-b border-border/80 bg-background/90 shadow-sm backdrop-blur-xl md:block">
        <div className="mx-auto grid h-auto min-h-20 max-w-7xl grid-cols-[minmax(210px,auto)_minmax(0,1fr)_auto] items-center gap-4 px-5 py-3 lg:gap-6 lg:px-8">
          <button onClick={() => setTab("home")} className="flex min-w-[210px] flex-shrink-0 items-center gap-3 text-left">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,hsl(24_38%_17%),hsl(21_55%_30%),hsl(42_87%_41%))] text-cream shadow-lg shadow-earth/15">
              <BriefcaseBusiness className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="truncate text-lg font-black leading-none text-earth">{T.appName}</div>
              <div className="mt-1 truncate text-[10px] font-bold uppercase tracking-[0.2em] text-amber">{T.tagline}</div>
            </div>
          </button>
          <nav className="flex min-w-0 items-center justify-center gap-1 overflow-x-auto rounded-2xl bg-card/40 p-1">
            {NAV_ITEMS.map(item => {
              const Icon = TAB_ICONS[item.id];
              return (
                <button key={item.id} onClick={() => setTab(item.id)}
                  className={`inline-flex flex-shrink-0 items-center gap-2 rounded-xl px-2.5 py-2 text-sm font-bold transition xl:px-3 ${tab === item.id ? "bg-primary text-primary-foreground shadow-lg shadow-earth/15" : "text-muted-foreground hover:bg-card hover:text-earth"}`}>
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span className="hidden 2xl:inline">{item.label}</span>
                </button>
              );
            })}
          </nav>
          <div className="flex flex-shrink-0 items-center justify-end gap-2 lg:gap-3">
            <select value={lang} onChange={e => setLang(e.target.value as LangKey)}
              className="app-select rounded-xl border border-border bg-card px-3 py-2 text-xs font-black text-foreground shadow-sm outline-none transition focus:border-amber focus:ring-2 focus:ring-amber/20">
              <option value="en">EN</option>
              <option value="hi">HI</option>
              <option value="mr">MR</option>
              <option value="ta">TA</option>
              <option value="te">TE</option>
            </select>
            <div className="hidden min-w-28 rounded-xl border border-border bg-card px-3 py-2 shadow-sm lg:block">
              <div className="flex items-center justify-between text-xs font-black text-earth">
                <span>{checkDone}/{CHECKLIST.length}</span>
                <span className="text-amber">done</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-gradient-to-r from-sage to-amber" style={{ width: `${(checkDone / CHECKLIST.length) * 100}%` }} />
              </div>
            </div>
            <button onClick={() => setAssistantOpen(true)} className="inline-flex items-center gap-2 rounded-xl bg-amber px-3 py-2 text-xs font-black text-earth shadow-lg shadow-amber/20 transition hover:-translate-y-0.5" aria-label="Open AI advisor">
              <Bot className="h-4 w-4" />
              AI
            </button>
            <button onClick={() => setDarkMode(v => !v)} className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-card text-muted-foreground shadow-sm transition hover:text-earth" aria-label="Toggle dark mode">
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-card text-muted-foreground shadow-sm transition hover:text-earth" aria-label="Settings">
              <Settings className="h-4 w-4" />
            </button>
            <button onClick={() => signOut()} className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-earth/15" aria-label="Sign out">
              <UserCircle2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-earth to-clay p-3 shadow-lg md:hidden">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gold to-accent flex items-center justify-center text-lg">🌿</div>
          <div>
            <div className="font-black text-lg text-cream leading-none">{T.appName}</div>
            <div className="text-[8px] text-gold/80 tracking-widest mt-0.5">{T.tagline}</div>
          </div>
          <div className="ml-auto flex gap-2 items-center">
            <button onClick={() => setDarkMode(v => !v)} className="grid h-8 w-8 place-items-center rounded-lg border border-gold/30 bg-white/10 text-cream" aria-label="Toggle dark mode">
              {darkMode ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            </button>
            <select value={lang} onChange={e => setLang(e.target.value as LangKey)}
              className="app-select rounded-lg border border-gold/30 bg-card px-2 py-1 text-[10px] font-bold text-foreground">
              <option value="en">EN</option>
              <option value="hi">हिंदी</option>
              <option value="mr">मराठी</option>
              <option value="ta">தமிழ்</option>
              <option value="te">తెలుగు</option>
            </select>
            <div className="text-right">
              <span className="text-[10px] text-gold font-bold">{checkDone}/{CHECKLIST.length} ✓</span>
              <span className="block text-[8px] text-cream/50">compliance</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className={`min-h-[calc(100vh-80px)] ${tab === "chat" ? "overflow-hidden pb-0" : "pb-20 md:pb-0"}`}>
        <div className="animate-fade-up" key={tab}>{renderSection()}</div>
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-border bg-card shadow-[0_-4px_20px_rgba(0,0,0,0.08)] md:hidden">
        {NAV_ITEMS.map(t => {
          const Icon = TAB_ICONS[t.id];
          return (
            <button key={t.id} onClick={() => setTab(t.id)} className={`flex-1 py-2 flex flex-col items-center gap-0.5 transition-colors ${tab === t.id ? "text-earth" : "text-muted-foreground"}`}>
              <Icon className="h-5 w-5" />
              <span className={`text-[8px] tracking-wider ${tab === t.id ? "font-extrabold" : "font-normal"}`}>{t.label}</span>
              {tab === t.id && <span className="w-4 h-0.5 rounded-full bg-amber" />}
            </button>
          );
        })}
      </nav>

      <div className="fixed bottom-20 right-4 z-40 md:bottom-6 md:right-6">
        <AnimatePresence>
          {assistantOpen && (
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.96 }}
              className="mb-4 flex h-[520px] max-h-[72vh] w-[calc(100vw-2rem)] max-w-md flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-2xl shadow-earth/20"
            >
              <div className="border-b border-border bg-gradient-to-r from-earth to-clay p-4 text-cream">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full bg-gold blur-md opacity-70" />
                      <div className="relative grid h-10 w-10 place-items-center rounded-full bg-gold text-earth">
                        <BrainCircuit className="h-5 w-5" />
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-black">AI Startup Advisor</div>
                      <div className="text-xs text-cream/65">Strategy, schemes, licenses, tax</div>
                    </div>
                  </div>
                  <button onClick={() => setAssistantOpen(false)} className="rounded-lg bg-white/10 px-2 py-1 text-sm font-black">×</button>
                </div>
              </div>
              <div className="border-b border-border bg-paper/70 p-3">
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {quickPrompts.map(prompt => (
                    <button key={prompt} onClick={() => sendChat(prompt)} className="whitespace-nowrap rounded-full border border-amber/30 bg-amber/15 px-3 py-1.5 text-xs font-bold text-clay transition hover:bg-amber/25">
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {messages.slice(-5).map((m, i) => (
                  <div key={`${m.role}-${i}`} className={`mb-3 flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[84%] rounded-2xl px-4 py-3 text-sm leading-6 ${m.role === "user" ? "bg-primary text-primary-foreground" : "border border-border bg-paper/70 text-foreground"}`}>
                      {m.role === "assistant" ? <ReactMarkdown>{m.content}</ReactMarkdown> : m.content}
                    </div>
                  </div>
                ))}
                {aiLoading && (
                  <div className="rounded-2xl border border-border bg-paper/70 px-4 py-3">
                    <span className="typing-dot" /><span className="typing-dot ml-1" /><span className="typing-dot ml-1" />
                  </div>
                )}
              </div>
              <div className="border-t border-border bg-card p-3">
                <div className="flex gap-2">
                  <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendChat()}
                    placeholder="Ask for a business strategy..." className="min-w-0 flex-1 rounded-2xl border border-border bg-paper px-4 py-3 text-sm outline-none focus:border-amber focus:ring-2 focus:ring-amber/20" />
                  <button onClick={() => sendChat()} disabled={aiLoading || !chatInput.trim()} className="grid h-11 w-11 place-items-center rounded-2xl bg-amber text-earth disabled:bg-muted disabled:text-muted-foreground">
                    <ArrowUpRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <button onClick={() => setAssistantOpen(v => !v)} className="group relative ml-auto grid h-14 w-14 place-items-center rounded-2xl bg-earth text-gold shadow-2xl shadow-earth/25 transition hover:-translate-y-1 md:h-16 md:w-16" aria-label="Open AI advisor">
          <span className="absolute inset-0 rounded-2xl bg-gold/30 blur-xl opacity-70 transition group-hover:opacity-100" />
          <Bot className="relative h-6 w-6" />
        </button>
      </div>

      {/* Template Modal */}
      {selTemplate && (
        <div className="fixed inset-0 bg-black/60 z-[500] flex items-end md:items-center md:p-6" onClick={() => setSelTemplate(null)}>
          <div onClick={e => e.stopPropagation()} className="bg-card rounded-t-2xl p-5 w-full max-w-[480px] mx-auto max-h-[80vh] overflow-y-auto md:max-w-3xl md:rounded-3xl md:p-7">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-earth">{selTemplate.name}</h3>
              <button onClick={() => setSelTemplate(null)} className="bg-muted rounded-lg px-3 py-1 text-sm">✕</button>
            </div>
            <pre className="text-xs leading-relaxed whitespace-pre-wrap bg-paper rounded-lg p-4 mb-4 font-mono">{selTemplate.content}</pre>
            <button onClick={() => downloadT(selTemplate)} className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold">⬇ Download Template</button>
          </div>
        </div>
      )}
    </div>
  );
}
