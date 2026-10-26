import React, { useState } from 'react';
import { X, Shield, Lock, Eye, EyeOff, User, Check, ArrowRight } from 'lucide-react';
import { UserProfile } from '../types';

interface AuthModalProps {
  currentUser: UserProfile;
  onSelectUser: (user: UserProfile) => void;
  onClose: () => void;
}

const PRESET_OPERATORS: UserProfile[] = [
  {
    id: 'USR-8821',
    name: 'Capt. Vikram Sengupta',
    email: 'v.sengupta@ntro.gov.in',
    role: 'SecOps Lead',
    badgeNumber: 'NTRO-CYBER-8821',
    clearanceLevel: 'LEVEL 4 - RESTRICTED ACCESS'
  },
  {
    id: 'USR-7734',
    name: 'Dr. Priya Sharma',
    email: 'p.sharma@ntro.gov.in',
    role: 'Threat Hunter',
    badgeNumber: 'NTRO-CYBER-7734',
    clearanceLevel: 'LEVEL 3 - INVESTIGATOR'
  },
  {
    id: 'USR-6612',
    name: 'Arjun Nair',
    email: 'a.nair@ntro.gov.in',
    role: 'SOC Analyst',
    badgeNumber: 'NTRO-CYBER-6612',
    clearanceLevel: 'LEVEL 2 - ANALYST'
  },
  {
    id: 'USR-9901',
    name: 'Aditi Verma',
    email: 'a.verma@ntro.gov.in',
    role: 'Auditor',
    badgeNumber: 'NTRO-AUDIT-9901',
    clearanceLevel: 'LEVEL 2 - AUDIT ONLY'
  }
];

export const AuthModal: React.FC<AuthModalProps> = ({ currentUser, onSelectUser, onClose }) => {
  const [tab, setTab] = useState<'quick' | 'login' | 'register'>('quick');
  const [email, setEmail] = useState(currentUser.email);
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: UserProfile = {
      id: `USR-${Date.now().toString().slice(-4)}`,
      name: name || email.split('@')[0],
      email: email,
      role: 'SOC Analyst',
      badgeNumber: `NTRO-OP-${Date.now().toString().slice(-4)}`,
      clearanceLevel: 'LEVEL 2 - ANALYST'
    };
    onSelectUser(newUser);
    setSuccessMsg('Session authenticated successfully');
    setTimeout(() => {
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl w-full max-w-md overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0b1120]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Security Access Control</h3>
              <p className="text-[11px] text-slate-400">NTRO Cyber Defense Console Auth</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex border-b border-slate-800 bg-slate-900/50 text-xs font-medium">
          <button
            onClick={() => setTab('quick')}
            className={`flex-1 py-2.5 text-center transition-colors border-b-2 ${
              tab === 'quick'
                ? 'border-cyan-400 text-cyan-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Operator Roles (Demo)
          </button>
          <button
            onClick={() => setTab('login')}
            className={`flex-1 py-2.5 text-center transition-colors border-b-2 ${
              tab === 'login'
                ? 'border-cyan-400 text-cyan-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Credential Sign In
          </button>
          <button
            onClick={() => setTab('register')}
            className={`flex-1 py-2.5 text-center transition-colors border-b-2 ${
              tab === 'register'
                ? 'border-cyan-400 text-cyan-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Register Operator
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {successMsg && (
            <div className="mb-4 p-2.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>{successMsg}</span>
            </div>
          )}

          {tab === 'quick' && (
            <div className="space-y-2.5">
              <p className="text-xs text-slate-400 mb-3">
                Select a pre-authorized operator persona for testing role-based security permissions:
              </p>
              {PRESET_OPERATORS.map((op) => {
                const isSelected = currentUser.email === op.email;
                return (
                  <button
                    key={op.id}
                    onClick={() => {
                      onSelectUser(op);
                      setSuccessMsg(`Switched to ${op.name}`);
                      setTimeout(() => onClose(), 500);
                    }}
                    className={`w-full text-left p-3 rounded-lg border transition-all text-xs flex items-center justify-between ${
                      isSelected
                        ? 'bg-cyan-500/10 border-cyan-500/40 text-white'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/60 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-slate-100 flex items-center gap-2">
                        <span>{op.name}</span>
                        {isSelected && <span className="text-[10px] text-cyan-400 font-mono">(Active)</span>}
                      </div>
                      <div className="text-[11px] text-cyan-400 font-mono mt-0.5">{op.role}</div>
                      <div className="text-[10px] text-slate-400 mt-1">{op.clearanceLevel}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500" />
                  </button>
                );
              })}
            </div>
          )}

          {(tab === 'login' || tab === 'register') && (
            <form onSubmit={handleCustomLogin} className="space-y-4 text-xs">
              {tab === 'register' && (
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Full Name &amp; Designation</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Lt. Col. Rajesh Sen"
                    className="w-full px-3 py-2 rounded-md bg-slate-900 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Official Government Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="analyst@ntro.gov.in"
                  className="w-full px-3 py-2 rounded-md bg-slate-900 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Access Token / Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 pr-9 rounded-md bg-slate-900 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-md bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition-colors mt-2"
              >
                {tab === 'login' ? 'Authenticate Session' : 'Create Operator Account'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
