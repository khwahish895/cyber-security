export type Protocol = 'TCP' | 'UDP' | 'ICMP';

export type ThreatClass = 
  | 'BENIGN'
  | 'DDoS_SYN_Flood'
  | 'PortScan'
  | 'SSH_BruteForce'
  | 'Botnet_C2'
  | 'Infiltration'
  | 'Web_Attack';

export type Severity = 'normal' | 'low' | 'medium' | 'high' | 'critical';

export interface FeatureContribution {
  name: string;
  value: number | string;
  contribution: number; // -1 to 1 (importance)
  direction: 'malicious' | 'benign';
  thresholdExplanation?: string;
}

export interface TrafficFlow {
  id: string;
  timestamp: string;
  protocol: Protocol;
  srcIp: string;
  dstIp: string;
  srcPort: number;
  dstPort: number;
  flowDurationMs: number;
  totalFwdPackets: number;
  totalFwdBytes: number;
  fwdPacketLengthMax: number;
  fwdPacketLengthMean: number;
  flowBytesPerSec: number;
  flowPacketsPerSec: number;
  packetIATMean: number;
  packetIATStd: number;
  synFlagCount: number;
  finFlagCount: number;
  rstFlagCount: number;
  pshFlagCount: number;
  ackFlagCount: number;
  isUnidirectional: boolean;
  predictedClass: ThreatClass;
  confidence: number; // 0 - 1
  riskScore: number; // 0 - 100
  severity: Severity;
  analysisJobId: string;
  explanation: string;
  topFeatures: FeatureContribution[];
}

export type AlertStatus = 'new' | 'investigating' | 'acknowledged' | 'resolved';

export interface SecurityAlert {
  id: string;
  flowId: string;
  title: string;
  description: string;
  threatClass: ThreatClass;
  severity: Severity;
  riskScore: number;
  status: AlertStatus;
  timestamp: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
  notes?: string[];
  assignedTo?: string;
}

export interface AnalysisJob {
  id: string;
  datasetName: string;
  submissionTime: string;
  completionTime: string;
  status: 'completed' | 'processing' | 'failed';
  totalRecords: number;
  validRecords: number;
  invalidRecords: number;
  threatsDetected: number;
  normalFlows: number;
  avgRiskScore: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  fileSizeBytes: number;
}

export interface ModelInfo {
  name: string;
  version: string;
  modelType: string;
  trainingDataset: string;
  trainingTimestamp: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  inferenceLatencyMs: number;
  supportedClasses: ThreatClass[];
  featureSchema: string[];
  classMetrics: Record<ThreatClass, { precision: number; recall: number; f1: number; support: number }>;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resourceType: string;
  resourceId: string;
  details: string;
}

export interface DashboardSummary {
  totalFlows: number;
  normalFlows: number;
  suspiciousFlows: number;
  criticalAlerts: number;
  highRiskEvents: number;
  overallRiskScore: number;
  riskTrend: number; // % change
  trafficVolumeOverTime: Array<{ time: string; flows: number; malicious: number }>;
  threatDistribution: Array<{ name: ThreatClass; count: number; percentage: number; color: string }>;
  severityDistribution: Array<{ severity: Severity; count: number; color: string }>;
  recentAlerts: SecurityAlert[];
  recentJobs: AnalysisJob[];
  systemStatus: {
    engine: 'online' | 'degraded' | 'offline';
    lastAnalysis: string;
    modelLatencyMs: number;
    modelVersion: string;
    ingestionRateFlowsPerSec: number;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'SOC Analyst' | 'Threat Hunter' | 'SecOps Lead' | 'Auditor';
  badgeNumber: string;
  clearanceLevel: string;
  avatarUrl?: string;
}
