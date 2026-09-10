import React, { useState } from 'react';
import {
  AlertTriangle,
  Flame,
  Truck,
  CloudRain,
  Users,
  Building,
  Zap,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Check,
} from 'lucide-react';
import { ScenarioId, RedistributionPlan, NetworkHealthStats } from '../types';
import { SCENARIOS } from '../utils/engine';

interface EmergencySimulatorProps {
  currentScenario: ScenarioId;
  onSelectScenario: (scenario: ScenarioId) => void;
  interventionApplied: boolean;
  onApplyIntervention: () => void;
  onResetBaseline: () => void;
  stats: NetworkHealthStats;
  recommendations: RedistributionPlan[];
}

export const EmergencySimulator: React.FC<EmergencySimulatorProps> = ({
  currentScenario,
  onSelectScenario,
  interventionApplied,
  onApplyIntervention,
  onResetBaseline,
  stats,
  recommendations,
}) => {
  const [isExecuting, setIsExecuting] = useState(false);

  const scenarioCards = [
    {
      id: 'dengue' as ScenarioId,
      title: 'Dengue Outbreak',
      tag: 'Demand +40%',
      icon: Flame,
      color: 'from-rose-500 to-amber-600',
      description: 'Sudden post-monsoon surge in fever, thrombocytopenia, and dehydration cases across rural clusters.',
    },
    {
      id: 'supplier_delay' as ScenarioId,
      title: 'Supplier Delay',
      tag: 'Delayed by 5 Days',
      icon: Truck,
      color: 'from-amber-500 to-orange-600',
      description: 'Bulk raw material customs blockage stalls deliveries from Southern Supplier S-03 by 120 hours.',
    },
    {
      id: 'flood' as ScenarioId,
      title: 'Monsoon Flooding',
      tag: '3 Facilities Isolated',
      icon: CloudRain,
      color: 'from-blue-600 to-cyan-700',
      description: 'Riverbank flooding cuts standard arterial transport routes to Maduranthakam and Lalgudi.',
    },
    {
      id: 'patient_surge' as ScenarioId,
      title: 'Patient Surge',
      tag: 'Patient Demand +25%',
      icon: Users,
      color: 'from-purple-600 to-indigo-700',
      description: 'Seasonal respiratory infection spike elevates daily OPD attendance across all district facilities.',
    },
    {
      id: 'warehouse_failure' as ScenarioId,
      title: 'Warehouse Failure',
      tag: 'Depot W-01 Offline',
      icon: Building,
      color: 'from-red-600 to-rose-800',
      description: 'Cold chain electrical fire temporarily puts Central District Store in Kanchipuram offline.',
    },
  ];

  const handleApplyPlan = () => {
    setIsExecuting(true);
    setTimeout(() => {
      onApplyIntervention();
      setIsExecuting(false);
    }, 600);
  };

  const isShockActive = currentScenario !== 'baseline';

  return (
    <div className="space-y-6 pb-12" id="emergency-simulator-view">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            Supply Chain Shock Simulator
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Simulate real-world disruptions and see how the healthcare supply network responds.
          </p>
        </div>

        {isShockActive && (
          <button
            onClick={onResetBaseline}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer self-start sm:self-auto"
            id="sim-reset-baseline-btn"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to Baseline
          </button>
        )}
      </div>

      {/* 5 Scenario Selection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3" id="scenario-selector-grid">
        {scenarioCards.map((sc) => {
          const Icon = sc.icon;
          const isSelected = currentScenario === sc.id;

          return (
            <button
              key={sc.id}
              id={`scenario-btn-${sc.id}`}
              onClick={() => onSelectScenario(sc.id)}
              className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden group cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-teal-500 bg-teal-50/40 ring-2 ring-teal-500/20 shadow-md'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80 shadow-2xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center text-white bg-gradient-to-br ${sc.color} shadow-sm`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {sc.tag}
                  </span>
                </div>

                <h3 className="text-xs font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                  {sc.title}
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-snug line-clamp-2">
                  {sc.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-semibold">
                <span className={isSelected ? 'text-teal-700 font-bold' : 'text-slate-400'}>
                  {isSelected ? 'Active Shock' : 'Select Shock'}
                </span>
                <ArrowRight className={`w-3 h-3 ${isSelected ? 'text-teal-600' : 'text-slate-300'}`} />
              </div>
            </button>
          );
        })}
      </div>

      {/* SIMULATION PIPELINE COMPARISON: BEFORE -> AFTER SHOCK -> RESPONSE PLAN -> AFTER INTERVENTION */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-teal-600" />
              Dynamic Shock Propagation &amp; Self-Healing Pipeline
            </h2>
            <p className="text-xs text-slate-500">
              Active Scenario: <span className="font-semibold text-slate-800">{SCENARIOS[currentScenario].name}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!interventionApplied ? (
              <button
                id="apply-response-plan-btn"
                onClick={handleApplyPlan}
                disabled={isExecuting}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-sm shadow-teal-700/20 active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                {isExecuting ? 'Deploying Logistics...' : 'Apply CareMesh Response Plan'}
              </button>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                <Check className="w-4 h-4 text-emerald-700" />
                Response Plan Executed • Grid Healed
              </span>
            )}
          </div>
        </div>

        {/* Before vs After Simulation Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* BEFORE SIMULATION */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                BEFORE SIMULATION (Baseline)
              </span>
              <span className="text-xs font-mono font-semibold text-slate-600">Standard Grid</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                <span className="text-xs text-emerald-800 font-semibold block">Safe</span>
                <span className="text-xl font-bold text-emerald-700">14</span>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200">
                <span className="text-xs text-amber-800 font-semibold block">At Risk</span>
                <span className="text-xl font-bold text-amber-700">4</span>
              </div>
              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200">
                <span className="text-xs text-rose-800 font-semibold block">Critical</span>
                <span className="text-xl font-bold text-rose-700">2</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500">
              Normal operational rhythm with localized buffer stocks across 20 facilities.
            </p>
          </div>

          {/* AFTER SIMULATION */}
          <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
                AFTER SIMULATION (Disruption Shock)
              </span>
              <span className="text-xs font-bold text-rose-600 bg-rose-100 px-2 py-0.5 rounded">
                High Shock
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                <span className="text-xs text-emerald-800 font-semibold block">Safe</span>
                <span className="text-xl font-bold text-emerald-700">
                  {currentScenario === 'baseline' ? 14 : 7}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200">
                <span className="text-xs text-amber-800 font-semibold block">At Risk</span>
                <span className="text-xl font-bold text-amber-700">
                  {currentScenario === 'baseline' ? 4 : 6}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200">
                <span className="text-xs text-rose-800 font-semibold block">Critical</span>
                <span className="text-xl font-bold text-rose-700">
                  {currentScenario === 'baseline' ? 2 : 7}
                </span>
              </div>
            </div>
            <p className="text-[11px] text-rose-700 font-medium">
              Immediate shock elevates stockout probability across 7 primary rural facilities.
            </p>
          </div>
        </div>

        {/* CAREMESH RESPONSE PLAN */}
        <div className="rounded-xl border border-teal-200 bg-teal-50/50 p-4 md:p-5 space-y-3" id="caremesh-response-plan-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-700" />
              <h3 className="text-sm font-bold text-teal-950 uppercase tracking-wide">
                CareMesh AI Response Plan
              </h3>
            </div>
            <span className="text-xs font-semibold text-teal-800 bg-teal-100 px-2.5 py-0.5 rounded-full">
              Autonomous Optimization Model
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-white p-3 rounded-xl border border-teal-200 shadow-2xs space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px]">
                  1
                </span>
                Lateral Redistribution
              </div>
              <p className="text-xs font-semibold text-teal-800">
                Transfer 600 units from PHC-03 → PHC-07
              </p>
              <p className="text-[10px] text-slate-500">Neutralizes 42-day expiry risk at source</p>
            </div>

            <div className="bg-white p-3 rounded-xl border border-teal-200 shadow-2xs space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px]">
                  2
                </span>
                Cross-Cluster Rebalance
              </div>
              <p className="text-xs font-semibold text-teal-800">
                Transfer 300 units from PHC-11 → PHC-05
              </p>
              <p className="text-[10px] text-slate-500">Coimbatore district emergency IV replenishment</p>
            </div>

            <div className="bg-white p-3 rounded-xl border border-teal-200 shadow-2xs space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px]">
                  3
                </span>
                Supplier Rerouting
              </div>
              <p className="text-xs font-semibold text-teal-800">
                Activate Alternate Supplier S-02 (TNMSC)
              </p>
              <p className="text-[10px] text-slate-500">Bypasses delayed Madurai API transit bottleneck</p>
            </div>

            <div className="bg-white p-3 rounded-xl border border-teal-200 shadow-2xs space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px]">
                  4
                </span>
                Priority Courier Dispatch
              </div>
              <p className="text-xs font-semibold text-teal-800">
                Prioritize PHC-07 for Next Delivery
              </p>
              <p className="text-[10px] text-slate-500">Direct courier van dispatch with 1.5h transit</p>
            </div>
          </div>
        </div>

        {/* AFTER INTERVENTION (OUTCOME METRICS) */}
        <div
          className={`p-4 md:p-5 rounded-xl border transition-all ${
            interventionApplied
              ? 'bg-emerald-50/80 border-emerald-300 shadow-sm'
              : 'bg-slate-50 border-slate-200 opacity-60'
          }`}
        >
          <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <CheckCircle2
                className={`w-4 h-4 ${interventionApplied ? 'text-emerald-600' : 'text-slate-400'}`}
              />
              AFTER INTERVENTION OUTCOMES
            </span>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                interventionApplied ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {interventionApplied ? 'Self-Healing Active' : 'Pending Deployment'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg bg-white border border-slate-200">
              <span className="text-[10px] uppercase font-semibold text-slate-500 block">Critical Facilities</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-lg font-bold text-slate-900">
                  {interventionApplied ? '7 → 2' : '7'}
                </span>
                {interventionApplied && <span className="text-xs font-bold text-emerald-600">-71%</span>}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-white border border-slate-200">
              <span className="text-[10px] uppercase font-semibold text-slate-500 block">Shortage Risk (PHC-07)</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-lg font-bold text-slate-900">
                  {interventionApplied ? '84% → 11%' : '84%'}
                </span>
                {interventionApplied && <span className="text-xs font-bold text-emerald-600">-73%</span>}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-white border border-slate-200">
              <span className="text-[10px] uppercase font-semibold text-slate-500 block">Waste Prevented</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-lg font-bold text-teal-700">₹3.8 Lakhs</span>
                <span className="text-xs text-slate-500">Preserved</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-white border border-slate-200">
              <span className="text-[10px] uppercase font-semibold text-slate-500 block">Grid Resilience Score</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-lg font-bold text-emerald-700">
                  {interventionApplied ? '94%' : '58%'}
                </span>
                {interventionApplied && <span className="text-xs font-bold text-emerald-600">+36%</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
