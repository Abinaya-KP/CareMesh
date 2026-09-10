import React, { useState } from 'react';
import {
  MapPin,
  Building2,
  Truck,
  Layers,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  ChevronRight,
  X,
  Clock,
  Pill,
  Users,
  Activity,
  ArrowRight,
  Compass,
} from 'lucide-react';
import { Facility, Warehouse, Supplier, RedistributionPlan } from '../types';
import { SYNTHETIC_WAREHOUSES, SYNTHETIC_SUPPLIERS } from '../data/syntheticData';

interface NetworkMapProps {
  facilities: Facility[];
  selectedFacility: Facility | null;
  onSelectFacility: (fac: Facility | null) => void;
  recommendations: RedistributionPlan[];
  onOpenRecommendation: (rec: RedistributionPlan) => void;
}

export const NetworkMap: React.FC<NetworkMapProps> = ({
  facilities,
  selectedFacility,
  onSelectFacility,
  recommendations,
  onOpenRecommendation,
}) => {
  const [districtFilter, setDistrictFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showSupplyRoutes, setShowSupplyRoutes] = useState<boolean>(true);

  const districts = ['all', 'Chennai', 'Chengalpattu', 'Kanchipuram', 'Coimbatore', 'Madurai', 'Tiruchirappalli'];

  const filteredFacilities = facilities.filter((fac) => {
    if (districtFilter !== 'all' && fac.district !== districtFilter) return false;
    if (statusFilter !== 'all' && fac.status !== statusFilter) return false;
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe':
        return 'bg-emerald-500 border-emerald-300 text-white shadow-emerald-500/30';
      case 'at-risk':
        return 'bg-amber-500 border-amber-300 text-white shadow-amber-500/30';
      case 'critical':
        return 'bg-rose-600 border-rose-300 text-white shadow-rose-600/40 animate-pulse';
      default:
        return 'bg-slate-400 border-slate-200 text-white';
    }
  };

  return (
    <div className="space-y-4 pb-12" id="network-map-view">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
              Tamil Nadu Healthcare Logistics Mesh
            </h1>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              Synthetic Demo Data
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Hierarchical topology: 3 State Suppliers → 2 District Warehouses → 20 Primary/Secondary Facilities
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* District filter */}
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-teal-500"
            aria-label="Filter by District"
          >
            <option value="all">All Districts (6)</option>
            {districts.filter(d => d !== 'all').map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-teal-500"
            aria-label="Filter by Node Status"
          >
            <option value="all">All Risk Tiers</option>
            <option value="safe">Safe Only</option>
            <option value="at-risk">At-Risk Only</option>
            <option value="critical">Critical Only</option>
          </select>

          {/* Toggle routes */}
          <button
            onClick={() => setShowSupplyRoutes(!showSupplyRoutes)}
            className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 transition-colors ${
              showSupplyRoutes
                ? 'bg-teal-50 border-teal-200 text-teal-700'
                : 'bg-white border-slate-200 text-slate-600'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Supply Corridors
          </button>
        </div>
      </div>

      {/* Main Map Canvas Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Visual Map / Topological Canvas (8 cols on desktop) */}
        <div className="lg:col-span-8 bg-slate-950 rounded-2xl p-4 md:p-6 border border-slate-800 shadow-lg relative min-h-[520px] overflow-hidden flex flex-col justify-between select-none">
          {/* Subtle Grid Lines Background */}
          <div
            className="absolute inset-0 opacity-[0.12] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#14b8a6 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Compass & Geographic Context Overlay */}
          <div className="relative z-10 flex items-center justify-between text-slate-400 text-xs">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 bg-slate-900/90 px-2.5 py-1 rounded-md border border-slate-800 text-[11px] text-slate-300">
                <Compass className="w-3.5 h-3.5 text-teal-400" />
                Tamil Nadu Grid (13.08° N to 9.92° N)
              </span>
              <span className="text-[10px] text-slate-400 hidden sm:inline">
                Live Node State: {filteredFacilities.length} displayed
              </span>
            </div>

            {/* Legend inside map */}
            <div className="flex items-center gap-3 bg-slate-900/90 px-3 py-1 rounded-md border border-slate-800 text-[11px]">
              <span className="flex items-center gap-1 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Safe
              </span>
              <span className="flex items-center gap-1 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> At-Risk
              </span>
              <span className="flex items-center gap-1 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600" /> Critical
              </span>
            </div>
          </div>

          {/* SVG Connection Lines & Routes */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {showSupplyRoutes && (
              <>
                {/* Supplier to Warehouse corridors */}
                <line x1="74%" y1="18%" x2="68%" y2="28%" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 4" opacity="0.6" />
                <line x1="80%" y1="15%" x2="68%" y2="28%" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 4" opacity="0.6" />
                <line x1="80%" y1="15%" x2="30%" y2="48%" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 4" opacity="0.6" />
                <line x1="48%" y1="72%" x2="30%" y2="48%" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 4" opacity="0.6" />

                {/* Warehouse to Cluster links */}
                {/* W-01 (Kanchipuram) routes */}
                <line x1="68%" y1="28%" x2="78%" y2="22%" stroke="#0284c7" strokeWidth="1.2" opacity="0.4" />
                <line x1="68%" y1="28%" x2="74%" y2="26%" stroke="#0284c7" strokeWidth="1.2" opacity="0.4" />
                <line x1="68%" y1="28%" x2="64%" y2="32%" stroke="#0284c7" strokeWidth="1.2" opacity="0.4" />
                <line x1="68%" y1="28%" x2="72%" y2="34%" stroke="#f43f5e" strokeWidth="1.6" strokeDasharray="3 3" opacity="0.8" />
                <line x1="68%" y1="28%" x2="72%" y2="28%" stroke="#0284c7" strokeWidth="1.2" opacity="0.4" />

                {/* W-02 (Coimbatore) routes */}
                <line x1="30%" y1="48%" x2="26%" y2="54%" stroke="#f43f5e" strokeWidth="1.6" strokeDasharray="3 3" opacity="0.8" />
                <line x1="30%" y1="48%" x2="28%" y2="44%" stroke="#0284c7" strokeWidth="1.2" opacity="0.4" />
                <line x1="30%" y1="48%" x2="34%" y2="50%" stroke="#0284c7" strokeWidth="1.2" opacity="0.4" />
                <line x1="30%" y1="48%" x2="48%" y2="72%" stroke="#0284c7" strokeWidth="1.2" opacity="0.4" />
                <line x1="30%" y1="48%" x2="54%" y2="56%" stroke="#0284c7" strokeWidth="1.2" opacity="0.4" />

                {/* Active Lateral Redistribution Highlight: PHC-03 -> PHC-07 */}
                <line
                  x1="64%"
                  y1="32%"
                  x2="72%"
                  y2="34%"
                  stroke="#14b8a6"
                  strokeWidth="3"
                  strokeDasharray="6 4"
                  className="animate-pulse"
                />
              </>
            )}
          </svg>

          {/* Node Overlay Positioning Container */}
          <div className="relative w-full h-[400px] z-10 my-auto">
            {/* Suppliers (Top/Regional) */}
            {SYNTHETIC_SUPPLIERS.map((sup) => (
              <div
                key={sup.id}
                style={{ left: `${sup.coordinates.x}%`, top: `${sup.coordinates.y}%` }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                title={`${sup.name} (${sup.location})`}
              >
                <div className="px-2 py-1 rounded bg-sky-950/90 border border-sky-500/60 text-sky-300 text-[10px] font-bold flex items-center gap-1 shadow-md">
                  <Truck className="w-3 h-3 text-sky-400" />
                  <span>{sup.code}</span>
                </div>
                <span className="hidden group-hover:block absolute left-1/2 -translate-x-1/2 top-full mt-1 bg-slate-900 text-slate-200 text-[9px] px-2 py-0.5 rounded border border-slate-700 whitespace-nowrap z-30">
                  {sup.name}
                </span>
              </div>
            ))}

            {/* District Warehouses */}
            {SYNTHETIC_WAREHOUSES.map((wh) => (
              <div
                key={wh.id}
                style={{ left: `${wh.coordinates.x}%`, top: `${wh.coordinates.y}%` }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                title={`${wh.name} (${wh.district})`}
              >
                <div className="px-2.5 py-1.5 rounded-lg bg-indigo-950/90 border border-indigo-400/80 text-indigo-200 text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-indigo-900/40">
                  <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{wh.code}</span>
                </div>
                <span className="hidden group-hover:block absolute left-1/2 -translate-x-1/2 top-full mt-1 bg-slate-900 text-slate-200 text-[10px] px-2 py-1 rounded border border-slate-700 whitespace-nowrap z-30">
                  {wh.name} • Stock: {(wh.currentStock / 1000).toFixed(0)}k units
                </span>
              </div>
            ))}

            {/* Healthcare Facilities Nodes */}
            {filteredFacilities.map((fac) => {
              const isSelected = selectedFacility?.id === fac.id;
              const statusColor = getStatusColor(fac.status);

              return (
                <button
                  key={fac.id}
                  id={`node-${fac.code}`}
                  onClick={() => onSelectFacility(fac)}
                  style={{ left: `${fac.coordinates.x}%`, top: `${fac.coordinates.y}%` }}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 group focus:outline-none cursor-pointer ${
                    isSelected ? 'scale-125 z-30' : 'hover:scale-115 z-10'
                  }`}
                  aria-label={`Facility ${fac.name}, Status: ${fac.status}`}
                >
                  <div
                    className={`w-6 h-6 md:w-7 md:h-7 rounded-full border-2 flex items-center justify-center text-[10px] font-bold shadow-md ${statusColor} ${
                      isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-950' : ''
                    }`}
                  >
                    {fac.code.includes('PHC') ? fac.code.replace('PHC-', '') : fac.code.slice(0, 3)}
                  </div>

                  {/* Tooltip on hover */}
                  <div className="hidden group-hover:block absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 bg-slate-900/95 text-slate-100 text-[10px] px-2 py-1 rounded-md border border-slate-700 whitespace-nowrap shadow-xl z-40 pointer-events-none">
                    <p className="font-bold">{fac.name}</p>
                    <p className="text-slate-400">
                      {fac.district} • Risk: {fac.shortageProbability}%
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Bottom active transfer banner */}
          <div className="relative z-10 bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-teal-400 animate-ping" />
              <span className="text-slate-300">
                <span className="font-bold text-teal-400">Active Self-Healing Route:</span> Lateral Transfer PHC-03 (Uthiramerur) → PHC-07 (Maduranthakam)
              </span>
            </div>
            <button
              onClick={() => onOpenRecommendation(recommendations[0])}
              className="text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1 self-end sm:self-auto cursor-pointer"
            >
              Examine Protocol <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Facility Detail Drawer / Panel (4 cols on desktop) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between min-h-[520px]">
          {selectedFacility ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                      {selectedFacility.code}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        selectedFacility.status === 'safe'
                          ? 'bg-emerald-100 text-emerald-800'
                          : selectedFacility.status === 'at-risk'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {selectedFacility.status}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1.5 leading-snug">
                    {selectedFacility.name}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {selectedFacility.location} ({selectedFacility.district})
                  </p>
                </div>
                <button
                  onClick={() => onSelectFacility(null)}
                  className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  aria-label="Close Facility Detail"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Patient Load & Stock metrics */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] uppercase font-semibold text-slate-500 block flex items-center gap-1">
                    <Users className="w-3 h-3 text-slate-400" /> Patient Load
                  </span>
                  <span className="text-base font-bold text-slate-900">{selectedFacility.patientLoad} / day</span>
                  <p className="text-[10px] text-slate-500">Average daily OPD</p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] uppercase font-semibold text-slate-500 block flex items-center gap-1">
                    <Pill className="w-3 h-3 text-slate-400" /> Total Stock
                  </span>
                  <span className="text-base font-bold text-slate-900">
                    {selectedFacility.totalStockUnits.toLocaleString()} units
                  </span>
                  <p className="text-[10px] text-slate-500">Across 15 essential drugs</p>
                </div>
              </div>

              {/* Risk Diagnostics */}
              <div className="space-y-2 pt-1">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-slate-700">Shortage Probability</span>
                    <span
                      className={`font-bold ${
                        selectedFacility.shortageProbability > 70
                          ? 'text-rose-600'
                          : selectedFacility.shortageProbability > 40
                          ? 'text-amber-600'
                          : 'text-emerald-600'
                      }`}
                    >
                      {selectedFacility.shortageProbability}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        selectedFacility.shortageProbability > 70
                          ? 'bg-rose-500'
                          : selectedFacility.shortageProbability > 40
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${selectedFacility.shortageProbability}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-slate-700">Expiry Risk Exposure</span>
                    <span
                      className={`font-bold ${
                        selectedFacility.expiryRiskScore > 60
                          ? 'text-amber-600'
                          : selectedFacility.expiryRiskScore > 30
                          ? 'text-slate-600'
                          : 'text-emerald-600'
                      }`}
                    >
                      {selectedFacility.expiryRiskScore}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-teal-500 h-full rounded-full"
                      style={{ width: `${selectedFacility.expiryRiskScore}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Critical Medicines List */}
              <div className="pt-2">
                <span className="text-xs font-bold text-slate-800 block mb-1.5">Monitored Drug Vulnerabilities</span>
                {selectedFacility.criticalMedicines && selectedFacility.criticalMedicines.length > 0 ? (
                  <div className="space-y-1.5">
                    {selectedFacility.criticalMedicines.map((med) => (
                      <div
                        key={med}
                        className="text-xs p-2 rounded-lg bg-rose-50/70 border border-rose-200 text-rose-900 flex items-center justify-between"
                      >
                        <span className="font-medium">{med}</span>
                        <span className="text-[10px] font-bold uppercase bg-rose-200/80 px-1.5 py-0.5 rounded text-rose-800">
                          Critical Burn
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs p-2 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>All monitored medicine stocks within optimal safety buffers.</span>
                  </div>
                )}
              </div>

              {/* Logistics & Supplier Meta */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1 text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-500">Primary Supplier:</span>
                  <span className="font-semibold text-slate-900">{selectedFacility.primarySupplierId} (MedLife / TNMSC)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Assigned Depot:</span>
                  <span className="font-semibold text-slate-900">{selectedFacility.assignedWarehouseId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Depot Transit Time:</span>
                  <span className="font-semibold text-slate-900 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" /> {selectedFacility.deliveryETA}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    const matchingRec =
                      recommendations.find(
                        (r) =>
                          r.toFacilityId === selectedFacility.id ||
                          r.fromFacilityId === selectedFacility.id
                      ) || recommendations[0];
                    if (matchingRec) onOpenRecommendation(matchingRec);
                  }}
                  className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  Generate AI Redistribution Plan
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-200">
                <Activity className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Select Any Network Node</h4>
              <p className="text-xs text-slate-500 max-w-[240px] leading-relaxed">
                Click any PHC, hospital, or warehouse node on the map to inspect real-time burn-rates, stockout dates, and dual-risk diagnostics.
              </p>
              <div className="pt-2">
                <span className="text-[11px] text-teal-700 font-medium bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                  Tip: PHC-07 &amp; PHC-03 show high active dual-risk
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
