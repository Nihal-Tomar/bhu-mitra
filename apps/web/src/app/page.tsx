'use client';

import React, { useState } from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { QuickActionBar } from '../components/home/QuickActionBar';
import { ServicesGrid } from '../components/home/ServicesGrid';
import { GISSection } from '../components/home/GISSection';
import { LandRecordsPreview } from '../components/home/LandRecordsPreview';
import { CitizenJourneys } from '../components/home/CitizenJourneys';
import { SchemesSection } from '../components/home/SchemesSection';
import { SustainabilitySection } from '../components/home/SustainabilitySection';
import { HowItWorks } from '../components/home/HowItWorks';
import { NationalScale } from '../components/home/NationalScale';
import { TrustSection } from '../components/home/TrustSection';
import { NewsSection } from '../components/home/NewsSection';
import { ResourceCenter } from '../components/home/ResourceCenter';
import { FinalCTA } from '../components/home/FinalCTA';
import { HomeFooter } from '../components/home/HomeFooter';
import { ServiceModal, ServiceModalData } from '../components/home/ServiceModal';
import { QuickActionItem, AcquisitionProject } from '../data/homepageData';

export default function HomePage() {
  const [activeModalData, setActiveModalData] = useState<ServiceModalData | null>(null);

  const handleQuickActionSelect = (action: QuickActionItem) => {
    const targetId = action.href.replace('#', '');
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    setActiveModalData({
      title: action.title,
      category: 'RFCTLARR Acquisition Lifecycle',
      description: action.description,
      features: [
        'End-to-end statutory stage compliance',
        'Direct upstream land records (RoR) verification',
        'Tamper-evident audit trail & gazette linkage',
      ],
    });
  };

  const handleProjectSelect = (project: AcquisitionProject) => {
    setActiveModalData({
      title: `${project.name} (${project.id})`,
      category: `${project.type} · ${project.stage}`,
      description: `Monitored under ${project.ministry} in ${project.district}, ${project.state}. SLA status: ${project.slaDaysRemaining > 0 ? `${project.slaDaysRemaining} days remaining` : `${Math.abs(project.slaDaysRemaining)} days overdue`}.`,
      features: [
        `Notified Area: ${project.landNotifiedHa} Ha / ${project.landProposedHa} Ha (${project.affectedFamilies} affected families)`,
        `Disbursed Compensation: ₹${project.compensationDisbursedCr} Cr / ₹${project.compensationAssessedCr} Cr`,
        `Risk Assessment: ${project.riskLevel} (Delay forecast: ${project.delayPredictedDays} days)`,
        `Recommended Action: ${project.recommendedAction}`,
      ],
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA] text-slate-900 font-sans selection:bg-[#138808] selection:text-white">
      {/* Interactive Service & Query Modal */}
      <ServiceModal data={activeModalData} onClose={() => setActiveModalData(null)} />

      {/* 1. Hero: National Land Acquisition & Management System */}
      <HeroSection />

      {/* 2. Floating Quick Action Bar: 6 Acquisition Hubs */}
      <QuickActionBar onSelectAction={handleQuickActionSelect} />

      {/* 3. National Acquisition Overview & Command Center Dashboard (#dashboard) */}
      <ServicesGrid onSelectProject={handleProjectSelect} />

      {/* 4. 9-Stage End-to-End Acquisition Lifecycle (#lifecycle) */}
      <HowItWorks />

      {/* 5. National Acquisition GIS: Linear Corridor Alignment & Notified Parcels (#gis-map) */}
      <GISSection />

      {/* 6. Stakeholder Workspaces: Ministry, CALA, Requiring Body, Survey, Family (#stakeholders) */}
      <CitizenJourneys />

      {/* 7. Acquisition Risk & Delay Intelligence + SLA Early Warning Alerts (#intelligence) */}
      <SustainabilitySection />

      {/* 8. Citizen & Affected Family Transparency Portal (#transparency) */}
      <LandRecordsPreview />

      {/* 9. Statutory Document Repository & Tamper-Evident Records (#documents) */}
      <TrustSection />

      {/* 10. Statutory Safeguards & Citizen Rights under RFCTLARR 2013 (#safeguards) */}
      <SchemesSection />

      {/* 11. Acquisition Gazette Notices & Awards (#notices) */}
      <NewsSection />

      {/* 12. Land Acquisition Transparency & Help Center (#help) */}
      <ResourceCenter />

      {/* 13. National Scale & Inter-State Revenue Harmonization */}
      <NationalScale />

      {/* 14. Final National Infrastructure Call to Action */}
      <FinalCTA />

      {/* 15. Institutional Deep Navy Footer with Slogans & Prototype Disclaimer */}
      <HomeFooter />
    </div>
  );
}
