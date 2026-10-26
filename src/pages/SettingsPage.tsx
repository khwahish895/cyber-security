import React, { useState } from 'react';
import {
  User,
  Shield,
  Lock,
  Database,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Radio,
  FileText
} from 'lucide-react';
import { UserProfile, AuditLog } from '../types';

interface SettingsPageProps {
  user: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
  anonymizeIps: boolean;
  onToggleAnonymize: () => void;
  auditLogs: AuditLog[];
  onResetData: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  user,
  onUpdateUser,
  anonymizeIps,
  onToggleAnonymize,
  auditLogs,
  onResetData
}) => {
  const [resetConfirm, setResetConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'privacy' | 'audit'>('profile');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Operator Settings &amp; Administration</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Security clearance roles, privacy controls, probe telemetry configuration, and audit trails.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="inline-flex rounded-lg bg-slate-900 border border-slate-800 p-0.5 text-xs font-medium">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-1.5 rounded transition-colors ${
              activeTab === 'profile' ? 'bg-cyan-500/20 text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Operator Profile
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-3 py-1.5 rounded transition-colors ${
              activeTab === 'privacy' ? 'bg-cyan-500/20 text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Privacy &amp; Probe
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded transition-colors ${
              activeTab === 'audit' ? 'bg-cyan-500/20 text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Audit Trail
          </button>
        </div>
      </div>

      {/* Tab 1: Profile */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4 md:col-span-1 text-center flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-cyan-500/10 border-2 border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-2">
              <User className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{user.name}</h3>
              <p className="font-mono text-cyan-400 text-xs mt-0.5">{user.role}</p>
              <p className="text-slate-400 text-[11px] mt-1">{user.badgeNumber}</p>
            </div>
            <div className="pt-2">
              <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[10px]">
                {user.clearanceLevel}
              </span>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4 md:col-span-2">
            <h3 className="text-sm font-semibold text-white">Operator Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 text-[11px] mb-1">Assigned Name</label>
                <input
                  type="text"
                  value={user.name}
                  onChange={(e) => onUpdateUser({ ...user, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] mb-1">Official Email Address</label>
                <input
                  type="email"
                  value={user.email}
                  onChange={(e) => onUpdateUser({ ...user, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] mb-1">SOC Access Role</label>
                <select
                  value={user.role}
                  onChange={(e) => onUpdateUser({ ...user, role: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="SecOps Lead">SecOps Lead (All Permissions)</option>
                  <option value="Threat Hunter">Threat Hunter (Investigative)</option>
                  <option value="SOC Analyst">SOC Analyst (Triage &amp; Alert)</option>
                  <option value="Auditor">Auditor (Read Only)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] mb-1">NTRO Badge ID</label>
                <input
                  type="text"
                  value={user.badgeNumber}
                  onChange={(e) => onUpdateUser({ ...user, badgeNumber: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
              Role changes take effect immediately across all dashboard actions and log recordings.
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Privacy & Probe */}
      {activeTab === 'privacy' && (
        <div className="space-y-4 text-xs">
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="text-sm font-semibold text-white">Privacy &amp; Data Protection Controls</h3>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              In accordance with national security data protection mandates, raw IP addresses can be dynamically anonymized across all operations views without modifying the underlying classification models.
            </p>

            <div className="flex items-center justify-between p-4 rounded-lg bg-slate-950 border border-slate-800">
              <div>
                <div className="font-semibold text-white">Dynamic IP Anonymization (Subnet Masking)</div>
                <div className="text-slate-400 text-[11px] mt-0.5">
                  Masks the final octet of source and destination IPs (e.g. 192.168.1.xxx) in the explorer and reports.
                </div>
              </div>
              <button
                onClick={onToggleAnonymize}
                className={`px-4 py-2 rounded-lg font-semibold text-xs transition-colors ${
                  anonymizeIps
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {anonymizeIps ? 'Masking Enabled' : 'Masking Disabled'}
              </button>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h3 className="text-sm font-semibold text-white">Hardware Passive Sensor Diagnostics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Capture Interface</span>
                <span className="font-mono text-slate-200">eth0.mirror (Optical Tap)</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Packet Loss / Drop Count</span>
                <span className="font-mono text-emerald-400 font-bold">0 dropped (0.00%)</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Transmission Mode</span>
                <span className="font-mono text-cyan-400">Strictly Unidirectional</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-white">Reset Demonstration Data</h4>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Restores original CSE-CIC-IDS2017 benchmark flows and re-initializes security alerts.
              </p>
            </div>
            {resetConfirm ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onResetData();
                    setResetConfirm(false);
                  }}
                  className="px-3 py-1.5 rounded-md bg-red-600 hover:bg-red-500 text-white font-semibold text-xs"
                >
                  Confirm Reset
                </button>
                <button
                  onClick={() => setResetConfirm(false)}
                  className="px-3 py-1.5 rounded-md bg-slate-800 text-slate-300 text-xs"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setResetConfirm(true)}
                className="px-3.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-red-400 border border-slate-700 text-xs font-medium"
              >
                Reset to Default Data
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Audit Trail */}
      {activeTab === 'audit' && (
        <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/40 text-xs">
          <div className="px-4 py-3 bg-[#0b1120] border-b border-slate-800 flex items-center justify-between">
            <span className="font-semibold text-white">System Audit &amp; Activity Log</span>
            <span className="text-[11px] text-slate-400 font-mono">Immutable Forensic Trail</span>
          </div>

          <div className="overflow-x-auto max-h-[500px]">
            <table className="w-full text-left font-mono">
              <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 sticky top-0 font-sans font-medium">
                <tr>
                  <th className="py-2.5 px-3.5">Log ID</th>
                  <th className="py-2.5 px-3.5">Timestamp</th>
                  <th className="py-2.5 px-3.5">Operator</th>
                  <th className="py-2.5 px-3.5">Action</th>
                  <th className="py-2.5 px-3.5">Resource</th>
                  <th className="py-2.5 px-3.5">Event Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/30">
                    <td className="py-2 px-3.5 text-cyan-400 font-semibold">{log.id}</td>
                    <td className="py-2 px-3.5 text-slate-400 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-2 px-3.5 font-sans text-slate-200">{log.user}</td>
                    <td className="py-2 px-3.5">
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono text-[10px]">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-2 px-3.5 text-slate-400">{log.resourceId}</td>
                    <td className="py-2 px-3.5 font-sans text-slate-300 text-[11px]">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
