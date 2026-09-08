export const BRAND_INFO = {
  name: "Sparkle @ KKV",
  tagline: "Where Every Accessory Tells Your Story.",
  secondaryTagline: "Luxury Fashion Accessories for Every Moment.",
  domain: "sparklekkv.com",
  phone: "+91 99491 57771",
  email: "support@sparklekkv.com",
  address: "Madhapur, Hyderabad, Telangana",
  socials: {
    instagram: "@sparklekkvoffical",
    instagramUrl: "https://www.instagram.com/sparklekkvoffical?igsh=MW8ydzIza3oybmM2aQ==",
    facebook: "SparkleKKV",
    pinterest: "sparklekkv"
  }
};

export const NAVIGATION_TREE = [
  {
    id: "hair-accessories",
    name: "Clips",
    subcategories: [
      { id: "flower-clips", name: "Flower Clips" },
      { id: "claw-clips", name: "Claw Clips" }
    ]
  },
  {
    id: "necklaces",
    name: "Necklace Sets",
    subcategories: [
      { id: "chokers", name: "Choker Sets" },
      { id: "temple-style", name: "Traditional Temple Sets" }
    ]
  },
  {
    id: "chains",
    name: "Chains",
    subcategories: [
      { id: "daily-wear", name: "Daily Wear Chains" },
      { id: "anti-tarnish", name: "Anti-Tarnish Chains" }
    ]
  },
  {
    id: "bracelets",
    name: "Bracelets",
    subcategories: [
      { id: "chain-bracelets", name: "Chain & Kada Bracelets" },
      { id: "stone-bracelets", name: "Stone Link Bracelets" },
      { id: "fashion-bracelets", name: "Charm & Beaded Bracelets" }
    ]
  },
  {
    id: "earrings",
    name: "Ear Rings",
    subcategories: [
      { id: "traditional-earrings", name: "Traditional Chandbali" },
      { id: "studs", name: "Studs & Drops" },
      { id: "hoops", name: "Hoops & Combo Sets" }
    ]
  },
  {
    id: "bangles",
    name: "Bangles",
    subcategories: [
      { id: "kemp-bangles", name: "Kemp & Stone Bangles" },
      { id: "metal-bangles", name: "Antique & Metal Bangles" },
      { id: "chura-sets", name: "Silver & Chura Sets" }
    ]
  },
  {
    id: "gift-sets",
    name: "Gift Sets & Combos",
    subcategories: [
      { id: "canvas", name: "CANVAS" },
      { id: "flowers", name: "FLOWERS" }
    ]
  }
];

export const CATEGORIES = [
  {
    id: "hair-accessories",
    name: "Clips",
    icon: "🌸",
    count: 8,
    description: "Plumeria flower clips, cross claws, whale tail & rectangle claw clips",
    image: "images/plumeria_flower_claw_clip_drive.jpg"
  },
  {
    id: "necklaces",
    name: "Necklace Sets",
    icon: "📿",
    count: 10,
    description: "Traditional South Indian chokers, Manga Malai, Kemp & Kasu Mala sets",
    image: "images/traditional_south_indian_matte_gold_plated_antiavue_droplet_choker_neckalce_set_jpeg_drive.jpg"
  },
  {
    id: "chains",
    name: "Chains",
    icon: "⛓️",
    count: 8,
    description: "Waterproof anti-tarnish 18K gold plated chains, snake chains, & pendant necklaces",
    image: "images/green_oval_stone_chain_drive.jpg"
  },
  {
    id: "bracelets",
    name: "Bracelets",
    icon: "💎",
    count: 13,
    description: "Adjustable gold kada bracelets & beaded charm bracelets",
    image: "images/2_adjustable_gold_plated_kada_bracelet_1_jpg_drive.jpg"
  },
  {
    id: "earrings",
    name: "Ear Rings",
    icon: "✨",
    count: 8,
    description: "Traditional Kundan Chandbali, danglers, emerald drops & solitaire studs",
    image: "images/chandbali_earrings.jpg"
  },
  {
    id: "bangles",
    name: "Bangles",
    icon: "🔱",
    count: 5,
    description: "Kundhan Kadas, pearl bangles & oxidised silver bangles",
    image: "images/silver_bangles.jpg"
  },
  {
    id: "gift-sets",
    name: "Gift Sets & Combos",
    icon: "🎁",
    count: 14,
    description: "Custom 4x4 & 6x8 Canvas Art Frames (₹199 - ₹299) & Handcrafted Flower Hampers",
    image: "images/couple.png"
  }
];

export const PRODUCTS = [
  {
    id: "SPK-HC-001",
    sku: "SPK-HC-001",
    name: "Plumeria flower claw clip",
    category: "hair-accessories",
    subcategory: "flower-clips",
    categoryName: "Clips",
    price: 129,
    originalPrice: 199,
    rating: 4.9,
    reviewsCount: 142,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: true,
    stock: 0,
    images: [
      "images/plumeria_flower_claw_clip_drive.jpg",
      "images/plumeria_flower_clip_drive.jpg"
    ],
    colors: [
      "Pink",
      "Peach",
      "White"
    ],
    description: "Plumeria flower claw clip from Drive. Handcrafted flower claw clip with durable spring grip.",
    details: [
      "Quantity: 1 Set (6 Pieces)",
      "Purchase Rate: ₹43/Set (₹7.1/Piece)",
      "Drive File: 1.Plumeria flower claw clip.jpg"
    ]
  },
  {
    id: "SPK-HC-002",
    sku: "SPK-HC-002",
    name: "Claw Clips",
    category: "hair-accessories",
    subcategory: "claw-clips",
    categoryName: "Clips",
    price: 139,
    originalPrice: 199,
    rating: 4.8,
    reviewsCount: 110,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: false,
    stock: 2,
    images: [
      "images/claw_clips_drive.jpg"
    ],
    colors: [
      "Pastel Beige",
      "Dusty Pink",
      "Sage Green"
    ],
    description: "Claw Clips from Drive. Premium pastel claw clips set for daily hair updos.",
    details: [
      "Quantity: 1 Set (6 Pieces)",
      "Purchase Rate: ₹63/Set (₹10.4/Piece)",
      "Drive File: 2.Claw Clips.jpg"
    ]
  },
  {
    id: "SPK-HC-003",
    sku: "SPK-HC-003",
    name: "Cross Claw Clips",
    category: "hair-accessories",
    subcategory: "claw-clips",
    categoryName: "Clips",
    price: 139,
    originalPrice: 199,
    rating: 4.9,
    reviewsCount: 88,
    isNew: false,
    isTrending: true,
    isBestSeller: false,
    isFlashSale: true,
    stock: 2,
    images: [
      "images/cross_claw_clips_drive.jpg"
    ],
    colors: [
      "Rose Gold",
      "Glossy Black"
    ],
    description: "Cross Claw Clips from Drive. Criss-cross metal claw clip with high tension spring.",
    details: [
      "Quantity: 1 Set (6 Pieces)",
      "Purchase Rate: ₹63/Set (₹10.4/Piece)",
      "Drive File: 3.Cross Claw Clips.JPG"
    ]
  },
  {
    id: "SPK-HC-004",
    sku: "SPK-HC-004",
    name: "Whale tail hair claw clips",
    category: "hair-accessories",
    subcategory: "claw-clips",
    categoryName: "Clips",
    price: 149,
    originalPrice: 199,
    rating: 4.7,
    reviewsCount: 76,
    isNew: true,
    isTrending: false,
    isBestSeller: true,
    isFlashSale: false,
    stock: 2,
    images: [
      "images/whale_tail_claw_clips_drive.jpg"
    ],
    colors: [
      "Metallic Gold",
      "Silver"
    ],
    description: "Whale tail hair claw clips from Drive. Metallic whale tail claw clip for French twist updos.",
    details: [
      "Quantity: 1 Set (6 Pieces)",
      "Purchase Rate: ₹63/Set (₹10.4/Piece)",
      "Drive File: 4.Whale tail hair claw clips.JPG"
    ]
  },
  {
    id: "SPK-HC-005",
    sku: "SPK-HC-005",
    name: "Rectangle hair claw clips",
    category: "hair-accessories",
    subcategory: "claw-clips",
    categoryName: "Clips",
    price: 99,
    originalPrice: 199,
    rating: 4.8,
    reviewsCount: 94,
    isNew: false,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: true,
    stock: 3,
    images: [
      "images/rectangle_claw_clips_drive.jpg"
    ],
    colors: [
      "Amber Tortoise",
      "Matte Nude"
    ],
    description: "Rectangle hair claw clips from Drive. Rectangular hollow claw clip for medium hair.",
    details: [
      "Quantity: 1 Set (6 Pieces)",
      "Purchase Rate: ₹74/Set (₹12.3/Piece)",
      "Drive File: 5.Rectangle hair claw clips.jpg"
    ]
  },
  {
    id: "SPK-HC-006",
    sku: "SPK-HC-006",
    name: "Pastel flower design hair claw clips",
    category: "hair-accessories",
    subcategory: "flower-clips",
    categoryName: "Clips",
    price: 79,
    originalPrice: 149,
    rating: 5,
    reviewsCount: 165,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: false,
    stock: 1,
    images: [
      "images/pastel_flower_claw_clips_drive.jpg"
    ],
    colors: [
      "Pastel Blossom Pink",
      "Lilac"
    ],
    description: "Pastel flower design hair claw clips from Drive. Handcrafted pastel floral clip (Sold Individually).",
    isIndividual: true,
    details: [
      "Quantity: 1 Piece (Sold Individually)",
      "Purchase Rate: ₹58.5/Piece",
      "Drive File: 6.Pastel flower design hair claw clips.jpg"
    ]
  },
  {
    id: "SPK-HC-007",
    sku: "SPK-HC-007",
    name: "Hawaian Plumeria flower claw clips",
    category: "hair-accessories",
    subcategory: "flower-clips",
    categoryName: "Clips",
    price: 99,
    originalPrice: 199,
    rating: 4.9,
    reviewsCount: 130,
    isNew: false,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: true,
    stock: 2,
    images: [
      "images/hawaiian_plumeria_claw_clips_drive.jpg"
    ],
    colors: [
      "White & Yellow",
      "Coral"
    ],
    description: "Hawaian Plumeria flower claw clips from Drive. Tropical Frangipani hair claws.",
    details: [
      "Quantity: 1 Set (6 Pieces)",
      "Purchase Rate: ₹65/Set (₹10.7/Piece)",
      "Drive File: 7.Hawaian Plumeria flower claw clips.jpg"
    ]
  },
  {
    id: "SPK-HC-008",
    sku: "SPK-HC-008",
    name: "Flower claw clips",
    category: "hair-accessories",
    subcategory: "flower-clips",
    categoryName: "Clips",
    price: 139,
    originalPrice: 199,
    rating: 4.8,
    reviewsCount: 102,
    isNew: true,
    isTrending: false,
    isBestSeller: false,
    isFlashSale: true,
    stock: 2,
    images: [
      "images/flower_claw_clips_drive.jpg"
    ],
    colors: [
      "Multicolor Floral"
    ],
    description: "Flower claw clips from Drive. 5-petal floral claw clip set featuring anti-slip grip.",
    details: [
      "Quantity: 1 Set (6 Pieces)",
      "Purchase Rate: ₹69/Set (₹11.4/Piece)",
      "Drive File: 8.Flower claw clips.jpg"
    ]
  },
  {
    id: "SPK-NK-101",
    sku: "SPK-NK-101",
    name: "Traditional South Indian Matte Gold Plated antiavue droplet choker neckalce set",
    category: "necklaces",
    subcategory: "chokers",
    categoryName: "Necklace Sets",
    price: 399,
    originalPrice: 699,
    rating: 5,
    reviewsCount: 195,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: true,
    stock: 1,
    images: [
      "images/traditional_south_indian_matte_gold_plated_antiavue_droplet_choker_neckalce_set_jpeg_drive.jpg"
    ],
    colors: [
      "Antique Matte Gold & Ruby Droplets"
    ],
    description: "Heritage South Indian antique gold plated choker featuring delicate droplet hangings and matching earrings.",
    details: [
      "Quantity: 1 Piece Set",
      "Purchase Price: ₹150",
      "Finish: 24K Antique Matte Gold Plating"
    ]
  },
  {
    id: "SPK-NK-102",
    sku: "SPK-NK-102",
    name: "Tradational South Indian kemp floral Necklace set",
    category: "necklaces",
    subcategory: "temple-style",
    categoryName: "Necklace Sets",
    price: 499,
    originalPrice: 899,
    rating: 4.9,
    reviewsCount: 148,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: false,
    stock: 1,
    images: [
      "images/whatsapp_image_2026_08_10_at_5_53_26_pm_jpeg_drive.jpg"
    ],
    colors: [
      "Ruby Red Kemp & Gold"
    ],
    description: "Auspicious South Indian Kemp floral motif necklace set encrusted with traditional red Kemp stones.",
    details: [
      "Quantity: 2 Pieces in Stock",
      "Purchase Price: ₹202/Piece (Total: ₹404)"
    ]
  },
  {
    id: "SPK-NK-103",
    sku: "SPK-NK-103",
    name: "Manga Malai or Mango Malia",
    category: "necklaces",
    subcategory: "temple-style",
    categoryName: "Necklace Sets",
    price: 399,
    originalPrice: 499,
    rating: 4.9,
    reviewsCount: 160,
    isNew: false,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: true,
    stock: 1,
    images: [
      "images/whatsapp_image_2026_08_10_at_6_08_20_pm_jpeg_drive.jpg"
    ],
    colors: [
      "Antique Gold & Ruby Kemp"
    ],
    description: "Classic South Indian Manga Malai (Mango Mala) necklace featuring auspicious raw mango shaped pendants.",
    details: [
      "Quantity: 1 Piece",
      "Purchase Price: ₹160"
    ]
  },
  {
    id: "SPK-NK-104",
    sku: "SPK-NK-104",
    name: "Tradatinal South Indian Mango Leaf Choker",
    category: "necklaces",
    subcategory: "chokers",
    categoryName: "Necklace Sets",
    price: 549,
    originalPrice: 799,
    rating: 4.8,
    reviewsCount: 112,
    isNew: true,
    isTrending: true,
    isBestSeller: false,
    isFlashSale: true,
    stock: 2,
    images: [
      "images/whatsapp_image_2026_08_10_at_6_16_24_pm_jpeg_drive.jpg"
    ],
    colors: [
      "Antique Gold & Green Kemp"
    ],
    description: "Royal mango leaf motif choker necklace set with antique copper gold micro polish.",
    details: [
      "Quantity: 2 Pieces in Stock",
      "Purchase Price: ₹140/Piece (Total: ₹280)"
    ]
  },
  {
    id: "SPK-NK-105",
    sku: "SPK-NK-105",
    name: "Traditonal South Indian kemp Necklace",
    category: "necklaces",
    subcategory: "temple-style",
    categoryName: "Necklace Sets",
    price: 549,
    originalPrice: 899,
    rating: 5,
    reviewsCount: 175,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: false,
    stock: 1,
    images: [
      "images/whatsapp_image_2026_08_10_at_6_59_59_pm_jpeg_drive.jpg"
    ],
    colors: [
      "Ruby & Emerald Kemp Gold"
    ],
    description: "Grand traditional South Indian temple Kemp necklace adorned with Kundan glass stones.",
    details: [
      "Quantity: 2 Pieces in Stock",
      "Purchase Price: ₹320/Piece (Total: ₹640)"
    ]
  },
  {
    id: "SPK-NK-106",
    sku: "SPK-NK-106",
    name: "Traditional South Indian Atiigai choker set",
    category: "necklaces",
    subcategory: "chokers",
    categoryName: "Necklace Sets",
    price: 549,
    originalPrice: 899,
    rating: 4.8,
    reviewsCount: 90,
    isNew: false,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: true,
    stock: 1,
    images: [
      "images/whatsapp_image_2026_08_10_at_7_05_39_pm_jpeg_drive.jpg"
    ],
    colors: [
      "Gold & Ruby Kemp"
    ],
    description: "Classic South Indian Attigai (Addigai) choker necklace set with flower cluster centerpiece.",
    details: [
      "Quantity: 1 Piece",
      "Purchase Price: ₹127"
    ]
  },
  {
    id: "SPK-NK-107",
    sku: "SPK-NK-107",
    name: "Traaditional South Indian antique matte gold ruby stand",
    category: "necklaces",
    subcategory: "temple-style",
    categoryName: "Necklace Sets",
    price: 549,
    originalPrice: 799,
    rating: 4.9,
    reviewsCount: 135,
    isNew: true,
    isTrending: false,
    isBestSeller: true,
    isFlashSale: false,
    stock: 1,
    images: [
      "images/whatsapp_image_2026_08_10_at_7_32_09_pm_jpeg_drive.jpg"
    ],
    colors: [
      "Antique Gold & Ruby Beads"
    ],
    description: "Multi-strand antique matte gold necklace detailed with synthetic ruby beads.",
    details: [
      "Quantity: 1 Piece",
      "Purchase Price: ₹230"
    ]
  },
  {
    id: "SPK-NK-108",
    sku: "SPK-NK-108",
    name: "Kasu Mala",
    category: "necklaces",
    subcategory: "temple-style",
    categoryName: "Necklace Sets",
    price: 399,
    originalPrice: 699,
    rating: 5,
    reviewsCount: 210,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: true,
    stock: 1,
    images: [
      "images/whatsapp_image_2026_08_10_at_7_46_22_pm_jpeg_drive.jpg"
    ],
    colors: [
      "Antique Gold Lakshmi Coins"
    ],
    description: "Traditional South Indian Kasu Mala (Coin Necklace) featuring engraved Goddess Lakshmi coins.",
    details: [
      "Quantity: 1 Piece",
      "Purchase Price: ₹160"
    ]
  },
  {
    id: "SPK-NK-109",
    sku: "SPK-NK-109",
    name: "Tulip Floral vine Necklace",
    category: "necklaces",
    subcategory: "chokers",
    categoryName: "Necklace Sets",
    price: 549,
    originalPrice: 899,
    rating: 4.9,
    reviewsCount: 145,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: false,
    stock: 1,
    images: [
      "images/whatsapp_image_2026_08_10_at_7_49_04_pm_jpeg_drive.jpg"
    ],
    colors: [
      "Rose Gold & Pearl Tulips"
    ],
    description: "Delicate tulip floral vine motif necklace handcrafted with micro zircon stones.",
    details: [
      "Quantity: 1 Piece",
      "Purchase Price: ₹376"
    ]
  },
  {
    id: "SPK-NK-110",
    sku: "SPK-NK-110",
    name: "Traditional South Indian Royal Temple Choker Set",
    category: "necklaces",
    subcategory: "chokers",
    categoryName: "Necklace Sets",
    price: 499,
    originalPrice: 799,
    rating: 4.9,
    reviewsCount: 125,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: true,
    stock: 0,
    images: [
      "images/whatsapp_image_2026_08_10_at_7_52_07_pm_jpeg_drive.jpg"
    ],
    colors: [
      "Antique Matte Gold & Ruby Stones"
    ],
    description: "Royal South Indian temple choker set with handcrafted antique gold finish and matching earrings.",
    details: [
      "Quantity: 1 Piece",
      "Drive File: WhatsApp Image 2026-08-10 at 7.52.07 PM.jpeg"
    ]
  },
  {
    id: "SPK-CN-201",
    sku: "SPK-CN-201",
    name: "Faux Pearl charm necklace",
    category: "chains",
    subcategory: "daily-wear",
    categoryName: "Chains",
    price: 199,
    originalPrice: 349,
    rating: 4.8,
    reviewsCount: 84,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: false,
    stock: 2,
    images: [
      "images/faux_pearl_charm_necklace_drive.jpg"
    ],
    colors: [
      "Gold & White Faux Pearl"
    ],
    description: "Faux Pearl charm necklace from Drive. Minimalist gold chain centered with faux pearl charm.",
    details: [
      "Quantity: 2 Pieces in Stock",
      "Purchase Price: ₹72/Piece (Total: ₹144)",
      "Drive File: 1.Faux Pearl charm necklace.JPG"
    ]
  },
  {
    id: "SPK-CN-202",
    sku: "SPK-CN-202",
    name: "Adjustable Floral Bolo Necklace",
    category: "chains",
    subcategory: "daily-wear",
    categoryName: "Chains",
    price: 149,
    originalPrice: 249,
    rating: 4.7,
    reviewsCount: 62,
    isNew: false,
    isTrending: true,
    isBestSeller: false,
    isFlashSale: true,
    stock: 0,
    images: [
      "images/adjustable_floral_bolo_necklace_drive.jpg"
    ],
    colors: [
      "Rose Gold Floral"
    ],
    description: "Adjustable Floral Bolo Necklace from Drive. Bolo style chain necklace with flower slider.",
    details: [
      "Quantity: 1 Piece",
      "Purchase Price: ₹36",
      "Drive File: 2.Adjustable Floral Bolo Necklace.JPG"
    ]
  },
  {
    id: "SPK-CN-203",
    sku: "SPK-CN-203",
    name: "Green oval stone antitarnish gold plated stainless chain",
    category: "chains",
    subcategory: "anti-tarnish",
    categoryName: "Chains",
    price: 249,
    originalPrice: 449,
    rating: 4.9,
    reviewsCount: 140,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: true,
    stock: 0,
    images: [
      "images/green_oval_stone_chain_drive.jpg"
    ],
    colors: [
      "Emerald Green & Gold"
    ],
    description: "Green oval stone chain from Drive. Waterproof anti-tarnish stainless chain with emerald green stone.",
    details: [
      "Quantity: 1 Piece",
      "Purchase Price: ₹95",
      "Drive File: 3.Green oval stone antitarnish gold plated stainless chain.JPG"
    ]
  },
  {
    id: "SPK-CN-204",
    sku: "SPK-CN-204",
    name: "Flat Snake Chain",
    category: "chains",
    subcategory: "anti-tarnish",
    categoryName: "Chains",
    price: 299,
    originalPrice: 499,
    rating: 4.9,
    reviewsCount: 155,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: false,
    stock: 0,
    images: [
      "images/flat_snake_chain_drive.jpg"
    ],
    colors: [
      "Glossy 18K Gold"
    ],
    description: "Flat Snake Chain from Drive. Sleek liquid-smooth flat herringbone snake chain.",
    details: [
      "Quantity: 1 Piece",
      "Purchase Price: ₹110",
      "Drive File: 4.Flat Snake Chain.JPG"
    ]
  },
  {
    id: "SPK-CN-205",
    sku: "SPK-CN-205",
    name: "Satellite Chain",
    category: "chains",
    subcategory: "daily-wear",
    categoryName: "Chains",
    price: 299,
    originalPrice: 499,
    rating: 4.7,
    reviewsCount: 72,
    isNew: false,
    isTrending: false,
    isBestSeller: true,
    isFlashSale: true,
    stock: 0,
    images: [
      "images/satellite_chain_drive.jpg"
    ],
    colors: [
      "Gold Beaded Chain"
    ],
    description: "Satellite Chain from Drive. Cable chain featuring tiny textured gold beads.",
    details: [
      "Quantity: 1 Piece",
      "Purchase Price: ₹48",
      "Drive File: 5.Satellite Chain.JPG"
    ]
  },
  {
    id: "SPK-CN-206",
    sku: "SPK-CN-206",
    name: "Crystal heart pendant minimal gold chain necklace",
    category: "chains",
    subcategory: "daily-wear",
    categoryName: "Chains",
    price: 399,
    originalPrice: 699,
    rating: 4.8,
    reviewsCount: 98,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: true,
    stock: 0,
    images: [
      "images/crystal_heart_pendant_drive.jpg"
    ],
    colors: [
      "Clear Crystal & Rose Gold"
    ],
    description: "Crystal heart pendant necklace from Drive. Faceted crystal heart pendant on gold chain.",
    details: [
      "Quantity: 1 Piece",
      "Purchase Price: ₹85",
      "Drive File: 6.Crystal heart pendant minimal gold chain necklace.JPG"
    ]
  },
  {
    id: "SPK-CN-207",
    sku: "SPK-CN-207",
    name: "North star pendant neckalce",
    category: "chains",
    subcategory: "daily-wear",
    categoryName: "Chains",
    price: 249,
    originalPrice: 449,
    rating: 4.8,
    reviewsCount: 86,
    isNew: true,
    isTrending: true,
    isBestSeller: false,
    isFlashSale: false,
    stock: 0,
    images: [
      "images/north_star_pendant_drive.jpg"
    ],
    colors: [
      "Gold & Zircon Star"
    ],
    description: "North star pendant necklace from Drive. Celestial North Star compass medallion.",
    details: [
      "Quantity: 1 Piece",
      "Purchase Price: ₹75",
      "Drive File: 7.North star pendant neckalce.JPG"
    ]
  },
  {
    id: "SPK-CN-208",
    sku: "SPK-CN-208",
    name: "Round Snake Neck",
    category: "chains",
    subcategory: "daily-wear",
    categoryName: "Chains",
    price: 299,
    originalPrice: 499,
    rating: 4.7,
    stock: 0,
    images: [
      "images/round_snake_necklace_drive.jpg"
    ],
    colors: [
      "High Polish Gold"
    ],
    description: "Round Snake Neck from Drive. Classic round flexible snake chain necklace.",
    details: [
      "Quantity: 1 Piece",
      "Purchase Price: ₹90",
      "Drive File: 8.Round Snake Neck.JPG"
    ]
  },
  {
    id: "SPK-BR-301",
    sku: "SPK-BR-301",
    name: "Beaded Charm bracelet",
    category: "bracelets",
    subcategory: "fashion-bracelets",
    categoryName: "Bracelets",
    price: 139,
    originalPrice: 199,
    rating: 4.9,
    reviewsCount: 95,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: true,
    stock: 1,
    sizes: ["2.1", "2.3"],
    images: [
      "images/1_beaded_charm_bracelet_1_jpg_drive.jpg",
      "images/1_beaded_charm_bracelet_2_jpg_drive.jpg",
      "images/1_beaded_charm_bracelet_3_jpg_drive.jpg",
      "images/1_beaded_charm_bracelet_4_jpg_drive.jpg"
    ],
    colors: [
      "Gold & Pearl Charms"
    ],
    description: "Beaded Charm bracelet from Drive. Strung with gold heart, star, and pearl charms.",
    details: [
      "Quantity: 1 Set (4 Pieces)",
      "Purchase Rate: ₹144/Set (₹36/Piece)"
    ]
  },
  {
    id: "SPK-BR-302",
    sku: "SPK-BR-302",
    name: "Adjustable gold plated kada Bracelet",
    category: "bracelets",
    subcategory: "chain-bracelets",
    categoryName: "Bracelets",
    price: 299,
    originalPrice: 399,
    rating: 5,
    reviewsCount: 165,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: false,
    stock: 1,
    images: [
      "images/2_adjustable_gold_plated_kada_bracelet_1_jpg_drive.jpg",
      "images/2_adjustable_gold_plated_kada_bracelet_2_jpg_drive.jpg",
      "images/2_adjustable_gold_plated_kada_bracelet_3_jpg_drive.jpg",
      "images/2_adjustable_gold_plated_kada_bracelet_4_jpg_drive.jpg",
      "images/2_adjustable_gold_plated_kada_bracelet_5_jpg_drive.jpg"
    ],
    colors: [
      "18K Micro Gold Polish"
    ],
    description: "Adjustable gold plated kada Bracelet from Drive. Statement openable flexible Kada.",
    details: [
      "Quantity: 1 Set (5 Pieces)",
      "Purchase Rate: ₹860/Set (₹172/Piece)"
    ]
  },
  {
    id: "SPK-BR-303",
    sku: "SPK-BR-303",
    name: "Sunflower beaded chain bracelet",
    category: "bracelets",
    subcategory: "fashion-bracelets",
    categoryName: "Bracelets",
    price: 119,
    originalPrice: 199,
    rating: 4.7,
    reviewsCount: 78,
    isNew: true,
    isTrending: false,
    isBestSeller: true,
    isFlashSale: true,
    stock: 3,
    images: [
      "images/bracelet_drive_3.sunflower_beaded_chain_bracelet.jpg"
    ],
    colors: [
      "Yellow Sunflower & Gold Beads"
    ],
    description: "Sunflower beaded chain bracelet from Drive. Sunflower enamel charm chain bracelet.",
    details: [
      "Quantity: 5 Pieces in Stock",
      "Purchase Price: ₹42/Piece (Total: ₹210)"
    ]
  },
  {
    id: "SPK-BR-304",
    sku: "SPK-BR-304",
    name: "Gold Plated Multicolour square stone link bracelet",
    category: "bracelets",
    subcategory: "stone-bracelets",
    categoryName: "Bracelets",
    price: 119,
    originalPrice: 199,
    rating: 4.9,
    reviewsCount: 120,
    isNew: false,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: true,
    stock: 4,
    images: [
      "images/bracelet_drive_4.gold_plated_multicolour_square_stone_link_bracelet.jpg"
    ],
    colors: [
      "Multicolor Gemstones & Gold"
    ],
    description: "Gold Plated Multicolour square stone link bracelet from Drive. Rainbow crystal link bracelet.",
    details: [
      "Quantity: 9 Pieces in Stock",
      "Purchase Price: ₹36/Piece (Total: ₹324)"
    ]
  },
  {
    id: "SPK-BR-305",
    sku: "SPK-BR-305",
    name: "Nazar Protection Bracelet",
    category: "bracelets",
    subcategory: "fashion-bracelets",
    categoryName: "Bracelets",
    price: 99,
    originalPrice: 169,
    rating: 4.9,
    reviewsCount: 140,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: true,
    stock: 5,
    images: [
      "images/bracelet_drive_5.nazar_protection_bracelet.jpg"
    ],
    colors: [
      "Blue Evil Eye & Gold Beads"
    ],
    description: "Nazar Protection Bracelet from Drive. Protective blue glass evil eye charm bracelet.",
    details: [
      "Quantity: 8 Pieces in Stock",
      "Purchase Price: ₹35/Piece"
    ]
  },
  {
    id: "SPK-BR-306",
    sku: "SPK-BR-306",
    name: "Multicolour Beaded Station Chain Bracelet",
    category: "bracelets",
    subcategory: "fashion-bracelets",
    categoryName: "Bracelets",
    price: 129,
    originalPrice: 219,
    rating: 4.8,
    reviewsCount: 88,
    isNew: true,
    isTrending: true,
    isBestSeller: false,
    isFlashSale: false,
    stock: 5,
    images: [
      "images/bracelet_drive_6.multicolour_beaded_station_chain_bracelet.jpg"
    ],
    colors: [
      "Rainbow Beads & Gold Chain"
    ],
    description: "Multicolour Beaded Station Chain Bracelet from Drive. Multi-colored glass beads along fine chain.",
    details: [
      "Quantity: 6 Pieces in Stock",
      "Purchase Price: ₹40/Piece"
    ]
  },
  {
    id: "SPK-BR-307",
    sku: "SPK-BR-307",
    name: "Sunflower beaded chain multicolour",
    category: "bracelets",
    subcategory: "fashion-bracelets",
    categoryName: "Bracelets",
    price: 139,
    originalPrice: 229,
    rating: 4.7,
    reviewsCount: 65,
    isNew: false,
    isTrending: true,
    isBestSeller: false,
    isFlashSale: true,
    stock: 5,
    images: [
      "images/bracelet_drive_7.sunflower_beaded_chain_multicolour.jpg"
    ],
    colors: [
      "Multicolor Sunflower & Pastel Beads"
    ],
    description: "Sunflower beaded chain multicolour from Drive. Summer floral chain bracelet with enamel sunflower.",
    details: [
      "Quantity: 1 Piece",
      "Purchase Price: ₹42"
    ]
  },
  {
    id: "SPK-BR-308",
    sku: "SPK-BR-308",
    name: "Sunflower beaded nazar protection",
    category: "bracelets",
    subcategory: "fashion-bracelets",
    categoryName: "Bracelets",
    price: 139,
    originalPrice: 229,
    rating: 4.8,
    reviewsCount: 75,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: true,
    stock: 1,
    images: [
      "images/bracelet_drive_8.sunflower_beaded_nazar_protection.jpg"
    ],
    colors: [
      "Yellow Sunflower & Evil Eye"
    ],
    description: "Sunflower beaded nazar protection from Drive. Fusion bracelet combining sunflower and Nazar eye.",
    details: [
      "Quantity: 1 Piece",
      "Purchase Price: ₹45"
    ]
  },
  {
    id: "SPK-BR-309",
    sku: "SPK-BR-309",
    name: "Cresent moon charm bracelet",
    category: "bracelets",
    subcategory: "fashion-bracelets",
    categoryName: "Bracelets",
    price: 129,
    originalPrice: 219,
    rating: 4.9,
    reviewsCount: 95,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: false,
    stock: 1,
    images: [
      "images/bracelet_drive_9.cresent_moon_charm_bracelet.jpg"
    ],
    colors: [
      "Gold & Crystal Moon"
    ],
    description: "Cresent moon charm bracelet from Drive. Celestial crescent moon charm bracelet with crystals.",
    details: [
      "Quantity: 1 Piece",
      "Purchase Price: ₹48"
    ]
  },
  {
    id: "SPK-BR-310",
    sku: "SPK-BR-310",
    name: "Wavy Chain fish charm bracelet",
    category: "bracelets",
    subcategory: "fashion-bracelets",
    categoryName: "Bracelets",
    price: 119,
    originalPrice: 199,
    rating: 4.7,
    reviewsCount: 55,
    isNew: false,
    isTrending: false,
    isBestSeller: false,
    isFlashSale: true,
    stock: 1,
    images: [
      "images/bracelet_drive_10.wavy_chain_fish_charm_bracelet.jpg"
    ],
    colors: [
      "Gold Wavy Link & Fish Charm"
    ],
    description: "Wavy Chain fish charm bracelet from Drive. Wavy link chain bracelet centered with gold fish.",
    details: [
      "Quantity: 1 Piece",
      "Purchase Price: ₹48"
    ]
  },
  {
    id: "SPK-BR-311",
    sku: "SPK-BR-311",
    name: "Gold plated Multicolour heart",
    category: "bracelets",
    subcategory: "stone-bracelets",
    categoryName: "Bracelets",
    price: 129,
    originalPrice: 219,
    rating: 4.8,
    reviewsCount: 82,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: true,
    stock: 1,
    images: [
      "images/bracelet_drive_11.gold_plated_multicolour_heart.jpg"
    ],
    colors: [
      "Multicolor Heart Gems & Gold"
    ],
    description: "Gold plated Multicolour heart from Drive. Link bracelet set with heart-cut multi-colored stones.",
    details: [
      "Quantity: 1 Piece",
      "Purchase Price: ₹50"
    ]
  },
  {
    id: "SPK-BR-312",
    sku: "SPK-BR-312",
    name: "Gold Heart Bracelet",
    category: "bracelets",
    subcategory: "chain-bracelets",
    categoryName: "Bracelets",
    price: 129,
    originalPrice: 219,
    rating: 4.8,
    reviewsCount: 90,
    isNew: false,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: false,
    stock: 1,
    images: [
      "images/bracelet_drive_12.gold_heart_bracelet.jpg"
    ],
    colors: [
      "High Luster Gold"
    ],
    description: "Gold Heart Bracelet from Drive. High-polish gold heart link bracelet.",
    details: [
      "Quantity: 1 Piece",
      "Purchase Price: ₹48"
    ]
  },
  {
    id: "SPK-BR-313",
    sku: "SPK-BR-313",
    name: "Gold Plated Multicolour Heart Crystal link Bracelet",
    category: "bracelets",
    subcategory: "stone-bracelets",
    categoryName: "Bracelets",
    price: 129,
    originalPrice: 219,
    rating: 4.9,
    reviewsCount: 104,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: true,
    stock: 1,
    images: [
      "images/bracelet_drive_13.gold_plated_multicolour_heart_crystal_link_bracelet.jpg"
    ],
    colors: [
      "Rainbow Heart Crystals"
    ],
    description: "Gold Plated Multicolour Heart Crystal link Bracelet from Drive. Sequential rainbow crystal hearts.",
    details: [
      "Quantity: 1 Piece",
      "Purchase Price: ₹55"
    ]
  },
  {
    id: "SPK-ER-401",
    sku: "SPK-ER-401",
    name: "Kundan chanbali Earings",
    category: "earrings",
    subcategory: "traditional-earrings",
    categoryName: "Ear Rings",
    price: 199,
    originalPrice: 349,
    rating: 5,
    reviewsCount: 190,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: true,
    stock: 1,
    images: [
      "images/1_kundan_chanbali_earings.jpg"
    ],
    colors: [
      "Antique Gold & Pearl Hangings"
    ],
    description: "Kundan Chandbali Earrings from Drive. Traditional crescent moon Chandbali with delicate pearl drops and filigree work.",
    details: [
      "Quantity: 1 Pair",
      "Material: Gold Plated with Kundan Stone",
      "Style: Traditional South Indian",
      "Purchase Price: ₹162"
    ]
  },
  {
    id: "SPK-ER-402",
    sku: "SPK-ER-402",
    name: "Kundan Dangler Earings",
    category: "earrings",
    subcategory: "traditional-earrings",
    categoryName: "Ear Rings",
    price: 199,
    originalPrice: 349,
    rating: 4.9,
    reviewsCount: 130,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: false,
    stock: 1,
    images: [
      "images/2_kundan_dangler_earings.jpg"
    ],
    colors: [
      "Gold & Pearl Clusters"
    ],
    description: "Kundan Dangler Earrings from Drive. Kundan drop dangler with intricate filigree pattern and pearl clusters.",
    details: [
      "Quantity: 1 Pair",
      "Material: Gold Plated with Kundan & Pearl",
      "Style: Drop Danglers",
      "Purchase Price: ₹120"
    ]
  },
  {
    id: "SPK-ER-403",
    sku: "SPK-ER-403",
    name: "Double hoop earings for a single piecering",
    category: "earrings",
    subcategory: "hoops",
    categoryName: "Ear Rings",
    price: 149,
    originalPrice: 249,
    rating: 4.7,
    reviewsCount: 74,
    isNew: false,
    isTrending: true,
    isBestSeller: false,
    isFlashSale: true,
    stock: 6,
    images: [
      "images/3_double_hoop_earings_for_a_single_piecering.jpg"
    ],
    colors: [
      "Gold Illusion Double Hoop"
    ],
    description: "Double Hoop Earrings for Single Piercing from Drive. Create an illusion of double piercings with this single piercing earring.",
    details: [
      "Quantity: 1 Pair",
      "Material: Gold Plated Brass",
      "Piercing: Single Ear Piercing",
      "Purchase Price: ₹60"
    ]
  },
  {
    id: "SPK-ER-404",
    sku: "SPK-ER-404",
    name: "Gold Hoop",
    category: "earrings",
    subcategory: "hoops",
    categoryName: "Ear Rings",
    price: 299,
    originalPrice: 499,
    rating: 4.8,
    reviewsCount: 115,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: true,
    stock: 1,
    images: [
      "images/4_gold_hoop_1.jpg",
      "images/4_gold_hoop_2.jpg"
    ],
    colors: [
      "18K Gold Polished"
    ],
    description: "Gold Hoop Earrings from Drive. Classic high-polish medium gold hoop earrings with timeless appeal and versatile styling.",
    details: [
      "Quantity: 1 Pair",
      "Material: 18K Gold Plated",
      "Style: Classic Medium Hoops",
      "Purchase Price: ₹96 each"
    ]
  },
  {
    id: "SPK-ER-405",
    sku: "SPK-ER-405",
    name: "Gold plated pair earings combo set",
    category: "earrings",
    subcategory: "hoops",
    categoryName: "Ear Rings",
    price: 199,
    originalPrice: 349,
    rating: 4.8,
    reviewsCount: 82,
    isNew: false,
    isTrending: false,
    isBestSeller: true,
    isFlashSale: true,
    stock: 1,
    images: [
      "images/5_gold_plated_pair_earings_combo_set.jpg"
    ],
    colors: [
      "Gold Plated Assortment"
    ],
    description: "Gold Plated Pair Earrings Combo from Drive. Versatile gold-plated pair set perfect for everyday wear and special occasions.",
    details: [
      "Quantity: 1 Combo Set",
      "Material: Gold Plated Brass",
      "Pieces: 2 Pairs",
      "Purchase Price: ₹80"
    ]
  },
  {
    id: "SPK-ER-406",
    sku: "SPK-ER-406",
    name: "Studs",
    category: "earrings",
    subcategory: "studs",
    categoryName: "Ear Rings",
    price: 49,
    originalPrice: 79,
    rating: 5,
    reviewsCount: 160,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: false,
    stock: 30,
    images: [
      "images/6_studs_1.jpg",
      "images/6_studs_2.jpg",
      "images/6_studs_3.jpg",
      "images/6_studs_4.jpg",
      "images/6_studs_5.jpg"
    ],
    colors: [
      "Clear Zircon & Gold"
    ],
    description: "Stud Earrings Multipack Collection from Drive. Gorgeous collection of sparkling cubic zirconia stud earrings in multiple styles.",
    details: [
      "Quantity: 5 Pairs",
      "Material: Gold Plated with CZ Stones",
      "Variety: Multiple styles included",
      "Purchase Price: ₹240"
    ]
  },
  {
    id: "SPK-ER-407",
    sku: "SPK-ER-407",
    name: "Huggie earings with pearl and ball drops",
    category: "earrings",
    subcategory: "studs",
    categoryName: "Ear Rings",
    price: 149,
    originalPrice: 249,
    rating: 4.8,
    reviewsCount: 92,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: true,
    stock: 1,
    images: [
      "images/7_huggie_earings_with_pearl_and_ball_drops_1.jpg",
      "images/7_huggie_earings_with_pearl_and_ball_drops_2.jpg"
    ],
    colors: [
      "Gold & Pearl Drops"
    ],
    description: "Huggie Earrings with Pearl & Ball Drops from Drive. Dainty huggie hoops with delicate pearl and ball drop charms.",
    details: [
      "Quantity: 1 Pair",
      "Material: Gold Plated with Pearl Drops",
      "Style: Huggie Hoops with Charms",
      "Purchase Price: ₹72"
    ]
  },
  {
    id: "SPK-ER-408",
    sku: "SPK-ER-408",
    name: "Hoop and stud earings mutlipack combo set",
    category: "earrings",
    subcategory: "hoops",
    categoryName: "Ear Rings",
    price: 199,
    originalPrice: 349,
    rating: 4.8,
    reviewsCount: 105,
    isNew: false,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: true,
    stock: 1,
    images: [
      "images/8_hoop_and_stud_earings_mutlipack_combo_set.jpg"
    ],
    colors: [
      "Gold Assortment"
    ],
    description: "Hoop & Stud Earrings Multipack Combo from Drive. Complete ear-stack combo set with classic hoops and studs for versatile styling.",
    details: [
      "Quantity: 1 Combo Set",
      "Material: Gold Plated Brass with CZ",
      "Pieces: Multiple Hoop & Stud Pairs",
      "Purchase Price: ₹80"
    ]
  },
  {
    id: "SPK-BG-501",
    sku: "SPK-BG-501",
    name: "Kundhan Kadas",
    category: "bangles",
    subcategory: "kemp-bangles",
    categoryName: "Bangles",
    price: 149,
    originalPrice: 249,
    rating: 5,
    reviewsCount: 150,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: true,
    stock: 8,
    sizes: ["2*4", "2*6", "2*8"],
    images: [
      "images/bangles_1.png"
    ],
    colors: [
      "Antique Gold & Kundan Work"
    ],
    description: "1.png Kundhan Kadas from Drive BANGLES folder.",
    details: [
      "Bangle Sizes Available: 2*4, 2*6, 2*8",
      "Quantity: 1 Set (16 Pieces)",
      "Purchase Price: ₹150",
      "Drive File: 1.png"
    ]
  },
  {
    id: "SPK-BG-502",
    sku: "SPK-BG-502",
    name: "Oxidised silver thin metal bangles",
    category: "bangles",
    subcategory: "metal-bangles",
    categoryName: "Bangles",
    price: 129,
    originalPrice: 199,
    rating: 4.9,
    reviewsCount: 175,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: false,
    stock: 20,
    sizes: ["2*4", "2*6", "2*8"],
    images: [
      "images/bangles_2.png"
    ],
    colors: [
      "Oxidised Silver Finish"
    ],
    description: "2.png Oxidised silver thin metal bangles from Drive BANGLES folder.",
    details: [
      "Bangle Sizes Available: 2*4, 2*6, 2*8",
      "Quantity: 10 Sets (40 Pieces)",
      "Purchase Rate: ₹74/Set (Total: ₹740)",
      "Drive File: 2.png"
    ]
  },
  {
    id: "SPK-BG-503",
    sku: "SPK-BG-503",
    name: "Kemp Stone Bangles",
    category: "bangles",
    subcategory: "kemp-bangles",
    categoryName: "Bangles",
    price: 169,
    originalPrice: 249,
    rating: 4.9,
    reviewsCount: 138,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: true,
    stock: 7,
    sizes: ["2*4", "2*6", "2*8"],
    images: [
      "images/bangles_3.png"
    ],
    colors: [
      "Ruby Red Kemp & Gold"
    ],
    description: "3.png Kemp Stone Bangles from Drive BANGLES folder.",
    details: [
      "Bangle Sizes Available: 2*4, 2*6, 2*8",
      "Quantity: 6 Sets (30 Pieces)",
      "Purchase Rate: ₹81/Set (Total: ₹486)",
      "Drive File: 3.png"
    ]
  },
  {
    id: "SPK-BG-504",
    sku: "SPK-BG-504",
    name: "Silver Stone Chura Set",
    category: "bangles",
    subcategory: "chura-sets",
    categoryName: "Bangles",
    price: 249,
    originalPrice: 399,
    rating: 5,
    reviewsCount: 162,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: false,
    stock: 4,
    sizes: ["2*4", "2*6", "2*8"],
    images: [
      "images/bangles_4.png"
    ],
    colors: [
      "Silver & Cubic Zirconia"
    ],
    description: "4.png Silver Stone Chura Set from Drive BANGLES folder.",
    details: [
      "Bangle Sizes Available: 2*4, 2*6, 2*8",
      "Quantity: 4 Sets (8 Pieces)",
      "Purchase Rate: ₹110/Set (Total: ₹440)",
      "Drive File: 4.png"
    ]
  },
  {
    id: "SPK-BG-505",
    sku: "SPK-BG-505",
    name: "Antique gold plated metal bangle",
    category: "bangles",
    subcategory: "metal-bangles",
    categoryName: "Bangles",
    price: 249,
    originalPrice: 299,
    rating: 4.8,
    reviewsCount: 110,
    isNew: false,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: true,
    stock: 6,
    sizes: ["2*4", "2*6", "2*8"],
    images: [
      "images/bangles_5.png"
    ],
    colors: [
      "Antique Matte Gold"
    ],
    description: "5.png Antique gold plated metal bangle from Drive BANGLES folder.",
    details: [
      "Bangle Sizes Available: 2*4, 2*6, 2*8",
      "Quantity: 6 Sets (12 Pieces)",
      "Purchase Rate: ₹65/Set (Total: ₹195)",
      "Drive File: 5.png"
    ]
  },
  {
    id: "SPK-CV-001",
    sku: "SPK-CV-001",
    name: "Couple Custom Canvas Frame (4x4 Inch)",
    category: "gift-sets",
    subcategory: "canvas",
    categoryName: "Gift Sets & Combos",
    price: 299,
    originalPrice: 399,
    rating: 5,
    reviewsCount: 185,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: true,
    stock: 10,
    images: [
      "images/couple.png"
    ],
    colors: [
      "4 x 4 Inch Custom Frame"
    ],
    description: "Handcrafted 4x4 inch personalized couple portrait canvas frame gift.",
    details: [
      "Category: CANVAS",
      "Product Price: ₹199",
      "Frame Size: 4 × 4 Inches",
      "Drive File: couple.png"
    ]
  },
  {
    id: "SPK-CV-002",
    sku: "SPK-CV-002",
    name: "Krishna Canvas Frame (4x4 Inch)",
    category: "gift-sets",
    subcategory: "canvas",
    categoryName: "Gift Sets & Combos",
    price: 299,
    originalPrice: 399,
    rating: 5,
    reviewsCount: 210,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: true,
    stock: 10,
    images: [
      "images/Krishna.png"
    ],
    colors: [
      "4 x 4 Inch Custom Frame"
    ],
    description: "Divine Lord Krishna 4x4 inch wooden canvas art print frame.",
    details: [
      "Category: CANVAS",
      "Product Price: ₹199",
      "Frame Size: 4 × 4 Inches",
      "Drive File: Krishna.png"
    ]
  },
  {
    id: "SPK-CV-003",
    sku: "SPK-CV-003",
    name: "Radhakrishna Canvas Frame (4x4 Inch)",
    category: "gift-sets",
    subcategory: "canvas",
    categoryName: "Gift Sets & Combos",
    price: 299,
    originalPrice: 399,
    rating: 5,
    reviewsCount: 245,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: true,
    stock: 10,
    images: [
      "images/Radhakrishna.png"
    ],
    colors: [
      "4 x 4 Inch Custom Frame"
    ],
    description: "Auspicious Radha Krishna divine 4x4 inch canvas art frame.",
    details: [
      "Category: CANVAS",
      "Product Price: ₹199",
      "Frame Size: 4 × 4 Inches",
      "Drive File: Radhakrishna.png"
    ]
  },
  {
    id: "SPK-CV-004",
    sku: "SPK-CV-004",
    name: "Rohit Custom Canvas Frame (4x4 Inch)",
    category: "gift-sets",
    subcategory: "canvas",
    categoryName: "Gift Sets & Combos",
    price: 299,
    originalPrice: 399,
    rating: 4.9,
    reviewsCount: 160,
    isNew: true,
    isTrending: true,
    isBestSeller: false,
    isFlashSale: true,
    stock: 10,
    images: [
      "images/Rohit.png"
    ],
    colors: [
      "4 x 4 Inch Custom Frame"
    ],
    description: "Personalized custom name art 4x4 inch canvas print frame.",
    details: [
      "Category: CANVAS",
      "Product Price: ₹199",
      "Frame Size: 4 × 4 Inches",
      "Drive File: Rohit.png"
    ]
  },
  {
    id: "SPK-CV-005",
    sku: "SPK-CV-005",
    name: "Shiva Canvas Frame (4x4 Inch)",
    category: "gift-sets",
    subcategory: "canvas",
    categoryName: "Gift Sets & Combos",
    price: 249,
    originalPrice: 399,
    rating: 5,
    reviewsCount: 190,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: true,
    stock: 10,
    images: [
      "images/Shiva.jpg"
    ],
    colors: [
      "4 x 4 Inch Custom Frame"
    ],
    description: "Sacred Lord Shiva spiritual 4x4 inch canvas art frame.",
    details: [
      "Category: CANVAS",
      "Product Price: ₹199",
      "Frame Size: 4 × 4 Inches",
      "Drive File: Shiva.jpg"
    ]
  },
  {
    id: "SPK-CV-006",
    sku: "SPK-CV-006",
    name: "Swan Art Canvas Frame (4x4 Inch)",
    category: "gift-sets",
    subcategory: "canvas",
    categoryName: "Gift Sets & Combos",
    price: 199,
    originalPrice: 399,
    rating: 4.9,
    reviewsCount: 135,
    isNew: true,
    isTrending: true,
    isBestSeller: false,
    isFlashSale: true,
    stock: 10,
    images: [
      "images/Swan.jpg"
    ],
    colors: [
      "4 x 4 Inch Custom Frame"
    ],
    description: "Elegant Graceful Swan 4x4 inch artwork canvas frame.",
    details: [
      "Category: CANVAS",
      "Product Price: ₹199",
      "Frame Size: 4 × 4 Inches",
      "Drive File: Swan.jpg"
    ]
  },
  {
    id: "SPK-CV-007",
    sku: "SPK-CV-007",
    name: "Couple Hands Holding Canvas Frame (4x4 Inch)",
    category: "gift-sets",
    subcategory: "canvas",
    categoryName: "Gift Sets & Combos",
    price: 199,
    originalPrice: 399,
    rating: 5,
    reviewsCount: 175,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: true,
    stock: 10,
    images: [
      "images/couple_hands_2.png"
    ],
    colors: [
      "4 x 4 Inch Custom Frame"
    ],
    description: "Personalized Couple Hands holding romantic 4x4 inch canvas print frame.",
    details: [
      "Category: CANVAS",
      "Product Price: ₹199",
      "Frame Size: 4 × 4 Inches",
      "Drive File: couple_hands_2.png"
    ]
  },
  {
    id: "SPK-CV-008",
    sku: "SPK-CV-008",
    name: "Love Beyond Words Romance Canvas Frame (4x4 Inch)",
    category: "gift-sets",
    subcategory: "canvas",
    categoryName: "Gift Sets & Combos",
    price: 249,
    originalPrice: 399,
    rating: 5,
    reviewsCount: 198,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: true,
    stock: 10,
    images: [
      "images/love_beyond_words_2.png"
    ],
    colors: [
      "4 x 4 Inch Custom Frame"
    ],
    description: "Romantic Love Beyond Words custom portrait 4x4 inch canvas frame.",
    details: [
      "Category: CANVAS",
      "Product Price: ₹199",
      "Frame Size: 4 × 4 Inches",
      "Drive File: love_beyond_words_2.png"
    ]
  },
  {
    id: "SPK-CV-009",
    sku: "SPK-CV-009",
    name: "Love Couples Romantic Canvas Frame (4x4 Inch)",
    category: "gift-sets",
    subcategory: "canvas",
    categoryName: "Gift Sets & Combos",
    price: 249,
    originalPrice: 399,
    rating: 4.9,
    reviewsCount: 220,
    isNew: true,
    isTrending: true,
    isBestSeller: false,
    isFlashSale: true,
    stock: 10,
    images: [
      "images/love_couples_2.png"
    ],
    colors: [
      "4 x 4 Inch Custom Frame"
    ],
    description: "Cute Couple Love romantic gift 4x4 inch wooden canvas art frame.",
    details: [
      "Category: CANVAS",
      "Product Price: ₹199",
      "Frame Size: 4 × 4 Inches",
      "Drive File: love_couples_2.png"
    ]
  },
  {
    id: "SPK-CV-010",
    sku: "SPK-CV-010",
    name: "Love In Every Stroke Canvas Frame (4x4 Inch)",
    category: "gift-sets",
    subcategory: "canvas",
    categoryName: "Gift Sets & Combos",
    price: 249,
    originalPrice: 399,
    rating: 5,
    reviewsCount: 165,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: true,
    stock: 10,
    images: [
      "images/love_in_every_stroke_2.png"
    ],
    colors: [
      "4 x 4 Inch Custom Frame"
    ],
    description: "Artistic Love in Every Stroke customized 4x4 inch canvas artwork.",
    details: [
      "Category: CANVAS",
      "Product Price: ₹199",
      "Frame Size: 4 × 4 Inches",
      "Drive File: love_in_every_stroke_2.png"
    ]
  },
  {
    id: "SPK-CV-011",
    sku: "SPK-CV-011",
    name: "Sun & Mountains Sunset Canvas Frame (6x8 Inch)",
    category: "gift-sets",
    subcategory: "canvas",
    categoryName: "Gift Sets & Combos",
    price: 299,
    originalPrice: 599,
    rating: 5,
    reviewsCount: 140,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: true,
    stock: 10,
    images: [
      "images/sun_mountains_2.png"
    ],
    colors: [
      "6 x 8 Inch Landscape Frame"
    ],
    description: "Scenic Sun & Mountains Sunset landscape 6x8 inch canvas artwork frame.",
    details: [
      "Category: CANVAS",
      "Product Price: ₹299",
      "Frame Size: 6 × 8 Inches",
      "Drive File: sun_mountains_2.png"
    ]
  },
  {
    id: "SPK-CV-012",
    sku: "SPK-CV-012",
    name: "Cute Shin-Chan Heart Canvas Frame",
    category: "gift-sets",
    subcategory: "canvas",
    categoryName: "Gift Sets & Combos",
    price: 299,
    originalPrice: 399,
    rating: 5,
    reviewsCount: 245,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: true,
    stock: 20,
    images: [
      "images/shin-chan.png"
    ],
    colors: [
      "4 x 4 Inch Custom Frame"
    ],
    description: "Cute Handcrafted Shin-Chan heart pose 4x4 inch canvas art frame gift.",
    details: [
      "Category: CANVAS",
      "Product Price: ₹299",
      "Frame Size: 4 × 4 Inches",
      "Drive File: shin-chan.png"
    ]
  },
  {
    id: "SPK-CV-004",
    sku: "SPK-CV-004",
    name: "Rohit Sharma Champions Canvas Frame (4x4 Inch)",
    category: "gift-sets",
    subcategory: "canvas",
    categoryName: "Gift Sets & Combos",
    price: 299,
    originalPrice: 399,
    rating: 5,
    reviewsCount: 310,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: true,
    stock: 15,
    images: [
      "images/rohit_aesthetic.png"
    ],
    colors: [
      "4 x 4 Inch Custom Frame"
    ],
    description: "Rohit Sharma Champions 2024 World Cup trophy celebration 4x4 inch canvas art frame on wooden easel.",
    details: [
      "Category: CANVAS",
      "Product Price: ₹299",
      "Frame Size: 4 × 4 Inches",
      "Drive File: Rohit aesthetic.png"
    ]
  },
  {
    id: "SPK-CV-013",
    sku: "SPK-CV-013",
    name: "MS Dhoni #7 Iconic Wicket Canvas Frame",
    category: "gift-sets",
    subcategory: "canvas",
    categoryName: "Gift Sets & Combos",
    price: 299,
    originalPrice: 399,
    rating: 5,
    reviewsCount: 280,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: true,
    stock: 15,
    images: [
      "images/dhoni.png"
    ],
    colors: [
      "4 x 4 Inch Custom Frame"
    ],
    description: "MS Dhoni #7 CSK yellow jersey iconic wicket stance 4x4 inch canvas art frame on wooden easel.",
    details: [
      "Category: CANVAS",
      "Product Price: ₹299",
      "Frame Size: 4 × 4 Inches",
      "Drive File: Dhoni.png"
    ]
  },
  {
    id: "SPK-FL-001",
    sku: "SPK-FL-001",
    name: "Crimson Blossom Bouquet",
    category: "gift-sets",
    subcategory: "flowers",
    categoryName: "Gift Sets & Combos",
    price: 399,
    originalPrice: 699,
    rating: 5,
    reviewsCount: 230,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: true,
    stock: 10,
    images: [
      "images/crimson_blossom.jpg"
    ],
    colors: [
      "Crimson Red Velvet"
    ],
    description: "Exquisite Crimson Blossom flower bouquet gift hamper wrapped with velvet ribbon.",
    details: [
      "Category: FLOWERS",
      "Product Price: ₹399",
      "Drive File: Crimson Blossom Bouquet, 399/-"
    ]
  },
  {
    id: "SPK-FL-002",
    sku: "SPK-FL-002",
    name: "Golden Bloom Bouquet",
    category: "gift-sets",
    subcategory: "flowers",
    categoryName: "Gift Sets & Combos",
    price: 399,
    originalPrice: 699,
    rating: 5,
    reviewsCount: 195,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: true,
    stock: 10,
    images: [
      "images/golden_bloom.jpg"
    ],
    colors: [
      "Golden Yellow Bloom"
    ],
    description: "Royal Golden Bloom flower bouquet hamper with luxury boutique box packaging.",
    details: [
      "Category: FLOWERS",
      "Product Price: ₹399",
      "Drive File: Golden Bloom Bouquet"
    ]
  },
  {
    id: "SPK-FL-003",
    sku: "SPK-FL-003",
    name: "Pink Blossom Bouquet",
    category: "gift-sets",
    subcategory: "flowers",
    categoryName: "Gift Sets & Combos",
    price: 399,
    originalPrice: 699,
    rating: 5,
    reviewsCount: 215,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: true,
    stock: 10,
    images: [
      "images/pink_blossom.jpg"
    ],
    colors: [
      "Soft Pink Blossom"
    ],
    description: "Charming Pink Blossom botanical flower hamper presented in blush pink drawer box.",
    details: [
      "Category: FLOWERS",
      "Product Price: ₹399",
      "Drive File: Pink Blossom Bouquet"
    ]
  }
];

export const REVIEWS = [
  {
    id: "t1",
    name: "Divya Sharma",
    location: "Mumbai",
    rating: 5,
    review: "Sparkle @ KKV accessories look even more luxurious in real life! The Plumeria Flower Clip and Traditional South Indian Choker have incredible shine.",
    product: "Plumeria Flower Claw Clip",
    avatar: "images/plumeria_flower_claw_clip_drive.jpg"
  },
  {
    id: "t2",
    name: "Jhansi Rani",
    location: "Delhi",
    rating: 5,
    review: "The velvet box packaging made me feel like I was opening a high-end luxury brand in Paris. The South Indian Addigai Choker Set is lightweight and super elegant!",
    product: "Traditional South Indian Matte Gold Plated Antique Droplet Choker Necklace Set",
    avatar: "images/traditional_south_indian_matte_gold_plated_antiavue_droplet_choker_neckalce_set_jpeg_drive.jpg"
  },
  {
    id: "t3",
    name: "Meera Reddy",
    location: "Hyderabad",
    rating: 5,
    review: "Bought the Kemp South Indian temple set for Varalakshmi Vratam. The micro gold antique polish is so authentic and lightweight!",
    product: "Traditional South Indian Kemp Floral Necklace Set",
    avatar: "images/whatsapp_image_2026_08_10_at_5_53_26_pm_jpeg_drive.jpg"
  },
  {
    id: "t4",
    name: "Ananya Rao",
    location: "Bangalore",
    rating: 5,
    review: "The 10% OFF code SPARKLE10 was easy to apply. Express Pan-India delivery arrived in 2 days. Sparkle @ KKV is my favorite boutique!",
    product: "Sparkle Royal Velvet Festival Gift Box",
    avatar: "images/gift_set.jpg"
  }
];

export const TESTIMONIALS = REVIEWS;

export const COUPONS = [
  { code: "SPARKLE10", discountPercent: 10, minAmount: 999, description: "AUTOMATIC 10% OFF on orders over ₹999 + FREE Pan-India Shipping" },
  { code: "LUXURY20", discountPercent: 20, minAmount: 799, description: "20% OFF on orders over ₹799" },
  { code: "SPARKLE10", discountPercent: 10, minAmount: 0, description: "10% OFF on your luxury order (Use Code: SPARKLE10)" }
];

export const PROMO_CODES = COUPONS;

export const INSTAGRAM_POSTS = [
  { id: "ig1", image: "images/plumeria_flower_claw_clip_drive.jpg", likes: "2.4k", comments: "182", tag: "@sparklekkvoffical" },
  { id: "ig2", image: "images/traditional_south_indian_matte_gold_plated_antiavue_droplet_choker_neckalce_set_jpeg_drive.jpg", likes: "1.9k", comments: "94", tag: "#SparkleGirl" },
  { id: "ig3", image: "images/green_oval_stone_chain_drive.jpg", likes: "3.1k", comments: "210", tag: "#LuxuryEveryday" },
  { id: "ig4", image: "images/2_adjustable_gold_plated_kada_bracelet_1_jpg_drive.jpg", likes: "1.5k", comments: "88", tag: "#HairBoutique" }
];
