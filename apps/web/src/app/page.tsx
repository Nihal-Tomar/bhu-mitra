'use client';

import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { CommandPreviewSection } from '../components/home/CommandPreviewSection';
import { SectorSelectionSection } from '../components/home/SectorSelectionSection';
import { AcquisitionJourneySection } from '../components/home/AcquisitionJourneySection';
import { IntelligenceStripSection } from '../components/home/IntelligenceStripSection';
import { InstitutionalFooter } from '../components/common/InstitutionalFooter';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 font-sans selection:bg-[#138808] selection:text-white">
      {/* 1. Hero: Farmer + GIS Landscape, Slogan, Telemetry, and Primary CTAs */}
      <HeroSection />

      {/* 2. National Acquisition Command: Compact Dashboard Preview */}
      <CommandPreviewSection />

      {/* 3. Choose Infrastructure Sector: 5 Compact Sector Cards */}
      <SectorSelectionSection />

      {/* 4. The Acquisition Journey: Concise 9-Stage RFCTLARR Lifecycle */}
      <AcquisitionJourneySection />

      {/* 5. National Acquisition Intelligence: Cadastral GIS, Risk AI, Compensation Traceability */}
      <IntelligenceStripSection />

      {/* Institutional Deep Navy Footer with Slogans & Statutory Disclaimers */}
      <InstitutionalFooter />
    </div>
  );
}
