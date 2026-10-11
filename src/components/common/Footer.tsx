import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-pink-100 text-slate-500 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-pink-100/70">
          {/* Brand & Wordmark (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2 text-2xl font-display font-black tracking-wider text-slate-900">
              <span className="text-[#D70F64]">
                ETTL
              </span>
              <span className="text-xs uppercase tracking-widest text-[#D70F64] font-sans font-semibold border-l border-pink-200 pl-2">
                Investment Zone
              </span>
            </div>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed max-w-sm">
              Institutional vehicle fleet syndication platform. Connecting high-net-worth investors with asset-backed mobility cashflows across premier corporate and VIP lease networks.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#D70F64] font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Registered Alternative Investment Syndicate #ETTL-8429</span>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-slate-900 font-bold">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#showroom" className="hover:text-[#D70F64] transition-colors">
                  Fleet Showroom
                </a>
              </li>
              <li>
                <a href="#investment" className="hover:text-[#D70F64] transition-colors">
                  Investment Model
                </a>
              </li>
              <li>
                <a href="#calculator" className="hover:text-[#D70F64] transition-colors">
                  ROI Simulator
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-[#D70F64] transition-colors">
                  Operational Journey
                </a>
              </li>
            </ul>
          </div>

          {/* Vehicle Fleet Tiers */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-slate-900 font-bold">
              Fleet Assets
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>Executive Sedans (Hybrid V8)</li>
              <li>Grand Tourer Luxury SUVs</li>
              <li>High-Performance 800V EVs</li>
              <li>Armored Diplomatic Shuttles</li>
            </ul>
          </div>

          {/* Compliance & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-slate-900 font-bold">
              Private Wealth Desk
            </h4>
            <div className="text-xs space-y-1.5 text-slate-600">
              <p>One Executive Plaza, Level 42</p>
              <p>Mon - Fri: 08:00 - 18:00 EST</p>
              <p className="text-[#D70F64] font-mono font-semibold pt-1">investors@ettl-investment.com</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar & Risk Disclosures */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>© {new Date().getFullYear()} ETTL Investment Zone. All rights reserved.</p>
          <p className="max-w-xl text-center md:text-right text-slate-500">
            Disclaimer: Private Placement Memorandum available to accredited investors only. Past vehicle utilization and lease yields do not guarantee future performance. Vehicle assets are held in independent bankruptcy-remote SPV trusts.
          </p>
        </div>
      </div>
    </footer>
  );
};
