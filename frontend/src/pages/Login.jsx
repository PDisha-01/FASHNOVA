import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { loginUser } from "../services/api";
import { useAuth } from "../context/useAuth";

function Login() {
  const navigate = useNavigate();
  const { setAuthenticatedUser } = useAuth();

  const [form, setForm] = useState({
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
      const loggedInUser = await loginUser(
  form.email,
  form.password
);

setAuthenticatedUser(loggedInUser);
navigate("/profile");
    } catch (err) {
      setError(err.message || "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <Navbar />

      <main className="auth-page">
        <section className="auth-card">
          <p className="section-label">FASHNOVA ACCOUNT</p>

          <h1>
            Welcome
            <br />
            <span>back.</span>
          </h1>

          <p className="auth-intro">
            Sign in to access your personal fashion intelligence
            profile.
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
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
                placeholder="Enter your password"
                autoComplete="current-password"
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
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account?{" "}
            <Link to="/register">Create one</Link>
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Login;