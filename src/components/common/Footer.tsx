import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-pink-100 text-slate-500 py-16 font-sans">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-pink-100/70">
          {/* Brand & Wordmark (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2 text-2xl font-display font-black tracking-wider text-slate-900">
              <span className="text-[#D70F64]">
                ETTL
              </span>
              <span className="text-xs uppercase tracking-widest text-[#D70F64] font-semibold border-l border-pink-200 pl-2">
                ইনভেস্টমেন্ট জোন
              </span>
            </div>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed max-w-sm">
              প্রাতিষ্ঠানিক যানবাহন ফ্লিট সিন্ডিকেশন প্ল্যাটফর্ম। উচ্চ সম্পদশালী বিনিয়োগকারীদের সাথে প্রিমিয়ার কর্পোরেট এবং ভিআইপি লিজ নেটওয়ার্কের বাস্তব গাড়িভিত্তিক ক্যাশফ্লো যুক্ত করে।
            </p>
            <div className="flex items-center gap-2 text-xs text-[#D70F64] font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>নিবন্ধিত অল্টারনেটিভ ইনভেস্টমেন্ট সিন্ডিকেট #ETTL-8429</span>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-slate-900 font-bold">
              প্ল্যাটফর্ম
            </h4>
            <ul className="space-y-2 text-xs font-semibold">
              <li>
                <a href="#showroom" className="hover:text-[#D70F64] transition-colors">
                  ফ্লিট শোরুম
                </a>
              </li>
              <li>
                <a href="#investment" className="hover:text-[#D70F64] transition-colors">
                  বিনিয়োগ মডেল
                </a>
              </li>
              <li>
                <a href="#calculator" className="hover:text-[#D70F64] transition-colors">
                  আরওআই সিমুলেটর
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-[#D70F64] transition-colors">
                  কার্যপদ্ধতি
                </a>
              </li>
            </ul>
          </div>

          {/* Vehicle Fleet Tiers */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-slate-900 font-bold">
              ফ্লিট সম্পদসমূহ
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 font-medium">
              <li>এক্সিকিউটিভ সেডান (হাইব্রিড V8)</li>
              <li>গ্র্যান্ড ট্যুরার লাক্সারি এসইউভি</li>
              <li>উচ্চ-ক্ষমতাসম্পন্ন ৮০০V ইভি</li>
              <li>আর্মর্ড ডিপ্লোম্যাটিক শাটল</li>
            </ul>
          </div>

          {/* Compliance & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-slate-900 font-bold">
              প্রাইভেট ওয়েলথ ডেস্ক
            </h4>
            <div className="text-xs space-y-1.5 text-slate-600 font-medium">
              <p>ওয়ান এক্সিকিউটিভ প্লাজা, লেভেল ৪২</p>
              <p>সোম - শুক্র: সকাল ০৮:০০ - সন্ধ্যা ০৬:০০ EST</p>
              <p className="text-[#D70F64] font-mono font-bold pt-1">investors@ettl-investment.com</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar & Risk Disclosures */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} ইটিটিএল ইনভেস্টমেন্ট জোন। সর্বস্বত্ব সংরক্ষিত।</p>
          <p className="max-w-xl text-center md:text-right text-slate-500">
            বিজ্ঞপ্তি: প্রাইভেট প্লেসমেন্ট মেমোরেন্ডাম শুধুমাত্র অনুমোদিত বিনিয়োগকারীদের জন্য প্রযোজ্য। অতীতের ইউটিলাইজেশন বা মুনাফা ভবিষ্যতের রিটার্নের শতভাগ নিশ্চয়তা দেয় না। সকল যানবাহন স্বতন্ত্র এসপিভি ট্রাস্টের অধীনে রক্ষিত।
          </p>
        </div>
      </div>
    </footer>
  );
};
