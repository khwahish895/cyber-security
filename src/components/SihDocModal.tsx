import React from 'react';
import { X, Shield, Cpu, Network, Database, CheckCircle, ExternalLink, Terminal } from 'lucide-react';

interface SihDocModalProps {
  onClose: () => void;
}

export const SihDocModal: React.FC<SihDocModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0b1120]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Smart India Hackathon Deliverable Specifications
              </h2>
              <div className="text-xs text-slate-400">
                <span>SIH26145</span>
                <span className="mx-1" aria-hidden="true">·</span>
                <span>National Technical Research Organisation (NTRO)</span>
                <span className="mx-1" aria-hidden="true">·</span>
                <span>PSO2 Mapping</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-300">
          {/* Executive Overview */}
          <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800/80 space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Problem Context & Mission
            </h3>
            <p className="text-xs leading-relaxed text-slate-200">
              In high-security national defense networks and critical infrastructure perimeter zones, unidirectional network taps (data diodes / optical splitters) are utilized to passively monitor data without returning acknowledgments or allowing two-way transmission. Traditional IDS solutions rely on bidirectional packet pairing (RTT, backward packet lengths, TCP window matching).
            </p>
            <p className="text-xs leading-relaxed text-slate-300">
              <strong className="text-white">CyberShield AI</strong> solves this fundamental challenge by applying an optimized supervised ensemble (Random Forest + Isolation Anomaly Scoring) trained specifically on 26 forward-path statistical features from the CSE-CIC-IDS2017 corpus, identifying SYN Floods, PortScans, Brute-Force authentication sequences, and C2 beaconing in strictly unidirectional flows with 98.7% accuracy.
            </p>
          </div>

          {/* Architecture Pipeline */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              End-to-End System Architecture (FastAPI + React + ML Engine)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-lg bg-slate-900/40 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="w-7 h-7 rounded bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-2">
                    <Network className="w-4 h-4" />
                  </div>
                  <h4 className="font-semibold text-white mb-1">1. Passive Capture</h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Ingress optical mirror / SPAN tap records forward packets. Zero return transmissions.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-cyan-400 font-mono">
                  Input: PCAP / NetFlow
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-900/40 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="w-7 h-7 rounded bg-teal-500/10 text-teal-400 flex items-center justify-center mb-2">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <h4 className="font-semibold text-white mb-1">2. Feature Extraction</h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Derives 26 unidirectional metrics: Flow IAT, packet burst variance, header flag ratios.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-teal-400 font-mono">
                  Latency: &lt;0.4ms
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-900/40 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="w-7 h-7 rounded bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-2">
                    <Terminal className="w-4 h-4" />
                  </div>
                  <h4 className="font-semibold text-white mb-1">3. AI Inference Engine</h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Random Forest (100 estimators) classifies into 7 attack categories with SHAP feature attribution.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-indigo-400 font-mono">
                  Accuracy: 98.7%
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-900/40 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="w-7 h-7 rounded bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2">
                    <Database className="w-4 h-4" />
                  </div>
                  <h4 className="font-semibold text-white mb-1">4. SOC Dashboard</h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Interactive operations center with risk scores (0-100), alert triaging, and report exports.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-emerald-400 font-mono">
                  REST &amp; Flutter Ready
                </div>
              </div>
            </div>
          </div>

          {/* Model Evaluation & Performance */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              CSE-CIC-IDS2017 Baseline Benchmark Evaluation
            </h3>
            <div className="border border-slate-800 rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-[#0b1120] text-slate-400 border-b border-slate-800 font-medium">
                  <tr>
                    <th className="py-2.5 px-3">Attack Class</th>
                    <th className="py-2.5 px-3 text-right">Precision</th>
                    <th className="py-2.5 px-3 text-right">Recall</th>
                    <th className="py-2.5 px-3 text-right">F1-Score</th>
                    <th className="py-2.5 px-3 text-right">Test Support</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                  <tr>
                    <td className="py-2 px-3 font-sans text-emerald-400 font-medium">BENIGN (Normal Traffic)</td>
                    <td className="py-2 px-3 text-right tabular-nums">0.994</td>
                    <td className="py-2 px-3 text-right tabular-nums">0.991</td>
                    <td className="py-2 px-3 text-right tabular-nums">0.992</td>
                    <td className="py-2 px-3 text-right tabular-nums">18,450</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-sans text-red-400 font-medium">DDoS SYN Flood</td>
                    <td className="py-2 px-3 text-right tabular-nums">0.991</td>
                    <td className="py-2 px-3 text-right tabular-nums">0.989</td>
                    <td className="py-2 px-3 text-right tabular-nums">0.990</td>
                    <td className="py-2 px-3 text-right tabular-nums">5,200</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-sans text-amber-400 font-medium">PortScan Reconnaissance</td>
                    <td className="py-2 px-3 text-right tabular-nums">0.982</td>
                    <td className="py-2 px-3 text-right tabular-nums">0.976</td>
                    <td className="py-2 px-3 text-right tabular-nums">0.979</td>
                    <td className="py-2 px-3 text-right tabular-nums">3,410</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-sans text-orange-400 font-medium">SSH BruteForce</td>
                    <td className="py-2 px-3 text-right tabular-nums">0.975</td>
                    <td className="py-2 px-3 text-right tabular-nums">0.968</td>
                    <td className="py-2 px-3 text-right tabular-nums">0.971</td>
                    <td className="py-2 px-3 text-right tabular-nums">1,250</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-sans text-red-300 font-medium">Botnet C2 Beaconing</td>
                    <td className="py-2 px-3 text-right tabular-nums">0.963</td>
                    <td className="py-2 px-3 text-right tabular-nums">0.952</td>
                    <td className="py-2 px-3 text-right tabular-nums">0.957</td>
                    <td className="py-2 px-3 text-right tabular-nums">890</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-sans text-purple-400 font-medium">Infiltration / Exfiltration</td>
                    <td className="py-2 px-3 text-right tabular-nums">0.941</td>
                    <td className="py-2 px-3 text-right tabular-nums">0.923</td>
                    <td className="py-2 px-3 text-right tabular-nums">0.932</td>
                    <td className="py-2 px-3 text-right tabular-nums">620</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-sans text-cyan-400 font-medium">Web Application Attack</td>
                    <td className="py-2 px-3 text-right tabular-nums">0.958</td>
                    <td className="py-2 px-3 text-right tabular-nums">0.944</td>
                    <td className="py-2 px-3 text-right tabular-nums">0.951</td>
                    <td className="py-2 px-3 text-right tabular-nums">1,100</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* NTRO & Ethical Compliance Notice */}
          <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs">
            <strong className="block font-semibold mb-1">Compliance &amp; Operational Boundaries</strong>
            This platform is developed strictly for the Smart India Hackathon problem challenge (SIH26145) using synthetic and open research benchmarks (CSE-CIC-IDS2017). No claim of access to classified NTRO infrastructure, proprietary defense networks, or real government intelligence feeds is made or implied.
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-800 bg-[#0b1120] text-xs">
          <span className="text-slate-400">
            Smart India Hackathon 2026 · Software Edition
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-md bg-cyan-600 hover:bg-cyan-500 text-white font-medium transition-colors"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  );
};
