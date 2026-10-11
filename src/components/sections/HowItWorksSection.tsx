import React from 'react';
import { HOW_IT_WORKS_STEPS } from '../../data/mockData';
import { Lock } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  return (
    <section id="how-it-works" className="py-24 relative bg-[#FAFAFC] border-t border-pink-100">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#D70F64] font-bold mb-2">
            <span>03. Operational Discipline</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>End-to-End Fleet Lifecycle</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-slate-900 tracking-tight mb-4">
            How ETTL Operates & Generates Yield
          </h2>
          <p className="text-sm md:text-base text-slate-600 leading-relaxed">
            Unlike speculative financial instruments, every dollar in the ETTL vehicle fund is anchored to physical, revenue-generating mobile machinery protected by strict operational controls.
          </p>
        </div>

        {/* 4-Stage Bento Flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {HOW_IT_WORKS_STEPS.map((step) => (
            <div
              key={step.number}
              className="p-8 rounded-3xl bg-white border border-pink-100 shadow-sm hover:shadow-xl hover:border-pink-300 transition-all group"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="text-3xl font-display font-black text-[#D70F64] font-mono">
                  {step.number}
                </span>
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                  Phase {step.number}
                </span>
              </div>

              <h3 className="text-xl font-display font-bold text-slate-900 mb-3 group-hover:text-[#D70F64] transition-colors">
                {step.title}
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                {step.description}
              </p>

              <div className="p-4 rounded-xl bg-pink-50/50 border border-pink-100/70 text-xs text-slate-600 leading-relaxed">
                <strong className="text-slate-900 block mb-1">Operational Safeguard:</strong>
                {step.detail}
              </div>
            </div>
          ))}
        </div>

        {/* High-Impact Institutional Security Callout Banner */}
        <div className="p-8 md:p-10 rounded-3xl bg-gradient-to-r from-pink-50/80 via-white to-pink-50/80 border border-pink-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#D70F64] flex items-center justify-center text-white shrink-0 shadow-md shadow-[#D70F64]/30">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-display font-bold text-slate-900 mb-1">
                Asset Custody & Ring-Fenced Legal Structure
              </h4>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed max-w-2xl">
                Each vehicle syndicate is held in an independent Special Purpose Vehicle (SPV) with zero commingling of fund capital. Investor title equity is registered before vehicles are deployed onto roads.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 shrink-0">
            <div className="text-right">
              <div className="text-xs text-slate-500">Independent Legal Audit</div>
              <div className="text-sm font-semibold text-slate-900">Baker McKenzie SPV Framework</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
