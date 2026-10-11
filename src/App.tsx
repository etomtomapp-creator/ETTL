import React, { useState } from 'react';
import { CinematicIntro } from './components/3d/CinematicIntro';
import { Header } from './components/navigation/Header';
import { HeroSection } from './components/sections/HeroSection';
import { ShowroomSection } from './components/sections/ShowroomSection';
import { RoiCalculatorSection } from './components/sections/RoiCalculatorSection';
import { HowItWorksSection } from './components/sections/HowItWorksSection';
import { PartnersSection } from './components/sections/PartnersSection';
import { ContactSection } from './components/sections/ContactSection';
import { Footer } from './components/common/Footer';
import { ProspectusModal } from './components/modals/ProspectusModal';

export default function App() {
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [isProspectusModalOpen, setIsProspectusModalOpen] = useState<boolean>(false);
  const [modalInitialAmount, setModalInitialAmount] = useState<number>(150000);

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  const handleReplayIntro = () => {
    setShowIntro(true);
  };

  const handleOpenProspectus = (amount: number = 150000) => {
    setModalInitialAmount(amount);
    setIsProspectusModalOpen(true);
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-[#D70F64]/20 selection:text-[#D70F64]">
      {/* 1. Cinematic Opening Intro (Active on first visit or when requested) */}
      {showIntro ? (
        <CinematicIntro onComplete={handleIntroComplete} />
      ) : (
        /* 2. Main High-Performance 3D Scrolling Platform */
        <div className="flex-1 flex flex-col animate-fade-in transition-opacity duration-700">
          {/* Fixed Glassmorphism Header */}
          <Header
            onRequestProspectus={() => handleOpenProspectus(150000)}
            onReplayIntro={handleReplayIntro}
          />

          <main className="flex-1">
            {/* Hero Section with 4-Column KPI Strip */}
            <HeroSection
              onExploreFleet={() => scrollToSection('showroom')}
              onOpenCalculator={() => scrollToSection('calculator')}
            />

            {/* 3D Luxury Vehicle Showroom Section */}
            <ShowroomSection
              onSelectVehicleForCalculator={(vehicleId) => {
                scrollToSection('calculator');
              }}
            />

            {/* Dynamic Investment Model & ROI Yield Simulator */}
            <RoiCalculatorSection
              onCommitAmount={(amount) => handleOpenProspectus(amount)}
            />

            {/* Operational How It Works Section */}
            <HowItWorksSection />

            {/* Enterprise Infrastructure & Underwriting Partners */}
            <PartnersSection />

            {/* Private Wealth Concierge & Contact Form */}
            <ContactSection initialAmount={modalInitialAmount} />
          </main>

          {/* Luxury Multi-Column Dark Footer */}
          <Footer />

          {/* Offering Memorandum / Prospectus Modal */}
          <ProspectusModal
            isOpen={isProspectusModalOpen}
            onClose={() => setIsProspectusModalOpen(false)}
            initialAmount={modalInitialAmount}
          />
        </div>
      )}
    </div>
  );
}
