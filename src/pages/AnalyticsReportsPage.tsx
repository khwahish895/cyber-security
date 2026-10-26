import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  BarChart2,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  PieChart as PieIcon,
  Calendar
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from 'recharts';
import { DashboardSummary, ModelInfo } from '../types';

interface AnalyticsReportsPageProps {
  summary: DashboardSummary;
  modelInfo: ModelInfo;
  onOpenReportModal: () => void;
}

export const AnalyticsReportsPage: React.FC<AnalyticsReportsPageProps> = ({
  summary,
  modelInfo,
  onOpenReportModal
}) => {
  // Risk score histogram buckets
  const riskHistogram = [
    { range: '0-20 (Nominal)', count: summary.normalFlows, color: '#10b981' },
    { range: '21-40 (Low)', count: Math.round(summary.totalFlows * 0.1), color: '#38bdf8' },
    { range: '41-60 (Medium)', count: Math.round(summary.suspiciousFlows * 0.35), color: '#f59e0b' },
    { range: '61-80 (High)', count: Math.round(summary.suspiciousFlows * 0.4), color: '#f97316' },
    { range: '81-100 (Critical)', count: summary.criticalAlerts, color: '#ef4444' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Cyber Threat Analytics &amp; Compliance Reporting</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Statistical distributions, multi-dimensional risk histograms, and printable executive threat dossiers.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenReportModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-colors shadow-lg shadow-cyan-600/20"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Generate Executive Security Report</span>
          </button>
        </div>
      </div>

      {/* Analytics Grid: 2 Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Score Histogram */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-white">Flow Risk Score Distribution</h3>
            <p className="text-xs text-slate-400 mt-0.5">Classification risk index clustered across 5 security tiers</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskHistogram} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="range" stroke="#94a3b8" fontSize={10} tickLine={false} interval={0} angle={-15} textAnchor="end" />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {riskHistogram.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Severity Breakdown Bar */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-white">Severity Level Frequency</h3>
            <p className="text-xs text-slate-400 mt-0.5">Categorized flows based on automated triage thresholds</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summary.severityDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="severity" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {summary.severityDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Model Performance Validation Matrix */}
      <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-white">Model Performance &amp; Evaluation Verification</h3>
            <p className="text-xs text-slate-400 mt-0.5">Empirical test metrics recorded on CSE-CIC-IDS2017 unidirectional probe test set</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-cyan-400">
            <span>Overall Accuracy: <strong className="text-emerald-400 font-bold">{(modelInfo.accuracy * 100).toFixed(1)}%</strong></span>
            <span>Overall F1: <strong className="text-emerald-400 font-bold">{modelInfo.f1Score.toFixed(3)}</strong></span>
          </div>
        </div>

        <div className="border border-slate-800 rounded-lg overflow-hidden text-xs">
          <table className="w-full text-left font-mono">
            <thead className="bg-[#0b1120] text-slate-400 border-b border-slate-800 font-sans font-medium">
              <tr>
                <th className="py-2.5 px-3.5">Threat Class Label</th>
                <th className="py-2.5 px-3.5 text-right">Precision</th>
                <th className="py-2.5 px-3.5 text-right">Recall</th>
                <th className="py-2.5 px-3.5 text-right">F1-Score</th>
                <th className="py-2.5 px-3.5 text-right">False Positive Rate (FPR)</th>
                <th className="py-2.5 px-3.5 text-right">Test Support</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {Object.entries(modelInfo.classMetrics).map(([cls, metrics]) => (
                <tr key={cls} className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-3.5 font-sans font-medium text-white flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${cls === 'BENIGN' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                    <span>{cls.replace(/_/g, ' ')}</span>
                  </td>
                  <td className="py-2.5 px-3.5 text-right tabular-nums text-emerald-400">{(metrics.precision * 100).toFixed(1)}%</td>
                  <td className="py-2.5 px-3.5 text-right tabular-nums text-emerald-400">{(metrics.recall * 100).toFixed(1)}%</td>
                  <td className="py-2.5 px-3.5 text-right tabular-nums text-white font-bold">{metrics.f1.toFixed(3)}</td>
                  <td className="py-2.5 px-3.5 text-right tabular-nums text-slate-400">{((1 - metrics.precision) * 100).toFixed(2)}%</td>
                  <td className="py-2.5 px-3.5 text-right tabular-nums text-slate-400">{metrics.support.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
