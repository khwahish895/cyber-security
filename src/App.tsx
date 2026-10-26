import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { OverviewDashboard } from './pages/OverviewDashboard';
import { TrafficAnalysisPage } from './pages/TrafficAnalysisPage';
import { ThreatExplorerPage } from './pages/ThreatExplorerPage';
import { ThreatIntelligencePage } from './pages/ThreatIntelligencePage';
import { AlertsCenterPage } from './pages/AlertsCenterPage';
import { AnalyticsReportsPage } from './pages/AnalyticsReportsPage';
import { ModelManagementPage } from './pages/ModelManagementPage';
import { SettingsPage } from './pages/SettingsPage';
import { DetailModal } from './components/DetailModal';
import { ReportModal } from './components/ReportModal';
import { SihDocModal } from './components/SihDocModal';
import { AuthModal } from './components/AuthModal';

import { api, storage } from './services/api';
import {
  DashboardSummary,
  TrafficFlow,
  SecurityAlert,
  ModelInfo,
  UserProfile,
  AuditLog,
  AlertStatus
} from './types';
import { MODEL_METADATA, classifyFlow, extractFlowFeatures } from './services/mlEngine';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [flows, setFlows] = useState<TrafficFlow[]>([]);
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [user, setUser] = useState<UserProfile>(storage.getUser());
  const [modelInfo, setModelInfo] = useState<ModelInfo>(MODEL_METADATA);

  // Modals state
  const [inspectedFlow, setInspectedFlow] = useState<TrafficFlow | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isSihModalOpen, setIsSihModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Filter state for explorer
  const [selectedJobIdForExplorer, setSelectedJobIdForExplorer] = useState<string | undefined>(undefined);
  const [anonymizeIps, setAnonymizeIps] = useState<boolean>(false);

  // Live tap stream simulation
  const [isStreamActive, setIsStreamActive] = useState<boolean>(true);

  // Load state from API
  const refreshData = useCallback(async () => {
    try {
      const sum = await api.getDashboardSummary();
      const flws = await api.getTrafficFlows();
      const alrts = await api.getSecurityAlerts();
      const logs = await api.getAuditLogs();
      const mdl = await api.getModelInfo();

      setSummary(sum);
      setFlows(flws);
      setAlerts(alrts);
      setAuditLogs(logs);
      setModelInfo(mdl);
    } catch (e) {
      console.error('Failed to load dashboard data:', e);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Live Stream Ingestion Generator (runs every 10 seconds if active)
  useEffect(() => {
    if (!isStreamActive) return;

    const interval = setInterval(() => {
      // Simulate passive incoming flow from SPAN tap
      const isAnomalous = Math.random() < 0.25;
      const samplePorts = [80, 443, 53, 22, 8080, 23, 8888];
      const dstPort = isAnomalous
        ? samplePorts[Math.floor(Math.random() * samplePorts.length)]
        : (Math.random() > 0.5 ? 443 : 80);

      const raw = {
        protocol: dstPort === 53 ? 'UDP' : 'TCP',
        dstPort,
        srcPort: 49000 + Math.floor(Math.random() * 15000),
        srcIp: `192.168.10.${Math.floor(Math.random() * 200) + 1}`,
        dstIp: `172.16.0.${Math.floor(Math.random() * 10) + 1}`,
        flowDurationMs: isAnomalous ? Math.floor(Math.random() * 400) : 180 + Math.floor(Math.random() * 200),
        totalFwdPackets: isAnomalous ? (dstPort === 80 ? 350 : 2) : 12,
        totalFwdBytes: isAnomalous ? 18000 : 8400,
        synFlagCount: isAnomalous && dstPort === 80 ? 300 : 1,
        ackFlagCount: isAnomalous && dstPort === 80 ? 0 : 12,
        packetIATMean: isAnomalous ? 0.8 : 22.0
      };

      const features = extractFlowFeatures(raw);
      const classification = classifyFlow(features);

      const newFlow: TrafficFlow = {
        id: `FLW-${new Date().getFullYear()}-${String(storage.getFlows().length + 1).padStart(5, '0')}`,
        timestamp: new Date().toISOString(),
        protocol: features.protocol,
        srcIp: features.srcIp,
        dstIp: features.dstIp,
        srcPort: features.srcPort,
        dstPort: features.dstPort,
        flowDurationMs: features.flowDurationMs,
        totalFwdPackets: features.totalFwdPackets,
        totalFwdBytes: features.totalFwdBytes,
        fwdPacketLengthMax: features.fwdPacketLengthMax,
        fwdPacketLengthMean: features.fwdPacketLengthMean,
        flowBytesPerSec: features.flowBytesPerSec,
        flowPacketsPerSec: features.flowPacketsPerSec,
        packetIATMean: features.packetIATMean,
        packetIATStd: features.packetIATStd,
        synFlagCount: features.synFlagCount,
        finFlagCount: features.finFlagCount,
        rstFlagCount: features.rstFlagCount,
        pshFlagCount: features.pshFlagCount,
        ackFlagCount: features.ackFlagCount,
        isUnidirectional: true,
        analysisJobId: 'JOB-STREAM-LIVE',
        ...classification
      };

      // Add to flows
      setFlows((prev) => [newFlow, ...prev.slice(0, 199)]);

      // If threat, create alert
      if (newFlow.predictedClass !== 'BENIGN' && newFlow.riskScore >= 45) {
        const newAlert: SecurityAlert = {
          id: `ALT-2026-${String(storage.getAlerts().length + 1).padStart(4, '0')}`,
          flowId: newFlow.id,
          title: `${newFlow.predictedClass.replace(/_/g, ' ')} Detected`,
          description: newFlow.explanation,
          threatClass: newFlow.predictedClass,
          severity: newFlow.severity,
          riskScore: newFlow.riskScore,
          status: 'new',
          timestamp: newFlow.timestamp,
          notes: ['Passive stream tap event flagged in real time.']
        };
        setAlerts((prev) => [newAlert, ...prev]);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [isStreamActive]);

  // Handle analysis
  const handleAnalyzeDataset = async (name: string, records: any[], fileSize: number) => {
    const result = await api.uploadAndAnalyze(name, records, fileSize);
    await refreshData();
    return result;
  };

  // Handle alert update
  const handleUpdateAlert = async (id: string, status: AlertStatus, note?: string) => {
    await api.updateAlert(id, status, note);
    await refreshData();
  };

  // Handle flow correlation from alert
  const handleInspectFlowFromAlert = (flowId: string) => {
    const found = flows.find(f => f.id === flowId);
    if (found) {
      setInspectedFlow(found);
    }
  };

  const handleResetData = async () => {
    await api.resetDemoData();
    await refreshData();
  };

  const unreadAlertsCount = alerts.filter(a => a.status === 'new').length;

  return (
    <div className="min-h-screen bg-[#080c16] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30">
      {/* Top Navbar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={(page) => setCurrentPage(page)}
        user={user}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenSihDocs={() => setIsSihModalOpen(true)}
        isStreamActive={isStreamActive}
        onToggleStream={() => setIsStreamActive(!isStreamActive)}
        unreadAlertsCount={unreadAlertsCount}
      />

      {/* Main View Area */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 lg:px-8 py-6">
        {currentPage === 'landing' && (
          <LandingPage
            onEnterDashboard={() => setCurrentPage('dashboard')}
            onExploreCapabilities={() => setCurrentPage('intelligence')}
            onOpenSihBrief={() => setIsSihModalOpen(true)}
          />
        )}

        {currentPage === 'dashboard' && summary && (
          <OverviewDashboard
            summary={summary}
            onRefresh={refreshData}
            onNavigate={(p) => setCurrentPage(p)}
            onSelectAlert={(a) => {
              const f = flows.find(item => item.id === a.flowId);
              if (f) setInspectedFlow(f);
            }}
            onAcknowledgeAlert={(id) => handleUpdateAlert(id, 'acknowledged')}
            isStreamActive={isStreamActive}
            onToggleStream={() => setIsStreamActive(!isStreamActive)}
          />
        )}

        {currentPage === 'analysis' && (
          <TrafficAnalysisPage
            onAnalyze={handleAnalyzeDataset}
            onNavigateToExplorer={(jobId) => {
              setSelectedJobIdForExplorer(jobId);
              setCurrentPage('explorer');
            }}
          />
        )}

        {currentPage === 'explorer' && (
          <ThreatExplorerPage
            flows={flows}
            onSelectFlow={(f) => setInspectedFlow(f)}
            selectedJobId={selectedJobIdForExplorer}
            onClearJobFilter={() => setSelectedJobIdForExplorer(undefined)}
            anonymizeIps={anonymizeIps}
            onToggleAnonymize={() => setAnonymizeIps(!anonymizeIps)}
          />
        )}

        {currentPage === 'intelligence' && (
          <ThreatIntelligencePage modelInfo={modelInfo} />
        )}

        {currentPage === 'alerts' && (
          <AlertsCenterPage
            alerts={alerts}
            onUpdateAlert={handleUpdateAlert}
            onInspectFlow={handleInspectFlowFromAlert}
          />
        )}

        {currentPage === 'analytics' && summary && (
          <AnalyticsReportsPage
            summary={summary}
            modelInfo={modelInfo}
            onOpenReportModal={() => setIsReportModalOpen(true)}
          />
        )}

        {currentPage === 'model' && (
          <ModelManagementPage modelInfo={modelInfo} />
        )}

        {currentPage === 'settings' && (
          <SettingsPage
            user={user}
            onUpdateUser={(u) => {
              setUser(u);
              storage.setUser(u);
            }}
            anonymizeIps={anonymizeIps}
            onToggleAnonymize={() => setAnonymizeIps(!anonymizeIps)}
            auditLogs={auditLogs}
            onResetData={handleResetData}
          />
        )}
      </main>

      {/* Modals & Overlays */}
      <DetailModal
        flow={inspectedFlow}
        onClose={() => setInspectedFlow(null)}
        anonymizeIps={anonymizeIps}
      />

      {isReportModalOpen && summary && (
        <ReportModal
          summary={summary}
          onClose={() => setIsReportModalOpen(false)}
        />
      )}

      {isSihModalOpen && (
        <SihDocModal
          onClose={() => setIsSihModalOpen(false)}
        />
      )}

      {isAuthModalOpen && (
        <AuthModal
          currentUser={user}
          onSelectUser={(u) => {
            setUser(u);
            storage.setUser(u);
          }}
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}
    </div>
  );
}
