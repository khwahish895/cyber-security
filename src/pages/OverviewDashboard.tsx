import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Upload,
  Radio,
  Clock,
  Layers,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from 'recharts';
import { DashboardSummary, SecurityAlert } from '../types';

interface OverviewDashboardProps {
  summary: DashboardSummary;
  onRefresh: () => void;
  onNavigate: (page: string) => void;
  onSelectAlert: (alert: SecurityAlert) => void;
  onAcknowledgeAlert: (alertId: string) => void;
  isStreamActive: boolean;
  onToggleStream: () => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  summary,
  onRefresh,
  onNavigate,
  onSelectAlert,
  onAcknowledgeAlert,
  isStreamActive,
  onToggleStream
}) => {
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d'>('24h');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    onRefresh();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Security Operations Center</span>
            <span className="text-xs font-mono font-normal text-slate-400">
              · Unidirectional IP Probe Ingress
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time passive traffic telemetry, threat vector classification, and perimeter risk intelligence.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Time range selector */}
          <div className="inline-flex rounded-lg bg-slate-900 border border-slate-800 p-0.5 text-xs font-medium">
            <button
              onClick={() => setTimeRange('1h')}
              className={`px-2.5 py-1 rounded transition-colors ${
                timeRange === '1h' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              1H
            </button>
            <button
              onClick={() => setTimeRange('24h')}
              className={`px-2.5 py-1 rounded transition-colors ${
                timeRange === '24h' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              24H
            </button>
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-2.5 py-1 rounded transition-colors ${
                timeRange === '7d' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              7D
            </button>
          </div>

          {/* Refresh button */}
          <button
            onClick={handleManualRefresh}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Refresh metrics from backend"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
          </button>

          {/* Upload Button */}
          <button
            onClick={() => onNavigate('analysis')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Analyze Dataset</span>
          </button>
        </div>
      </div>

      {/* KPI Stat Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Flows */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span>Flows Analyzed</span>
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums tracking-tight">
            {summary.totalFlows.toLocaleString()}
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Normal: <strong className="text-emerald-400 font-mono">{summary.normalFlows}</strong></span>
            <span>Suspicious: <strong className="text-red-400 font-mono">{summary.suspiciousFlows}</strong></span>
          </div>
        </div>

        {/* Critical Alerts */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span>Critical Alerts</span>
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-red-400 tabular-nums tracking-tight">
            {summary.criticalAlerts}
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            <span>Requiring immediate SOC triage</span>
          </div>
        </div>

        {/* High Risk Events */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span>High-Risk Events</span>
            <ShieldAlert className="w-3.5 h-3.5 text-orange-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-orange-400 tabular-nums tracking-tight">
            {summary.highRiskEvents}
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            <span>Score ≥ 70 / 100</span>
          </div>
        </div>

        {/* Overall Threat Score */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span>Perimeter Threat Index</span>
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-white tabular-nums tracking-tight">
              {summary.overallRiskScore}
            </span>
            <span className="text-xs text-slate-400 font-mono">/ 100</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                summary.overallRiskScore >= 70 ? 'bg-red-500' :
                summary.overallRiskScore >= 45 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${summary.overallRiskScore}%` }}
            />
          </div>
        </div>

        {/* Live Probe Status */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span>Ingestion Tap Probe</span>
            <Radio className={`w-3.5 h-3.5 ${isStreamActive ? 'text-cyan-400' : 'text-slate-500'}`} />
          </div>
          <div className="text-sm font-semibold text-white flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isStreamActive ? 'bg-emerald-400' : 'bg-slate-500'}`} />
            <span>{isStreamActive ? 'Ingress Stream Active' : 'Ingress Paused'}</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 font-mono">
            <span>eth0.mirror · {summary.systemStatus.modelLatencyMs}ms latency</span>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Traffic Volume & Threat Rate Area Chart */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Unidirectional Traffic Volume &amp; Malicious Anomalies</h3>
              <p className="text-xs text-slate-400 mt-0.5">Flow frequency versus detected cyber threat occurrences over time</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-cyan-500/80" /> Total Flows
              </span>
              <span className="flex items-center gap-1.5 text-red-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-red-500/80" /> Threats Flagged
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={summary.trafficVolumeOverTime} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorFlows" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
                <Area type="monotone" dataKey="flows" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorFlows)" name="Total Flows" />
                <Area type="monotone" dataKey="malicious" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorThreats)" name="Threats" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Threat Category Distribution Bar Chart */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-white">Threat Category Distribution</h3>
                <p className="text-xs text-slate-400 mt-0.5">Identified via CSE-CIC-IDS2017 RF model</p>
              </div>
              <button
                onClick={() => onNavigate('intelligence')}
                className="text-xs text-cyan-400 hover:underline flex items-center gap-0.5"
              >
                <span>Taxonomy</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={summary.threatDistribution}
                  layout="vertical"
                  margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                  <XAxis type="number" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke="#94a3b8"
                    fontSize={10}
                    tickLine={false}
                    width={90}
                    tickFormatter={(val) => val.replace(/_/g, ' ').slice(0, 12)}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                    formatter={(val: any, name: any, item: any) => [`${val} flows (${item.payload.percentage}%)`, item.payload.name.replace(/_/g, ' ')]}
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {summary.threatDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex justify-between">
            <span>Multiclass Supervised RF</span>
            <span className="font-mono text-cyan-400">Model v2.4.1</span>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Recent Alerts + Recent Analysis Runs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Alerts (2 Columns) */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Recent Security Alerts</h3>
              <p className="text-xs text-slate-400 mt-0.5">Actionable threat notifications triggered by unidirectional flow anomalies</p>
            </div>
            <button
              onClick={() => onNavigate('alerts')}
              className="text-xs text-cyan-400 hover:underline flex items-center gap-0.5"
            >
              <span>View All Alerts</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {summary.recentAlerts.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              No active security alerts recorded. All unidirectional traffic flows within nominal baseline.
            </div>
          ) : (
            <div className="space-y-2.5">
              {summary.recentAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-3 rounded-lg bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-colors flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                        alert.severity === 'critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                        alert.severity === 'high' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                        'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {alert.severity}
                    </span>
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-200 truncate">{alert.title}</div>
                      <div className="text-[11px] text-slate-400 truncate">
                        <span>Flow: <strong className="font-mono text-slate-300">{alert.flowId}</strong></span>
                        <span className="mx-1" aria-hidden="true">·</span>
                        <span className="font-mono">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
                      Risk: <strong className="text-white">{alert.riskScore}</strong>
                    </span>
                    {alert.status === 'new' && (
                      <button
                        onClick={() => onAcknowledgeAlert(alert.id)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                      >
                        Acknowledge
                      </button>
                    )}
                    <button
                      onClick={() => onSelectAlert(alert)}
                      className="px-2.5 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-medium transition-colors"
                    >
                      Investigate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* System & Model Information Widget */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white mb-1">Inference Engine Health</h3>
            <p className="text-xs text-slate-400 mb-4">FastAPI / Scikit-Learn Model Telemetry</p>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Core Service State</span>
                <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Healthy / Operational</span>
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Deployed Model</span>
                <span className="font-mono text-cyan-400 font-medium">RF-Ensemble v2.4.1</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Average Prediction Latency</span>
                <span className="font-mono text-slate-200 tabular-nums">1.6 ms / record</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Evaluation Accuracy</span>
                <span className="font-mono text-emerald-400 tabular-nums font-semibold">98.7%</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Unidirectional Tap Mode</span>
                <span className="font-mono text-slate-300">Passive SPAN (eth0.mirror)</span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
            <button
              onClick={() => onNavigate('model')}
              className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>Test Single-Flow Inference</span>
              <ChevronRight className="w-3 h-3" />
            </button>
            <span className="text-[10px] text-slate-500 font-mono">SIH26145 NTRO</span>
          </div>
        </div>
      </div>
    </div>
  );
};
