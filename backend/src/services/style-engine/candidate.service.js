import { prisma } from "../../config/prisma.js";

/**
 * Curated Fresher-Level Outfit Recommendations Catalog
 * Provides practical, fresh, and stylish complete head-to-toe outfit ensembles
 * specifically curated for Everyday & Casual, Festive & Traditional celebrations,
 * and Function & Evening Party occasions.
 */
export const GLOBAL_OUTFIT_DESIGNS = [
  // =========================================================================
  // 1. EVERYDAY & CASUAL OUTFITS (College, Coffee dates, Streetwear, Casual hangouts)
  // =========================================================================
  {
    id: "outfit-everyday-camel-denim",
    candidate_id: "outfit-everyday-camel-denim",
    name: "Oversized Camel Blazer & Wide-Leg Denim",
    origin: "Street Chic · Everyday Casual",
    category: "EVERYDAY & CASUAL",
    sub_category: "College & Coffee Run",
    article_type: "Complete Everyday Ensemble",
    aesthetic: "Effortless Chic",
    occasion: "everyday",
    occasions: ["everyday", "casual", "college", "work"],
    season: "Autumn",
    seasons: ["Autumn", "Spring", "Winter", "All-Season"],
    gender: "Womenswear",
    usage: "Everyday / Campus / Coffee Date",
    color: "Camel & Indigo",
    colors: ["Rich Camel", "Chalk White", "Vintage Indigo", "Warm Sand"],
    palette: [
      { name: "Rich Camel", hex: "#c19a6b" },
      { name: "Chalk White", hex: "#f8f7f4" },
      { name: "Vintage Indigo", hex: "#3e5c76" },
      { name: "Cognac Leather", hex: "#8b4513" },
    ],
    silhouette: "Relaxed Structured Layering with Wide-Leg Flow",
    fabric: "Wool-Blend Suiting & 100% Cotton Denim",
    outfit_pieces: {
      top: "Fitted White Ribbed Crewneck Baby Tee",
      outerwear: "Oversized Structured Camel Wool-Blend Blazer",
      bottom: "Vintage-Wash High-Waist Relaxed Wide-Leg Denim Jeans",
      footwear: "Clean Retro Cream Leather Low-Top Platform Sneakers",
      accessories: "Cognac Leather Slouchy Shoulder Bag, Minimalist Chunky Gold Hoops, Tortoiseshell Shades",
    },
    styling_advice: "Roll the blazer cuffs once at the wrist and tuck the baby tee in for an effortlessly put-together campus or coffee date look.",
    studio_prompt: "Chic modern college everyday outfit, fashion model wearing oversized camel blazer over white ribbed fitted tee, relaxed high-waisted vintage wash wide leg blue jeans, clean white sneakers",
    metadata: {
      imageUrl: "/fashion/outfit-everyday-denim.jpg",
      region: "Global Street Style",
      collectionYear: "2026 Core",
    },
  },
  {
    id: "outfit-everyday-sage-street",
    candidate_id: "outfit-everyday-sage-street",
    name: "Sage Green Bomber & Utility Parachute Fit",
    origin: "Tokyo & Seoul · Urban Streetwear",
    category: "EVERYDAY & CASUAL",
    sub_category: "Streetwear & Casual Hangouts",
    article_type: "Complete Everyday Ensemble",
    aesthetic: "Urban Streetwear",
    occasion: "everyday",
    occasions: ["everyday", "casual", "college"],
    season: "Spring",
    seasons: ["Spring", "Autumn", "All-Season"],
    gender: "Unisex",
    usage: "Casual / Streetwear / Weekend",
    color: "Sage Green & Sand",
    colors: ["Sage Green", "Warm Sand", "Chalk White", "Matte Noir"],
    palette: [
      { name: "Sage Green", hex: "#7d9d8b" },
      { name: "Warm Sand", hex: "#d6c7b2" },
      { name: "Chalk White", hex: "#fbfbfa" },
      { name: "Matte Noir", hex: "#222428" },
    ],
    silhouette: "Cropped Bomber with Volume Parachute Trousers",
    fabric: "Water-Resistant Satin Nylon & Technical Cotton",
    outfit_pieces: {
      top: "Ivory Seamless Ribbed High-Neck Crop Tank",
      outerwear: "Cropped Sage Green Satin Nylon Utility Bomber Jacket",
      bottom: "Relaxed Sand Parachute Cargo Pants with Adjustable Ankle Bungees",
      footwear: "Retro Multi-Panel Chunky Platform Trail Sneakers",
      accessories: "Matte Black Crossbody Sling Bag, Chunky Silver Chain Necklace, Tinted Wire Glasses",
    },
    styling_advice: "Tighten the ankle bungees slightly above the sneaker collar to create an effortless jogger parachute drape.",
    studio_prompt: "Effortless casual streetwear outfit, fashion model wearing cropped sage green utility bomber jacket, ivory ribbed crop tank, relaxed beige parachute cargo trousers, chunky retro platform sneakers",
    metadata: {
      imageUrl: "/fashion/outfit-everyday-casual.jpg",
      region: "Urban Streetwear",
      collectionYear: "2026 Core",
    },
  },
  {
    id: "outfit-everyday-trench-mayfair",
    candidate_id: "outfit-everyday-trench-mayfair",
    name: "Architectural Camel Wool Wrap & Turtleneck",
    origin: "London Mayfair · Modern Minimalist",
    category: "EVERYDAY & CASUAL",
    sub_category: "Smart Casual & Campus",
    article_type: "Complete Everyday Ensemble",
    aesthetic: "Quiet Luxury",
    occasion: "everyday",
    occasions: ["everyday", "work", "college", "casual"],
    season: "Winter",
    seasons: ["Winter", "Autumn"],
    gender: "Womenswear",
    usage: "Everyday / Work / Semi-Formal",
    color: "Camel & Espresso",
    colors: ["Rich Camel", "Cream Ivory", "Deep Espresso", "Charcoal"],
    palette: [
      { name: "Rich Camel", hex: "#c49a6c" },
      { name: "Cream Ivory", hex: "#f5f0ea" },
      { name: "Deep Espresso", hex: "#3e2723" },
      { name: "Charcoal", hex: "#2b2b2b" },
    ],
    silhouette: "Cinched Wrap Coat over Sleek Cigarette Trousers",
    fabric: "Double-Faced Wool Blend & Fine Merino Knit",
    outfit_pieces: {
      top: "Fine-Gauge Cream Ribbed Merino Wool Mock Turtleneck",
      outerwear: "Oversized Belted Camel Wool Wrap Coat with Wide Lapels",
      bottom: "High-Rise Tailored Charcoal Wool Cigarette Trousers",
      footwear: "Polished Deep Espresso Leather Ankle Chelsea Boots",
      accessories: "Structured Pebble-Leather Medium Tote, Brushed Gold Huggie Earrings",
    },
    styling_advice: "Tie the coat belt loosely in a knot rather than buckling it for a contemporary, unhurried city look.",
    studio_prompt: "Architectural oversized camel wool trench coat with statement storm flaps and wide cinched belt",
    metadata: {
      imageUrl: "/fashion/studio-trench-camel.jpg",
      region: "London, UK",
      collectionYear: "2026 Editorial",
    },
  },
  {
    id: "outfit-everyday-cyber-casual",
    candidate_id: "outfit-everyday-cyber-casual",
    name: "Cyber-Tailored Technical Shell & Cargo Ensemble",
    origin: "Seoul K-Fashion · Avant-Garde",
    category: "EVERYDAY & CASUAL",
    sub_category: "Contemporary K-Street",
    article_type: "Complete Everyday Ensemble",
    aesthetic: "Avant-Garde Streetwear",
    occasion: "everyday",
    occasions: ["everyday", "casual", "college"],
    season: "All-Season",
    seasons: ["Spring", "Autumn", "Winter", "All-Season"],
    gender: "Unisex",
    usage: "Everyday / Streetwear",
    color: "Carbon Noir & Gunmetal",
    colors: ["Carbon Noir", "Industrial Steel", "Chrome Silver"],
    palette: [
      { name: "Carbon Noir", hex: "#141518" },
      { name: "Industrial Steel", hex: "#616872" },
      { name: "Chrome Silver", hex: "#c5c9d1" },
    ],
    silhouette: "Sculpted Funnel-Collar with Parachute Volume",
    fabric: "Bonded Technical Ripstop & Technical Cotton",
    outfit_pieces: {
      top: "Asymmetrical Hem Technical Bonded Long-Sleeve T-Shirt",
      outerwear: "Sculpted Funnel-Collar Cropped Technical Jacket with Angle Flap",
      bottom: "Relaxed Wide-Leg Parachute Cargo Trousers with Geometric Pockets",
      footwear: "Monochrome Chunky Lug-Sole Platform Ankle Boots",
      accessories: "Tactical Webbing Belt with Magnetic Quick-Release Buckle, Silver Ring Set",
    },
    styling_advice: "Leave the collar halfway unzipped to show off a silver choker or layered chains.",
    studio_prompt: "Futuristic technical cyber-tailored jacket with high sculpted funnel collar, angled storm flap, and reflective detailing",
    metadata: {
      imageUrl: "/fashion/studio-streetwear-cyber.jpg",
      region: "Seoul, South Korea",
      collectionYear: "2026 Editorial",
    },
  },

  // =========================================================================
  // 2. FESTIVE & TRADITIONAL OUTFITS (Diwali, Eid, Haldi, Sangeet, Weddings, Puja)
  // =========================================================================
  {
    id: "outfit-festive-pastel-kurta",
    candidate_id: "outfit-festive-pastel-kurta",
    name: "Powder Blue Chanderi Silk Zari Kurta Set",
    origin: "Lucknow & Delhi Atelier · Festive Craft",
    category: "FESTIVE & TRADITIONAL",
    sub_category: "Diwali & Eid Festive",
    article_type: "Complete Festive Ensemble",
    aesthetic: "Refined Traditional",
    occasion: "festive",
    occasions: ["festive", "traditional", "party", "family"],
    season: "All-Season",
    seasons: ["Spring", "Autumn", "Summer", "All-Season"],
    gender: "Womenswear",
    usage: "Diwali / Eid / Pooja / Daytime Festive",
    color: "Powder Blue & Silver",
    colors: ["Powder Blue", "Antique Silver", "Soft Ivory", "Ice Mint"],
    palette: [
      { name: "Powder Blue", hex: "#9bbcd0" },
      { name: "Antique Silver", hex: "#c0c0c0" },
      { name: "Soft Ivory", hex: "#f5efe6" },
      { name: "Ice Mint", hex: "#d1e8e2" },
    ],
    silhouette: "Straight-Cut Slender Kurta with Scalloped Dupatta",
    fabric: "Handwoven Chanderi Silk & Pure Organza",
    outfit_pieces: {
      top: "Powder Blue Chanderi Silk Straight Kurta with Fine Silver Zari & Sequin Embroidery",
      bottom: "Tone-on-Tone Raw Silk Straight Cigarette Trousers",
      outerwear: "Featherweight Sheer Organza Dupatta with Scalloped Gota Patti Edging",
      footwear: "Handcrafted Silver & Pearl Pointed Mojari Juttis with Cushioned Soles",
      accessories: "Silver Meenakari Jhumkas, Stacked Glass Pearl Bangles, Embroidered Velvet Potli",
    },
    styling_advice: "Drape the organza dupatta neatly pinned on one shoulder to display the intricate neck embroidery, paired with a soft rose lip.",
    studio_prompt: "Pastel powder blue Chanderi silk kurta with delicate silver zari and thread embroidery, matching tailored cigarette pants, sheer organza dupatta with scalloped borders, festive traditional Diwali Eid styling",
    metadata: {
      imageUrl: "/fashion/outfit-festive-kurta.jpg",
      region: "India Festive",
      collectionYear: "2026 Core",
    },
  },
  {
    id: "outfit-festive-yellow-sharara",
    candidate_id: "outfit-festive-yellow-sharara",
    name: "Mustard Yellow Mirror-Work Sharara Ensemble",
    origin: "Jaipur Heritage Atelier · Festive Festive",
    category: "FESTIVE & TRADITIONAL",
    sub_category: "Haldi & Sangeet Ceremonies",
    article_type: "Complete Festive Ensemble",
    aesthetic: "Festive Glamour",
    occasion: "festive",
    occasions: ["festive", "party", "traditional", "wedding"],
    season: "All-Season",
    seasons: ["Spring", "Summer", "Autumn", "Winter"],
    gender: "Womenswear",
    usage: "Haldi / Sangeet / Wedding Guest / Mehendi",
    color: "Mustard Gold & Marigold",
    colors: ["Mustard Yellow", "Antique Gold", "Marigold Orange", "Pearl White"],
    palette: [
      { name: "Mustard Yellow", hex: "#e5a93c" },
      { name: "Antique Gold", hex: "#d4af37" },
      { name: "Marigold Orange", hex: "#f28c28" },
      { name: "Pearl White", hex: "#f8f5ee" },
    ],
    silhouette: "Peplum Short Kurti with 3-Tiered Voluminous Sharara",
    fabric: "Georgette & Pure Silk Tissue Organza",
    outfit_pieces: {
      top: "Vibrant Mustard Yellow Short Peplum Kurti with Gota Patti & Hand-Cut Mirror Embellishment",
      bottom: "Three-Tiered Voluminous Georgette Flared Sharara Pants with Gold Piping",
      outerwear: "Lightweight Net & Tissue Dupatta with Shimmering Golden Kiran Tassels",
      footwear: "Marigold Velvet Cushioned Juttis with Mirror Work Detailing",
      accessories: "Kundan Chandbali Earrings, Fresh Floral Haathphool, Gold Metal Clutch",
    },
    styling_advice: "Pin the dupatta on the shoulder and loop it gracefully over your wrist to dance comfortably during Sangeet nights.",
    studio_prompt: "Vibrant festive outfit, young Indian model wearing mustard yellow mirror work peplum kurti with flared tiered sharara pants and net dupatta, Haldi Sangeet wedding guest",
    metadata: {
      imageUrl: "/fashion/outfit-festive-sharara.jpg",
      region: "Jaipur, India",
      collectionYear: "2026 Core",
    },
  },
  {
    id: "outfit-festive-royal-lehenga",
    candidate_id: "outfit-festive-royal-lehenga",
    name: "Royal Maroon Velvet & Zardozi Heritage Bridal Ensemble",
    origin: "Jaipur & New Delhi Atelier · India",
    category: "FESTIVE & TRADITIONAL",
    sub_category: "Grand Wedding & Sangeet",
    article_type: "Complete Festive Ensemble",
    aesthetic: "Heritage Royalty",
    occasion: "festive",
    occasions: ["festive", "party", "wedding", "formal"],
    season: "Winter",
    seasons: ["Winter", "Autumn"],
    gender: "Womenswear",
    usage: "Bridal / Sangeet / Grand Wedding Reception",
    color: "Royal Maroon & Antique Gold",
    colors: ["Royal Maroon", "Antique Gold", "Deep Wine", "Pearl Cream"],
    palette: [
      { name: "Royal Maroon", hex: "#5a1322" },
      { name: "Antique Gold", hex: "#d4af37" },
      { name: "Deep Wine", hex: "#420f18" },
      { name: "Pearl Cream", hex: "#f9f6f0" },
    ],
    silhouette: "Flared 16-Kali Voluminous Kalidar",
    fabric: "Silk-Cotton Velvet & Hand-Woven Organza Tissue",
    outfit_pieces: {
      top: "Sweetheart Neckline Velvet Choli Embroidered with Real Dabka & Zari",
      bottom: "16-Kali Heavy Silk-Velvet Flared Lehenga with Heritage Mughal Motifs",
      outerwear: "Sheer Tissue Organza Dupatta with Kiran Hand-Fringed Borders",
      footwear: "Embroidered Velvet Cushion-Footbed Mojaris with Antique Dabka Work",
      accessories: "Uncut Polki Kundan Choker, Maang Tikka, Handcrafted Temple Gold Bangles",
    },
    styling_advice: "Drape the dupatta over one shoulder and across the opposite wrist to accentuate the full flare of the 16-kali skirt.",
    studio_prompt: "Royal maroon velvet bridal lehenga with intricate golden zardozi embroidery and sheer organza dupatta",
    metadata: {
      imageUrl: "/fashion/generated-1793770610165-393202.jpg",
      region: "Jaipur & New Delhi, India",
      collectionYear: "2026 Heritage",
    },
  },
  {
    id: "outfit-festive-velvet-fusion",
    candidate_id: "outfit-festive-velvet-fusion",
    name: "Burgundy Velvet Peplum Corset & Tailored Trouser Fusion",
    origin: "Indo-Western Contemporary · Milan & Mumbai",
    category: "FESTIVE & TRADITIONAL",
    sub_category: "Indo-Western Festive Fusion",
    article_type: "Complete Festive Ensemble",
    aesthetic: "Modern Festive Fusion",
    occasion: "festive",
    occasions: ["festive", "party", "function"],
    season: "Winter",
    seasons: ["Winter", "Autumn"],
    gender: "Womenswear",
    usage: "Cocktail Sangeet / Festive Party / Reception",
    color: "Burgundy Velvet & Noir",
    colors: ["Burgundy Velvet", "Royal Rose", "Black Caviar"],
    palette: [
      { name: "Burgundy Velvet", hex: "#4a1224" },
      { name: "Royal Rose", hex: "#b94361" },
      { name: "Black Caviar", hex: "#15161a" },
    ],
    silhouette: "Structured Peplum Corset with Fluid High-Rise Trousers",
    fabric: "Silk-Cotton Velvet & Featherweight Boning",
    outfit_pieces: {
      top: "Structured Sweetheart Burgundy Velvet Corset with Sharp Flared Peplum",
      bottom: "High-Rise Bespoke Tailored Noir Suiting Trousers with Satin Waistband",
      outerwear: "Floor-Sweeping Sheer Organza Cape Shrug with Zardozi Wrist Cuffs",
      footwear: "Burgundy Pointed-Toe Satin Slingback Block Heels",
      accessories: "Statement Chandelier Shoulder-Duster Earrings, Velvet Box Clutch",
    },
    styling_advice: "Pair with an ultra-clean slicked-back ponytail to spotlight the structured architectural corset sweetheart line.",
    studio_prompt: "Avant-garde structured burgundy velvet corset with sharp peplum waist flared over high-rise bespoke tailored trousers",
    metadata: {
      imageUrl: "/fashion/studio-corset-couture.jpg",
      region: "Florence & Mumbai",
      collectionYear: "2026 Fusion",
    },
  },

  // =========================================================================
  // 3. FUNCTION & PARTY OUTFITS (Cocktails, Receptions, Birthdays, Evening Galas)
  // =========================================================================
  {
    id: "outfit-party-emerald-slip",
    candidate_id: "outfit-party-emerald-slip",
    name: "Emerald Silk Satin Cowl Slip & Cropped Leather Moto",
    origin: "SoHo Cocktail Nights · New York & Paris",
    category: "FUNCTION & PARTY",
    sub_category: "Cocktail Party & Reception",
    article_type: "Complete Evening Ensemble",
    aesthetic: "Chic Evening Glamour",
    occasion: "function",
    occasions: ["function", "party", "formal", "cocktail"],
    season: "All-Season",
    seasons: ["Autumn", "Winter", "Spring", "All-Season"],
    gender: "Womenswear",
    usage: "Cocktail Party / Reception / Birthday Dinner / Date Night",
    color: "Emerald Green & Noir",
    colors: ["Deep Emerald", "Forest Satin", "Pitch Noir", "Liquid Gold"],
    palette: [
      { name: "Deep Emerald", hex: "#0f432a" },
      { name: "Forest Satin", hex: "#1f5636" },
      { name: "Pitch Noir", hex: "#141518" },
      { name: "Liquid Gold", hex: "#d4af37" },
    ],
    silhouette: "Fluid Bias-Cut Midi Slip with Structured Cropped Moto Outerwear",
    fabric: "100% Italian Silk Satin & Supple Nappa Leather",
    outfit_pieces: {
      dress: "Bias-Cut Cowl-Neck Emerald Green Silk Satin Midi Slip Dress with Subtle Side Slit",
      outerwear: "Cropped Washed Black Nappa Leather Biker Moto Jacket",
      footwear: "Barely-There Minimalist Metallic Gold Ankle-Strap Stiletto Sandals",
      accessories: "Crystal Baguette Shoulder Bag, Pave Gold Huggie Hoops, Layered Snake Chains",
    },
    styling_advice: "Drape the leather jacket casually over your shoulders rather than putting arms through the sleeves for an effortlessly cool cocktail edge.",
    studio_prompt: "Modern chic evening cocktail party outfit, fashion model wearing emerald green satin cowl-neck slip midi dress, black cropped leather moto jacket, delicate strappy heeled sandals",
    metadata: {
      imageUrl: "/fashion/studio-dress-emerald.jpg",
      region: "New York & Paris",
      collectionYear: "2026 Core",
    },
  },
  {
    id: "outfit-party-monochrome-tuxedo",
    candidate_id: "outfit-party-monochrome-tuxedo",
    name: "Monochrome Contrast-Lapel Tuxedo Power Pantsuit",
    origin: "Evening Black Tie · Modernist Sharp Suiting",
    category: "FUNCTION & PARTY",
    sub_category: "Black Tie & Evening Function",
    article_type: "Complete Evening Ensemble",
    aesthetic: "Sharp Suiting & Power Glam",
    occasion: "function",
    occasions: ["function", "party", "work", "formal"],
    season: "All-Season",
    seasons: ["Autumn", "Winter", "Spring", "All-Season"],
    gender: "Womenswear",
    usage: "Evening Gala / Award Ceremony / Corporate Reception / Black Tie",
    color: "Noir Black & Chalk White",
    colors: ["Onyx Black", "Crisp Chalk", "Slate Grey", "Polished Silver"],
    palette: [
      { name: "Onyx Black", hex: "#0e0f14" },
      { name: "Crisp Chalk", hex: "#fcfbfa" },
      { name: "Slate Grey", hex: "#70737c" },
      { name: "Polished Silver", hex: "#c8cbcf" },
    ],
    silhouette: "Sharp Peak-Lapel Tailored Suit with Straight Razor Trousers",
    fabric: "Super 140s Virgin Wool & Heavy Silk Satin",
    outfit_pieces: {
      top: "Chalk White Silk Georgette Deep V-Neck Camisole",
      outerwear: "Single-Breasted Noir Wool Tuxedo Blazer with Contrasting Chalk Satin Peak Lapels",
      bottom: "High-Rise Razor-Pleated Straight Suiting Trousers with Satin Tuxedo Side Stripe",
      footwear: "Pointed-Toe Black Patent Stiletto Pumps with Metallic Heel Tip",
      accessories: "Onyx & Crystal Geometric Ear Cuffs, Structured Glossy Black Minaudière",
    },
    styling_advice: "Style with bold dark berry lips and slick hair parted behind the ears to frame the stark contrast lapel collar.",
    studio_prompt: "Monochrome double-breasted tailored pantsuit with contrasting chalk-white peak lapels and razor-pleated trousers",
    metadata: {
      imageUrl: "/fashion/studio-suit-monochrome.jpg",
      region: "New York & Milan",
      collectionYear: "2026 Core",
    },
  },
  {
    id: "outfit-party-crimson-gala",
    candidate_id: "outfit-party-crimson-gala",
    name: "Sculptural Crimson Silk Gala Ensemble",
    origin: "Paris Couture Gala · France",
    category: "FUNCTION & PARTY",
    sub_category: "Red Carpet & Gala Reception",
    article_type: "Complete Evening Ensemble",
    aesthetic: "Haute Eveningwear",
    occasion: "function",
    occasions: ["function", "party", "formal"],
    season: "Autumn",
    seasons: ["Autumn", "Winter", "Spring"],
    gender: "Womenswear",
    usage: "Gala / Red Carpet / High-End Reception",
    color: "Wine Crimson & Rose",
    colors: ["Wine Crimson", "Dusty Rose", "Pale Pearl", "Noir"],
    palette: [
      { name: "Wine Crimson", hex: "#6e1b30" },
      { name: "Dusty Rose", hex: "#b94361" },
      { name: "Pale Pearl", hex: "#f3ded8" },
      { name: "Noir", hex: "#1c0b13" },
    ],
    silhouette: "Sculptural Fluted Column",
    fabric: "Double-Faced Silk Charmeuse & French Organza",
    outfit_pieces: {
      dress: "Asymmetric Draped Silk Charmeuse Gown with Hand-Folded Shoulder Cascade",
      outerwear: "Structured Velvet Cocoon Stole in Midnight Noir",
      footwear: "Minimalist Burgundy Pointed Stiletto Pumps in Brushed Satin",
      accessories: "Sculptural Platinum & Diamond Ear Cuff, Micro Satin Minaudière",
    },
    styling_advice: "Keep jewelry architectural and modern. Opt for sleek pulled-back hair to emphasize the asymmetric shoulder line.",
    studio_prompt: "Haute couture sculptural evening gown in crimson and rose silk with architectural shoulder drapery and satin finish",
    metadata: {
      imageUrl: "/fashion/runway-couture.jpg",
      region: "Paris, France",
      collectionYear: "2026 Editorial",
    },
  },

  // =========================================================================
  // 4. SMART WORK & WEEKEND BRUNCH
  // =========================================================================
  {
    id: "outfit-work-milan-power",
    candidate_id: "outfit-work-milan-power",
    name: "Architectural Sculpted Ivory Double-Breasted Power Suit",
    origin: "Milan Fashion Week · Italy",
    category: "SMART WORK & COLLEGE",
    sub_category: "Office & Executive Suiting",
    article_type: "Complete Work Ensemble",
    aesthetic: "Sharp Executive Minimalist",
    occasion: "work",
    occasions: ["work", "everyday", "function", "formal"],
    season: "Autumn",
    seasons: ["Autumn", "Winter", "Spring"],
    gender: "Womenswear",
    usage: "Executive / Work / Presentations / Conferences",
    color: "Pristine Ivory & Sand",
    colors: ["Pristine Ivory", "Warm Sand", "Espresso", "Noir"],
    palette: [
      { name: "Pristine Ivory", hex: "#f8f6f0" },
      { name: "Warm Sand", hex: "#d8cfc4" },
      { name: "Espresso", hex: "#4b3f3b" },
      { name: "Noir", hex: "#1e1b18" },
    ],
    silhouette: "Boxy Double-Breasted Tailoring with Wide-Leg Flow",
    fabric: "Double-Faced Italian Melton Wool & Cashmere",
    outfit_pieces: {
      top: "Ribbed Featherweight Cashmere & Silk Mock-Neck Knit in Warm Sand",
      outerwear: "Oversized Structured Double-Breasted Wool Blazer with Peak Lapels",
      bottom: "High-Waisted Razor-Pleated Wide-Leg Wool Trousers",
      footwear: "Espresso Italian Calfskin Square-Toe Loafers with Stacked Heel",
      accessories: "Structured Architectural Calfskin Day Tote, Brushed Gold Minimalist Buckle Belt",
    },
    styling_advice: "Button only the inner anchor button for an effortless slouch. Drape the blazer over shoulders for boardroom transitions.",
    studio_prompt: "Oversized ivory structured wool blazer with architectural peak lapels and tailored minimal silhouette",
    metadata: {
      imageUrl: "/fashion/runway-tailoring.jpg",
      region: "Milan, Italy",
      collectionYear: "2026 Editorial",
    },
  },
  {
    id: "outfit-brunch-riviera-plisse",
    candidate_id: "outfit-brunch-riviera-plisse",
    name: "Plissé Champagne Silk Maxi & Woven Gold Summer Ensemble",
    origin: "French Riviera · Resort Luxury",
    category: "WEEKEND BRUNCH & RESORT",
    sub_category: "Weekend Brunch & Vacation",
    article_type: "Complete Resort Ensemble",
    aesthetic: "Effortless Resort Luxury",
    occasion: "everyday",
    occasions: ["everyday", "function", "casual"],
    season: "Summer",
    seasons: ["Summer", "Spring"],
    gender: "Womenswear",
    usage: "Weekend Brunch / Resort / Rooftop Dinner",
    color: "Champagne Plissé & Ochre",
    colors: ["Champagne Plissé", "Golden Sand", "Umber", "Earthy Tan"],
    palette: [
      { name: "Champagne Plissé", hex: "#e7d8c5" },
      { name: "Golden Sand", hex: "#d9b382" },
      { name: "Umber", hex: "#634735" },
      { name: "Earthy Tan", hex: "#9b7a5a" },
    ],
    silhouette: "Tiered Micro-Pleated Flowing Column Maxi",
    fabric: "100% Micro-Pleated Silk Chiffon & Organic Hand-Woven Raffia",
    outfit_pieces: {
      dress: "Micro-Pleated Plissé Champagne Silk Chiffon Maxi Dress with Fluid Spaghetti Straps",
      outerwear: "Lightweight Ivory Linen Open-Front Duster Cardigan",
      footwear: "Handcrafted Metallic Gold Strappy Gladiator Leather Slide Sandals",
      accessories: "Sculptural Hand-Woven Raffia Sun Hat, Structured Basket Bag, Stacked Gold Bangles",
    },
    styling_advice: "Pair with tinted oversized sunglasses and delicate gold necklaces for the ultimate Sunday rooftop brunch look.",
    studio_prompt: "Micro-pleated plissé champagne silk maxi dress with fluid drape and elegant sculptural neckline",
    metadata: {
      imageUrl: "/fashion/runway-resort.jpg",
      region: "Côte d'Azur, France",
      collectionYear: "2026 Resort",
    },
  },
];

/**
 * Retrieve candidates for the Style Engine.
 * Starts with our curated Fresher-Level Outfit catalog, ensuring users always receive
 * real, complete, occasion-ready outfit recommendations for Everyday, Festive, and Functions.
 */
export async function getStyleEngineCandidates() {
  const candidates = [...GLOBAL_OUTFIT_DESIGNS];

  try {
    const items = await prisma.fashionItem.findMany({
      where: {
        images: {
          some: {
            visionAnalyses: {
              some: { status: "COMPLETED" },
            },
          },
        },
      },
      include: {
        images: {
          include: {
            visionAnalyses: {
              where: { status: "COMPLETED" },
              orderBy: { completedAt: "desc" },
              take: 1,
            },
          },
        },
      },
      take: 20,
    });

    for (const item of items) {
      const imageWithAnalysis = item.images.find(
        (img) => img.visionAnalyses.length > 0
      );
      if (!imageWithAnalysis) continue;

      const analysis = imageWithAnalysis.visionAnalyses[0];
      const attributes = analysis.attributes ?? {};

      // Filter out low-value items like "Free Gifts" or duplicate generic labels
      const itemName = item.name || attributes.articleType?.label || "";
      if (
        !itemName ||
        itemName.toLowerCase().includes("gift") ||
        itemName.toLowerCase() === "free gifts" ||
        itemName.toLowerCase() === "jackets" ||
        itemName.toLowerCase() === "dresses"
      ) {
        continue;
      }

      candidates.push({
        candidate_id: item.id,
        id: item.id,
        name: itemName,
        origin: "Vision Verified Closet · Custom Item",
        category: item.category ?? "CUSTOM ITEM",
        sub_category: attributes.subCategory?.label ?? "Wardrobe Staple",
        article_type: attributes.articleType?.label ?? "Wardrobe Piece",
        aesthetic: item.style ?? "Contemporary",
        occasion: (attributes.usage?.label || "everyday").toLowerCase(),
        occasions: [attributes.usage?.label || "everyday"],
        season: attributes.season?.label ?? item.season ?? "All-Season",
        seasons: [attributes.season?.label ?? item.season ?? "All-Season"],
        gender: attributes.gender?.label ?? "Unisex",
        usage: attributes.usage?.label ?? "Everyday",
        color: attributes.baseColour?.label ?? analysis.dominantColor ?? "Neutral",
        colors: [attributes.baseColour?.label ?? analysis.dominantColor ?? "Neutral"],
        palette: [
          {
            name: attributes.baseColour?.label ?? "Base Tone",
            hex: analysis.dominantColor || "#d8cfc4",
          },
        ],
        silhouette: "Tailored Custom Fit",
        fabric: "Premium Textile Blend",
        outfit_pieces: {
          primary_garment: itemName,
          styling_note: "Combines effortlessly with neutral everyday denim or tailored suiting.",
        },
        styling_advice: "Style with structured tailoring and clean accessories.",
        metadata: {
          fashionItemId: item.id,
          imageUrl: imageWithAnalysis.imageUrl,
          region: "Personal Closet",
        },
      });
    }
  } catch (err) {
    // Database access is non-blocking; fresh outfit designs catalog is always available
  }

  return candidates;
}
