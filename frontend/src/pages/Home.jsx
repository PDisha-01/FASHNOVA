import { Link } from "react-router-dom";
import "../App.css";

function Home() {
  return (
    <div className="app">
      {/* =========================
          NAVBAR
      ========================= */}
      <header className="navbar">
        <Link to="/" className="brand">
          <img
            src="/logo.png"
            alt="FASHNOVA logo"
            className="brand-logo"
          />

          <div className="brand-text">
            <span>FASHNOVA</span>
            <small>FASHION MEETS INTELLIGENCE</small>
          </div>
        </Link>

        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/vision">Vision</Link>
          <Link to="/trends">Trends</Link>
          <Link to="/studio">Studio</Link>
        </nav>

        <Link to="/profile" className="profile-button">
          Profile
        </Link>
      </header>

      <main>
        {/* =========================
            HERO
        ========================= */}
        <section id="home" className="hero-section">
          <div className="hero-content">
            <p className="eyebrow">AI × ML × FASHION</p>

            <h1>
              Fashion
              <br />
              Meets
              <br />
              <span>Intelligence.</span>
            </h1>

            <p className="hero-description">
              FASHNOVA combines computer vision, machine learning,
              generative AI, and personalized recommendation intelligence
              to understand fashion and shape what comes next.
            </p>

            <div className="hero-actions">
              <Link to="/vision" className="primary-button">
                Explore FASHNOVA
                <span>→</span>
              </Link>

              
            </div>

            <div className="hero-tagline">
              <span></span>
              <p>FASHION MEETS INTELLIGENCE</p>
              <span></span>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-orbit orbit-one"></div>
            <div className="hero-orbit orbit-two"></div>
            <div className="hero-orbit orbit-three"></div>

            <div className="hero-glow"></div>

            <img
              src="/logo.png"
              alt="FASHNOVA"
              className="hero-logo-art"
            />

            <span className="hero-dot dot-one"></span>
            <span className="hero-dot dot-two"></span>
            <span className="hero-dot dot-three"></span>

            <div className="hero-visual-label">
              <span>01</span>
              <span>FASHION INTELLIGENCE</span>
            </div>
          </div>
        </section>

        {/* =========================
            INTELLIGENCE INTRO
        ========================= */}
        <section className="intelligence-section">
          <div className="section-heading">
            <p className="section-label">
              INSIDE FASHNOVA
            </p>

            <h2>
              A fashion system
              <br />
              <span>built on intelligence.</span>
            </h2>

            <p>
              FASHNOVA does more than display fashion. It analyzes visual
              information, learns from fashion data, generates new creative
              possibilities, and uses those signals to create personalized
              style intelligence.
            </p>
          </div>

          <div className="intelligence-pipeline">
            <div className="pipeline-step">
              <span>01</span>
              <strong>INPUT</strong>
              <p>
                Fashion images, trend data, user preferences, and creative
                context.
              </p>
            </div>

            <div className="pipeline-arrow">→</div>

            <div className="pipeline-step">
              <span>02</span>
              <strong>AI / ML PROCESSING</strong>
              <p>
                Computer vision, feature extraction, trend modeling, and
                generative intelligence.
              </p>
            </div>

            <div className="pipeline-arrow">→</div>

            <div className="pipeline-step">
              <span>03</span>
              <strong>FASHION INTELLIGENCE</strong>
              <p>
                Structured understanding of garments, trends, styles,
                patterns, and creative possibilities.
              </p>
            </div>

            <div className="pipeline-arrow">→</div>

            <div className="pipeline-step pipeline-highlight">
              <span>04</span>
              <strong>STYLE ENGINE</strong>
              <p>
                Personalized recommendations generated from combined
                intelligence.
              </p>
            </div>
          </div>
        </section>

        {/* =========================
            PILLARS
        ========================= */}
        <section className="pillars-section">
          <div className="section-heading">
            <p className="section-label">
              THE FASHNOVA INTELLIGENCE
            </p>

            <h2>
              Three pillars.
              <br />
              <span>One intelligence system.</span>
            </h2>

            <p>
              Each pillar solves a different part of fashion intelligence.
              Together they create the foundation for the Style Engine.
            </p>
          </div>

          <div className="pillar-grid">
            {/* VISION */}
            <article className="pillar-card" id="vision">
              <div className="pillar-top">
                <span className="pillar-number">01</span>
                <span className="pillar-word">ANALYZE</span>
              </div>

              <h3>VISION</h3>

              <p>
                Computer vision transforms fashion images into structured
                fashion information.
              </p>

              <ul className="pillar-features">
                <li>Garment detection</li>
                <li>Clothing classification</li>
                <li>Color & pattern recognition</li>
                <li>Fit & style attributes</li>
                <li>Outfit analysis</li>
              </ul>

              <Link to="/vision">Explore Vision →</Link>
            </article>

            {/* TRENDS */}
            <article className="pillar-card" id="trends">
              <div className="pillar-top">
                <span className="pillar-number">02</span>
                <span className="pillar-word">PREDICT</span>
              </div>

              <h3>TRENDS</h3>

              <p>
                Machine learning studies fashion signals to identify,
                score, and forecast emerging trends.
              </p>

              <ul className="pillar-features">
                <li>Trend detection</li>
                <li>Trend scoring</li>
                <li>Historical analysis</li>
                <li>Seasonal patterns</li>
                <li>Future forecasting</li>
              </ul>

              <Link to="/trends">Explore Trends →</Link>
            </article>

            {/* STUDIO */}
            <article className="pillar-card" id="studio">
              <div className="pillar-top">
                <span className="pillar-number">03</span>
                <span className="pillar-word">CREATE</span>
              </div>

              <h3>STUDIO</h3>

              <p>
                Generative AI turns fashion concepts into new creative
                directions, designs, and visual possibilities.
              </p>

              <ul className="pillar-features">
                <li>Fashion concepts</li>
                <li>Design generation</li>
                <li>Graphics & patterns</li>
                <li>Style variations</li>
                <li>Trend-aware creation</li>
              </ul>

              <Link to="/studio">Open Studio →</Link>
            </article>
          </div>
        </section>

        {/* =========================
            VISION PREVIEW
        ========================= */}
        <section className="capability-section">
          <div className="capability-content">
            <p className="section-label">01 / COMPUTER VISION</p>

            <h2>
              See fashion
              <br />
              <span>as data.</span>
            </h2>

            <p>
              Vision converts visual fashion information into structured
              attributes that the rest of FASHNOVA can understand.
            </p>

            <div className="capability-list">
              <span>GARMENTS</span>
              <span>COLORS</span>
              <span>PATTERNS</span>
              <span>FIT</span>
              <span>STYLE</span>
              <span>SEASON</span>
            </div>

            <Link to="/vision" className="text-link">
              Enter Vision →
            </Link>
          </div>

          <div className="capability-index">
            <span>VISION</span>
            <strong>01</strong>
          </div>
        </section>

        {/* =========================
            TRENDS PREVIEW
        ========================= */}
        <section className="capability-section capability-reverse">
          <div className="capability-content">
            <p className="section-label">02 / MACHINE LEARNING</p>

            <h2>
              Understand
              <br />
              <span>what's next.</span>
            </h2>

            <p>
              Trends processes fashion signals across time to discover
              patterns, measure momentum, and forecast emerging styles.
            </p>

            <div className="capability-list">
              <span>DATA</span>
              <span>FEATURES</span>
              <span>TRENDS</span>
              <span>MOMENTUM</span>
              <span>SEASONALITY</span>
              <span>FORECAST</span>
            </div>

            <Link to="/trends" className="text-link">
              Enter Trends →
            </Link>
          </div>

          <div className="capability-index">
            <span>TRENDS</span>
            <strong>02</strong>
          </div>
        </section>

        {/* =========================
            STUDIO PREVIEW
        ========================= */}
        <section className="capability-section">
          <div className="capability-content">
            <p className="section-label">03 / GENERATIVE AI</p>

            <h2>
              Create
              <br />
              <span>new possibilities.</span>
            </h2>

            <p>
              Studio uses generative intelligence to explore concepts,
              patterns, graphics, and style variations while remaining
              connected to fashion trends.
            </p>

            <div className="capability-list">
              <span>CONCEPTS</span>
              <span>DESIGNS</span>
              <span>GRAPHICS</span>
              <span>PATTERNS</span>
              <span>VARIATIONS</span>
              <span>CREATION</span>
            </div>

            <Link to="/studio" className="text-link">
              Enter Studio →
            </Link>
          </div>

          <div className="capability-index">
            <span>STUDIO</span>
            <strong>03</strong>
          </div>
        </section>

        {/* =========================
            STYLE ENGINE
        ========================= */}
        <section className="engine-section">
          <div className="engine-content">
            <p className="section-label">
              THE CORE INTELLIGENCE
            </p>

            <h2>
              STYLE
              <br />
              <span>ENGINE</span>
            </h2>

            <p className="engine-description">
              The Style Engine is where FASHNOVA's intelligence comes
              together. It combines visual understanding, trend forecasts,
              creative signals, and user preferences to produce
              personalized fashion recommendations.
            </p>

            <div className="engine-flow">
              <div>
                <span>01</span>
                <strong>VISION</strong>
              </div>

              <b>+</b>

              <div>
                <span>02</span>
                <strong>TRENDS</strong>
              </div>

              <b>+</b>

              <div>
                <span>03</span>
                <strong>STUDIO</strong>
              </div>

              <b>+</b>

              <div>
                <span>04</span>
                <strong>USER PROFILE</strong>
              </div>

              <b>→</b>

              <div className="engine-result">
                <span>CORE</span>
                <strong>STYLE ENGINE</strong>
              </div>
            </div>

            <div className="engine-output">
              <span>INTELLIGENCE OUTPUT</span>

              <div>
                <strong>PERSONALIZED STYLE RECOMMENDATIONS</strong>
                <p>
                  Ranked using fashion understanding, current trends,
                  generated possibilities, and individual preferences.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            FINAL CTA
        ========================= */}
        <section className="cta-section">
          <p className="section-label">
            FASHNOVA / FASHION INTELLIGENCE
          </p>

          <h2>
            Don't just follow
            <br />
            <span>fashion.</span>
          </h2>

          <p>
            Understand it. Predict it. Create it. Personalize it.
          </p>

          <div className="cta-actions">
            <Link to="/vision" className="primary-button">
              Start Exploring
              <span>→</span>
            </Link>

            <Link to="/trends" className="secondary-button">
              Discover Trends
            </Link>
          </div>
        </section>

        {/* =========================
            BRAND STATEMENT
        ========================= */}
        <section className="statement-section">
          <div className="statement-line"></div>

          <p>FASHION MEETS INTELLIGENCE</p>

          <h2>
            Understand your style.
            <br />
            <span>Shape what's next.</span>
          </h2>

          <div className="statement-line"></div>
        </section>
      </main>

      {/* =========================
          FOOTER
      ========================= */}
      <footer>
        <div className="footer-brand">
          <span>FASHNOVA</span>
          <p>FASHION MEETS INTELLIGENCE</p>
        </div>

        <p>AI + ML Fashion Intelligence Platform</p>

        <span>© 2026 FASHNOVA</span>
        <span>all rights reserved</span>
      </footer>
    </div>
  );
}

export default Home;