import { Link } from "react-router-dom";
import { useState } from "react";
import "./StyleEngine.css";
import { useAuth } from "../context/useAuth";
import { getStyleRecommendations } from "../services/api";

function StyleEngine() {
  const { user, isAuthenticated } = useAuth();

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userContextApplied, setUserContextApplied] = useState(false);

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
      const data = await getStyleRecommendations({
        userContext: user?.preferences
          ? {
              user_id: user.id,
              preferred_colors: user.preferences.preferredColors || [],
              preferred_categories: user.preferences.preferredCategories || [],
              preferred_styles: user.preferences.preferredStyles || [],
              preferred_aesthetics: user.preferences.preferredStyles || [],
            }
          : {},
        visionContext: { enabled: false },
        trendContext: { enabled: true },
        requestContext: {
          occasion,
          season,
          aesthetic,
        },
        candidates: [],
        top_k: topK,
      });

      setRecommendations(data.recommendations || []);
      setUserContextApplied(Boolean(data.userContextApplied));
    } catch (err) {
      setError(
        err.message || "Something went wrong while generating recommendations."
      );
    } finally {
      setLoading(false);
    }
  };

  const userGreeting = user?.profile?.firstName?.toUpperCase() || "PROFILE";

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
          <Link to="/style-engine" style={{ color: "#3b1027", fontWeight: 700 }}>STYLE ENGINE</Link>
          <Link to="/profile">
            {isAuthenticated ? userGreeting : "SIGN IN"}
          </Link>
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

          {isAuthenticated && user?.preferences && (
            <div className="style-engine-auth-badge">
              <span className="auth-badge-dot"></span>
              Personalizing with your saved preferences
              {user.preferences.preferredStyles?.length ? ` (${user.preferences.preferredStyles.join(", ")})` : ""}
            </div>
          )}
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

          {userContextApplied && (
            <div className="style-engine-auth-badge">
              ✓ Tailored using your fashion profile & color preferences
            </div>
          )}
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
              FASHNOVA is evaluating available fashion candidates with hybrid scoring.
            </p>
          </div>
        )}

        {/* RESULTS */}

        {recommendations.length > 0 && (
          <div className="style-engine-results">
            {recommendations.map((recommendation, index) => {
              const imageUrl = recommendation.imageUrl
                ? (recommendation.imageUrl.startsWith("http")
                    ? recommendation.imageUrl
                    : `http://localhost:5000${recommendation.imageUrl}`)
                : null;

              const breakdown = recommendation.score_breakdown || recommendation.scoreBreakdown;

              return (
                <article
                  key={
                    recommendation.candidate_id ??
                    recommendation.candidateId ??
                    index
                  }
                  className="style-engine-result-card"
                >
                  <div className="style-engine-card-topbar">
                    <span>
                      #
                      {recommendation.rank ??
                        recommendation.rank_index ??
                        index + 1}
                    </span>

                    {recommendation.confidence && (
                      <span className="style-engine-confidence-pill">
                        {recommendation.confidence} confidence
                      </span>
                    )}
                  </div>

                  {imageUrl && (
                    <div className="style-engine-candidate-media">
                      <img
                        src={imageUrl}
                        alt={
                          recommendation.name ??
                          recommendation.candidateName ??
                          "Fashion item"
                        }
                        className="style-engine-candidate-img"
                        loading="lazy"
                      />
                    </div>
                  )}

                  <h3>
                    {recommendation.name ??
                      recommendation.candidateName ??
                      recommendation.candidate_name ??
                      "Fashion Item"}
                  </h3>

                  <strong>
                    Match Score:{" "}
                    {Number(recommendation.score ?? 0).toFixed(1)} / 100
                  </strong>

                  <div className="style-engine-tags">
                    {recommendation.articleType && (
                      <span className="style-engine-tag">{recommendation.articleType}</span>
                    )}
                    {recommendation.category && (
                      <span className="style-engine-tag">{recommendation.category}</span>
                    )}
                    {recommendation.color && (
                      <span className="style-engine-tag">{recommendation.color}</span>
                    )}
                    {recommendation.season && (
                      <span className="style-engine-tag">{recommendation.season}</span>
                    )}
                  </div>

                  {recommendation.reasons?.length > 0 && (
                    <p className="style-engine-reasons">
                      {recommendation.reasons.join(" ")}
                    </p>
                  )}

                  {recommendation.reasons?.length === 0 &&
                    recommendation.reason && (
                      <p className="style-engine-reasons">{recommendation.reason}</p>
                    )}

                  {breakdown && (
                    <div className="style-engine-breakdown">
                      {breakdown.color_compatibility != null && (
                        <div className="breakdown-bar-item">
                          <span>Color Harmony</span>
                          <div className="breakdown-bar">
                            <div
                              className="breakdown-bar-fill"
                              style={{ width: `${Math.round((breakdown.color_compatibility || 0) * 100)}%` }}
                            />
                          </div>
                        </div>
                      )}
                      {breakdown.season_compatibility != null && (
                        <div className="breakdown-bar-item">
                          <span>Seasonal Fit</span>
                          <div className="breakdown-bar">
                            <div
                              className="breakdown-bar-fill"
                              style={{ width: `${Math.round((breakdown.season_compatibility || 0) * 100)}%` }}
                            />
                          </div>
                        </div>
                      )}
                      {breakdown.trend_relevance != null && (
                        <div className="breakdown-bar-item">
                          <span>Trend Affinity</span>
                          <div className="breakdown-bar">
                            <div
                              className="breakdown-bar-fill"
                              style={{ width: `${Math.round((breakdown.trend_relevance || 0) * 100)}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default StyleEngine;
