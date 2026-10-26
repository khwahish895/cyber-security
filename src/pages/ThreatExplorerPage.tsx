import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  Eye,
  SlidersHorizontal,
  ArrowUpDown,
  ShieldAlert,
  CheckCircle2,
  Lock,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { TrafficFlow, ThreatClass, Severity } from '../types';

interface ThreatExplorerPageProps {
  flows: TrafficFlow[];
  onSelectFlow: (flow: TrafficFlow) => void;
  selectedJobId?: string;
  onClearJobFilter?: () => void;
  anonymizeIps: boolean;
  onToggleAnonymize: () => void;
}

export const ThreatExplorerPage: React.FC<ThreatExplorerPageProps> = ({
  flows,
  onSelectFlow,
  selectedJobId,
  onClearJobFilter,
  anonymizeIps,
  onToggleAnonymize
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedThreatClass, setSelectedThreatClass] = useState<string>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [minRisk, setMinRisk] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const rowsPerPage = 12;

  const maskIp = (ip: string) => {
    if (!anonymizeIps) return ip;
    const parts = ip.split('.');
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.${parts[2]}.xxx`;
    }
    return ip;
  };

  const filteredFlows = useMemo(() => {
    return flows.filter((f) => {
      // Job filter
      if (selectedJobId && f.analysisJobId !== selectedJobId) {
        return false;
      }
      // Threat class filter
      if (selectedThreatClass !== 'ALL' && f.predictedClass !== selectedThreatClass) {
        return false;
      }
      // Severity filter
      if (selectedSeverity !== 'ALL' && f.severity !== selectedSeverity) {
        return false;
      }
      // Risk filter
      if (f.riskScore < minRisk) {
        return false;
      }
      // Search term
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matches =
          f.id.toLowerCase().includes(q) ||
          f.srcIp.includes(q) ||
          f.dstIp.includes(q) ||
          String(f.srcPort).includes(q) ||
          String(f.dstPort).includes(q) ||
          f.predictedClass.toLowerCase().includes(q) ||
          f.protocol.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [flows, selectedJobId, selectedThreatClass, selectedSeverity, minRisk, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredFlows.length / rowsPerPage));
  const paginatedFlows = filteredFlows.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const exportFilteredCsv = () => {
    if (filteredFlows.length === 0) return;
    const headers = [
      'Flow ID', 'Timestamp', 'Protocol', 'Source IP', 'Source Port',
      'Destination IP', 'Destination Port', 'Duration (ms)', 'Total Fwd Packets',
      'Predicted Class', 'Confidence', 'Risk Score', 'Severity', 'Batch Job'
    ];
    const rows = filteredFlows.map(f => [
      f.id,
      f.timestamp,
      f.protocol,
      maskIp(f.srcIp),
      f.srcPort,
      maskIp(f.dstIp),
      f.dstPort,
      f.flowDurationMs,
      f.totalFwdPackets,
      f.predictedClass,
      f.confidence,
      f.riskScore,
      f.severity,
      f.analysisJobId
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CyberShield_Threat_Flows_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Threat Detection Explorer</span>
            <span className="text-xs font-mono font-normal text-slate-400">
              · {filteredFlows.length} Matches
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Query, filter, and inspect unidirectional flow metadata and machine learning classification evidence.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Anonymize IP toggle */}
          <button
            onClick={onToggleAnonymize}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
              anonymizeIps
                ? 'bg-indigo-500/15 border-indigo-500/40 text-indigo-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Mask last octet of IP addresses for privacy compliance"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{anonymizeIps ? 'IP Privacy: Masked' : 'IP Privacy: Raw'}</span>
          </button>

          {/* Export CSV button */}
          <button
            onClick={exportFilteredCsv}
            disabled={filteredFlows.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-medium transition-colors disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Search input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search Flow ID, IP, port, or class..."
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Threat Class select */}
          <div>
            <select
              value={selectedThreatClass}
              onChange={(e) => {
                setSelectedThreatClass(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Threat Classes</option>
              <option value="BENIGN">BENIGN (Normal)</option>
              <option value="DDoS_SYN_Flood">DDoS SYN Flood</option>
              <option value="PortScan">PortScan (Recon)</option>
              <option value="SSH_BruteForce">SSH BruteForce</option>
              <option value="Botnet_C2">Botnet C2 Beacon</option>
              <option value="Infiltration">Infiltration</option>
              <option value="Web_Attack">Web Attack</option>
            </select>
          </div>

          {/* Severity select */}
          <div>
            <select
              value={selectedSeverity}
              onChange={(e) => {
                setSelectedSeverity(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Severities</option>
              <option value="critical">Critical Severity</option>
              <option value="high">High Severity</option>
              <option value="medium">Medium Severity</option>
              <option value="low">Low Severity</option>
              <option value="normal">Normal (Nominal)</option>
            </select>
          </div>

          {/* Min Risk Slider */}
          <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-400 whitespace-nowrap">Min Risk:</span>
            <input
              type="range"
              min="0"
              max="95"
              step="5"
              value={minRisk}
              onChange={(e) => {
                setMinRisk(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="w-full accent-cyan-500"
            />
            <span className="font-mono text-cyan-400 font-bold tabular-nums w-7 text-right">
              {minRisk}
            </span>
          </div>
        </div>

        {/* Active batch job filter indicator */}
        {selectedJobId && (
          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Filtering by Batch Job:</span>
              <span className="font-mono text-cyan-400 font-semibold">{selectedJobId}</span>
            </div>
            {onClearJobFilter && (
              <button
                onClick={onClearJobFilter}
                className="text-cyan-400 hover:underline"
              >
                Clear Job Filter
              </button>
            )}
          </div>
        )}
      </div>

      {/* Flow Records Data Table */}
      <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/40">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0b1120] text-slate-400 border-b border-slate-800 font-medium font-sans">
              <tr>
                <th className="py-3 px-3.5">Flow ID</th>
                <th className="py-3 px-3.5">Timestamp</th>
                <th className="py-3 px-3.5">Proto</th>
                <th className="py-3 px-3.5">Source Endpoint</th>
                <th className="py-3 px-3.5">Destination Endpoint</th>
                <th className="py-3 px-3.5">Classification</th>
                <th className="py-3 px-3.5 text-right">Confidence</th>
                <th className="py-3 px-3.5 text-right">Risk Score</th>
                <th className="py-3 px-3.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
              {paginatedFlows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-xs text-slate-500 font-sans">
                    No flows match the specified search and filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedFlows.map((flow) => {
                  const isBenign = flow.predictedClass === 'BENIGN';
                  return (
                    <tr key={flow.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-2.5 px-3.5 text-cyan-400 font-semibold whitespace-nowrap">
                        {flow.id}
                      </td>
                      <td className="py-2.5 px-3.5 text-slate-400 whitespace-nowrap">
                        {new Date(flow.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="py-2.5 px-3.5 whitespace-nowrap">
                        <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                          {flow.protocol}
                        </span>
                      </td>
                      <td className="py-2.5 px-3.5 whitespace-nowrap">
                        <span className="text-slate-200">{maskIp(flow.srcIp)}</span>
                        <span className="text-slate-500 text-[11px]">:{flow.srcPort}</span>
                      </td>
                      <td className="py-2.5 px-3.5 whitespace-nowrap">
                        <span className="text-slate-200">{maskIp(flow.dstIp)}</span>
                        <span className="text-slate-500 text-[11px]">:{flow.dstPort}</span>
                      </td>
                      <td className="py-2.5 px-3.5 font-sans whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isBenign ? 'bg-emerald-400' :
                              flow.severity === 'critical' ? 'bg-red-400' :
                              flow.severity === 'high' ? 'bg-orange-400' : 'bg-amber-400'
                            }`}
                          />
                          <span className={`font-medium ${isBenign ? 'text-emerald-400' : 'text-white'}`}>
                            {flow.predictedClass.replace(/_/g, ' ')}
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3.5 text-right tabular-nums whitespace-nowrap">
                        {(flow.confidence * 100).toFixed(1)}%
                      </td>
                      <td className="py-2.5 px-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-12 bg-slate-800 h-1 rounded-full overflow-hidden hidden sm:block">
                            <div
                              className={`h-full ${
                                flow.riskScore >= 70 ? 'bg-red-500' :
                                flow.riskScore >= 45 ? 'bg-amber-500' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${flow.riskScore}%` }}
                            />
                          </div>
                          <span className="font-bold text-white tabular-nums">{flow.riskScore}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3.5 text-center font-sans whitespace-nowrap">
                        <button
                          onClick={() => onSelectFlow(flow)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-600 hover:text-white text-slate-300 text-[11px] font-medium transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-4 py-3 bg-[#0b1120] border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div>
            Showing <strong className="text-white font-mono">{filteredFlows.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1}</strong> to{' '}
            <strong className="text-white font-mono">{Math.min(filteredFlows.length, currentPage * rowsPerPage)}</strong> of{' '}
            <strong className="text-white font-mono">{filteredFlows.length}</strong> flows
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-40 text-slate-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-slate-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-40 text-slate-300"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
