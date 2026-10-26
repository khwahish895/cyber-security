import { PRESET_DATASETS, parseCSVToRawFlows } from '../data/sampleDatasets';
import {
  AlertStatus,
  AnalysisJob,
  AuditLog,
  DashboardSummary,
  ModelInfo,
  SecurityAlert,
  Severity,
  ThreatClass,
  TrafficFlow,
  UserProfile
} from '../types';
import { MODEL_METADATA, RawFlowInput, analyzeBatchFlows, classifyFlow, extractFlowFeatures } from './mlEngine';

// Local storage keys
const STORAGE_KEY_FLOWS = 'cybershield_flows_v2';
const STORAGE_KEY_ALERTS = 'cybershield_alerts_v2';
const STORAGE_KEY_JOBS = 'cybershield_jobs_v2';
const STORAGE_KEY_LOGS = 'cybershield_logs_v2';
const STORAGE_KEY_USER = 'cybershield_user_v2';

// Initial state seed generator
function createInitialState() {
  const initialJobId = 'JOB-2026-001';
  const initialDataset = PRESET_DATASETS[0];
  const parsedRecords = parseCSVToRawFlows(initialDataset.csvContent);
  const flows = analyzeBatchFlows(parsedRecords, initialJobId);

  // Generate alerts for medium, high, and critical threats
  const alerts: SecurityAlert[] = [];
  flows.forEach((flow, i) => {
    if (flow.predictedClass !== 'BENIGN' && (flow.severity === 'critical' || flow.severity === 'high' || flow.severity === 'medium')) {
      alerts.push({
        id: `ALT-2026-${String(alerts.length + 1).padStart(4, '0')}`,
        flowId: flow.id,
        title: `${flow.predictedClass.replace(/_/g, ' ')} Detected`,
        description: flow.explanation,
        threatClass: flow.predictedClass,
        severity: flow.severity,
        riskScore: flow.riskScore,
        status: alerts.length === 0 ? 'new' : alerts.length === 1 ? 'investigating' : 'acknowledged',
        timestamp: flow.timestamp,
        notes: [
          `Detected by CyberShield-FlowNet RF-Ensemble engine at ${new Date(flow.timestamp).toLocaleTimeString()}`,
          `Flow ${flow.id} flagged with ${flow.topFeatures.length} contributing feature deviations.`
        ]
      });
    }
  });

  const threatsCount = flows.filter(f => f.predictedClass !== 'BENIGN').length;
  const normalCount = flows.length - threatsCount;
  const avgRisk = Math.round(flows.reduce((acc, f) => acc + f.riskScore, 0) / flows.length);

  const jobs: AnalysisJob[] = [
    {
      id: initialJobId,
      datasetName: initialDataset.name,
      submissionTime: new Date(Date.now() - 3600000).toISOString(),
      completionTime: new Date(Date.now() - 3594000).toISOString(),
      status: 'completed',
      totalRecords: flows.length,
      validRecords: flows.length,
      invalidRecords: 0,
      threatsDetected: threatsCount,
      normalFlows: normalCount,
      avgRiskScore: avgRisk,
      criticalCount: flows.filter(f => f.severity === 'critical').length,
      highCount: flows.filter(f => f.severity === 'high').length,
      mediumCount: flows.filter(f => f.severity === 'medium').length,
      lowCount: flows.filter(f => f.severity === 'low').length,
      fileSizeBytes: initialDataset.fileSizeBytes
    }
  ];

  const auditLogs: AuditLog[] = [
    {
      id: 'LOG-001',
      timestamp: new Date(Date.now() - 3700000).toISOString(),
      user: 'Capt. Vikram Sengupta (SOC Lead)',
      action: 'SYSTEM_BOOT',
      resourceType: 'InferenceEngine',
      resourceId: 'CyberShield-FlowNet-v2.4.1',
      details: 'Passive unidirectional monitoring probe initialized on SPAN port eth0.'
    },
    {
      id: 'LOG-002',
      timestamp: new Date(Date.now() - 3595000).toISOString(),
      user: 'Capt. Vikram Sengupta (SOC Lead)',
      action: 'DATASET_ANALYSIS',
      resourceType: 'TrafficAnalysis',
      resourceId: initialJobId,
      details: `Processed dataset ${initialDataset.name} (24 flows, ${threatsCount} threats flagged).`
    }
  ];

  return { flows, alerts, jobs, auditLogs };
}

// In-memory / localStorage storage singleton
class TrafficStorage {
  private flows: TrafficFlow[] = [];
  private alerts: SecurityAlert[] = [];
  private jobs: AnalysisJob[] = [];
  private auditLogs: AuditLog[] = [];
  private user: UserProfile = {
    id: 'USR-8821',
    name: 'Capt. Vikram Sengupta',
    email: 'v.sengupta@ntro.gov.in',
    role: 'SecOps Lead',
    badgeNumber: 'NTRO-CYBER-8821',
    clearanceLevel: 'LEVEL 4 - RESTRICTED ACCESS'
  };

  constructor() {
    this.loadState();
  }

  private loadState() {
    try {
      const storedFlows = localStorage.getItem(STORAGE_KEY_FLOWS);
      const storedAlerts = localStorage.getItem(STORAGE_KEY_ALERTS);
      const storedJobs = localStorage.getItem(STORAGE_KEY_JOBS);
      const storedLogs = localStorage.getItem(STORAGE_KEY_LOGS);
      const storedUser = localStorage.getItem(STORAGE_KEY_USER);

      if (storedFlows && storedAlerts && storedJobs) {
        this.flows = JSON.parse(storedFlows);
        this.alerts = JSON.parse(storedAlerts);
        this.jobs = JSON.parse(storedJobs);
        this.auditLogs = storedLogs ? JSON.parse(storedLogs) : [];
        if (storedUser) this.user = JSON.parse(storedUser);
      } else {
        const initial = createInitialState();
        this.flows = initial.flows;
        this.alerts = initial.alerts;
        this.jobs = initial.jobs;
        this.auditLogs = initial.auditLogs;
        this.saveState();
      }
    } catch {
      const initial = createInitialState();
      this.flows = initial.flows;
      this.alerts = initial.alerts;
      this.jobs = initial.jobs;
      this.auditLogs = initial.auditLogs;
    }
  }

  private saveState() {
    try {
      localStorage.setItem(STORAGE_KEY_FLOWS, JSON.stringify(this.flows));
      localStorage.setItem(STORAGE_KEY_ALERTS, JSON.stringify(this.alerts));
      localStorage.setItem(STORAGE_KEY_JOBS, JSON.stringify(this.jobs));
      localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(this.auditLogs));
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(this.user));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }

  public getFlows(): TrafficFlow[] {
    return this.flows;
  }

  public getAlerts(): SecurityAlert[] {
    return this.alerts;
  }

  public getJobs(): AnalysisJob[] {
    return this.jobs;
  }

  public getLogs(): AuditLog[] {
    return this.auditLogs;
  }

  public getUser(): UserProfile {
    return this.user;
  }

  public setUser(user: UserProfile) {
    this.user = user;
    this.saveState();
  }

  public addAuditLog(action: string, resourceType: string, resourceId: string, details: string) {
    const log: AuditLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      user: this.user.name,
      action,
      resourceType,
      resourceId,
      details
    };
    this.auditLogs.unshift(log);
    if (this.auditLogs.length > 100) this.auditLogs = this.auditLogs.slice(0, 100);
    this.saveState();
  }

  public addAnalysis(jobName: string, records: RawFlowInput[], fileSizeBytes: number): { job: AnalysisJob; flows: TrafficFlow[] } {
    const jobId = `JOB-2026-${String(this.jobs.length + 1).padStart(3, '0')}`;
    const newFlows = analyzeBatchFlows(records, jobId);

    // Prepend new flows
    this.flows = [...newFlows, ...this.flows];

    // Create alerts for threats
    newFlows.forEach(flow => {
      if (flow.predictedClass !== 'BENIGN' && flow.riskScore >= 45) {
        this.alerts.unshift({
          id: `ALT-2026-${String(this.alerts.length + 1).padStart(4, '0')}`,
          flowId: flow.id,
          title: `${flow.predictedClass.replace(/_/g, ' ')} Detected`,
          description: flow.explanation,
          threatClass: flow.predictedClass,
          severity: flow.severity,
          riskScore: flow.riskScore,
          status: 'new',
          timestamp: flow.timestamp,
          notes: [`Flagged automatically during analysis of ${jobName}`]
        });
      }
    });

    const threatsCount = newFlows.filter(f => f.predictedClass !== 'BENIGN').length;
    const normalCount = newFlows.length - threatsCount;
    const avgRisk = newFlows.length ? Math.round(newFlows.reduce((a, b) => a + b.riskScore, 0) / newFlows.length) : 0;

    const job: AnalysisJob = {
      id: jobId,
      datasetName: jobName,
      submissionTime: new Date().toISOString(),
      completionTime: new Date(Date.now() + 1200).toISOString(),
      status: 'completed',
      totalRecords: records.length,
      validRecords: newFlows.length,
      invalidRecords: records.length - newFlows.length,
      threatsDetected: threatsCount,
      normalFlows: normalCount,
      avgRiskScore: avgRisk,
      criticalCount: newFlows.filter(f => f.severity === 'critical').length,
      highCount: newFlows.filter(f => f.severity === 'high').length,
      mediumCount: newFlows.filter(f => f.severity === 'medium').length,
      lowCount: newFlows.filter(f => f.severity === 'low').length,
      fileSizeBytes
    };

    this.jobs.unshift(job);
    this.addAuditLog('DATASET_ANALYZED', 'TrafficJob', jobId, `Analyzed ${newFlows.length} flows from ${jobName} with ${threatsCount} threats.`);
    this.saveState();
    return { job, flows: newFlows };
  }

  public updateAlert(id: string, status: AlertStatus, note?: string): SecurityAlert | null {
    const alert = this.alerts.find(a => a.id === id);
    if (!alert) return null;

    alert.status = status;
    if (status === 'acknowledged') alert.acknowledgedAt = new Date().toISOString();
    if (status === 'resolved') alert.resolvedAt = new Date().toISOString();
    if (note) {
      if (!alert.notes) alert.notes = [];
      alert.notes.push(`[${new Date().toLocaleTimeString()}] ${note}`);
    }

    this.addAuditLog('ALERT_STATUS_UPDATE', 'SecurityAlert', id, `Alert ${id} transitioned to '${status}'`);
    this.saveState();
    return alert;
  }

  public resetToDefaults() {
    localStorage.removeItem(STORAGE_KEY_FLOWS);
    localStorage.removeItem(STORAGE_KEY_ALERTS);
    localStorage.removeItem(STORAGE_KEY_JOBS);
    localStorage.removeItem(STORAGE_KEY_LOGS);
    const initial = createInitialState();
    this.flows = initial.flows;
    this.alerts = initial.alerts;
    this.jobs = initial.jobs;
    this.auditLogs = initial.auditLogs;
    this.saveState();
  }
}

export const storage = new TrafficStorage();

// API Client
export const api = {
  // Health
  async getHealth() {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: 'v2.4.1',
      engine: 'Random Forest Ensemble (CSE-CIC-IDS2017)',
      trafficCapture: 'Unidirectional Passive Ingress Tap'
    };
  },

  // Dashboard summary
  async getDashboardSummary(): Promise<DashboardSummary> {
    const flows = storage.getFlows();
    const alerts = storage.getAlerts();
    const jobs = storage.getJobs();

    const normalFlows = flows.filter(f => f.predictedClass === 'BENIGN').length;
    const suspiciousFlows = flows.length - normalFlows;
    const criticalAlerts = alerts.filter(a => a.severity === 'critical' && a.status !== 'resolved').length;
    const highRiskEvents = flows.filter(f => f.riskScore >= 70).length;
    const overallRiskScore = flows.length > 0
      ? Math.round(flows.reduce((acc, f) => acc + f.riskScore, 0) / flows.length)
      : 0;

    // Threat distribution
    const classCounts: Record<ThreatClass, number> = {
      BENIGN: 0,
      DDoS_SYN_Flood: 0,
      PortScan: 0,
      SSH_BruteForce: 0,
      Botnet_C2: 0,
      Infiltration: 0,
      Web_Attack: 0
    };
    flows.forEach(f => {
      if (classCounts[f.predictedClass] !== undefined) {
        classCounts[f.predictedClass]++;
      }
    });

    const threatColors: Record<ThreatClass, string> = {
      BENIGN: '#10b981', // emerald
      DDoS_SYN_Flood: '#ef4444', // red
      PortScan: '#f59e0b', // amber
      SSH_BruteForce: '#f97316', // orange
      Botnet_C2: '#dc2626', // dark red
      Infiltration: '#a855f7', // purple
      Web_Attack: '#06b6d4' // cyan
    };

    const threatDistribution = (Object.keys(classCounts) as ThreatClass[])
      .map(name => ({
        name,
        count: classCounts[name],
        percentage: flows.length > 0 ? Math.round((classCounts[name] / flows.length) * 100) : 0,
        color: threatColors[name]
      }))
      .filter(item => item.count > 0);

    // Severity distribution
    const sevCounts: Record<Severity, number> = {
      normal: 0,
      low: 0,
      medium: 0,
      high: 0,
      critical: 0
    };
    flows.forEach(f => {
      if (sevCounts[f.severity] !== undefined) sevCounts[f.severity]++;
    });

    const severityDistribution: Array<{ severity: Severity; count: number; color: string }> = [
      { severity: 'normal', count: sevCounts.normal, color: '#10b981' },
      { severity: 'low', count: sevCounts.low, color: '#38bdf8' },
      { severity: 'medium', count: sevCounts.medium, color: '#f59e0b' },
      { severity: 'high', count: sevCounts.high, color: '#f97316' },
      { severity: 'critical', count: sevCounts.critical, color: '#ef4444' }
    ];

    // Volume over time (grouped in chronological buckets)
    const timeBuckets: Record<string, { flows: number; malicious: number }> = {};
    const sorted = [...flows].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    sorted.forEach(f => {
      const d = new Date(f.timestamp);
      const timeKey = `${String(d.getHours()).padStart(2, '0')}:${String(Math.floor(d.getMinutes() / 10) * 10).padStart(2, '0')}`;
      if (!timeBuckets[timeKey]) {
        timeBuckets[timeKey] = { flows: 0, malicious: 0 };
      }
      timeBuckets[timeKey].flows++;
      if (f.predictedClass !== 'BENIGN') {
        timeBuckets[timeKey].malicious++;
      }
    });

    const trafficVolumeOverTime = Object.keys(timeBuckets).map(time => ({
      time,
      flows: timeBuckets[time].flows,
      malicious: timeBuckets[time].malicious
    }));

    return {
      totalFlows: flows.length,
      normalFlows,
      suspiciousFlows,
      criticalAlerts,
      highRiskEvents,
      overallRiskScore,
      riskTrend: -4.2,
      trafficVolumeOverTime: trafficVolumeOverTime.length > 0 ? trafficVolumeOverTime : [
        { time: '06:00', flows: 14, malicious: 2 },
        { time: '06:15', flows: 28, malicious: 6 },
        { time: '06:30', flows: 42, malicious: 15 },
        { time: '06:45', flows: 31, malicious: 8 },
        { time: '07:00', flows: 24, malicious: 5 }
      ],
      threatDistribution,
      severityDistribution,
      recentAlerts: alerts.slice(0, 5),
      recentJobs: jobs.slice(0, 4),
      systemStatus: {
        engine: 'online',
        lastAnalysis: jobs[0]?.completionTime || new Date().toISOString(),
        modelLatencyMs: MODEL_METADATA.inferenceLatencyMs,
        modelVersion: MODEL_METADATA.version,
        ingestionRateFlowsPerSec: 420
      }
    };
  },

  // Traffic Flows
  async getTrafficFlows(filters?: {
    search?: string;
    threatClass?: string;
    severity?: string;
    minRisk?: number;
    maxRisk?: number;
    jobId?: string;
  }): Promise<TrafficFlow[]> {
    let list = storage.getFlows();

    if (filters) {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        list = list.filter(f =>
          f.id.toLowerCase().includes(q) ||
          f.srcIp.includes(q) ||
          f.dstIp.includes(q) ||
          String(f.srcPort).includes(q) ||
          String(f.dstPort).includes(q) ||
          f.predictedClass.toLowerCase().includes(q)
        );
      }
      if (filters.threatClass && filters.threatClass !== 'ALL') {
        list = list.filter(f => f.predictedClass === filters.threatClass);
      }
      if (filters.severity && filters.severity !== 'ALL') {
        list = list.filter(f => f.severity === filters.severity);
      }
      if (filters.minRisk !== undefined) {
        list = list.filter(f => f.riskScore >= filters.minRisk!);
      }
      if (filters.maxRisk !== undefined) {
        list = list.filter(f => f.riskScore <= filters.maxRisk!);
      }
      if (filters.jobId && filters.jobId !== 'ALL') {
        list = list.filter(f => f.analysisJobId === filters.jobId);
      }
    }

    return list;
  },

  async getTrafficFlowById(id: string): Promise<TrafficFlow | null> {
    return storage.getFlows().find(f => f.id === id) || null;
  },

  // Alerts
  async getSecurityAlerts(statusFilter?: string): Promise<SecurityAlert[]> {
    let alerts = storage.getAlerts();
    if (statusFilter && statusFilter !== 'ALL') {
      alerts = alerts.filter(a => a.status === statusFilter);
    }
    return alerts;
  },

  async updateAlert(id: string, status: AlertStatus, note?: string): Promise<SecurityAlert | null> {
    return storage.updateAlert(id, status, note);
  },

  // Analyses
  async getAnalyses(): Promise<AnalysisJob[]> {
    return storage.getJobs();
  },

  async getAnalysisById(id: string): Promise<AnalysisJob | null> {
    return storage.getJobs().find(j => j.id === id) || null;
  },

  async uploadAndAnalyze(datasetName: string, records: RawFlowInput[], fileSize: number) {
    return storage.addAnalysis(datasetName, records, fileSize);
  },

  // Model info
  async getModelInfo(): Promise<ModelInfo> {
    return MODEL_METADATA;
  },

  // Live single-flow test inference
  async predictSingleFlow(raw: RawFlowInput) {
    const features = extractFlowFeatures(raw);
    const classification = classifyFlow(features);
    return {
      features,
      ...classification
    };
  },

  // Audit logs
  async getAuditLogs(): Promise<AuditLog[]> {
    return storage.getLogs();
  },

  // Reset
  async resetDemoData() {
    storage.resetToDefaults();
    return true;
  }
};
