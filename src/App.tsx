import React, { useState, useMemo, useEffect } from 'react';
import { Sidebar, NavTab } from './components/Sidebar';
import { Header } from './components/Header';
import { CommandCenter } from './components/CommandCenter';
import { NetworkMap } from './components/NetworkMap';
import { MedicineIntelligence } from './components/MedicineIntelligence';
import { RiskForecast } from './components/RiskForecast';
import { EmergencySimulator } from './components/EmergencySimulator';
import { AIAssistant } from './components/AIAssistant';
import { RecommendationModal } from './components/RecommendationModal';
import { OfflineSyncModal } from './components/OfflineSyncModal';
import { LoginPage } from './components/LoginPage';
import { ScenarioId, Facility, RedistributionPlan, AuthUser } from './types';
import { runSimulation } from './utils/engine';
import { TRANSLATIONS } from './utils/translations';
import { CheckCircle2, X } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem('caremesh_auth_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Clear previous sessions with personal names
        if (
          parsed?.name &&
          (parsed.name.includes('Rajesh') ||
            parsed.name.includes('Sharma') ||
            parsed.name.includes('Nair') ||
            parsed.name.includes('Kumar'))
        ) {
          localStorage.removeItem('caremesh_auth_user');
          return null;
        }
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState<NavTab>('command_center');
  const [currentScenario, setCurrentScenario] = useState<ScenarioId>('baseline');
  const [interventionApplied, setInterventionApplied] = useState<boolean>(false);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [selectedRecommendation, setSelectedRecommendation] = useState<RedistributionPlan | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(3);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [demoToast, setDemoToast] = useState<string | null>(null);

  const t = TRANSLATIONS.en;

  // Run simulation engine based on scenario and intervention
  const simState = useMemo(() => {
    return runSimulation(currentScenario, interventionApplied);
  }, [currentScenario, interventionApplied]);

  const handleLogin = (user: AuthUser) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('caremesh_auth_user', JSON.stringify(user));
    } catch (e) {
      console.warn('Could not persist auth to localStorage', e);
    }
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('caremesh_auth_user');
    } catch (e) {
      console.warn('Could not clear auth from localStorage', e);
    }
  };

  // Launch Demo Scenario
  const handleLaunchDemo = () => {
    setCurrentScenario('dengue');
    setInterventionApplied(false);
    setActiveTab('emergency_sim');
    setDemoToast(
      'Dengue Outbreak Stress Test Active: Demand surged +40% on IV Fluids & Paracetamol across 7 facilities.'
    );
    setTimeout(() => {
      setDemoToast(null);
    }, 5000);
  };

  // Reset to Baseline
  const handleResetBaseline = () => {
    setCurrentScenario('baseline');
    setInterventionApplied(false);
    setDemoToast('Returned to standard operational baseline telemetry.');
    setTimeout(() => {
      setDemoToast(null);
    }, 3000);
  };

  // Execute recommendation
  const handleExecuteRecommendation = (rec: RedistributionPlan) => {
    setInterventionApplied(true);
    setDemoToast(
      `Redistribution Dispatched: ${rec.quantity} units of ${rec.medicine} transferred from ${rec.fromFacilityName} to ${rec.toFacilityName}.`
    );
    setTimeout(() => {
      setDemoToast(null);
    }, 4500);
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'command_center':
        return t.cmdCenter;
      case 'network_map':
        return t.networkMap;
      case 'medicine_intel':
        return t.medicineIntel;
      case 'risk_forecast':
        return t.riskForecast;
      case 'emergency_sim':
        return t.emergencySim;
      case 'ai_assistant':
        return t.aiAssistant;
      default:
        return t.appTitle;
    }
  };

  // If user is not signed in, show the clean professional Login Page at the beginning
  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 font-sans text-slate-800 antialiased">
      {/* Desktop & Mobile Drawer Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 md:relative md:flex transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            setMobileMenuOpen(false);
          }}
          onOpenSyncModal={() => setIsSyncModalOpen(true)}
          isOnline={isOnline}
          pendingSyncCount={pendingSyncCount}
          currentUser={currentUser}
          onSignOut={handleSignOut}
        />
      </div>

      {/* Backdrop for mobile drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-30 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top App Header */}
        <Header
          currentScenario={currentScenario}
          onSelectScenario={(sc) => {
            setCurrentScenario(sc);
            setInterventionApplied(false);
          }}
          onLaunchDemo={handleLaunchDemo}
          onOpenSyncModal={() => setIsSyncModalOpen(true)}
          isOnline={isOnline}
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
          activeTabTitle={getTabTitle()}
          currentUser={currentUser}
          onSignOut={handleSignOut}
        />

        {/* Floating Notification Toast */}
        {demoToast && (
          <div className="mx-4 md:mx-6 mt-3 p-3 rounded-xl bg-slate-900 text-white border border-slate-700 shadow-lg flex items-center justify-between gap-3 text-xs animate-in fade-in slide-in-from-top-2 duration-200 z-30">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{demoToast}</span>
            </div>
            <button
              onClick={() => setDemoToast(null)}
              className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
              aria-label="Dismiss message"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Scrollable View Container */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {activeTab === 'command_center' && (
            <CommandCenter
              stats={simState.stats}
              facilities={simState.facilities}
              alerts={simState.alerts}
              recommendations={simState.recommendations}
              onOpenRecommendation={(rec) => setSelectedRecommendation(rec)}
              onExecuteRecommendation={handleExecuteRecommendation}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onSelectFacility={(fac) => {
                setSelectedFacility(fac);
                setActiveTab('network_map');
              }}
            />
          )}

          {activeTab === 'network_map' && (
            <NetworkMap
              facilities={simState.facilities}
              selectedFacility={selectedFacility}
              onSelectFacility={setSelectedFacility}
              recommendations={simState.recommendations}
              onOpenRecommendation={(rec) => setSelectedRecommendation(rec)}
            />
          )}

          {activeTab === 'medicine_intel' && (
            <MedicineIntelligence
              records={simState.inventoryRecords}
              onOpenRecommendation={(rec) => setSelectedRecommendation(rec)}
              recommendations={simState.recommendations}
            />
          )}

          {activeTab === 'risk_forecast' && (
            <RiskForecast
              facilities={simState.facilities}
              recommendations={simState.recommendations}
              onOpenRecommendation={(rec) => setSelectedRecommendation(rec)}
              onExecuteRecommendation={handleExecuteRecommendation}
            />
          )}

          {activeTab === 'emergency_sim' && (
            <EmergencySimulator
              currentScenario={currentScenario}
              onSelectScenario={(sc) => {
                setCurrentScenario(sc);
                setInterventionApplied(false);
              }}
              interventionApplied={interventionApplied}
              onApplyIntervention={() => setInterventionApplied(true)}
              onResetBaseline={handleResetBaseline}
              stats={simState.stats}
              recommendations={simState.recommendations}
            />
          )}

          {activeTab === 'ai_assistant' && (
            <AIAssistant
              onNavigateToTab={(tab) => setActiveTab(tab as NavTab)}
            />
          )}

          {/* Prototype Disclaimer Footer */}
          <footer className="mt-8 pt-4 pb-2 border-t border-slate-200 text-center">
            <p className="text-[11px] text-slate-500 max-w-2xl mx-auto leading-relaxed">
              <span className="font-semibold text-slate-600">CareMesh Operations: </span>
              {t.disclaimer}
            </p>
          </footer>
        </main>
      </div>

      {/* Decision Audit & Recommendation Modal */}
      {selectedRecommendation && (
        <RecommendationModal
          plan={selectedRecommendation}
          onClose={() => setSelectedRecommendation(null)}
          onExecute={(plan) => {
            handleExecuteRecommendation(plan);
            setSelectedRecommendation(null);
          }}
        />
      )}

      {/* Offline Sync Status Modal */}
      <OfflineSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        isOnline={isOnline}
        onToggleOnline={() => setIsOnline(!isOnline)}
        pendingCount={pendingSyncCount}
        onSyncAll={() => setPendingSyncCount(0)}
      />
    </div>
  );
}
