import React, { useState } from 'react';
import {
  Cpu,
  Layers,
  Play,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Sliders,
  Terminal,
  Zap,
  Info
} from 'lucide-react';
import { RawFlowInput } from '../services/mlEngine';
import { api } from '../services/api';
import { ThreatClass, Severity, FeatureContribution, ModelInfo } from '../types';

interface ModelManagementPageProps {
  modelInfo: ModelInfo;
}

export const ModelManagementPage: React.FC<ModelManagementPageProps> = ({ modelInfo }) => {
  // Simulator inputs
  const [protocol, setProtocol] = useState<'TCP' | 'UDP' | 'ICMP'>('TCP');
  const [dstPort, setDstPort] = useState<number>(80);
  const [durationMs, setDurationMs] = useState<number>(340);
  const [totalFwdPackets, setTotalFwdPackets] = useState<number>(320);
  const [totalFwdBytes, setTotalFwdBytes] = useState<number>(19200);
  const [synFlags, setSynFlags] = useState<number>(280);
  const [ackFlags, setAckFlags] = useState<number>(0);
  const [iatMean, setIatMean] = useState<number>(1.06);

  // Simulation output state
  const [isInferring, setIsInferring] = useState<boolean>(false);
  const [predictionResult, setPredictionResult] = useState<{
    predictedClass: ThreatClass;
    confidence: number;
    riskScore: number;
    severity: Severity;
    explanation: string;
    topFeatures: FeatureContribution[];
  } | null>(null);

  const runSingleInference = async () => {
    setIsInferring(true);
    try {
      const raw: RawFlowInput = {
        protocol,
        dstPort,
        flowDurationMs: durationMs,
        totalFwdPackets,
        totalFwdBytes,
        synFlagCount: synFlags,
        ackFlagCount: ackFlags,
        packetIATMean: iatMean,
        fwdPacketLengthMax: Math.round(totalFwdBytes / Math.max(1, totalFwdPackets)),
        flowBytesPerSec: Math.round(totalFwdBytes / Math.max(0.001, durationMs / 1000)),
        flowPacketsPerSec: Math.round(totalFwdPackets / Math.max(0.001, durationMs / 1000)),
        srcPort: 54120,
        srcIp: '192.168.1.105',
        dstIp: '172.16.0.1'
      };

      const res = await api.predictSingleFlow(raw);
      setPredictionResult(res);
    } finally {
      setIsInferring(false);
    }
  };

  const applyPresetAttackScenario = (scenario: string) => {
    if (scenario === 'syn_flood') {
      setProtocol('TCP');
      setDstPort(80);
      setDurationMs(210);
      setTotalFwdPackets(480);
      setTotalFwdBytes(28800);
      setSynFlags(480);
      setAckFlags(0);
      setIatMean(0.43);
    } else if (scenario === 'port_scan') {
      setProtocol('TCP');
      setDstPort(23);
      setDurationMs(12);
      setTotalFwdPackets(2);
      setTotalFwdBytes(0);
      setSynFlags(2);
      setAckFlags(0);
      setIatMean(6.0);
    } else if (scenario === 'ssh_brute') {
      setProtocol('TCP');
      setDstPort(22);
      setDurationMs(4520);
      setTotalFwdPackets(18);
      setTotalFwdBytes(12400);
      setSynFlags(1);
      setAckFlags(18);
      setIatMean(251.1);
    } else if (scenario === 'botnet_c2') {
      setProtocol('TCP');
      setDstPort(8888);
      setDurationMs(8500);
      setTotalFwdPackets(14);
      setTotalFwdBytes(3500);
      setSynFlags(1);
      setAckFlags(14);
      setIatMean(607.1);
    } else {
      // Normal Benign
      setProtocol('TCP');
      setDstPort(443);
      setDurationMs(240);
      setTotalFwdPackets(12);
      setTotalFwdBytes(8400);
      setSynFlags(1);
      setAckFlags(12);
      setIatMean(20.0);
    }
    setPredictionResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Machine Learning Model Registry &amp; Single-Flow Tester</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Inspect model architecture metadata or execute interactive single-flow inference simulations.
          </p>
        </div>
        <div className="text-xs font-mono text-cyan-400">
          <span>Inference Latency: {modelInfo.inferenceLatencyMs} ms</span>
        </div>
      </div>

      {/* Model Spec Card */}
      <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">{modelInfo.name}</h2>
                <span className="px-2 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 font-mono text-xs">
                  {modelInfo.version}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{modelInfo.modelType}</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs font-mono">
            <div>
              <span className="text-slate-400 block text-[10px]">Test Accuracy</span>
              <span className="text-emerald-400 font-bold text-sm">{(modelInfo.accuracy * 100).toFixed(1)}%</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Macro F1</span>
              <span className="text-emerald-400 font-bold text-sm">{modelInfo.f1Score.toFixed(3)}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Latency</span>
              <span className="text-cyan-400 font-bold text-sm">{modelInfo.inferenceLatencyMs} ms</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Training Dataset</span>
            <span className="text-slate-200 font-medium">{modelInfo.trainingDataset}</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Training Timestamp</span>
            <span className="font-mono text-slate-200">{new Date(modelInfo.trainingTimestamp).toLocaleDateString()}</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Active Feature Schema</span>
            <span className="font-mono text-slate-200">{modelInfo.featureSchema.length} Attributes</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Classification Scope</span>
            <span className="font-mono text-slate-200">{modelInfo.supportedClasses.length} Target Classes</span>
          </div>
        </div>
      </div>

      {/* Interactive Single-Flow Tester */}
      <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Interactive Single-Flow Inference Tester</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulate arbitrary unidirectional IP flows and verify classification accuracy, risk scoring, and threshold attribution.
            </p>
          </div>

          {/* Quick Scenario Fill Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 text-[11px] mr-1">Load Preset:</span>
            <button
              onClick={() => applyPresetAttackScenario('normal')}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
            >
              Normal (HTTPS)
            </button>
            <button
              onClick={() => applyPresetAttackScenario('syn_flood')}
              className="px-2.5 py-1 rounded bg-red-500/20 hover:bg-red-500/30 text-red-300 font-medium transition-colors"
            >
              SYN Flood
            </button>
            <button
              onClick={() => applyPresetAttackScenario('port_scan')}
              className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-medium transition-colors"
            >
              PortScan
            </button>
            <button
              onClick={() => applyPresetAttackScenario('ssh_brute')}
              className="px-2.5 py-1 rounded bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 font-medium transition-colors"
            >
              SSH BruteForce
            </button>
            <button
              onClick={() => applyPresetAttackScenario('botnet_c2')}
              className="px-2.5 py-1 rounded bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-medium transition-colors"
            >
              Botnet C2
            </button>
          </div>
        </div>

        {/* Input Parameters Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 mb-1 font-medium">Protocol</label>
            <select
              value={protocol}
              onChange={(e) => setProtocol(e.target.value as any)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="TCP">TCP (6)</option>
              <option value="UDP">UDP (17)</option>
              <option value="ICMP">ICMP (1)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-medium">Destination Port</label>
            <input
              type="number"
              value={dstPort}
              onChange={(e) => setDstPort(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-medium">Total Forward Packets</label>
            <input
              type="number"
              value={totalFwdPackets}
              onChange={(e) => setTotalFwdPackets(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-medium">Flow Duration (ms)</label>
            <input
              type="number"
              value={durationMs}
              onChange={(e) => setDurationMs(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-medium">SYN Flag Count</label>
            <input
              type="number"
              value={synFlags}
              onChange={(e) => setSynFlags(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-medium">ACK Flag Count</label>
            <input
              type="number"
              value={ackFlags}
              onChange={(e) => setAckFlags(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-medium">Flow IAT Mean (ms)</label>
            <input
              type="number"
              step="0.01"
              value={iatMean}
              onChange={(e) => setIatMean(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-medium">Total Forward Bytes</label>
            <input
              type="number"
              value={totalFwdBytes}
              onChange={(e) => setTotalFwdBytes(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>
        </div>

        <button
          onClick={runSingleInference}
          disabled={isInferring}
          className="px-6 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-semibold text-xs transition-colors flex items-center gap-2 shadow-lg shadow-cyan-600/20"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Execute Real-Time Model Inference</span>
        </button>

        {/* Prediction Results Display */}
        {predictionResult && (
          <div className="p-5 rounded-xl bg-slate-950 border border-cyan-500/40 space-y-4 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Predicted Output</span>
                <div className="flex items-center gap-2 mt-0.5">
                  {predictionResult.predictedClass === 'BENIGN' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <ShieldAlert className="w-5 h-5 text-red-400" />
                  )}
                  <span className="text-base font-bold text-white">
                    {predictionResult.predictedClass.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-6 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 block">Confidence</span>
                  <span className="text-white font-bold text-sm">{(predictionResult.confidence * 100).toFixed(1)}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Risk Score</span>
                  <span className="text-cyan-400 font-bold text-sm">{predictionResult.riskScore} / 100</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Severity</span>
                  <span className="text-orange-400 font-bold text-sm capitalize">{predictionResult.severity}</span>
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800">
              <strong className="text-white block mb-0.5">Rationale:</strong>
              {predictionResult.explanation}
            </div>

            {/* Contributing features table */}
            {predictionResult.topFeatures && predictionResult.topFeatures.length > 0 && (
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Discriminative Feature Attribution
                </span>
                <div className="border border-slate-800 rounded-lg overflow-hidden text-xs">
                  <table className="w-full text-left font-mono">
                    <thead className="bg-[#0b1120] text-slate-400 border-b border-slate-800 font-sans font-medium">
                      <tr>
                        <th className="py-2 px-3">Telemetry Metric</th>
                        <th className="py-2 px-3">Input Value</th>
                        <th className="py-2 px-3">Diagnostic Significance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {predictionResult.topFeatures.map((f, idx) => (
                        <tr key={idx}>
                          <td className="py-2 px-3 font-sans text-white font-medium">{f.name}</td>
                          <td className="py-2 px-3 text-cyan-400 tabular-nums">{String(f.value)}</td>
                          <td className="py-2 px-3 font-sans text-[11px] text-slate-400">{f.thresholdExplanation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
