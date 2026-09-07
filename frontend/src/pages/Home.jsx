import { Link } from "react-router-dom";
import "../App.css";

function Home() {
  return (
    <div className="fashnova-home">
      {/* =========================
          NAVBAR
      ========================= */}
      <header className="fashion-navbar">
        <Link to="/" className="fashion-brand">
          <img src="/logo.png" alt="FASHNOVA" />

          <div>
            <strong>FASHNOVA</strong>
            <span>FASHION / INTELLIGENCE</span>
          </div>
        </Link>

        <nav className="fashion-nav-links">
  <Link to="/vision">VISION</Link>
  <Link to="/trends">TRENDS</Link>
  <Link to="/studio">STUDIO</Link>
  <Link to="/style-engine">STYLE ENGINE</Link>
</nav>

        <Link to="/profile" className="fashion-profile">
          PROFILE <span>↗</span>
        </Link>
      </header>

      <main>
        {/* =========================
            HERO
        ========================= */}
        <section className="fashion-hero">
          <div className="hero-background-number">01</div>

          <div className="hero-left">
            <div className="hero-kicker">
              <span className="live-dot"></span>
              AI × ML × GENERATIVE INTELLIGENCE
            </div>

            <h1>
              FASHION
              <br />
              <em>Reimagine</em>
            </h1>

            <p className="hero-copy">
              A new intelligence layer for fashion —
              <br />
              built to see, predict, create and personalize.
            </p>

            <div className="hero-buttons">
              <Link to="/vision" className="hero-primary">
                ENTER FASHNOVA
                <span>↗</span>
              </Link>

              <Link to="/trends" className="hero-secondary">
                EXPLORE TRENDS
              </Link>
            </div>
          </div>

          <div className="hero-right">
            <div className="hero-image-frame">
              <div className="hero-image-glow"></div>

              <div className="hero-orbit orbit-1"></div>
              <div className="hero-orbit orbit-2"></div>
              <div className="hero-orbit orbit-3"></div>

              <img
                src="/logo.png"
                alt="FASHNOVA intelligence"
                className="hero-fashion-logo"
              />

              <div className="floating-label label-top">
                <span>VISION</span>
                <strong>01</strong>
              </div>

              <div className="floating-label label-right">
                <span>TRENDS</span>
                <strong>02</strong>
              </div>

              <div className="floating-label label-bottom">
                <span>STUDIO</span>
                <strong>03</strong>
              </div>

              <div className="hero-cross cross-one">+</div>
              <div className="hero-cross cross-two">+</div>
              <div className="hero-cross cross-three">+</div>
            </div>

            <div className="hero-side-caption">
              <span>FASHNOVA / 001</span>
              <span>FASHION INTELLIGENCE SYSTEM</span>
            </div>
          </div>

          <div className="hero-bottom">
            <span>SCROLL TO DISCOVER</span>
            <div className="scroll-line"></div>
            <span>2026</span>
          </div>
        </section>

        {/* =========================
            MANIFESTO
        ========================= */}
        <section className="manifesto-section">
          <div className="manifesto-meta">
            <span>THE IDEA</span>
            <span>002</span>
          </div>

          <div className="manifesto-content">
            <p className="manifesto-small">
              FASHION HAS ALWAYS BEEN ABOUT
              <br />
              WHAT COMES NEXT.
            </p>

            <h2>
              What if fashion
              <br />
              could <em>think?</em>
            </h2>

            <p className="manifesto-description">
              FASHNOVA brings computer vision, machine learning,
              generative AI and personalization into one connected
              fashion intelligence system.
            </p>
          </div>
        </section>

        {/* =========================
            INTELLIGENCE SYSTEM
        ========================= */}
        <section className="system-section">
          <div className="system-header">
            <div>
              <span className="section-index">003 / SYSTEM</span>

              <h2>
                FOUR LAYERS.
                <br />
                <em>ONE MIND.</em>
              </h2>
            </div>

            <p>
              FASHNOVA doesn't treat AI as a collection of isolated
              features. Every intelligence layer feeds the next.
            </p>
          </div>

          <div className="system-flow">
            {/* VISION */}
            <Link to="/vision" className="system-card vision-card">
              <div className="system-card-top">
                <span>01</span>
                <span>SEE</span>
              </div>

              <div className="system-card-center">
                <div className="system-symbol">◉</div>

                <h3>VISION</h3>

                <p>
                  Computer vision transforms fashion imagery
                  into structured fashion intelligence.
                </p>
              </div>

              <div className="system-card-bottom">
                <span>GARMENTS</span>
                <span>COLORS</span>
                <span>STYLE</span>
              </div>
            </Link>

            {/* TRENDS */}
            <Link to="/trends" className="system-card trends-card">
              <div className="system-card-top">
                <span>02</span>
                <span>PREDICT</span>
              </div>

              <div className="system-card-center">
                <div className="system-chart">
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                </div>

                <h3>TRENDS</h3>

                <p>
                  Machine learning studies fashion signals
                  to discover momentum and forecast what comes next.
                </p>
              </div>

              <div className="system-card-bottom">
                <span>DATA</span>
                <span>MOMENTUM</span>
                <span>FORECAST</span>
              </div>
            </Link>

            {/* STUDIO */}
            <Link to="/studio" className="system-card studio-card">
              <div className="system-card-top">
                <span>03</span>
                <span>CREATE</span>
              </div>

              <div className="system-card-center">
                <div className="studio-symbol">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

                <h3>STUDIO</h3>

                <p>
                  Generative intelligence turns fashion ideas
                  into new visual possibilities.
                </p>
              </div>

              <div className="system-card-bottom">
                <span>CONCEPTS</span>
                <span>GRAPHICS</span>
                <span>DESIGNS</span>
              </div>
            </Link>

            {/* STYLE ENGINE */}
            <Link to="/style-engine" className="system-card engine-card">
              <div className="system-card-top">
                <span>04</span>
                <span>UNDERSTAND</span>
              </div>

              <div className="system-card-center">
                <div className="engine-symbol">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>

                <h3>STYLE ENGINE</h3>

                <p>
                  Vision + trends + creativity + personal
                  preferences become personalized style intelligence.
                </p>
              </div>

              <div className="system-card-bottom">
                <span>RANK</span>
                <span>PERSONALIZE</span>
                <span>RECOMMEND</span>
              </div>
            </Link>
          </div>
        </section>

        {/* =========================
            EDITORIAL BREAK
        ========================= */}
        <section className="editorial-section">
          <div className="editorial-number">04</div>

          <div className="editorial-main">
            <span>NOT ANOTHER FASHION PLATFORM.</span>

            <h2>
              WE DON'T
              <br />
              <em>FOLLOW</em>
              <br />
              TRENDS.
            </h2>
          </div>

          <div className="editorial-side">
            <div className="editorial-line"></div>

            <p>
              We study the signals behind them.
            </p>

            <span>
              DATA / VISION / CREATIVITY
            </span>
          </div>
        </section>

        {/* =========================
            VISION FEATURE
        ========================= */}
        <section className="feature-section feature-light">
          <div className="feature-number">01</div>

          <div className="feature-content">
            <span className="feature-label">
              COMPUTER VISION
            </span>

            <h2>
              SEE
              <br />
              <em>FASHION.</em>
            </h2>

            <p>
              Upload a fashion image and let FASHNOVA
              transform visual information into structured
              fashion attributes.
            </p>

            <div className="feature-tags">
              <span>GARMENTS</span>
              <span>COLORS</span>
              <span>CATEGORIES</span>
              <span>SEASON</span>
              <span>USAGE</span>
            </div>

            <Link to="/vision" className="feature-link">
              ENTER VISION <span>↗</span>
            </Link>
          </div>

          <div className="feature-visual vision-visual">
            <div className="scan-grid"></div>

            <div className="scan-box">
              <span>IMAGE INPUT</span>
              <strong>ANALYZE</strong>
            </div>

            <div className="scan-point point-a"></div>
            <div className="scan-point point-b"></div>
            <div className="scan-point point-c"></div>

            <div className="scan-label scan-label-a">
              GARMENT
            </div>

            <div className="scan-label scan-label-b">
              COLOR
            </div>
          </div>
        </section>

        {/* =========================
            TRENDS FEATURE
        ========================= */}
        <section className="feature-section feature-dark">
          <div className="feature-visual trend-visual">
            <div className="trend-grid"></div>

            <div className="trend-line">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>

            <div className="trend-year year-one">2022</div>
            <div className="trend-year year-two">2024</div>
            <div className="trend-year year-three">2026</div>

            <div className="trend-floating">
              <span>FORECAST</span>
              <strong>↑</strong>
            </div>
          </div>

          <div className="feature-content">
            <span className="feature-label">
              MACHINE LEARNING
            </span>

            <h2>
              SEE
              <br />
              <em>WHAT'S NEXT.</em>
            </h2>

            <p>
              FASHNOVA studies fashion data across time,
              detecting momentum and forecasting emerging
              colors, categories and styles.
            </p>

            <div className="feature-tags">
              <span>TREND DETECTION</span>
              <span>MOMENTUM</span>
              <span>SEASONALITY</span>
              <span>FORECASTING</span>
            </div>

            <Link to="/trends" className="feature-link">
              ENTER TRENDS <span>↗</span>
            </Link>
          </div>
        </section>

        {/* =========================
            STUDIO FEATURE
        ========================= */}
        <section className="feature-section feature-light studio-feature">
          <div className="feature-number">03</div>

          <div className="feature-content">
            <span className="feature-label">
              GENERATIVE AI
            </span>

            <h2>
              CREATE
              <br />
              <em>WHAT'S NEXT.</em>
            </h2>

            <p>
              Studio transforms creative direction into
              visual fashion possibilities — from concepts
              and graphics to patterns and style variations.
            </p>

            <div className="feature-tags">
              <span>CONCEPTS</span>
              <span>DESIGNS</span>
              <span>GRAPHICS</span>
              <span>PATTERNS</span>
            </div>

            <Link to="/studio" className="feature-link">
              ENTER STUDIO <span>↗</span>
            </Link>
          </div>

          <div className="feature-visual studio-visual">
            <div className="studio-ring ring-a"></div>
            <div className="studio-ring ring-b"></div>
            <div className="studio-ring ring-c"></div>

            <div className="studio-center">
              <span>GENERATE</span>
              <strong>✦</strong>
            </div>

            <div className="studio-orbit-label">
              CONCEPT
            </div>

            <div className="studio-orbit-label second">
              STYLE
            </div>

            <div className="studio-orbit-label third">
              PATTERN
            </div>
          </div>
        </section>

        {/* =========================
            STYLE ENGINE
        ========================= */}
        <section className="style-engine-section">
          <div className="engine-intro">
            <span>05 / THE CORE</span>

            <h2>
              STYLE
              <br />
              <em>ENGINE.</em>
            </h2>

            <p>
              This is where FASHNOVA becomes personal.
            </p>
          </div>

          <div className="engine-visual">
            <div className="engine-orbit outer-orbit"></div>
            <div className="engine-orbit middle-orbit"></div>
            <div className="engine-orbit inner-orbit"></div>

            <div className="engine-node node-vision">
              <span>01</span>
              VISION
            </div>

            <div className="engine-node node-trends">
              <span>02</span>
              TRENDS
            </div>

            <div className="engine-node node-studio">
              <span>03</span>
              STUDIO
            </div>

            <div className="engine-node node-user">
              <span>04</span>
              YOU
            </div>

            <div className="engine-core">
              <span>FASHNOVA</span>
              <strong>STYLE<br />ENGINE</strong>
            </div>
          </div>

          <div className="engine-bottom">
            <span>VISION</span>
            <b>+</b>
            <span>TRENDS</span>
            <b>+</b>
            <span>STUDIO</span>
            <b>+</b>
            <span>YOU</span>
            <b>→</b>
            <strong>YOUR STYLE</strong>
          </div>
        </section>

        {/* =========================
            FINAL STATEMENT
        ========================= */}
        <section className="final-section">
          <div className="final-top">
            <span>FASHNOVA / 2026</span>
            <span>FASHION INTELLIGENCE</span>
          </div>

          <div className="final-content">
            <p>
              THE FUTURE OF FASHION
              <br />
              ISN'T SOMETHING TO FOLLOW.
            </p>

            <h2>
              <span>UNDERSTAND.</span>
              <br />
              <em>PREDICT.</em>
              <br />
              CREATE.
            </h2>
          </div>

          <Link to="/vision" className="final-button">
            BEGIN EXPLORING
            <span>↗</span>
          </Link>

          <div className="final-bottom">
            <span>FASHION MEETS INTELLIGENCE</span>
            <span>FASHNOVA © 2026</span>
          </div>
        </section>
      </main>

      {/* =========================
          FOOTER
      ========================= */}
      <footer className="fashion-footer">
        <div className="footer-logo">
          <img src="/logo.png" alt="FASHNOVA" />

          <div>
            <strong>FASHNOVA</strong>
            <span>FASHION MEETS INTELLIGENCE</span>
          </div>
        </div>

        <div className="footer-links">
          <Link to="/vision">VISION</Link>
          <Link to="/trends">TRENDS</Link>
          <Link to="/studio">STUDIO</Link>
          <Link to="/style-engine">STYLE ENGINE</Link>
          <Link to="/profile">PROFILE</Link>
        </div>

        <div className="footer-copy">
          <span>AI + ML FASHION INTELLIGENCE PLATFORM</span>
          <span>© 2026</span>
        </div>
      </footer>
    </div>
  );
}

export default Home;