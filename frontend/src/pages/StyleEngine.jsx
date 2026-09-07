import { Link } from "react-router-dom";
import { useState } from "react";
import "./StyleEngine.css";

function StyleEngine() {
      const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
    const handleGetRecommendations = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/style-engine/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userContext: {},
          visionContext: {},
          trendContext: {},
          requestContext: {
            occasion: "everyday",
            season: "current",
            style: "preferences",
          },
         candidates: [
  {
    candidate_id: "test-001",
    name: "Classic Casual Shirt",
    category: "top",
    sub_category: "shirts",
    article_type: "casual shirt",
    color: "blue",
    colors: ["blue"],
    pattern: "solid",
    fabric: "cotton",
    aesthetic: "casual",
    season: "all-season",
    gender: "unisex",
    usage: "everyday",
    metadata: {},
  },
],
          top_k: 5,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to generate recommendations.");
      }

      setRecommendations(data.recommendations || []);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="style-engine-page">
      <nav className="style-engine-navbar">
        <Link to="/" className="style-engine-brand">
          FASHNOVA
        </Link>

        <div className="style-engine-nav-links">
            <Link to="/">HOME</Link>
          <Link to="/vision">VISION</Link>
          <Link to="/trends">TRENDS</Link>
          <Link to="/studio">STUDIO</Link>
          <Link to="/style-engine">STYLE ENGINE</Link>
          <Link to="/profile">PROFILE</Link>
        </div>
      </nav>

      <section className="style-engine-hero">
        <div className="style-engine-hero-content">
          <span className="style-engine-eyebrow">
            FASHNOVA STYLE ENGINE
          </span>

          <h1>
            Your style,
            <br />
            intelligently refined.
          </h1>

          <p>
            FASHNOVA brings together what you wear, what is trending,
            and what you prefer to create personalized fashion
            recommendations.
          </p>

          <button
  className="style-engine-primary-button"
  onClick={handleGetRecommendations}
  disabled={loading}
>
  {loading ? "Generating..." : "Get Recommendations"}
</button>
        </div>

        <div className="style-engine-intelligence-card">
          <span>INTELLIGENCE FLOW</span>

          <div className="style-engine-flow">
            <div className="style-engine-flow-item">
              <strong>VISION</strong>
              <small>What you wear</small>
            </div>

            <div className="style-engine-flow-line" />

            <div className="style-engine-flow-item">
              <strong>TRENDS</strong>
              <small>What's emerging</small>
            </div>

            <div className="style-engine-flow-line" />

            <div className="style-engine-flow-item">
              <strong>PROFILE</strong>
              <small>What you prefer</small>
            </div>
          </div>

          <div className="style-engine-flow-result">
            <span>STYLE ENGINE</span>
            <strong>Personalized recommendations</strong>
          </div>
        </div>
      </section>

      <section className="style-engine-context-section">
        <div className="style-engine-section-heading">
          <span>01 — CONTEXT</span>
          <h2>Tell FASHNOVA what you're looking for.</h2>
          <p>
            Your request becomes part of the recommendation context.
          </p>
        </div>

        <div className="style-engine-context-grid">
          <div className="style-engine-context-card">
            <span>OCCASION</span>
            <button>Everyday</button>
          </div>

          <div className="style-engine-context-card">
            <span>SEASON</span>
            <button>Current Season</button>
          </div>

          <div className="style-engine-context-card">
            <span>STYLE</span>
            <button>My Preferences</button>
          </div>

          <div className="style-engine-context-card">
            <span>LIMIT</span>
            <button>Top 5</button>
          </div>
        </div>
      </section>

      <section className="style-engine-recommendation-section">
        <div className="style-engine-section-heading">
          <span>02 — RECOMMENDATIONS</span>
          <h2>Curated for you.</h2>
          <p>
            Recommendations generated by the FASHNOVA Style Engine.
          </p>
        </div>

       {error && (
  <div className="style-engine-empty-state">
    <span>STYLE ENGINE</span>
    <h3>Unable to generate recommendations.</h3>
    <p>{error}</p>
  </div>
)}

{!error && recommendations.length === 0 && (
  <div className="style-engine-empty-state">
    <span>STYLE ENGINE</span>

    <h3>Your recommendations will appear here.</h3>

    <p>
      FASHNOVA will combine your profile, fashion vision,
      trend intelligence, and request context to rank the
      most relevant styles.
    </p>
  </div>
)}

{recommendations.length > 0 && (
  <div className="style-engine-results">
    {recommendations.map((recommendation) => (
      <article
        key={recommendation.candidateId}
        className="style-engine-result-card"
      >
        <span>#{recommendation.rank}</span>

        <h3>{recommendation.candidateName}</h3>

        <strong>
          Score: {Number(recommendation.score).toFixed(1)}
        </strong>

        <p>
          {recommendation.reasons?.join(" ") ||
            "Recommended based on your current style context."}
        </p>

        <small>
          Confidence: {recommendation.confidence}
        </small>
      </article>
    ))}
  </div>
)}
      </section>
    </main>
  );
}

export default StyleEngine;