import { useState } from 'react';
import useBodyScrollLock from '../../../hooks/useBodyScrollLock';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useBodyScrollLock(mobileMenuOpen);

  return (
    <>
      <nav className="navbar">
        <div className="logo">
          <img src="/images/logo.png" alt="Dhanya Makeup Studio Karaikal" />
        </div>
        <div className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
          <a href="#home" onClick={() => setMobileMenuOpen(false)}>Home</a>
          <a href="#offers" onClick={() => setMobileMenuOpen(false)}>Offers</a>
          <a href="#services" onClick={() => setMobileMenuOpen(false)}>Services</a>
          <a href="#modes" onClick={() => setMobileMenuOpen(false)}>Packages</a>
          <a href="#experience" onClick={() => setMobileMenuOpen(false)}>About</a>
          <a href="#contact-us" onClick={() => setMobileMenuOpen(false)}>Contact Us</a>
          <a href="#contact" onClick={() => setMobileMenuOpen(false)}>Book Now</a>
        </div>
        <button
          className="menu-btn"
          aria-label="Menu"
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((prev) => !prev)}
        >
          <span className="menu-line" />
          <span className="menu-line" />
          <span className="menu-line" />
        </button>
      </nav>
      {mobileMenuOpen && <div className="mobile-nav-backdrop" onClick={() => setMobileMenuOpen(false)} />}
    </>
  );
}


