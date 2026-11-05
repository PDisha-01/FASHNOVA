import { useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import Navbar from "../components/Navbar";
import { uploadVisionImageFile, analyzeVisionImage } from "../services/api";

const COLOR_HEX_MAP = {
  Black: "#1a1a1a",
  White: "#f5f5f5",
  Charcoal: "#36363a",
  Grey: "#7d7d82",
  Silver: "#b8b8bc",
  "Navy Blue": "#101e42",
  Blue: "#214a93",
  "Royal Blue": "#1a39b3",
  "Sky Blue": "#78b8e6",
  Teal: "#008080",
  "Emerald Green": "#126338",
  Emerald: "#126338",
  Green: "#1e7e34",
  Olive: "#5e6328",
  Burgundy: "#571226",
  Maroon: "#68141e",
  Red: "#a81620",
  Pink: "#db7093",
  Rose: "#a9546c",
  Beige: "#d2c4b0",
  Cream: "#ede6d3",
  Ivory: "#f4f1e4",
  Camel: "#b88349",
  Brown: "#6b4023",
  "Coffee Brown": "#442718",
  Yellow: "#dfb928",
  Mustard: "#c2911b",
  Gold: "#c5a038",
  Orange: "#d85e1e",
  Purple: "#632778",
  Lavender: "#a384c2",
};

const SAMPLE_ATTIRES = [
  {
    title: "Tailored Menswear Suit",
    fileName: "mens-tailored-suit.jpg",
    src: "/fashion/runway-tailoring.jpg",
    gender: "Men",
  },
  {
    title: "Festive Silk Kurta",
    fileName: "mens-festive-kurta.jpg",
    src: "/fashion/outfit-festive-kurta.jpg",
    gender: "Men",
  },
  {
    title: "Emerald Silk Gown",
    fileName: "womens-emerald-dress.jpg",
    src: "/fashion/studio-dress-emerald.jpg",
    gender: "Women",
  },
  {
    title: "Festive Sharara Ensemble",
    fileName: "festive-sharara-women.jpg",
    src: "/fashion/outfit-festive-sharara.jpg",
    gender: "Women",
  },
  {
    title: "Cyber Streetwear Jacket",
    fileName: "unisex-streetwear-cyber.jpg",
    src: "/fashion/studio-streetwear-cyber.jpg",
    gender: "Unisex",
  },
  {
    title: "Classic Camel Trench",
    fileName: "camel-trench-coat.jpg",
    src: "/fashion/studio-trench-camel.jpg",
    gender: "Unisex",
  },
];

function Vision() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("idle");
  const [uploadError, setUploadError] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [styleFocus, setStyleFocus] = useState("Auto");

  const processImage = async (file, customName) => {
    const preview = URL.createObjectURL(file);
    const fileName = customName || file.name;

    setSelectedImage({
      file: { name: fileName },
      preview,
    });

    setUploadStatus("uploading");
    setUploadError("");
    setUploadedImage(null);
    setAnalysis(null);

    try {
      const formData = new FormData();
      formData.append("image", file, fileName);
      formData.append("category", "FULL_OUTFIT");
      if (styleFocus && styleFocus !== "Auto") {
        formData.append("targetGender", styleFocus);
      }

      const imageData = await uploadVisionImageFile(formData);
      setUploadedImage(imageData);

      setUploadStatus("analyzing");

      const analysisResult = await analyzeVisionImage(
        imageData.fashionImage.id,
        styleFocus
      );

      setAnalysis(analysisResult.analysis);
      setUploadStatus("complete");
    } catch (error) {
      console.error("Vision processing error:", error);
      setUploadStatus("error");
      setUploadError(error.message || "Unable to process the image.");
    }
  };

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      alert("Please select a JPG, PNG, or WEBP image.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Image must be smaller than 10 MB.");
      return;
    }

    await processImage(file, file.name);
  };

  const handleStyleFocusChange = async (newFocus) => {
    setStyleFocus(newFocus);
    if (uploadedImage?.fashionImage?.id) {
      try {
        setUploadStatus("analyzing");
        const analysisResult = await analyzeVisionImage(
          uploadedImage.fashionImage.id,
          newFocus
        );
        setAnalysis(analysisResult.analysis);
        setUploadStatus("complete");
      } catch (err) {
        console.error("Re-analysis error:", err);
        setUploadStatus("error");
      }
    }
  };

  const handleSampleSelect = async (sample) => {
    try {
      setUploadStatus("uploading");
      const response = await fetch(sample.src);
      const blob = await response.blob();
      const file = new File([blob], sample.fileName, { type: "image/jpeg" });
      await processImage(file, sample.fileName);
    } catch (err) {
      console.error("Failed to load sample attire:", err);
      setUploadError("Could not load sample attire.");
      setUploadStatus("error");
    }
  };

  const removeImage = () => {
    if (selectedImage?.preview) {
      URL.revokeObjectURL(selectedImage.preview);
    }

    setSelectedImage(null);
    setUploadedImage(null);
    setAnalysis(null);
    setUploadStatus("idle");
    setUploadError("");
  };

  const getStatusText = () => {
    switch (uploadStatus) {
      case "uploading":
        return "UPLOADING IMAGE...";
      case "analyzing":
        return "EXTRACTING ATTIRE ATTRIBUTES...";
      case "analysis-pending":
        return "ANALYSIS IN PROGRESS...";
      case "complete":
        return "ATTRIBUTES EXTRACTED";
      case "error":
        return "PROCESSING FAILED";
      default:
        return "READY FOR ANALYSIS";
    }
  };

  return (
    <div className="app vision-page">
      {/* =========================
          NAVBAR
      ========================= */}
      <Navbar />

      <main>
        {/* =========================
            VISION HERO
        ========================= */}
        <section className="vision-hero">
          <div className="vision-hero-content">
            <p className="section-label">01 / COMPUTER VISION</p>

            <h1>
              See fashion
              <br />
              <span>as data.</span>
            </h1>

            <p>
              FASHNOVA Vision uses multi-task computer vision to extract
              structured fashion attributes — gender silhouette, garment
              classification, color signature, and usage — directly from your
              uploaded attire.
            </p>
          </div>

          <div className="vision-hero-index">
            <span>VISION</span>
            <strong>01</strong>
          </div>
        </section>

        {/* =========================
            UPLOAD / ANALYSIS
        ========================= */}
        <section className="vision-upload-section">
          <div className="vision-section-heading">
            <p className="section-label">IMAGE ANALYSIS</p>

            <h2>
              Analyze any attire.
              <br />
              <span>Precision fashion attributes.</span>
            </h2>

            <p>
              Upload any fashion photograph — Menswear, Womenswear, or Unisex
              Streetwear — and our vision analyzer extracts matching garment
              data with zero gender bias.
            </p>
          </div>

          <div className="vision-upload-card">
            {/* STYLE FOCUS SELECTOR */}
            <div className="vision-style-focus-selector">
              <span className="vision-style-focus-label">
                STYLE FOCUS / TARGET GENDER
              </span>
              <div className="vision-style-focus-pills">
                {[
                  { id: "Auto", label: "Auto-Detect Attire (AI)" },
                  { id: "Men", label: "Menswear" },
                  { id: "Women", label: "Womenswear" },
                  { id: "Unisex", label: "Unisex / Streetwear" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    className={`vision-focus-pill ${
                      styleFocus === tab.id ? "active" : ""
                    }`}
                    onClick={() => handleStyleFocusChange(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {!selectedImage ? (
              <>
                <label className="vision-dropzone">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageChange}
                    hidden
                  />

                  <div className="upload-icon">+</div>

                  <strong>Upload Fashion Photo</strong>

                  <p>JPG, PNG or WEBP (up to 10 MB)</p>

                  <span>Click to browse from your device</span>
                </label>

                {/* QUICK ATTIRE TEST SAMPLES */}
                <div className="vision-sample-chips">
                  <span className="vision-sample-chips-title">
                    OR TEST WITH ONE-CLICK FASHION ATTIRES:
                  </span>
                  <div className="vision-sample-chips-row">
                    {SAMPLE_ATTIRES.map((sample, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className="vision-chip-btn"
                        onClick={() => handleSampleSelect(sample)}
                      >
                        ✦ {sample.title}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="vision-preview">
                <img src={selectedImage.preview} alt="Selected fashion" />

                <div className="vision-preview-info">
                  <div>
                    <span>SELECTED ATTIRE</span>
                    <strong>{selectedImage.file.name}</strong>
                  </div>

                  <button type="button" onClick={removeImage}>
                    Change Photo
                  </button>
                </div>

                {/* LIVE PROCESSING STATUS */}
                <div className="vision-live-status">
                  <span>VISION ENGINE</span>
                  <strong>{getStatusText()}</strong>

                  {uploadStatus === "uploading" && (
                    <p>Uploading attire image to FASHNOVA Vision...</p>
                  )}

                  {uploadStatus === "analyzing" && (
                    <p>
                      Analyzing garment silhouette, gender markers, color
                      palette, and category attributes...
                    </p>
                  )}

                  {uploadStatus === "complete" && (
                    <p>
                      Attire attributes successfully extracted. See structured
                      breakdown below.
                    </p>
                  )}

                  {uploadStatus === "error" && <p>{uploadError}</p>}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* =========================
            WHAT VISION ANALYZES
        ========================= */}
        <section className="vision-analysis-section">
          <div className="vision-section-heading">
            <p className="section-label">WHAT THE MODEL UNDERSTANDS</p>

            <h2>
              From pixels
              <br />
              <span>to fashion attributes.</span>
            </h2>
          </div>

          <div className="vision-attribute-grid">
            <article>
              <span>01</span>
              <h3>GENDER & SILHOUETTE</h3>
              <p>
                Accurately detects Menswear, Womenswear, or Unisex silhouettes
                from tailoring and garment form.
              </p>
            </article>

            <article>
              <span>02</span>
              <h3>GARMENT CLASSIFICATION</h3>
              <p>
                Identifies shirts, suits, blazers, kurtas, dresses, lehengas,
                trousers, outerwear, and accessories.
              </p>
            </article>

            <article>
              <span>03</span>
              <h3>COLOR SIGNATURE</h3>
              <p>
                Extracts the true dominant color palette directly from the
                garment fabric.
              </p>
            </article>

            <article>
              <span>04</span>
              <h3>USAGE & OCCASION</h3>
              <p>
                Determines occasion context across Formal, Ethnic Festive, Casual
                Streetwear, and Evening Party.
              </p>
            </article>

            <article>
              <span>05</span>
              <h3>SEASONAL ALIGNMENT</h3>
              <p>
                Infers seasonal relevance across Summer, Winter, Fall, and
                Spring collections.
              </p>
            </article>

            <article>
              <span>06</span>
              <h3>MULTI-TASK INTELLIGENCE</h3>
              <p>
                Calibrated across joint hierarchical representations to eliminate
                single-category bias.
              </p>
            </article>
          </div>
        </section>

        {/* =========================
            AI PIPELINE
        ========================= */}
        <section className="vision-pipeline-section">
          <div className="vision-section-heading">
            <p className="section-label">COMPUTER VISION PIPELINE</p>

            <h2>
              Image
              <br />
              <span>→ intelligence.</span>
            </h2>
          </div>

          <div className="vision-pipeline">
            <div className="vision-pipeline-step">
              <span>01</span>
              <strong>IMAGE INPUT</strong>
              <p>Fashion photo enters the Vision system.</p>
            </div>

            <div className="vision-pipeline-arrow">→</div>

            <div className="vision-pipeline-step">
              <span>02</span>
              <strong>PREPROCESSING</strong>
              <p>Garment region cropping & color normalization.</p>
            </div>

            <div className="vision-pipeline-arrow">→</div>

            <div className="vision-pipeline-step">
              <span>03</span>
              <strong>MULTI-TASK CV</strong>
              <p>CLIP visual transformer & calibrated attribute heads.</p>
            </div>

            <div className="vision-pipeline-arrow">→</div>

            <div className="vision-pipeline-step">
              <span>04</span>
              <strong>ATTRIBUTES</strong>
              <p>Structured fashion metadata ready for Style Engine.</p>
            </div>
          </div>
        </section>

        {/* =========================
            DYNAMIC STRUCTURED OUTPUT
        ========================= */}
        <section className="vision-output-section">
          <div>
            <p className="section-label">STRUCTURED OUTPUT</p>

            <h2>
              What FASHNOVA
              <br />
              <span>learned from this attire.</span>
            </h2>
          </div>

          <div className="vision-output-card">
            <div>
              <span>STATUS</span>
              <strong>{getStatusText()}</strong>
            </div>

            <div>
              <span>INPUT</span>
              <strong>
                {selectedImage ? selectedImage.file.name : "NO IMAGE SELECTED"}
              </strong>
            </div>

            <div>
              <span>MODEL</span>
              <strong>{analysis?.modelName || "FASHNOVA VISION AI"}</strong>
            </div>

            <div>
              <span>OUTPUT</span>
              <strong>
                {analysis ? "FASHION ATTRIBUTES" : "WAITING FOR ANALYSIS"}
              </strong>
            </div>
          </div>

          {/* =========================
              ANALYSIS RESULT PANEL
          ========================= */}
          {selectedImage && (
            <div className="vision-analysis-result">
              <div className="vision-analysis-result-header">
                <div>
                  <span>VISION ANALYSIS</span>
                  <h3>
                    {analysis
                      ? "Attire attributes successfully detected."
                      : "Analysis in progress..."}
                  </h3>
                </div>

                <strong
                  className={`vision-result-status ${
                    analysis?.status?.toLowerCase() || "processing"
                  }`}
                >
                  {analysis?.status || "PROCESSING"}
                </strong>
              </div>

              {/* MODEL ATTRIBUTES */}
              {analysis?.attributes ? (
                <div className="vision-model-results">
                  <div className="vision-results-intro">
                    <div>
                      <span>AI DETECTION RESULTS</span>
                      <h4>What the Vision model sees</h4>
                    </div>

                    <p>
                      FASHNOVA Vision extracted genuine structured attributes
                      matching the uploaded photograph.
                    </p>
                  </div>

                  <div className="vision-result-grid">
                    {/* GENDER */}
                    <article className="vision-result-item">
                      <span>GENDER</span>
                      <strong className="vision-gender-label">
                        {analysis.attributes.gender?.label || "—"}
                      </strong>

                      {analysis.attributes.gender?.confidence != null && (
                        <div className="vision-confidence">
                          <div className="vision-confidence-bar">
                            <span
                              style={{
                                width: `${
                                  analysis.attributes.gender.confidence * 100
                                }%`,
                              }}
                            />
                          </div>
                          <small>
                            {(
                              analysis.attributes.gender.confidence * 100
                            ).toFixed(1)}
                            % confidence
                          </small>
                        </div>
                      )}
                    </article>

                    {/* MASTER CATEGORY */}
                    <article className="vision-result-item">
                      <span>CATEGORY</span>
                      <strong>
                        {analysis.attributes.masterCategory?.label || "—"}
                      </strong>

                      {analysis.attributes.masterCategory?.confidence !=
                        null && (
                        <div className="vision-confidence">
                          <div className="vision-confidence-bar">
                            <span
                              style={{
                                width: `${
                                  analysis.attributes.masterCategory
                                    .confidence * 100
                                }%`,
                              }}
                            />
                          </div>
                          <small>
                            {(
                              analysis.attributes.masterCategory.confidence *
                              100
                            ).toFixed(1)}
                            % confidence
                          </small>
                        </div>
                      )}
                    </article>

                    {/* SUBCATEGORY */}
                    <article className="vision-result-item">
                      <span>SUBCATEGORY</span>
                      <strong>
                        {analysis.attributes.subCategory?.label || "—"}
                      </strong>

                      {analysis.attributes.subCategory?.confidence != null && (
                        <div className="vision-confidence">
                          <div className="vision-confidence-bar">
                            <span
                              style={{
                                width: `${
                                  analysis.attributes.subCategory.confidence *
                                  100
                                }%`,
                              }}
                            />
                          </div>
                          <small>
                            {(
                              analysis.attributes.subCategory.confidence * 100
                            ).toFixed(1)}
                            % confidence
                          </small>
                        </div>
                      )}
                    </article>

                    {/* ARTICLE TYPE */}
                    <article className="vision-result-item">
                      <span>ARTICLE TYPE</span>
                      <strong>
                        {analysis.attributes.articleType?.label || "—"}
                      </strong>

                      {analysis.attributes.articleType?.confidence != null && (
                        <div className="vision-confidence">
                          <div className="vision-confidence-bar">
                            <span
                              style={{
                                width: `${
                                  analysis.attributes.articleType.confidence *
                                  100
                                }%`,
                              }}
                            />
                          </div>
                          <small>
                            {(
                              analysis.attributes.articleType.confidence * 100
                            ).toFixed(1)}
                            % confidence
                          </small>
                        </div>
                      )}
                    </article>

                    {/* BASE COLOUR */}
                    <article className="vision-result-item">
                      <span>BASE COLOUR</span>

                      <div className="vision-color-result">
                        <span
                          className="vision-color-dot"
                          style={{
                            backgroundColor:
                              COLOR_HEX_MAP[
                                analysis.attributes.baseColour?.label
                              ] || "#1a1a1a",
                          }}
                        />
                        <strong>
                          {analysis.attributes.baseColour?.label || "—"}
                        </strong>
                      </div>

                      {analysis.attributes.baseColour?.confidence != null && (
                        <div className="vision-confidence">
                          <div className="vision-confidence-bar">
                            <span
                              style={{
                                width: `${
                                  analysis.attributes.baseColour.confidence *
                                  100
                                }%`,
                              }}
                            />
                          </div>
                          <small>
                            {(
                              analysis.attributes.baseColour.confidence * 100
                            ).toFixed(1)}
                            % confidence
                          </small>
                        </div>
                      )}
                    </article>

                    {/* SEASON */}
                    <article className="vision-result-item">
                      <span>SEASON</span>
                      <strong>
                        {analysis.attributes.season?.label || "—"}
                      </strong>

                      {analysis.attributes.season?.confidence != null && (
                        <div className="vision-confidence">
                          <div className="vision-confidence-bar">
                            <span
                              style={{
                                width: `${
                                  analysis.attributes.season.confidence * 100
                                }%`,
                              }}
                            />
                          </div>
                          <small>
                            {(
                              analysis.attributes.season.confidence * 100
                            ).toFixed(1)}
                            % confidence
                          </small>
                        </div>
                      )}
                    </article>

                    {/* USAGE */}
                    <article className="vision-result-item">
                      <span>USAGE</span>
                      <strong>{analysis.attributes.usage?.label || "—"}</strong>

                      {analysis.attributes.usage?.confidence != null && (
                        <div className="vision-confidence">
                          <div className="vision-confidence-bar">
                            <span
                              style={{
                                width: `${
                                  analysis.attributes.usage.confidence * 100
                                }%`,
                              }}
                            />
                          </div>
                          <small>
                            {(
                              analysis.attributes.usage.confidence * 100
                            ).toFixed(1)}
                            % confidence
                          </small>
                        </div>
                      )}
                    </article>

                    {/* MODEL */}
                    <article className="vision-result-item vision-result-model">
                      <span>VISION MODEL</span>
                      <strong>
                        {analysis.modelName || "FASHNOVA VISION AI"}
                      </strong>
                      <small>Version {analysis.modelVersion || "0.2.0"}</small>
                    </article>
                  </div>
                </div>
              ) : (
                <div className="vision-results-empty">
                  <span>VISION ENGINE</span>
                  <strong>Waiting for model output...</strong>
                  <p>
                    Structured fashion attributes will appear here once the
                    Vision model completes inference.
                  </p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* =========================
            STYLE ENGINE CONNECTION
        ========================= */}
        <section className="vision-engine-section">
          <p className="section-label">VISION → STYLE ENGINE</p>

          <h2>
            What Vision sees
            <br />
            <span>can influence what FASHNOVA recommends.</span>
          </h2>

          <p>
            Vision is not an isolated image analyzer. Its structured fashion
            understanding feeds directly into the Style Engine to generate
            personalized ensemble recommendations matching your attire.
          </p>

          <Link to="/style-engine" className="primary-button">
            Explore Matching Ensembles in Style Engine
            <span>→</span>
          </Link>
        </section>
      </main>

      {/* =========================
          FOOTER
      ========================= */}
      <footer>
        <div className="footer-brand">
          <span>FASHNOVA</span>
          <p>FASHION MEETS INTELLIGENCE</p>
        </div>

        <p>AI + ML Fashion Intelligence Platform</p>
        <span>© 2026 FASHNOVA</span>
        <span>all rights reserved</span>
      </footer>
    </div>
  );
}

export default Vision;
