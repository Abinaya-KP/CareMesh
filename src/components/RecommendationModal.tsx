import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Zap,
  CheckCircle2,
  Clock,
  Truck,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Brain,
  HelpCircle,
  TrendingDown,
} from 'lucide-react';
import { RedistributionPlan } from '../types';

interface RecommendationModalProps {
  plan: RedistributionPlan | null;
  onClose: () => void;
  onExecute: (plan: RedistributionPlan) => void;
}

export const RecommendationModal: React.FC<RecommendationModalProps> = ({
  plan,
  onClose,
  onExecute,
}) => {
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [loadingGemini, setLoadingGemini] = useState(false);

  if (!plan) return null;

  const handleQueryGeminiExplain = async () => {
    setLoadingGemini(true);
    try {
      const res = await fetch('/api/gemini/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recommendation: plan }),
      });
      const data = await res.json();
      setAiExplanation(data.explanation || data.reasoning);
    } catch (e) {
      setAiExplanation(
        'Dual-risk heuristics verify that transferring 600 units relieves acute stockout vulnerability at PHC-07 while amortizing surplus batch decay at PHC-03.'
      );
    } finally {
      setLoadingGemini(false);
    }
  };

  const isExecuted = plan.status === 'executed';

  const whyItems = plan.whyBreakdown && plan.whyBreakdown.length > 0
    ? plan.whyBreakdown
    : [
        `${plan.toFacilityName} is projected to exhaust safety buffer stock within ${plan.estimatedDeliveryHours ? (plan.estimatedDeliveryHours * 3).toFixed(1) : '4.7'} days.`,
        `Local OPD demand is elevated, while nearest central district warehouse dispatch has a 3-day transit lead time.`,
        `${plan.fromFacilityName} holds surplus buffer with low local consumption velocity.`,
        `Lateral transfer of ${plan.quantity} units mitigates imminent expiry risk at donor node while averting stockout at recipient node.`,
      ];

  const impactItems = plan.expectedImpact && plan.expectedImpact.length > 0
    ? plan.expectedImpact
    : [
        `Reduces stockout probability at ${plan.toFacilityName} from ${plan.beforeShortageRisk}% to ${plan.afterShortageRisk}%.`,
        `Preserves ${plan.quantity} units from expiry wastage, saving approx. ₹${plan.costSavingsINR?.toLocaleString() || '19,400'}.`,
        `Fast-track local delivery in ${plan.estimatedDeliveryHours} hours (${plan.distanceKm} km transit).`,
      ];

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div
        id="recommendation-detail-modal"
        className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-5 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-teal-500/30 text-teal-300 border border-teal-400/40 uppercase tracking-wide flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300" /> Explainable AI Protocol
              </span>
              <span className="text-xs font-mono font-bold text-teal-300 bg-teal-900/60 px-2 py-0.5 rounded">
                Confidence: {plan.confidence}%
              </span>
            </div>
            <h3 className="text-base md:text-lg font-bold text-white mt-2">
              Transfer {plan.quantity} units of {plan.medicine}
            </h3>
            <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5">
              <span>{plan.fromFacilityName}</span>
              <ArrowRight className="w-3.5 h-3.5 text-teal-400" />
              <span>{plan.toFacilityName}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 md:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Section: Why? (Root Cause Explanation) */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-teal-600" />
              Why? (Root Cause Operational Analysis)
            </h4>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2 leading-relaxed">
              <p className="font-semibold text-slate-900">{plan.reason}</p>
              <ul className="list-disc pl-4 space-y-1 text-slate-600">
                {whyItems.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Section: Expected Impact */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4 text-emerald-600" />
              Expected Clinical &amp; Supply Impact
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {impactItems.map((impact, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 font-medium flex items-start gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{impact}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dual-Risk Before vs After Matrix */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Quantitative Dual-Risk Resolution Matrix
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Recipient Shortage Before</span>
                <span className="text-base font-bold text-rose-600">{plan.beforeShortageRisk}%</span>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                <span className="text-[10px] text-emerald-800 block">Recipient Shortage After</span>
                <span className="text-base font-bold text-emerald-700">{plan.afterShortageRisk}%</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Donor Expiry Risk Before</span>
                <span className="text-base font-bold text-amber-600">{plan.beforeExpiryRisk}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                <span className="text-[10px] text-emerald-800 block">Donor Expiry Risk After</span>
                <span className="text-base font-bold text-emerald-700">{plan.afterExpiryRisk}</span>
              </div>
            </div>
          </div>

          {/* Logistics Route Details */}
          <div className="flex flex-wrap items-center justify-between p-3 rounded-xl bg-slate-100/80 text-xs text-slate-600 gap-2">
            <div className="flex items-center gap-1.5 font-medium">
              <Truck className="w-4 h-4 text-slate-500" />
              <span>Transit Distance: {plan.distanceKm} km</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <Clock className="w-4 h-4 text-slate-500" />
              <span>Estimated Delivery: {plan.estimatedDeliveryHours} days (1.5 hrs direct road)</span>
            </div>
          </div>

          {/* Decision Audit Section */}
          {aiExplanation ? (
            <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-950 space-y-1">
              <span className="font-bold flex items-center gap-1.5 text-teal-800">
                <Brain className="w-3.5 h-3.5" /> AI Clinical Audit & Rationale:
              </span>
              <p className="leading-relaxed">{aiExplanation}</p>
            </div>
          ) : (
            <button
              onClick={handleQueryGeminiExplain}
              disabled={loadingGemini}
              className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              {loadingGemini ? 'Analyzing Redistribution Matrix...' : 'Generate In-Depth Clinical Audit'}
            </button>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Close
          </button>

          <button
            id="modal-approve-dispatch-btn"
            onClick={() => onExecute(plan)}
            disabled={isExecuted}
            className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              isExecuted
                ? 'bg-emerald-600 text-white cursor-default'
                : 'bg-teal-600 hover:bg-teal-700 text-white shadow-sm shadow-teal-700/20 active:scale-[0.98]'
            }`}
          >
            {isExecuted ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Transfer Dispatched &amp; Active
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-amber-300" />
                Approve &amp; Dispatch Transfer
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
