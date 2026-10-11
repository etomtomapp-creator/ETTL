import React from 'react';
import { ArrowRight, Calculator } from 'lucide-react';
import { audioEngine } from '../../services/audioService';

interface HeroSectionProps {
  onExploreFleet: () => void;
  onOpenCalculator: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreFleet,
  onOpenCalculator,
}) => {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-gradient-to-b from-white via-pink-50/30 to-white">
      {/* Background radial luxury Foodpanda pink lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#D70F64]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[450px] h-[350px] bg-pink-300/15 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Unboxed Metadata Kicker (Anti-pill discipline) */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs md:text-sm text-slate-500 font-medium mb-6">
            <span className="text-[#D70F64] font-bold tracking-wider uppercase">ETTL Vehicle Fleet Fund III</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>Target Raise $12.5M</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-[#D70F64] font-mono font-bold">19.8% – 24.2% Net APY</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>100% Asset-Backed</span>
          </div>

          {/* Marquee Display Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-extrabold text-slate-900 tracking-tight leading-[1.08] mb-6">
            Invest in Motion.{' '}
            <span className="bg-gradient-to-r from-[#D70F64] to-[#E21B70] bg-clip-text text-transparent">
              Own the Future of Mobility.
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-base sm:text-lg md:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto mb-10">
            ETTL Investment enables qualified investors to participate in high-demand luxury vehicle rental fleets. Generate predictable quarterly cashflow backed by physical automotive equity and Fortune 500 corporate leases.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={() => {
                audioEngine.playClick();
                onExploreFleet();
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#D70F64] hover:bg-[#E21B70] text-white font-semibold text-sm tracking-wide transition-all shadow-xl shadow-[#D70F64]/25 hover:shadow-[#D70F64]/35 hover:scale-[1.02] flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <span>Explore Fleet Showroom</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                audioEngine.playClick();
                onOpenCalculator();
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white hover:bg-pink-50/60 text-slate-800 font-semibold text-sm border border-slate-200 hover:border-pink-300 transition-all shadow-sm flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <Calculator className="w-4 h-4 text-[#D70F64]" />
              <span>Launch ROI Simulator</span>
            </button>
          </div>
        </div>

        {/* 4-Column KPI Trust Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-3xl bg-white border border-pink-100 shadow-xl shadow-pink-900/5">
          <div className="p-4 rounded-2xl bg-pink-50/40 border border-pink-100/50">
            <div className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tabular-nums mb-1">
              $48.5M+
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Physical Fleet Value Under Management
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-pink-50/40 border border-pink-100/50">
            <div className="text-2xl sm:text-3xl font-display font-bold text-[#D70F64] tabular-nums mb-1">
              88.5%
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Average Corporate Fleet Utilization
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-pink-50/40 border border-pink-100/50">
            <div className="text-2xl sm:text-3xl font-display font-bold text-[#D70F64] tabular-nums mb-1">
              19.8% – 24.2%
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Target Annualized Net Dividend Yield
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-pink-50/40 border border-pink-100/50">
            <div className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tabular-nums mb-1">
              100%
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Comprehensive Tier-1 Risk Insurance
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
