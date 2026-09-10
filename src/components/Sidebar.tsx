import React from 'react';
import {
  Activity,
  Network,
  Pill,
  TrendingUp,
  AlertTriangle,
  Bot,
  Wifi,
  ChevronRight,
  LogOut,
  Shield,
} from 'lucide-react';
import { AuthUser } from '../types';

export type NavTab =
  | 'command_center'
  | 'network_map'
  | 'medicine_intel'
  | 'risk_forecast'
  | 'emergency_sim'
  | 'ai_assistant';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenSyncModal: () => void;
  isOnline: boolean;
  pendingSyncCount: number;
  currentUser: AuthUser | null;
  onSignOut: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  onOpenSyncModal,
  isOnline,
  pendingSyncCount,
  currentUser,
  onSignOut,
}) => {
  const navItems = [
    { id: 'command_center' as NavTab, label: 'Command Center', icon: Activity, badge: null },
    { id: 'network_map' as NavTab, label: 'Network Map', icon: Network, badge: '20 Nodes' },
    { id: 'medicine_intel' as NavTab, label: 'Medicine Inventory', icon: Pill, badge: '15 Drugs' },
    { id: 'risk_forecast' as NavTab, label: 'Risk Forecast', icon: TrendingUp, badge: 'Dual Risk' },
    { id: 'emergency_sim' as NavTab, label: 'Emergency Simulator', icon: AlertTriangle, badge: 'Stress Test' },
    { id: 'ai_assistant' as NavTab, label: 'AI Logistics Agent', icon: Bot, badge: 'Active' },
  ];

  return (
    <aside
      id="caremesh-sidebar"
      className="w-64 bg-slate-900 text-slate-100 flex flex-col border-r border-slate-800 shrink-0 select-none"
    >
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 shadow-sm shadow-teal-500/20">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
              CareMesh <span className="text-teal-400 font-semibold">AI</span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">Healthcare Supply Resilience</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
          Supply Operations
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 group text-left cursor-pointer ${
                isActive
                  ? 'bg-teal-600 text-white font-semibold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-teal-400'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-medium shrink-0 ml-1 ${
                    isActive
                      ? 'bg-teal-700/60 text-teal-100'
                      : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Offline sync & status widget */}
      <div className="p-3 mx-3 mb-3 rounded-lg bg-slate-800/60 border border-slate-700/60">
        <button
          onClick={onOpenSyncModal}
          className="w-full text-left flex items-start justify-between group cursor-pointer"
          id="offline-sync-button"
        >
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-200">
              <Wifi className={`w-3.5 h-3.5 ${isOnline ? 'text-emerald-400' : 'text-amber-400'}`} />
              <span>{isOnline ? 'Network Connected' : 'Offline Mode'}</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Sync: Normal • {pendingSyncCount} pending items
            </p>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-400 mt-0.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* User Session Footer */}
      {currentUser && (
        <div className="p-3 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-teal-600/30 text-teal-300 flex items-center justify-center border border-teal-500/30 shrink-0">
              <Shield className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-white truncate">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {currentUser.role}
              </div>
            </div>
          </div>

          <button
            onClick={onSignOut}
            title="Sign Out"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </aside>
  );
};
