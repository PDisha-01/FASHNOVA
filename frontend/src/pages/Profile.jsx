import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import "./Profile.css";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {
  getProfile,
  updateProfilePreferences,
} from "../services/profile";

import { useAuth } from "../context/useAuth";

function Profile() {
  const {
    user: authUser,
    logout,
    isAuthenticated,
  } = useAuth();

  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingPreferences, setEditingPreferences] = useState(false);
  const [savingPreferences, setSavingPreferences] = useState(false);

  const [preferenceForm, setPreferenceForm] = useState({
    preferredStyles: [],
    preferredColors: [],
    preferredSeasons: [],
    preferredCategories: [],
    preferredFits: [],
    favoriteBrands: [],
    budgetMin: null,
    budgetMax: null,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    async function loadProfile() {
      try {
        setLoading(true);
        setError("");

        const data = await getProfile();

        setProfile(data);

        setPreferenceForm({
          preferredStyles: data.preferences?.preferredStyles || [],
          preferredColors: data.preferences?.preferredColors || [],
          preferredSeasons: data.preferences?.preferredSeasons || [],
          preferredCategories:
            data.preferences?.preferredCategories || [],
          preferredFits: data.preferences?.preferredFits || [],
          favoriteBrands: data.preferences?.favoriteBrands || [],
          budgetMin: data.preferences?.budgetMin ?? null,
          budgetMax: data.preferences?.budgetMax ?? null,
        });
      } catch (err) {
        if (err.status === 401) {
          logout();
          navigate("/login", { replace: true });
          return;
        }

        setError(
          err.message || "Unable to load your profile."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [isAuthenticated, logout, navigate]);

  async function handleSavePreferences() {
    try {
      setSavingPreferences(true);
      setError("");

      const updatedPreferences =
        await updateProfilePreferences(preferenceForm);

      setProfile((current) => ({
        ...current,
        preferences: updatedPreferences,
      }));

      setEditingPreferences(false);
    } catch (err) {
      setError(
        err.message || "Unable to update your preferences."
      );
    } finally {
      setSavingPreferences(false);
    }
  }

  function handlePreferenceChange(field, value) {
    setPreferenceForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleArrayChange(field, value) {
    handlePreferenceChange(
      field,
      value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    );
  }

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="app">
        <Navbar />

        <main className="profile-page">
          <section className="profile-loading">
            <div className="profile-loading-mark">F</div>
            <p>FASHNOVA</p>
            <h1>Loading your style profile...</h1>
            <span>
              Retrieving your personal fashion intelligence.
            </span>
          </section>
        </main>

        <Footer />
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="app">
        <Navbar />

        <main className="profile-page">
          <section className="profile-error">
            <span className="profile-eyebrow">
              PROFILE ERROR
            </span>

            <h1>
              Something went
              <br />
              <em>wrong.</em>
            </h1>

            <p>{error}</p>

            <button
              type="button"
              className="profile-primary-button"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </section>
        </main>

        <Footer />
      </div>
    );
  }

  const firstName = profile?.profile?.firstName || "";
  const lastName = profile?.profile?.lastName || "";

  const fullName =
    [firstName, lastName].filter(Boolean).join(" ") ||
    "FASHNOVA User";

  const email =
    profile?.email ||
    authUser?.email ||
    "Not available";

  const status = profile?.status || "ACTIVE";

  const preferences = profile?.preferences || {};

  const styles = preferences.preferredStyles || [];
  const colors = preferences.preferredColors || [];
  const seasons = preferences.preferredSeasons || [];
  const categories = preferences.preferredCategories || [];
  const fits = preferences.preferredFits || [];
  const brands = preferences.favoriteBrands || [];

  const budgetMin = preferences.budgetMin;
  const budgetMax = preferences.budgetMax;

  const initials =
    `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`
      .trim()
      .toUpperCase() || "F";

  return (
    <div className="app">
      <Navbar />

      <main className="profile-page">
        {/* HERO */}
        <section className="profile-hero-new">
          <div className="profile-hero-copy">
            <span className="profile-eyebrow">
              YOUR FASHNOVA
            </span>

            <h1>
              Your
              <br />
              <em>Style Profile.</em>
            </h1>

            <p>
              Your personal fashion identity, preferences and
              intelligence — all in one place.
            </p>
          </div>

          <div className="profile-hero-decoration">
            <span>Better style.</span>
            <span>Smarter choices.</span>
          </div>
        </section>

        {/* ACCOUNT + STYLE IDENTITY */}
        <section className="profile-top-grid">
          {/* ACCOUNT */}
          <article className="profile-modern-card account-card">
            <div className="profile-card-heading">
              <div>
                <span className="profile-card-number">
                  01
                </span>

                <h2>Account Information</h2>
              </div>

              <span className="profile-card-icon">◉</span>
            </div>

            <div className="account-content">
              <div className="profile-avatar-large">
                {initials}
              </div>

              <div className="account-primary">
                <h3>{fullName}</h3>
                <p>{email}</p>

                <span className="account-status">
                  <i />
                  {status}
                </span>
              </div>
            </div>

            <div className="account-details">
              <div>
                <span>EMAIL</span>
                <strong>{email}</strong>
              </div>

              <div>
                <span>ACCOUNT</span>
                <strong>FASHNOVA Member</strong>
              </div>
            </div>

            <button
              type="button"
              className="profile-logout-button"
              onClick={handleLogout}
            >
              Log Out
            </button>
          </article>

          {/* STYLE IDENTITY */}
          <article className="profile-modern-card">
            <div className="profile-card-heading">
              <div>
                <span className="profile-card-number">
                  02
                </span>

                <h2>Your Style Identity</h2>
              </div>

              <button
                type="button"
                className="profile-small-button"
                onClick={() => setEditingPreferences(true)}
              >
                Edit
              </button>
            </div>

            <p className="profile-card-description">
              Your preferences form the foundation of your
              personalized FASHNOVA experience.
            </p>

            <div className="style-identity-grid">
              <PreferenceStat
                label="Preferred Styles"
                value={styles.length}
                suffix="styles"
              />

              <PreferenceStat
                label="Preferred Colors"
                value={colors.length}
                suffix="colors"
              />

              <PreferenceStat
                label="Seasons"
                value={seasons.length}
                suffix="seasons"
              />

              <PreferenceStat
                label="Categories"
                value={categories.length}
                suffix="categories"
              />

              <PreferenceStat
                label="Fits"
                value={fits.length}
                suffix="fits"
              />

              <PreferenceStat
                label="Favorite Brands"
                value={brands.length}
                suffix="brands"
              />
            </div>

            <div className="budget-summary">
              <div className="budget-symbol">₹</div>

              <div>
                <span>BUDGET RANGE</span>

                <strong>
                  {budgetMin != null || budgetMax != null
                    ? `₹${Number(budgetMin || 0).toLocaleString(
                        "en-IN"
                      )} – ₹${Number(
                        budgetMax || 0
                      ).toLocaleString("en-IN")}`
                    : "Not configured"}
                </strong>
              </div>
            </div>
          </article>
        </section>

        {/* FASHION INTELLIGENCE */}
        <section className="profile-modern-card intelligence-card">
          <div className="section-heading-row">
            <div>
              <span className="profile-card-number">
                03
              </span>

              <h2>Fashion Intelligence</h2>

              <p>
                Your style journey, powered by FASHNOVA AI.
              </p>
            </div>

            <span className="intelligence-flow">
              Understand → Create → Personalize
            </span>
          </div>

          <div className="intelligence-grid">
            <IntelligenceCard
              type="VISION"
              subtitle="Computer Vision"
              count="0 analyses"
              description="Analyze outfits and understand your visual fashion style."
              action="Start Analyzing"
              to="/vision"
            />

            <IntelligenceCard
              type="STUDIO"
              subtitle="Gen AI"
              count="0 creations"
              description="Create personalized looks, concepts and fashion ideas."
              action="Create Your Look"
              to="/studio"
            />

            <IntelligenceCard
              type="STYLE ENGINE"
              subtitle="Recommendation"
              count="Coming soon"
              description="Turn your fashion identity into personalized recommendations."
              action="Explore Style Engine"
              to="/style-engine"
              muted
            />
          </div>
        </section>

        {/* PREFERENCES */}
        <section className="profile-modern-card preferences-card">
          <div className="section-heading-row">
            <div>
              <span className="profile-card-number">
                04
              </span>

              <h2>Style Preferences</h2>

              <p>
                Your preferences help FASHNOVA personalize
                your fashion experience.
              </p>
            </div>

            {!editingPreferences && (
              <button
                type="button"
                className="profile-small-button"
                onClick={() =>
                  setEditingPreferences(true)
                }
              >
                Edit Preferences
              </button>
            )}
          </div>

          {!editingPreferences ? (
            <PreferenceOverview
              styles={styles}
              colors={colors}
              seasons={seasons}
              categories={categories}
              fits={fits}
              brands={brands}
              budgetMin={budgetMin}
              budgetMax={budgetMax}
            />
          ) : (
            <div className="preference-editor-modern">
              <PreferenceInput
                label="Preferred Styles"
                value={preferenceForm.preferredStyles}
                placeholder="Casual, Minimal, Streetwear"
                onChange={(value) =>
                  handleArrayChange(
                    "preferredStyles",
                    value
                  )
                }
              />

              <PreferenceInput
                label="Preferred Colors"
                value={preferenceForm.preferredColors}
                placeholder="Black, Burgundy, Rose"
                onChange={(value) =>
                  handleArrayChange(
                    "preferredColors",
                    value
                  )
                }
              />

              <PreferenceInput
                label="Preferred Seasons"
                value={preferenceForm.preferredSeasons}
                placeholder="Spring, Summer, Winter"
                onChange={(value) =>
                  handleArrayChange(
                    "preferredSeasons",
                    value
                  )
                }
              />

              <PreferenceInput
                label="Preferred Categories"
                value={preferenceForm.preferredCategories}
                placeholder="Dresses, Tops, Jackets"
                onChange={(value) =>
                  handleArrayChange(
                    "preferredCategories",
                    value
                  )
                }
              />

              <PreferenceInput
                label="Preferred Fits"
                value={preferenceForm.preferredFits}
                placeholder="Slim, Regular, Relaxed"
                onChange={(value) =>
                  handleArrayChange(
                    "preferredFits",
                    value
                  )
                }
              />

              <PreferenceInput
                label="Favorite Brands"
                value={preferenceForm.favoriteBrands}
                placeholder="Brand names separated by commas"
                onChange={(value) =>
                  handleArrayChange(
                    "favoriteBrands",
                    value
                  )
                }
              />

              <div className="budget-editor">
                <div className="budget-editor-heading">
                  <div>
                    <span>BUDGET</span>
                    <h3>Your shopping range</h3>
                  </div>

                  <div className="budget-editor-value">
                    ₹
                  </div>
                </div>

                <div className="budget-input-grid">
                  <label>
                    Minimum budget
                    <div className="currency-input">
                      <span>₹</span>
                      <input
                        type="number"
                        min="0"
                        value={
                          preferenceForm.budgetMin ?? ""
                        }
                        onChange={(event) =>
                          handlePreferenceChange(
                            "budgetMin",
                            event.target.value === ""
                              ? null
                              : Number(
                                  event.target.value
                                )
                          )
                        }
                        placeholder="1000"
                      />
                    </div>
                  </label>

                  <label>
                    Maximum budget
                    <div className="currency-input">
                      <span>₹</span>
                      <input
                        type="number"
                        min="0"
                        value={
                          preferenceForm.budgetMax ?? ""
                        }
                        onChange={(event) =>
                          handlePreferenceChange(
                            "budgetMax",
                            event.target.value === ""
                              ? null
                              : Number(
                                  event.target.value
                                )
                          )
                        }
                        placeholder="5000"
                      />
                    </div>
                  </label>
                </div>
              </div>

              {error && (
                <div className="profile-inline-error">
                  {error}
                </div>
              )}

              <div className="preference-actions">
                <button
                  type="button"
                  className="profile-primary-button"
                  onClick={handleSavePreferences}
                  disabled={savingPreferences}
                >
                  {savingPreferences
                    ? "Saving..."
                    : "Save Preferences"}
                </button>

                <button
                  type="button"
                  className="profile-secondary-button"
                  onClick={() =>
                    setEditingPreferences(false)
                  }
                  disabled={savingPreferences}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </section>

        {/* FOOTER MESSAGE */}
        <section className="profile-closing">
          <div>
            <span>YOUR STYLE JOURNEY</span>
            <h2>
              Keep exploring.
              <br />
              <em>Your next look is waiting.</em>
            </h2>
          </div>

          <span className="closing-wordmark">
            FASHNOVA →
          </span>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function PreferenceStat({ label, value, suffix }) {
  return (
    <div className="style-stat">
      <div className="style-stat-icon">✦</div>

      <span>{label}</span>

      <strong>{value}</strong>

      <small>{suffix}</small>
    </div>
  );
}

function PreferenceInput({
  label,
  value,
  placeholder,
  onChange,
}) {
  return (
    <label className="preference-input">
      <span>{label}</span>

      <input
        type="text"
        value={value.join(", ")}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
      />
    </label>
  );
}

function PreferenceOverview({
  styles,
  colors,
  seasons,
  categories,
  fits,
  brands,
  budgetMin,
  budgetMax,
}) {
  const groups = [
    ["Preferred Styles", styles],
    ["Preferred Colors", colors],
    ["Seasons", seasons],
    ["Categories", categories],
    ["Fits", fits],
    ["Favorite Brands", brands],
  ];

  return (
    <div className="preference-overview">
      {groups.map(([label, items]) => (
        <div
          className="preference-overview-item"
          key={label}
        >
          <span>{label}</span>

          <div className="preference-tags">
            {items.length > 0 ? (
              <>
                {items.slice(0, 4).map((item) => (
                  <span key={item}>{item}</span>
                ))}

                {items.length > 4 && (
                  <span>+{items.length - 4} more</span>
                )}
              </>
            ) : (
              <span className="empty-tag">
                Not configured
              </span>
            )}
          </div>
        </div>
      ))}

      <div className="preference-overview-item budget-overview">
        <span>Budget Range</span>

        <strong>
          {budgetMin != null || budgetMax != null
            ? `₹${Number(
                budgetMin || 0
              ).toLocaleString("en-IN")} – ₹${Number(
                budgetMax || 0
              ).toLocaleString("en-IN")}`
            : "Not configured"}
        </strong>
      </div>
    </div>
  );
}

function IntelligenceCard({
  type,
  subtitle,
  count,
  description,
  action,
  to,
  muted = false,
}) {
  return (
    <article
      className={`intelligence-item ${
        muted ? "is-muted" : ""
      }`}
    >
      <div className="intelligence-number">
        {type === "VISION"
          ? "01"
          : type === "STUDIO"
          ? "02"
          : "03"}
      </div>

      <div className="intelligence-content">
        <span className="intelligence-type">
          {type}
        </span>

        <span className="intelligence-subtitle">
          {subtitle}
        </span>

        <strong>{count}</strong>

        <p>{description}</p>

        <Link to={to} className="intelligence-link">
          {action}
          <span>→</span>
        </Link>
      </div>
    </article>
  );
}

export default Profile;