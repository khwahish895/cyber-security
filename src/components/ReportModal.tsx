import React from 'react';
import { X, Printer, Download, ShieldCheck, AlertOctagon, CheckCircle2 } from 'lucide-react';
import { DashboardSummary } from '../types';

interface ReportModalProps {
  summary: DashboardSummary;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ summary, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const downloadJsonReport = () => {
    const reportData = {
      title: 'CyberShield AI - Executive Threat Assessment Report',
      sihProblemStatement: 'SIH26145 - NTRO',
      generatedAt: new Date().toISOString(),
      summaryMetrics: {
        totalFlowsAnalyzed: summary.totalFlows,
        normalFlows: summary.normalFlows,
        suspiciousFlows: summary.suspiciousFlows,
        criticalAlerts: summary.criticalAlerts,
        overallRiskScore: summary.overallRiskScore
      },
      threatBreakdown: summary.threatDistribution,
      severityBreakdown: summary.severityDistribution,
      recentAlerts: summary.recentAlerts
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CyberShield_Threat_Report_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl print:bg-white print:text-black print:max-h-none print:shadow-none print:border-none">
        {/* Modal Controls Header (Hidden on print) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0b1120] print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white">Executive Security Report</span>
            <span className="text-slate-500">·</span>
            <span className="text-xs text-slate-400">NTRO Unidirectional Threat Intelligence</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={downloadJsonReport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Document Body */}
        <div className="p-8 overflow-y-auto space-y-6 text-slate-200 print:text-black print:p-0">
          {/* Official Letterhead */}
          <div className="border-b border-slate-800 pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="text-cyan-400 font-bold text-lg tracking-tight uppercase flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" />
                <span>CyberShield AI Security Operations</span>
              </div>
              <h1 className="text-base font-semibold text-white mt-1">
                Passive Unidirectional IP Traffic Threat Assessment
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Smart India Hackathon SIH26145 · National Technical Research Organisation (NTRO)
              </p>
            </div>
            <div className="text-left sm:text-right text-xs font-mono text-slate-400">
              <div>Report ID: CSAI-{new Date().getFullYear()}-{Date.now().toString().slice(-5)}</div>
              <div>Generated: {new Date().toLocaleString()}</div>
              <div>Engine: CyberShield-FlowNet RF-v2.4.1</div>
            </div>
          </div>

          {/* Executive Summary Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Total Flows Audited</span>
              <span className="text-xl font-bold text-white font-mono tabular-nums">
                {summary.totalFlows.toLocaleString()}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Malicious / Anomaly Flows</span>
              <span className="text-xl font-bold text-red-400 font-mono tabular-nums">
                {summary.suspiciousFlows.toLocaleString()}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Critical Alerts</span>
              <span className="text-xl font-bold text-amber-400 font-mono tabular-nums">
                {summary.criticalAlerts}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Composite Threat Index</span>
              <span className="text-xl font-bold text-cyan-400 font-mono tabular-nums">
                {summary.overallRiskScore}/100
              </span>
            </div>
          </div>

          {/* Threat Distribution Table */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Detected Attack Categories &amp; Proportions
            </h3>
            <div className="border border-slate-800 rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-[#0b1120] text-slate-400 border-b border-slate-800 font-medium">
                  <tr>
                    <th className="py-2.5 px-3">Threat Category</th>
                    <th className="py-2.5 px-3 text-right">Identified Flows</th>
                    <th className="py-2.5 px-3 text-right">Percentage</th>
                    <th className="py-2.5 px-3">Classification Model Signature</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                  {summary.threatDistribution.map((t, idx) => (
                    <tr key={idx}>
                      <td className="py-2 px-3 font-sans font-medium text-white flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.color }} />
                        <span>{t.name.replace(/_/g, ' ')}</span>
                      </td>
                      <td className="py-2 px-3 text-right tabular-nums">{t.count}</td>
                      <td className="py-2 px-3 text-right tabular-nums">{t.percentage}%</td>
                      <td className="py-2 px-3 font-sans text-slate-400 text-[11px]">
                        {t.name === 'BENIGN' ? 'Normal conversational traffic' :
                         t.name === 'DDoS_SYN_Flood' ? 'High-frequency SYN burst without return ACK' :
                         t.name === 'PortScan' ? 'Rapid single-packet port sweeps' :
                         t.name === 'SSH_BruteForce' ? 'Cryptographic handshake iteration on port 22' :
                         t.name === 'Botnet_C2' ? 'Rigid isothermal IAT heartbeat beaconing' : 'Anomalous protocol flag sequence'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Actionable Remediation Guidance */}
          <div className="space-y-2 text-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Actionable SOC Recommendations
            </h3>
            <div className="p-4 rounded-lg bg-slate-900/40 border border-slate-800 space-y-2">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-slate-300">
                  <strong className="text-white">SYN Cookie Enforcement:</strong> Deploy automated SYN proxying or cookie validation at perimeter boundary for destination port 80/443 to absorb unidirectional volumetric bursts without socket exhaustion.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-slate-300">
                  <strong className="text-white">Port Scan Throttling:</strong> Enforce rate-limits on ephemeral connection attempts from source IP ranges exhibiting high single-packet flow counts.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-slate-300">
                  <strong className="text-white">SSH Hardening:</strong> Relocate management SSH ports from standard port 22 and enforce public-key mutual authentication to mitigate credential-stuffing patterns.
                </p>
              </div>
            </div>
          </div>

          {/* Signoff block */}
          <div className="pt-4 border-t border-slate-800 flex justify-between items-end text-xs text-slate-400">
            <div>
              <p className="text-white font-medium">CyberShield AI Security Operations Console</p>
              <p>National Technical Research Organisation (NTRO) Benchmark Engine</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-cyan-400">VERIFIED AUTOMATED ASSESSMENT</p>
              <p className="text-[11px]">Compliant with SIH PSO2 Evaluation Standards</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
