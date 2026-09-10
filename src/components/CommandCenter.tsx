import React from 'react';
import {
  Building2,
  Pill,
  AlertTriangle,
  ShieldCheck,
  Zap,
  TrendingDown,
  ArrowRight,
  Sparkles,
  Clock,
  CheckCircle2,
  MapPin,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Facility, FacilityMedicineRecord, CriticalAlert, RedistributionPlan, NetworkHealthStats } from '../types';

interface CommandCenterProps {
  stats: NetworkHealthStats;
  facilities: Facility[];
  alerts: CriticalAlert[];
  recommendations: RedistributionPlan[];
  onOpenRecommendation: (rec: RedistributionPlan) => void;
  onExecuteRecommendation: (rec: RedistributionPlan) => void;
  onNavigateTab: (tab: any) => void;
  onSelectFacility: (fac: Facility) => void;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({
  stats,
  facilities,
  alerts,
  recommendations,
  onOpenRecommendation,
  onExecuteRecommendation,
  onNavigateTab,
  onSelectFacility,
}) => {
  const topRec = recommendations[0];

  const pieData = [
    { name: 'Safe Facilities', value: stats.safeFacilities, color: '#10b981' },
    { name: 'At-Risk Facilities', value: stats.atRiskFacilities, color: '#f59e0b' },
    { name: 'Critical Facilities', value: stats.criticalFacilities, color: '#f43f5e' },
  ];

  const criticalFacilitiesList = facilities.filter((f) => f.status === 'critical').slice(0, 4);

  return (
    <div className="space-y-6 pb-12" id="command-center-view">
      {/* Top Section Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            Healthcare Supply Network Command Center
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Autonomous multi-tier redistribution & predictive dual-risk mitigation grid
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            AI Network Telemetry Active
          </span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4" id="kpi-cards-grid">
        {/* Total Facilities */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Healthcare Facilities</span>
            <Building2 className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{stats.totalFacilities}</span>
            <span className="text-[11px] text-slate-500">PHC / CHC / GH</span>
          </div>
        </div>

        {/* Medicines Monitored */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Medicines Monitored</span>
            <Pill className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{stats.medicinesMonitored}</span>
            <span className="text-[11px] text-teal-600 font-medium">Essential List</span>
          </div>
        </div>

        {/* Critical Facilities */}
        <div className="bg-white p-4 rounded-xl border border-rose-200/80 bg-rose-50/20 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-rose-700 mb-2">
            <span className="text-xs font-semibold">Critical Facilities</span>
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-rose-700">{stats.criticalFacilities}</span>
            <span className="text-[11px] text-rose-600 font-medium">&lt; 5 days stock</span>
          </div>
        </div>

        {/* At-Risk Facilities */}
        <div className="bg-white p-4 rounded-xl border border-amber-200/80 bg-amber-50/20 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-700 mb-2">
            <span className="text-xs font-semibold">At-Risk Facilities</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-700">{stats.atRiskFacilities}</span>
            <span className="text-[11px] text-amber-600 font-medium">Surge / Expiry</span>
          </div>
        </div>

        {/* Resilience Score */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Resilience Score</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{stats.resilienceScore}%</span>
            <span className="text-[11px] text-emerald-600 font-medium">Self-Healing</span>
          </div>
        </div>

        {/* Waste Prevented */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Waste Prevented</span>
            <TrendingDown className="w-4 h-4 text-teal-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-teal-700">{stats.potentialWastePreventedINR}</span>
            <span className="text-[10px] text-slate-500">Exp. Saved</span>
          </div>
        </div>
      </div>

      {/* Featured AI Recommendation Highlight Card */}
      {topRec && (
        <div
          id="featured-ai-recommendation-card"
          className="rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50/70 via-white to-emerald-50/50 p-5 md:p-6 shadow-sm relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-32 h-32 bg-teal-200/30 rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-teal-600 text-white flex items-center gap-1.5 uppercase tracking-wide">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  Recommended Action
                </span>
                <span className="text-xs font-semibold text-teal-800 bg-teal-100/70 px-2.5 py-0.5 rounded-full">
                  Confidence: {topRec.confidence}%
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  ETA: {topRec.estimatedDeliveryHours} days ({topRec.distanceKm} km transit)
                </span>
              </div>

              <div>
                <h3 className="text-lg md:text-xl font-bold text-slate-900">
                  Transfer {topRec.quantity} units of {topRec.medicine} from {topRec.fromFacilityName} to {topRec.toFacilityName}
                </h3>
                <p className="text-xs md:text-sm text-slate-600 mt-1 leading-relaxed">
                  <span className="font-semibold text-slate-800">Operational Justification: </span>
                  {topRec.reason}
                </p>
              </div>

              {/* Dual-Risk Before vs After comparison pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                <div className="p-2.5 rounded-lg bg-white/90 border border-slate-200 shadow-2xs">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Shortage Risk Before</span>
                  <span className="text-base font-bold text-rose-600">{topRec.beforeShortageRisk}%</span>
                </div>
                <div className="p-2.5 rounded-lg bg-emerald-50/80 border border-emerald-200 shadow-2xs">
                  <span className="text-[10px] uppercase font-semibold text-emerald-700 block">Shortage Risk After</span>
                  <span className="text-base font-bold text-emerald-700">{topRec.afterShortageRisk}%</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white/90 border border-slate-200 shadow-2xs">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Source Expiry Risk</span>
                  <span className="text-base font-bold text-amber-600">{topRec.beforeExpiryRisk}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-emerald-50/80 border border-emerald-200 shadow-2xs">
                  <span className="text-[10px] uppercase font-semibold text-emerald-700 block">Source Expiry After</span>
                  <span className="text-base font-bold text-emerald-700">{topRec.afterExpiryRisk}</span>
                </div>
              </div>
            </div>

            {/* Actions for recommendation */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 justify-center">
              <button
                id="btn-view-recommendation"
                onClick={() => onOpenRecommendation(topRec)}
                className="px-4 py-2.5 rounded-lg text-xs font-semibold bg-white text-slate-700 hover:text-slate-900 border border-slate-300 hover:border-slate-400 transition-colors shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                View Recommendation
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                id="btn-execute-recommendation"
                onClick={() => onExecuteRecommendation(topRec)}
                disabled={topRec.status === 'executed'}
                className={`px-4 py-2.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  topRec.status === 'executed'
                    ? 'bg-emerald-600 text-white cursor-default'
                    : 'bg-teal-600 hover:bg-teal-700 text-white shadow-sm shadow-teal-700/20 active:scale-[0.98]'
                }`}
              >
                {topRec.status === 'executed' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Redistribution In Transit
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-amber-300" />
                    Execute Redistribution
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Two-Column Split: Network Health Overview & Critical Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Network Health Overview (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs" id="network-health-overview-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Network Health Overview</h2>
                <p className="text-xs text-slate-500">Distribution of 20 Tamil Nadu medical node tiers</p>
              </div>
              <button
                onClick={() => onNavigateTab('network_map')}
                className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
              >
                Inspect Map <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              {/* Pie Chart */}
              <div className="sm:col-span-5 h-44 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={46}
                      outerRadius={66}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: any, name: any) => [`${val} Facilities`, name]}
                      contentStyle={{
                        borderRadius: '8px',
                        fontSize: '12px',
                        backgroundColor: '#0f172a',
                        color: '#fff',
                        border: 'none',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend & Breakdown */}
              <div className="sm:col-span-7 space-y-3">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-200/60">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-emerald-950">Safe Facilities</span>
                      <p className="text-[10px] text-emerald-700">&gt; 15 days stock, low expiry</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-emerald-700">{stats.safeFacilities} ({(stats.safeFacilities * 5)}%)</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-amber-50/60 border border-amber-200/60">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-amber-950">Medium-Risk Facilities</span>
                      <p className="text-[10px] text-amber-700">5-14 days stock or expiry surplus</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-amber-700">{stats.atRiskFacilities} ({(stats.atRiskFacilities * 5)}%)</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-rose-50/60 border border-rose-200/60">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500 shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-rose-950">Critical Facilities</span>
                      <p className="text-[10px] text-rose-700">&lt; 5 days stockout horizon</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-rose-700">{stats.criticalFacilities} ({(stats.criticalFacilities * 5)}%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Urgent Attention Node Highlights */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-900">Immediate Facility Watchlist</h2>
              <span className="text-xs text-slate-500">Sorted by shortage probability</span>
            </div>

            <div className="space-y-2.5">
              {criticalFacilitiesList.map((fac) => (
                <div
                  key={fac.id}
                  onClick={() => onSelectFacility(fac)}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50/80 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
                      {fac.code.replace('PHC-', 'P')}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                          {fac.name}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-mono">
                          {fac.district}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Patient Load: {fac.patientLoad}/day • Supplier ETA: {fac.deliveryETA}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-rose-600">{fac.shortageProbability}% Shortage Risk</span>
                    <p className="text-[10px] text-slate-400">Click to diagnose</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Critical Alerts Feed (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col h-full" id="critical-alerts-feed">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <h2 className="text-sm font-bold text-slate-900">Critical Alerts</h2>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {alerts.length} Active
              </span>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto max-h-[500px] pr-1">
              {(alerts || []).map((alert) => {
                const isCritical = alert.severity === 'critical';
                return (
                  <div
                    key={alert.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isCritical
                        ? 'bg-rose-50/40 border-rose-200/80 hover:border-rose-300'
                        : 'bg-amber-50/30 border-amber-200/80 hover:border-amber-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          isCritical ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {alert.type.toUpperCase()} • {alert.severity}
                      </span>
                      <span className="text-[10px] text-slate-400">{alert.timestamp}</span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 mt-1.5">{alert.title}</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-snug">{alert.description}</p>

                    <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 font-medium flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {alert.facilityName}
                      </span>
                      <button
                        onClick={() => {
                          if (topRec) onOpenRecommendation(topRec);
                          else onNavigateTab('medicine_intel');
                        }}
                        className="font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-0.5"
                      >
                        Resolve <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
