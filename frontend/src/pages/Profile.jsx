import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getProfile } from "../services/profile";
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
          <section className="profile-hero">
            <p className="section-label">YOUR FASHNOVA</p>

            <h1>
              Loading
              <br />
              <span>your profile...</span>
            </h1>

            <p>
              FASHNOVA is retrieving your personal fashion
              intelligence profile.
            </p>
          </section>
        </main>

        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <Navbar />

        <main className="profile-page">
          <section className="profile-hero">
            <p className="section-label">PROFILE ERROR</p>

            <h1>
              Something
              <br />
              <span>went wrong.</span>
            </h1>

            <p>{error}</p>

            <button
              type="button"
              className="profile-action-button"
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

  const status =
    profile?.status || "ACTIVE";

  const styles =
    profile?.preferences?.preferredStyles?.length || 0;

  const colors =
    profile?.preferences?.preferredColors?.length || 0;

  const seasons =
    profile?.preferences?.preferredSeasons?.length || 0;

  const categories =
    profile?.preferences?.preferredCategories?.length || 0;

  const fits =
    profile?.preferences?.preferredFits?.length || 0;

  const brands =
    profile?.preferences?.favoriteBrands?.length || 0;

  return (
    <div className="app">
      <Navbar />

      <main className="profile-page">
        <section className="profile-hero">
          <p className="section-label">YOUR FASHNOVA</p>

          <h1>
            Your
            <br />
            <span>Style Profile.</span>
          </h1>

          <p>
            Your personal space for fashion preferences,
            activity, discoveries, and personalized intelligence
            from the FASHNOVA Style Engine.
          </p>
        </section>

        <section className="profile-grid">
          {/* PROFILE */}
          <article className="profile-card profile-main-card">
            <div className="profile-card-top">
              <span>01</span>
              <span>PROFILE</span>
            </div>

            <div className="profile-avatar">
              {firstName
                ? firstName.charAt(0).toUpperCase()
                : "F"}
            </div>

            <h2>{fullName}</h2>

            <p className="profile-placeholder">
              Your FASHNOVA account information.
            </p>

            <div className="profile-details">
              <div>
                <span>NAME</span>
                <strong>{fullName}</strong>
              </div>

              <div>
                <span>EMAIL</span>
                <strong>{email}</strong>
              </div>

              <div>
                <span>STATUS</span>
                <strong>{status}</strong>
              </div>
            </div>

            <button
              type="button"
              className="profile-action-button"
              onClick={handleLogout}
            >
              Log Out
            </button>
          </article>

          {/* PREFERENCES */}
          <article className="profile-card">
            <div className="profile-card-top">
              <span>02</span>
              <span>PREFERENCES</span>
            </div>

            <h2>Style Preferences</h2>

            <p>
              Your preferences will help the FASHNOVA Style
              Engine personalize future recommendations.
            </p>

            <div className="preference-list">
              <div>
                <span>STYLE</span>
                <strong>
                  {styles > 0
                    ? `${styles} configured`
                    : "Not configured"}
                </strong>
              </div>

              <div>
                <span>COLORS</span>
                <strong>
                  {colors > 0
                    ? `${colors} configured`
                    : "Not configured"}
                </strong>
              </div>

              <div>
                <span>SEASONS</span>
                <strong>
                  {seasons > 0
                    ? `${seasons} configured`
                    : "Not configured"}
                </strong>
              </div>

              <div>
                <span>CATEGORIES</span>
                <strong>
                  {categories > 0
                    ? `${categories} configured`
                    : "Not configured"}
                </strong>
              </div>

              <div>
                <span>FITS</span>
                <strong>
                  {fits > 0
                    ? `${fits} configured`
                    : "Not configured"}
                </strong>
              </div>

              <div>
                <span>BRANDS</span>
                <strong>
                  {brands > 0
                    ? `${brands} configured`
                    : "Not configured"}
                </strong>
              </div>
            </div>
          </article>

          {/* ACTIVITY */}
          <article className="profile-card">
            <div className="profile-card-top">
              <span>03</span>
              <span>ACTIVITY</span>
            </div>

            <h2>Your Activity</h2>

            <p>
              Your Vision analyses, Studio creations, and future
              recommendations will appear here.
            </p>

            <div className="activity-list">
              <div>
                <span>VISION</span>
                <strong>0 analyses</strong>
              </div>

              <div>
                <span>STUDIO</span>
                <strong>0 creations</strong>
              </div>

              <div>
                <span>STYLE ENGINE</span>
                <strong>Coming soon</strong>
              </div>
            </div>
          </article>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Profile;