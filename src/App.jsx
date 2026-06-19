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
import useSiteMotion from './hooks/useSiteMotion';

function App() {
  useSiteMotion();

  return (
    <>
      <Preloader />
      <div className="noise-overlay"></div>

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
