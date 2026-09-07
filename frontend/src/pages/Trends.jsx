
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";

const API_URL = "http://localhost:5000";

function Trends() {
  const [trendData, setTrendData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");

  useEffect(() => {
    const loadTrends = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/api/trends/analyze`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            horizon: 2,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to load trend intelligence.");
        }

        const data = await response.json();

        if (data.status !== "success" || !data.attributes) {
          throw new Error("Invalid trend response.");
        }

        setTrendData(data);
      } catch (err) {
        console.error("Trends frontend error:", err);

        setError(
          "Trend intelligence is currently unavailable. Please make sure the FASHNOVA backend and Trends ML service are running."
        );
      } finally {
        setLoading(false);
      }
    };

    loadTrends();
  }, []);

  const attributes = trendData?.attributes || {};

  const baseColours = attributes.baseColour?.current_trends || [];
  const articleTypes = attributes.articleType?.current_trends || [];
  const subCategories = attributes.subCategory?.current_trends || [];

  const forecasts = [
    ...(attributes.baseColour?.forecasts || []),
    ...(attributes.articleType?.forecasts || []),
    ...(attributes.subCategory?.forecasts || []),
  ];

  const getName = (item) =>
    item?.attribute_value ||
    item?.baseColour ||
    item?.articleType ||
    item?.subCategory ||
    item?.value ||
    item?.name ||
    item?.category ||
    "Unknown";

  const getDirection = (value) => {
    const number = Number(value);

    if (!Number.isFinite(number)) {
      return "STABLE";
    }

    if (number > 0.01) {
      return "RISING";
    }

    if (number < -0.01) {
      return "DECLINING";
    }

    return "STABLE";
  };

  const getArrow = (value) => {
    const direction = getDirection(value);

    if (direction === "RISING") {
      return "↗";
    }

    if (direction === "DECLINING") {
      return "↘";
    }

    return "→";
  };

  const formatPercentage = (value) => {
    if (value === null || value === undefined) {
      return "—";
    }

    return `${(Number(value) * 100).toFixed(2)}%`;
  };

  const formatScore = (value) => {
    if (value === null || value === undefined) {
      return "—";
    }

    return Number(value).toFixed(1);
  };

  const allTrends = useMemo(() => {
    const color = baseColours.map((item) => ({
      ...item,
      type: "COLOR",
      name: getName(item),
    }));

    const category = articleTypes.map((item) => ({
      ...item,
      type: "CATEGORY",
      name: getName(item),
    }));

    const subcategory = subCategories.map((item) => ({
      ...item,
      type: "STYLE",
      name: getName(item),
    }));

    return [...color, ...category, ...subcategory];
  }, [baseColours, articleTypes, subCategories]);

  const filteredTrends = useMemo(() => {
    if (activeFilter === "ALL") {
      return allTrends;
    }

    return allTrends.filter((item) => item.type === activeFilter);
  }, [allTrends, activeFilter]);

  const emergingTrends = [...allTrends]
    .filter((item) => Number(item.share_change) > 0)
    .sort(
      (a, b) =>
        Number(b.share_change || 0) -
        Number(a.share_change || 0)
    )
    .slice(0, 6);

  const risingColours = [...baseColours]
    .filter((item) => Number(item.share_change) > 0)
    .sort(
      (a, b) =>
        Number(b.share_change || 0) -
        Number(a.share_change || 0)
    )
    .slice(0, 5);

  const decliningColours = [...baseColours]
    .filter((item) => Number(item.share_change) < 0)
    .sort(
      (a, b) =>
        Number(a.share_change || 0) -
        Number(b.share_change || 0)
    )
    .slice(0, 5);

  const sortedForecasts = [...forecasts]
    .filter(
      (item) =>
        item.forecast_share !== null &&
        item.forecast_share !== undefined
    )
    .sort(
      (a, b) =>
        Number(b.forecast_share || 0) -
        Number(a.forecast_share || 0)
    )
    .slice(0, 8);

  const maxForecastShare =
    Math.max(
      ...sortedForecasts.map(
        (item) => Number(item.forecast_share) || 0
      ),
      0
    ) || 1;

  const topForecast = sortedForecasts[0];

  const topTrend = emergingTrends[0] || allTrends[0];

  const confidence = topForecast
    ? Number(topForecast.forecast_confidence || 0)
    : 0;

  const getForecastName = (item) =>
    item?.baseColour ||
    item?.articleType ||
    item?.subCategory ||
    item?.attribute_value ||
    item?.value ||
    "Unknown";

  const getForecastBarWidth = (item) => {
    const share = Number(item.forecast_share) || 0;

    return Math.max(
      8,
      Math.min(100, (share / maxForecastShare) * 100)
    );
  };

  const getColorSwatch = (name) => {
    const value = String(name || "").toLowerCase();

    const colors = {
      black: "#171717",
      white: "#f4f4f4",
      grey: "#858585",
      gray: "#858585",
      red: "#a94442",
      blue: "#4c6b88",
      navy: "#27344d",
      "navy blue": "#27344d",
      green: "#647a68",
      yellow: "#c9a646",
      orange: "#c47b45",
      pink: "#c58d9a",
      purple: "#75647d",
      beige: "#b9aa91",
      nude: "#c09b83",
      brown: "#765b49",
      maroon: "#633f45",
      cream: "#d7ccb7",
      silver: "#9d9d9d",
      gold: "#b28e42",
    };

    return colors[value] || "#95887c";
  };

  return (
    <div className="trends-page">
      {/* =====================================================
          NAVBAR
          ===================================================== */}

      <header className="navbar trends-navbar">
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
           <Link to="/style-engine">STYLE ENGINE</Link>
        </nav>

        <Link to="/profile" className="profile-button">
          Profile
        </Link>
      </header>

      <main className="trends-main">
        {/* =====================================================
            HERO
            ===================================================== */}

        <section className="trends-hero">
          <div className="trends-container">
            <div className="trends-hero-grid">
              <div className="trends-hero-content">
                <div className="trends-eyebrow">
                  FASHNOVA / TREND INTELLIGENCE
                </div>

                <h1>
                  What's
                  <br />
                  <span>moving?</span>
                </h1>

                <p>
                  FASHNOVA analyzes historical fashion catalog
                  signals to identify movement, measure momentum,
                  and forecast where fashion attributes may go next.
                </p>
              </div>

              {/* MODEL STATUS */}

              <div className="trends-model-card">
                <span className="trends-model-label">
                  LIVE MODEL STATUS
                </span>

                <div>
                  <div className="trends-model-state">
                    <span
                      className={`trends-status-dot ${
                        loading
                          ? "loading"
                          : error
                          ? "error"
                          : "online"
                      }`}
                    />

                    <strong>
                      {loading
                        ? "Analyzing"
                        : error
                        ? "Unavailable"
                        : "Trend engine online"}
                    </strong>
                  </div>

                  <p>
                    Historical catalog signals → feature
                    engineering → trend detection → ML forecasting
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            LOADING
            ===================================================== */}

        {loading && (
          <div className="trends-container">
            <section className="trends-card trends-state-card">
              <p className="trends-state-label">
                FASHNOVA ML
              </p>

              <h2>Reading fashion signals...</h2>

              <p>
                Processing historical fashion data and generating
                trend intelligence.
              </p>
            </section>
          </div>
        )}

        {/* =====================================================
            ERROR
            ===================================================== */}

        {error && !loading && (
          <div className="trends-container">
            <section className="trends-card trends-state-card trends-error-card">
              <p className="trends-state-label">
                FASHNOVA ML / ERROR
              </p>

              <h2>Trend intelligence unavailable</h2>

              <p>{error}</p>
            </section>
          </div>
        )}

        {!loading && !error && trendData && (
          <>
            {/* =================================================
                FILTERS
                ================================================= */}

            <section className="trends-container trends-filter-section">
              <div className="trends-filters">
                {["ALL", "COLOR", "CATEGORY", "STYLE"].map(
                  (filter) => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`trends-filter ${
                        activeFilter === filter ? "active" : ""
                      }`}
                    >
                      {filter}
                    </button>
                  )
                )}
              </div>
            </section>

            {/* =================================================
                EMERGING NOW
                ================================================= */}

            <section className="trends-container trends-section">
              <div className="trends-card trends-emerging-card">
                <div className="trends-section-heading">
                  <div>
                    <span className="trends-section-label">
                      01 / EMERGING NOW
                    </span>

                    <h2>
                      The signals gaining ground.
                    </h2>
                  </div>

                  <span className="trends-section-note">
                    ML detected movement
                  </span>
                </div>

                <div className="trends-emerging-grid">
                  {(filteredTrends.length
                    ? filteredTrends
                    : emergingTrends
                  )
                    .slice(0, 6)
                    .map((trend, index) => {
                      const direction = getDirection(
                        trend.share_change
                      );

                      return (
                        <article
                          key={`${trend.name}-${index}`}
                          className="trends-emerging-item"
                        >
                          <div className="trends-item-top">
                            <span className="trends-item-type">
                              {trend.type}
                            </span>

                            <span
                              className={`trends-item-arrow ${direction.toLowerCase()}`}
                            >
                              {getArrow(trend.share_change)}
                            </span>
                          </div>

                          <div className="trends-item-main">
                            {trend.type === "COLOR" && (
                              <span
                                className="trends-color-swatch"
                                style={{
                                  background:
                                    getColorSwatch(trend.name),
                                }}
                              />
                            )}

                            <h3>{trend.name}</h3>

                            <p
                              className={`trends-direction ${direction.toLowerCase()}`}
                            >
                              {direction}
                            </p>
                          </div>

                          <div className="trends-item-bottom">
                            <span>
                              Share{" "}
                              {formatPercentage(trend.share)}
                            </span>

                            <strong>
                              Score{" "}
                              {formatScore(
                                trend.trend_score
                              )}
                            </strong>
                          </div>
                        </article>
                      );
                    })}
                </div>
              </div>
            </section>

            {/* =================================================
                COLOR INTELLIGENCE
                ================================================= */}

            <section className="trends-container trends-section">
              <div className="trends-card trends-section-card">
                <span className="trends-section-label">
                  02 / COLOR INTELLIGENCE
                </span>

                <h2 className="trends-section-title">
                  Which colors are moving?
                </h2>

                <div className="trends-color-grid">
                  {/* RISING */}

                  <div className="trends-color-panel rising">
                    <div className="trends-color-panel-title">
                      RISING
                    </div>

                    {risingColours.length === 0 ? (
                      <p className="trends-empty-text">
                        No rising color signal.
                      </p>
                    ) : (
                      risingColours.map((color, index) => (
                        <div
                          key={`${getName(color)}-${index}`}
                          className="trends-color-row"
                        >
                          <span
                            className="trends-small-color"
                            style={{
                              background: getColorSwatch(
                                getName(color)
                              ),
                            }}
                          />

                          <strong>
                            {getName(color)}
                          </strong>

                          <span className="trends-row-arrow rising">
                            ↗
                          </span>
                        </div>
                      ))
                    )}
                  </div>

                  {/* DECLINING */}

                  <div className="trends-color-panel declining">
                    <div className="trends-color-panel-title">
                      DECLINING
                    </div>

                    {decliningColours.length === 0 ? (
                      <p className="trends-empty-text">
                        No declining color signal.
                      </p>
                    ) : (
                      decliningColours.map(
                        (color, index) => (
                          <div
                            key={`${getName(color)}-${index}`}
                            className="trends-color-row"
                          >
                            <span
                              className="trends-small-color"
                              style={{
                                background:
                                  getColorSwatch(
                                    getName(color)
                                  ),
                              }}
                            />

                            <strong>
                              {getName(color)}
                            </strong>

                            <span className="trends-row-arrow declining">
                              ↘
                            </span>
                          </div>
                        )
                      )
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* =================================================
                CATEGORY MOMENTUM
                ================================================= */}

            <section className="trends-container trends-section">
              <div className="trends-card trends-section-card">
                <span className="trends-section-label">
                  03 / CATEGORY MOMENTUM
                </span>

                <h2 className="trends-section-title">
                  Fashion categories in motion.
                </h2>

                <div className="trends-category-list">
                  {articleTypes.slice(0, 8).map(
                    (item, index) => {
                      const score =
                        Number(item.trend_score) || 0;

                      const direction = getDirection(
                        item.share_change
                      );

                      return (
                        <div
                          key={`${getName(item)}-${index}`}
                          className="trends-category-row"
                        >
                          <strong className="trends-category-name">
                            {getName(item)}
                          </strong>

                          <div className="trends-category-bar">
                            <div
                              className="trends-category-fill"
                              style={{
                                width: `${Math.max(
                                  3,
                                  Math.min(100, score)
                                )}%`,
                              }}
                            />
                          </div>

                          <span
                            className={`trends-category-value ${direction.toLowerCase()}`}
                          >
                            {formatScore(
                              item.trend_score
                            )}{" "}
                            {getArrow(item.share_change)}
                          </span>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            </section>

            {/* =================================================
                FUTURE FORECAST
                ================================================= */}

            <section className="trends-container trends-section">
              <div className="trends-card trends-forecast-card">
                <div className="trends-forecast-heading">
                  <div>
                    <span className="trends-section-label">
                      04 / FUTURE FORECAST
                    </span>

                    <h2>
                      What comes next?
                    </h2>

                    <p>
                      Forecasted future share from reliable
                      historical signals. Bar lengths are
                      normalized for comparison; percentages
                      remain the actual model outputs.
                    </p>
                  </div>

                  {topForecast && (
                    <div className="trends-top-forecast">
                      <span>TOP FORECAST</span>

                      <strong>
                        {getForecastName(topForecast)}
                      </strong>
                    </div>
                  )}
                </div>

                <div className="trends-forecast-list">
                  {sortedForecasts.map(
                    (forecast, index) => {
                      const direction =
                        forecast.forecast_direction ||
                        "STABLE";

                      return (
                        <div
                          key={`${getForecastName(
                            forecast
                          )}-${index}`}
                          className="trends-forecast-row"
                        >
                          <div className="trends-forecast-info">
                            <div>
                              <strong>
                                {getForecastName(
                                  forecast
                                )}
                              </strong>

                              <span
                                className={`trends-forecast-direction ${direction.toLowerCase()}`}
                              >
                                {direction}
                              </span>
                            </div>

                            <span className="trends-forecast-value">
                              {forecast.forecast_year} ·{" "}
                              {formatPercentage(
                                forecast.forecast_share
                              )}
                            </span>
                          </div>

                          <div className="trends-forecast-bar">
                            <div
                              className="trends-forecast-fill"
                              style={{
                                width: `${getForecastBarWidth(
                                  forecast
                                )}%`,
                              }}
                            />
                          </div>

                          <div className="trends-forecast-meta">
                            <span>
                              Confidence{" "}
                              {forecast.forecast_confidence !==
                              null
                                ? `${Number(
                                    forecast.forecast_confidence
                                  ).toFixed(1)}%`
                                : "—"}
                            </span>

                            <span>
                              {forecast.confidence_level}
                            </span>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            </section>

            {/* =================================================
                FASHNOVA INSIGHT
                ================================================= */}

            <section className="trends-container trends-section">
              <div className="trends-insight">
                <span className="trends-insight-label">
                  05 / FASHNOVA INSIGHT
                </span>

                <div className="trends-insight-grid">
                  <div>
                    <h2>
                      {topTrend
                        ? `${topTrend.name} is showing a ${getDirection(
                            topTrend.share_change
                          ).toLowerCase()} signal.`
                        : "Fashion signals are being analyzed."}
                    </h2>

                    <p>
                      This insight is derived from FASHNOVA's
                      historical catalog signals, normalized
                      shares, momentum measurements, and trend
                      scoring. It represents a model-based
                      fashion signal, not a claim about global
                      sales or consumer demand.
                    </p>
                  </div>

                  <div className="trends-confidence">
                    <strong>
                      {topForecast
                        ? `${confidence.toFixed(0)}%`
                        : "—"}
                    </strong>

                    <span>CONFIDENCE</span>
                  </div>
                </div>
              </div>
            </section>

            {/* =================================================
                STYLE ENGINE PIPELINE
                ================================================= */}

            <section className="trends-container trends-section trends-last-section">
              <div className="trends-card trends-engine-card">
                <span className="trends-section-label">
                  06 / FROM TRENDS TO STYLE
                </span>

                <h2 className="trends-section-title">
                  Intelligence doesn't stop here.
                </h2>

                <div className="trends-engine-grid">
                  {[
                    [
                      "01",
                      "FASHION DATA",
                      "Historical catalog signals",
                    ],
                    [
                      "02",
                      "TREND ML",
                      "Movement + momentum",
                    ],
                    [
                      "03",
                      "FORECAST",
                      "Future fashion signals",
                    ],
                    [
                      "04",
                      "STYLE ENGINE",
                      "Personalized decisions",
                    ],
                  ].map(([number, title, text]) => (
                    <div
                      key={number}
                      className="trends-engine-step"
                    >
                      <span>{number}</span>

                      <h3>{title}</h3>

                      <p>{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {/* =====================================================
          FOOTER
          ===================================================== */}

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

