import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { env } from "../../config/env.js";
import { prisma } from "../../config/prisma.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STUDIO_ML_URL = env.STUDIO_ML_URL || "http://127.0.0.1:8003";

/**
 * Dynamically extract rich fashion intelligence metadata from the user's custom prompt
 */
function extractFashionMetadataFromPrompt(promptText = "", fashionContext = {}) {
  const text = promptText.toLowerCase();

  // 1. Detect Garment
  let garment = fashionContext.garment || fashionContext.category || "";
  if (!garment) {
    const garmentKeywords = [
      "lehenga", "saree", "sari", "gown", "dress", "sundress", "blazer", "suit",
      "jacket", "trench coat", "trench", "coat", "corset", "bustier", "skirt",
      "pantsuit", "trousers", "pants", "hoodie", "bomber", "cardigan", "sweater",
      "kaftan", "jumpsuit", "kimono", "tunic", "vest", "duster", "cape", "cloak",
      "sherwani", "kurta", "anarkali", "shacket", "parka", "poncho", "bodysuit"
    ];
    for (const kw of garmentKeywords) {
      if (text.includes(kw)) {
        garment = kw.charAt(0).toUpperCase() + kw.slice(1);
        break;
      }
    }
    if (!garment) {
      garment = "Bespoke Fashion Attire";
    }
  }

  // 2. Detect Aesthetic
  let aesthetic = fashionContext.aesthetic || "";
  if (!aesthetic) {
    const aestheticKeywords = [
      ["haute couture", "Haute Couture"],
      ["couture", "Contemporary Couture"],
      ["streetwear", "Urban Luxury Streetwear"],
      ["minimalist", "Minimalist Modern"],
      ["minimal", "Clean Minimalist"],
      ["cyberpunk", "Cyberpunk Avant-Garde"],
      ["vintage", "Vintage Heritage"],
      ["retro", "Retro Contemporary"],
      ["boho", "Bohemian Luxury"],
      ["bohemian", "Bohemian Chic"],
      ["resort", "Luxury Resort"],
      ["traditional", "Traditional Heritage"],
      ["bridal", "Bridal Couture"],
      ["gothic", "Dark Romantic / Gothic"],
      ["avant-garde", "Avant-Garde High Fashion"],
      ["y2k", "Y2K Futuristic"],
      ["quiet luxury", "Quiet Luxury / Old Money"],
      ["preppy", "Tailored Preppy Chic"],
      ["punk", "Edgy Punk Couture"],
      ["futuristic", "Futuristic Architectural"]
    ];
    for (const [kw, name] of aestheticKeywords) {
      if (text.includes(kw)) {
        aesthetic = name;
        break;
      }
    }
    if (!aesthetic) {
      aesthetic = "Contemporary High Fashion";
    }
  }

  // 3. Detect Silhouette
  let silhouette = "Custom Tailored Fit";
  const silhouetteKeywords = [
    ["oversized", "Oversized Architectural Cut"],
    ["fluted", "Sculptural Fluted Column"],
    ["asymmetric", "Asymmetrical Draped Line"],
    ["asymmetrical", "Asymmetrical Silhouette"],
    ["a-line", "Classic A-Line Silhouette"],
    ["mermaid", "Fitted Mermaid Contour"],
    ["peplum", "Structured Peplum Hourglass"],
    ["pleated", "Plissé Micro-Pleated Flow"],
    ["plisse", "Accordion Plissé Column"],
    ["corset", "Cinched Corsetry Structure"],
    ["draped", "Fluid Draped Silhouette"],
    ["tailored", "Structured Sharp Tailoring"],
    ["fitted", "Slim-Fit Contoured Cut"],
    ["baggy", "Relaxed Streetwear Silhouette"],
    ["cropped", "High-Cropped Architectural"],
    ["maxi", "Full-Length Flowing Maxi"],
    ["mini", "Tailored Mini Length"],
    ["tiered", "Tiered Layered Volume"]
  ];
  for (const [kw, name] of silhouetteKeywords) {
    if (text.includes(kw)) {
      silhouette = name;
      break;
    }
  }

  // 4. Detect Fabric
  let fabric = fashionContext.fabric || "";
  if (!fabric) {
    const fabricKeywords = [
      ["velvet", "Silk-Cotton Velvet"],
      ["silk", "Pure Mulberry Silk"],
      ["satin", "Heavy Silk Satin"],
      ["chiffon", "Sheer Silk Chiffon"],
      ["leather", "Supple Napa Leather"],
      ["wool", "Fine Melton Wool & Cashmere"],
      ["cashmere", "100% Mongolian Cashmere"],
      ["denim", "Premium Japanese Denim"],
      ["linen", "Breathable Organic Linen"],
      ["lace", "Intricate Chantilly Lace"],
      ["organza", "Structured Silk Organza"],
      ["tweed", "Heritage Bouclé Tweed"],
      ["metallic", "Liquid Metallic Membrane"],
      ["nylon", "Technical Bonded Nylon"],
      ["cotton", "Fine Combed Cotton"],
      ["crepe", "Italian Silk Crepe"]
    ];
    for (const [kw, name] of fabricKeywords) {
      if (text.includes(kw)) {
        fabric = name;
        break;
      }
    }
    if (!fabric) {
      fabric = "Custom Textile Composition";
    }
  }

  // 5. Detect Colors & Build Palette
  const colorMap = [
    { kw: "maroon", name: "Royal Maroon", hex: "#5a1322" },
    { kw: "crimson", name: "Wine Crimson", hex: "#7a1a2f" },
    { kw: "red", name: "Scarlet Red", hex: "#c41e3a" },
    { kw: "burgundy", name: "Deep Burgundy", hex: "#4a1224" },
    { kw: "rose", name: "Dusty Rose", hex: "#b94361" },
    { kw: "pink", name: "Soft Blush", hex: "#e899aa" },
    { kw: "green", name: "Forest Green", hex: "#1f5636" },
    { kw: "emerald", name: "Deep Emerald", hex: "#0f432a" },
    { kw: "sage", name: "Muted Sage", hex: "#8a9a86" },
    { kw: "blue", name: "Royal Azure", hex: "#1b3f7a" },
    { kw: "navy", name: "Midnight Navy", hex: "#0b1b36" },
    { kw: "cobalt", name: "Vibrant Cobalt", hex: "#0047ab" },
    { kw: "cyan", name: "Electric Cyan", hex: "#00bfff" },
    { kw: "yellow", name: "Sunshine Ochre", hex: "#e5a93c" },
    { kw: "gold", name: "Antique Gold", hex: "#d4af37" },
    { kw: "golden", name: "Zardozi Gold", hex: "#dfb14b" },
    { kw: "orange", name: "Sunset Tangerine", hex: "#e0632b" },
    { kw: "purple", name: "Imperial Violet", hex: "#4b1e5a" },
    { kw: "lavender", name: "Soft Lavender", hex: "#b5a3d4" },
    { kw: "black", name: "Pitch Noir", hex: "#0e0f14" },
    { kw: "white", name: "Pristine Chalk", hex: "#fcfbfa" },
    { kw: "ivory", name: "Pure Ivory", hex: "#f7f3ed" },
    { kw: "cream", name: "Warm Cream", hex: "#eee8df" },
    { kw: "beige", name: "Oatmeal Beige", hex: "#d8cfc4" },
    { kw: "camel", name: "Rich Camel", hex: "#9a6b42" },
    { kw: "brown", name: "Dark Espresso", hex: "#3e2723" },
    { kw: "silver", name: "Liquid Silver", hex: "#b0b5be" },
    { kw: "metallic", name: "Chrome Metallic", hex: "#9ea5b0" },
    { kw: "neon", name: "Neon Cyber Glow", hex: "#39ff14" }
  ];

  let detectedPalette = [];
  for (const c of colorMap) {
    if (text.includes(c.kw)) {
      detectedPalette.push({ name: c.name, hex: c.hex });
    }
  }

  // If user provided colors in context
  if (fashionContext.colors?.length) {
    for (const userColor of fashionContext.colors) {
      const matched = colorMap.find((c) => userColor.toLowerCase().includes(c.kw));
      if (matched && !detectedPalette.some((p) => p.hex === matched.hex)) {
        detectedPalette.push({ name: matched.name, hex: matched.hex });
      }
    }
  }

  if (detectedPalette.length === 0) {
    detectedPalette = [
      { name: "Editorial Ivory", hex: "#f7f3ed" },
      { name: "Deep Charcoal", hex: "#222326" },
      { name: "Subtle Warm Gray", hex: "#8c8e96" }
    ];
  }

  return {
    garment,
    aesthetic,
    silhouette,
    fabric,
    colors: detectedPalette.map((p) => p.name).join(", "),
    palette: detectedPalette,
    designNotes: `Generative fashion attire synthesized specifically from creative direction: "${promptText}". Custom ${silhouette.toLowerCase()} tailored with ${fabric.toLowerCase()} in a ${aesthetic.toLowerCase()} aesthetic.`
  };
}

/**
 * On-the-fly AI image generation specifically designed for the user's prompt
 */
async function generateImageFromPrompt(promptText, fashionContext = {}) {
  const parts = [
    "high-fashion full-length photography of a fashion model wearing",
    promptText.trim(),
  ];

  if (fashionContext.garment) parts.push(`garment: ${fashionContext.garment}`);
  if (fashionContext.aesthetic) parts.push(`aesthetic: ${fashionContext.aesthetic}`);
  if (fashionContext.fabric) parts.push(`fabric: ${fashionContext.fabric}`);
  if (fashionContext.colors?.length) parts.push(`colors: ${fashionContext.colors.join(", ")}`);

  parts.push("haute couture fashion editorial, professional runway lighting, clean minimalist studio backdrop, 8k resolution, photorealistic fabric texture, Vogue standard, sharp focus");

  const fullPrompt = parts.join(", ");
  const seed = Math.floor(Math.random() * 900000) + 100000;
  const targetUrls = [
    `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?width=768&height=1024&nologo=true&seed=${seed}&model=turbo`,
    `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?width=768&height=1024&nologo=true&seed=${seed}`,
  ];

  for (const targetUrl of targetUrls) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 24000);

    try {
      const response = await fetch(targetUrl, {
        signal: controller.signal,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        continue;
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      if (buffer.length < 1000) {
        continue;
      }

      // Save to disk so it persists and is served statically
      const fileName = `generated-${Date.now()}-${seed}.jpg`;
      const uploadsDir = path.resolve(__dirname, "../../../uploads/studio");
      const publicFashionDir = path.resolve(__dirname, "../../../../frontend/public/fashion");

      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
      if (!fs.existsSync(publicFashionDir)) fs.mkdirSync(publicFashionDir, { recursive: true });

      fs.writeFileSync(path.join(uploadsDir, fileName), buffer);
      fs.writeFileSync(path.join(publicFashionDir, fileName), buffer);

      const base64Data = buffer.toString("base64");

      return {
        success: true,
        base64Data,
        imageUrl: `/uploads/studio/${fileName}`,
        fileName,
      };
    } catch (err) {
      clearTimeout(timeoutId);
      console.warn("Attempt failed for", targetUrl.substring(0, 50), err.message);
    }
  }

  return { success: false, error: "All AI image generation endpoints were unreachable." };
}

/**
 * Generate Studio Design based strictly on the user's creative prompt
 */
export const generateStudio = async (payload, user = null) => {
  const promptText = payload.prompt || "Fashion design concept";
  const context = payload.fashion_context || {};
  let result = null;

  // 1. First, attempt to invoke Python ML microservice on 8003 if available
  try {
    const response = await axios.post(
      `${STUDIO_ML_URL}/generate`,
      payload,
      {
        timeout: 10000,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data && response.data.status === "success" && response.data.image_data) {
      result = response.data;
    }
  } catch (mlErr) {
    // ML microservice not reachable or timed out, proceed directly to integrated AI generator
  }

  // 2. If Python ML service didn't return an image, generate directly on-the-fly from the user's prompt
  if (!result || !result.image_data) {
    console.log(`[FASHNOVA Studio] Generating custom attire on-the-fly for prompt: "${promptText}"`);
    const aiGeneration = await generateImageFromPrompt(promptText, context);

    if (aiGeneration.success) {
      const intel = extractFashionMetadataFromPrompt(promptText, context);

      result = {
        status: "success",
        generation_type: payload.generation_type || "design",
        prompt: promptText,
        model: "FASHNOVA-GenAI-Flux-v2.5",
        image_data: aiGeneration.base64Data,
        image_url: aiGeneration.imageUrl,
        metadata: {
          garment: intel.garment,
          aesthetic: intel.aesthetic,
          silhouette: intel.silhouette,
          fabric: intel.fabric,
          pattern: context.pattern || "Bespoke Design Pattern",
          colors: intel.colors,
          palette: intel.palette,
          design_notes: intel.designNotes,
          provider: "fashnova-generative-flux",
        },
        message: `Successfully synthesized custom fashion attire for "${intel.garment}" based on your exact creative direction.`,
      };
    }
  }

  // 3. Fallback: If external generation timed out or network was completely offline, provide offline concept
  if (!result || !result.image_data) {
    console.warn("[FASHNOVA Studio] External generator unavailable, using offline fallback concept");
    const intel = extractFashionMetadataFromPrompt(promptText, context);
    const fallbackImage = "/fashion/runway-couture.jpg";

    result = {
      status: "success",
      generation_type: payload.generation_type || "design",
      prompt: promptText,
      model: "FASHNOVA-Studio-Offline",
      image_data: null,
      image_url: fallbackImage,
      metadata: {
        garment: intel.garment,
        aesthetic: intel.aesthetic,
        silhouette: intel.silhouette,
        fabric: intel.fabric,
        colors: intel.colors,
        palette: intel.palette,
        design_notes: intel.designNotes,
        provider: "fashnova-offline",
      },
      message: `Generated design specification for ${intel.garment}.`,
    };
  }

  // 4. Persist generation record in PostgreSQL via Prisma
  if (result && result.status === "success") {
    try {
      await prisma.studioGeneration.create({
        data: {
          userId: user?.id ?? null,
          status: "COMPLETED",
          outputType: "FASHION_CONCEPT",
          prompt: payload.prompt || "",
          modelName: result.model || "fashnova-studio",
          modelVersion: "2.5.0",
          parameters: payload.fashion_context || {},
          trendContext: payload.trend_context || {},
          outputs: result.image_url
            ? {
                create: [
                  {
                    outputType: "FASHION_CONCEPT",
                    storageKey: `studio-${Date.now()}`,
                    imageUrl: result.image_url,
                    mimeType: "image/jpeg",
                  },
                ],
              }
            : undefined,
        },
      });
    } catch (dbError) {
      // Database logging is non-blocking
    }
  }

  return result;
};
