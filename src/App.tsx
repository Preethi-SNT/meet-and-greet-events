import React, { CSSProperties, useEffect, useState } from "react";
import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import { featureImages, services, galleryImages } from "./data";

const reveal = (delay: string): CSSProperties => ({ ["--delay" as any]: delay });

const PageShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="page">
    <div className="topbar">
      <span className="topbar-note">Plan your event with us</span>
      <a className="phone-btn" href="tel:+919908934999">+91 9908934999</a>
    </div>
    <header className="navbar">
      <div className="navbar-inner">
        <div className="navbar-logo">
          <img src="/images/img-001.jpg" alt="Meet & Greet logo" className="logo-mark" />
          <div className="logo-text">
            <span className="navbar-logo-main">Meet &amp; Greet Events</span>
            <span className="navbar-logo-sub">Epicurean Events Exemplified</span>
          </div>
        </div>
        <nav className="navbar-links">
          {[
            { to: "/", label: "Home", end: true },
            { to: "/about", label: "About" },
            { to: "/services", label: "Services" },
            { to: "/gallery", label: "Gallery" },
            { to: "/contact", label: "Contact" },
          ].map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `nav-link ${link.to === "/contact" ? "nav-link-cta" : ""} ${
                  isActive ? "active" : ""
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>

    {children}

    <footer className="footer">
      <div className="footer-inner">
        <div>
          <h4>Meet &amp; Greet Events Planner</h4>
          <p>Curating memorable celebrations for your most special moments.</p>
        </div>
        <div>
          <p>Phone / WhatsApp: +91 9908934999</p>
          <p>Reach out to begin planning your next celebration.</p>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Meet &amp; Greet Events Planner. All rights reserved.</span>
        <span className="footer-tagline">Weddings. Rituals. Milestones. Memories.</span>
      </div>
      <div className="watermark">Meet &amp; Greet Events</div>
    </footer>
  </div>
);

const Hero: React.FC = () => {
  const [active, setActive] = useState(0);
  const total = featureImages.length;

  useEffect(() => {
    const id = window.setInterval(() => setActive((i) => (i + 1) % total), 4200);
    return () => window.clearInterval(id);
  }, [total]);

  const heroStyle: React.CSSProperties = {
    backgroundImage: `linear-gradient(135deg, rgba(247, 233, 219, 0.7), rgba(255, 250, 244, 0.85)), url(${featureImages[active].src})`,
  };

  return (
    <section className="hero section reveal" style={{ ...reveal("0s"), ...heroStyle }}>
      <div className="hero-content glass">
        <p className="hero-kicker">Events | Stories | Memories</p>
        <h1>Celebrate with grace and modern elegance.</h1>
        <p className="hero-subtitle">
          At Meet &amp; Greet, we believe every event has a tale to say and share. Our team specializes in transforming your dreams into cherished memories, crafting celebrations that reflect each couple's personality and vision. Whether you imagine a grand ballroom gala or an intimate garden affair, our expert planners handle every detail so you can focus on enjoying your special day. From elegant decor and personalized themes to seamless logistics and heartfelt moments, our portfolio showcases a wide range of magical events filled with memories lasting for years.
        </p>
        <div className="hero-actions">
          <NavLink to="/contact" className="btn btn-primary">
            Plan Your Event
          </NavLink>
          <NavLink to="/services" className="btn btn-outline">
            View Services
          </NavLink>
        </div>
      </div>
      <div className="hero-pager floating">
        {featureImages.map((item, idx) => (
          <button
            key={item.src}
            className={`pager-dot ${idx === active ? "active" : ""}`}
            onClick={() => setActive(idx)}
            aria-label={item.label}
          />
        ))}
        <span className="hero-label">{featureImages[active].label}</span>
      </div>
    </section>
  );
};

const About: React.FC = () => (
  <section className="section section-two-column reveal" style={reveal("0.05s")}>
    <div>
      <h2>About Meet &amp; Greet</h2>
      <p>
        We design full-service experiences for weddings, rituals, and milestones while balancing luxurious aesthetics with smooth execution.
      </p>
      <p>
        Your vision guides us. We listen closely, shape the story, and orchestrate every detail so you can savour the celebration.
      </p>
    </div>
    <div className="section-card-grid">
      {[
        {
          title: "End-to-end planning",
          copy: "Venues, decor, timelines, vendors, choreography, and day-of production handled with care.",
        },
        {
          title: "Design direction",
          copy: "Signature florals, lighting, staging, and tablescapes with cohesive color stories and textures.",
        },
        {
          title: "Capture the moments",
          copy: "Photo and video partners who preserve your events with cinematic warmth and detail.",
        },
      ].map((card, idx) => (
        <div key={card.title} className="info-card reveal" style={reveal(`${0.1 + idx * 0.05}s`)}>
          <h3>{card.title}</h3>
          <p>{card.copy}</p>
        </div>
      ))}
    </div>
  </section>
);

const Services: React.FC = () => (
  <section className="section reveal" style={reveal("0.05s")}>
    <h2>Services</h2>
    <p>Weddings, pre-wedding festivities, and milestone events curated with hospitality and modern flair.</p>
    <div className="services-grid">
      {services.map((s, idx) => (
        <article key={s.title} className="service-card reveal" style={reveal(`${0.1 + idx * 0.04}s`)}>
          <div className="service-image" style={{ backgroundImage: `url(${s.cover})` }} aria-hidden />
          <span className="service-tag">{s.tag}</span>
          <h3>{s.title}</h3>
          <p>{s.copy}</p>
        </article>
      ))}
    </div>
  </section>
);

const Gallery: React.FC = () => (
  <section className="section reveal" style={reveal("0.05s")}>
    <h2>Event Moments</h2>
    <p>All portfolio highlights in one place—swap or reorder anytime by renaming the images in the gallery list.</p>
    <div className="gallery-grid">
      {galleryImages.map((item, idx) => (
        <div key={item.src} className="gallery-card reveal" style={reveal(`${0.08 + idx * 0.02}s`)}>
          <div className="gallery-image-wrapper">
            <img className="gallery-image" src={item.src} alt="Event decor and moments" loading="lazy" />
            <div className="gallery-overlay">View</div>
          </div>
        </div>
      ))}
    </div>
  </section>
);

const Contact: React.FC = () => (
  <section className="section reveal" style={reveal("0.05s")}>
    <h2>Contact</h2>
    <div className="contact-grid">
      <div className="reveal" style={reveal("0.1s")}>
        <p>Share your dates, venue ideas, and preferences. We will return with concepts tailored to you.</p>
        <div className="info-card contact-card">
          <p>
            <strong>Phone / WhatsApp:</strong> +91 9908934999
          </p>
          <p>
            <strong>Contact:</strong> Aparanjitha Kothinti
          </p>
          <p>Weddings, pre-wedding events, cradle ceremonies, birthdays, engagements, and more.</p>
        </div>
      </div>
      <div className="contact-card reveal" style={reveal("0.15s")}>
        <form className="contact-form" method="post" action="/api/contact">
          <div className="form-row">
            <label>
              Name
              <input name="name" type="text" placeholder="Your name" required />
            </label>
            <label>
              Email
              <input name="email" type="email" placeholder="you@example.com" required />
            </label>
          </div>
          <div className="form-row">
            <label>
              Phone
              <input name="phone" type="tel" placeholder="+91 9xxxxxxxxx" />
            </label>
            <label>
              Event type
              <input name="event_type" type="text" placeholder="Wedding, Sangeet, Birthday..." />
            </label>
          </div>
          <label>
            Message
            <textarea name="message" rows={3} placeholder="Dates, venues, guest size, and any special touches..." />
          </label>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    </div>
  </section>
);

const Home: React.FC = () => (
  <>
    <Hero />
    <section className="section reveal" style={reveal("0.1s")}>
      <div className="feature-strip">
        {featureImages.map((item, idx) => (
          <div key={item.src} className="feature-card reveal" style={reveal(`${0.15 + idx * 0.05}s`)}>
            <div className="feature-image" style={{ backgroundImage: `url(${item.src})` }} />
            <div className="feature-text">
              <h3>{item.label}</h3>
              <NavLink to="/gallery" className="link-inline">View gallery</NavLink>
            </div>
          </div>
        ))}
      </div>
    </section>
    <section className="section reveal" style={reveal("0.2s")}>
      <div className="contact-grid">
        <div className="info-card">
          <h3>Why hosts love us</h3>
          <p>Single point of contact, cohesive design language, vetted vendors, and a calm on-day crew.</p>
          <p>Share your brief, and we will propose mood boards, timelines, and budgets to match.</p>
          <NavLink to="/about" className="btn btn-outline" style={{ marginTop: "0.5rem" }}>
            Learn more
          </NavLink>
        </div>
        <div className="contact-card">
          <h3>Ready to start?</h3>
          <p>Tell us your date and city, and we will lock the next steps.</p>
          <NavLink to="/contact" className="btn btn-primary">
            Contact us
          </NavLink>
        </div>
      </div>
    </section>
  </>
);

export default function App() {
  return (
    <BrowserRouter>
      <PageShell>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="*"
            element={
              <>
                <Hero />
                <About />
              </>
            }
          />
        </Routes>
      </PageShell>
    </BrowserRouter>
  );
}
