import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { registerUser } from "../services/api";
import { useAuth } from "../context/useAuth";

function Register() {
  const navigate = useNavigate();
  const { setAuthenticatedUser } = useAuth();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const registeredUser = await registerUser(form);

setAuthenticatedUser(registeredUser);
navigate("/profile");
    } catch (err) {
      setError(err.message || "Unable to create your account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <Navbar />

      <main className="auth-page">
        <section className="auth-card">
          <p className="section-label">JOIN FASHNOVA</p>

          <h1>
            Create your
            <br />
            <span>style profile.</span>
          </h1>

          <p className="auth-intro">
            Build your personal fashion identity and unlock
            personalized intelligence.
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-row">
              <label>
                First name
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="First name"
                  autoComplete="given-name"
                />
              </label>

              <label>
                Last name
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Last name"
                  autoComplete="family-name"
                />
              </label>
            </div>

            <label>
              Email
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Minimum 8 characters"
                autoComplete="new-password"
                minLength={8}
                required
              />
            </label>

            {error && (
              <p className="auth-error" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?{" "}
            <Link to="/login">Sign in</Link>
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Register;