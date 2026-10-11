import React, { useState } from 'react';
import { INVESTMENT_PRESETS } from '../../data/mockData';
import { ArrowRight, Check } from 'lucide-react';
import { audioEngine } from '../../services/audioService';

interface RoiCalculatorSectionProps {
  onCommitAmount: (amount: number) => void;
}

export const RoiCalculatorSection: React.FC<RoiCalculatorSectionProps> = ({
  onCommitAmount,
}) => {
  const [investmentAmount, setInvestmentAmount] = useState<number>(150000);

  const getYieldPercentage = (amount: number): number => {
    if (amount < 100000) return 19.8;
    if (amount < 300000) return 21.6;
    return 24.2;
  };

  const yieldRate = getYieldPercentage(investmentAmount);
  const annualDividend = (investmentAmount * yieldRate) / 100;
  const quarterlyDividend = annualDividend / 4;
  const monthlyDividend = annualDividend / 12;
  const threeYearTotal = annualDividend * 3;
  const vehiclesAssigned = Math.max(1, Math.round(investmentAmount / 50000));

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setInvestmentAmount(val);
  };

  const handleSelectPreset = (presetAmount: number) => {
    audioEngine.playClick();
    setInvestmentAmount(presetAmount);
  };

  return (
    <section id="calculator" className="py-24 relative bg-white border-t border-pink-100">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-[#D70F64] font-bold mb-2">
            <span>02. Financial Architecture</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>Real Cashflow Modeling</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-slate-900 tracking-tight mb-4">
            Interactive ROI & Yield Simulator
          </h2>
          <p className="text-sm md:text-base text-slate-600 leading-relaxed">
            Model your projected passive cash distributions across high-demand vehicle assets. All projections are net of insurance, preventative servicing, and fleet management fees.
          </p>
        </div>

        {/* Investment Presets (Segmented Tier Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {INVESTMENT_PRESETS.map((preset) => {
            const isSelected = investmentAmount === preset.amount;
            return (
              <div
                key={preset.id}
                onClick={() => handleSelectPreset(preset.amount)}
                className={`p-7 rounded-3xl transition-all cursor-pointer relative bg-white ${
                  isSelected
                    ? 'border-2 border-[#D70F64] shadow-[0_10px_30px_rgba(215,15,100,0.15)] scale-[1.02]'
                    : 'border border-slate-200 hover:border-pink-200 hover:shadow-md'
                }`}
              >
                {preset.badge && (
                  <div className="absolute top-5 right-5 text-[11px] font-bold uppercase tracking-wider text-white px-2.5 py-0.5 rounded-full bg-[#D70F64]">
                    {preset.badge}
                  </div>
                )}

                <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">
                  Tier {preset.id === 'syndicate' ? 'I' : preset.id === 'corporate' ? 'II' : 'III'}
                </div>
                <h3 className="text-xl font-display font-bold text-slate-900 mb-2">
                  {preset.title}
                </h3>
                <div className="text-3xl font-display font-black text-[#D70F64] tabular-nums mb-4">
                  ${preset.amount.toLocaleString()}
                </div>

                <div className="p-3.5 rounded-xl bg-pink-50/60 border border-pink-100 mb-6 space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600">Target Annual Net:</span>
                    <span className="font-mono font-bold text-[#D70F64]">{preset.projectedAnnualYield}% APY</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600">Quarterly Dividend:</span>
                    <span className="font-mono font-bold text-slate-900 tabular-nums">${preset.quarterlyPayout.toLocaleString()}/qtr</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600">Dedicated Fleet:</span>
                    <span className="font-mono font-bold text-slate-900 tabular-nums">{preset.vehiclesAllocated} Assets</span>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  {preset.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                      <Check className="w-3.5 h-3.5 text-[#D70F64] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                    isSelected
                      ? 'bg-[#D70F64] text-white font-bold'
                      : 'bg-slate-100 text-slate-700 hover:bg-pink-50 hover:text-[#D70F64]'
                  }`}
                >
                  <span>{isSelected ? 'Currently Modeling' : 'Select Allocation'}</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Dynamic Calculator Interactive Studio */}
        <div className="p-8 md:p-12 rounded-3xl bg-white border border-pink-100 shadow-xl shadow-pink-900/5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left: Interactive Sliders (6 Cols) */}
            <div className="lg:col-span-6 space-y-8">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label htmlFor="capital-slider" className="text-sm font-semibold text-slate-900">
                    Capital Allocation Amount
                  </label>
                  <span className="text-2xl sm:text-3xl font-display font-extrabold text-[#D70F64] tabular-nums">
                    ${investmentAmount.toLocaleString()}
                  </span>
                </div>

                {/* Range Slider */}
                <input
                  id="capital-slider"
                  type="range"
                  min="25000"
                  max="1000000"
                  step="25000"
                  value={investmentAmount}
                  onChange={handleSliderChange}
                  className="w-full h-2.5 bg-pink-100 rounded-lg appearance-none cursor-pointer accent-[#D70F64]"
                />

                <div className="flex justify-between text-xs text-slate-400 mt-2 font-mono">
                  <span>$25,000 (Min)</span>
                  <span>$500,000</span>
                  <span>$1,000,000+</span>
                </div>
              </div>

              {/* Allocation Breakdown Details */}
              <div className="space-y-4">
                <h4 className="text-xs uppercase tracking-wider text-slate-500 font-bold">
                  Portfolio Deployment Architecture
                </h4>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-pink-50/50 border border-pink-100/70">
                    <div className="text-xs text-slate-500 mb-1">Assigned Fleet Volume</div>
                    <div className="text-xl font-display font-bold text-slate-900 tabular-nums">
                      ~{vehiclesAssigned} Vehicles
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Direct physical title equity
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-pink-50/50 border border-pink-100/70">
                    <div className="text-xs text-slate-500 mb-1">Contract Term</div>
                    <div className="text-xl font-display font-bold text-slate-900">
                      24 – 36 Months
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Principal buyback option
                    </div>
                  </div>
                </div>

                {/* Revenue Share Waterfall Breakdown */}
                <div className="p-4 rounded-2xl bg-pink-50/50 border border-pink-100/70 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-700 font-semibold">Revenue Waterfall Distribution</span>
                    <span className="text-[#D70F64] font-mono font-bold">70% Net to Investor</span>
                  </div>
                  {/* Progress bar split */}
                  <div className="w-full h-2.5 rounded-full bg-slate-200 flex overflow-hidden">
                    <div className="bg-[#D70F64] h-full" style={{ width: '70%' }} title="70% Investor Yield" />
                    <div className="bg-pink-300 h-full" style={{ width: '15%' }} title="15% Maintenance Escrow" />
                    <div className="bg-slate-400 h-full" style={{ width: '10%' }} title="10% Management" />
                    <div className="bg-emerald-500 h-full" style={{ width: '5%' }} title="5% Insurance" />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-medium text-[#D70F64]">70% Investor</span>
                    <span>15% Fleet Escrow</span>
                    <span>10% Management</span>
                    <span>5% Insurance</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Projected Return Showcase (6 Cols) */}
            <div className="lg:col-span-6 p-8 rounded-3xl bg-gradient-to-br from-pink-50 via-white to-pink-50/30 border border-pink-200 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs uppercase tracking-wider text-[#D70F64] font-bold">
                  Forecasted Return Matrix
                </span>
                <span className="px-3 py-1 rounded-full bg-[#D70F64] text-white font-mono text-xs font-bold shadow-sm">
                  {yieldRate}% Net APY
                </span>
              </div>

              {/* Annualized Distribution Highlight */}
              <div className="mb-8">
                <div className="text-xs text-slate-500 mb-1">Projected Annual Cashflow Dividend</div>
                <div className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 tabular-nums">
                  ${Math.round(annualDividend).toLocaleString()}{' '}
                  <span className="text-xs font-sans text-slate-500 font-normal">/ year</span>
                </div>
              </div>

              {/* Payout Breakdown Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 rounded-xl bg-white border border-pink-100 shadow-sm">
                  <div className="text-xs text-slate-500 mb-1">Quarterly Wire Payout</div>
                  <div className="text-xl font-display font-bold text-[#D70F64] tabular-nums">
                    ${Math.round(quarterlyDividend).toLocaleString()}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-pink-100 shadow-sm">
                  <div className="text-xs text-slate-500 mb-1">Monthly Equivalent</div>
                  <div className="text-xl font-display font-bold text-slate-900 tabular-nums">
                    ${Math.round(monthlyDividend).toLocaleString()}
                  </div>
                </div>

                <div className="col-span-2 p-4 rounded-xl bg-pink-100/50 border border-pink-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-xs text-slate-600">3-Year Cumulative Yield</div>
                      <div className="text-2xl font-display font-black text-[#D70F64] tabular-nums">
                        ${Math.round(threeYearTotal).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] text-slate-500">+ Principal Capital</div>
                      <div className="text-xs font-mono font-semibold text-slate-800">Full Repurchase Option</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => {
                  audioEngine.playClick();
                  onCommitAmount(investmentAmount);
                }}
                className="w-full py-4 px-6 rounded-xl bg-[#D70F64] hover:bg-[#E21B70] text-white font-display font-bold text-sm tracking-wide uppercase transition-all shadow-xl shadow-[#D70F64]/25 hover:shadow-[#D70F64]/35 flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <span>Request Term Sheet for ${investmentAmount.toLocaleString()}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
