import React, { useState } from 'react';
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Play,
  ArrowRight,
  RefreshCw,
  Download,
  Info,
  ShieldAlert,
  FileSpreadsheet
} from 'lucide-react';
import { PRESET_DATASETS, parseCSVToRawFlows, PresetDataset } from '../data/sampleDatasets';
import { RawFlowInput, SUPPORTED_FEATURE_SCHEMA } from '../services/mlEngine';
import { AnalysisJob, TrafficFlow } from '../types';

interface TrafficAnalysisPageProps {
  onAnalyze: (name: string, records: RawFlowInput[], fileSize: number) => Promise<{ job: AnalysisJob; flows: TrafficFlow[] }>;
  onNavigateToExplorer: (jobId: string) => void;
}

export const TrafficAnalysisPage: React.FC<TrafficAnalysisPageProps> = ({
  onAnalyze,
  onNavigateToExplorer
}) => {
  const [selectedPreset, setSelectedPreset] = useState<PresetDataset | null>(null);
  const [customCsvContent, setCustomCsvContent] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<number>(0);
  const [previewRows, setPreviewRows] = useState<Array<Record<string, any>>>([]);
  const [columnsDetected, setColumnsDetected] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [lastAnalysisResult, setLastAnalysisResult] = useState<{ job: AnalysisJob; flows: TrafficFlow[] } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const loadPreset = (preset: PresetDataset) => {
    setSelectedPreset(preset);
    setFileName(preset.name);
    setFileSize(preset.fileSizeBytes);
    setCustomCsvContent(preset.csvContent);
    const parsed = parseCSVToRawFlows(preset.csvContent);
    setPreviewRows(parsed);
    if (parsed.length > 0) {
      setColumnsDetected(Object.keys(parsed[0]));
    }
    setErrorMsg('');
    setLastAnalysisResult(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv') && !file.name.endsWith('.txt')) {
      setErrorMsg('Please upload a valid CSV file (.csv format).');
      return;
    }

    setFileName(file.name);
    setFileSize(file.size);
    setSelectedPreset(null);
    setLastAnalysisResult(null);
    setErrorMsg('');

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCustomCsvContent(text);
      const parsed = parseCSVToRawFlows(text);
      if (parsed.length === 0) {
        setErrorMsg('The uploaded CSV appears empty or missing valid header rows.');
        setPreviewRows([]);
        setColumnsDetected([]);
        return;
      }
      setPreviewRows(parsed);
      setColumnsDetected(Object.keys(parsed[0]));
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setFileSize(file.size);
    setSelectedPreset(null);
    setLastAnalysisResult(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCustomCsvContent(text);
      const parsed = parseCSVToRawFlows(text);
      setPreviewRows(parsed);
      if (parsed.length > 0) {
        setColumnsDetected(Object.keys(parsed[0]));
      }
    };
    reader.readAsText(file);
  };

  const runAnalysis = async () => {
    if (!previewRows || previewRows.length === 0) {
      setErrorMsg('No flow records loaded for analysis.');
      return;
    }

    setIsAnalyzing(true);
    setProgress(15);
    setErrorMsg('');

    try {
      // Simulate stepped preprocessing progress
      const p1 = setTimeout(() => setProgress(45), 200);
      const p2 = setTimeout(() => setProgress(80), 400);

      const result = await onAnalyze(fileName || 'Custom-Flow-Batch.csv', previewRows, fileSize || 10240);

      clearTimeout(p1);
      clearTimeout(p2);
      setProgress(100);
      setTimeout(() => {
        setIsAnalyzing(false);
        setLastAnalysisResult(result);
      }, 300);
    } catch (err: any) {
      setIsAnalyzing(false);
      setErrorMsg(err.message || 'Analysis processing failed.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Unidirectional Network Traffic Ingestion &amp; Analysis</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Upload CSV captures or select standardized CSE-CIC-IDS2017 benchmark datasets for batch AI classification.
          </p>
        </div>
        <div className="text-xs text-slate-400 font-mono">
          <span>Schema: 26 Unidirectional Telemetry Attributes</span>
        </div>
      </div>

      {/* Preset Benchmarks Selector */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
          Standardized Benchmark Datasets (1-Click Load)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESET_DATASETS.map((p) => {
            const isSelected = selectedPreset?.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => loadPreset(p)}
                className={`p-3.5 rounded-xl border text-left transition-all text-xs flex flex-col justify-between ${
                  isSelected
                    ? 'bg-cyan-500/10 border-cyan-500/40 text-white shadow-lg shadow-cyan-500/5'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/60 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="font-semibold text-slate-200 flex items-center justify-between mb-1">
                    <span className="truncate">{p.name}</span>
                    <FileSpreadsheet className="w-3.5 h-3.5 text-cyan-400 shrink-0 ml-1" />
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="font-mono text-cyan-400">{p.recordCount} Flows</span>
                  <span className="truncate max-w-[120px]">{p.threatFocus}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* File Upload / Drag & Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="p-8 rounded-xl bg-slate-900/40 border-2 border-dashed border-slate-800 hover:border-cyan-500/40 transition-colors text-center cursor-pointer relative"
      >
        <input
          type="file"
          accept=".csv,.txt"
          onChange={handleFileUpload}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="w-12 h-12 rounded-full bg-cyan-500/10 text-cyan-400 mx-auto flex items-center justify-center mb-3">
          <Upload className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-semibold text-white mb-1">
          Drag &amp; Drop Network Flow CSV or Browse Files
        </h4>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Supports standard flow captures (NetFlow, IPFIX, CIC-IDS format). Automatically maps columns for Flow Duration, Packet Rates, TCP Flags, and Inter-Arrival Times.
        </p>
        <div className="mt-3 inline-flex items-center gap-2 text-xs text-cyan-400 font-medium">
          <span>Select local file</span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-400">Max size: 50MB</span>
        </div>
      </div>

      {/* Error notification */}
      {errorMsg && (
        <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Loaded Dataset Preview & Validation Section */}
      {previewRows.length > 0 && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white font-mono">{fileName}</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 text-[10px] font-mono border border-emerald-500/30">
                  Ready for AI Analysis
                </span>
              </div>
              <div className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                <span>{previewRows.length} Unidirectional Flow Records</span>
                <span>·</span>
                <span>{(fileSize / 1024).toFixed(1)} KB</span>
                <span>·</span>
                <span>{columnsDetected.length} Telemetry Columns</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={runAnalysis}
                disabled={isAnalyzing}
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-semibold text-xs transition-colors flex items-center gap-2 shadow-lg shadow-cyan-600/20"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing Inference...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Run AI Classification &amp; Scoring</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Progress bar during analysis */}
          {isAnalyzing && (
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Extracting 26 flow features and calculating decision tree split boundaries...</span>
                <span className="font-mono text-cyan-400 font-semibold">{progress}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-cyan-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Table Preview */}
          <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/40">
            <div className="px-4 py-3 bg-[#0b1120] border-b border-slate-800 text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Previewing First 5 Records</span>
              <span className="text-[11px] text-slate-400 font-normal">
                Passively collected forward-path data
              </span>
            </div>
            <div className="overflow-x-auto max-h-60">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 sticky top-0">
                  <tr>
                    {columnsDetected.slice(0, 8).map((col, idx) => (
                      <th key={idx} className="py-2.5 px-3 whitespace-nowrap font-sans font-medium">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {previewRows.slice(0, 5).map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-800/30">
                      {columnsDetected.slice(0, 8).map((col, cIdx) => (
                        <td key={cIdx} className="py-2 px-3 whitespace-nowrap tabular-nums">
                          {String(row[col] ?? '')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Result Banner */}
      {lastAnalysisResult && (
        <div className="p-6 rounded-xl bg-gradient-to-r from-slate-900 to-[#0b1329] border border-cyan-500/40 shadow-xl space-y-4 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Analysis Complete · {lastAnalysisResult.job.id}</span>
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Batch Successfully Evaluated with CyberShield-FlowNet
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Processed {lastAnalysisResult.flows.length} flows. Identified {lastAnalysisResult.job.threatsDetected} threat anomalies across unidirectional traffic channels.
              </p>
            </div>

            <button
              onClick={() => onNavigateToExplorer(lastAnalysisResult.job.id)}
              className="px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-2 shrink-0"
            >
              <span>Explore Filtered Results</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2 border-t border-slate-800">
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Total Valid Flows</span>
              <span className="text-xl font-bold font-mono text-white tabular-nums">
                {lastAnalysisResult.flows.length}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Threats Detected</span>
              <span className="text-xl font-bold font-mono text-red-400 tabular-nums">
                {lastAnalysisResult.job.threatsDetected}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Normal Baseline Flows</span>
              <span className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
                {lastAnalysisResult.job.normalFlows}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Average Batch Risk</span>
              <span className="text-xl font-bold font-mono text-cyan-400 tabular-nums">
                {lastAnalysisResult.job.avgRiskScore}/100
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
