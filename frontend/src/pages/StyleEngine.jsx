import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./StyleEngine.css";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/useAuth";
import { getStyleRecommendations } from "../services/api";

const OCCASION_TABS = [
  { key: "ALL", label: "All Outfits", icon: "✨" },
  { key: "EVERYDAY", label: "Everyday & Casual", icon: "☕" },
  { key: "FESTIVE", label: "Festive & Weddings", icon: "🪔" },
  { key: "FUNCTION", label: "Function & Party", icon: "🍸" },
  { key: "WORK", label: "Smart Work & Campus", icon: "💼" },
  { key: "BRUNCH", label: "Weekend Brunch", icon: "🌿" },
];

function StyleEngine() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("ALL");
  const [selectedEnsemble, setSelectedEnsemble] = useState(null);

  // Quick filters
  const [seasonFilter, setSeasonFilter] = useState("ALL");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const fetchRecommendations = async (occasionKey = "everyday") => {
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
          occasion: occasionKey === "ALL" ? "everyday" : occasionKey.toLowerCase(),
        },
        candidates: [],
        top_k: 12,
      });

      setRecommendations(data.recommendations || []);
    } catch (err) {
      setError(
        err.message || "Something went wrong while generating recommendations."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations("everyday");
  }, [user]);

  const handleTabChange = (key) => {
    setActiveTab(key);
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

  // Filter recommendations based on active occasion tab & season
  const filteredRecommendations = recommendations.filter((r) => {
    // 1. Season filter
    if (seasonFilter !== "ALL") {
      const candSeasons = (r.seasons || [r.season || ""]).map((s) => s.toUpperCase());
      if (!candSeasons.some((s) => s.includes(seasonFilter) || s.includes("ALL-SEASON"))) {
        return false;
      }
    }

    // 2. Occasion Tab filter
    if (activeTab === "ALL") return true;

    const category = (r.category || "").toUpperCase();
    const occasion = (r.occasion || "").toUpperCase();
    const occasions = (r.occasions || []).map((o) => o.toUpperCase());
    const subCategory = (r.subCategory || "").toUpperCase();

    if (activeTab === "EVERYDAY") {
      return (
        category.includes("EVERYDAY") ||
        category.includes("CASUAL") ||
        occasion.includes("EVERYDAY") ||
        occasions.some((o) => o.includes("EVERYDAY") || o.includes("CASUAL") || o.includes("COLLEGE")) ||
        subCategory.includes("COLLEGE") ||
        subCategory.includes("COFFEE") ||
        subCategory.includes("STREET")
      );
    }

    if (activeTab === "FESTIVE") {
      return (
        category.includes("FESTIVE") ||
        category.includes("TRADITIONAL") ||
        occasion.includes("FESTIVE") ||
        occasions.some((o) => o.includes("FESTIVE") || o.includes("TRADITIONAL") || o.includes("WEDDING")) ||
        subCategory.includes("DIWALI") ||
        subCategory.includes("EID") ||
        subCategory.includes("HALDI") ||
        subCategory.includes("SANGEET")
      );
    }

    if (activeTab === "FUNCTION") {
      return (
        category.includes("FUNCTION") ||
        category.includes("PARTY") ||
        occasion.includes("FUNCTION") ||
        occasion.includes("PARTY") ||
        occasions.some((o) => o.includes("FUNCTION") || o.includes("PARTY") || o.includes("FORMAL") || o.includes("COCKTAIL")) ||
        subCategory.includes("COCKTAIL") ||
        subCategory.includes("RECEPTION") ||
        subCategory.includes("BLACK TIE") ||
        subCategory.includes("GALA")
      );
    }

    if (activeTab === "WORK") {
      return (
        category.includes("WORK") ||
        occasion.includes("WORK") ||
        occasions.some((o) => o.includes("WORK") || o.includes("COLLEGE")) ||
        subCategory.includes("OFFICE") ||
        subCategory.includes("EXECUTIVE") ||
        subCategory.includes("CAMPUS")
      );
    }

    if (activeTab === "BRUNCH") {
      return (
        category.includes("BRUNCH") ||
        category.includes("RESORT") ||
        subCategory.includes("BRUNCH") ||
        subCategory.includes("VACATION")
      );
    }

    return true;
  });

  // Helper to extract a short, clean formula (e.g. "Baby Tee + Camel Blazer + Wide-Leg Denim + Sneakers")
  const getOutfitFormula = (pieces) => {
    if (!pieces) return null;
    const parts = [];
    if (pieces.dress) {
      parts.push(pieces.dress.split(" with ")[0]);
    } else if (pieces.top) {
      parts.push(pieces.top.split(" with ")[0]);
    }
    if (pieces.outerwear) {
      parts.push(pieces.outerwear.split(" with ")[0]);
    }
    if (pieces.bottom) {
      parts.push(pieces.bottom.split(" with ")[0]);
    }
    if (pieces.footwear) {
      parts.push(pieces.footwear.split(" with ")[0]);
    }
    return parts.slice(0, 4).join("  ·  ");
  };

  return (
    <main className="style-engine-page">
      <Navbar />

      {/* ============================================================
          CLEAN, COMPACT HERO & OCCASION TABS
      ============================================================ */}
      <section className="se-header">
        <div className="se-header-content">
          <span className="se-eyebrow">✦ OUTFIT INTELLIGENCE</span>
          <h1>Curated Outfits, Made Simple.</h1>
          <p>
            Complete head-to-toe coordinated looks designed for your everyday routines,
            festive celebrations, and evening functions.
          </p>

          {isAuthenticated && user?.preferences && (
            <div className="se-profile-pill">
              <span className="se-pill-dot" />
              Tuned to your preferences
              {user.preferences.preferredStyles?.length
                ? ` (${user.preferences.preferredStyles.slice(0, 2).join(", ")})`
                : ""}
            </div>
          )}
        </div>

        {/* Occasion Tabs Bar */}
        <div className="se-tabs-bar">
          <div className="se-tabs-scroll">
            {OCCASION_TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                className={`se-tab ${activeTab === tab.key ? "active" : ""}`}
                onClick={() => handleTabChange(tab.key)}
              >
                <span className="se-tab-icon">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="se-filter-actions">
            <button
              type="button"
              className={`se-filter-toggle ${showAdvanced ? "active" : ""}`}
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <span>Filters</span>
              <small>{showAdvanced ? "▲" : "▼"}</small>
            </button>
          </div>
        </div>

        {/* Optional Collapsible Filter Bar */}
        {showAdvanced && (
          <div className="se-advanced-bar">
            <div className="se-adv-group">
              <label>Season</label>
              <select
                value={seasonFilter}
                onChange={(e) => setSeasonFilter(e.target.value)}
              >
                <option value="ALL">All Seasons</option>
                <option value="SPRING">Spring</option>
                <option value="SUMMER">Summer</option>
                <option value="AUTUMN">Autumn</option>
                <option value="WINTER">Winter</option>
              </select>
            </div>

            <div className="se-adv-meta">
              <span>Showing {filteredRecommendations.length} curated ensembles</span>
            </div>
          </div>
        )}
      </section>

      {/* ============================================================
          CURATED OUTFITS GRID (COMPACT, EDITORIAL, VISUAL-FORWARD)
      ============================================================ */}
      <section className="se-grid-section">
        {loading && (
          <div className="se-loading-state">
            <div className="se-spinner" />
            <p>Curating your personalized outfit ensembles...</p>
          </div>
        )}

        {error && (
          <div className="se-empty-card">
            <h3>Unable to load recommendations</h3>
            <p>{error}</p>
            <button
              type="button"
              className="se-primary-btn"
              onClick={() => fetchRecommendations(activeTab)}
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && filteredRecommendations.length === 0 && (
          <div className="se-empty-card">
            <h3>No outfits found</h3>
            <p>Try switching to "All Outfits" or reset the season filter.</p>
            <button
              type="button"
              className="se-primary-btn"
              onClick={() => {
                setActiveTab("ALL");
                setSeasonFilter("ALL");
              }}
            >
              View All Outfits
            </button>
          </div>
        )}

        {!loading && filteredRecommendations.length > 0 && (
          <div className="se-cards-grid">
            {filteredRecommendations.map((look, index) => {
              const imageUrl = look.imageUrl
                ? (look.imageUrl.startsWith("http")
                    ? look.imageUrl
                    : look.imageUrl.startsWith("/")
                      ? look.imageUrl
                      : `${import.meta.env.VITE_API_BASE_URL?.replace(/\/api$/, "") || "http://localhost:5000"}${look.imageUrl}`)
                : "/fashion/outfit-everyday-denim.jpg";

              const formula = getOutfitFormula(look.outfitPieces);

              return (
                <article key={look.candidateId ?? index} className="se-card">
                  {/* Photo Frame */}
                  <div
                    className="se-card-media"
                    onClick={() => setSelectedEnsemble(look)}
                    title="Click to inspect complete outfit"
                  >
                    <img src={imageUrl} alt={look.name} loading="lazy" />

                    {/* Floating Badges */}
                    <div className="se-media-badges">
                      {look.origin && (
                        <span className="se-origin-badge">
                          {look.origin.split("·")[0].trim()}
                        </span>
                      )}
                      <span className="se-score-badge">
                        {Math.round(look.score ?? 95)}% Match
                      </span>
                    </div>

                    <div className="se-media-hover">
                      <span>Quick View ↗</span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="se-card-body">
                    <div className="se-card-meta">
                      <span className="se-category-tag">{look.category}</span>
                      <span className="se-occasion-tag">{look.occasion || "Everyday"}</span>
                    </div>

                    <h3
                      className="se-card-title"
                      onClick={() => setSelectedEnsemble(look)}
                    >
                      {look.name}
                    </h3>

                    {/* Compact Outfit Formula */}
                    {formula && (
                      <p className="se-card-formula" title={formula}>
                        {formula}
                      </p>
                    )}

                    {/* Palette Dots */}
                    {look.palette && look.palette.length > 0 && (
                      <div className="se-palette-row">
                        <div className="se-dots">
                          {look.palette.map((p, i) => (
                            <span
                              key={i}
                              className="se-dot"
                              style={{ backgroundColor: p.hex }}
                              title={`${p.name} (${p.hex})`}
                            />
                          ))}
                        </div>
                        <span className="se-color-name">
                          {look.colors?.[0] || ""}
                        </span>
                      </div>
                    )}

                    {/* Card Actions */}
                    <div className="se-card-actions">
                      <button
                        type="button"
                        className="se-inspect-btn"
                        onClick={() => setSelectedEnsemble(look)}
                      >
                        Explore Look ↗
                      </button>

                      <button
                        type="button"
                        className="se-studio-btn"
                        onClick={() => handleRecreateInStudio(look)}
                        title="Recreate this design in Studio"
                      >
                        Studio ✦
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* ============================================================
          IN-DEPTH OUTFIT INSPECTION MODAL ("Explore Look")
      ============================================================ */}
      {selectedEnsemble && (
        <div
          className="se-modal-backdrop"
          onClick={() => setSelectedEnsemble(null)}
        >
          <div
            className="se-modal-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="se-modal-close"
              onClick={() => setSelectedEnsemble(null)}
              aria-label="Close"
            >
              ✕
            </button>

            <div className="se-modal-grid">
              {/* Left Photo */}
              <div className="se-modal-image-col">
                <img
                  src={selectedEnsemble.imageUrl || "/fashion/outfit-everyday-denim.jpg"}
                  alt={selectedEnsemble.name}
                />
                <span className="se-modal-tag">
                  {selectedEnsemble.origin || "Global Style Collection"}
                </span>
              </div>

              {/* Right Content */}
              <div className="se-modal-content-col">
                <div className="se-modal-eyebrow">
                  <span>{selectedEnsemble.category}</span>
                  <strong className="se-modal-match">
                    {Math.round(selectedEnsemble.score ?? 96)}% Style Match
                  </strong>
                </div>

                <h2>{selectedEnsemble.name}</h2>

                {/* Specs Pills */}
                <div className="se-modal-specs">
                  {selectedEnsemble.silhouette && (
                    <span className="se-spec-pill">
                      <strong>Silhouette:</strong> {selectedEnsemble.silhouette}
                    </span>
                  )}
                  {selectedEnsemble.fabric && (
                    <span className="se-spec-pill">
                      <strong>Fabric:</strong> {selectedEnsemble.fabric}
                    </span>
                  )}
                  {selectedEnsemble.season && (
                    <span className="se-spec-pill">
                      <strong>Season:</strong> {selectedEnsemble.season}
                    </span>
                  )}
                </div>

                {/* Complete Head-to-Toe Breakdown */}
                {selectedEnsemble.outfitPieces && (
                  <div className="se-modal-pieces">
                    <span className="se-modal-section-title">
                      HEAD-TO-TOE COORDINATES
                    </span>
                    <ul className="se-pieces-list">
                      {Object.entries(selectedEnsemble.outfitPieces).map(([key, val]) => (
                        <li key={key}>
                          <strong>{key.replace(/_/g, " ").toUpperCase()}:</strong>
                          <span>{val}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Palette */}
                {selectedEnsemble.palette && selectedEnsemble.palette.length > 0 && (
                  <div className="se-modal-palette">
                    <span className="se-modal-section-title">COLOR HARMONY</span>
                    <div className="se-palette-chips">
                      {selectedEnsemble.palette.map((p, idx) => (
                        <div key={idx} className="se-palette-chip">
                          <span
                            className="se-chip-swatch"
                            style={{ backgroundColor: p.hex }}
                          />
                          <small>{p.name}</small>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stylist Advice */}
                {selectedEnsemble.stylingAdvice && (
                  <div className="se-modal-advice">
                    <span className="se-modal-section-title">STYLIST ADVICE</span>
                    <p>{selectedEnsemble.stylingAdvice}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="se-modal-actions">
                  <button
                    type="button"
                    className="se-modal-primary-btn"
                    onClick={() => handleRecreateInStudio(selectedEnsemble)}
                  >
                    Recreate in AI Studio ✦
                  </button>
                  <button
                    type="button"
                    className="se-modal-secondary-btn"
                    onClick={() => setSelectedEnsemble(null)}
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default StyleEngine;
