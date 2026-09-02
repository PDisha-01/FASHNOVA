import { useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";

const API_URL = "http://localhost:5000";

function Vision() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("idle");
  const [uploadError, setUploadError] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (
      !["image/jpeg", "image/png", "image/webp"].includes(file.type)
    ) {
      alert("Please select a JPG, PNG, or WEBP image.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Image must be smaller than 10 MB.");
      return;
    }

    const preview = URL.createObjectURL(file);

    setSelectedImage({
      file,
      preview,
    });

    setUploadStatus("uploading");
    setUploadError("");
    setUploadedImage(null);
    setAnalysis(null);

    try {
      // =========================
      // UPLOAD IMAGE
      // =========================

      const formData = new FormData();

      formData.append("image", file);

      // Required by the current backend schema.
      // Later the Vision model can determine this automatically.
      formData.append("category", "FULL_OUTFIT");

      const uploadResponse = await fetch(
        `${API_URL}/api/vision/images`,
        {
          method: "POST",
          body: formData,
        }
      );

      const uploadResult = await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(
          uploadResult?.error?.message ||
            "Image upload failed."
        );
      }

      const imageData = uploadResult.data;

      setUploadedImage(imageData);
      setUploadStatus("uploaded");

      // =========================
      // START VISION ANALYSIS
      // =========================

      setUploadStatus("analyzing");

      const analysisResponse = await fetch(
        `${API_URL}/api/vision/analyze`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fashionImageId: imageData.fashionImage.id,
          }),
        }
      );

      const analysisResult = await analysisResponse.json();

      if (!analysisResponse.ok) {
        throw new Error(
          analysisResult?.error?.message ||
            "Vision analysis could not be started."
        );
      }

      setAnalysis(analysisResult.data.analysis);

      // The current backend creates a PENDING analysis.
      // It will become COMPLETED once the real CV model is implemented.
      setUploadStatus("analysis-pending");
    } catch (error) {
      console.error("Vision processing error:", error);

      setUploadStatus("error");
      setUploadError(
        error.message || "Unable to process the image."
      );
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
        return "ANALYZING IMAGE...";

      case "analysis-pending":
        return "ANALYSIS QUEUED";

      case "complete":
        return "ANALYSIS COMPLETE";

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

      <header className="navbar">
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
        </nav>

        <Link to="/profile" className="profile-button">
          Profile
        </Link>
      </header>


      <main>

        {/* =========================
            VISION HERO
        ========================= */}

        <section className="vision-hero">

          <div className="vision-hero-content">

            <p className="section-label">
              01 / COMPUTER VISION
            </p>

            <h1>
              See fashion
              <br />
              <span>as data.</span>
            </h1>

            <p>
              FASHNOVA Vision uses computer vision to transform
              fashion images into structured information that the
              intelligence system can understand.
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

            <p className="section-label">
              IMAGE ANALYSIS
            </p>

            <h2>
              Give FASHNOVA
              <br />
              <span>something to see.</span>
            </h2>

            <p>
              Upload a fashion image and let the Vision system
              prepare it for computer-vision analysis.
            </p>

          </div>


          <div className="vision-upload-card">

            {!selectedImage ? (

              <label className="vision-dropzone">

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  hidden
                />

                <div className="upload-icon">
                  +
                </div>

                <strong>
                  Upload Fashion Image
                </strong>

                <p>
                  JPG, PNG or WEBP
                </p>

                <span>
                  Click to browse
                </span>

              </label>

            ) : (

              <div className="vision-preview">

                <img
                  src={selectedImage.preview}
                  alt="Selected fashion"
                />

                <div className="vision-preview-info">

                  <div>
                    <span>SELECTED IMAGE</span>

                    <strong>
                      {selectedImage.file.name}
                    </strong>
                  </div>

                  <button
                    type="button"
                    onClick={removeImage}
                  >
                    Remove
                  </button>

                </div>

                {/* =========================
                    LIVE PROCESSING STATUS
                ========================= */}

                <div className="vision-live-status">

                  <span>
                    VISION ENGINE
                  </span>

                  <strong>
                    {getStatusText()}
                  </strong>

                  {uploadStatus === "uploading" && (
                    <p>
                      Uploading your image to the FASHNOVA
                      Vision system.
                    </p>
                  )}

                  {uploadStatus === "analyzing" && (
                    <p>
                      Computer Vision is preparing the image
                      for attribute extraction.
                    </p>
                  )}

                  {uploadStatus === "analysis-pending" && (
                    <p>
                      Your image has entered the Vision
                      analysis pipeline.
                    </p>
                  )}

                  {uploadStatus === "complete" && (
                    <p>
                      Fashion attributes have been extracted.
                    </p>
                  )}

                  {uploadStatus === "error" && (
                    <p>
                      {uploadError}
                    </p>
                  )}

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

            <p className="section-label">
              WHAT THE MODEL UNDERSTANDS
            </p>

            <h2>
              From pixels
              <br />
              <span>to fashion attributes.</span>
            </h2>

          </div>


          <div className="vision-attribute-grid">

            <article>
              <span>01</span>
              <h3>GARMENTS</h3>
              <p>
                Identify visible fashion items and their regions
                within the image.
              </p>
            </article>

            <article>
              <span>02</span>
              <h3>CLASSIFICATION</h3>
              <p>
                Classify clothing categories such as shirts,
                dresses, trousers, jackets, and accessories.
              </p>
            </article>

            <article>
              <span>03</span>
              <h3>COLORS</h3>
              <p>
                Extract dominant and supporting colors from
                fashion objects.
              </p>
            </article>

            <article>
              <span>04</span>
              <h3>PATTERNS</h3>
              <p>
                Detect visual characteristics such as solid,
                striped, floral, checked, or printed patterns.
              </p>
            </article>

            <article>
              <span>05</span>
              <h3>FIT & STYLE</h3>
              <p>
                Estimate fashion attributes such as silhouette,
                fit, styling direction, and visual character.
              </p>
            </article>

            <article>
              <span>06</span>
              <h3>SEASON</h3>
              <p>
                Infer seasonal relevance using visual fashion
                characteristics.
              </p>
            </article>

          </div>

        </section>


        {/* =========================
            AI PIPELINE
        ========================= */}

        <section className="vision-pipeline-section">

          <div className="vision-section-heading">

            <p className="section-label">
              COMPUTER VISION PIPELINE
            </p>

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
              <p>
                Fashion image enters the Vision system.
              </p>
            </div>

            <div className="vision-pipeline-arrow">
              →
            </div>

            <div className="vision-pipeline-step">
              <span>02</span>
              <strong>PREPROCESSING</strong>
              <p>
                Image is prepared for model inference.
              </p>
            </div>

            <div className="vision-pipeline-arrow">
              →
            </div>

            <div className="vision-pipeline-step">
              <span>03</span>
              <strong>CV INFERENCE</strong>
              <p>
                Computer-vision models extract fashion
                information.
              </p>
            </div>

            <div className="vision-pipeline-arrow">
              →
            </div>

            <div className="vision-pipeline-step">
              <span>04</span>
              <strong>ATTRIBUTES</strong>
              <p>
                Results are converted into structured fashion
                data.
              </p>
            </div>

          </div>

        </section>


        {/* =========================
            DYNAMIC STRUCTURED OUTPUT
        ========================= */}

        <section className="vision-output-section">

          <div>
            <p className="section-label">
              STRUCTURED OUTPUT
            </p>

            <h2>
              What FASHNOVA
              <br />
              <span>learns from the image.</span>
            </h2>
          </div>


          <div className="vision-output-card">

            <div>
              <span>STATUS</span>

              <strong>
                {getStatusText()}
              </strong>
            </div>

            <div>
              <span>INPUT</span>

              <strong>
                {selectedImage
                  ? selectedImage.file.name
                  : "NO IMAGE SELECTED"}
              </strong>
            </div>

            <div>
              <span>MODEL</span>

              <strong>
                {analysis?.modelName || "VISION ENGINE"}
              </strong>
            </div>

            <div>
              <span>OUTPUT</span>

              <strong>
                {analysis
                  ? "FASHION ATTRIBUTES"
                  : "WAITING FOR ANALYSIS"}
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
                    {uploadStatus === "complete"
                      ? "Analysis complete."
                      : "Analysis in progress."}
                  </h3>
                </div>

                <strong>
                  {analysis?.status || "PROCESSING"}
                </strong>

              </div>


              <div className="vision-result-grid">

                <article>
                  <span>CATEGORY</span>

                  <strong>
                    {analysis?.category || "—"}
                  </strong>
                </article>

                <article>
                  <span>COLOR</span>

                  <strong>
                    {analysis?.dominantColor || "—"}
                  </strong>
                </article>

                <article>
                  <span>PATTERN</span>

                  <strong>
                    {analysis?.pattern || "—"}
                  </strong>
                </article>

                <article>
                  <span>FIT</span>

                  <strong>
                    {analysis?.fit || "—"}
                  </strong>
                </article>

                <article>
                  <span>STYLE</span>

                  <strong>
                    {analysis?.style || "—"}
                  </strong>
                </article>

                <article>
                  <span>SEASON</span>

                  <strong>
                    {analysis?.season || "—"}
                  </strong>
                </article>

                <article>
                  <span>CONFIDENCE</span>

                  <strong>
                    {analysis?.confidence
                      ? `${analysis.confidence * 100}%`
                      : "—"}
                  </strong>
                </article>

                <article>
                  <span>ATTRIBUTES</span>

                  <strong>
                    {analysis?.attributes
                      ? "EXTRACTED"
                      : "WAITING"}
                  </strong>
                </article>

              </div>

            </div>
          )}

        </section>


        {/* =========================
            STYLE ENGINE CONNECTION
        ========================= */}

        <section className="vision-engine-section">

          <p className="section-label">
            VISION → STYLE ENGINE
          </p>

          <h2>
            What Vision sees
            <br />
            <span>
              can influence what FASHNOVA recommends.
            </span>
          </h2>

          <p>
            Vision is not an isolated image analyzer. Its
            structured fashion understanding becomes one of the
            intelligence signals available to the Style Engine.
          </p>

          <Link
            to="/"
            className="primary-button"
          >
            Back to FASHNOVA
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

        <p>
          AI + ML Fashion Intelligence Platform
        </p>

        <span>
          © 2026 FASHNOVA
        </span>

        <span>
          all rights reserved
        </span>

      </footer>

    </div>
  );
}

export default Vision;