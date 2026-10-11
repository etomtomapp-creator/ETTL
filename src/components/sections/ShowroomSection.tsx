import React, { useState } from 'react';
import { LUXURY_VEHICLES } from '../../data/mockData';
import { VehicleShowroomCanvas } from '../3d/VehicleShowroomCanvas';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { audioEngine } from '../../services/audioService';

interface ShowroomSectionProps {
  onSelectVehicleForCalculator: (vehicleId: string) => void;
}

export const ShowroomSection: React.FC<ShowroomSectionProps> = ({
  onSelectVehicleForCalculator,
}) => {
  const [activeVehicleIndex, setActiveVehicleIndex] = useState<number>(0);
  const [selectedColorIndex, setSelectedColorIndex] = useState<number>(0);

  const activeVehicle = LUXURY_VEHICLES[activeVehicleIndex];

  const handleVehicleSelect = (index: number) => {
    setActiveVehicleIndex(index);
    setSelectedColorIndex(0);
    audioEngine.playClick();
  };

  const handleColorSelect = (colorIdx: number) => {
    setSelectedColorIndex(colorIdx);
    audioEngine.playHover();
  };

  return (
    <section id="showroom" className="py-24 relative bg-[#FAFAFC] border-t border-pink-100 font-sans">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header in Bangla */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#D70F64] font-bold mb-2">
              <span>০১. বাস্তব সম্পদ পোর্টফোলিও</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>ফিজিক্যাল লাক্সারি ফ্লিট</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-slate-900 tracking-tight">
              এক্সিকিউটিভ ফ্লিট শোরুম
            </h2>
          </div>

          <p className="text-sm md:text-base text-slate-600 max-w-md">
            রিয়েল-টাইম ৩ডি-তে আমাদের উচ্চ-ফলনশীল যানবাহনগুলো ঘুরে দেখুন। প্রতিটি গাড়ি স্বতন্ত্রভাবে রেজিস্টার্ড, বীমাকৃত এবং ফরচুন ৫০০ কর্পোরেট ক্লায়েন্টদের কাছে লিজ দেওয়া।
          </p>
        </div>

        {/* Vehicle Selection Tabs */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-white border border-pink-100 shadow-sm mb-8 max-w-2xl">
          {LUXURY_VEHICLES.map((vehicle, idx) => (
            <button
              key={vehicle.id}
              onClick={() => handleVehicleSelect(idx)}
              className={`flex-1 py-3 px-4 rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeVehicleIndex === idx
                  ? 'bg-[#D70F64] text-white shadow-md shadow-[#D70F64]/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-pink-50/50'
              }`}
            >
              <span>{vehicle.name}</span>
            </button>
          ))}
        </div>

        {/* 3D Showcase & Specifications Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: 3D WebGL Canvas Viewport (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <VehicleShowroomCanvas
              activeVehicle={activeVehicle}
              selectedColorIndex={selectedColorIndex}
            />

            {/* Exterior Finish Color Palette Selector */}
            <div className="p-4 rounded-2xl bg-white border border-pink-100 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-semibold">পছন্দের কালার ফিনিশ:</span>
                <span className="text-xs font-bold text-slate-900">
                  {activeVehicle.colorOptions[selectedColorIndex]?.name}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                {activeVehicle.colorOptions.map((opt, cIdx) => (
                  <button
                    key={opt.name}
                    onClick={() => handleColorSelect(cIdx)}
                    title={opt.name}
                    className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer ${
                      selectedColorIndex === cIdx
                        ? 'scale-125 border-[#D70F64] shadow-[0_0_10px_rgba(215,15,100,0.5)]'
                        : 'border-slate-300 hover:scale-110 opacity-80 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: opt.hex }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right: Asset Investment Dossier (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="p-8 rounded-3xl bg-white border border-pink-100 shadow-xl shadow-pink-900/5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {activeVehicle.category}
                </span>
                <span className="text-xs font-mono font-bold text-[#D70F64] px-2.5 py-0.5 rounded-full bg-pink-50 border border-pink-200">
                  {activeVehicle.financials.projectedAnnualYield}% প্রত্যাশিত বার্ষিক লাভ
                </span>
              </div>

              <h3 className="text-2xl font-display font-bold text-slate-900 mb-2">
                {activeVehicle.name}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                {activeVehicle.tagline}
              </p>

              {/* Financial Metrics Strip in Bangla */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-pink-50/50 border border-pink-100/70 mb-6">
                <div>
                  <div className="text-xs text-slate-500 mb-1">ইউনিট সম্পদ খরচ</div>
                  <div className="text-lg font-display font-bold text-slate-900 tabular-nums">
                    ${activeVehicle.financials.unitCost.toLocaleString()}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-slate-500 mb-1">দৈনিক ভাড়া হার</div>
                  <div className="text-lg font-display font-bold text-[#D70F64] tabular-nums">
                    ${activeVehicle.financials.dailyRentalRate}/দিন
                  </div>
                </div>

                <div>
                  <div className="text-xs text-slate-500 mb-1">মাসিক মোট রাজস্ব</div>
                  <div className="text-lg font-display font-bold text-slate-900 tabular-nums">
                    ${activeVehicle.financials.monthlyGrossRevenue.toLocaleString()}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-slate-500 mb-1">গড় অকুপেন্সি হার</div>
                  <div className="text-lg font-display font-bold text-[#D70F64] tabular-nums">
                    {activeVehicle.specs.occupancyRate}
                  </div>
                </div>
              </div>

              {/* Key Features & Investor Guarantees */}
              <div className="space-y-3 mb-8">
                <h4 className="text-xs uppercase tracking-wider text-slate-500 font-bold">
                  সম্পদ চুক্তি ও নিরাপত্তা ব্যবস্থা
                </h4>
                {activeVehicle.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-[#D70F64] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Action: Select for Calculator */}
              <button
                onClick={() => {
                  audioEngine.playClick();
                  onSelectVehicleForCalculator(activeVehicle.id);
                }}
                className="w-full py-3.5 px-6 rounded-xl bg-[#D70F64] hover:bg-[#E21B70] text-white font-bold text-sm transition-all shadow-md shadow-[#D70F64]/25 hover:shadow-lg hover:shadow-[#D70F64]/35 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{activeVehicle.name}-এর রিটার্ন হিসাব করুন</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
