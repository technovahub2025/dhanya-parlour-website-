import { useEffect, useMemo, useRef, useState } from 'react';
import Lenis from '@studio-freight/lenis';
import { ChevronDown, Search, X } from 'lucide-react';
import { QUOTATION_GROUPS, WHATSAPP_NUMBER } from './quotationData';
import {
  buildQuotationMessage,
  buildWhatsAppUrl,
  getSelectedServices,
  validateQuotationRequest,
} from './quotationUtils';
import './QuotationMaker.css';

function WhatsAppIcon({ size = 17 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12.04 2a9.84 9.84 0 0 0-8.43 14.9L2 22l5.25-1.55A9.95 9.95 0 1 0 12.04 2Zm0 17.98a8.03 8.03 0 0 1-4.1-1.12l-.3-.18-3.12.92.94-3.04-.2-.31a8 8 0 1 1 6.78 3.73Zm4.4-6c-.24-.12-1.43-.7-1.65-.79-.22-.08-.38-.12-.54.12-.16.24-.62.79-.76.95-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2a7.24 7.24 0 0 1-1.34-1.67c-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.41-.54-.42h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.51.58.18 1.1.16 1.51.1.46-.07 1.43-.59 1.63-1.15.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z" />
    </svg>
  );
}

function QuotationMaker() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [location, setLocation] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [errors, setErrors] = useState({});
  const [expandedGroupIds, setExpandedGroupIds] = useState([]);
  const [expandedPackageIds, setExpandedPackageIds] = useState([]);
  const modalScrollRef = useRef(null);
  const modalContentRef = useRef(null);

  const selectedServices = useMemo(
    () => getSelectedServices(QUOTATION_GROUPS, selectedIds),
    [selectedIds]
  );

  const filteredGroups = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return QUOTATION_GROUPS;
    }

    return QUOTATION_GROUPS
      .map((group) => {
        const categoryMatches = group.title.toLowerCase().includes(query);
        const items = categoryMatches
          ? group.items
          : group.items.filter((item) => item.name.toLowerCase().includes(query));

        return { ...group, items };
      })
      .filter((group) => group.items.length > 0);
  }, [searchTerm]);

  useEffect(() => {
    if (!isOpen) {
      document.body.classList.remove('no-scroll');
      window.dispatchEvent(new CustomEvent('quote-modal-state', { detail: { open: false } }));
      return undefined;
    }

    document.body.classList.add('no-scroll');
    window.dispatchEvent(new CustomEvent('quote-modal-state', { detail: { open: true } }));

    return () => {
      document.body.classList.remove('no-scroll');
      window.dispatchEvent(new CustomEvent('quote-modal-state', { detail: { open: false } }));
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

  const clearError = (field) => {
    setErrors((prev) => {
      if (!prev[field]) {
        return prev;
      }

      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const toggleService = (serviceId) => {
    setSelectedIds((prev) =>
      prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId]
    );
    clearError('services');
  };

  const toggleGroup = (groupId) => {
    setExpandedGroupIds((prev) =>
      prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]
    );
  };

  const togglePackageDetails = (serviceId) => {
    setExpandedPackageIds((prev) =>
      prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId]
    );
  };

  const removeSelectedService = (serviceId) => {
    setSelectedIds((prev) => prev.filter((id) => id !== serviceId));
    setExpandedPackageIds((prev) => prev.filter((id) => id !== serviceId));
  };

  const resetAll = () => {
    setSelectedIds([]);
    setExpandedPackageIds([]);
    setSearchTerm('');
    setName('');
    setMobile('');
    setLocation('');
    setErrors({});
  };

  const handleSendToWhatsApp = () => {
    const nextErrors = validateQuotationRequest({ name, mobile, selectedServices });

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const message = buildQuotationMessage({ name, mobile, location, selectedServices });
    window.open(buildWhatsAppUrl(WHATSAPP_NUMBER, message), '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <button
        type="button"
        className="quote-fab"
        onClick={() => setIsOpen(true)}
        aria-label="Open quotation maker"
      >
        Get Quotation
      </button>

      {isOpen && (
        <div className="quote-modal" role="dialog" aria-modal="true" aria-label="Service quotation maker">
          <button type="button" className="quote-backdrop" onClick={() => setIsOpen(false)} aria-label="Close" />

          <section className="quote-panel" ref={modalScrollRef}>
            <div className="quote-panel-content" ref={modalContentRef}>
              <button type="button" className="quote-close" onClick={() => setIsOpen(false)} aria-label="Close quotation maker">
                x
              </button>

              <header className="quote-header">
                <h2>Service Quotation Maker</h2>
                <p>Select the services you need and send your request on WhatsApp.</p>
              </header>

              <div className="quote-content">
                <section className="quote-details-card" aria-labelledby="quote-details-title">
                  <div>
                    <span className="quote-kicker">Your Details</span>
                    <h3 id="quote-details-title">Tell us who to contact</h3>
                  </div>

                  <div className="quote-fields">
                    <label>
                      <span className="quote-label-text">Name <span>*</span></span>
                      <input
                        type="text"
                        value={name}
                        placeholder="Enter your name"
                        aria-invalid={Boolean(errors.name)}
                        onChange={(event) => {
                          setName(event.target.value);
                          clearError('name');
                        }}
                      />
                      {errors.name && <small role="alert">{errors.name}</small>}
                    </label>

                    <label>
                      <span className="quote-label-text">Mobile Number <span>*</span></span>
                      <input
                        type="tel"
                        inputMode="tel"
                        value={mobile}
                        placeholder="Enter your mobile number"
                        aria-invalid={Boolean(errors.mobile)}
                        onChange={(event) => {
                          setMobile(event.target.value);
                          clearError('mobile');
                        }}
                      />
                      {errors.mobile && <small role="alert">{errors.mobile}</small>}
                    </label>

                    <label className="quote-field-wide">
                      <span className="quote-label-text">Location <span className="quote-optional">(optional)</span></span>
                      <input
                        type="text"
                        value={location}
                        placeholder="Optional"
                        onChange={(event) => setLocation(event.target.value)}
                      />
                    </label>
                  </div>
                </section>

                <section className="quote-services-wrap" aria-labelledby="quote-services-title">
                  <div className="quote-section-head">
                    <div>
                      <span className="quote-kicker">Services</span>
                      <h3 id="quote-services-title">Select services or packages</h3>
                    </div>
                    <span className="quote-count">{selectedServices.length} selected</span>
                  </div>

                  <label className="quote-search">
                    <Search size={16} aria-hidden="true" />
                    <input
                      type="search"
                      value={searchTerm}
                      placeholder="Search services..."
                      onChange={(event) => setSearchTerm(event.target.value)}
                    />
                  </label>

                  {errors.services && <p className="quote-field-error" role="alert">{errors.services}</p>}

                  {filteredGroups.length === 0 ? (
                    <p className="quote-empty">No services found</p>
                  ) : (
                    <div className="quote-category-list">
                      {filteredGroups.map((group) => {
                        const isGroupOpen = Boolean(searchTerm.trim()) || expandedGroupIds.includes(group.id);

                        return (
                          <section className="quote-category" key={group.id} aria-labelledby={`quote-category-${group.id}`}>
                            <button
                              type="button"
                              className="quote-category-head"
                              onClick={() => toggleGroup(group.id)}
                              aria-expanded={Boolean(isGroupOpen)}
                              aria-controls={`quote-category-panel-${group.id}`}
                            >
                              <ChevronDown size={16} className="quote-expand-icon" aria-hidden="true" />
                              <span className="quote-category-name" id={`quote-category-${group.id}`}>{group.title}</span>
                              <span className="quote-category-count">{group.items.length} options</span>
                            </button>

                            <div
                              id={`quote-category-panel-${group.id}`}
                              className={`quote-services-panel ${isGroupOpen ? 'expanded' : ''}`}
                              aria-hidden={!isGroupOpen}
                              inert={isGroupOpen ? undefined : true}
                            >
                              <div className={`quote-chip-row ${group.id === 'bridal-packages' ? 'quote-chip-row--packages' : ''}`}>
                                {group.items.map((service) => {
                                  const isSelected = selectedIds.includes(service.id);
                                  const isPackageExpanded = expandedPackageIds.includes(service.id);

                                  return service.package ? (
                                    <article
                                      key={service.id}
                                      className={`quote-package-chip-card ${isSelected ? 'selected' : ''}`}
                                    >
                                      <div className="quote-package-chip-head">
                                        <button
                                          type="button"
                                          className="quote-chip quote-chip--package"
                                          onClick={() => toggleService(service.id)}
                                          aria-pressed={isSelected}
                                        >
                                          <span>{service.name}</span>
                                          {service.priceLabel && <small>{service.priceLabel}</small>}
                                        </button>

                                        <button
                                          type="button"
                                          className="quote-package-more"
                                          onClick={() => togglePackageDetails(service.id)}
                                          aria-expanded={isPackageExpanded}
                                        >
                                          <span>{isPackageExpanded ? 'Hide details' : 'View details'}</span>
                                          <ChevronDown size={14} aria-hidden="true" />
                                        </button>
                                      </div>

                                      {service.offerLabel && (
                                        <p className="quote-package-offer">
                                          <span>Offer</span>
                                          {service.offerLabel}
                                        </p>
                                      )}

                                      <div className={`quote-package-details ${isPackageExpanded ? 'expanded' : ''}`}>
                                        {service.description && <p className="quote-package-desc">{service.description}</p>}

                                        {service.highlights && (
                                          <ul className="quote-package-highlights">
                                            {service.highlights.map((highlight) => (
                                              <li key={highlight}>{highlight}</li>
                                            ))}
                                          </ul>
                                        )}

                                        {service.note && <p className="quote-package-note">{service.note}</p>}
                                      </div>
                                    </article>
                                  ) : (
                                    <button
                                      key={service.id}
                                      type="button"
                                      className={`quote-chip ${isSelected ? 'selected' : ''}`}
                                      onClick={() => toggleService(service.id)}
                                      aria-pressed={isSelected}
                                    >
                                      <span>{service.name}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          </section>
                        );
                      })}
                    </div>
                  )}
                </section>

                <div className="quote-footer">
                  <div className="quote-selected-tags" aria-live="polite">
                    {selectedServices.map((service) => (
                      <button
                        key={service.id}
                        type="button"
                        className="quote-tag"
                        onClick={() => removeSelectedService(service.id)}
                        aria-label={`Remove ${service.name}`}
                      >
                        <span>{service.name}</span>
                        <X size={13} aria-hidden="true" />
                      </button>
                    ))}
                  </div>
                  <button type="button" className="quote-reset" onClick={resetAll}>Reset</button>
                  <button type="button" className="quote-wa" onClick={handleSendToWhatsApp}>
                    <WhatsAppIcon />
                    Send to WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

export default QuotationMaker;
