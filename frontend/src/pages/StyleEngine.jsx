import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./StyleEngine.css";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/useAuth";
import { getStyleRecommendations } from "../services/api";

const OUTFIT_FILTER_PILLS = [
  { key: "ALL", label: "ALL OUTFIT STYLES" },
  { key: "EVERYDAY", label: "☕ EVERYDAY & CASUAL" },
  { key: "FESTIVE", label: "🪔 FESTIVE & TRADITIONAL" },
  { key: "FUNCTION", label: "🍸 FUNCTION & PARTY" },
  { key: "WORK", label: "💼 SMART WORK & COLLEGE" },
  { key: "BRUNCH", label: "🌿 WEEKEND BRUNCH & RESORT" },
];

function StyleEngine() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userContextApplied, setUserContextApplied] = useState(false);

  // Recommendation context filters
  const [occasion, setOccasion] = useState("everyday");
  const [season, setSeason] = useState(null);
  const [aesthetic, setAesthetic] = useState(null);
  const [topK, setTopK] = useState(12);
  const [activeCategoryPill, setActiveCategoryPill] = useState("ALL");
  const [selectedEnsemble, setSelectedEnsemble] = useState(null);

  const fetchRecommendations = async (customOccasion, customSeason, customAesthetic, customTopK) => {
    setLoading(true);
    setError("");

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
          occasion: customOccasion ?? occasion,
          season: customSeason ?? season,
          aesthetic: customAesthetic ?? aesthetic,
        },
        candidates: [],
        top_k: customTopK ?? topK,
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

  // Load recommendations automatically on mount
  useEffect(() => {
    fetchRecommendations("everyday", null, null, 12);
  }, [user]);

  const handleGetRecommendations = () => {
    fetchRecommendations(occasion, season, aesthetic, topK);
  };

  const handleRecreateInStudio = (look) => {
    navigate("/studio", {
      state: {
        presetPrompt: look.studioPrompt || look.name,
        garment: look.name,
        aesthetic: look.aesthetic,
        category: look.category,
      },
    });
  };

  const userGreeting = user?.profile?.firstName?.toUpperCase() || "PROFILE";

  const filteredRecommendations =
    activeCategoryPill === "ALL"
      ? recommendations
      : recommendations.filter((r) => {
          const pill = activeCategoryPill.toUpperCase();
          const category = (r.category || "").toUpperCase();
          const occasion = (r.occasion || "").toUpperCase();
          const occasions = (r.occasions || []).map((o) => o.toUpperCase());
          const subCategory = (r.subCategory || "").toUpperCase();
          const aesthetic = (r.aesthetic || "").toUpperCase();

          if (pill === "EVERYDAY") {
            return (
              category.includes("EVERYDAY") ||
              category.includes("CASUAL") ||
              occasion.includes("EVERYDAY") ||
              occasions.some(
                (o) =>
                  o.includes("EVERYDAY") ||
                  o.includes("CASUAL") ||
                  o.includes("COLLEGE")
              ) ||
              subCategory.includes("COLLEGE") ||
              subCategory.includes("COFFEE") ||
              subCategory.includes("STREET")
            );
          }
          if (pill === "FESTIVE") {
            return (
              category.includes("FESTIVE") ||
              category.includes("TRADITIONAL") ||
              occasion.includes("FESTIVE") ||
              occasions.some(
                (o) =>
                  o.includes("FESTIVE") ||
                  o.includes("TRADITIONAL") ||
                  o.includes("WEDDING")
              ) ||
              subCategory.includes("DIWALI") ||
              subCategory.includes("EID") ||
              subCategory.includes("HALDI") ||
              subCategory.includes("SANGEET") ||
              aesthetic.includes("TRADITIONAL")
            );
          }
          if (pill === "FUNCTION") {
            return (
              category.includes("FUNCTION") ||
              category.includes("PARTY") ||
              occasion.includes("FUNCTION") ||
              occasion.includes("PARTY") ||
              occasions.some(
                (o) =>
                  o.includes("FUNCTION") ||
                  o.includes("PARTY") ||
                  o.includes("FORMAL") ||
                  o.includes("COCKTAIL")
              ) ||
              subCategory.includes("COCKTAIL") ||
              subCategory.includes("RECEPTION") ||
              subCategory.includes("BLACK TIE") ||
              subCategory.includes("GALA")
            );
          }
          if (pill === "WORK") {
            return (
              category.includes("WORK") ||
              occasion.includes("WORK") ||
              occasions.some((o) => o.includes("WORK") || o.includes("COLLEGE")) ||
              subCategory.includes("OFFICE") ||
              subCategory.includes("EXECUTIVE") ||
              subCategory.includes("CAMPUS")
            );
          }
          if (pill === "BRUNCH") {
            return (
              category.includes("BRUNCH") ||
              category.includes("RESORT") ||
              subCategory.includes("BRUNCH") ||
              subCategory.includes("VACATION")
            );
          }
          return category.includes(pill) || aesthetic.includes(pill);
        });

  return (
    <main className="style-engine-page">
      {/* ============================================================
          NAVIGATION
      ============================================================ */}

      <Navbar />

      {/* ============================================================
          HERO
      ============================================================ */}

      <section className="style-engine-hero">
        <div className="style-engine-hero-content">
          <span className="style-engine-eyebrow">
            FRESH OUTFIT INSPIRATION & STYLING
          </span>

          <h1>
            Practical outfit ideas,
            <br />
            for every day & celebration.
          </h1>

          <p>
            Get curated head-to-toe outfits tailored for everyday college &amp;
            street chic, grand festive occasions, and evening party functions—complete
            with coordinated footwear, accessories, and stylist advice.
          </p>

          <button
            className="style-engine-primary-button"
            onClick={handleGetRecommendations}
            disabled={loading}
          >
            {loading ? "Synthesizing Outfits..." : "Generate Outfit Recommendations ↗"}
          </button>
        </div>

        <div className="style-engine-intelligence-card">
          <span>OUTFIT INTELLIGENCE PIPELINE</span>

          <div className="style-engine-flow">
            <div className="style-engine-flow-item">
              <strong>EVERYDAY CASUAL</strong>
              <small>College, coffee &amp; street chic</small>
            </div>

            <div className="style-engine-flow-line" />

            <div className="style-engine-flow-item">
              <strong>FESTIVE TRADITIONAL</strong>
              <small>Diwali, Eid, Haldi &amp; weddings</small>
            </div>

            <div className="style-engine-flow-line" />

            <div className="style-engine-flow-item">
              <strong>FUNCTION &amp; PARTY</strong>
              <small>Cocktails, receptions &amp; galas</small>
            </div>
          </div>

          <div className="style-engine-flow-result">
            <span>COMPLETE HEAD-TO-TOE COORDINATES</span>
            <strong>Top, bottom, shoes &amp; styling tips</strong>
          </div>
        </div>
      </section>

      {/* ============================================================
          CONTEXT
      ============================================================ */}

      <section className="style-engine-context-section">
        <div className="style-engine-section-heading">
          <span>01 — OCCASION &amp; STYLE CALIBRATION</span>

          <h2>Select your occasion to get instant outfit ideas.</h2>

          <p>
            Filter by everyday casual, festive celebrations, and evening functions to discover
            ready-to-wear coordinated outfits.
          </p>

          {isAuthenticated && user?.preferences && (
            <div className="style-engine-auth-badge">
              <span className="auth-badge-dot"></span>
              Personalized with your saved preferences
              {user.preferences.preferredStyles?.length
                ? ` (${user.preferences.preferredStyles.join(", ")})`
                : ""}
            </div>
          )}
        </div>

        <div className="style-engine-context-grid">
          {/* OCCASION */}
          <div className="style-engine-context-card">
            <span>OCCASION</span>

            <select
              value={occasion}
              onChange={(event) => {
                const val = event.target.value;
                setOccasion(val);
                fetchRecommendations(val, season, aesthetic, topK);
              }}
            >
              <option value="everyday">☕ Everyday &amp; College Casual</option>
              <option value="festive">🪔 Festive &amp; Traditional (Diwali, Eid, Weddings)</option>
              <option value="function">🍸 Function / Cocktail / Evening Party</option>
              <option value="work">💼 Smart Work &amp; Campus Presentations</option>
              <option value="brunch">🌿 Weekend Brunch &amp; Resort</option>
            </select>
          </div>

          {/* SEASON */}
          <div className="style-engine-context-card">
            <span>SEASON</span>

            <select
              value={season ?? ""}
              onChange={(event) => {
                const val = event.target.value || null;
                setSeason(val);
                fetchRecommendations(occasion, val, aesthetic, topK);
              }}
            >
              <option value="">All Seasons</option>
              <option value="Spring">Spring / Forward</option>
              <option value="Summer">Summer / High Sun</option>
              <option value="Autumn">Autumn / Tailoring</option>
              <option value="Winter">Winter / Layering</option>
            </select>
          </div>

          {/* STYLE */}
          <div className="style-engine-context-card">
            <span>AESTHETIC</span>

            <select
              value={aesthetic ?? ""}
              onChange={(event) => {
                const val = event.target.value || null;
                setAesthetic(val);
                fetchRecommendations(occasion, season, val, topK);
              }}
            >
              <option value="">All Aesthetics</option>
              <option value="Effortless Chic">Effortless Chic / Street Style</option>
              <option value="Traditional">Festive &amp; Traditional Craft</option>
              <option value="Party Glamour">Party Glamour &amp; Cocktail</option>
              <option value="Quiet Luxury">Quiet Luxury &amp; Tailoring</option>
              <option value="Streetwear">Urban &amp; K-Streetwear</option>
              <option value="Resort">Resort &amp; Brunch</option>
            </select>
          </div>

          {/* LIMIT */}
          <div className="style-engine-context-card">
            <span>OUTFIT COUNT</span>

            <select
              value={topK}
              onChange={(event) => {
                const val = Number(event.target.value);
                setTopK(val);
                fetchRecommendations(occasion, season, aesthetic, val);
              }}
            >
              <option value={6}>Top 6 Outfits</option>
              <option value={10}>Top 10 Outfits</option>
              <option value={12}>All 12 Outfits</option>
            </select>
          </div>
        </div>
      </section>

      {/* ============================================================
          RECOMMENDATIONS
      ============================================================ */}

      <section className="style-engine-recommendation-section">
        <div className="style-engine-section-heading">
          <span>02 — CURATED OUTFIT RECOMMENDATIONS</span>

          <h2>Coordinated outfits for functions, festivals &amp; everyday life.</h2>

          <p>
            Explore head-to-toe outfit ideas complete with top, bottom, layer, footwear, accessories, and stylist tips.
          </p>

          {userContextApplied && (
            <div className="style-engine-auth-badge">
              ✓ Tuned using your color harmony and silhouette preferences
            </div>
          )}
        </div>

        {/* Global Category Filter Pills */}
        <div className="style-engine-filter-pills">
          {OUTFIT_FILTER_PILLS.map((pill) => (
            <button
              key={pill.key}
              type="button"
              className={`style-engine-filter-pill ${
                activeCategoryPill === pill.key ? "active" : ""
              }`}
              onClick={() => setActiveCategoryPill(pill.key)}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* ERROR */}
        {error && (
          <div className="style-engine-empty-state">
            <span>STYLE ENGINE</span>
            <h3>Unable to generate recommendations.</h3>
            <p>{error}</p>
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="style-engine-empty-state">
            <span className="auth-badge-dot"></span>
            <h3>Synthesizing Global Ensembles...</h3>
            <p>
              Evaluating silhouette geometry, textile compatibility, and global runway momentum.
            </p>
          </div>
        )}

        {/* RESULTS GRID */}
        {!loading && filteredRecommendations.length > 0 && (
          <div className="style-engine-results">
            {filteredRecommendations.map((recommendation, index) => {
              const imageUrl = recommendation.imageUrl
                ? (recommendation.imageUrl.startsWith("http")
                    ? recommendation.imageUrl
                    : recommendation.imageUrl.startsWith("/")
                      ? recommendation.imageUrl
                      : `${import.meta.env.VITE_API_BASE_URL?.replace(/\/api$/, "") || "http://localhost:5000"}${recommendation.imageUrl}`)
                : "/fashion/runway-couture.jpg";

              const breakdown =
                recommendation.score_breakdown ||
                recommendation.scoreBreakdown ||
                {};
              const pieces = recommendation.outfitPieces || {};

              return (
                <article
                  key={recommendation.candidateId ?? index}
                  className="style-engine-result-card"
                >
                  {/* Top Bar with Rank, Confidence, and Origin */}
                  <div className="style-engine-card-topbar">
                    <div className="style-engine-rank-group">
                      <span className="style-engine-rank-badge">
                        #{recommendation.rank ?? index + 1}
                      </span>
                      {recommendation.origin && (
                        <span className="style-engine-origin-badge">
                          📍 {recommendation.origin}
                        </span>
                      )}
                    </div>

                    <span className="style-engine-confidence-pill">
                      {recommendation.confidence || "HIGH"} CONFIDENCE
                    </span>
                  </div>

                  {/* High-Res Media Frame */}
                  <div
                    className="style-engine-candidate-media"
                    onClick={() => setSelectedEnsemble(recommendation)}
                    title="Click to inspect full look"
                  >
                    <img
                      src={imageUrl}
                      alt={recommendation.name}
                      className="style-engine-candidate-img"
                      loading="lazy"
                    />
                    <div className="style-engine-media-overlay">
                      <span>INSPECT COMPLETE LOOK ↗</span>
                    </div>
                  </div>

                  {/* Header & Match Score */}
                  <div className="style-engine-card-header">
                    <div className="style-engine-category-row">
                      <span className="style-engine-category-tag">
                        {recommendation.category || "OUTFIT ENSEMBLE"}
                      </span>
                      <strong className="style-engine-score-tag">
                        {Number(recommendation.score ?? 95).toFixed(1)}% MATCH
                      </strong>
                    </div>

                    <h3
                      className="style-engine-outfit-title"
                      onClick={() => setSelectedEnsemble(recommendation)}
                    >
                      {recommendation.name}
                    </h3>
                  </div>

                  {/* Silhouette and Fabric Specs */}
                  <div className="style-engine-specs-row">
                    {recommendation.silhouette && (
                      <span className="style-engine-spec-pill">
                        <strong>Cut:</strong> {recommendation.silhouette}
                      </span>
                    )}
                    {recommendation.fabric && (
                      <span className="style-engine-spec-pill">
                        <strong>Textile:</strong> {recommendation.fabric.split("&")[0]}
                      </span>
                    )}
                  </div>

                  {/* Coordinated Outfit Pieces Breakdown */}
                  {pieces && Object.keys(pieces).length > 0 && (
                    <div className="style-engine-pieces-box">
                      <div className="style-engine-pieces-title">
                        <span>HEAD-TO-TOE COORDINATES</span>
                      </div>
                      <ul className="style-engine-pieces-list">
                        {(pieces.top || pieces.dress) && (
                          <li>
                            <strong>Top / Dress:</strong> {pieces.dress || pieces.top}
                          </li>
                        )}
                        {pieces.outerwear && (
                          <li>
                            <strong>Layer:</strong> {pieces.outerwear}
                          </li>
                        )}
                        {pieces.bottom && (
                          <li>
                            <strong>Bottom:</strong> {pieces.bottom}
                          </li>
                        )}
                        {pieces.footwear && (
                          <li>
                            <strong>Footwear:</strong> {pieces.footwear}
                          </li>
                        )}
                        {pieces.accessories && (
                          <li>
                            <strong>Accessories:</strong> {pieces.accessories}
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Color Harmony Swatches */}
                  {recommendation.palette && recommendation.palette.length > 0 && (
                    <div className="style-engine-palette-row">
                      <span className="palette-label">Palette:</span>
                      <div className="palette-dots">
                        {recommendation.palette.map((swatch, i) => (
                          <span
                            key={i}
                            className="palette-swatch-dot"
                            style={{ backgroundColor: swatch.hex }}
                            title={`${swatch.name} (${swatch.hex})`}
                          />
                        ))}
                      </div>
                      <span className="palette-color-names">
                        {recommendation.colors?.[0] || ""}
                      </span>
                    </div>
                  )}

                  {/* Stylist Rationale */}
                  {recommendation.reasons?.length > 0 && (
                    <div className="style-engine-rationale-box">
                      <p>{recommendation.reasons[0]}</p>
                    </div>
                  )}

                  {/* Score Breakdown Bars */}
                  {breakdown && (
                    <div className="style-engine-breakdown">
                      {breakdown.color_compatibility != null && (
                        <div className="breakdown-bar-item">
                          <span>Color Harmony</span>
                          <div className="breakdown-bar">
                            <div
                              className="breakdown-bar-fill"
                              style={{
                                width: `${Math.round(
                                  (breakdown.color_compatibility || 0.9) * 100
                                )}%`,
                              }}
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
                              style={{
                                width: `${Math.round(
                                  (breakdown.season_compatibility || 0.9) * 100
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}
                      {breakdown.trend_relevance != null && (
                        <div className="breakdown-bar-item">
                          <span>Trend Momentum</span>
                          <div className="breakdown-bar">
                            <div
                              className="breakdown-bar-fill"
                              style={{
                                width: `${Math.round(
                                  (breakdown.trend_relevance || 0.95) * 100
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Card Action Buttons */}
                  <div className="style-engine-card-actions">
                    <button
                      type="button"
                      className="style-engine-recreate-btn"
                      onClick={() => handleRecreateInStudio(recommendation)}
                      title="Recreate this outfit in Studio"
                    >
                      Recreate in Studio ✦
                    </button>

                    <button
                      type="button"
                      className="style-engine-inspect-btn"
                      onClick={() => setSelectedEnsemble(recommendation)}
                    >
                      Inspect Look ↗
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Empty state when no filtered items */}
        {!loading && !error && filteredRecommendations.length === 0 && (
          <div className="style-engine-empty-state">
            <span>FASHNOVA STYLE ENGINE</span>
            <h3>No outfits found in this category.</h3>
            <p>
              Switch back to "ALL OUTFIT STYLES" to view complete outfits across Everyday, Festive, and Function occasions.
            </p>
          </div>
        )}

        {/* Full Ensemble Inspection Modal */}
        {selectedEnsemble && (
          <div
            className="style-engine-modal-backdrop"
            onClick={() => setSelectedEnsemble(null)}
          >
            <div
              className="style-engine-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="style-engine-modal-close"
                onClick={() => setSelectedEnsemble(null)}
              >
                ✕
              </button>

              <div className="style-engine-modal-grid">
                {/* Left Photo */}
                <div className="style-engine-modal-image-col">
                  <img
                    src={selectedEnsemble.imageUrl || "/fashion/runway-couture.jpg"}
                    alt={selectedEnsemble.name}
                  />
                  {selectedEnsemble.origin && (
                    <span className="style-engine-modal-origin">
                      📍 {selectedEnsemble.origin}
                    </span>
                  )}
                </div>

                {/* Right Details */}
                <div className="style-engine-modal-info-col">
                  <div className="modal-category-row">
                    <span>{selectedEnsemble.category}</span>
                    <strong>{Number(selectedEnsemble.score ?? 96).toFixed(1)}% MATCH</strong>
                  </div>

                  <h3>{selectedEnsemble.name}</h3>

                  <div className="modal-specs-grid">
                    <div>
                      <span>SILHOUETTE</span>
                      <strong>{selectedEnsemble.silhouette || "Sculptural"}</strong>
                    </div>
                    <div>
                      <span>TEXTILE</span>
                      <strong>{selectedEnsemble.fabric || "Pure Silk & Wool"}</strong>
                    </div>
                    <div>
                      <span>OCCASION</span>
                      <strong>{selectedEnsemble.occasion || "Formal"}</strong>
                    </div>
                    <div>
                      <span>SEASON</span>
                      <strong>{selectedEnsemble.season || "All-Season"}</strong>
                    </div>
                  </div>

                  {/* Coordinated Outfit Items */}
                  {selectedEnsemble.outfitPieces && (
                    <div className="modal-pieces-box">
                      <span>COMPLETE HEAD-TO-TOE OUTFIT SPECIFICATION</span>
                      <ul>
                        {Object.entries(selectedEnsemble.outfitPieces).map(([key, val]) => (
                          <li key={key}>
                            <strong>{key.replace(/_/g, " ").toUpperCase()}:</strong> {val}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Color Harmony */}
                  {selectedEnsemble.palette && (
                    <div className="modal-palette-box">
                      <span>COLOR HARMONY PALETTE</span>
                      <div className="modal-palette-chips">
                        {selectedEnsemble.palette.map((p, idx) => (
                          <div key={idx} className="modal-palette-chip">
                            <span
                              className="modal-swatch-dot"
                              style={{ backgroundColor: p.hex }}
                            />
                            <small>{p.name} ({p.hex})</small>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Stylist Advice */}
                  {selectedEnsemble.stylingAdvice && (
                    <div className="modal-advice-box">
                      <span>EDITORIAL STYLING ADVICE</span>
                      <p>{selectedEnsemble.stylingAdvice}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="modal-action-row">
                    <button
                      type="button"
                      className="modal-studio-btn"
                      onClick={() => handleRecreateInStudio(selectedEnsemble)}
                    >
                      RECREATE OUTFIT IN STUDIO ↗
                    </button>
                    <button
                      type="button"
                      className="modal-close-btn"
                      onClick={() => setSelectedEnsemble(null)}
                    >
                      CLOSE
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default StyleEngine;
