import "../App.css";

function Trends() {
  return (
    <div className="app">
      <header className="navbar">
        <a href="/" className="brand">
          <img
            src="/logo.png"
            alt="FASHNOVA logo"
            className="brand-logo"
          />

          <div className="brand-text">
            <span>FASHNOVA</span>
            <small>FASHION MEETS INTELLIGENCE</small>
          </div>
        </a>

        <nav className="nav-links">
          <a href="/">Home</a>
          <a href="/vision">Vision</a>
          <a href="/trends">Trends</a>
          <a href="/studio">Studio</a>
        </nav>

        <a href="/profile" className="profile-button">
          Profile
        </a>
      </header>

      <main className="profile-page">
        <section className="profile-hero">
          <p className="section-label">FASHNOVA TRENDS</p>

          <h1>
            Predict
            <br />
            <span>What's Next.</span>
          </h1>

          <p>
            FASHNOVA Trends uses fashion data and machine learning to
            detect emerging trends, understand their momentum, and
            forecast what may become popular next.
          </p>
        </section>

        <section className="profile-grid">
          <article className="profile-card">
            <div className="profile-card-top">
              <span>01</span>
              <span>TREND DETECTION</span>
            </div>

            <h2>Emerging Trends</h2>

            <p>
              Identify fashion patterns and emerging styles from
              historical and current fashion data.
            </p>
          </article>

          <article className="profile-card">
            <div className="profile-card-top">
              <span>02</span>
              <span>TREND SCORING</span>
            </div>

            <h2>Trend Intelligence</h2>

            <p>
              Measure trend momentum using signals such as frequency,
              engagement, seasonality, and other fashion indicators.
            </p>
          </article>

          <article className="profile-card">
            <div className="profile-card-top">
              <span>03</span>
              <span>FORECASTING</span>
            </div>

            <h2>Future Forecasts</h2>

            <p>
              Machine learning models will estimate how fashion trends
              may evolve across short, medium, and long-term horizons.
            </p>
          </article>

          <article className="profile-card">
            <div className="profile-card-top">
              <span>04</span>
              <span>STYLE ENGINE</span>
            </div>

            <h2>Trend → Style</h2>

            <p>
              Trend intelligence will eventually feed the FASHNOVA
              Style Engine to improve personalized recommendations.
            </p>
          </article>
        </section>
      </main>

      <footer>
        <div className="footer-brand">
          <span>FASHNOVA</span>
          <p>FASHION MEETS INTELLIGENCE</p>
        </div>

        <p>Fashion Intelligence Platform</p>

        <span>© 2026 FASHNOVA</span>
        <span>all rights reserved</span>
      </footer>
    </div>
  );
}

export default Trends;