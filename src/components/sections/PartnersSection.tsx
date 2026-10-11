import React from 'react';
import { PARTNERS_DATA } from '../../data/mockData';
import { ShieldCheck, Radio, Plane, Landmark } from 'lucide-react';

export const PartnersSection: React.FC = () => {
  const getPartnerIcon = (category: string) => {
    if (category.includes('Insurance')) return <ShieldCheck className="w-5 h-5 text-[#D70F64]" />;
    if (category.includes('Telemetry')) return <Radio className="w-5 h-5 text-[#D70F64]" />;
    if (category.includes('Client')) return <Plane className="w-5 h-5 text-[#D70F64]" />;
    return <Landmark className="w-5 h-5 text-[#D70F64]" />;
  };

  return (
    <section id="partners" className="py-24 relative bg-white border-t border-pink-100 font-sans">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-[#D70F64] font-bold mb-2">
            <span>০৪. আস্থা ও আন্ডাররাইটিং</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>প্রাতিষ্ঠানিক ইকোসিস্টেম</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-slate-900 tracking-tight mb-4">
            আমাদের এন্টারপ্রাইজ পার্টনার নেটওয়ার্ক
          </h2>
          <p className="text-sm md:text-base text-slate-600 leading-relaxed">
            ইটিটিএল শীর্ষস্থানীয় রিস্ক আন্ডাররাইটার, স্যাটেলাইট টেলিমেটিক্স সরবরাহকারী এবং এক্সিকিউটিভ কর্পোরেট ক্লায়েন্টদের সাথে যৌথভাবে মূলধনের পূর্ণ নিরাপত্তা নিশ্চিত করে।
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PARTNERS_DATA.map((partner) => (
            <div
              key={partner.name}
              className="p-6 rounded-3xl bg-white border border-pink-100 shadow-sm hover:shadow-xl hover:border-pink-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center border border-pink-100">
                    {getPartnerIcon(partner.category)}
                  </div>
                  <span className="text-[11px] font-mono text-[#D70F64] font-bold px-2 py-0.5 rounded-full bg-pink-50 border border-pink-200">
                    {partner.metric}
                  </span>
                </div>

                <div className="text-xs uppercase tracking-wider text-slate-400 mb-1 font-semibold">
                  {partner.category}
                </div>
                <h3 className="text-base font-display font-bold text-slate-900 mb-2">
                  {partner.name}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {partner.description}
                </p>
              </div>

              <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] tracking-widest uppercase font-mono font-bold text-slate-800">
                  {partner.logoText}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">যাচাইকৃত পার্টনার</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
