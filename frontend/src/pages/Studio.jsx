import { useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";

const API_URL = "http://localhost:5000";

function Studio() {
  const [prompt, setPrompt] = useState("");
  const [generationType, setGenerationType] = useState("design");
  const [garment, setGarment] = useState("");
  const [category, setCategory] = useState("");
  const [aesthetic, setAesthetic] = useState("");
  const [season, setSeason] = useState("");
  const [colors, setColors] = useState("");
  const [pattern, setPattern] = useState("");
  const [fabric, setFabric] = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleGenerate = async (event) => {
    event.preventDefault();

    if (!prompt.trim()) {
      setError("Please enter a creative direction before generating.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    const colorList = colors
      .split(",")
      .map((color) => color.trim())
      .filter(Boolean);

    try {
      const response = await fetch(`${API_URL}/api/studio/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          generation_type: generationType,
          prompt: prompt.trim(),

          fashion_context: {
            garment: garment.trim() || undefined,
            category: category.trim() || undefined,
            aesthetic: aesthetic.trim() || undefined,
            season: season.trim() || undefined,
            colors: colorList,
            pattern: pattern.trim() || undefined,
            fabric: fabric.trim() || undefined,
          },

          trend_context: {
            enabled: false,
            trends: [],
          },

          vision_context: {
            enabled: false,
            attributes: {},
          },

          aspect_ratio: "3:4",
          image_size: "1K",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            data?.message ||
            "Studio generation failed."
        );
      }

      if (data.status !== "success") {
        throw new Error(
          data.error || "Studio generation failed."
        );
      }

      setResult(data);
    } catch (generationError) {
      setError(
        generationError.message ||
          "Unable to generate the fashion design."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="studio-page">
      <header className="navbar studio-navbar">
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
           <Link to="/style-engine">Style Engine</Link>
        </nav>

        <Link to="/profile" className="profile-button">
          Profile
        </Link>
      </header>

      <main className="studio-main">
        <section className="studio-hero">
          <div className="studio-hero-copy">
            <p className="studio-eyebrow">
              FASHNOVA STUDIO · GEN AI
            </p>

            <h1>
              Create.
              <br />
              <span>Imagine.</span>
            </h1>

            <p className="studio-description">
              Turn creative direction into fashion design
              concepts using FASHNOVA's generative intelligence.
            </p>
          </div>

          <div className="studio-hero-note">
            <span>CREATIVE INTELLIGENCE</span>
            <p>
              Concept → Design → Variation → Pattern
            </p>
          </div>
        </section>

        <section className="studio-workspace">
          <div className="studio-section-heading">
            <div>
              <p className="studio-section-label">01 · CREATE</p>
              <h2>Creative Direction</h2>
            </div>

            <p>
              Define the visual language of the design you want
              Studio to generate.
            </p>
          </div>

          <form
            className="studio-generator"
            onSubmit={handleGenerate}
          >
            <div className="studio-generator-main">
              <label className="studio-field studio-prompt-field">
                <span>Creative prompt</span>

                <textarea
                  value={prompt}
                  onChange={(event) =>
                    setPrompt(event.target.value)
                  }
                  placeholder="Describe the fashion design you want to create..."
                  rows="6"
                />
              </label>

              <div className="studio-generation-types">
                {[
                  ["design", "Design"],
                  ["concept", "Concept"],
                  ["variation", "Variation"],
                  ["pattern", "Pattern"],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    className={`studio-type-button ${
                      generationType === value
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setGenerationType(value)
                    }
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="studio-context">
              <div className="studio-context-heading">
                <span>FASHION CONTEXT</span>
                <small>OPTIONAL</small>
              </div>

              <div className="studio-field-grid">
                <label className="studio-field">
                  <span>Garment</span>
                  <input
                    value={garment}
                    onChange={(event) =>
                      setGarment(event.target.value)
                    }
                    placeholder="e.g. summer dress"
                  />
                </label>

                <label className="studio-field">
                  <span>Category</span>
                  <input
                    value={category}
                    onChange={(event) =>
                      setCategory(event.target.value)
                    }
                    placeholder="e.g. womenswear"
                  />
                </label>

                <label className="studio-field">
                  <span>Aesthetic</span>
                  <input
                    value={aesthetic}
                    onChange={(event) =>
                      setAesthetic(event.target.value)
                    }
                    placeholder="e.g. contemporary"
                  />
                </label>

                <label className="studio-field">
                  <span>Season</span>
                  <input
                    value={season}
                    onChange={(event) =>
                      setSeason(event.target.value)
                    }
                    placeholder="e.g. summer"
                  />
                </label>

                <label className="studio-field">
                  <span>Color palette</span>
                  <input
                    value={colors}
                    onChange={(event) =>
                      setColors(event.target.value)
                    }
                    placeholder="sage green, ivory"
                  />
                </label>

                <label className="studio-field">
                  <span>Pattern</span>
                  <input
                    value={pattern}
                    onChange={(event) =>
                      setPattern(event.target.value)
                    }
                    placeholder="e.g. floral"
                  />
                </label>

                <label className="studio-field">
                  <span>Fabric</span>
                  <input
                    value={fabric}
                    onChange={(event) =>
                      setFabric(event.target.value)
                    }
                    placeholder="e.g. lightweight cotton"
                  />
                </label>
              </div>
            </div>

            {error && (
              <div className="studio-error">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="studio-generate-button"
              disabled={loading}
            >
              {loading
                ? "Generating..."
                : "Generate Fashion Design"}
            </button>
          </form>
        </section>

        <section className="studio-output-section">
          <div className="studio-section-heading">
            <div>
              <p className="studio-section-label">
                02 · OUTPUT
              </p>
              <h2>Generated Design</h2>
            </div>

            <p>
              Your generated fashion concept will appear here.
            </p>
          </div>

          <div className="studio-output">
            {loading ? (
              <div className="studio-output-empty">
                <span className="studio-output-index">
                  GENERATING
                </span>

                <h3>
                  Studio is creating
                  <br />
                  your design.
                </h3>

                <p>
                  The request is being processed by the
                  FASHNOVA generative pipeline.
                </p>
              </div>
            ) : result ? (
              <div className="studio-result">
                <div className="studio-result-header">
                  <div>
                    <span className="studio-output-index">
                      GENERATION COMPLETE
                    </span>

                    <h3>
                      {result.generation_type}
                    </h3>
                  </div>

                  <span className="studio-result-model">
                    {result.model || "Gemini"}
                  </span>
                </div>

                {result.image_data ? (
                  <div className="studio-generated-image">
                    <img
                      src={`data:image/png;base64,${result.image_data}`}
                      alt="Generated fashion design"
                    />
                  </div>
                ) : (
                  <div className="studio-result-placeholder">
                    <span>IMAGE OUTPUT</span>
                    <p>
                      The generation service returned
                      successfully, but no displayable image
                      is available yet.
                    </p>
                  </div>
                )}

                {result.prompt && (
                  <div className="studio-result-prompt">
                    <span>GENERATION PROMPT</span>
                    <p>{result.prompt}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="studio-output-empty">
                <span className="studio-output-index">
                  AWAITING DIRECTION
                </span>

                <h3>
                  Your next
                  <br />
                  fashion idea.
                </h3>

                <p>
                  Describe a design above and Studio will
                  transform your direction into a generative
                  fashion output.
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="studio-intelligence-section">
          <div className="studio-section-heading">
            <div>
              <p className="studio-section-label">
                03 · INTELLIGENCE
              </p>
              <h2>Connected Creativity</h2>
            </div>

            <p>
              Studio is designed to become increasingly
              intelligent as the FASHNOVA ecosystem grows.
            </p>
          </div>

          <div className="studio-intelligence-grid">
            <article className="studio-intelligence-card">
              <span>01</span>
              <h3>Trend-aware</h3>
              <p>
                Future Studio generations can be conditioned
                by signals discovered by the Trends engine.
              </p>
            </article>

            <article className="studio-intelligence-card">
              <span>02</span>
              <h3>Vision-aware</h3>
              <p>
                Vision attributes can provide structured
                reference information for new designs.
              </p>
            </article>

            <article className="studio-intelligence-card">
              <span>03</span>
              <h3>Style Engine</h3>
              <p>
                Generated concepts can eventually contribute
                to personalized recommendations.
              </p>
            </article>
          </div>
        </section>

        <section className="studio-pipeline-section">
          <div className="studio-pipeline-card">
            <div className="studio-pipeline-label">
              FASHNOVA CREATIVE PIPELINE
            </div>

            <div className="studio-pipeline">
              <div>
                <span>01</span>
                <strong>Direction</strong>
              </div>

              <span className="studio-pipeline-arrow">→</span>

              <div>
                <span>02</span>
                <strong>Prompt Builder</strong>
              </div>

              <span className="studio-pipeline-arrow">→</span>

              <div>
                <span>03</span>
                <strong>Gen AI</strong>
              </div>

              <span className="studio-pipeline-arrow">→</span>

              <div>
                <span>04</span>
                <strong>Design Output</strong>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="studio-footer">
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

export default Studio;