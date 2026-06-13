import { BRANCHES, EMAIL_URL, INSTAGRAM_URL, PRIMARY_PHONE, SECONDARY_PHONE, WHATSAPP_URL } from '../../../data/contactData';

export default function BranchesSection() {
  const whatsappText = encodeURIComponent('Hi Dhanya Makeup Studio, I would like to know more about booking a service.');

  return (
    <section id="contact-us" className="branches-section" aria-labelledby="branches-title">
      <div className="branches-inner">
        <div className="branches-header">
          <span className="section-label">Visit Us</span>
          <h2 id="branches-title">Two studios. One signature bridal finish.</h2>
          <p>
            Reach Dhanya Makeup Studio in Pondicherry or Karaikal for bridal makeup, party looks,
            pre-bridal care, hairstyling, and beauty services.
          </p>
        </div>

        <div className="branch-actions">
          <a href={`tel:+91${PRIMARY_PHONE}`}>Call {PRIMARY_PHONE}</a>
          <a href={`tel:+91${SECONDARY_PHONE}`}>Call {SECONDARY_PHONE}</a>
          <a href={`${WHATSAPP_URL}?text=${whatsappText}`} target="_blank" rel="noreferrer">WhatsApp</a>
          <a href={EMAIL_URL} target="_blank" rel="noreferrer">Email Us</a>
          <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">Instagram</a>
        </div>

        <div className="branches-grid">
          {BRANCHES.map((branch) => (
            <article className="branch-card" key={branch.id}>
              <span className="branch-kicker">Dhanya Makeup Studio</span>
              <h3>{branch.name}</h3>
              <p>{branch.address}</p>
              <div className="branch-card-actions">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch.mapQuery)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Get Directions
                </a>
                <a href={`${WHATSAPP_URL}?text=${whatsappText}`} target="_blank" rel="noreferrer">
                  Book on WhatsApp
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}


