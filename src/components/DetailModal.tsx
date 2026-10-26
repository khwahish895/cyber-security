import React from 'react';
import { X, ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight, Copy, Check } from 'lucide-react';
import { TrafficFlow } from '../types';

interface DetailModalProps {
  flow: TrafficFlow | null;
  onClose: () => void;
  onAlertCreated?: (flowId: string) => void;
  anonymizeIps?: boolean;
}

export const DetailModal: React.FC<DetailModalProps> = ({
  flow,
  onClose,
  anonymizeIps = false
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!flow) return null;

  const maskIp = (ip: string) => {
    if (!anonymizeIps) return ip;
    const parts = ip.split('.');
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.${parts[2]}.xxx`;
    }
    return ip;
  };

  const copyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(flow, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const severityColor = {
    critical: 'text-red-400 bg-red-500/10 border-red-500/30',
    high: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
    medium: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    low: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
    normal: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
  }[flow.severity];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0b1120]">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-semibold text-cyan-400">{flow.id}</span>
            <span className="text-slate-500 text-xs">·</span>
            <span className="text-xs text-slate-400 font-mono">
              {new Date(flow.timestamp).toLocaleString()}
            </span>
            <span className="text-slate-500 text-xs">·</span>
            <span className="text-xs text-slate-400">Unidirectional Probe</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Classification & Risk Banner */}
          <div className="p-4 rounded-lg bg-slate-900/80 border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div>
              <div className="text-xs text-slate-400 mb-1">Predicted Threat Class</div>
              <div className="flex items-center gap-2">
                {flow.predictedClass === 'BENIGN' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
                )}
                <span className="font-semibold text-white tracking-tight">
                  {flow.predictedClass.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="text-xs text-slate-400 mt-1 font-mono">
                Confidence: {(flow.confidence * 100).toFixed(1)}%
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-400 mb-1">Risk Score</div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-white tabular-nums">
                  {flow.riskScore}
                </span>
                <span className="text-xs text-slate-400">/ 100</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    flow.riskScore >= 85 ? 'bg-red-500' :
                    flow.riskScore >= 70 ? 'bg-orange-500' :
                    flow.riskScore >= 45 ? 'bg-amber-500' :
                    flow.riskScore >= 25 ? 'bg-sky-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${flow.riskScore}%` }}
                />
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-400 mb-1">Severity Assessment</div>
              <div className={`inline-flex px-2.5 py-1 rounded-md text-xs font-semibold capitalize border ${severityColor}`}>
                {flow.severity} Severity
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Batch Job: <span className="font-mono text-slate-300">{flow.analysisJobId}</span>
              </div>
            </div>
          </div>

          {/* AI Explanation Rationale */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Model Inference Rationale
            </h4>
            <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800/80 text-slate-200 text-xs leading-relaxed">
              {flow.explanation}
            </div>
          </div>

          {/* Network Endpoint Identifiers */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Unidirectional Flow Route
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-lg bg-slate-900/40 border border-slate-800/80">
              <div>
                <span className="text-[11px] text-slate-400 block">Source Endpoint</span>
                <span className="font-mono text-xs text-slate-200 font-medium">{maskIp(flow.srcIp)}</span>
                <span className="text-xs text-slate-400 font-mono block">Port {flow.srcPort}</span>
              </div>
              <div className="flex items-center justify-center text-slate-500">
                <ArrowRight className="w-4 h-4 hidden sm:block text-slate-600" />
                <span className="text-xs font-mono uppercase bg-slate-800 px-2 py-0.5 rounded text-cyan-400">
                  {flow.protocol} Unidirectional
                </span>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-[11px] text-slate-400 block">Destination Endpoint</span>
                <span className="font-mono text-xs text-slate-200 font-medium">{maskIp(flow.dstIp)}</span>
                <span className="text-xs text-slate-400 font-mono block">Port {flow.dstPort}</span>
              </div>
            </div>
          </div>

          {/* Feature Importance Attribution Breakdown */}
          {flow.topFeatures && flow.topFeatures.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Top Contributing Flow Telemetry Features
              </h4>
              <div className="border border-slate-800 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0b1120] text-slate-400 border-b border-slate-800 font-medium">
                    <tr>
                      <th className="py-2 px-3">Telemetry Metric</th>
                      <th className="py-2 px-3 text-right">Captured Value</th>
                      <th className="py-2 px-3">Direction</th>
                      <th className="py-2 px-3">Diagnostic Significance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {flow.topFeatures.map((feat, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30">
                        <td className="py-2 px-3 font-sans font-medium text-slate-200">{feat.name}</td>
                        <td className="py-2 px-3 text-right text-slate-300 tabular-nums">{String(feat.value)}</td>
                        <td className="py-2 px-3">
                          <span
                            className={`font-sans font-medium text-[11px] ${
                              feat.direction === 'malicious' ? 'text-red-400' : 'text-emerald-400'
                            }`}
                          >
                            {feat.direction === 'malicious' ? 'Flagged Anomaly' : 'Normal Baseline'}
                          </span>
                        </td>
                        <td className="py-2 px-3 font-sans text-slate-400 text-[11px]">
                          {feat.thresholdExplanation || 'Contributes to model classification decision'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Raw Metrics Grid */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Captured Unidirectional Flow Attributes
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-2.5 rounded bg-slate-900/40 border border-slate-800/60">
                <span className="text-[11px] text-slate-400 block">Flow Duration</span>
                <span className="font-mono text-slate-200 font-medium tabular-nums">{flow.flowDurationMs} ms</span>
              </div>
              <div className="p-2.5 rounded bg-slate-900/40 border border-slate-800/60">
                <span className="text-[11px] text-slate-400 block">Total Fwd Packets</span>
                <span className="font-mono text-slate-200 font-medium tabular-nums">{flow.totalFwdPackets.toLocaleString()}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-900/40 border border-slate-800/60">
                <span className="text-[11px] text-slate-400 block">Flow Rate (Pkts/s)</span>
                <span className="font-mono text-slate-200 font-medium tabular-nums">{flow.flowPacketsPerSec.toLocaleString()}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-900/40 border border-slate-800/60">
                <span className="text-[11px] text-slate-400 block">Total Fwd Bytes</span>
                <span className="font-mono text-slate-200 font-medium tabular-nums">{(flow.totalFwdBytes / 1024).toFixed(1)} KB</span>
              </div>
              <div className="p-2.5 rounded bg-slate-900/40 border border-slate-800/60">
                <span className="text-[11px] text-slate-400 block">Packet IAT Mean</span>
                <span className="font-mono text-slate-200 font-medium tabular-nums">{flow.packetIATMean.toFixed(2)} ms</span>
              </div>
              <div className="p-2.5 rounded bg-slate-900/40 border border-slate-800/60">
                <span className="text-[11px] text-slate-400 block">Packet IAT Std</span>
                <span className="font-mono text-slate-200 font-medium tabular-nums">{flow.packetIATStd.toFixed(2)} ms</span>
              </div>
              <div className="p-2.5 rounded bg-slate-900/40 border border-slate-800/60">
                <span className="text-[11px] text-slate-400 block">SYN / ACK Flags</span>
                <span className="font-mono text-slate-200 font-medium tabular-nums">{flow.synFlagCount} / {flow.ackFlagCount}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-900/40 border border-slate-800/60">
                <span className="text-[11px] text-slate-400 block">FIN / RST / PSH</span>
                <span className="font-mono text-slate-200 font-medium tabular-nums">{flow.finFlagCount} / {flow.rstFlagCount} / {flow.pshFlagCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-800 bg-[#0b1120] text-xs">
          <span className="text-slate-400">
            NTRO Passive Traffic Capture Interface <span className="font-mono text-slate-300">eth0.mirror</span>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={copyJson}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors font-medium"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied JSON' : 'Copy Flow JSON'}</span>
            </button>
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-md bg-cyan-600 hover:bg-cyan-500 text-white font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
