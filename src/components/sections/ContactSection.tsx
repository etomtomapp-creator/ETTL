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
    allocationRange: initialAmount ? `$${initialAmount.toLocaleString()}` : '$150,000 (Corporate Fleet)',
    timeframe: 'Immediate (Current Fund Close)',
    notes: '',
  });

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.email.includes('@')) {
      setErrorMsg('Please enter a valid full name and accredited investor email.');
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
        `ETTL INVESTMENT ZONE — EXECUTIVE FLEET FUND III PROSPECTUS\n\n` +
        `Accredited Investor: ${formData.name || 'Valued Partner'}\n` +
        `Selected Allocation: ${formData.allocationRange}\n` +
        `Target Net Yield: 19.8% – 24.2% APY\n` +
        `Distribution Cycle: Quarterly Direct Wire\n` +
        `Collateral: 100% Physical Automotive Equity Titles\n\n` +
        `CONFIDENTIAL OFFERING MEMORANDUM\n` +
        `ETTL Investment Zone HQ, Level 42, Executive Tower.\n`
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
    <section id="contact" className="py-24 relative bg-[#FAFAFC] border-t border-pink-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Ingestion Info (5 Cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#D70F64] font-bold mb-2">
                <span>05. Direct Consultation</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span>Private Wealth Desk</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight mb-4">
                Speak with an ETTL Managing Partner
              </h2>
              <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                Schedule a confidential 20-minute portfolio briefing or request the comprehensive audited Private Placement Memorandum (PPM) for Fund III.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-pink-100 shadow-sm space-y-4 text-xs md:text-sm text-slate-600">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-[#D70F64] shrink-0 border border-pink-100">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">ETTL Investment Zone HQ</div>
                  <div className="text-slate-500">One Executive Plaza, Level 42, Financial District</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-[#D70F64] shrink-0 border border-pink-100">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Institutional Inquiries</div>
                  <div className="text-[#D70F64] font-mono font-medium">investors@ettl-investment.com</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-[#D70F64] shrink-0 border border-pink-100">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Private Concierge Desk</div>
                  <div className="text-slate-700 font-mono font-medium">+1 (800) 842-ETTL (3885)</div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-pink-100 shadow-sm flex items-center gap-3 text-xs text-slate-600">
              <ShieldCheck className="w-5 h-5 text-[#D70F64] shrink-0" />
              <span>
                All inquiries are protected by institutional Non-Disclosure Agreement (NDA) protocols.
              </span>
            </div>
          </div>

          {/* Right Column: Lead Form or Confirmation State (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="p-8 md:p-10 rounded-3xl bg-white border border-pink-100 shadow-xl shadow-pink-900/5">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-pink-100">
                    <h3 className="text-xl font-display font-bold text-slate-900">
                      Request Offering Memorandum
                    </h3>
                    <span className="text-xs text-[#D70F64] font-bold px-2.5 py-0.5 rounded-full bg-pink-50 border border-pink-200">
                      Vehicle Fleet Fund III
                    </span>
                  </div>

                  {errorMsg && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Full Legal Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Jonathan Sterling"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#D70F64] focus:bg-white text-slate-900 text-sm outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Accredited Investor Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. j.sterling@fund.com"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#D70F64] focus:bg-white text-slate-900 text-sm outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Direct Phone / Mobile
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 (555) 019-2834"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#D70F64] focus:bg-white text-slate-900 text-sm outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Target Capital Allocation
                      </label>
                      <select
                        value={formData.allocationRange}
                        onChange={(e) => setFormData({ ...formData, allocationRange: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#D70F64] focus:bg-white text-slate-900 text-sm outline-none transition-colors cursor-pointer"
                      >
                        <option value="$50,000 (Executive Syndicate)">$50,000 (Executive Syndicate)</option>
                        <option value="$150,000 (Corporate Fleet)">$150,000 (Corporate Fleet)</option>
                        <option value="$500,000 (Institutional Syndicate)">$500,000 (Institutional Syndicate)</option>
                        <option value="$1,000,000+ (Custom Wholesale SPV)">$1,000,000+ (Custom Wholesale SPV)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Deployment Timeline
                    </label>
                    <select
                      value={formData.timeframe}
                      onChange={(e) => setFormData({ ...formData, timeframe: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#D70F64] focus:bg-white text-slate-900 text-sm outline-none transition-colors cursor-pointer"
                    >
                      <option value="Immediate (Current Fund Close)">Immediate (Current Fund Close)</option>
                      <option value="Within 30 Days">Within 30 Days</option>
                      <option value="Next Quarter Syndicate">Next Quarter Syndicate</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Special Requirements / Entity Structure (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Specify family office, LLC, corporate treasury, or international SPV structuring..."
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#D70F64] focus:bg-white text-slate-900 text-sm outline-none transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 px-6 rounded-xl bg-[#D70F64] hover:bg-[#E21B70] text-white font-display font-bold text-sm tracking-wide uppercase transition-all shadow-xl shadow-[#D70F64]/25 hover:shadow-[#D70F64]/35 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Submit & Generate Investor Prospectus</span>
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
                      Inquiry Received & Verified
                    </h3>
                    <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                      Thank you, <strong className="text-slate-900">{formData.name}</strong>. An ETTL Senior Investment Partner has been assigned to your profile for the{' '}
                      <strong className="text-[#D70F64]">{formData.allocationRange}</strong> syndicate.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-pink-50/50 border border-pink-100 max-w-md mx-auto text-left text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Target Allocation:</span>
                      <span className="font-semibold text-slate-900">{formData.allocationRange}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Target Net Yield:</span>
                      <span className="font-mono text-[#D70F64] font-bold">19.8% – 24.2% APY</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Confirmation Sent To:</span>
                      <span className="font-mono text-slate-900">{formData.email}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <button
                      onClick={handleDownloadProspectus}
                      className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#D70F64] hover:bg-[#E21B70] text-white font-bold text-xs uppercase tracking-wide transition-all shadow-lg shadow-[#D70F64]/25 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Fund III Prospectus (PDF)</span>
                    </button>

                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-200 transition-colors cursor-pointer"
                    >
                      <span>Submit Another Inquiry</span>
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
