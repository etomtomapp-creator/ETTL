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
      setError('Please provide a valid accredited investor name and email.');
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
        `ETTL INVESTMENT ZONE — FUND III PRIVATE PLACEMENT MEMORANDUM\n` +
        `============================================================\n\n` +
        `Investor: ${name}\n` +
        `Selected Allocation: ${allocation}\n` +
        `Target Yield: 19.8% - 24.2% Net Annualized\n` +
        `Distribution Frequency: Quarterly Wire\n` +
        `Asset Custody: Special Purpose Vehicle (SPV) Trust Title Deeds\n` +
        `Asset Insurance: Marsh & McLennan Commercial Master Policy #MM-8492\n` +
        `Telematics: Geotab Pro Satellite GPS & Remote Immobilization\n\n` +
        `EXECUTIVE FLEET SUMMARY:\n` +
        `- ETTL Phantom Sovereign (Executive Sedan) - 22.4% Target Yield\n` +
        `- ETTL Sovereign Grand Tourer (Luxury SUV) - 20.8% Target Yield\n` +
        `- ETTL Apex Taycan EV (Performance EV) - 24.2% Target Yield\n\n` +
        `Contact Managing Partner: investors@ettl-investment.com\n` +
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
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
              <span>Accredited Investor Access</span>
            </div>
            <h3 className="text-2xl font-display font-bold text-slate-900 mb-2">
              Request Fund III Prospectus
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-6">
              Download the complete audited Offering Memorandum and quarterly financial model for the ETTL vehicle fleet expansion.
            </p>

            {error && (
              <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Marcus Vance"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#D70F64] focus:bg-white text-slate-900 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Corporate / Investor Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. mvance@vanceholdings.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#D70F64] focus:bg-white text-slate-900 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Allocation Range
                </label>
                <select
                  value={allocation}
                  onChange={(e) => setAllocation(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#D70F64] focus:bg-white text-slate-900 text-sm outline-none cursor-pointer"
                >
                  <option value="$50,000 (Executive Syndicate)">$50,000 (Executive Syndicate)</option>
                  <option value="$150,000 (Corporate Fleet)">$150,000 (Corporate Fleet)</option>
                  <option value="$500,000 (Institutional Syndicate)">$500,000 (Institutional Syndicate)</option>
                  <option value="$1,000,000+ (Custom Wholesale SPV)">$1,000,000+ (Custom Wholesale SPV)</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-[#D70F64] hover:bg-[#E21B70] text-white font-display font-bold text-xs uppercase tracking-wider transition-all shadow-xl shadow-[#D70F64]/25 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Generate Confidential Memorandum</span>
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
                Access Granted
              </h3>
              <p className="text-xs text-slate-600">
                Your credentials have been authenticated for Fund III documents.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-pink-50/50 border border-pink-100 text-xs text-left space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Investor:</span>
                <span className="text-slate-900 font-semibold">{name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Target Allocation:</span>
                <span className="text-[#D70F64] font-bold">{allocation}</span>
              </div>
            </div>

            <button
              onClick={handleDownload}
              className="w-full py-3.5 px-6 rounded-xl bg-[#D70F64] hover:bg-[#E21B70] text-white font-bold text-xs uppercase tracking-wide transition-all shadow-lg shadow-[#D70F64]/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Confidential Prospectus</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
