import React, { useState } from 'react';
import {
  Shield,
  Activity,
  Bell,
  User,
  LogOut,
  FileText,
  Menu,
  X,
  RefreshCw,
  Radio
} from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  user: UserProfile;
  onOpenAuth: () => void;
  onOpenSihDocs: () => void;
  isStreamActive: boolean;
  onToggleStream: () => void;
  unreadAlertsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  user,
  onOpenAuth,
  onOpenSihDocs,
  isStreamActive,
  onToggleStream,
  unreadAlertsCount
}) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'analysis', label: 'Traffic Analysis' },
    { id: 'explorer', label: 'Threat Explorer' },
    { id: 'intelligence', label: 'Threat Intel' },
    { id: 'alerts', label: 'Alerts' },
    { id: 'analytics', label: 'Reports' },
    { id: 'model', label: 'Model Engine' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0b1120]/95 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5 transition-colors">
      <div className="flex items-center justify-between gap-8 max-w-[1600px] mx-auto">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 transition-colors">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white whitespace-nowrap">
                CyberShield AI
              </span>
              <div className="text-[11px] text-slate-400 tracking-normal hidden sm:block">
                <span>SIH26145</span>
                <span className="mx-1" aria-hidden="true">·</span>
                <span>NTRO Unidirectional Monitor</span>
              </div>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden xl:flex items-center gap-6 text-sm font-medium text-slate-300">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => onNavigate(link.id)}
              className={`hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 relative py-1 ${
                currentPage === link.id
                  ? 'text-cyan-400 font-semibold'
                  : 'text-slate-300'
              }`}
            >
              {link.label}
              {currentPage === link.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* Zone 3: Primary Action & Controls */}
        <div className="flex items-center gap-3 shrink-0">
          {/* SIH Specs Button */}
          <button
            onClick={onOpenSihDocs}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-md transition-colors whitespace-nowrap"
            title="Smart India Hackathon Specs & Architecture"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>SIH26145 Specs</span>
          </button>

          {/* Ingestion Stream Toggle */}
          <button
            onClick={onToggleStream}
            className={`hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors whitespace-nowrap ${
              isStreamActive
                ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
                : 'bg-slate-800/50 border-slate-700/60 text-slate-400 hover:text-slate-300'
            }`}
            title="Toggle passive ingestion packet tap stream"
          >
            <Radio className={`w-3.5 h-3.5 ${isStreamActive ? 'text-cyan-400' : 'text-slate-500'}`} />
            <span>{isStreamActive ? 'Tap Stream: Live' : 'Tap Stream: Paused'}</span>
          </button>

          {/* Alerts notification icon */}
          <button
            onClick={() => onNavigate('alerts')}
            className="relative p-2 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
            aria-label="View security alerts"
          >
            <Bell className="w-4 h-4" />
            {unreadAlertsCount > 0 && (
              <span className="absolute top-1 right-1 px-1 min-w-[16px] h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center font-mono">
                {unreadAlertsCount}
              </span>
            )}
          </button>

          {/* User Profile / Role dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-slate-200 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-md transition-colors"
            >
              <div className="w-5 h-5 rounded-full bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <User className="w-3 h-3" />
              </div>
              <span className="hidden sm:inline-block max-w-[120px] truncate">{user.name.split(' ')[0]}</span>
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[#0f172a] border border-slate-700/80 rounded-lg shadow-xl p-2 z-50 text-xs">
                <div className="px-3 py-2 border-b border-slate-800">
                  <p className="font-semibold text-slate-200 truncate">{user.name}</p>
                  <p className="text-[11px] text-cyan-400 font-mono mt-0.5">{user.role}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{user.badgeNumber}</p>
                </div>
                <div className="pt-1">
                  <button
                    onClick={() => {
                      onNavigate('settings');
                      setUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800/60 rounded transition-colors"
                  >
                    Operator Settings & Logs
                  </button>
                  <button
                    onClick={() => {
                      onOpenAuth();
                      setUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800/60 rounded transition-colors flex items-center justify-between"
                  >
                    <span>Switch Operator Role</span>
                    <RefreshCw className="w-3 h-3 text-slate-400" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden mt-3 pt-3 border-t border-slate-800 flex flex-col gap-1 pb-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                onNavigate(link.id);
                setMobileMenuOpen(false);
              }}
              className={`text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentPage === link.id
                  ? 'bg-cyan-500/10 text-cyan-400 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800/50'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 mt-2 border-t border-slate-800/60 flex items-center justify-between px-3">
            <button
              onClick={() => {
                onOpenSihDocs();
                setMobileMenuOpen(false);
              }}
              className="text-xs text-cyan-400 hover:underline flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>SIH26145 Problem Brief</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
