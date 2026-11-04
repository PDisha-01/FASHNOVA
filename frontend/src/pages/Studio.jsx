import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../App.css";
import Navbar from "../components/Navbar";
import { generateStudioDesign } from "../services/api";

const STUDIO_PRESETS = [
  {
    label: "Crimson Couture Gown",
    prompt: "Haute couture sculptural evening gown in crimson and rose silk with architectural shoulder drapery",
    garment: "Sculptural Silk Gown",
    category: "Eveningwear",
    aesthetic: "Haute Couture",
    season: "Fall / Winter",
    colors: "Crimson, Dusty Rose, Pearl, Noir",
    pattern: "Solid Micro-Sheen",
    fabric: "Silk Charmeuse & Organza",
  },
  {
    label: "Ivory Minimalist Blazer",
    prompt: "Oversized ivory structured wool blazer with architectural peak lapels and tailored minimal silhouette",
    garment: "Structured Wool Blazer",
    category: "Tailoring",
    aesthetic: "Minimalist Architectural",
    season: "Autumn / Winter",
    colors: "Pristine Ivory, Warm Sand, Espresso",
    pattern: "Solid Weave",
    fabric: "Double-Faced Melton Wool",
  },
  {
    label: "Liquid Metallic Trench",
    prompt: "Avant-garde metallic silver and black liquid trench coat with architectural storm flaps and high futuristic collar",
    garment: "Liquid Metallic Trench Coat",
    category: "Outerwear",
    aesthetic: "Avant-Garde Neo-Luxury",
    season: "Spring / Forward",
    colors: "Metallic Silver, Pitch Noir, Chrome",
    pattern: "Liquid Reflective",
    fabric: "Liquid Metallic Membrane & Nylon",
  },
  {
    label: "Emerald Silk Satin Gown",
    prompt: "Emerald green silk satin couture evening gown with sculptural asymmetrical one-shoulder drapery",
    garment: "Asymmetrical Draped Gown",
    category: "Eveningwear",
    aesthetic: "Haute Couture Red Carpet",
    season: "Spring / Summer",
    colors: "Deep Emerald, Forest Satin, Jade Mist",
    pattern: "Solid Satin Luster",
    fabric: "Italian Silk Satin",
  },
  {
    label: "Monochrome Power Suit",
    prompt: "Monochrome double-breasted tailored pantsuit with contrasting chalk-white peak lapels and razor-pleated trousers",
    garment: "Double-Breasted Power Suit",
    category: "Tailoring",
    aesthetic: "Modernist Sharp Suiting",
    season: "All-Season",
    colors: "Onyx Black, Crisp Chalk, Slate",
    pattern: "Matte Fine Suiting Weave",
    fabric: "Super 140s Virgin Wool",
  },
  {
    label: "Burgundy Velvet Corset",
    prompt: "Avant-garde structured burgundy velvet corset with sharp peplum waist flared over high-rise bespoke tailored trousers",
    garment: "Structured Peplum Corset",
    category: "Corsetry",
    aesthetic: "Architectural Corsetry",
    season: "Winter Couture",
    colors: "Burgundy Velvet, Royal Rose, Black Caviar",
    pattern: "Deep-Pile Velvet",
    fabric: "Silk-Cotton Velvet & Featherweight Boning",
  },
  {
    label: "Camel Wool Trench",
    prompt: "Architectural oversized camel wool trench coat with statement storm flaps and wide cinched belt",
    garment: "Oversized Wool Trench",
    category: "Outerwear",
    aesthetic: "Quiet Luxury Outerwear",
    season: "Winter",
    colors: "Rich Camel, Golden Ochre, Dark Espresso",
    pattern: "Brushed Cashmere Soft Finish",
    fabric: "Mongolian Camel Hair & Cashmere",
  },
  {
    label: "Cyber-Tailored Streetwear",
    prompt: "Futuristic technical cyber-tailored jacket with high sculpted funnel collar, angled storm flap, and reflective detailing",
    garment: "Cyber-Tailored Technical Jacket",
    category: "Streetwear",
    aesthetic: "Avant-Garde Neo-Streetwear",
    season: "All-Season",
    colors: "Carbon Black, Industrial Steel, Chrome",
    pattern: "Technical Geometric Panel",
    fabric: "Bonded Technical Nylon & Metal",
  },
  {
    label: "Plissé Champagne Resort",
    prompt: "Micro-pleated plissé champagne silk maxi dress with fluid drape and elegant sculptural neckline",
    garment: "Plissé Silk Maxi Dress",
    category: "Resort",
    aesthetic: "Contemporary Luxury Resort",
    season: "High Summer",
    colors: "Champagne Plissé, Golden Sand, Umber",
    pattern: "Accordion Micro-Plissé",
    fabric: "100% Micro-Pleated Silk Chiffon",
  },
];

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

  const location = useLocation();

  useEffect(() => {
    if (location.state?.presetPrompt) {
      setPrompt(location.state.presetPrompt);
      if (location.state.garment) setGarment(location.state.garment);
      if (location.state.category) setCategory(location.state.category);
      if (location.state.aesthetic) setAesthetic(location.state.aesthetic);
      setError("");
    }
  }, [location.state]);

  const applyPreset = (preset) => {
    setPrompt(preset.prompt);
    setGarment(preset.garment);
    setCategory(preset.category);
    setAesthetic(preset.aesthetic);
    setSeason(preset.season);
    setColors(preset.colors);
    setPattern(preset.pattern);
    setFabric(preset.fabric);
    setError("");
  };

  const handleGenerate = async (event) => {
    event.preventDefault();

    if (!prompt.trim()) {
      setError("Please describe the attire or fashion design you want to create.");
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
      const data = await generateStudioDesign({
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
      });

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

  // Resolve displayable image from base64 data or image URL
  const displayImage = result?.image_data
    ? (result.image_data.startsWith("data:") || result.image_data.startsWith("http")
        ? result.image_data
        : `data:image/jpeg;base64,${result.image_data}`)
    : result?.image_url || null;

  return (
    <div className="studio-page">
      <Navbar />

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
              Turn creative direction into high-fashion design
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

        {/* Editorial Presets */}
        <section className="studio-presets-section">
          <div className="studio-presets-header">
            <span>PROMPT INSPIRATION EXAMPLES</span>
            <small>CLICK TO FILL OR TYPE YOUR OWN ATTENTION-GRABBING ATTIRE BELOW</small>
          </div>
          <div className="studio-presets-chips">
            {STUDIO_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                className="studio-preset-chip"
                onClick={() => applyPreset(preset)}
              >
                ✦ {preset.label}
              </button>
            ))}
          </div>
        </section>

        <section className="studio-workspace">
          <div className="studio-section-heading">
            <div>
              <p className="studio-section-label">01 · CREATE</p>
              <h2>Creative Direction</h2>
            </div>

            <p>
              Describe any attire, outfit, or garment you want to design.
              Studio uses generative AI to design your exact custom attire.
            </p>
          </div>

          <form
            className="studio-generator"
            onSubmit={handleGenerate}
          >
            <div className="studio-generator-main">
              <label className="studio-field studio-prompt-field">
                <span>Custom design prompt</span>

                <textarea
                  value={prompt}
                  onChange={(event) =>
                    setPrompt(event.target.value)
                  }
                  placeholder="Describe any attire or fashion design you want to create (e.g., A royal blue silk saree with gold embroidery, or a cyber punk neon green leather jacket with spikes)..."
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
                    placeholder="e.g. evening gown"
                  />
                </label>

                <label className="studio-field">
                  <span>Category</span>
                  <input
                    value={category}
                    onChange={(event) =>
                      setCategory(event.target.value)
                    }
                    placeholder="e.g. haute couture"
                  />
                </label>

                <label className="studio-field">
                  <span>Aesthetic</span>
                  <input
                    value={aesthetic}
                    onChange={(event) =>
                      setAesthetic(event.target.value)
                    }
                    placeholder="e.g. contemporary luxury"
                  />
                </label>

                <label className="studio-field">
                  <span>Season</span>
                  <input
                    value={season}
                    onChange={(event) =>
                      setSeason(event.target.value)
                    }
                    placeholder="e.g. fall / winter"
                  />
                </label>

                <label className="studio-field">
                  <span>Color palette</span>
                  <input
                    value={colors}
                    onChange={(event) =>
                      setColors(event.target.value)
                    }
                    placeholder="e.g. crimson, dusty rose, pearl"
                  />
                </label>

                <label className="studio-field">
                  <span>Pattern</span>
                  <input
                    value={pattern}
                    onChange={(event) =>
                      setPattern(event.target.value)
                    }
                    placeholder="e.g. micro-sheen"
                  />
                </label>

                <label className="studio-field">
                  <span>Fabric</span>
                  <input
                    value={fabric}
                    onChange={(event) =>
                      setFabric(event.target.value)
                    }
                    placeholder="e.g. silk charmeuse"
                  />
                </label>
              </div>
            </div>

            {error && (
              <p className="studio-error">{error}</p>
            )}

            <button
              type="submit"
              className="studio-submit-button"
              disabled={loading}
            >
              {loading
                ? "Generating Custom Attire with AI..."
                : "Generate Custom Attire ↗"}
            </button>
          </form>
        </section>

        <section className="studio-output-section">
          <div className="studio-section-heading">
            <div>
              <p className="studio-section-label">
                02 · OUTPUT
              </p>
              <h2>Custom Design Output</h2>
            </div>

            <p>
              Your custom fashion attire generated in real-time from your exact prompt.
            </p>
          </div>

          <div className="studio-output">
            {loading ? (
              <div className="studio-output-empty">
                <span className="studio-output-index">
                  GENERATING ATTIRE
                </span>

                <h3>
                  Studio is designing
                  <br />
                  your custom attire.
                </h3>

                <p>
                  Generating photorealistic fashion design specifically matching: "{prompt}"
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
                      {result.metadata?.garment || result.generation_type}
                    </h3>
                  </div>

                  <span className="studio-result-model">
                    {result.model || "FASHNOVA-Studio"}
                  </span>
                </div>

                {displayImage ? (
                  <div className="studio-generated-image">
                    <img
                      src={displayImage}
                      alt={result.metadata?.garment || "Generated fashion design"}
                    />
                    <div className="studio-image-overlay-actions">
                      <a
                        href={displayImage}
                        download={`fashnova-design-${Date.now()}.jpg`}
                        target="_blank"
                        rel="noreferrer"
                        className="studio-download-btn"
                      >
                        DOWNLOAD HIGH-RES CONCEPT ↗
                      </a>
                    </div>
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

                {/* Rich Fashion Intelligence Metadata Card */}
                {result.metadata && (
                  <div className="studio-concept-intel">
                    <div className="studio-intel-grid">
                      {result.metadata.silhouette && (
                        <div className="studio-intel-item">
                          <span>SILHOUETTE</span>
                          <strong>{result.metadata.silhouette}</strong>
                        </div>
                      )}
                      {result.metadata.aesthetic && (
                        <div className="studio-intel-item">
                          <span>AESTHETIC</span>
                          <strong>{result.metadata.aesthetic}</strong>
                        </div>
                      )}
                      {result.metadata.fabric && (
                        <div className="studio-intel-item">
                          <span>FABRIC</span>
                          <strong>{result.metadata.fabric}</strong>
                        </div>
                      )}
                      {result.metadata.pattern && (
                        <div className="studio-intel-item">
                          <span>PATTERN</span>
                          <strong>{result.metadata.pattern}</strong>
                        </div>
                      )}
                    </div>

                    {result.metadata.palette && result.metadata.palette.length > 0 && (
                      <div className="studio-intel-palette">
                        <span>COLOR HARMONY</span>
                        <div className="studio-palette-chips">
                          {result.metadata.palette.map((item, idx) => (
                            <div key={idx} className="studio-palette-chip">
                              <span
                                className="studio-swatch-dot"
                                style={{ backgroundColor: item.hex }}
                              ></span>
                              <small>{item.name} ({item.hex})</small>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {result.metadata.design_notes && (
                      <div className="studio-intel-notes">
                        <span>EDITORIAL ANALYSIS</span>
                        <p>{result.metadata.design_notes}</p>
                      </div>
                    )}
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
                  AWAITING CREATIVE DIRECTION
                </span>

                <h3>
                  Design any
                  <br />
                  attire you imagine.
                </h3>

                <p>
                  Type any custom attire, outfit, or silhouette above. Studio will generate
                  your exact fashion design in real-time.
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
                Studio generations can be conditioned
                by signals discovered by the Trends engine.
              </p>
            </article>

            <article className="studio-intelligence-card">
              <span>02</span>
              <h3>Vision-aware</h3>
              <p>
                Vision attributes provide structured
                reference information for new designs.
              </p>
            </article>

            <article className="studio-intelligence-card">
              <span>03</span>
              <h3>Style Engine</h3>
              <p>
                Generated concepts feed directly
                into personalized recommendations.
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
