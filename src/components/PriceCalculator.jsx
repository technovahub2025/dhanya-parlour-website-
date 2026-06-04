import { useEffect, useMemo, useRef, useState } from 'react';
import Lenis from '@studio-freight/lenis';
import { Heart } from 'lucide-react';
import './PriceCalculator.css';

const ICON_BASE = '/icons/beauty-line-art';

const SERVICES = [
  { id: 'facial', name: 'Facial', price: 800, iconPath: `${ICON_BASE}/facial.png` },
  { id: 'hair-spa', name: 'Hair Spa', price: 1200, iconPath: `${ICON_BASE}/hairspa.png`, featured: true },
  { id: 'haircut', name: 'Haircut', price: 600, iconPath: `${ICON_BASE}/haircut.png` },
  { id: 'waxing', name: 'Waxing', price: 500, iconPath: `${ICON_BASE}/waxing.png`, featured: true },
  { id: 'hair-coloring', name: 'Hair Coloring', price: 1500, iconPath: `${ICON_BASE}/haircolouring.png` },
  { id: 'manicure', name: 'Manicure', price: 700, iconPath: `${ICON_BASE}/manicure.png`, featured: true },
  { id: 'pedicure', name: 'Pedicure', price: 800, iconPath: `${ICON_BASE}/pedicure.png`, featured: true },
  { id: 'bridal-makeup', name: 'Bridal Makeup', price: 5000, iconPath: `${ICON_BASE}/bridalmakeup.png`, featured: true },
  { id: 'party-makeup', name: 'Party Makeup', price: 2500, iconPath: `${ICON_BASE}/party makeup.png`, featured: true },
  { id: 'keratin', name: 'Keratin Treatment', price: 3000, iconPath: `${ICON_BASE}/hairspa.png`, featured: true },
];

const ADDONS = [
  { id: 'gold-facial', name: 'Gold Facial', price: 500 },
  { id: 'aroma', name: 'Aroma Therapy', price: 300 },
  { id: 'scalp', name: 'Scalp Massage', price: 400 },
];

const COUPONS = {
  GLOW10: 10,
  DHANYA15: 15,
  BRIDE20: 20,
};

const CURRENCY = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

const INITIAL_QTY = SERVICES.reduce((acc, service) => {
  acc[service.id] = 0;
  return acc;
}, {});

const INITIAL_ADDONS = ADDONS.reduce((acc, addon) => {
  acc[addon.id] = false;
  return acc;
}, {});

function PriceCalculator() {
  const [isOpen, setIsOpen] = useState(false);
  const [quantities, setQuantities] = useState(INITIAL_QTY);
  const [addons, setAddons] = useState(INITIAL_ADDONS);
  const [discountInput, setDiscountInput] = useState('10');
  const [couponInput, setCouponInput] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [calculationResult, setCalculationResult] = useState(null);
  const modalScrollRef = useRef(null);
  const modalContentRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      document.body.classList.remove('no-scroll');
      window.dispatchEvent(new CustomEvent('calc-modal-state', { detail: { open: false } }));
      return undefined;
    }

    document.body.classList.add('no-scroll');
    window.dispatchEvent(new CustomEvent('calc-modal-state', { detail: { open: true } }));

    return () => {
      document.body.classList.remove('no-scroll');
      window.dispatchEvent(new CustomEvent('calc-modal-state', { detail: { open: false } }));
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !modalScrollRef.current || !modalContentRef.current) {
      return undefined;
    }

    const lenis = new Lenis({
      wrapper: modalScrollRef.current,
      content: modalContentRef.current,
      eventsTarget: modalScrollRef.current,
      wheelEventsTarget: modalScrollRef.current,
      duration: 1.05,
      lerp: 0.08,
      smoothWheel: true,
      orientation: 'vertical',
    });

    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = window.requestAnimationFrame(raf);
    };

    rafId = window.requestAnimationFrame(raf);

    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      lenis.destroy();
    };
  }, [isOpen]);

  const subtotal = useMemo(() => {
    const serviceTotal = SERVICES.reduce((sum, service) => {
      return sum + service.price * quantities[service.id];
    }, 0);

    const addonTotal = ADDONS.reduce((sum, addon) => {
      return addons[addon.id] ? sum + addon.price : sum;
    }, 0);

    return serviceTotal + addonTotal;
  }, [quantities, addons]);

  const manualDiscountPercent = Math.min(Math.max(Number(discountInput) || 0, 0), 60);
  const manualDiscount = Math.round((subtotal * manualDiscountPercent) / 100);
  const discountAmount = manualDiscount + couponDiscount;
  const taxableAmount = Math.max(subtotal - discountAmount, 0);
  const gst = Math.round(taxableAmount * 0.18);
  const grandTotal = taxableAmount + gst;

  const selectedServices = useMemo(
    () =>
      SERVICES.filter((service) => (quantities[service.id] || 0) > 0).map((service) => ({
        id: service.id,
        name: service.name,
        price: service.price,
      })),
    [quantities]
  );

  const selectedAddons = useMemo(
    () =>
      ADDONS.filter((addon) => addons[addon.id]).map((addon) => ({
        id: addon.id,
        name: addon.name,
        price: addon.price,
      })),
    [addons]
  );

  const changeQty = (serviceId, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [serviceId]: Math.max(Math.min((prev[serviceId] || 0) + delta, 1), 0),
    }));
  };

  const toggleAddon = (addonId) => {
    setAddons((prev) => ({
      ...prev,
      [addonId]: !prev[addonId],
    }));
  };

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    const percent = COUPONS[code] || 0;

    if (!percent) {
      setCouponDiscount(0);
      return;
    }

    setCouponDiscount(Math.round((subtotal * percent) / 100));
  };

  const persistCalculation = async (payload) => {
    const apiUrl = import.meta.env.VITE_CALC_API_URL;

    if (apiUrl) {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to save calculation');
      }

      return;
    }

    const existing = JSON.parse(localStorage.getItem('beauty-service-requests') || '[]');
    existing.unshift(payload);
    localStorage.setItem('beauty-service-requests', JSON.stringify(existing));
  };

  const handleCalculateTotal = async () => {
    const phoneValue = phone.trim();

    if (!phoneValue) {
      setPhoneError('Please enter your Mobile Number');
      return;
    }

    setPhoneError('');

    const payload = {
      phone: phoneValue,
      services: selectedServices,
      addons: selectedAddons,
      subtotal,
      discountAmount,
      gst,
      grandTotal,
      couponCode: couponInput.trim().toUpperCase() || null,
      createdAt: new Date().toISOString(),
    };

    setCalculationResult(payload);

    try {
      await persistCalculation(payload);
    } catch (error) {
      console.error(error);
    }
  };

  const resetAll = () => {
    setQuantities(INITIAL_QTY);
    setAddons(INITIAL_ADDONS);
    setDiscountInput('10');
    setCouponInput('');
    setCouponDiscount(0);
    setPhone('');
    setPhoneError('');
    setCalculationResult(null);
  };

  const whatsappMessage = encodeURIComponent(
    `Hi Dhanya's Makeover, I want to book services. Subtotal: ${CURRENCY.format(subtotal)}, Discount: ${CURRENCY.format(discountAmount)}, GST: ${CURRENCY.format(gst)}, Total: ${CURRENCY.format(grandTotal)}.`
  );

  return (
    <>
      <button
        type="button"
        className="calc-fab"
        onClick={() => setIsOpen(true)}
        aria-label="Open price calculator"
      >
        Get Estimate
      </button>

      {isOpen && (
        <div
          className="calc-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Beauty price calculator"
        >
          <button type="button" className="calc-backdrop" onClick={() => setIsOpen(false)} aria-label="Close" />

          <section className="calc-panel" ref={modalScrollRef}>
            <div className="calc-panel-content" ref={modalContentRef}>
              <button type="button" className="calc-close" onClick={() => setIsOpen(false)} aria-label="Close calculator">
                x
              </button>

              <header className="calc-header">
                <h2>Beauty Service Price Calculator</h2>
                <p>Select your services and get an instant total.</p>
              </header>

              <div className="calc-content">
                <div className="calc-grid">
                  <div className="calc-services">
                    {SERVICES.map((service) => {
                      const qty = quantities[service.id] || 0;
                      const isSelected = qty > 0;

                      return (
                        <button
                          key={service.id}
                          type="button"
                          className={`calc-service-card ${isSelected ? 'selected' : ''}`}
                          onClick={() => changeQty(service.id, isSelected ? -1 : 1)}
                          aria-pressed={isSelected}
                          aria-label={`${isSelected ? 'Remove' : 'Add'} ${service.name}`}
                        >
                          <div className="calc-service-top">
                            <div className="calc-service-main">
                              <span className="calc-icon-wrap">
                                <img src={service.iconPath} alt="" className="calc-service-icon" loading="lazy" />
                              </span>
                              <div>
                                <h3>{service.name}</h3>
                                <p>{CURRENCY.format(service.price)}</p>
                              </div>
                            </div>
                            {service.featured && <Heart size={17} className="calc-heart" fill="currentColor" />}
                          </div>

                          <div className="calc-card-bottom">
                            <span className={isSelected ? 'calc-added-chip' : 'calc-add-btn'}>
                              {isSelected ? 'Added' : 'Add'}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <section className="calc-addons-wrap">
                  <h3>Enhance Your Glow</h3>
                  <div className="calc-addons">
                    {ADDONS.map((addon) => (
                      <button
                        key={addon.id}
                        type="button"
                        className={`calc-addon ${addons[addon.id] ? 'active' : ''}`}
                        onClick={() => toggleAddon(addon.id)}
                      >
                        <span>
                          {addon.name} - {CURRENCY.format(addon.price)}
                        </span>
                        <span className="calc-toggle" aria-hidden="true" />
                      </button>
                    ))}
                  </div>
                </section>

                <section className="calc-inputs-wrap">
                  <div className="calc-inputs">
                    <label>
                      Discount (%)
                      <input
                        type="number"
                        min="0"
                        max="60"
                        value={discountInput}
                        onChange={(e) => setDiscountInput(e.target.value)}
                      />
                    </label>

                    <div className="calc-coupon">
                      <label>
                        Coupon Code
                        <input
                          type="text"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value)}
                          placeholder="Use GLOW10"
                        />
                      </label>
                      <button type="button" onClick={applyCoupon}>Apply</button>
                    </div>
                  </div>
                  <label className="calc-phone-field">
                    Mobile Number
                    <input
                      type="tel"
                      inputMode="tel"
                      placeholder="Enter your Mobile Number"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (phoneError) setPhoneError('');
                      }}
                      aria-invalid={Boolean(phoneError)}
                      aria-describedby={phoneError ? 'phone-error' : undefined}
                    />
                  </label>
                  {phoneError && (
                    <p className="calc-field-error" id="phone-error" role="alert">
                      {phoneError}
                    </p>
                  )}
                  <p className="calc-gst-note">GST (18%): {CURRENCY.format(gst)}</p>
                </section>

                <div className="calc-footer">
                  <button type="button" className="calc-reset" onClick={resetAll}>Reset</button>
                  <button type="button" className="calc-total-btn" onClick={handleCalculateTotal}>
                    Calculate Total
                  </button>
                  <a
                    href={`https://wa.me/918072966960?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noreferrer"
                    className="calc-wa"
                  >
                    Send to WhatsApp
                  </a>
                </div>

                {calculationResult && (
                  <section className="calc-result">
                    <h3>Result</h3>
                    <p className="calc-result-phone">Mobile Number: {calculationResult.phone}</p>

                    <div className="calc-result-grid">
                      <div>
                        <span>Subtotal</span>
                        <strong>{CURRENCY.format(calculationResult.subtotal)}</strong>
                      </div>
                      <div>
                        <span>Discount</span>
                        <strong>- {CURRENCY.format(calculationResult.discountAmount)}</strong>
                      </div>
                      <div>
                        <span>GST (18%)</span>
                        <strong>{CURRENCY.format(calculationResult.gst)}</strong>
                      </div>
                      <div className="calc-result-total">
                        <span>Grand Total</span>
                        <strong>{CURRENCY.format(calculationResult.grandTotal)}</strong>
                      </div>
                    </div>

                    <div className="calc-result-lists">
                      <div>
                        <h4>Selected Services</h4>
                        <ul>
                          {calculationResult.services.length > 0 ? (
                            calculationResult.services.map((service) => (
                              <li key={service.id}>
                                {service.name} - {CURRENCY.format(service.price)}
                              </li>
                            ))
                          ) : (
                            <li>No services selected</li>
                          )}
                        </ul>
                      </div>

                      <div>
                        <h4>Add-ons</h4>
                        <ul>
                          {calculationResult.addons.length > 0 ? (
                            calculationResult.addons.map((addon) => (
                              <li key={addon.id}>
                                {addon.name} - {CURRENCY.format(addon.price)}
                              </li>
                            ))
                          ) : (
                            <li>No add-ons selected</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </section>
                )}
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

export default PriceCalculator;
