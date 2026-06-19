import { useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import MagneticCta from '../../common/MagneticCta/MagneticCta';
import CustomDatePicker from '../../common/CustomDatePicker/CustomDatePicker';
import { WHATSAPP_URL } from '../../../data/contactData';
import { SERVICE_GROUPS, SERVICE_OPTIONS } from '../../../data/serviceData';

export default function BookingSection() {
  const [selectedServiceIds, setSelectedServiceIds] = useState([]);
  const [bookingName, setBookingName] = useState('');
  const [bookingEmail, setBookingEmail] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredDateError, setPreferredDateError] = useState('');
  const [bookingServiceSearch, setBookingServiceSearch] = useState('');
  const [expandedServiceGroups, setExpandedServiceGroups] = useState([]);

  const selectedServices = useMemo(
    () => SERVICE_OPTIONS.filter((option) => selectedServiceIds.includes(option.value)),
    [selectedServiceIds]
  );

  const filteredServiceGroups = useMemo(() => {
    const query = bookingServiceSearch.trim().toLowerCase();

    if (!query) {
      return SERVICE_GROUPS;
    }

    return SERVICE_GROUPS
      .map((group) => {
        const categoryMatches = group.label.toLowerCase().includes(query);
        const options = categoryMatches
          ? group.options
          : group.options.filter((option) => option.label.toLowerCase().includes(query));

        return { ...group, options };
      })
      .filter((group) => group.options.length > 0);
  }, [bookingServiceSearch]);

  const toggleBookingService = (serviceId) => {
    setSelectedServiceIds((prev) =>
      prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId]
    );
  };

  const toggleBookingGroup = (groupId) => {
    setExpandedServiceGroups((prev) =>
      prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]
    );
  };

  const handleBookingSubmit = (event) => {
    event.preventDefault();

    if (!preferredDate) {
      setPreferredDateError('Please select your preferred date.');
      return;
    }

    const serviceLabels = selectedServices.map((service) => service.label);
    const serviceLine = serviceLabels.length > 0 ? serviceLabels.join(', ') : 'Not selected';
    const bookingMessage = encodeURIComponent(
      [
        'Hi Dhanya Makeup Studio, I would like to book an appointment.',
        `Name: ${bookingName || 'Not provided'}`,
        `Email: ${bookingEmail || 'Not provided'}`,
        `Services: ${serviceLine}`,
        `Preferred Date: ${preferredDate || 'Not selected'}`,
      ].join('\n')
    );

    window.open(`${WHATSAPP_URL}?text=${bookingMessage}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="contact" className="booking-minimal">
      <div className="booking-wrapper">
        <h2>Book Your Beautiful <br /><em>Transformation</em></h2>
        <form className="booking-form-minimal" onSubmit={handleBookingSubmit}>
          <div className="form-row booking-top-row">
            <label className="booking-field">
              <span>Name</span>
              <input
                type="text"
                value={bookingName}
                onChange={(e) => setBookingName(e.target.value)}
                required
              />
            </label>
            <label className="booking-field">
              <span>Email</span>
              <input
                type="email"
                value={bookingEmail}
                onChange={(e) => setBookingEmail(e.target.value)}
                required
              />
            </label>
          </div>
          <div className="form-row booking-service-row">
            <div className="booking-field booking-services-field">
              <div className="booking-service-picker" aria-labelledby="booking-services-title">
                <div className="booking-service-head">
                  <div>
                    <span>Select Services</span>
                    <strong id="booking-services-title">Choose one or more services</strong>
                  </div>
                  <em>{selectedServices.length} selected</em>
                </div>

                <label className="booking-service-search">
                  <Search size={15} aria-hidden="true" />
                  <input
                    type="search"
                    value={bookingServiceSearch}
                    placeholder="Search services..."
                    onChange={(event) => setBookingServiceSearch(event.target.value)}
                  />
                </label>

                {filteredServiceGroups.length === 0 ? (
                  <p className="booking-service-empty">No services found</p>
                ) : (
                  <div className="booking-service-list">
                    {filteredServiceGroups.map((group) => {
                      const isOpen = Boolean(bookingServiceSearch.trim()) || expandedServiceGroups.includes(group.id);

                      return (
                        <section className="booking-service-category" key={group.id}>
                          <button
                            type="button"
                            className="booking-service-category-head"
                            onClick={() => toggleBookingGroup(group.id)}
                            aria-expanded={isOpen}
                            aria-controls={`booking-${group.id}-options`}
                          >
                            <span className="booking-service-arrow" aria-hidden="true" />
                            <strong>{group.label}</strong>
                            <small>{group.options.length} options</small>
                          </button>

                          <div
                            id={`booking-${group.id}-options`}
                            className={`booking-service-panel ${isOpen ? 'expanded' : ''}`}
                            aria-hidden={!isOpen}
                            inert={isOpen ? undefined : true}
                          >
                            <div className="booking-service-chip-row">
                              {group.options.map((option) => {
                                const isSelected = selectedServiceIds.includes(option.value);

                                return (
                                  <button
                                    key={option.value}
                                    type="button"
                                    className={`booking-service-chip ${isSelected ? 'selected' : ''}`}
                                    onClick={() => toggleBookingService(option.value)}
                                    aria-pressed={isSelected}
                                  >
                                    {option.label}
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

                <div className="booking-selected-tags" aria-live="polite">
                  {selectedServices.length === 0 ? (
                    <p>Choose one or more services</p>
                  ) : (
                    selectedServices.map((service) => (
                      <button
                        key={service.value}
                        type="button"
                        className="booking-selected-tag"
                        onClick={() => toggleBookingService(service.value)}
                        aria-label={`Remove ${service.label}`}
                      >
                        <span>{service.label}</span>
                        <X size={13} aria-hidden="true" />
                      </button>
                    ))
                  )}
                </div>

                <input type="hidden" name="services" value={selectedServiceIds.join(',')} />
              </div>
            </div>
            <div className="booking-final-row">
              <div className="booking-field booking-date-field">
                <span>Preferred Date</span>
                <CustomDatePicker
                  value={preferredDate}
                  onChange={(date) => {
                    setPreferredDate(date);
                    setPreferredDateError('');
                  }}
                />
                <input type="hidden" name="preferredDate" value={preferredDate} />
                {preferredDateError && (
                  <small className="booking-date-error" role="alert">{preferredDateError}</small>
                )}
              </div>
              <div className="booking-action-row">
                <MagneticCta as="button" type="submit" className="magnetic-btn-submit" shineVariant="solid">
                  Book Now on WhatsApp
                </MagneticCta>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}


