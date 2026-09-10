import React, { useState } from 'react';
import {
  Search,
  Filter,
  Pill,
  TrendingDown,
  AlertTriangle,
  Clock,
  ChevronRight,
  X,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
  ComposedChart,
} from 'recharts';
import { FacilityMedicineRecord, RedistributionPlan } from '../types';
import { generateForecastData } from '../utils/engine';

interface MedicineIntelligenceProps {
  records: FacilityMedicineRecord[];
  onOpenRecommendation: (rec: RedistributionPlan) => void;
  recommendations: RedistributionPlan[];
}

export const MedicineIntelligence: React.FC<MedicineIntelligenceProps> = ({
  records,
  onOpenRecommendation,
  recommendations,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRiskTier, setSelectedRiskTier] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState<FacilityMedicineRecord | null>(null);

  const categories = ['all', 'Antipyretic', 'Antibiotic', 'Hydration', 'Endocrine', 'Critical Care', 'Emergency'];

  const filteredRecords = records.filter((rec) => {
    const matchSearch =
      rec.medicineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.facilityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.facilityDistrict.toLowerCase().includes(searchTerm.toLowerCase());

    const matchCategory = selectedCategory === 'all' || rec.category === selectedCategory;

    let matchRisk = true;
    if (selectedRiskTier === 'critical') matchRisk = rec.shortageRisk > 70;
    else if (selectedRiskTier === 'expiry') matchRisk = rec.expiryRiskLevel === 'high';
    else if (selectedRiskTier === 'safe') matchRisk = rec.shortageRisk < 40 && rec.expiryRiskLevel === 'low';

    return matchSearch && matchCategory && matchRisk;
  });

  // Chart data for selected medicine
  const chartData = selectedRecord
    ? generateForecastData(selectedRecord.dailyConsumption, 7, selectedRecord.shortageRisk > 75 ? 1.35 : 1.0)
    : [];

  const stockoutDays = selectedRecord ? selectedRecord.daysRemaining : 0;
  const stockoutDateStr = new Date(Date.now() + stockoutDays * 86400000).toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="space-y-4 pb-12" id="medicine-intelligence-view">
      {/* Heading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            Medicine Intelligence &amp; Stock Diagnostics
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Deterministic burn-rate tracking, stockout horizons, and dual-risk expiry surveillance
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="medicine-search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by drug name, facility, or district..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Category filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-teal-500"
              aria-label="Filter by Drug Category"
            >
              <option value="all">All Categories</option>
              {categories.filter(c => c !== 'all').map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Risk Tier filter */}
          <select
            value={selectedRiskTier}
            onChange={(e) => setSelectedRiskTier(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-teal-500"
            aria-label="Filter by Risk Priority"
          >
            <option value="all">All Risk Horizons</option>
            <option value="critical">Critical Shortage (&lt;5 days)</option>
            <option value="expiry">High Expiry Wastage</option>
            <option value="safe">Optimal Safe Buffer</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Medicine</th>
                <th className="py-3 px-4">Facility &amp; District</th>
                <th className="py-3 px-3 text-right">Current Stock</th>
                <th className="py-3 px-3 text-right">Daily Burn</th>
                <th className="py-3 px-3 text-right">7-Day Forecast</th>
                <th className="py-3 px-3 text-right">Days Remaining</th>
                <th className="py-3 px-3 text-center">Shortage Risk</th>
                <th className="py-3 px-3 text-center">Expiry Risk</th>
                <th className="py-3 px-4 text-center">Recommended Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredRecords.map((rec) => {
                const isCriticalShortage = rec.daysRemaining < 5.0;
                const isHighExpiry = rec.expiryRiskLevel === 'high';

                return (
                  <tr
                    key={rec.id}
                    onClick={() => setSelectedRecord(rec)}
                    className="hover:bg-slate-50/90 transition-colors cursor-pointer group"
                  >
                    {/* Medicine */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                            isCriticalShortage
                              ? 'bg-rose-100 text-rose-700'
                              : isHighExpiry
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-teal-50 text-teal-700'
                          }`}
                        >
                          <Pill className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                            {rec.medicineName}
                          </div>
                          <span className="text-[10px] text-slate-400 font-normal">{rec.category}</span>
                        </div>
                      </div>
                    </td>

                    {/* Facility */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{rec.facilityName}</div>
                      <span className="text-[10px] text-slate-500">{rec.facilityDistrict}</span>
                    </td>

                    {/* Current Stock */}
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                      {rec.currentStock.toLocaleString()}
                    </td>

                    {/* Daily Consumption */}
                    <td className="py-3 px-3 text-right font-mono text-slate-600">
                      {rec.dailyConsumption} / day
                    </td>

                    {/* Forecast Demand */}
                    <td className="py-3 px-3 text-right font-mono text-slate-600">
                      {rec.forecastDemand7d} units
                    </td>

                    {/* Days Remaining (strictly Current Stock / Daily Consumption) */}
                    <td className="py-3 px-3 text-right">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded font-mono font-bold text-xs ${
                          isCriticalShortage
                            ? 'bg-rose-100 text-rose-800'
                            : rec.daysRemaining < 10
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-50 text-emerald-800'
                        }`}
                      >
                        {rec.daysRemaining} days
                      </span>
                    </td>

                    {/* Shortage Risk */}
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`font-bold ${
                          rec.shortageRisk > 75
                            ? 'text-rose-600'
                            : rec.shortageRisk > 40
                            ? 'text-amber-600'
                            : 'text-emerald-600'
                        }`}
                      >
                        {rec.shortageRisk}%
                      </span>
                    </td>

                    {/* Expiry Risk */}
                    <td className="py-3 px-3 text-center">
                      {isHighExpiry ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          High ({rec.expiryQuantity} u)
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-normal">Low (Safe)</span>
                      )}
                    </td>

                    {/* Recommended Action */}
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block text-[11px] font-semibold px-2.5 py-1 rounded-md ${
                          rec.recommendedAction === 'Transfer In'
                            ? 'bg-rose-600 text-white shadow-2xs'
                            : rec.recommendedAction === 'Transfer Out'
                            ? 'bg-teal-600 text-white shadow-2xs'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {rec.recommendedAction}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Modal / Drawer when a medicine row is clicked */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div
            id="medicine-detail-modal"
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl p-6 space-y-6"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                  <Pill className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedRecord.medicineName}</h3>
                  <p className="text-xs text-slate-500">
                    {selectedRecord.facilityName} • {selectedRecord.facilityDistrict}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Demand Forecast 7-Day Chart */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Demand Forecast (Next 7 Days)</h4>
                  <p className="text-[11px] text-slate-500">Historical burn vs machine-projected seasonal trajectory</p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-teal-50 text-teal-700 font-semibold border border-teal-200">
                  Daily Burn: {selectedRecord.dailyConsumption} units
                </span>
              </div>

              <div className="h-48 w-full bg-slate-50/50 p-2 rounded-xl border border-slate-200/80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                    <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '8px',
                        fontSize: '11px',
                        backgroundColor: '#0f172a',
                        color: '#fff',
                        border: 'none',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="historicalConsumption"
                      name="Historical"
                      stroke="#0284c7"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="forecastDemand"
                      name="Forecast Demand"
                      stroke="#14b8a6"
                      strokeWidth={2.5}
                      strokeDasharray="4 4"
                      dot={{ r: 4 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Shortage vs Expiry Breakdown Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Shortage Prediction Card */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-rose-500" /> Shortage Prediction
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded ${
                      selectedRecord.shortageRisk > 70 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {selectedRecord.shortageRisk}% Risk
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Current Physical Stock:</span>
                    <span className="font-bold text-slate-900">{selectedRecord.currentStock} units</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Forecast 7-Day Demand:</span>
                    <span className="font-bold text-slate-900">{selectedRecord.forecastDemand7d} units</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Stockout Date:</span>
                    <span className="font-bold text-rose-600">{stockoutDateStr} ({selectedRecord.daysRemaining} days)</span>
                  </div>
                </div>
              </div>

              {/* Expiry Prediction Card */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Expiry Prediction
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded ${
                      selectedRecord.expiryRiskLevel === 'high' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {selectedRecord.expiryRiskLevel.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Total Quantity:</span>
                    <span className="font-bold text-slate-900">{selectedRecord.currentStock} units</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Likely Spoilage / Expiry:</span>
                    <span className="font-bold text-amber-600">{selectedRecord.expiryQuantity} units</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Potential Wastage Loss:</span>
                    <span className="font-bold text-rose-700">₹{selectedRecord.potentialWasteValueINR.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Trigger in Modal */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const matchingRec =
                    recommendations.find(
                      (r) =>
                        r.medicine.toLowerCase().includes(selectedRecord.medicineName.toLowerCase()) ||
                        r.toFacilityId === selectedRecord.facilityId ||
                        r.fromFacilityId === selectedRecord.facilityId
                    ) || recommendations[0];
                  setSelectedRecord(null);
                  if (matchingRec) onOpenRecommendation(matchingRec);
                }}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                Find Optimal Redistribution Route
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
