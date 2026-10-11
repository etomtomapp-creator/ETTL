import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Mail, Phone, MapPin, CheckCircle2, ArrowRight, ShieldCheck, Download } from 'lucide-react';
import { audioEngine } from '../../services/audioService';

interface ContactSectionProps {
  initialAmount?: number;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ initialAmount }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    allocationRange: initialAmount ? `$${initialAmount.toLocaleString()}` : '$150,000 (কর্পোরেট ফ্লিট)',
    timeframe: 'অবিলম্বে (চলতি ফান্ড ক্লোজিং)',
    notes: '',
  });

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.email.includes('@')) {
      setErrorMsg('অনুগ্রহ করে সঠিক নাম এবং অনুমোদিত বিনিয়োগকারী ইমেইল প্রদান করুন।');
      return;
    }

    setErrorMsg('');
    audioEngine.playClick();
    setIsSubmitted(true);

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#D70F64', '#E21B70', '#ffffff', '#F472B6'],
      });
    } catch {}
  };

  const handleDownloadProspectus = () => {
    audioEngine.playClick();
    const blob = new Blob(
      [
        `============================================================\n` +
        `ইটিটিএল ইনভেস্টমেন্ট জোন — ফ্লিট ফান্ড ৩ প্রাতিষ্ঠানিক মেমোরেন্ডাম\n` +
        `============================================================\n\n` +
        `বিনিয়োগকারী: ${formData.name || 'সম্মানিত বিনিয়োগকারী'}\n` +
        `নির্বাচিত বরাদ্দ: ${formData.allocationRange}\n` +
        `প্রত্যাশিত নিট লাভ: ১৯.৮% – ২৪.২% বাৎসরিক (APY)\n` +
        `ডিভিডেন্ড বিতরণ: প্রতি ত্রৈমাসিকে ব্যাংক ওয়্যার ট্রান্সফার\n` +
        `সম্পদের আইনি হেফাজত: স্পেশাল পারপাস ভেহিকেল (SPV) টাইটেল দলিল\n` +
        `বীমা পলিসি: Marsh & McLennan Commercial Master Policy #MM-8492\n` +
        `টেলিমেটিক্স নিরাপত্তা: Geotab Pro Satellite GPS & Remote Immobilizer\n\n` +
        `যোগাযোগ: investors@ettl-investment.com\n` +
        `One Executive Plaza, Level 42, Financial District\n`
      ],
      { type: 'text/plain;charset=utf-8' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ETTL_Fund_III_Prospectus_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section id="contact" className="py-24 relative bg-[#FAFAFC] border-t border-pink-100 font-sans">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Ingestion Info in Bangla */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#D70F64] font-bold mb-2">
                <span>০৫. সরাসরি আলোচনা</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span>প্রাইভেট ওয়েলথ ডেস্ক</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight mb-4">
                ইটিটিএল ম্যানেজিং পার্টনারের সাথে পরামর্শ করুন
              </h2>
              <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                ২০ মিনিটের একটি গোপনীয় পোর্টফোলিও ব্রিফিং শিডিউল করুন অথবা ফান্ড ৩-এর নিরীক্ষিত প্রাইভেট প্লেসমেন্ট মেমোরেন্ডাম (PPM) সংগ্রহ করুন।
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-pink-100 shadow-sm space-y-4 text-xs md:text-sm text-slate-600">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-[#D70F64] shrink-0 border border-pink-100">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">ইটিটিএল ইনভেস্টমেন্ট জোন সদর দফতর</div>
                  <div className="text-slate-500">ওয়ান এক্সিকিউটিভ প্লাজা, লেভেল ৪২, ফাইন্যান্সিয়াল ডিস্ট্রিক্ট</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-[#D70F64] shrink-0 border border-pink-100">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">প্রাতিষ্ঠানিক অনুসন্ধান</div>
                  <div className="text-[#D70F64] font-mono font-medium">investors@ettl-investment.com</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-[#D70F64] shrink-0 border border-pink-100">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">প্রাইভেট কনসিয়ার্জ হেল্পলাইন</div>
                  <div className="text-slate-700 font-mono font-medium">+1 (800) 842-ETTL (3885)</div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-pink-100 shadow-sm flex items-center gap-3 text-xs text-slate-600">
              <ShieldCheck className="w-5 h-5 text-[#D70F64] shrink-0" />
              <span>
                সকল তথ্য প্রাতিষ্ঠানিক নন-ডিসক্লোজার এগ্রিমেন্ট (NDA) প্রটোকলের অধীনে ১০০% সুরক্ষিত।
              </span>
            </div>
          </div>

          {/* Right Column: Lead Form or Confirmation State */}
          <div className="lg:col-span-7">
            <div className="p-8 md:p-10 rounded-3xl bg-white border border-pink-100 shadow-xl shadow-pink-900/5">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-pink-100">
                    <h3 className="text-xl font-display font-bold text-slate-900">
                      অফারিং মেমোরেন্ডাম অনুরোধ করুন
                    </h3>
                    <span className="text-xs text-[#D70F64] font-bold px-2.5 py-0.5 rounded-full bg-pink-50 border border-pink-200">
                      ভেহিকল ফ্লিট ফান্ড ৩
                    </span>
                  </div>

                  {errorMsg && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-bold">
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        আপনার পূর্ণ আইনি নাম *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="যেমন: ড. তানভীর আহমেদ"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#D70F64] focus:bg-white text-slate-900 text-sm outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        বিনিয়োগকারী ইমেইল *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="যেমন: tanvir@holdings.com"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#D70F64] focus:bg-white text-slate-900 text-sm outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        সরাসরি ফোন / হোয়াটসঅ্যাপ নম্বর
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+880 1712-000000"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#D70F64] focus:bg-white text-slate-900 text-sm outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        টার্গেট মূলধন বরাদ্দ
                      </label>
                      <select
                        value={formData.allocationRange}
                        onChange={(e) => setFormData({ ...formData, allocationRange: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#D70F64] focus:bg-white text-slate-900 text-sm outline-none transition-colors cursor-pointer"
                      >
                        <option value="$50,000 (এক্সিকিউটিভ সিন্ডিকেট)">$৫০,০০০ (এক্সিকিউটিভ সিন্ডিকেট)</option>
                        <option value="$150,000 (কর্পোরেট ফ্লিট)">$১৫০,০০০ (কর্পোরেট ফ্লিট)</option>
                        <option value="$500,000 (প্রাতিষ্ঠানিক সিন্ডিকেট)">$৫০০,০০০ (প্রাতিষ্ঠানিক সিন্ডিকেট)</option>
                        <option value="$1,000,000+ (কাস্টম হোলসেল এসপিভি)">$১,০০০,০০০+ (কাস্টম হোলসেল এসপিভি)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      বিনিয়োগের সময়সীমা
                    </label>
                    <select
                      value={formData.timeframe}
                      onChange={(e) => setFormData({ ...formData, timeframe: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#D70F64] focus:bg-white text-slate-900 text-sm outline-none transition-colors cursor-pointer"
                    >
                      <option value="অবিলম্বে (চলতি ফান্ড ক্লোজিং)">অবিলম্বে (চলতি ফান্ড ক্লোজিং)</option>
                      <option value="৩০ দিনের মধ্যে">৩০ দিনের মধ্যে</option>
                      <option value="পরবর্তী ত্রৈমাসিক সিন্ডিকেটে">পরবর্তী ত্রৈমাসিক সিন্ডিকেটে</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      বিশেষ প্রয়োজনীয়তা বা প্রতিষ্ঠান সংক্রান্ত তথ্য (ঐচ্ছিক)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="ফ্যামিলি অফিস, হোল্ডিং কোম্পানি বা আন্তর্জাতিক এসপিভি কাঠামো সংক্রান্ত কোনো বিশেষ নির্দেশনা থাকলে জানান..."
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#D70F64] text-slate-900 text-sm outline-none transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 px-6 rounded-xl bg-[#D70F64] hover:bg-[#E21B70] text-white font-display font-bold text-base tracking-wide transition-all shadow-xl shadow-[#D70F64]/25 hover:shadow-[#D70F64]/35 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>জমা দিন ও ইনভেস্টর প্রসপেক্টাস তৈরি করুন</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <div className="py-8 text-center space-y-6">
                  <div className="w-16 h-16 rounded-full bg-pink-50 border-2 border-[#D70F64] flex items-center justify-center mx-auto text-[#D70F64]">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-display font-bold text-slate-900 mb-2">
                      অনুসন্ধান সফলভাবে গ্রহণ করা হয়েছে
                    </h3>
                    <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                      ধন্যবাদ, <strong className="text-slate-900">{formData.name}</strong>। আপনার প্রোফাইলের জন্য একজন সিনিয়র ইনভেস্টমেন্ট পার্টনার নিযুক্ত করা হয়েছে।
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-pink-50/50 border border-pink-100 max-w-md mx-auto text-left text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-semibold">টার্গেট বরাদ্দ:</span>
                      <span className="font-bold text-slate-900">{formData.allocationRange}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-semibold">টার্গেট বার্ষিক মুনাফা:</span>
                      <span className="font-mono text-[#D70F64] font-bold">১৯.৮% – ২৪.২% APY</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-semibold">নিশ্চিতকরণ পাঠানো হয়েছে:</span>
                      <span className="font-mono text-slate-900">{formData.email}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <button
                      onClick={handleDownloadProspectus}
                      className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#D70F64] hover:bg-[#E21B70] text-white font-bold text-xs uppercase tracking-wide transition-all shadow-lg shadow-[#D70F64]/25 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>ফান্ড ৩ প্রসপেক্টাস ডাউনলোড করুন (PDF)</span>
                    </button>

                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-200 transition-colors cursor-pointer"
                    >
                      <span>আরেকটি আবেদন পাঠান</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
