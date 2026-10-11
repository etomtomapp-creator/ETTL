import React, { useState } from 'react';
import { X, Download, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { audioEngine } from '../../services/audioService';

interface ProspectusModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAmount?: number;
}

export const ProspectusModal: React.FC<ProspectusModalProps> = ({
  isOpen,
  onClose,
  initialAmount = 150000,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [allocation, setAllocation] = useState(`$${initialAmount.toLocaleString()}`);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !email.includes('@')) {
      setError('অনুগ্রহ করে সঠিক নাম ও অনুমোদিত বিনিয়োগকারী ইমেইল প্রদান করুন।');
      return;
    }

    setError('');
    audioEngine.playClick();
    setIsSubmitted(true);

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.55 },
        colors: ['#D70F64', '#E21B70', '#ffffff', '#F472B6'],
      });
    } catch {}
  };

  const handleDownload = () => {
    audioEngine.playClick();
    const blob = new Blob(
      [
        `============================================================\n` +
        `ইটিটিএল ইনভেস্টমেন্ট জোন — ফ্লিট ফান্ড ৩ প্রাতিষ্ঠানিক মেমোরেন্ডাম\n` +
        `============================================================\n\n` +
        `বিনিয়োগকারী: ${name}\n` +
        `নির্বাচিত বরাদ্দ: ${allocation}\n` +
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md font-sans">
      <div className="relative w-full max-w-lg p-8 rounded-3xl bg-white border-2 border-pink-200 shadow-2xl">
        <button
          onClick={() => {
            audioEngine.playClick();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-800 bg-slate-100 hover:bg-pink-50 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#D70F64] font-bold mb-2">
              <ShieldCheck className="w-4 h-4 text-[#D70F64]" />
              <span>অনুমোদিত বিনিয়োগকারী এক্সেস</span>
            </div>
            <h3 className="text-2xl font-display font-bold text-slate-900 mb-2">
              ফান্ড ৩ প্রসপেক্টাস সংগ্রহ করুন
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-6">
              ইটিটিএল ভেহিকল ফ্লিট সম্প্রসারণ তহবিলের পূর্ণ নিরীক্ষিত অফারিং মেমোরেন্ডাম ও ত্রৈমাসিক আর্থিক মডেল ডাউনলোড করুন।
            </p>

            {error && (
              <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-bold">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  আপনার পূর্ণ নাম *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="যেমন: ড. তানভীর আহমেদ"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#D70F64] focus:bg-white text-slate-900 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  কর্পোরেট / বিনিয়োগকারী ইমেইল *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="যেমন: tanvir@holdings.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#D70F64] focus:bg-white text-slate-900 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  টার্গেট বরাদ্দের পরিমাণ
                </label>
                <select
                  value={allocation}
                  onChange={(e) => setAllocation(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#D70F64] focus:bg-white text-slate-900 text-sm outline-none cursor-pointer"
                >
                  <option value="$50,000 (এক্সিকিউটিভ সিন্ডিকেট)">$৫০,০০০ (এক্সিকিউটিভ সিন্ডিকেট)</option>
                  <option value="$150,000 (কর্পোরেট ফ্লিট)">$১৫০,০০০ (কর্পোরেট ফ্লিট)</option>
                  <option value="$500,000 (প্রাতিষ্ঠানিক সিন্ডিকেট)">$৫০০,০০০ (প্রাতিষ্ঠানিক সিন্ডিকেট)</option>
                  <option value="$1,000,000+ (কাস্টম হোলসেল এসপিভি)">$১,০০০,০০০+ (কাস্টম হোলসেল এসপিভি)</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-[#D70F64] hover:bg-[#E21B70] text-white font-display font-bold text-sm tracking-wider transition-all shadow-xl shadow-[#D70F64]/25 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>গোপনীয় মেমোরেন্ডাম তৈরি করুন</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-4 space-y-5">
            <div className="w-14 h-14 rounded-full bg-pink-50 border-2 border-[#D70F64] flex items-center justify-center mx-auto text-[#D70F64]">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-xl font-display font-bold text-slate-900 mb-1">
                এক্সেস অনুমোদিত
              </h3>
              <p className="text-xs text-slate-600">
                ফান্ড ৩-এর গোপনীয় নথির জন্য আপনার পরিচয় যাচাই সম্পন্ন হয়েছে।
              </p>
            </div>

            <div className="p-4 rounded-xl bg-pink-50/50 border border-pink-100 text-xs text-left space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">বিনিয়োগকারী:</span>
                <span className="text-slate-900 font-bold">{name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">টার্গেট বরাদ্দ:</span>
                <span className="text-[#D70F64] font-bold">{allocation}</span>
              </div>
            </div>

            <button
              onClick={handleDownload}
              className="w-full py-3.5 px-6 rounded-xl bg-[#D70F64] hover:bg-[#E21B70] text-white font-bold text-xs uppercase tracking-wide transition-all shadow-lg shadow-[#D70F64]/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>গোপনীয় প্রসপেক্টাস ডাউনলোড করুন (PDF)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
