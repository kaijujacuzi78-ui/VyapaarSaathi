import { motion } from "framer-motion";
import { BrainCircuit, BriefcaseBusiness, CheckCircle2, LineChart, ShieldCheck, Sparkles } from "lucide-react";

type AuthShellProps = {
  children: React.ReactNode;
  eyebrow: string;
  title: string;
  subtitle: string;
};

const metrics = [
  { label: "Compliance clarity", value: "92%", icon: ShieldCheck },
  { label: "Funding routes", value: "48+", icon: LineChart },
  { label: "AI strategy checks", value: "24/7", icon: BrainCircuit },
];

export function AuthShell({ children, eyebrow, title, subtitle }: AuthShellProps) {
  return (
    <main className="min-h-screen overflow-hidden bg-[#F4EFE3] text-[#4A3528]">
      <div className="pointer-events-none fixed inset-0">
        <motion.div animate={{ y: [0, -18, 0], x: [0, 12, 0] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }} className="absolute left-[-8rem] top-16 h-96 w-96 rounded-full bg-[#7D9275]/20 blur-3xl" />
        <motion.div animate={{ y: [0, 16, 0], x: [0, -10, 0] }} transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }} className="absolute right-[-10rem] bottom-10 h-[28rem] w-[28rem] rounded-full bg-[#8B6A4E]/20 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(74,53,40,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(74,53,40,0.055)_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      <div className="relative grid min-h-screen lg:grid-cols-[1.08fr_0.92fr]">
        <section className="hidden flex-col justify-between p-8 lg:flex xl:p-12">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#4A3528] text-[#F7F4EC] shadow-2xl shadow-[#4A3528]/20">
              <BriefcaseBusiness className="h-6 w-6" />
            </div>
            <div>
              <div className="text-xl font-black leading-none">VyapaarSaathi AI</div>
              <div className="mt-1 text-xs font-black uppercase tracking-[0.24em] text-[#7D9275]">Business strategy platform</div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="max-w-3xl py-12">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#D8CDBB] bg-[#FFFDF7]/60 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#7D9275] shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4" />
              {eyebrow}
            </div>
            <h1 className="text-5xl font-black leading-[1.02] tracking-tight xl:text-7xl">{title}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#6F5A49]">{subtitle}</p>

            <div className="mt-10 grid max-w-2xl gap-4 xl:grid-cols-3">
              {metrics.map(item => {
                const Icon = item.icon;
                return (
                  <motion.div whileHover={{ y: -5 }} key={item.label} className="rounded-3xl border border-[#D8CDBB] bg-[#FFFDF7]/72 p-5 shadow-xl shadow-[#4A3528]/8 backdrop-blur">
                    <Icon className="mb-5 h-5 w-5 text-[#7D9275]" />
                    <div className="text-3xl font-black">{item.value}</div>
                    <div className="mt-1 text-xs font-black uppercase tracking-[0.14em] text-[#7B6A5A]">{item.label}</div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} className="max-w-2xl rounded-[2rem] border border-[#D8CDBB] bg-[#FFFDF7]/72 p-6 shadow-2xl shadow-[#4A3528]/10 backdrop-blur">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <div className="text-sm font-black">Founder intelligence preview</div>
                <div className="text-xs text-[#7B6A5A]">Compliance, funding, and launch readiness</div>
              </div>
              <div className="rounded-full bg-[#7D9275] px-3 py-1 text-xs font-black text-[#FFFDF7]">SECURE</div>
            </div>
            <div className="space-y-3">
              {["MSME registration pathway mapped", "State permits and tax checkpoints organized", "AI advisor ready for founder questions"].map((copy, index) => (
                <div key={copy} className="flex items-center gap-3 rounded-2xl bg-[#F4EFE3] p-3">
                  <CheckCircle2 className="h-5 w-5 text-[#7D9275]" />
                  <span className="text-sm font-bold text-[#5C4635]">{copy}</span>
                  <span className="ml-auto text-xs font-black text-[#8B6A4E]">0{index + 1}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        <section className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-10">
          {children}
        </section>
      </div>
    </main>
  );
}
