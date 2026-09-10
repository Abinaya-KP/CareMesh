import React from 'react';
import {
  RotateCcw,
  Wifi,
  AlertOctagon,
  Menu,
  LogOut,
  Sliders,
  User,
  Shield,
} from 'lucide-react';
import { ScenarioId, AuthUser } from '../types';
import { SCENARIOS } from '../utils/engine';

interface HeaderProps {
  currentScenario: ScenarioId;
  onSelectScenario: (scenario: ScenarioId) => void;
  onLaunchDemo: () => void;
  onOpenSyncModal: () => void;
  isOnline: boolean;
  onToggleMobileMenu: () => void;
  activeTabTitle: string;
  currentUser: AuthUser | null;
  onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScenario,
  onSelectScenario,
  onLaunchDemo,
  onOpenSyncModal,
  isOnline,
  onToggleMobileMenu,
  activeTabTitle,
  currentUser,
  onSignOut,
}) => {
  const isShockActive = currentScenario !== 'baseline';
  const activeScenarioInfo = SCENARIOS[currentScenario];

  return (
    <header
      id="caremesh-header"
      className="h-16 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between shrink-0 sticky top-0 z-20"
    >
      {/* Left side: mobile toggle & section heading */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 md:hidden cursor-pointer"
          aria-label="Toggle menu"
          id="mobile-menu-toggle"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base md:text-lg font-bold text-slate-900 tracking-tight">
              {activeTabTitle}
            </h2>
            {isShockActive ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
                Stress Test: {activeScenarioInfo.name}
              </span>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                Baseline Operations
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 hidden sm:block">
            CareMesh Supply Network • Regional Telemetry
          </p>
        </div>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Scenario Selector Dropdown */}
        <div className="hidden sm:flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
          <Sliders className="w-3.5 h-3.5 text-slate-400" />
          <label htmlFor="header-scenario-select" className="sr-only">Simulation Scenario</label>
          <select
            id="header-scenario-select"
            value={currentScenario}
            onChange={(e) => onSelectScenario(e.target.value as ScenarioId)}
            className="text-xs font-medium text-slate-700 bg-transparent border-none focus:outline-none cursor-pointer pr-1"
          >
            <option value="baseline">Normal Baseline Operations</option>
            <option value="dengue">Dengue Surge (+40% Demand)</option>
            <option value="supplier_delay">Supplier Delay (5 Days)</option>
            <option value="flood">Monsoon Logistics Blockage</option>
            <option value="patient_surge">District OPD Surge (+25%)</option>
            <option value="warehouse_failure">Depot Cold-Chain Fault</option>
          </select>
        </div>

        {/* Reset button if stress scenario is active */}
        {isShockActive && (
          <button
            onClick={() => onSelectScenario('baseline')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            title="Reset to Baseline Operations"
            id="reset-scenario-btn"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Reset</span>
          </button>
        )}

        {/* Network Status Indicator */}
        <button
          onClick={onOpenSyncModal}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors text-slate-700 text-xs font-medium cursor-pointer"
          id="network-status-pill"
          title="Network Connection Status"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isOnline ? 'bg-emerald-500' : 'bg-amber-500'
            }`}
          />
          <span className="hidden lg:inline">{isOnline ? 'Online' : 'Offline'}</span>
        </button>

        {/* User Profile & Sign Out */}
        {currentUser && (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs font-bold text-slate-900 leading-tight">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-slate-500 leading-tight">
                {currentUser.role}
              </span>
            </div>

            <div className="h-8 min-w-[32px] px-2 rounded-full bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center border border-teal-200 shrink-0 tracking-wide">
              {currentUser.name}
            </div>

            <button
              onClick={onSignOut}
              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Sign Out"
              aria-label="Sign Out"
              id="header-sign-out-btn"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
