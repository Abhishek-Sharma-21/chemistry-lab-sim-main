// Chemistry Engine - Chemical reaction analysis and AI integration

import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { Chemical, CHEMICALS } from "./chemicalData";

// Re-export types and data for backward compatibility
export type { Chemical };
export { CHEMICALS };

// Reaction result interface
export interface ReactionResult {
  occurred: boolean;
  type: string;
  equation: string;
  products: string[];
  observations: string[];
  liquidColor: string;
  energyChange: string;
  explanation: string;
}

// Initialize Gemini AI
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
console.log("Gemini API Key loaded:", !!GEMINI_API_KEY);

let genAI: GoogleGenerativeAI | null = null;
let model: GenerativeModel | null = null;

if (GEMINI_API_KEY) {
  try {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    console.log("Gemini AI initialized successfully");
  } catch (error) {
    console.error("Failed to initialize Gemini AI:", error);
  }
} else {
  console.warn("Gemini API key not found in environment variables");
}

// Chemical reactivity series
export const REACTIVITY_SERIES = [
  "Fr",
  "Cs",
  "Rb",
  "K",
  "Na",
  "Ca",
  "Mg",
  "Be",
  "Al",
  "Mn",
  "Zn",
  "Cr",
  "Fe",
  "Cd",
  "Co",
  "Ni",
  "Sn",
  "Pb",
  "H",
  "Sb",
  "Bi",
  "As",
  "Cu",
  "Hg",
  "Ag",
  "Pt",
  "Au",
];

// Solubility rules for ions
export const SOLUBILITY_RULES = {
  "Na+": "soluble",
  "K+": "soluble",
  "NH4+": "soluble",
  "NO3-": "soluble",
  "ClO4-": "soluble",
  "Cl-": "soluble except with Ag+, Hg2^2+, Pb2+",
  "Br-": "soluble except with Ag+, Hg2^2+, Pb2+",
  "I-": "soluble except with Ag+, Hg2^2+, Pb2+",
  "SO4^2-": "soluble except with Ca2+, Sr2+, Ba2+, Pb2+",
  "CO3^2-": "insoluble except with group 1 and NH4+",
  "PO4^3-": "insoluble except with group 1 and NH4+",
  "OH-": "insoluble except with group 1, Ca2+, Sr2+, Ba2+",
  "S^2-": "insoluble except with group 1, group 2, NH4+",
};

// Ion colors for visualization
export const ION_COLORS: Record<string, string> = {
  "Cu2+": "#0000FF",
  "Fe2+": "#00FF00",
  "Fe3+": "#FFA500",
  "Ni2+": "#00FFFF",
  "Co2+": "#FF00FF",
  "Mn2+": "#800080",
  "Cr3+": "#008000",
  "Al3+": "#C0C0C0",
  "Zn2+": "#FFFFFF",
  "Ag+": "#C0C0C0",
  "Pb2+": "#FFFFFF",
  "Hg2+": "#C0C0C0",
  "Ca2+": "#FFFFFF",
  "Mg2+": "#FFFFFF",
  "Na+": "#FFFFFF",
  "K+": "#FFFFFF",
  "NH4+": "#FFFFFF",
  "Cl-": "#FFFFFF",
  "Br-": "#FFA500",
  "I-": "#800080",
  "SO4^2-": "#FFFFFF",
  "NO3-": "#FFFFFF",
  "CO3^2-": "#FFFFFF",
  "PO4^3-": "#FFFFFF",
  "OH-": "#FFFFFF",
  "S^2-": "#000000",
};

// Precipitate colors
export const PRECIPITATE_COLORS: Record<string, string> = {
  CuS: "#000000",
  "Cu(OH)2": "#0000FF",
  "Fe(OH)2": "#00FF00",
  "Fe(OH)3": "#FFA500",
  "Ni(OH)2": "#00FFFF",
  "Co(OH)2": "#FF00FF",
  "Mn(OH)2": "#800080",
  "Cr(OH)3": "#008000",
  "Al(OH)3": "#FFFFFF",
  "Zn(OH)2": "#FFFFFF",
  AgCl: "#FFFFFF",
  AgBr: "#FFFFFF",
  AgI: "#FFFF00",
  PbCl2: "#FFFFFF",
  PbBr2: "#FFFFFF",
  PbI2: "#FFFF00",
  Hg2Cl2: "#FFFFFF",
  CaCO3: "#FFFFFF",
  "Mg(OH)2": "#FFFFFF",
  BaSO4: "#FFFFFF",
};
function getLiquidColor(cations: string[]): string {
  for (const cation of cations) {
    if (ION_COLORS[cation]) {
      return ION_COLORS[cation];
    }
  }
  return "#CBD5E1"; // Default light blue
}

// Helper function to explain why chemicals don't react
function getNoReactionExplanation(chemicals: Chemical[]): string {
  if (chemicals.length < 2) {
    return "Insufficient chemicals for analysis.";
  }

  const [chem1, chem2] = chemicals;

  // Same type chemicals
  if (chem1.type === chem2.type) {
    if (chem1.type === "acid") {
      return "Two acids don't react with each other. Acids only react with bases in neutralization reactions.";
    }
    if (chem1.type === "base") {
      return "Two bases don't react with each other. Bases only react with acids in neutralization reactions.";
    }
    if (chem1.type === "metal") {
      return "Two metals don't react with each other under normal conditions. Metals typically react with acids or in redox reactions.";
    }
    if (chem1.type === "salt") {
      return "Two salts generally don't react with each other unless one forms an insoluble precipitate.";
    }
  }

  // Metal + Metal
  if (chem1.type === "metal" && chem2.type === "metal") {
    return "Two metals don't react with each other. Metals react with acids, not with other metals.";
  }

  // Metal + Base
  if (
    (chem1.type === "metal" && chem2.type === "base") ||
    (chem1.type === "base" && chem2.type === "metal")
  ) {
    return "Metals don't react with bases under normal conditions. Metals react with acids to produce hydrogen gas.";
  }

  // Acid + Salt
  if (
    (chem1.type === "acid" && chem2.type === "salt") ||
    (chem1.type === "salt" && chem2.type === "acid")
  ) {
    return "Acids don't typically react with salts unless the salt contains a reactive anion or forms an insoluble product.";
  }

  // Base + Salt
  if (
    (chem1.type === "base" && chem2.type === "salt") ||
    (chem1.type === "salt" && chem2.type === "base")
  ) {
    return "Bases don't typically react with salts unless the salt contains a reactive cation or forms an insoluble product.";
  }

  // Salt + Salt (no precipitation)
  if (chem1.type === "salt" && chem2.type === "salt") {
    if (chem1.cation && chem1.anion && chem2.cation && chem2.anion) {
      return "These salts don't form an insoluble precipitate. Both salts are soluble and remain in solution.";
    }
    return "These salts are both soluble and don't react with each other.";
  }

  // Molecule + others
  if (chem1.type === "molecule" || chem2.type === "molecule") {
    const molecule = chem1.type === "molecule" ? chem1 : chem2;
    const other = chem1.type === "molecule" ? chem2 : chem1;

    if (molecule.formula === "H2O" && other.type === "salt") {
      return "Water doesn't react with this salt. The salt is already dissolved or the compound is soluble in water.";
    }
    if (molecule.formula === "H2O" && other.type === "metal") {
      return "Water doesn't react with this metal under normal conditions. Some metals react with steam at high temperatures.";
    }
    if (molecule.formula === "H2O" && other.type === "acid") {
      return "Acids are already aqueous solutions and don't react further with water.";
    }
    if (molecule.formula === "H2O" && other.type === "base") {
      return "Bases may dissolve in water but don't undergo chemical reactions with it.";
    }
  }

  // Oxide + others
  if (chem1.type === "oxide" || chem2.type === "oxide") {
    return "Oxides don't react with these chemicals under normal conditions. Some oxides react with acids or bases.";
  }

  // Nonmetal + others
  if (chem1.type === "nonmetal" || chem2.type === "nonmetal") {
    const nonmetal = chem1.type === "nonmetal" ? chem1 : chem2;
    const other = chem1.type === "nonmetal" ? chem2 : chem1;

    if (nonmetal.state === "gas" && other.type === "acid") {
      return "This nonmetal gas doesn't react with this acid under normal conditions.";
    }
    return "Nonmetals don't typically react with these types of compounds under normal conditions.";
  }

  // Default explanation
  return "These chemicals are compatible and do not react with each other under normal laboratory conditions.";
}

// Rule-based reaction analysis as fallback
function analyzeReactionRules(chemicals: Chemical[]): ReactionResult {
  if (chemicals.length < 2) {
    return {
      occurred: false,
      type: "no_reaction",
      equation: "No reaction",
      products: [],
      observations: ["Need at least 2 chemicals for a reaction"],
      liquidColor: getLiquidColor(
        chemicals.filter((c) => c.cation).map((c) => c.cation!)
      ),
      energyChange: "neutral",
      explanation: getNoReactionExplanation(chemicals),
    };
  }

  const [chem1, chem2] = chemicals;

  // Acid + Base = Neutralization
  if (
    (chem1.type === "acid" && chem2.type === "base") ||
    (chem1.type === "base" && chem2.type === "acid")
  ) {
    return {
      occurred: true,
      type: "acid_base",
      equation: `${chem1.formula} + ${chem2.formula} → Salt + H2O`,
      products: ["Salt", "Water"],
      observations: ["Solution becomes warm", "pH becomes neutral"],
      liquidColor: "#FFFFFF",
      energyChange: "exothermic",
      explanation:
        "Acid and base react in a neutralization reaction, forming salt and water.",
    };
  }

  // Precipitation: Check for insoluble combinations
  if (chem1.cation && chem1.anion && chem2.cation && chem2.anion) {
    // Silver + Chloride/Bromide/Iodide = Precipitation
    if (
      (chem1.cation === "Ag+" && ["Cl-", "Br-", "I-"].includes(chem2.anion!)) ||
      (chem2.cation === "Ag+" && ["Cl-", "Br-", "I-"].includes(chem1.anion!))
    ) {
      return {
        occurred: true,
        type: "precipitation",
        equation: `${chem1.formula} + ${chem2.formula} → AgX(s) + soluble salt`,
        products: ["Silver halide precipitate"],
        observations: ["White precipitate forms"],
        liquidColor: "#FFFFFF",
        energyChange: "neutral",
        explanation: "Silver halides are insoluble and form a precipitate.",
      };
    }

    // Lead + Sulfate = Precipitation
    if (
      (chem1.cation === "Pb2+" && chem2.anion === "SO4^2-") ||
      (chem2.cation === "Pb2+" && chem1.anion === "SO4^2-")
    ) {
      return {
        occurred: true,
        type: "precipitation",
        equation: `${chem1.formula} + ${chem2.formula} → PbSO4(s) + soluble salt`,
        products: ["Lead sulfate precipitate"],
        observations: ["White precipitate forms"],
        liquidColor: "#FFFFFF",
        energyChange: "neutral",
        explanation: "Lead sulfate is insoluble and forms a precipitate.",
      };
    }
  }

  // Metal + Acid = Redox reaction
  if (
    (chem1.type === "metal" && chem2.type === "acid") ||
    (chem2.type === "metal" && chem1.type === "acid")
  ) {
    const metal = chem1.type === "metal" ? chem1 : chem2;
    const acid = chem1.type === "acid" ? chem1 : chem2;

    return {
      occurred: true,
      type: "redox",
      equation: `${metal.formula} + ${acid.formula} → Salt + H2(g)`,
      products: ["Metal salt", "Hydrogen gas"],
      observations: ["Bubbles of gas form", "Metal dissolves"],
      liquidColor: getLiquidColor([metal.cation || ""]),
      energyChange: "exothermic",
      explanation:
        "Metal reacts with acid in a redox reaction, producing hydrogen gas.",
    };
  }

  // No reaction for compatible chemicals
  return {
    occurred: false,
    type: "no_reaction",
    equation: "No reaction",
    products: [],
    observations: ["No observable change"],
    liquidColor: getLiquidColor(
      chemicals.filter((c) => c.cation).map((c) => c.cation!)
    ),
    energyChange: "neutral",
    explanation: getNoReactionExplanation(chemicals),
  };
}

// Simple reaction prediction using rule-based analysis with AI enhancement
export async function predictReaction(
  chemicals: Chemical[]
): Promise<ReactionResult> {
  if (chemicals.length === 0) {
    return {
      occurred: false,
      type: "no_reaction",
      equation: "No reaction",
      products: [],
      observations: ["No chemicals present"],
      liquidColor: "#CBD5E1",
      energyChange: "neutral",
      explanation: "No chemicals to analyze.",
    };
  }

  // First try rule-based analysis as primary method
  console.log(
    "Using rule-based analysis for chemicals:",
    chemicals.map((c) => c.name)
  );
  const ruleResult = analyzeReactionRules(chemicals);

  // If rule-based gives a definitive reaction, return it
  if (ruleResult.occurred) {
    console.log("Rule-based analysis found reaction:", ruleResult.type);
    return ruleResult;
  }

  // For no-reaction cases, try AI for more complex analysis
  if (!genAI || !model) {
    console.warn("Gemini AI not available, using rule-based fallback");
    return ruleResult;
  }

  try {
    console.log("Trying AI analysis for complex cases...");

    // Create a detailed prompt for Gemini
    const chemicalList = chemicals
      .map(
        (c) =>
          `${c.name} (${c.formula}) - ${c.type}, ${c.state} state${
            c.cation ? `, cation: ${c.cation}` : ""
          }${c.anion ? `, anion: ${c.anion}` : ""}`
      )
      .join("\n");

    const prompt = `You are a professional chemist analyzing chemical reactions in a laboratory setting. Provide detailed, scientifically accurate analysis.

CHEMICALS BEING MIXED: ${chemicalList}

DETAILED ANALYSIS REQUIREMENTS:

1. **REACTION IDENTIFICATION:**
   - Check for neutralization (acid + base → salt + water)
   - Check for precipitation (formation of insoluble solid)
   - Check for gas evolution (bubbles, effervescence)
   - Check for redox reactions (electron transfer)
   - Check for complex formation or other reactions

2. **SOLUBILITY ANALYSIS:**
   - Silver, Lead, Mercury(I) compounds insoluble with halides (Cl-, Br-, I-)
   - Lead, Barium, Calcium sulfates are insoluble
   - Most metal hydroxides insoluble (except Group 1, ammonium)
   - Most carbonates, phosphates, sulfides insoluble (except Group 1)

3. **FOR NO REACTION CASES - PROVIDE COMPREHENSIVE ANALYSIS:**
   - **Why no reaction occurs** under current conditions
   - **Chemical compatibility** explanation
   - **Potential reaction conditions** (temperature, concentration, catalysts)
   - **Theoretical reaction possibility** if conditions were different
   - **Educational insights** about reaction requirements

OUTPUT AS JSON:
{
  "reaction": "acid_base|precipitation|gas_formation|redox|complex_formation|no_reaction",
  "equation": "balanced chemical equation with states, or 'No reaction'",
  "observations": ["detailed visual observations"],
  "color": "hex color code of final solution",
  "explanation": "comprehensive scientific explanation",
  "conditions": "special conditions required for reaction (if applicable)",
  "alternatives": "what would happen if conditions changed (if no reaction)"
}

PROFESSIONAL EXAMPLES:

Input: Hydrochloric Acid (HCl), Sodium Hydroxide (NaOH)
Output: {
  "reaction": "acid_base",
  "equation": "HCl(aq) + NaOH(aq) → NaCl(aq) + H2O(l)",
  "observations": ["Solution warms slightly", "No precipitate forms", "pH becomes neutral"],
  "color": "#FFFFFF",
  "explanation": "Strong acid and strong base undergo complete neutralization, forming salt and water with heat release",
  "conditions": "Proceeds at room temperature",
  "alternatives": "N/A"
}

Input: Silver Nitrate (AgNO3), Sodium Chloride (NaCl)
Output: {
  "reaction": "precipitation",
  "equation": "AgNO3(aq) + NaCl(aq) → AgCl(s) + NaNO3(aq)",
  "observations": ["White curdy precipitate forms immediately", "Solution becomes cloudy"],
  "color": "#FFFFFF",
  "explanation": "Silver chloride has very low solubility product (Ksp = 1.8×10^-10), causing precipitation",
  "conditions": "Rapid reaction at room temperature",
  "alternatives": "N/A"
}

Input: Sodium Chloride (NaCl), Potassium Nitrate (KNO3)
Output: {
  "reaction": "no_reaction",
  "equation": "No reaction",
  "observations": ["Solution remains clear", "No temperature change", "No gas evolution"],
  "color": "#FFFFFF",
  "explanation": "Both compounds are highly soluble salts with no reactive functional groups. No driving force for reaction exists.",
  "conditions": "No reaction under standard conditions",
  "alternatives": "These salts could potentially undergo ion exchange if one formed an insoluble compound, but neither does. At very high temperatures, thermal decomposition might occur, but no reaction between them."
}

Input: Copper (Cu), Hydrochloric Acid (HCl)
Output: {
  "reaction": "no_reaction",
  "equation": "No reaction",
  "observations": ["Copper metal remains unchanged", "No bubbles", "No color change"],
  "color": "#FFFFFF",
  "explanation": "Copper is below hydrogen in the reactivity series and cannot displace hydrogen from hydrochloric acid.",
  "conditions": "No reaction with dilute HCl at room temperature",
  "alternatives": "Copper reacts with concentrated nitric acid (forming Cu(NO3)2 + NO2 + H2O) or hot concentrated sulfuric acid. With oxygen present, copper forms patina (Cu2O/CuO)."
}

Now analyze these chemicals: ${chemicalList}`;

    console.log("Sending prompt to Gemini...");
    const result = await model.generateContent(prompt);
    console.log("Gemini response received");

    const response = await result.response;
    const text = response.text();
    console.log("Gemini raw response:", text);

    // Parse the JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error(
        "No JSON found in Gemini response, using rule-based result"
      );
      return ruleResult;
    }

    console.log("Extracted JSON:", jsonMatch[0]);
    const analysis = JSON.parse(jsonMatch[0]);
    console.log("Parsed analysis:", analysis);

    // Only use AI result if it's different from rule-based or provides better no-reaction analysis
    if (
      (analysis.reaction !== "no_reaction" &&
        ruleResult.type === "no_reaction") ||
      (analysis.reaction === "no_reaction" &&
        ruleResult.type === "no_reaction" &&
        analysis.explanation &&
        analysis.explanation.length > ruleResult.explanation.length)
    ) {
      console.log(
        "Using AI result (better analysis or found reaction rules missed)"
      );

      // Convert new format to expected format
      const enhancedExplanation =
        analysis.explanation +
        (analysis.conditions &&
        analysis.conditions !== "No reaction under standard conditions"
          ? `\n\nConditions: ${analysis.conditions}`
          : "") +
        (analysis.alternatives && analysis.alternatives !== "N/A"
          ? `\n\nAlternative scenarios: ${analysis.alternatives}`
          : "");

      return {
        occurred: analysis.reaction !== "no_reaction",
        type: analysis.reaction,
        equation:
          analysis.equation ||
          (analysis.reaction === "no_reaction"
            ? "No reaction"
            : "Reaction occurred"),
        products: [],
        observations:
          analysis.observations ||
          (analysis.reaction === "no_reaction"
            ? ["No observable change"]
            : ["Reaction occurred"]),
        liquidColor:
          analysis.color ||
          getLiquidColor(
            chemicals.filter((c) => c.cation).map((c) => c.cation!)
          ),
        energyChange:
          analysis.reaction === "no_reaction" ? "neutral" : "exothermic",
        explanation: enhancedExplanation || "Analysis completed using AI.",
      };
    }

    // Otherwise use rule-based result
    console.log("Using rule-based result");
    return ruleResult;
  } catch (error) {
    console.error("Error with AI analysis, using rule-based fallback:", error);
    return ruleResult;
  }
}
