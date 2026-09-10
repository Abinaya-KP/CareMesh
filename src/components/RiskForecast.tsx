import React, { useState } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  Zap,
  CheckCircle2,
  Sliders,
  Calendar,
  Eye,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { Facility, RedistributionPlan } from '../types';

interface RiskForecastProps {
  facilities: Facility[];
  recommendations: RedistributionPlan[];
  onOpenRecommendation: (rec: RedistributionPlan) => void;
  onExecuteRecommendation: (rec: RedistributionPlan) => void;
}

export const RiskForecast: React.FC<RiskForecastProps> = ({
  facilities,
  recommendations,
  onOpenRecommendation,
  onExecuteRecommendation,
}) => {
  const [timeHorizon, setTimeHorizon] = useState<'24h' | '3d' | '7d' | '14d'>('7d');
  const [dualRiskStep, setDualRiskStep] = useState<'before' | 'after'>('before');
  const [locallyDeployedIds, setLocallyDeployedIds] = useState<Record<string, boolean>>({});

  // Helper to find or synthesize an optimal redistribution plan tailored to each facility
  const getFacilityPlan = (fac: Facility): RedistributionPlan => {
    const existing = recommendations.find(
      (r) => r.toFacilityId === fac.id || r.fromFacilityId === fac.id
    );
    if (existing) return existing;

    const primaryMedicine = fac.criticalMedicines[0] || 'Paracetamol (500mg)';
    const donorFacility =
      facilities.find((f) => f.id !== fac.id && f.status === 'safe' && f.district === fac.district) ||
      facilities.find((f) => f.id !== fac.id && f.status === 'safe') ||
      facilities[0];

    const safeReduction = Math.max(8, Math.round(fac.shortageProbability * 0.14));

    return {
      id: `PLAN-${fac.id}`,
      medicine: primaryMedicine,
      fromFacilityId: donorFacility?.id || 'FAC-03',
      fromFacilityName: donorFacility?.name || 'PHC-03 Uthiramerur',
      fromDistrict: donorFacility?.district || 'Kanchipuram',
      toFacilityId: fac.id,
      toFacilityName: fac.name,
      toDistrict: fac.district,
      quantity: 500,
      beforeShortageRisk: fac.shortageProbability,
      afterShortageRisk: safeReduction,
      beforeExpiryRisk: 'High',
      afterExpiryRisk: 'Low',
      estimatedDeliveryHours: 1.6,
      distanceKm: 34,
      reason: `${fac.name} faces acute stockout vulnerability (${fac.shortageProbability}%). Rapid lateral transfer from ${donorFacility?.name || 'Central Depot'} resolves the deficit.`,
      confidence: 93,
      costSavingsINR: 18500,
      whyBreakdown: [
        `${fac.name} has low remaining safety buffer for ${primaryMedicine}.`,
        `Direct delivery ETA is approximately ${fac.deliveryETA}.`,
        `${donorFacility?.name || 'Donor Facility'} has sufficient stock runway without compromising local operations.`,
        `Dual-risk rebalancing averts near-term batch expiration while replenishing critical stock.`,
      ],
      expectedImpact: [
        `Drops shortage probability from ${fac.shortageProbability}% to ${safeReduction}%.`,
        `Protects approximately 500 patient treatment courses.`,
        `ETA 1.6 hours over 34 km lateral transit corridor.`,
      ],
      status: 'recommended',
    };
  };

  const handleDeployPlan = (fac: Facility) => {
    const plan = getFacilityPlan(fac);
    setLocallyDeployedIds((prev) => ({ ...prev, [fac.id]: true, [plan.id]: true }));
    onExecuteRecommendation({
      ...plan,
      status: 'executed',
    });
  };

  // Trend data based on horizon
  const trendDataMap = {
    '24h': [
      { time: '00:00', shortageRisk: 78, expiryRisk: 65, demandSurge: 24, supplierDelay: 42, transportDisruption: 18 },
      { time: '06:00', shortageRisk: 81, expiryRisk: 65, demandSurge: 30, supplierDelay: 44, transportDisruption: 19 },
      { time: '12:00', shortageRisk: 84, expiryRisk: 66, demandSurge: 38, supplierDelay: 48, transportDisruption: 20 },
      { time: '18:00', shortageRisk: 82, expiryRisk: 66, demandSurge: 35, supplierDelay: 50, transportDisruption: 22 },
      { time: '24:00', shortageRisk: 80, expiryRisk: 64, demandSurge: 28, supplierDelay: 50, transportDisruption: 20 },
    ],
    '3d': [
      { time: 'Day 1', shortageRisk: 76, expiryRisk: 68, demandSurge: 28, supplierDelay: 45, transportDisruption: 15 },
      { time: 'Day 2', shortageRisk: 82, expiryRisk: 72, demandSurge: 36, supplierDelay: 52, transportDisruption: 18 },
      { time: 'Day 3', shortageRisk: 88, expiryRisk: 78, demandSurge: 44, supplierDelay: 60, transportDisruption: 22 },
    ],
    '7d': [
      { time: 'Mon', shortageRisk: 64, expiryRisk: 55, demandSurge: 20, supplierDelay: 35, transportDisruption: 12 },
      { time: 'Tue', shortageRisk: 70, expiryRisk: 58, demandSurge: 25, supplierDelay: 40, transportDisruption: 14 },
      { time: 'Wed', shortageRisk: 79, expiryRisk: 65, demandSurge: 34, supplierDelay: 48, transportDisruption: 18 },
      { time: 'Thu', shortageRisk: 84, expiryRisk: 72, demandSurge: 42, supplierDelay: 55, transportDisruption: 24 },
      { time: 'Fri', shortageRisk: 81, expiryRisk: 76, demandSurge: 39, supplierDelay: 58, transportDisruption: 22 },
      { time: 'Sat', shortageRisk: 75, expiryRisk: 78, demandSurge: 30, supplierDelay: 54, transportDisruption: 16 },
      { time: 'Sun', shortageRisk: 72, expiryRisk: 79, demandSurge: 24, supplierDelay: 50, transportDisruption: 14 },
    ],
    '14d': [
      { time: 'W1 D1', shortageRisk: 60, expiryRisk: 50, demandSurge: 18, supplierDelay: 30, transportDisruption: 10 },
      { time: 'W1 D4', shortageRisk: 72, expiryRisk: 62, demandSurge: 28, supplierDelay: 42, transportDisruption: 16 },
      { time: 'W1 D7', shortageRisk: 84, expiryRisk: 74, demandSurge: 40, supplierDelay: 55, transportDisruption: 22 },
      { time: 'W2 D3', shortageRisk: 88, expiryRisk: 84, demandSurge: 46, supplierDelay: 65, transportDisruption: 26 },
      { time: 'W2 D7', shortageRisk: 92, expiryRisk: 91, demandSurge: 50, supplierDelay: 70, transportDisruption: 30 },
    ],
  };

  const currentTrendData = trendDataMap[timeHorizon];

  // Top 5 facilities requiring attention
  const top5Facilities = [...facilities]
    .sort((a, b) => b.shortageProbability - a.shortageProbability)
    .slice(0, 5);

  return (
    <div className="space-y-6 pb-12" id="risk-forecast-view">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            Network Risk Forecast &amp; Dual-Risk Intelligence
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Synchronized mitigation of medicine shortages and near-term inventory spoilage
          </p>
        </div>

        {/* Time Horizon Filter */}
        <div className="flex items-center gap-1 bg-white border border-slate-200 p-1 rounded-xl shadow-2xs">
          {(['24h', '3d', '7d', '14d'] as const).map((h) => (
            <button
              key={h}
              onClick={() => setTimeHorizon(h)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                timeHorizon === h
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {h === '24h' ? '24 Hours' : h === '3d' ? '3 Days' : h === '7d' ? '7 Days' : '14 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* DUAL-RISK INTELLIGENCE SECTION (HIGHLIGHTED CORE ARCHITECTURE) */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-5 md:p-6 text-white shadow-xl relative overflow-hidden border border-slate-700">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300">
              <Zap className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-base font-bold text-white">
                Dual-Risk Optimization Paradigm: Zero Shortage + Zero Wastage
              </h2>
              <p className="text-xs text-slate-300">
                CareMesh simultaneously rebalances surplus near-expiry batches to facilities facing acute stockouts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setDualRiskStep('before')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                dualRiskStep === 'before' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              1. Unoptimized State
            </button>
            <button
              onClick={() => setDualRiskStep('after')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                dualRiskStep === 'after' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              2. CareMesh Self-Healed
            </button>
          </div>
        </div>

        {/* Visual Dual-Risk Before / After Flow Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Node A (Surplus & Expiry) */}
          <div className="md:col-span-5 bg-slate-800/90 rounded-xl p-4 border border-slate-700/80 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                  Donor Facility (Surplus Batch)
                </span>
                <h4 className="text-sm font-bold text-white mt-0.5">PHC-03 Uthiramerur (Kanchipuram)</h4>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                Stock: {dualRiskStep === 'before' ? '2,400 units' : '1,400 units'}
              </span>
            </div>

            <p className="text-xs text-slate-300">
              {dualRiskStep === 'before'
                ? 'Demand is low (25 units/day) and 1,200 units of ORS & Paracetamol are set to expire within 30 days.'
                : 'Surplus of 1,000 units safely offloaded. Remaining buffer matches 45-day local population burn rate.'}
            </p>

            <div className="pt-2 border-t border-slate-700 flex items-center justify-between">
              <span className="text-xs text-slate-400">Medicine Expiry Risk:</span>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded ${
                  dualRiskStep === 'before'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                {dualRiskStep === 'before' ? 'CRITICAL (HIGH)' : 'RESOLVED (LOW)'}
              </span>
            </div>
          </div>

          {/* Transfer Action Center */}
          <div className="md:col-span-2 flex flex-col items-center justify-center text-center py-2 space-y-2">
            <div className="w-10 h-10 rounded-full bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-400">
              <ArrowRight className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-teal-300 block">Transfer 1,000 u</span>
              <span className="text-[9px] text-slate-400">ETA 1.5 hrs (38 km)</span>
            </div>
            {dualRiskStep === 'before' ? (
              <button
                id="btn-deploy-dual-risk"
                onClick={() => {
                  setDualRiskStep('after');
                  if (recommendations[0]) {
                    onExecuteRecommendation(recommendations[0]);
                  }
                }}
                className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-teal-500 hover:bg-teal-400 active:bg-teal-600 text-slate-900 transition-colors cursor-pointer shadow-xs flex items-center gap-1"
                title="Deploy Heuristic Transfer Plan"
              >
                <Zap className="w-3 h-3 fill-slate-900 text-slate-900" />
                <span>Deploy Plan</span>
              </button>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Plan Deployed</span>
              </span>
            )}
          </div>

          {/* Node B (Depleted & Shortage) */}
          <div className="md:col-span-5 bg-slate-800/90 rounded-xl p-4 border border-slate-700/80 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-wider">
                  Recipient Facility (Stockout Crisis)
                </span>
                <h4 className="text-sm font-bold text-white mt-0.5">PHC-07 Maduranthakam (Chengalpattu)</h4>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                Stock: {dualRiskStep === 'before' ? '216 units (4.7d)' : '1,216 units (26d)'}
              </span>
            </div>

            <p className="text-xs text-slate-300">
              {dualRiskStep === 'before'
                ? 'High seasonal OPD consumption (46 units/day). Expected to stock out in 4.7 days without intervention.'
                : 'Received 1,000 fresh units from PHC-03. Stockout averted and patient treatment uninterrupted.'}
            </p>

            <div className="pt-2 border-t border-slate-700 flex items-center justify-between">
              <span className="text-xs text-slate-400">Shortage Probability:</span>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded ${
                  dualRiskStep === 'before'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                {dualRiskStep === 'before' ? '84% (CRITICAL)' : '9% (SAFE)'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Network Risk Trajectory Chart */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Multi-Vector Network Risk Trajectory</h3>
            <p className="text-xs text-slate-500">
              Simulated projections across all 5 risk dimensions over {timeHorizon}
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-rose-600 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Medicine Shortage
            </span>
            <span className="flex items-center gap-1.5 text-amber-600 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Medicine Expiry
            </span>
            <span className="flex items-center gap-1.5 text-indigo-600 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Supplier Delay
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={currentTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="shortageGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expiryGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="supplierGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="time" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  borderRadius: '8px',
                  fontSize: '11px',
                  backgroundColor: '#0f172a',
                  color: '#fff',
                  border: 'none',
                }}
              />
              <Area
                type="monotone"
                dataKey="shortageRisk"
                name="Shortage Risk %"
                stroke="#f43f5e"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#shortageGrad)"
              />
              <Area
                type="monotone"
                dataKey="expiryRisk"
                name="Expiry Risk %"
                stroke="#f59e0b"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#expiryGrad)"
              />
              <Area
                type="monotone"
                dataKey="supplierDelay"
                name="Supplier Latency %"
                stroke="#6366f1"
                strokeWidth={1.5}
                fillOpacity={1}
                fill="url(#supplierGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top 5 Facilities Requiring Attention Section */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Top 5 Facilities Requiring Attention</h3>
            <p className="text-xs text-slate-500">Ranked by combined composite vulnerability index</p>
          </div>
          <span className="text-xs text-teal-700 font-semibold bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
            Autonomous Mitigation Ready
          </span>
        </div>

        <div className="space-y-2.5">
          {top5Facilities.map((fac, idx) => {
            const plan = getFacilityPlan(fac);
            const isDeployed =
              plan.status === 'executed' ||
              !!locallyDeployedIds[fac.id] ||
              !!locallyDeployedIds[plan.id];

            return (
              <div
                key={fac.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50/70 transition-all gap-3"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900">{fac.name}</h4>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                        {fac.district}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Primary Driver:{' '}
                      <span className="font-semibold text-rose-700">
                        {fac.criticalMedicines.join(', ') || 'Critical Stock Depletion'}
                      </span>{' '}
                      • Delivery ETA: {fac.deliveryETA}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                  <div className="text-right">
                    <span
                      className={`text-xs font-bold block ${
                        isDeployed ? 'text-emerald-700' : 'text-rose-600'
                      }`}
                    >
                      {isDeployed ? `${plan.afterShortageRisk}% Shortage Risk` : `${fac.shortageProbability}% Shortage Risk`}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {isDeployed ? 'Mitigation Active' : `Expiry Exposure: ${fac.expiryRiskScore}%`}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Review Button */}
                    <button
                      type="button"
                      onClick={() => onOpenRecommendation(isDeployed ? { ...plan, status: 'executed' } : plan)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer flex items-center gap-1"
                      title="Review Plan & Explainable AI Audit"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span className="hidden md:inline">Review</span>
                    </button>

                    {/* Deploy Button */}
                    {isDeployed ? (
                      <div className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5 shadow-2xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Plan Deployed</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        id={`btn-deploy-plan-${fac.id}`}
                        onClick={() => handleDeployPlan(fac)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
                      >
                        <Zap className="w-3.5 h-3.5 text-amber-300" />
                        <span>Deploy Plan</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
