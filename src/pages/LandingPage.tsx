import React from 'react';
import {
  Shield,
  Activity,
  ArrowRight,
  Cpu,
  Lock,
  Layers,
  Database,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Terminal,
  Zap,
  Globe
} from 'lucide-react';

interface LandingPageProps {
  onEnterDashboard: () => void;
  onExploreCapabilities: () => void;
  onOpenSihBrief: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterDashboard,
  onExploreCapabilities,
  onOpenSihBrief
}) => {
  return (
    <div className="min-h-screen bg-[#080c16] text-slate-100 selection:bg-cyan-500/30">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-6 max-w-6xl mx-auto overflow-hidden">
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #38bdf8 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }}
        />

        <div className="relative text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium">
            <span>Smart India Hackathon 2026</span>
            <span aria-hidden="true">·</span>
            <span>SIH26145</span>
            <span aria-hidden="true">·</span>
            <span>NTRO</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight text-balance">
            Detect Threats Before They Become Incidents.
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Intelligent cybersecurity platform engineered for passive, unidirectional IP traffic inspection. Accurately classify cyber threats, isolate anomaly signatures, and compute real-time risk scores without relying on return-path communications.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={onEnterDashboard}
              className="px-6 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2"
            >
              <span>Open Security Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onExploreCapabilities}
              className="px-6 py-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm transition-colors flex items-center gap-2"
            >
              <span>Explore Detection Capabilities</span>
            </button>
          </div>

          <div className="pt-8 flex flex-wrap items-center justify-center gap-8 text-xs text-slate-400">
            <div>
              <span className="font-mono text-cyan-400 font-semibold text-sm">98.7%</span>
              <span className="block text-slate-500">Evaluation Accuracy</span>
            </div>
            <div className="hidden sm:block text-slate-700">|</div>
            <div>
              <span className="font-mono text-cyan-400 font-semibold text-sm">1.6 ms</span>
              <span className="block text-slate-500">Inference Latency</span>
            </div>
            <div className="hidden sm:block text-slate-700">|</div>
            <div>
              <span className="font-mono text-cyan-400 font-semibold text-sm">26 Features</span>
              <span className="block text-slate-500">Unidirectional Flow Schema</span>
            </div>
            <div className="hidden sm:block text-slate-700">|</div>
            <div>
              <span className="font-mono text-cyan-400 font-semibold text-sm">7 Classes</span>
              <span className="block text-slate-500">Threat Taxonomy</span>
            </div>
          </div>
        </div>
      </section>

      {/* Core Capabilities Bento / Feature Grid */}
      <section className="py-16 px-6 max-w-6xl mx-auto border-t border-slate-800/80">
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Designed for Air-Gapped &amp; Passive Perimeters
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Traditional intrusion detection systems fail when reverse packet streams are unavailable. CyberShield AI redefines unidirectional flow telemetry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800/80 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">
                Supervised Random Forest Ensemble
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Trained on the authoritative CSE-CIC-IDS2017 unidirectional probe split. Employs 100 decision trees to accurately separate high-rate SYN flood storms, stealthy single-packet port scans, and malicious SSH brute force attempts.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-slate-800/80 text-[11px] text-cyan-400 font-mono">
              F1-Score: 0.982 · Zero Target Leakage
            </div>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800/80 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">
                Continuous 0-100 Risk Engine
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Transparent multi-factor scoring that blends model prediction confidence, forward packet rate entropy, inter-arrival time standard deviation, and sensitive port vulnerability indexes into a single actionable score.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-slate-800/80 text-[11px] text-teal-400 font-mono">
              Deterministic &amp; Auditable Rules
            </div>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800/80 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">
                Near-Real-Time Stream Ingestion
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Processes batch CSV records and streaming NetFlow feeds simultaneously. Automatic column schema mapping matches diverse capture formats and highlights invalid or missing telemetry fields.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-slate-800/80 text-[11px] text-indigo-400 font-mono">
              FastAPI + Flutter REST Compatible
            </div>
          </div>
        </div>
      </section>

      {/* How It Works / Data Pipeline */}
      <section className="py-16 px-6 max-w-6xl mx-auto border-t border-slate-800/80">
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            How Unidirectional Traffic Becomes Actionable Intelligence
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            A 4-step pipeline that preserves network isolation while delivering enterprise-grade threat visibility.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <div className="font-mono text-cyan-400 text-xs font-semibold mb-2">PHASE 01</div>
            <h4 className="text-sm font-semibold text-white mb-1.5">Passive Tap Extraction</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Optical splitter or SPAN mirror tap copies forward IP traffic. No outbound packets or TCP ACKs are generated by the sensor.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <div className="font-mono text-cyan-400 text-xs font-semibold mb-2">PHASE 02</div>
            <h4 className="text-sm font-semibold text-white mb-1.5">Feature Normalization</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              26 statistical flow dimensions are extracted, including Packet IAT Mean, Header Length, and TCP Flag compositions.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <div className="font-mono text-cyan-400 text-xs font-semibold mb-2">PHASE 03</div>
            <h4 className="text-sm font-semibold text-white mb-1.5">Ensemble Classification</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              The AI engine evaluates flow signatures against trained decision boundaries, assigning a threat class and confidence score.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <div className="font-mono text-cyan-400 text-xs font-semibold mb-2">PHASE 04</div>
            <h4 className="text-sm font-semibold text-white mb-1.5">SOC Triage &amp; Alerting</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Flows exceeding risk thresholds automatically dispatch high-priority incident alerts with diagnostic feature attribution.
            </p>
          </div>
        </div>
      </section>

      {/* Technology Stack & SIH Problem Alignment */}
      <section className="py-16 px-6 max-w-6xl mx-auto border-t border-slate-800/80">
        <div className="p-8 rounded-2xl bg-[#0f172a] border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-mono text-cyan-400 font-medium">SMART INDIA HACKATHON · SIH26145</span>
            <h3 className="text-2xl font-bold text-white tracking-tight">
              Built for National Technical Research Organisation (NTRO)
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Fulfilling PSO2: Ability to Design and Develop Mobile and Web-Based Applications Under Realistic Constraints. The modular backend serves both this React web dashboard and future Flutter mobile incident responders.
            </p>
            <div className="flex flex-wrap gap-2 pt-2 text-xs text-slate-400">
              <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300">FastAPI &amp; Python 3.11</span>
              <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300">Scikit-learn RF</span>
              <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300">React &amp; TypeScript</span>
              <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300">Supabase PostgreSQL</span>
              <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300">Tailwind CSS</span>
            </div>
          </div>
          <div className="shrink-0 flex flex-col gap-3 w-full md:w-auto">
            <button
              onClick={onEnterDashboard}
              className="px-6 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <span>Launch Security Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenSihBrief}
              className="px-6 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium transition-colors flex items-center justify-center gap-2"
            >
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>View SIH Technical Dossier</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 px-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-slate-300">CyberShield AI</span>
            <span aria-hidden="true">·</span>
            <span>SIH26145 / NTRO</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <button onClick={onOpenSihBrief} className="hover:text-slate-200">
              System Architecture
            </button>
            <span aria-hidden="true">·</span>
            <button onClick={onEnterDashboard} className="hover:text-slate-200">
              Live Operations
            </button>
            <span aria-hidden="true">·</span>
            <span>Ethical Testing &amp; Research Prototype</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
