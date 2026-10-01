import { useEffect } from "react";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { PhotoCards } from "../components/PhotoCards";
import { Stats } from "../components/Stats";
import { Problem } from "../components/Problem";
import { HowItWorks } from "../components/HowItWorks";
import { WhatWeCheck } from "../components/WhatWeCheck";
import { ResultPreview } from "../components/ResultPreview";
import { FAQ } from "../components/FAQ";
import { FinalCTA } from "../components/FinalCTA";
import { Footer } from "../components/Footer";
import { track, creativeFromLocation } from "../funnel/api";

const css = `
  .hdr-nav { display: flex; }
  .hdr-burger { display: none !important; }
  .two-col { grid-template-columns: 1fr 1fr; }
  .two-col-left { grid-template-columns: 200px 1fr; }
  .three-col { grid-template-columns: repeat(3,1fr); }
  .photo-grid { grid-template-columns: repeat(3,1fr); }
  .footer-grid { grid-template-columns: 200px 1fr auto auto; }

  @media (max-width: 960px) {
    .two-col { grid-template-columns: 1fr !important; }
    .two-col-left { grid-template-columns: 1fr !important; }
    .three-col { grid-template-columns: 1fr !important; }
    .photo-grid { grid-template-columns: 1fr !important; }
    .footer-grid { grid-template-columns: 1fr 1fr !important; }
    .two-col > div:last-child.hero-phone { display: none; }
  }
  @media (max-width: 768px) {
    .hdr-nav { display: none !important; }
    .hdr-burger { display: flex !important; }
    .footer-grid { grid-template-columns: 1fr !important; }
  }
`;


interface LandingPageProps {
  onLoginClick?: () => void;
}

export function LandingPage({ onLoginClick }: LandingPageProps) {
  const creative = creativeFromLocation();
  useEffect(() => {
    track("landing_view", creative);
  }, [creative]);

  return (
    <>
      <style>{css}</style>
      <Header onLoginClick={onLoginClick} />
      <div style={{ paddingTop: 64 }}>
        <Hero creative={creative} />
        <PhotoCards />
        <Stats />
        <Problem />
        <HowItWorks />
        <WhatWeCheck />
        <ResultPreview />
        <FAQ />
        <FinalCTA />
        <Footer />
      </div>
    </>
  );
}
