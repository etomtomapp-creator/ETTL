import React from 'react';
import { Lock } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const stepsInBangla = [
    {
      number: '০১',
      title: 'কৌশলগত ফ্লিট সংগ্রহ',
      description: 'ইটিটিএল সরাসরি শীর্ষস্থানীয় অটোমোবাইল প্রস্তুতকারকদের কাছ থেকে ১৫–২০% পাইকারি ছাড়ে একেবারে ব্র্যান্ড-নিউ লাক্সারি গাড়ি ও ইভি সংগ্রহ করে।',
      detail: 'সকল গাড়ির মালিকানা ও আইনি স্বত্ব স্বতন্ত্র এসপিভি ট্রাস্টের অধীনে বিনিয়োগকারীদের নামে রেজিস্ট্রি করা হয়।',
    },
    {
      number: '০২',
      title: 'দীর্ঘমেয়াদী কর্পোরেট লিজ',
      description: 'যানবাহনগুলো উচ্চ মার্জিনের কর্পোরেট চুক্তিতে নিযুক্ত করা হয়: বহুজাতিক প্রতিষ্ঠান, ফিল্ম প্রোডাকশন, প্রাইভেট এভিয়েশন এবং ৫-স্টার হোটেল চেইন।',
      detail: 'গড় লিজ চুক্তির মেয়াদ ৬ থেকে ১৮ মাস, যাতে অগ্রিম বাণিজ্যিক জামানত সংরক্ষিত থাকে।',
    },
    {
      number: '০৩',
      title: 'স্যাটেলাইট টেলিমেটিক্স ও রক্ষণাবেক্ষণ',
      description: 'প্রতিটি গাড়িতে ২৪/৭ স্যাটেলাইট জিপিএস জিওফেন্সিং এবং রিমোট সেন্সর ট্র্যাকিং থাকে। অনুমোদিত সার্ভিস সেন্টারে নিয়মিত রক্ষণাবেক্ষণ করা হয়।',
      detail: 'বিনিয়োগকারীর কোনো ঝামেলা নেই: ইটিটিএল ইনভেস্টমেন্ট সব রক্ষণাবেক্ষণ, বীমা নবায়ন এবং অপারেশনাল দেখাশোনা করে।',
    },
    {
      number: '০৪',
      title: 'স্বয়ংক্রিয় ত্রৈমাসিক ক্যাশফ্লো পেআউট',
      description: 'অডিটেড নিট ভাড়ার মুনাফা প্রতি ত্রৈমাসিকে সরাসরি আপনার ব্যাংক অ্যাকাউন্টে ওয়্যার ট্রান্সফারের মাধ্যমে পাঠানো হয়, যা বার্ষিক ১৯.৮%–২৪.২% রিটার্ন দেয়।',
      detail: 'ডিজিটাল স্টেটমেন্টে গাড়ির মাইলেজ, লিজ চুক্তি, রক্ষণাবেক্ষণ হিসেব ও নিট ডিভিডেন্ড বিস্তারিত পাওয়া যায়।',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 relative bg-[#FAFAFC] border-t border-pink-100 font-sans">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header in Bangla */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#D70F64] font-bold mb-2">
            <span>০৩. অপারেশনাল শৃঙ্খলা</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>সম্পূর্ণ ফ্লিট লাইফসাইকেল</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-slate-900 tracking-tight mb-4">
            ইটিটিএল কীভাবে পরিচালিত হয় ও রিটার্ন তৈরি করে
          </h2>
          <p className="text-sm md:text-base text-slate-600 leading-relaxed">
            কোনো কাল্পনিক ফাইন্যান্সিয়াল স্কিম নয়—ইটিটিএল ফ্লিট ফান্ডের প্রতিটি ডলার বাস্তব ও রাজস্ব উৎপাদনকারী বিলাসবহুল যানবাহনের দ্বারা সুরক্ষিত।
          </p>
        </div>

        {/* 4-Stage Bento Flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {stepsInBangla.map((step) => (
            <div
              key={step.number}
              className="p-8 rounded-3xl bg-white border border-pink-100 shadow-sm hover:shadow-xl hover:border-pink-300 transition-all group"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="text-3xl font-display font-black text-[#D70F64] font-mono">
                  {step.number}
                </span>
                <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                  ধাপ {step.number}
                </span>
              </div>

              <h3 className="text-xl font-display font-bold text-slate-900 mb-3 group-hover:text-[#D70F64] transition-colors">
                {step.title}
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                {step.description}
              </p>

              <div className="p-4 rounded-xl bg-pink-50/50 border border-pink-100/70 text-xs text-slate-600 leading-relaxed">
                <strong className="text-slate-900 block mb-1">নিরাপত্তা কাঠামো:</strong>
                {step.detail}
              </div>
            </div>
          ))}
        </div>

        {/* High-Impact Security Banner in Bangla */}
        <div className="p-8 md:p-10 rounded-3xl bg-gradient-to-r from-pink-50/80 via-white to-pink-50/80 border border-pink-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#D70F64] flex items-center justify-center text-white shrink-0 shadow-md shadow-[#D70F64]/30">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-display font-bold text-slate-900 mb-1">
                সম্পদের হেফাজত ও আইনি এসপিভি ট্রাস্ট কাঠামো
              </h4>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed max-w-2xl">
                প্রতিটি সিন্ডিকেট স্বতন্ত্র স্পেশাল পারপাস ভেহিকেল (SPV)-এর অধীনে পরিচালিত হয়। গাড়ি রাস্তায় নামার আগেই বিনিয়োগকারীর নামে লিগ্যাল স্বত্ব রেজিস্ট্রি নিশ্চিত করা হয়।
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 shrink-0">
            <div className="text-right">
              <div className="text-xs text-slate-500 font-semibold">স্বতন্ত্র আইনি অডিট</div>
              <div className="text-sm font-bold text-slate-900">Baker McKenzie SPV ফ্রেমওয়ার্ক</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
