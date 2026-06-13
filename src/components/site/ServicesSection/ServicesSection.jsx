import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export default function ServicesSection() {
  const [activeService, setActiveService] = useState('hero');

  const backgrounds = [
    { bg: 'hero', className: 'active-default', image: '/images/hero.png', active: activeService === 'hero' },
    { bg: 'hair', image: '/images/hair.png', active: activeService === 'hair' },
    { bg: 'facial', image: '/images/facial.png', active: activeService === 'facial' },
    { bg: 'spa', image: '/images/spa.png', active: activeService === 'spa' },
    { bg: 'makeup', image: '/images/makeup.png', active: activeService === 'makeup' },
  ];

  return (
    <section id="services" className="services-list-section">
      <div className="service-bg-container">
        {backgrounds.map((item) => (
          <div
            key={item.bg}
            className={`service-bg ${item.className || ''}`}
            data-bg={item.bg}
            style={{ backgroundImage: `url('${item.image}')`, opacity: item.active ? 1 : 0 }}
          />
        ))}
      </div>

      <div className="services-content">
        <div className="section-label">Our Service Collection</div>
        <ul className="service-list" onMouseLeave={() => setActiveService('hero')}>
          {[
            { id: 'makeup', bg: 'makeup', num: '01', name: 'Makeup' },
            { id: 'skin-care', bg: 'facial', num: '02', name: 'Skin Care' },
            { id: 'hair-care', bg: 'hair', num: '03', name: 'Hair Care' },
            { id: 'body-care', bg: 'spa', num: '04', name: 'Body Care' },
            { id: 'bridal-services', bg: 'makeup', num: '05', name: 'Bridal Services' },
          ].map((item) => (
            <li
              key={item.id}
              className="service-item"
              data-target={item.bg}
              onMouseEnter={() => setActiveService(item.bg)}
              onMouseLeave={() => setActiveService('hero')}
            >
              <span className="service-num">{item.num}</span>
              <a href="#" className="service-link">
                <span className="service-name">{item.name}</span>
                <span className="service-arrow"><ArrowRight /></span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}


