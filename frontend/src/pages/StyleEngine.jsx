import { Link } from "react-router-dom";
import { useState } from "react";
import "./StyleEngine.css";

function StyleEngine() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --------------------------------------------------------------
  // Recommendation context
  // --------------------------------------------------------------

  const [occasion, setOccasion] = useState("everyday");
  const [season, setSeason] = useState(null);
  const [aesthetic, setAesthetic] = useState(null);
  const [topK, setTopK] = useState(5);

  // --------------------------------------------------------------
  // Generate recommendations
  // --------------------------------------------------------------

  const handleGetRecommendations = async () => {
    setLoading(true);
    setError("");
    setRecommendations([]);

    try {
      const response = await fetch(
        "http://localhost:5000/api/style-engine/recommend",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userContext: {},
            visionContext: {},
            trendContext: {},
            requestContext: {
              occasion,
              season,
              aesthetic,
            },
            candidates: [],
            top_k: topK,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to generate recommendations."
        );
      }

      setRecommendations(data.recommendations || []);
    } catch (err) {
      setError(
        err.message || "Something went wrong while generating recommendations."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="style-engine-page">
      {/* ============================================================
          NAVIGATION
      ============================================================ */}

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

      {/* ============================================================
          HERO
      ============================================================ */}

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

      {/* ============================================================
          CONTEXT
      ============================================================ */}

      <section className="style-engine-context-section">
        <div className="style-engine-section-heading">
          <span>01 — CONTEXT</span>

          <h2>Tell FASHNOVA what you're looking for.</h2>

          <p>
            Your request becomes part of the recommendation context.
          </p>
        </div>

        <div className="style-engine-context-grid">
          {/* OCCASION */}

          <div className="style-engine-context-card">
            <span>OCCASION</span>

            <select
              value={occasion}
              onChange={(event) => setOccasion(event.target.value)}
            >
              <option value="everyday">Everyday</option>
              <option value="work">Work</option>
              <option value="formal">Formal</option>
              <option value="party">Party</option>
              <option value="casual">Casual</option>
            </select>
          </div>

          {/* SEASON */}

          <div className="style-engine-context-card">
            <span>SEASON</span>

            <select
              value={season ?? ""}
              onChange={(event) =>
                setSeason(event.target.value || null)
              }
            >
              <option value="">All Seasons</option>
              <option value="Spring">Spring</option>
              <option value="Summer">Summer</option>
              <option value="Autumn">Autumn</option>
              <option value="Winter">Winter</option>
            </select>
          </div>

          {/* STYLE */}

          <div className="style-engine-context-card">
            <span>STYLE</span>

            <select
              value={aesthetic ?? ""}
              onChange={(event) =>
                setAesthetic(event.target.value || null)
              }
            >
              <option value="">Any Style</option>
              <option value="Casual">Casual</option>
              <option value="Formal">Formal</option>
              <option value="Streetwear">Streetwear</option>
              <option value="Minimal">Minimal</option>
              <option value="Party">Party</option>
            </select>
          </div>

          {/* LIMIT */}

          <div className="style-engine-context-card">
            <span>LIMIT</span>

            <select
              value={topK}
              onChange={(event) =>
                setTopK(Number(event.target.value))
              }
            >
              <option value={3}>Top 3</option>
              <option value={5}>Top 5</option>
              <option value={10}>Top 10</option>
            </select>
          </div>
        </div>
      </section>

      {/* ============================================================
          RECOMMENDATIONS
      ============================================================ */}

      <section className="style-engine-recommendation-section">
        <div className="style-engine-section-heading">
          <span>02 — RECOMMENDATIONS</span>

          <h2>Curated for you.</h2>

          <p>
            Recommendations generated by the FASHNOVA Style Engine.
          </p>
        </div>

        {/* ERROR */}

        {error && (
          <div className="style-engine-empty-state">
            <span>STYLE ENGINE</span>

            <h3>Unable to generate recommendations.</h3>

            <p>{error}</p>
          </div>
        )}

        {/* INITIAL STATE */}

        {!error &&
          recommendations.length === 0 &&
          !loading && (
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

        {/* LOADING */}

        {loading && (
          <div className="style-engine-empty-state">
            <span>STYLE ENGINE</span>

            <h3>Analyzing your style...</h3>

            <p>
              FASHNOVA is evaluating available fashion candidates.
            </p>
          </div>
        )}

        {/* RESULTS */}

        {recommendations.length > 0 && (
          <div className="style-engine-results">
            {recommendations.map((recommendation, index) => (
              <article
                key={
                  recommendation.candidate_id ??
                  recommendation.candidateId ??
                  index
                }
                className="style-engine-result-card"
              >
                <span>
                  #
                  {recommendation.rank ??
                    recommendation.rank_index ??
                    index + 1}
                </span>

                <h3>
                  {recommendation.name ??
                    recommendation.candidateName ??
                    recommendation.candidate_name ??
                    "Fashion Item"}
                </h3>

                <strong>
                  Score:{" "}
                  {Number(recommendation.score ?? 0).toFixed(1)}
                </strong>

                {recommendation.reasons?.length > 0 && (
                  <p>
                    {recommendation.reasons.join(" ")}
                  </p>
                )}

                {recommendation.reasons?.length === 0 &&
                  recommendation.reason && (
                    <p>{recommendation.reason}</p>
                  )}

                <small>
                  Confidence:{" "}
                  {recommendation.confidence ?? "N/A"}
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