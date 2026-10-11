import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { audioEngine } from '../../services/audioService';

interface HeaderProps {
  onRequestProspectus: () => void;
  onReplayIntro: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onRequestProspectus, onReplayIntro }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMuted, setIsMuted] = useState(audioEngine.getMuted());

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggleSound = () => {
    const muted = audioEngine.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      audioEngine.startAmbient();
      audioEngine.playClick();
    }
  };

  const navLinks = [
    { label: 'ফ্লিট শোরুম', href: '#showroom' },
    { label: 'বিনিয়োগ মডেল', href: '#investment' },
    { label: 'আরওআই ক্যালকুলেটর', href: '#calculator' },
    { label: 'কার্যপদ্ধতি', href: '#how-it-works' },
    { label: 'পার্টনার্স', href: '#partners' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-sans ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-xl border-b border-pink-100 shadow-sm py-3.5'
          : 'bg-white/80 backdrop-blur-md border-b border-pink-50 py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          className="group flex items-center gap-2 text-2xl font-display font-black tracking-wider text-slate-900 whitespace-nowrap shrink-0 cursor-pointer"
        >
          <span className="text-[#D70F64] group-hover:text-[#E21B70] transition-colors">
            ETTL
          </span>
          <span className="text-xs uppercase tracking-widest text-[#D70F64] font-semibold border-l border-pink-200 pl-2">
            ইনভেস্টমেন্ট
          </span>
        </a>

        {/* Zone 2: 4-5 Clean single-line text navigation links in Bangla */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-700">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => audioEngine.playClick()}
              className="relative py-1 hover:text-[#D70F64] transition-colors whitespace-nowrap shrink-0 group"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#D70F64] group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </nav>

        {/* Zone 3: 1 primary action + audio/intro utilities */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              audioEngine.playClick();
              onReplayIntro();
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#D70F64] bg-pink-50 hover:bg-pink-100/80 border border-pink-200 transition-colors whitespace-nowrap cursor-pointer"
            title="ইন্ট্রো পুনরায় দেখুন"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D70F64]" />
            <span>ইন্ট্রো দেখুন</span>
          </button>

          <button
            onClick={handleToggleSound}
            className="p-2 rounded-xl text-slate-600 hover:text-[#D70F64] bg-slate-50 hover:bg-pink-50 border border-slate-200 hover:border-pink-200 transition-colors cursor-pointer"
            title={isMuted ? 'শব্দ চালু করুন' : 'শব্দ বন্ধ করুন'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-[#D70F64]" />}
          </button>

          <button
            onClick={() => {
              audioEngine.playClick();
              onRequestProspectus();
            }}
            className="px-5 py-2.5 text-xs md:text-sm font-bold text-white bg-[#D70F64] hover:bg-[#E21B70] rounded-xl transition-all shadow-md shadow-[#D70F64]/25 hover:shadow-lg hover:shadow-[#D70F64]/35 hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap shrink-0 cursor-pointer"
          >
            প্রসপেক্টাস অনুরোধ
          </button>
        </div>
      </div>
    </header>
  );
};
