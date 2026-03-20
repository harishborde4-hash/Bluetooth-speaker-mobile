export interface Chemical {
  id: string;
  name: string;
  formula: string;
  color: string;
  state: "solid" | "liquid" | "gas" | "aqueous";
  molarMass: number; // g/mol
  density?: number; // g/mL
  meltingPoint?: number; // °C
  boilingPoint?: number; // °C
  hazard?: "none" | "low" | "medium" | "high";
  description: string;
  emoji: string;
  solubility?: "soluble" | "insoluble" | "slightly";
  pH?: number;
}

export interface Instrument {
  id: string;
  name: string;
  category: "glassware" | "heating" | "measuring" | "safety" | "support" | "other";
  description: string;
  emoji: string;
  usage: string;
  maxVolume?: number; // mL
  imageBg: string;
}

export interface Reaction {
  id: string;
  reactants: string[]; // chemical ids
  products: string[]; // chemical ids
  conditions?: string;
  energyChange: "exothermic" | "endothermic" | "neutral";
  equation: string;
  description: string;
  observations: string[];
  gasProduced?: string;
  precipitateFormed?: string;
  colorChange?: string;
  heatRequired?: boolean;
  catalystRequired?: string;
  experimentIds?: string[];
}

// ─── CHEMICALS ────────────────────────────────────────────────────────────────
export const chemicals: Chemical[] = [
  {
    id: "O2", name: "Oxygen", formula: "O₂",
    color: "#e0f0ff", state: "gas", molarMass: 32,
    boilingPoint: -183, hazard: "none",
    description: "A colorless, odorless gas essential for combustion and respiration.",
    emoji: "💨", solubility: "slightly", pH: 7,
  },
  {
    id: "H2O", name: "Water", formula: "H₂O",
    color: "#b8e4f9", state: "liquid", molarMass: 18,
    density: 1.0, meltingPoint: 0, boilingPoint: 100,
    hazard: "none", description: "The most common liquid on Earth. A universal solvent.",
    emoji: "💧", solubility: "soluble", pH: 7,
  },
  {
    id: "H2", name: "Hydrogen", formula: "H₂",
    color: "#f0f9ff", state: "gas", molarMass: 2,
    boilingPoint: -253, hazard: "high",
    description: "The lightest and most abundant element. Highly flammable gas.",
    emoji: "🔵", solubility: "slightly", pH: 7,
  },
  {
    id: "CO2", name: "Carbon Dioxide", formula: "CO₂",
    color: "#e8f5e8", state: "gas", molarMass: 44,
    boilingPoint: -78.5, hazard: "none",
    description: "A colorless gas produced by combustion and respiration.",
    emoji: "🫧", solubility: "slightly", pH: 5.6,
  },
  {
    id: "KMnO4", name: "Potassium Permanganate", formula: "KMnO₄",
    color: "#8b1f8b", state: "solid", molarMass: 158.03,
    density: 2.7, meltingPoint: 240, hazard: "medium",
    description: "A dark purple crystalline solid. Strong oxidizing agent.",
    emoji: "🟣", solubility: "soluble", pH: 7,
  },
  {
    id: "MnO2", name: "Manganese Dioxide", formula: "MnO₂",
    color: "#2d2d2d", state: "solid", molarMass: 86.94,
    density: 5.03, meltingPoint: 535, hazard: "low",
    description: "A black solid. Used as a catalyst in oxygen production.",
    emoji: "⬛", solubility: "insoluble",
  },
  {
    id: "K2MnO4", name: "Potassium Manganate", formula: "K₂MnO₄",
    color: "#1a7a1a", state: "solid", molarMass: 197.13,
    hazard: "low",
    description: "Green solid, intermediate product of KMnO₄ decomposition.",
    emoji: "🟢", solubility: "soluble",
  },
  {
    id: "H2O2", name: "Hydrogen Peroxide", formula: "H₂O₂",
    color: "#f0f8ff", state: "liquid", molarMass: 34.01,
    density: 1.44, boilingPoint: 150.2, hazard: "medium",
    description: "A pale blue liquid used as an oxidizing agent and bleach.",
    emoji: "🫗", solubility: "soluble", pH: 6.2,
  },
  {
    id: "KClO3", name: "Potassium Chlorate", formula: "KClO₃",
    color: "#f5f5f5", state: "solid", molarMass: 122.55,
    density: 2.32, meltingPoint: 356, hazard: "medium",
    description: "White crystalline solid. Decomposes to release O₂ when heated.",
    emoji: "⬜", solubility: "soluble",
  },
  {
    id: "KCl", name: "Potassium Chloride", formula: "KCl",
    color: "#f8f8f8", state: "solid", molarMass: 74.55,
    density: 1.99, meltingPoint: 770, hazard: "none",
    description: "White crystalline solid. Table salt substitute.",
    emoji: "🧂", solubility: "soluble", pH: 7,
  },
  {
    id: "Fe", name: "Iron", formula: "Fe",
    color: "#8b6914", state: "solid", molarMass: 55.85,
    density: 7.87, meltingPoint: 1538, hazard: "none",
    description: "A silvery-grey metal. Burns in oxygen with bright sparks.",
    emoji: "🔩", solubility: "insoluble",
  },
  {
    id: "Fe3O4", name: "Iron(II,III) Oxide", formula: "Fe₃O₄",
    color: "#2d1a0e", state: "solid", molarMass: 231.53,
    density: 5.17, meltingPoint: 1597, hazard: "none",
    description: "Black magnetic solid produced when iron burns in oxygen.",
    emoji: "⬛", solubility: "insoluble",
  },
  {
    id: "C", name: "Carbon (Charcoal)", formula: "C",
    color: "#1a1a1a", state: "solid", molarMass: 12.01,
    density: 2.26, meltingPoint: 3642, hazard: "none",
    description: "Black solid. Burns in air and oxygen to form CO₂.",
    emoji: "⬛", solubility: "insoluble",
  },
  {
    id: "S", name: "Sulfur", formula: "S",
    color: "#ffd700", state: "solid", molarMass: 32.06,
    density: 2.07, meltingPoint: 115.2, boilingPoint: 444.6, hazard: "low",
    description: "Yellow crystalline solid. Burns with a blue flame in oxygen.",
    emoji: "🟡", solubility: "insoluble",
  },
  {
    id: "SO2", name: "Sulfur Dioxide", formula: "SO₂",
    color: "#f5f5e0", state: "gas", molarMass: 64.06,
    boilingPoint: -10, hazard: "high",
    description: "A colorless toxic gas with a pungent smell. Causes acid rain.",
    emoji: "💨", solubility: "soluble", pH: 3.5,
  },
  {
    id: "HCl", name: "Hydrochloric Acid", formula: "HCl",
    color: "#fffde7", state: "aqueous", molarMass: 36.46,
    density: 1.19, hazard: "high",
    description: "Strong acid. Reacts with metals and carbonates vigorously.",
    emoji: "🧪", solubility: "soluble", pH: 1,
  },
  {
    id: "H2SO4", name: "Sulfuric Acid (conc.)", formula: "H₂SO₄",
    color: "#fff8e1", state: "liquid", molarMass: 98.08,
    density: 1.84, boilingPoint: 337, hazard: "high",
    description: "Concentrated sulfuric acid. Strong acid and dehydrating agent.",
    emoji: "⚗️", solubility: "soluble", pH: 0,
  },
  {
    id: "H2SO4_dilute", name: "Sulfuric Acid (dilute)", formula: "H₂SO₄ (aq)",
    color: "#fff8e1", state: "aqueous", molarMass: 98.08,
    density: 1.1, hazard: "medium",
    description: "Dilute sulfuric acid. Reacts with metals and carbonates.",
    emoji: "🧪", solubility: "soluble", pH: 1,
  },
  {
    id: "NaOH", name: "Sodium Hydroxide", formula: "NaOH",
    color: "#f0f0f0", state: "solid", molarMass: 40.0,
    density: 2.13, meltingPoint: 318, hazard: "high",
    description: "White pellets. Strong base. Highly corrosive.",
    emoji: "⬜", solubility: "soluble", pH: 14,
  },
  {
    id: "NaOH_aq", name: "Sodium Hydroxide Solution", formula: "NaOH (aq)",
    color: "#e8f5e9", state: "aqueous", molarMass: 40.0,
    hazard: "high",
    description: "Aqueous solution of NaOH. Strong base.",
    emoji: "🧪", solubility: "soluble", pH: 13,
  },
  {
    id: "Ca_OH_2", name: "Calcium Hydroxide", formula: "Ca(OH)₂",
    color: "#f9f9f9", state: "solid", molarMass: 74.09,
    density: 2.21, meltingPoint: 580, hazard: "low",
    description: "White powder. Slightly soluble in water. Turns milky (limewater).",
    emoji: "⬜", solubility: "slightly", pH: 12.4,
  },
  {
    id: "Ca_OH_2_aq", name: "Limewater (Calcium Hydroxide)", formula: "Ca(OH)₂ (aq)",
    color: "#f0f9ff", state: "aqueous", molarMass: 74.09,
    hazard: "low",
    description: "Saturated solution of Ca(OH)₂. Turns milky with CO₂.",
    emoji: "💧", solubility: "slightly", pH: 12,
  },
  {
    id: "CaCO3", name: "Calcium Carbonate", formula: "CaCO₃",
    color: "#f8f8f8", state: "solid", molarMass: 100.09,
    density: 2.71, meltingPoint: 1000, hazard: "none",
    description: "White solid (marble/limestone). Reacts with acid to produce CO₂.",
    emoji: "🪨", solubility: "insoluble",
  },
  {
    id: "Na2CO3", name: "Sodium Carbonate", formula: "Na₂CO₃",
    color: "#f5f5f5", state: "solid", molarMass: 105.99,
    density: 2.54, meltingPoint: 851, hazard: "low",
    description: "White powder (washing soda). Reacts with acids.",
    emoji: "⬜", solubility: "soluble", pH: 11.5,
  },
  {
    id: "Na2CO3_aq", name: "Sodium Carbonate Solution", formula: "Na₂CO₃ (aq)",
    color: "#e8f5e9", state: "aqueous", molarMass: 105.99,
    hazard: "low",
    description: "Aqueous solution of Na₂CO₃.",
    emoji: "🧪", solubility: "soluble", pH: 11.5,
  },
  {
    id: "BaSO4", name: "Barium Sulfate", formula: "BaSO₄",
    color: "#ffffff", state: "solid", molarMass: 233.39,
    density: 4.49, hazard: "none",
    description: "White insoluble precipitate. Formed when Ba²⁺ meets SO₄²⁻.",
    emoji: "⬜", solubility: "insoluble",
  },
  {
    id: "Ba_OH_2_aq", name: "Barium Hydroxide Solution", formula: "Ba(OH)₂ (aq)",
    color: "#f0f9ff", state: "aqueous", molarMass: 171.34,
    hazard: "medium",
    description: "Strong base solution. Reacts with H₂SO₄ to form BaSO₄ precipitate.",
    emoji: "🧪", solubility: "slightly", pH: 13,
  },
  {
    id: "Zn", name: "Zinc", formula: "Zn",
    color: "#c0c0c0", state: "solid", molarMass: 65.38,
    density: 7.13, meltingPoint: 419.5, hazard: "none",
    description: "Bluish-white metal. Reacts with acids to produce hydrogen.",
    emoji: "🔘", solubility: "insoluble",
  },
  {
    id: "ZnSO4_aq", name: "Zinc Sulfate Solution", formula: "ZnSO₄ (aq)",
    color: "#e8f8e8", state: "aqueous", molarMass: 161.47,
    hazard: "low",
    description: "Colorless solution formed when zinc reacts with dilute H₂SO₄.",
    emoji: "🧪", solubility: "soluble",
  },
  {
    id: "Cu", name: "Copper", formula: "Cu",
    color: "#b87333", state: "solid", molarMass: 63.55,
    density: 8.96, meltingPoint: 1085, hazard: "none",
    description: "Reddish-brown metal. Below hydrogen in the activity series.",
    emoji: "🟤", solubility: "insoluble",
  },
  {
    id: "CuO", name: "Copper(II) Oxide", formula: "CuO",
    color: "#1a0d00", state: "solid", molarMass: 79.55,
    density: 6.31, meltingPoint: 1326, hazard: "low",
    description: "Black powder. Reduced to copper by hydrogen or carbon monoxide.",
    emoji: "⬛", solubility: "insoluble",
  },
  {
    id: "CuSO4_aq", name: "Copper Sulfate Solution", formula: "CuSO₄ (aq)",
    color: "#1a6bbf", state: "aqueous", molarMass: 159.61,
    hazard: "low",
    description: "Blue solution. Used in metal activity experiments.",
    emoji: "🔵", solubility: "soluble",
  },
  {
    id: "Fe2O3", name: "Iron(III) Oxide", formula: "Fe₂O₃",
    color: "#8b2500", state: "solid", molarMass: 159.69,
    density: 5.24, meltingPoint: 1565, hazard: "none",
    description: "Red-brown solid (rust/hematite). Reduced by CO.",
    emoji: "🟤", solubility: "insoluble",
  },
  {
    id: "CO", name: "Carbon Monoxide", formula: "CO",
    color: "#f5f5f5", state: "gas", molarMass: 28.01,
    boilingPoint: -191, hazard: "high",
    description: "Colorless, odorless, extremely toxic gas. Reducing agent.",
    emoji: "💨", solubility: "slightly",
  },
  {
    id: "NH3", name: "Ammonia", formula: "NH₃",
    color: "#f0f8ff", state: "gas", molarMass: 17.03,
    boilingPoint: -33.3, hazard: "high",
    description: "Pungent colorless gas. Turns damp red litmus paper blue.",
    emoji: "💨", solubility: "soluble", pH: 11,
  },
  {
    id: "Ca_OH_2_s", name: "Slaked Lime", formula: "Ca(OH)₂",
    color: "#f9f9f9", state: "solid", molarMass: 74.09,
    hazard: "low",
    description: "Ca(OH)₂ solid. Mixed with NH₄Cl to prepare ammonia gas.",
    emoji: "⬜",
  },
  {
    id: "NH4Cl", name: "Ammonium Chloride", formula: "NH₄Cl",
    color: "#f5f5f5", state: "solid", molarMass: 53.49,
    density: 1.52, meltingPoint: 338, hazard: "low",
    description: "White crystalline solid. Heated with Ca(OH)₂ to produce NH₃.",
    emoji: "⬜", solubility: "soluble", pH: 4.6,
  },
  {
    id: "Na2O2", name: "Sodium Peroxide", formula: "Na₂O₂",
    color: "#fffde7", state: "solid", molarMass: 77.98,
    density: 2.81, hazard: "high",
    description: "Yellow-white powder. Reacts with CO₂ to produce O₂.",
    emoji: "🟡", solubility: "soluble",
  },
  {
    id: "NaCl", name: "Sodium Chloride", formula: "NaCl",
    color: "#ffffff", state: "solid", molarMass: 58.44,
    density: 2.16, meltingPoint: 801, hazard: "none",
    description: "Common table salt. White crystalline solid.",
    emoji: "🧂", solubility: "soluble", pH: 7,
  },
  {
    id: "NaCl_aq", name: "Salt Water", formula: "NaCl (aq)",
    color: "#e8f5ff", state: "aqueous", molarMass: 58.44,
    hazard: "none",
    description: "Aqueous solution of NaCl. Neutral solution.",
    emoji: "💧", solubility: "soluble", pH: 7,
  },
  {
    id: "BaCl2_aq", name: "Barium Chloride Solution", formula: "BaCl₂ (aq)",
    color: "#f0f9ff", state: "aqueous", molarMass: 208.23,
    hazard: "medium",
    description: "Colorless solution. Used to detect sulfate ions.",
    emoji: "🧪", solubility: "soluble",
  },
  {
    id: "AgNO3_aq", name: "Silver Nitrate Solution", formula: "AgNO₃ (aq)",
    color: "#f5f5f5", state: "aqueous", molarMass: 169.87,
    hazard: "medium",
    description: "Colorless solution. Used to detect chloride ions.",
    emoji: "🧪", solubility: "soluble",
  },
  {
    id: "AgCl", name: "Silver Chloride", formula: "AgCl",
    color: "#f0f0f0", state: "solid", molarMass: 143.32,
    hazard: "low",
    description: "White precipitate. Formed when Ag⁺ meets Cl⁻.",
    emoji: "⬜", solubility: "insoluble",
  },
  {
    id: "phenolphthalein", name: "Phenolphthalein Indicator", formula: "C₂₀H₁₄O₄",
    color: "#ffe4e8", state: "liquid", molarMass: 318.33,
    hazard: "none",
    description: "Colorless in acid/neutral. Pink/magenta in alkaline solution.",
    emoji: "🌸", solubility: "slightly",
  },
  {
    id: "litmus", name: "Litmus Indicator", formula: "Litmus",
    color: "#9b59b6", state: "liquid", molarMass: 0,
    hazard: "none",
    description: "Purple in neutral. Red in acid. Blue in alkali.",
    emoji: "🔵", solubility: "soluble",
  },
  {
    id: "I2", name: "Iodine", formula: "I₂",
    color: "#4a1f6e", state: "solid", molarMass: 253.81,
    density: 4.93, meltingPoint: 113.7, boilingPoint: 184.3, hazard: "medium",
    description: "Dark purple solid. Sublimes directly to purple vapor.",
    emoji: "🟣", solubility: "slightly",
  },
  {
    id: "Pb_NO3_2_aq", name: "Lead Nitrate Solution", formula: "Pb(NO₃)₂ (aq)",
    color: "#f0f9ff", state: "aqueous", molarMass: 331.21,
    hazard: "high",
    description: "Colorless solution of lead nitrate. React with KI to make golden rain.",
    emoji: "🧪", solubility: "soluble",
  },
  {
    id: "KI_aq", name: "Potassium Iodide Solution", formula: "KI (aq)",
    color: "#f5f5f5", state: "aqueous", molarMass: 166.0,
    hazard: "none",
    description: "Colorless solution. React with Pb(NO₃)₂ to form golden PbI₂ precipitate.",
    emoji: "🧪", solubility: "soluble",
  },
  {
    id: "PbI2", name: "Lead Iodide", formula: "PbI₂",
    color: "#ffd700", state: "solid", molarMass: 461.0,
    hazard: "high",
    description: "Bright yellow precipitate. The 'golden rain' experiment product.",
    emoji: "⭐", solubility: "insoluble",
  },
  {
    id: "Na2CO3_crystals", name: "Sodium Carbonate (crystals)", formula: "Na₂CO₃",
    color: "#e8f5e9", state: "solid", molarMass: 105.99,
    hazard: "low",
    description: "Washing soda crystals.",
    emoji: "🔷", solubility: "soluble",
  },
];

// ─── INSTRUMENTS ─────────────────────────────────────────────────────────────
export const instruments: Instrument[] = [
  {
    id: "beaker_50", name: "Beaker (50 mL)", category: "glassware",
    description: "Cylindrical glass container with a flat bottom and a lip for pouring.",
    emoji: "🥛", usage: "Mixing and heating liquids",
    maxVolume: 50, imageBg: "from-blue-50 to-blue-100",
  },
  {
    id: "beaker_250", name: "Beaker (250 mL)", category: "glassware",
    description: "Larger cylindrical glass container for reactions.",
    emoji: "🥛", usage: "Mixing, heating and storing larger volumes",
    maxVolume: 250, imageBg: "from-blue-50 to-blue-100",
  },
  {
    id: "test_tube", name: "Test Tube", category: "glassware",
    description: "Small cylindrical glass tube, closed at one end.",
    emoji: "🧪", usage: "Holding small samples; heating; mixing",
    maxVolume: 20, imageBg: "from-green-50 to-green-100",
  },
  {
    id: "erlenmeyer", name: "Erlenmeyer Flask (250 mL)", category: "glassware",
    description: "Conical flask with a narrow neck to minimize evaporation.",
    emoji: "⚗️", usage: "Gas collection; reactions; titration",
    maxVolume: 250, imageBg: "from-purple-50 to-purple-100",
  },
  {
    id: "round_flask", name: "Round-Bottom Flask (500 mL)", category: "glassware",
    description: "Flask with a spherical body used in distillation setups.",
    emoji: "⚗️", usage: "Distillation; heating reactions evenly",
    maxVolume: 500, imageBg: "from-purple-50 to-purple-100",
  },
  {
    id: "separating_funnel", name: "Separating Funnel", category: "glassware",
    description: "Funnel with a stopcock for separating immiscible liquids.",
    emoji: "🔻", usage: "Adding liquids to flasks; separating liquids",
    imageBg: "from-orange-50 to-orange-100",
  },
  {
    id: "long_neck_funnel", name: "Long-Neck Funnel", category: "glassware",
    description: "Funnel with a long neck that dips into the liquid in the flask.",
    emoji: "🔻", usage: "Adding acid to solids to generate gas",
    imageBg: "from-yellow-50 to-yellow-100",
  },
  {
    id: "gas_jar", name: "Gas Jar (Collecting Bottle)", category: "glassware",
    description: "Wide-mouth jar used to collect and store gases.",
    emoji: "🫙", usage: "Collecting gases by upward/downward displacement",
    maxVolume: 250, imageBg: "from-sky-50 to-sky-100",
  },
  {
    id: "graduated_cyl", name: "Graduated Cylinder (100 mL)", category: "measuring",
    description: "Tall narrow cylinder marked with volume graduations.",
    emoji: "📏", usage: "Accurately measuring liquid volume",
    maxVolume: 100, imageBg: "from-teal-50 to-teal-100",
  },
  {
    id: "burette", name: "Burette (50 mL)", category: "measuring",
    description: "Long graduated tube with a stopcock for precise liquid delivery.",
    emoji: "🧫", usage: "Titration; precise acid/base delivery",
    maxVolume: 50, imageBg: "from-teal-50 to-teal-100",
  },
  {
    id: "pipette", name: "Pipette (10 mL)", category: "measuring",
    description: "Calibrated glass tube used to transfer precise volumes.",
    emoji: "💉", usage: "Transferring precise volumes of liquid",
    maxVolume: 10, imageBg: "from-teal-50 to-teal-100",
  },
  {
    id: "alcohol_lamp", name: "Alcohol Lamp", category: "heating",
    description: "Burns ethanol fuel. Has three flame zones: inner, outer, and tip.",
    emoji: "🔥", usage: "General heating; temperature up to ~400°C",
    imageBg: "from-red-50 to-orange-100",
  },
  {
    id: "bunsen_burner", name: "Bunsen Burner", category: "heating",
    description: "Gas burner with adjustable air hole for different flame types.",
    emoji: "🔥", usage: "High-temperature heating; up to 1500°C",
    imageBg: "from-red-50 to-red-100",
  },
  {
    id: "iron_tripod", name: "Iron Tripod", category: "support",
    description: "Three-legged iron stand to support apparatus over a flame.",
    emoji: "🔱", usage: "Supporting beakers, evaporating dishes over flame",
    imageBg: "from-gray-50 to-gray-100",
  },
  {
    id: "wire_gauze", name: "Wire Gauze", category: "support",
    description: "Metal mesh placed on tripod to distribute heat evenly.",
    emoji: "🔲", usage: "Supporting glassware on tripod; distributing heat",
    imageBg: "from-gray-50 to-gray-100",
  },
  {
    id: "retort_stand", name: "Retort Stand & Clamp", category: "support",
    description: "A vertical stand with adjustable clamps to hold glassware.",
    emoji: "🏗️", usage: "Holding flasks, condensers, burettes in position",
    imageBg: "from-gray-50 to-gray-100",
  },
  {
    id: "test_tube_rack", name: "Test Tube Rack", category: "support",
    description: "Wooden or plastic rack holding multiple test tubes.",
    emoji: "🗂️", usage: "Holding multiple test tubes safely upright",
    imageBg: "from-amber-50 to-amber-100",
  },
  {
    id: "test_tube_holder", name: "Test Tube Holder", category: "support",
    description: "Metal clamp to hold test tubes safely while heating.",
    emoji: "🔧", usage: "Holding test tubes during heating",
    imageBg: "from-gray-50 to-gray-100",
  },
  {
    id: "rubber_stopper_1", name: "One-Hole Rubber Stopper", category: "other",
    description: "Rubber stopper with one hole for a delivery tube.",
    emoji: "🔴", usage: "Sealing flasks; one-hole for gas delivery",
    imageBg: "from-red-50 to-red-100",
  },
  {
    id: "rubber_stopper_2", name: "Two-Hole Rubber Stopper", category: "other",
    description: "Rubber stopper with two holes for inlet and outlet tubes.",
    emoji: "🔴", usage: "Sealing flasks; two tubes for gas collection setups",
    imageBg: "from-red-50 to-red-100",
  },
  {
    id: "delivery_tube", name: "Delivery Tube (Glass)", category: "glassware",
    description: "Bent glass tube for delivering gases from one vessel to another.",
    emoji: "〰️", usage: "Connecting apparatus; delivering gases",
    imageBg: "from-blue-50 to-blue-100",
  },
  {
    id: "condenser", name: "Liebig Condenser", category: "glassware",
    description: "Water-cooled glass jacket for condensing vapors in distillation.",
    emoji: "❄️", usage: "Condensing gas vapors in distillation",
    imageBg: "from-sky-50 to-sky-100",
  },
  {
    id: "evaporating_dish", name: "Evaporating Dish", category: "glassware",
    description: "Shallow porcelain dish for evaporating solvents.",
    emoji: "🫙", usage: "Evaporating liquids; crystallization",
    maxVolume: 50, imageBg: "from-slate-50 to-slate-100",
  },
  {
    id: "crucible", name: "Crucible", category: "glassware",
    description: "Small porcelain/ceramic container for high-temperature reactions.",
    emoji: "🫙", usage: "High-temperature reactions; combustion",
    maxVolume: 30, imageBg: "from-stone-50 to-stone-100",
  },
  {
    id: "funnel", name: "Funnel", category: "glassware",
    description: "Cone-shaped glass funnel with a narrow stem.",
    emoji: "🔻", usage: "Filtering; adding liquids to containers",
    imageBg: "from-yellow-50 to-yellow-100",
  },
  {
    id: "filter_paper", name: "Filter Paper", category: "other",
    description: "Porous paper used for filtration to separate solids from liquids.",
    emoji: "📄", usage: "Filtration; separating precipitates",
    imageBg: "from-gray-50 to-white",
  },
  {
    id: "spatula", name: "Spatula", category: "other",
    description: "Metal or plastic scoop for transferring solid chemicals.",
    emoji: "🥄", usage: "Transferring powders and solid chemicals",
    imageBg: "from-silver-50 to-gray-100",
  },
  {
    id: "dropper", name: "Dropper / Pasteur Pipette", category: "other",
    description: "Glass or plastic dropper for adding liquids drop by drop.",
    emoji: "💧", usage: "Adding indicators; adding liquids precisely",
    maxVolume: 2, imageBg: "from-blue-50 to-blue-100",
  },
  {
    id: "balance", name: "Electronic Balance", category: "measuring",
    description: "Precision balance for measuring mass up to 200g.",
    emoji: "⚖️", usage: "Measuring mass of solids and containers",
    imageBg: "from-slate-50 to-slate-100",
  },
  {
    id: "thermometer", name: "Thermometer", category: "measuring",
    description: "Mercury or alcohol thermometer measuring -20°C to 200°C.",
    emoji: "🌡️", usage: "Measuring temperature of reactions",
    imageBg: "from-red-50 to-red-100",
  },
  {
    id: "gloves", name: "Safety Gloves", category: "safety",
    description: "Nitrile or rubber gloves to protect hands from chemicals.",
    emoji: "🧤", usage: "Protection from corrosive/hazardous chemicals",
    imageBg: "from-green-50 to-green-100",
  },
  {
    id: "goggles", name: "Safety Goggles", category: "safety",
    description: "Protective eyewear for chemical splash protection.",
    emoji: "🥽", usage: "Eye protection during all lab experiments",
    imageBg: "from-green-50 to-green-100",
  },
  {
    id: "lab_coat", name: "Lab Coat", category: "safety",
    description: "White cotton lab coat to protect clothing.",
    emoji: "🥼", usage: "Protecting clothes and skin from spills",
    imageBg: "from-green-50 to-green-100",
  },
  {
    id: "fire_extinguisher", name: "Fire Extinguisher", category: "safety",
    description: "CO₂ or dry powder fire extinguisher.",
    emoji: "🧯", usage: "Extinguishing laboratory fires",
    imageBg: "from-red-50 to-red-100",
  },
  {
    id: "wash_bottle", name: "Wash Bottle", category: "glassware",
    description: "Plastic squeeze bottle with a bent tube for directing water.",
    emoji: "🫗", usage: "Rinsing apparatus; directing water stream",
    maxVolume: 500, imageBg: "from-sky-50 to-sky-100",
  },
];

// ─── REACTIONS ────────────────────────────────────────────────────────────────
export const reactions: Reaction[] = [
  {
    id: "rxn_KMnO4_decomp",
    reactants: ["KMnO4"],
    products: ["K2MnO4", "MnO2", "O2"],
    conditions: "Heat (>200°C)",
    energyChange: "endothermic",
    equation: "2KMnO₄ → K₂MnO₄ + MnO₂ + O₂↑",
    description: "Potassium permanganate decomposes on heating to produce oxygen gas.",
    observations: [
      "Purple solid turns black/green on heating",
      "Glowing splint relights (confirms O₂ production)",
      "Black residue (MnO₂) remains after reaction",
    ],
    gasProduced: "O2",
    heatRequired: true,
    experimentIds: ["346"],
  },
  {
    id: "rxn_H2O2_decomp",
    reactants: ["H2O2"],
    products: ["H2O", "O2"],
    conditions: "MnO₂ catalyst",
    energyChange: "exothermic",
    equation: "2H₂O₂ →(MnO₂) 2H₂O + O₂↑",
    description: "Hydrogen peroxide decomposes in the presence of MnO₂ catalyst to release oxygen.",
    observations: [
      "Rapid bubbling observed",
      "Glowing splint relights (confirms O₂)",
      "Solution becomes warm (exothermic)",
      "Catalyst (MnO₂) remains unchanged",
    ],
    gasProduced: "O2",
    catalystRequired: "MnO2",
    experimentIds: ["456"],
  },
  {
    id: "rxn_KClO3_decomp",
    reactants: ["KClO3"],
    products: ["KCl", "O2"],
    conditions: "Heat with MnO₂ catalyst",
    energyChange: "endothermic",
    equation: "2KClO₃ →(MnO₂, Δ) 2KCl + 3O₂↑",
    description: "Potassium chlorate decomposes with heat and MnO₂ catalyst to produce oxygen.",
    observations: [
      "White solid melts and decomposes",
      "Vigorous gas evolution",
      "Glowing splint relights",
    ],
    gasProduced: "O2",
    heatRequired: true,
    catalystRequired: "MnO2",
    experimentIds: ["455"],
  },
  {
    id: "rxn_Fe_O2",
    reactants: ["Fe", "O2"],
    products: ["Fe3O4"],
    conditions: "Fe wire burning in pure O₂",
    energyChange: "exothermic",
    equation: "3Fe + 2O₂ → Fe₃O₄",
    description: "Iron wire burns vigorously in pure oxygen producing sparks.",
    observations: [
      "Bright white sparks emitted",
      "Blue-white flame observed",
      "Black solid (Fe₃O₄) forms and drips down",
      "Reaction stops if O₂ depleted",
    ],
    colorChange: "Silver → Black",
    experimentIds: ["454"],
  },
  {
    id: "rxn_C_O2_excess",
    reactants: ["C", "O2"],
    products: ["CO2"],
    conditions: "Excess O₂ (complete combustion)",
    energyChange: "exothermic",
    equation: "C + O₂ → CO₂",
    description: "Carbon burns in excess oxygen to produce carbon dioxide.",
    observations: [
      "Glows red-orange in air",
      "Burns with bright white glow in pure O₂",
      "CO₂ produced turns limewater milky",
    ],
    gasProduced: "CO2",
    experimentIds: ["355"],
  },
  {
    id: "rxn_S_O2",
    reactants: ["S", "O2"],
    products: ["SO2"],
    conditions: "Combustion",
    energyChange: "exothermic",
    equation: "S + O₂ → SO₂",
    description: "Sulfur burns in air with a blue flame; in oxygen burns brighter.",
    observations: [
      "Burns with blue/violet flame in air",
      "Bright blue flame in pure O₂",
      "Pungent smell of SO₂",
      "Flame is more intense in pure oxygen",
    ],
    gasProduced: "SO2",
    experimentIds: ["458"],
  },
  {
    id: "rxn_CaCO3_HCl",
    reactants: ["CaCO3", "HCl"],
    products: ["CO2", "H2O", "NaCl"],
    conditions: "Room temperature",
    energyChange: "exothermic",
    equation: "CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂↑",
    description: "Calcium carbonate (marble chips) reacts with hydrochloric acid.",
    observations: [
      "Vigorous bubbling (CO₂ gas)",
      "Marble chips dissolve",
      "Solution warms slightly",
      "CO₂ turns limewater milky",
    ],
    gasProduced: "CO2",
    experimentIds: ["471"],
  },
  {
    id: "rxn_CO2_limewater",
    reactants: ["CO2", "Ca_OH_2_aq"],
    products: ["CaCO3", "H2O"],
    conditions: "Room temperature (CO₂ passed through)",
    energyChange: "exothermic",
    equation: "CO₂ + Ca(OH)₂ → CaCO₃↓ + H₂O",
    description: "Carbon dioxide turns limewater milky due to CaCO₃ precipitate.",
    observations: [
      "Limewater turns milky/cloudy",
      "White precipitate (CaCO₃) forms",
      "Excess CO₂ dissolves the precipitate (if continued)",
    ],
    precipitateFormed: "CaCO3",
    colorChange: "Clear → Milky white",
    experimentIds: ["471"],
  },
  {
    id: "rxn_Zn_H2SO4",
    reactants: ["Zn", "H2SO4_dilute"],
    products: ["ZnSO4_aq", "H2"],
    conditions: "Room temperature",
    energyChange: "exothermic",
    equation: "Zn + H₂SO₄ → ZnSO₄ + H₂↑",
    description: "Zinc reacts with dilute sulfuric acid to produce hydrogen gas.",
    observations: [
      "Bubbles form on zinc surface",
      "Zinc gradually dissolves",
      "Burning splint ignites gas (H₂ burns with pop sound)",
      "Slight warming of solution",
    ],
    gasProduced: "H2",
    experimentIds: ["481"],
  },
  {
    id: "rxn_H2SO4_BaOH2",
    reactants: ["H2SO4_dilute", "Ba_OH_2_aq"],
    products: ["BaSO4", "H2O"],
    conditions: "Room temperature",
    energyChange: "exothermic",
    equation: "H₂SO₄ + Ba(OH)₂ → BaSO₄↓ + 2H₂O",
    description: "Dilute H₂SO₄ reacts with barium hydroxide to form a white precipitate.",
    observations: [
      "White precipitate (BaSO₄) forms immediately",
      "Solution becomes turbid",
      "At equivalence point, conductivity = 0",
      "Slight temperature increase",
    ],
    precipitateFormed: "BaSO4",
    colorChange: "Clear → White turbid",
    experimentIds: ["2970"],
  },
  {
    id: "rxn_Fe2O3_CO",
    reactants: ["Fe2O3", "CO"],
    products: ["Fe", "CO2"],
    conditions: "High temperature (>500°C)",
    energyChange: "exothermic",
    equation: "Fe₂O₃ + 3CO → 2Fe + 3CO₂",
    description: "Carbon monoxide reduces iron oxide to produce iron metal.",
    observations: [
      "Red-brown powder turns silvery-grey",
      "CO₂ produced turns limewater milky",
      "Reaction requires sustained high temperature",
    ],
    colorChange: "Red-brown → Silver",
    heatRequired: true,
    experimentIds: ["485"],
  },
  {
    id: "rxn_Na2O2_CO2",
    reactants: ["Na2O2", "CO2"],
    products: ["Na2CO3", "O2"],
    conditions: "Room temperature",
    energyChange: "exothermic",
    equation: "2Na₂O₂ + 2CO₂ → 2Na₂CO₃ + O₂",
    description: "Sodium peroxide reacts with CO₂ to produce Na₂CO₃ and O₂.",
    observations: [
      "White solid absorbs CO₂",
      "O₂ is produced (glowing splint relights)",
      "Solid becomes hot (exothermic)",
    ],
    gasProduced: "O2",
    experimentIds: ["2963"],
  },
  {
    id: "rxn_NaOH_CO2",
    reactants: ["NaOH_aq", "CO2"],
    products: ["Na2CO3_aq", "H2O"],
    conditions: "Room temperature",
    energyChange: "exothermic",
    equation: "2NaOH + CO₂ → Na₂CO₃ + H₂O",
    description: "NaOH solution absorbs CO₂ — demonstrates CO₂ solubility.",
    observations: [
      "Volume of CO₂ decreases rapidly",
      "Crushing can experiment — can collapses",
      "No visible color change",
    ],
    experimentIds: ["2971"],
  },
  {
    id: "rxn_NH4Cl_CaOH2",
    reactants: ["NH4Cl", "Ca_OH_2"],
    products: ["NH3", "H2O", "CaCl2"],
    conditions: "Heat required",
    energyChange: "endothermic",
    equation: "2NH₄Cl + Ca(OH)₂ →(Δ) CaCl₂ + 2NH₃↑ + 2H₂O",
    description: "Ammonium chloride reacts with calcium hydroxide on heating to produce ammonia.",
    observations: [
      "Pungent smell of ammonia",
      "Damp red litmus paper turns blue",
      "White dense fumes if meets HCl",
      "Ammonia fountain experiment possible",
    ],
    gasProduced: "NH3",
    heatRequired: true,
    experimentIds: ["2966"],
  },
  {
    id: "rxn_Pb_NO3_2_KI",
    reactants: ["Pb_NO3_2_aq", "KI_aq"],
    products: ["PbI2", "KNO3"],
    conditions: "Room temperature (hot then cool)",
    energyChange: "exothermic",
    equation: "Pb(NO₃)₂ + 2KI → PbI₂↓ + 2KNO₃",
    description: "Golden Rain experiment: bright yellow PbI₂ crystals precipitate.",
    observations: [
      "Bright yellow precipitate forms immediately",
      "When hot → clear; when cool → golden crystals fall",
      "Spectacular display of golden crystals",
    ],
    precipitateFormed: "PbI2",
    colorChange: "Clear → Bright yellow",
    experimentIds: ["3548"],
  },
  {
    id: "rxn_I2_sublimation",
    reactants: ["I2"],
    products: ["I2"],
    conditions: "Gentle heating",
    energyChange: "endothermic",
    equation: "I₂(s) → I₂(g) [sublimation]",
    description: "Iodine sublimes directly from solid to purple vapor without melting.",
    observations: [
      "Purple vapor visible immediately",
      "Crystals seem to vanish without melting",
      "Purple crystals re-form on cool surfaces",
    ],
    colorChange: "Dark solid → Purple vapor",
    heatRequired: true,
    experimentIds: ["2968"],
  },
  {
    id: "rxn_electrolysis_H2O",
    reactants: ["H2O"],
    products: ["H2", "O2"],
    conditions: "Electrolysis with Na₂SO₄ electrolyte",
    energyChange: "endothermic",
    equation: "2H₂O →(electrolysis) 2H₂ + O₂",
    description: "Water is decomposed into hydrogen and oxygen by electrolysis.",
    observations: [
      "Bubbles form at both electrodes",
      "H₂ volume at cathode = 2× O₂ at anode",
      "H₂ burns with a pop, O₂ relights glowing splint",
    ],
    gasProduced: "O2",
    experimentIds: ["461"],
  },
  {
    id: "rxn_Cu_O2",
    reactants: ["Cu", "O2"],
    products: ["CuO"],
    conditions: "Heat (>300°C)",
    energyChange: "exothermic",
    equation: "2Cu + O₂ →(Δ) 2CuO",
    description: "Copper turns black when heated in air due to CuO formation.",
    observations: [
      "Shiny copper turns black on heating",
      "Mass increases after reaction",
      "Reaction is reversible in H₂ atmosphere",
    ],
    colorChange: "Reddish-brown → Black",
    heatRequired: true,
    experimentIds: ["3495"],
  },
  {
    id: "rxn_NaHCO3_HCl",
    reactants: ["Na2CO3_aq", "HCl"],
    products: ["NaCl_aq", "H2O", "CO2"],
    conditions: "Room temperature",
    energyChange: "exothermic",
    equation: "Na₂CO₃ + 2HCl → 2NaCl + H₂O + CO₂↑",
    description: "Sodium carbonate reacts with HCl to produce CO₂ — fire extinguisher principle.",
    observations: [
      "Vigorous bubbling (CO₂)",
      "Reaction is rapid at room temperature",
      "CO₂ extinguishes flames",
    ],
    gasProduced: "CO2",
    experimentIds: ["3496"],
  },
];

// ─── HELPER FUNCTIONS ─────────────────────────────────────────────────────────
export function findReaction(reactantIds: string[]): Reaction | null {
  for (const rxn of reactions) {
    const required = [...rxn.reactants];
    const provided = [...reactantIds];
    let match = true;
    for (const req of required) {
      const idx = provided.indexOf(req);
      if (idx === -1) { match = false; break; }
      provided.splice(idx, 1);
    }
    if (match) return rxn;
  }
  return null;
}

export function getChemicalById(id: string): Chemical | undefined {
  return chemicals.find((c) => c.id === id);
}

export function getInstrumentById(id: string): Instrument | undefined {
  return instruments.find((i) => i.id === id);
}

export function getReactionsByExperiment(expId: string): Reaction[] {
  return reactions.filter((r) => r.experimentIds?.includes(expId));
}

export const hazardColors: Record<string, string> = {
  none: "bg-green-100 text-green-700",
  low: "bg-yellow-100 text-yellow-700",
  medium: "bg-orange-100 text-orange-700",
  high: "bg-red-100 text-red-700",
};

export const hazardLabels: Record<string, string> = {
  none: "Safe",
  low: "Low Hazard",
  medium: "Moderate Hazard",
  high: "High Hazard ⚠️",
};
