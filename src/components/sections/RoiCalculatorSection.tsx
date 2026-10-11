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
    <section id="calculator" className="py-24 relative bg-white border-t border-pink-100 font-sans">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header in Bangla */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-[#D70F64] font-bold mb-2">
            <span>০২. আর্থিক স্থাপত্য</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>রিয়েল ক্যাশফ্লো সিমুলেশন</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-slate-900 tracking-tight mb-4">
            ইন্টারেক্টিভ আরওআই ও ক্যাশফ্লো সিমুলেটর
          </h2>
          <p className="text-sm md:text-base text-slate-600 leading-relaxed">
            আপনার বিনিয়োগকৃত মূলধনের বিপরীতে প্রত্যাশিত প্যাসিভ ক্যাশ ডিভিডেন্ড হিসাব করুন। সব প্রজেকশন বীমা, রক্ষণাবেক্ষণ ও ফ্লিট ম্যানেজমেন্ট ফি বাদ দিয়ে নিট আকারে নির্ধারিত।
          </p>
        </div>

        {/* Investment Presets in Bangla */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {INVESTMENT_PRESETS.map((preset) => {
            const isSelected = investmentAmount === preset.amount;
            const banglaTitle = preset.id === 'syndicate' ? 'এক্সিকিউটিভ সিন্ডিকেট' : preset.id === 'corporate' ? 'কর্পোরেট ফ্লিট পোর্টফোলিও' : 'প্রাতিষ্ঠানিক সিন্ডিকেট';
            const banglaBadge = preset.badge === 'Most Popular' ? 'জনপ্রিয়' : preset.badge === 'Institutional Grade' ? 'প্রাতিষ্ঠানিক গ্রেড' : '';

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
                {banglaBadge && (
                  <div className="absolute top-5 right-5 text-[11px] font-bold uppercase tracking-wider text-white px-2.5 py-0.5 rounded-full bg-[#D70F64]">
                    {banglaBadge}
                  </div>
                )}

                <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">
                  টায়ার {preset.id === 'syndicate' ? '১' : preset.id === 'corporate' ? '২' : '৩'}
                </div>
                <h3 className="text-xl font-display font-bold text-slate-900 mb-2">
                  {banglaTitle}
                </h3>
                <div className="text-3xl font-display font-black text-[#D70F64] tabular-nums mb-4">
                  ${preset.amount.toLocaleString()}
                </div>

                <div className="p-3.5 rounded-xl bg-pink-50/60 border border-pink-100 mb-6 space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600 font-medium">টার্গেট বাৎসরিক নিট:</span>
                    <span className="font-mono font-bold text-[#D70F64]">{preset.projectedAnnualYield}% APY</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600 font-medium">ত্রৈমাসিক ডিভিডেন্ড:</span>
                    <span className="font-mono font-bold text-slate-900 tabular-nums">${preset.quarterlyPayout.toLocaleString()}/ত্রৈমাসিক</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600 font-medium">বরাদ্দকৃত যানবাহন:</span>
                    <span className="font-mono font-bold text-slate-900 tabular-nums">{preset.vehiclesAllocated} টি গাড়ি</span>
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
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    isSelected
                      ? 'bg-[#D70F64] text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-pink-50 hover:text-[#D70F64]'
                  }`}
                >
                  <span>{isSelected ? 'বর্তমানে সক্রিয়' : 'নির্বাচন করুন'}</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Dynamic Calculator Studio in Bangla */}
        <div className="p-8 md:p-12 rounded-3xl bg-white border border-pink-100 shadow-xl shadow-pink-900/5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left: Sliders */}
            <div className="lg:col-span-6 space-y-8">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label htmlFor="capital-slider" className="text-sm font-bold text-slate-900">
                    মূলধন বরাদ্দের পরিমাণ
                  </label>
                  <span className="text-2xl sm:text-3xl font-display font-extrabold text-[#D70F64] tabular-nums">
                    ${investmentAmount.toLocaleString()}
                  </span>
                </div>

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
                  <span>$২৫,০০০ (সর্বনিম্ন)</span>
                  <span>$৫০০,০০০</span>
                  <span>$১,০০০,০০০+</span>
                </div>
              </div>

              {/* Allocation Breakdown Details */}
              <div className="space-y-4">
                <h4 className="text-xs uppercase tracking-wider text-slate-500 font-bold">
                  পোর্টফোলিও ডিপ্লয়মেন্ট কাঠামো
                </h4>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-pink-50/50 border border-pink-100/70">
                    <div className="text-xs text-slate-500 mb-1">বরাদ্দকৃত যানবাহন সংখ্যা</div>
                    <div className="text-xl font-display font-bold text-slate-900 tabular-nums">
                      ~{vehiclesAssigned} টি যানবাহন
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      সরাসরি আইনি টাইটেল ইকুইটি
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-pink-50/50 border border-pink-100/70">
                    <div className="text-xs text-slate-500 mb-1">চুক্তির মেয়াদ</div>
                    <div className="text-xl font-display font-bold text-slate-900">
                      ২৪ – ৩৬ মাস
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      মূলধন বাইব্যাক সুবিধা সহ
                    </div>
                  </div>
                </div>

                {/* Revenue Share Waterfall */}
                <div className="p-4 rounded-2xl bg-pink-50/50 border border-pink-100/70 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-700 font-semibold">রেভিনিউ ওয়াটারফল বণ্টন</span>
                    <span className="text-[#D70F64] font-mono font-bold">৭০% নিট বিনিয়োগকারীর</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-200 flex overflow-hidden">
                    <div className="bg-[#D70F64] h-full" style={{ width: '70%' }} title="70% বিনিয়োগকারী" />
                    <div className="bg-pink-300 h-full" style={{ width: '15%' }} title="15% রক্ষণাবেক্ষণ" />
                    <div className="bg-slate-400 h-full" style={{ width: '10%' }} title="10% ব্যবস্থাপনা" />
                    <div className="bg-emerald-500 h-full" style={{ width: '5%' }} title="5% বীমা" />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <span className="text-[#D70F64]">৭০% বিনিয়োগকারী</span>
                    <span>১৫% রক্ষণাবেক্ষণ</span>
                    <span>১০% ম্যানেজমেন্ট</span>
                    <span>৫% বীমা রিজার্ভ</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Projected Return Showcase */}
            <div className="lg:col-span-6 p-8 rounded-3xl bg-gradient-to-br from-pink-50 via-white to-pink-50/30 border border-pink-200 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs uppercase tracking-wider text-[#D70F64] font-bold">
                  প্রত্যাশিত রিটার্ন মেট্রিক্স
                </span>
                <span className="px-3 py-1 rounded-full bg-[#D70F64] text-white font-mono text-xs font-bold shadow-sm">
                  {yieldRate}% নিট APY
                </span>
              </div>

              {/* Annualized Highlight */}
              <div className="mb-8">
                <div className="text-xs text-slate-500 mb-1">বাৎসরিক প্রত্যাশিত ক্যাশফ্লো ডিভিডেন্ড</div>
                <div className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 tabular-nums">
                  ${Math.round(annualDividend).toLocaleString()}{' '}
                  <span className="text-xs font-sans text-slate-500 font-normal">/ বছর</span>
                </div>
              </div>

              {/* Breakdown Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 rounded-xl bg-white border border-pink-100 shadow-sm">
                  <div className="text-xs text-slate-500 mb-1">ত্রৈমাসিক ব্যাংক ওয়্যার পেআউট</div>
                  <div className="text-xl font-display font-bold text-[#D70F64] tabular-nums">
                    ${Math.round(quarterlyDividend).toLocaleString()}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-pink-100 shadow-sm">
                  <div className="text-xs text-slate-500 mb-1">মাসিক সমতুল্য</div>
                  <div className="text-xl font-display font-bold text-slate-900 tabular-nums">
                    ${Math.round(monthlyDividend).toLocaleString()}
                  </div>
                </div>

                <div className="col-span-2 p-4 rounded-xl bg-pink-100/50 border border-pink-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-xs text-slate-600">৩ বছরের সর্বমোট পুঞ্জীভূত রিটার্ন</div>
                      <div className="text-2xl font-display font-black text-[#D70F64] tabular-nums">
                        ${Math.round(threeYearTotal).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] text-slate-500">+ মূলধন ফেরত</div>
                      <div className="text-xs font-mono font-semibold text-slate-800">১০০% বাইব্যাক অপশন</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Button in Bangla */}
              <button
                onClick={() => {
                  audioEngine.playClick();
                  onCommitAmount(investmentAmount);
                }}
                className="w-full py-4 px-6 rounded-xl bg-[#D70F64] hover:bg-[#E21B70] text-white font-display font-bold text-sm tracking-wide transition-all shadow-xl shadow-[#D70F64]/25 hover:shadow-[#D70F64]/35 flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <span>${investmentAmount.toLocaleString()} বরাদ্দের টার্ম শিট অনুরোধ করুন</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
