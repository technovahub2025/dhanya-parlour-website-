import { useRef } from 'react';
import CustomCursor from './components/common/CustomCursor/CustomCursor';
import Preloader from './components/common/Preloader/Preloader';
import OfferHighlights from './components/OfferHighlights/OfferHighlights';
import QuotationMaker from './components/QuotationMaker';
import {
  BookingSection,
  BranchesSection,
  ExperienceSection,
  FooterSection,
  HeroSection,
  MarqueeSection,
  ModesSection,
  Navbar,
  OfferDetailsSection,
  OfferModal,
  OfferStrip,
  ServicesSection,
} from './components/site';
import useCursorEffects from './hooks/useCursorEffects';
import useSiteMotion from './hooks/useSiteMotion';

function App() {
  const cursorDotRef = useRef(null);
  const cursorOutlineRef = useRef(null);

  useSiteMotion();
  useCursorEffects(cursorDotRef, cursorOutlineRef);

  return (
    <>
      <Preloader />
      <div className="noise-overlay"></div>
      <CustomCursor cursorDotRef={cursorDotRef} cursorOutlineRef={cursorOutlineRef} />

      <OfferModal />
      <Navbar />
      <HeroSection />
      <OfferStrip />
      <OfferHighlights />
      <OfferDetailsSection />
      <ServicesSection />
      <ModesSection />
      <ExperienceSection />
      <MarqueeSection />
      <BookingSection />
      <BranchesSection />
      <FooterSection />
      <QuotationMaker />
    </>
  );
}

export default App;
