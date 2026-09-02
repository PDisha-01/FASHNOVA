import "../App.css";

function Studio() {
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
          <p className="section-label">FASHNOVA STUDIO</p>

          <h1>
            Create.
            <br />
            <span>Imagine.</span>
          </h1>

          <p>
            The creative intelligence layer of FASHNOVA for generating
            fashion concepts, graphics, patterns, and style variations.
          </p>
        </section>

        <section className="profile-grid">
          <article className="profile-card">
            <div className="profile-card-top">
              <span>01</span>
              <span>FASHION CONCEPTS</span>
            </div>

            <h2>Fashion Concepts</h2>

            <p>
              Generate new fashion concepts based on creative direction,
              style, and trend intelligence.
            </p>
          </article>

          <article className="profile-card">
            <div className="profile-card-top">
              <span>02</span>
              <span>GRAPHICS</span>
            </div>

            <h2>Graphic Design</h2>

            <p>
              Create fashion graphics and visual design concepts for
              garments and collections.
            </p>
          </article>

          <article className="profile-card">
            <div className="profile-card-top">
              <span>03</span>
              <span>STYLE VARIATIONS</span>
            </div>

            <h2>Style Variations</h2>

            <p>
              Explore different visual variations of fashion ideas using
              the FASHNOVA creative engine.
            </p>
          </article>

          <article className="profile-card">
            <div className="profile-card-top">
              <span>04</span>
              <span>PATTERNS</span>
            </div>

            <h2>Pattern Generation</h2>

            <p>
              Create experimental fashion patterns and visual directions
              for future designs.
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

export default Studio;