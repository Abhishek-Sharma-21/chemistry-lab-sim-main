// Chemistry Engine - Rule-based reaction system

import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. Reactivity Series (most reactive to least reactive)
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
  "Li",
  "Sr",
  "Ba",
  "Ra",
  "Ti",
  "Zr",
  "Hf",
  "V",
  "Nb",
  "Ta",
  "Cr",
  "Mo",
  "W",
  "Mn",
  "Tc",
  "Re",
  "Fe",
  "Ru",
  "Os",
  "Co",
  "Rh",
  "Ir",
  "Ni",
  "Pd",
  "Pt",
  "Cu",
  "Ag",
  "Au",
  "Zn",
  "Cd",
  "Hg",
  "Al",
  "Ga",
  "In",
  "Tl",
  "Ge",
  "Sn",
  "Pb",
  "Sb",
  "Bi",
  "Po",
  "At",
  "Sc",
  "Y",
  "La",
  "Ac",
  "Ti",
  "Zr",
  "Hf",
  "V",
  "Nb",
  "Ta",
  "Db",
  "Cr",
  "Mo",
  "W",
  "Sg",
  "Mn",
  "Tc",
  "Re",
  "Bh",
  "Fe",
  "Ru",
  "Os",
  "Hs",
  "Co",
  "Rh",
  "Ir",
  "Mt",
  "Ni",
  "Pd",
  "Pt",
  "Ds",
  "Cu",
  "Ag",
  "Au",
  "Rg",
  "Zn",
  "Cd",
  "Hg",
  "Cn",
  "Al",
  "Ga",
  "In",
  "Tl",
  "Nh",
  "Ge",
  "Sn",
  "Pb",
  "Fl",
  "Sb",
  "Bi",
  "Mc",
  "Po",
  "Lv",
  "At",
  "Ts",
  "Se",
  "Te",
  "Po",
  "Og",
  "Br",
  "I",
  "At",
  "Kr",
  "Xe",
  "Rn",
  "He",
  "Ne",
  "Ar",
  "F",
  "Cl",
  "Br",
  "I",
  "At",
  "C",
  "N",
  "O",
  "F",
  "P",
  "S",
  "Cl",
  "He",
  "Ne",
  "Ar",
  "Si",
  "B",
] as const;

// 2. Solubility Rules
export const SOLUBILITY_RULES = {
  alwaysSoluble: ["Na+", "K+", "NH4+", "NO3-", "CH3COO-"],
  chlorides: {
    soluble: true,
    exceptions: ["Ag+", "Pb2+", "Hg2+"],
  },
  sulfates: {
    soluble: true,
    exceptions: ["Ba2+", "Pb2+", "Ca2+", "Sr2+"],
  },
  hydroxides: {
    soluble: false,
    exceptions: ["Na+", "K+", "Ba2+", "Ca2+"],
  },
  carbonates: {
    soluble: false,
    exceptions: ["Na+", "K+", "NH4+"],
  },
  sulfides: {
    soluble: false,
    exceptions: ["Na+", "K+", "NH4+", "Ca2+", "Ba2+"],
  },
};

// 3. Ion colors for visualization
export const ION_COLORS: Record<string, string> = {
  "Cu2+": "#3B82F6", // Blue
  "Fe2+": "#22C55E", // Green
  "Fe3+": "#F59E0B", // Yellow-orange/brown
  "Ni2+": "#10B981", // Green
  "Co2+": "#EC4899", // Pink
  "Mn2+": "#F9A8D4", // Light pink
  "Cr3+": "#059669", // Dark Green
  "MnO4-": "#701A75", // Deep Purple
  "Cr2O7_2-": "#EA580C", // Orange
  "CrO4_2-": "#FACC15", // Yellow
  "Zn2+": "transparent",
  "Ag+": "transparent",
  "Na+": "transparent",
  "K+": "transparent",
  "Ca2+": "transparent",
  "Mg2+": "transparent",
  "Al3+": "transparent",
  "H+": "transparent",
  "SO4_2-": "transparent",
  "NO3-": "transparent",
  "Cl-": "transparent",
  "OH-": "transparent",
  "Li+": "transparent",
  "Be2+": "transparent",
  "Sr2+": "transparent",
  "Ba2+": "transparent",
  "Ra2+": "transparent",
  "Ti4+": "transparent",
  "Zr4+": "transparent",
  "Hf4+": "transparent",
  "V5+": "#8B5CF6", // Purple
  "Nb5+": "transparent",
  "Ta5+": "transparent",
  "Cr6+": "#EA580C", // Orange
  "Mo6+": "transparent",
  "W6+": "transparent",
  "Mn7+": "#7C3AED", // Purple
  "Tc7+": "transparent",
  "Re7+": "transparent",
  "Ru3+": "transparent",
  "Os4+": "transparent",
  "Rh3+": "transparent",
  "Ir4+": "transparent",
  "Pd2+": "transparent",
  "Pt4+": "transparent",
  "Au3+": "transparent",
  "Hg2+": "transparent",
  "Tl+": "transparent",
  "Pb2+": "transparent",
  "Bi3+": "transparent",
  "Po4+": "transparent",
  "At-": "transparent",
  Rn: "transparent",
  "Fr+": "transparent",
  "Ac3+": "transparent",
  "Rf4+": "transparent",
  "Db5+": "transparent",
  "Sg6+": "transparent",
  "Bh7+": "transparent",
  "Hs8+": "transparent",
  "Mt9+": "transparent",
  "Ds10+": "transparent",
  "Rg11+": "transparent",
  "Cn2+": "transparent",
  "Nh3+": "transparent",
  "Fl4+": "transparent",
  "Mc5+": "transparent",
  "Lv6+": "transparent",
  "Ts7+": "transparent",
  "Og8+": "transparent",
  "F-": "transparent",
  "Br-": "transparent",
  "I-": "transparent",
  "O2-": "transparent",
  "S2-": "transparent",
  "N3-": "transparent",
  "P3-": "transparent",
  "C4-": "transparent",
  "Si4+": "transparent",
  "B3+": "transparent",
};

// 4. Precipitate colors
export const PRECIPITATE_COLORS: Record<string, string> = {
  Cu: "#B45309", // Copper metal
  Ag: "#9CA3AF", // Silver metal
  "Fe(OH)3": "#92400E", // Iron(III) hydroxide - brown
  "Fe(OH)2": "#166534", // Iron(II) hydroxide - green
  "Cu(OH)2": "#0EA5E9", // Copper hydroxide - blue
  AgCl: "#F5F5F5", // Silver chloride - white
  BaSO4: "#FFFFFF", // Barium sulfate - white
  PbI2: "#FDE047", // Lead iodide - yellow
  CaCO3: "#FFFFFF", // Calcium carbonate - white
  AgI: "#FEF08A", // Silver Iodide - Pale Yellow
  CuS: "#111827", // Black
  FeS: "#111827", // Black
  "Ni(OH)2": "#34D399", // Light Green
  PbSO4: "#FFFFFF", // White
};

// 5. Chemical database (100 Clear-Cut Chemicals)
export interface Chemical {
  id: string;
  name: string;
  formula: string;
  type: "metal" | "nonmetal" | "salt" | "acid" | "base" | "oxide" | "molecule";
  cation?: string;
  anion?: string;
  state: "solid" | "liquid" | "aqueous" | "gas";
  color: string;
  molarMass: number;
}

export const CHEMICALS: Chemical[] = [
  // --- NON-METALS ---
  {
    id: "h",
    name: "Hydrogen",
    formula: "H",
    type: "nonmetal",
    state: "gas",
    color: "transparent",
    molarMass: 1.008,
  },
  {
    id: "c",
    name: "Carbon",
    formula: "C",
    type: "nonmetal",
    state: "solid",
    color: "#111827",
    molarMass: 12.011,
  },
  {
    id: "n",
    name: "Nitrogen",
    formula: "N",
    type: "nonmetal",
    state: "gas",
    color: "transparent",
    molarMass: 14.007,
  },
  {
    id: "o",
    name: "Oxygen",
    formula: "O",
    type: "nonmetal",
    state: "gas",
    color: "transparent",
    molarMass: 15.999,
  },
  {
    id: "f",
    name: "Fluorine",
    formula: "F",
    type: "nonmetal",
    state: "gas",
    color: "#F59E0B",
    molarMass: 18.998,
  },
  {
    id: "p",
    name: "Phosphorus",
    formula: "P",
    type: "nonmetal",
    state: "solid",
    color: "#F59E0B",
    molarMass: 30.974,
  },
  {
    id: "s",
    name: "Sulfur",
    formula: "S",
    type: "nonmetal",
    state: "solid",
    color: "#F59E0B",
    molarMass: 32.06,
  },
  {
    id: "cl",
    name: "Chlorine",
    formula: "Cl",
    type: "nonmetal",
    state: "gas",
    color: "#F59E0B",
    molarMass: 35.45,
  },
  {
    id: "he",
    name: "Helium",
    formula: "He",
    type: "nonmetal",
    state: "gas",
    color: "transparent",
    molarMass: 4.003,
  },
  {
    id: "ne",
    name: "Neon",
    formula: "Ne",
    type: "nonmetal",
    state: "gas",
    color: "transparent",
    molarMass: 20.18,
  },
  {
    id: "ar",
    name: "Argon",
    formula: "Ar",
    type: "nonmetal",
    state: "gas",
    color: "transparent",
    molarMass: 39.95,
  },
  {
    id: "si",
    name: "Silicon",
    formula: "Si",
    type: "nonmetal",
    state: "solid",
    color: "#6B7280",
    molarMass: 28.086,
  },
  {
    id: "b",
    name: "Boron",
    formula: "B",
    type: "nonmetal",
    state: "solid",
    color: "#111827",
    molarMass: 10.81,
  },

  // --- METALS (15) ---
  {
    id: "li",
    name: "Lithium",
    formula: "Li",
    type: "metal",
    state: "solid",
    color: "#D1D5DB",
    molarMass: 6.94,
  },
  {
    id: "na",
    name: "Sodium",
    formula: "Na",
    type: "metal",
    state: "solid",
    color: "#E5E7EB",
    molarMass: 22.99,
  },
  {
    id: "k",
    name: "Potassium",
    formula: "K",
    type: "metal",
    state: "solid",
    color: "#E5E7EB",
    molarMass: 39.1,
  },
  {
    id: "mg",
    name: "Magnesium",
    formula: "Mg",
    type: "metal",
    state: "solid",
    color: "#9CA3AF",
    molarMass: 24.31,
  },
  {
    id: "ca",
    name: "Calcium",
    formula: "Ca",
    type: "metal",
    state: "solid",
    color: "#D1D5DB",
    molarMass: 40.08,
  },
  {
    id: "al",
    name: "Aluminum",
    formula: "Al",
    type: "metal",
    state: "solid",
    color: "#D1D5DB",
    molarMass: 26.98,
  },
  {
    id: "zn",
    name: "Zinc",
    formula: "Zn",
    type: "metal",
    state: "solid",
    color: "#9CA3AF",
    molarMass: 65.38,
  },
  {
    id: "fe",
    name: "Iron",
    formula: "Fe",
    type: "metal",
    state: "solid",
    color: "#4B5563",
    molarMass: 55.85,
  },
  {
    id: "ni",
    name: "Nickel",
    formula: "Ni",
    type: "metal",
    state: "solid",
    color: "#D1D5DB",
    molarMass: 58.69,
  },
  {
    id: "sn",
    name: "Tin",
    formula: "Sn",
    type: "metal",
    state: "solid",
    color: "#9CA3AF",
    molarMass: 118.71,
  },
  {
    id: "pb",
    name: "Lead",
    formula: "Pb",
    type: "metal",
    state: "solid",
    color: "#374151",
    molarMass: 207.2,
  },
  {
    id: "cu",
    name: "Copper",
    formula: "Cu",
    type: "metal",
    state: "solid",
    color: "#B45309",
    molarMass: 63.55,
  },
  {
    id: "ag",
    name: "Silver",
    formula: "Ag",
    type: "metal",
    state: "solid",
    color: "#E5E7EB",
    molarMass: 107.87,
  },
  {
    id: "pt",
    name: "Platinum",
    formula: "Pt",
    type: "metal",
    state: "solid",
    color: "#F3F4F6",
    molarMass: 195.08,
  },
  {
    id: "au",
    name: "Gold",
    formula: "Au",
    type: "metal",
    state: "solid",
    color: "#F59E0B",
    molarMass: 196.97,
  },
  {
    id: "be",
    name: "Beryllium",
    formula: "Be",
    type: "metal",
    state: "solid",
    color: "#9CA3AF",
    molarMass: 9.01,
  },
  {
    id: "sc",
    name: "Scandium",
    formula: "Sc",
    type: "metal",
    state: "solid",
    color: "#D1D5DB",
    molarMass: 44.96,
  },
  {
    id: "ti",
    name: "Titanium",
    formula: "Ti",
    type: "metal",
    state: "solid",
    color: "#9CA3AF",
    molarMass: 47.87,
  },
  {
    id: "v",
    name: "Vanadium",
    formula: "V",
    type: "metal",
    state: "solid",
    color: "#6B7280",
    molarMass: 50.94,
  },
  {
    id: "cr",
    name: "Chromium",
    formula: "Cr",
    type: "metal",
    state: "solid",
    color: "#9CA3AF",
    molarMass: 52.0,
  },
  {
    id: "mn",
    name: "Manganese",
    formula: "Mn",
    type: "metal",
    state: "solid",
    color: "#6B7280",
    molarMass: 54.94,
  },
  {
    id: "co",
    name: "Cobalt",
    formula: "Co",
    type: "metal",
    state: "solid",
    color: "#6B7280",
    molarMass: 58.93,
  },
  {
    id: "ga",
    name: "Gallium",
    formula: "Ga",
    type: "metal",
    state: "solid",
    color: "#D1D5DB",
    molarMass: 69.72,
  },
  {
    id: "ge",
    name: "Germanium",
    formula: "Ge",
    type: "metal",
    state: "solid",
    color: "#6B7280",
    molarMass: 72.63,
  },
  {
    id: "as",
    name: "Arsenic",
    formula: "As",
    type: "metal",
    state: "solid",
    color: "#6B7280",
    molarMass: 74.92,
  },
  {
    id: "se",
    name: "Selenium",
    formula: "Se",
    type: "metal",
    state: "solid",
    color: "#6B7280",
    molarMass: 78.97,
  },
  {
    id: "br",
    name: "Bromine",
    formula: "Br",
    type: "metal",
    state: "liquid",
    color: "#DC2626",
    molarMass: 79.9,
  },
  {
    id: "kr",
    name: "Krypton",
    formula: "Kr",
    type: "metal",
    state: "gas",
    color: "transparent",
    molarMass: 83.8,
  },
  {
    id: "rb",
    name: "Rubidium",
    formula: "Rb",
    type: "metal",
    state: "solid",
    color: "#E5E7EB",
    molarMass: 85.47,
  },
  {
    id: "sr",
    name: "Strontium",
    formula: "Sr",
    type: "metal",
    state: "solid",
    color: "#F3F4F6",
    molarMass: 87.62,
  },
  {
    id: "y",
    name: "Yttrium",
    formula: "Y",
    type: "metal",
    state: "solid",
    color: "#D1D5DB",
    molarMass: 88.91,
  },
  {
    id: "zr",
    name: "Zirconium",
    formula: "Zr",
    type: "metal",
    state: "solid",
    color: "#9CA3AF",
    molarMass: 91.22,
  },
  {
    id: "nb",
    name: "Niobium",
    formula: "Nb",
    type: "metal",
    state: "solid",
    color: "#6B7280",
    molarMass: 92.91,
  },
  {
    id: "mo",
    name: "Molybdenum",
    formula: "Mo",
    type: "metal",
    state: "solid",
    color: "#6B7280",
    molarMass: 95.95,
  },
  {
    id: "tc",
    name: "Technetium",
    formula: "Tc",
    type: "metal",
    state: "solid",
    color: "#6B7280",
    molarMass: 98.0,
  },
  {
    id: "ru",
    name: "Ruthenium",
    formula: "Ru",
    type: "metal",
    state: "solid",
    color: "#6B7280",
    molarMass: 101.07,
  },
  {
    id: "rh",
    name: "Rhodium",
    formula: "Rh",
    type: "metal",
    state: "solid",
    color: "#E5E7EB",
    molarMass: 102.91,
  },
  {
    id: "pd",
    name: "Palladium",
    formula: "Pd",
    type: "metal",
    state: "solid",
    color: "#E5E7EB",
    molarMass: 106.42,
  },
  {
    id: "cd",
    name: "Cadmium",
    formula: "Cd",
    type: "metal",
    state: "solid",
    color: "#9CA3AF",
    molarMass: 112.41,
  },
  {
    id: "in",
    name: "Indium",
    formula: "In",
    type: "metal",
    state: "solid",
    color: "#D1D5DB",
    molarMass: 114.82,
  },
  {
    id: "sb",
    name: "Antimony",
    formula: "Sb",
    type: "metal",
    state: "solid",
    color: "#6B7280",
    molarMass: 121.76,
  },
  {
    id: "te",
    name: "Tellurium",
    formula: "Te",
    type: "metal",
    state: "solid",
    color: "#6B7280",
    molarMass: 127.6,
  },
  {
    id: "i",
    name: "Iodine",
    formula: "I",
    type: "metal",
    state: "solid",
    color: "#7C3AED",
    molarMass: 126.9,
  },
  {
    id: "xe",
    name: "Xenon",
    formula: "Xe",
    type: "metal",
    state: "gas",
    color: "transparent",
    molarMass: 131.29,
  },
  {
    id: "cs",
    name: "Cesium",
    formula: "Cs",
    type: "metal",
    state: "solid",
    color: "#E5E7EB",
    molarMass: 132.91,
  },
  {
    id: "ba",
    name: "Barium",
    formula: "Ba",
    type: "metal",
    state: "solid",
    color: "#F3F4F6",
    molarMass: 137.33,
  },
  {
    id: "la",
    name: "Lanthanum",
    formula: "La",
    type: "metal",
    state: "solid",
    color: "#D1D5DB",
    molarMass: 138.91,
  },
  {
    id: "hf",
    name: "Hafnium",
    formula: "Hf",
    type: "metal",
    state: "solid",
    color: "#6B7280",
    molarMass: 178.49,
  },
  {
    id: "ta",
    name: "Tantalum",
    formula: "Ta",
    type: "metal",
    state: "solid",
    color: "#6B7280",
    molarMass: 180.95,
  },
  {
    id: "w",
    name: "Tungsten",
    formula: "W",
    type: "metal",
    state: "solid",
    color: "#6B7280",
    molarMass: 183.84,
  },
  {
    id: "re",
    name: "Rhenium",
    formula: "Re",
    type: "metal",
    state: "solid",
    color: "#6B7280",
    molarMass: 186.21,
  },
  {
    id: "os",
    name: "Osmium",
    formula: "Os",
    type: "metal",
    state: "solid",
    color: "#374151",
    molarMass: 190.23,
  },
  {
    id: "ir",
    name: "Iridium",
    formula: "Ir",
    type: "metal",
    state: "solid",
    color: "#E5E7EB",
    molarMass: 192.22,
  },
  {
    id: "hg",
    name: "Mercury",
    formula: "Hg",
    type: "metal",
    state: "liquid",
    color: "#E5E7EB",
    molarMass: 200.59,
  },
  {
    id: "tl",
    name: "Thallium",
    formula: "Tl",
    type: "metal",
    state: "solid",
    color: "#D1D5DB",
    molarMass: 204.38,
  },
  {
    id: "bi",
    name: "Bismuth",
    formula: "Bi",
    type: "metal",
    state: "solid",
    color: "#6B7280",
    molarMass: 208.98,
  },
  {
    id: "po",
    name: "Polonium",
    formula: "Po",
    type: "metal",
    state: "solid",
    color: "#6B7280",
    molarMass: 209.0,
  },
  {
    id: "at",
    name: "Astatine",
    formula: "At",
    type: "metal",
    state: "solid",
    color: "#6B7280",
    molarMass: 210.0,
  },
  {
    id: "rn",
    name: "Radon",
    formula: "Rn",
    type: "metal",
    state: "gas",
    color: "transparent",
    molarMass: 222.0,
  },
  {
    id: "fr",
    name: "Francium",
    formula: "Fr",
    type: "metal",
    state: "solid",
    color: "#E5E7EB",
    molarMass: 223.0,
  },
  {
    id: "ra",
    name: "Radium",
    formula: "Ra",
    type: "metal",
    state: "solid",
    color: "#F3F4F6",
    molarMass: 226.0,
  },
  {
    id: "ac",
    name: "Actinium",
    formula: "Ac",
    type: "metal",
    state: "solid",
    color: "#D1D5DB",
    molarMass: 227.0,
  },
  {
    id: "rf",
    name: "Rutherfordium",
    formula: "Rf",
    type: "metal",
    state: "solid",
    color: "#6B7280",
    molarMass: 267.0,
  },
  {
    id: "db",
    name: "Dubnium",
    formula: "Db",
    type: "metal",
    state: "solid",
    color: "#6B7280",
    molarMass: 268.0,
  },
  {
    id: "sg",
    name: "Seaborgium",
    formula: "Sg",
    type: "metal",
    state: "solid",
    color: "#6B7280",
    molarMass: 271.0,
  },
  {
    id: "bh",
    name: "Bohrium",
    formula: "Bh",
    type: "metal",
    state: "solid",
    color: "#6B7280",
    molarMass: 272.0,
  },
  {
    id: "hs",
    name: "Hassium",
    formula: "Hs",
    type: "metal",
    state: "solid",
    color: "#6B7280",
    molarMass: 270.0,
  },
  {
    id: "mt",
    name: "Meitnerium",
    formula: "Mt",
    type: "metal",
    state: "solid",
    color: "#6B7280",
    molarMass: 276.0,
  },
  {
    id: "ds",
    name: "Darmstadtium",
    formula: "Ds",
    type: "metal",
    state: "solid",
    color: "#6B7280",
    molarMass: 281.0,
  },
  {
    id: "rg",
    name: "Roentgenium",
    formula: "Rg",
    type: "metal",
    state: "solid",
    color: "#6B7280",
    molarMass: 280.0,
  },
  {
    id: "cn",
    name: "Copernicium",
    formula: "Cn",
    type: "metal",
    state: "solid",
    color: "#6B7280",
    molarMass: 285.0,
  },
  {
    id: "nh",
    name: "Nihonium",
    formula: "Nh",
    type: "metal",
    state: "solid",
    color: "#6B7280",
    molarMass: 284.0,
  },
  {
    id: "fl",
    name: "Flerovium",
    formula: "Fl",
    type: "metal",
    state: "solid",
    color: "#6B7280",
    molarMass: 289.0,
  },
  {
    id: "mc",
    name: "Moscovium",
    formula: "Mc",
    type: "metal",
    state: "solid",
    color: "#6B7280",
    molarMass: 288.0,
  },
  {
    id: "lv",
    name: "Livermorium",
    formula: "Lv",
    type: "metal",
    state: "solid",
    color: "#6B7280",
    molarMass: 293.0,
  },
  {
    id: "ts",
    name: "Tennessine",
    formula: "Ts",
    type: "metal",
    state: "solid",
    color: "#6B7280",
    molarMass: 294.0,
  },
  {
    id: "og",
    name: "Oganesson",
    formula: "Og",
    type: "metal",
    state: "solid",
    color: "#6B7280",
    molarMass: 294.0,
  },

  // --- ACIDS (10) ---
  {
    id: "hcl",
    name: "Hydrochloric Acid",
    formula: "HCl",
    type: "acid",
    cation: "H+",
    anion: "Cl-",
    state: "aqueous",
    color: "transparent",
    molarMass: 36.46,
  },
  {
    id: "h2so4",
    name: "Sulfuric Acid",
    formula: "H₂SO₄",
    type: "acid",
    cation: "H+",
    anion: "SO4_2-",
    state: "aqueous",
    color: "transparent",
    molarMass: 98.08,
  },
  {
    id: "hno3",
    name: "Nitric Acid",
    formula: "HNO₃",
    type: "acid",
    cation: "H+",
    anion: "NO3-",
    state: "aqueous",
    color: "transparent",
    molarMass: 63.01,
  },
  {
    id: "hbr",
    name: "Hydrobromic Acid",
    formula: "HBr",
    type: "acid",
    cation: "H+",
    anion: "Br-",
    state: "aqueous",
    color: "transparent",
    molarMass: 80.91,
  },
  {
    id: "hi",
    name: "Hydroiodic Acid",
    formula: "HI",
    type: "acid",
    cation: "H+",
    anion: "I-",
    state: "aqueous",
    color: "transparent",
    molarMass: 127.91,
  },
  {
    id: "h3po4",
    name: "Phosphoric Acid",
    formula: "H₃PO₄",
    type: "acid",
    cation: "H+",
    anion: "PO4_3-",
    state: "aqueous",
    color: "transparent",
    molarMass: 97.99,
  },
  {
    id: "ch3cooh",
    name: "Acetic Acid",
    formula: "CH₃COOH",
    type: "acid",
    cation: "H+",
    anion: "CH3COO-",
    state: "aqueous",
    color: "transparent",
    molarMass: 60.05,
  },
  {
    id: "h2c2o4",
    name: "Oxalic Acid",
    formula: "H₂C₂O₄",
    type: "acid",
    cation: "H+",
    anion: "C2O4_2-",
    state: "aqueous",
    color: "transparent",
    molarMass: 90.03,
  },
  {
    id: "hf",
    name: "Hydrofluoric Acid",
    formula: "HF",
    type: "acid",
    cation: "H+",
    anion: "F-",
    state: "aqueous",
    color: "transparent",
    molarMass: 20.01,
  },
  {
    id: "h2co3",
    name: "Carbonic Acid",
    formula: "H₂CO₃",
    type: "acid",
    cation: "H+",
    anion: "CO3_2-",
    state: "aqueous",
    color: "transparent",
    molarMass: 62.03,
  },

  // --- BASES (10) ---
  {
    id: "naoh",
    name: "Sodium Hydroxide",
    formula: "NaOH",
    type: "base",
    cation: "Na+",
    anion: "OH-",
    state: "aqueous",
    color: "transparent",
    molarMass: 40.0,
  },
  {
    id: "koh",
    name: "Potassium Hydroxide",
    formula: "KOH",
    type: "base",
    cation: "K+",
    anion: "OH-",
    state: "aqueous",
    color: "transparent",
    molarMass: 56.11,
  },
  {
    id: "lioh",
    name: "Lithium Hydroxide",
    formula: "LiOH",
    type: "base",
    cation: "Li+",
    anion: "OH-",
    state: "aqueous",
    color: "transparent",
    molarMass: 23.95,
  },
  {
    id: "ca_oh_2",
    name: "Calcium Hydroxide",
    formula: "Ca(OH)₂",
    type: "base",
    cation: "Ca2+",
    anion: "OH-",
    state: "aqueous",
    color: "transparent",
    molarMass: 74.09,
  },
  {
    id: "ba_oh_2",
    name: "Barium Hydroxide",
    formula: "Ba(OH)₂",
    type: "base",
    cation: "Ba2+",
    anion: "OH-",
    state: "aqueous",
    color: "transparent",
    molarMass: 171.34,
  },
  {
    id: "mg_oh_2",
    name: "Magnesium Hydroxide",
    formula: "Mg(OH)₂",
    type: "base",
    cation: "Mg2+",
    anion: "OH-",
    state: "solid",
    color: "#FFFFFF",
    molarMass: 58.32,
  },
  {
    id: "nh4oh",
    name: "Ammonium Hydroxide",
    formula: "NH₄OH",
    type: "base",
    cation: "NH4+",
    anion: "OH-",
    state: "aqueous",
    color: "transparent",
    molarMass: 35.05,
  },
  {
    id: "al_oh_3",
    name: "Aluminum Hydroxide",
    formula: "Al(OH)₃",
    type: "base",
    cation: "Al3+",
    anion: "OH-",
    state: "solid",
    color: "#FFFFFF",
    molarMass: 78.0,
  },
  {
    id: "fe_oh_3",
    name: "Iron(III) Hydroxide",
    formula: "Fe(OH)₃",
    type: "base",
    cation: "Fe3+",
    anion: "OH-",
    state: "solid",
    color: "#92400E",
    molarMass: 106.87,
  },
  {
    id: "cu_oh_2",
    name: "Copper(II) Hydroxide",
    formula: "Cu(OH)₂",
    type: "base",
    cation: "Cu2+",
    anion: "OH-",
    state: "solid",
    color: "#0EA5E9",
    molarMass: 97.56,
  },

  // --- CHLORIDES (15) ---
  {
    id: "nacl",
    name: "Sodium Chloride",
    formula: "NaCl",
    type: "salt",
    cation: "Na+",
    anion: "Cl-",
    state: "aqueous",
    color: "transparent",
    molarMass: 58.44,
  },
  {
    id: "kcl",
    name: "Potassium Chloride",
    formula: "KCl",
    type: "salt",
    cation: "K+",
    anion: "Cl-",
    state: "aqueous",
    color: "transparent",
    molarMass: 74.55,
  },
  {
    id: "nh4cl",
    name: "Ammonium Chloride",
    formula: "NH₄Cl",
    type: "salt",
    cation: "NH4+",
    anion: "Cl-",
    state: "aqueous",
    color: "transparent",
    molarMass: 53.49,
  },
  {
    id: "cacl2",
    name: "Calcium Chloride",
    formula: "CaCl₂",
    type: "salt",
    cation: "Ca2+",
    anion: "Cl-",
    state: "aqueous",
    color: "transparent",
    molarMass: 110.98,
  },
  {
    id: "mgcl2",
    name: "Magnesium Chloride",
    formula: "MgCl₂",
    type: "salt",
    cation: "Mg2+",
    anion: "Cl-",
    state: "aqueous",
    color: "transparent",
    molarMass: 95.21,
  },
  {
    id: "bacl2",
    name: "Barium Chloride",
    formula: "BaCl₂",
    type: "salt",
    cation: "Ba2+",
    anion: "Cl-",
    state: "aqueous",
    color: "transparent",
    molarMass: 208.23,
  },
  {
    id: "alcl3",
    name: "Aluminum Chloride",
    formula: "AlCl₃",
    type: "salt",
    cation: "Al3+",
    anion: "Cl-",
    state: "aqueous",
    color: "transparent",
    molarMass: 133.34,
  },
  {
    id: "zncl2",
    name: "Zinc Chloride",
    formula: "ZnCl₂",
    type: "salt",
    cation: "Zn2+",
    anion: "Cl-",
    state: "aqueous",
    color: "transparent",
    molarMass: 136.31,
  },
  {
    id: "fecl2",
    name: "Iron(II) Chloride",
    formula: "FeCl₂",
    type: "salt",
    cation: "Fe2+",
    anion: "Cl-",
    state: "aqueous",
    color: "#22C55E",
    molarMass: 126.75,
  },
  {
    id: "fecl3",
    name: "Iron(III) Chloride",
    formula: "FeCl₃",
    type: "salt",
    cation: "Fe3+",
    anion: "Cl-",
    state: "aqueous",
    color: "#F59E0B",
    molarMass: 162.2,
  },
  {
    id: "cucl2",
    name: "Copper(II) Chloride",
    formula: "CuCl₂",
    type: "salt",
    cation: "Cu2+",
    anion: "Cl-",
    state: "aqueous",
    color: "#3B82F6",
    molarMass: 134.45,
  },
  {
    id: "nicl2",
    name: "Nickel Chloride",
    formula: "NiCl₂",
    type: "salt",
    cation: "Ni2+",
    anion: "Cl-",
    state: "aqueous",
    color: "#10B981",
    molarMass: 129.6,
  },
  {
    id: "cocl2",
    name: "Cobalt Chloride",
    formula: "CoCl₂",
    type: "salt",
    cation: "Co2+",
    anion: "Cl-",
    state: "aqueous",
    color: "#EC4899",
    molarMass: 129.8,
  },
  {
    id: "agcl",
    name: "Silver Chloride",
    formula: "AgCl",
    type: "salt",
    cation: "Ag+",
    anion: "Cl-",
    state: "solid",
    color: "#FFFFFF",
    molarMass: 143.32,
  },
  {
    id: "licl",
    name: "Lithium Chloride",
    formula: "LiCl",
    type: "salt",
    cation: "Li+",
    anion: "Cl-",
    state: "aqueous",
    color: "transparent",
    molarMass: 42.39,
  },

  // --- SULFATES (15) ---
  {
    id: "na2so4",
    name: "Sodium Sulfate",
    formula: "Na₂SO₄",
    type: "salt",
    cation: "Na+",
    anion: "SO4_2-",
    state: "aqueous",
    color: "transparent",
    molarMass: 142.04,
  },
  {
    id: "k2so4",
    name: "Potassium Sulfate",
    formula: "K₂SO₄",
    type: "salt",
    cation: "K+",
    anion: "SO4_2-",
    state: "aqueous",
    color: "transparent",
    molarMass: 174.26,
  },
  {
    id: "mgso4",
    name: "Magnesium Sulfate",
    formula: "MgSO₄",
    type: "salt",
    cation: "Mg2+",
    anion: "SO4_2-",
    state: "aqueous",
    color: "transparent",
    molarMass: 120.37,
  },
  {
    id: "caso4",
    name: "Calcium Sulfate",
    formula: "CaSO₄",
    type: "salt",
    cation: "Ca2+",
    anion: "SO4_2-",
    state: "solid",
    color: "#FFFFFF",
    molarMass: 136.14,
  },
  {
    id: "baso4",
    name: "Barium Sulfate",
    formula: "BaSO₄",
    type: "salt",
    cation: "Ba2+",
    anion: "SO4_2-",
    state: "solid",
    color: "#FFFFFF",
    molarMass: 233.39,
  },
  {
    id: "znso4",
    name: "Zinc Sulfate",
    formula: "ZnSO₄",
    type: "salt",
    cation: "Zn2+",
    anion: "SO4_2-",
    state: "aqueous",
    color: "transparent",
    molarMass: 161.47,
  },
  {
    id: "feso4",
    name: "Iron(II) Sulfate",
    formula: "FeSO₄",
    type: "salt",
    cation: "Fe2+",
    anion: "SO4_2-",
    state: "aqueous",
    color: "#22C55E",
    molarMass: 151.91,
  },
  {
    id: "cuso4",
    name: "Copper Sulfate",
    formula: "CuSO₄",
    type: "salt",
    cation: "Cu2+",
    anion: "SO4_2-",
    state: "aqueous",
    color: "#3B82F6",
    molarMass: 159.61,
  },
  {
    id: "niso4",
    name: "Nickel Sulfate",
    formula: "NiSO₄",
    type: "salt",
    cation: "Ni2+",
    anion: "SO4_2-",
    state: "aqueous",
    color: "#10B981",
    molarMass: 154.75,
  },
  {
    id: "coso4",
    name: "Cobalt Sulfate",
    formula: "CoSO₄",
    type: "salt",
    cation: "Co2+",
    anion: "SO4_2-",
    state: "aqueous",
    color: "#EC4899",
    molarMass: 155.0,
  },
  {
    id: "al2so43",
    name: "Aluminum Sulfate",
    formula: "Al₂(SO₄)₃",
    type: "salt",
    cation: "Al3+",
    anion: "SO4_2-",
    state: "aqueous",
    color: "transparent",
    molarMass: 342.15,
  },
  {
    id: "pbso4",
    name: "Lead Sulfate",
    formula: "PbSO₄",
    type: "salt",
    cation: "Pb2+",
    anion: "SO4_2-",
    state: "solid",
    color: "#FFFFFF",
    molarMass: 303.26,
  },
  {
    id: "mnso4",
    name: "Manganese Sulfate",
    formula: "MnSO₄",
    type: "salt",
    cation: "Mn2+",
    anion: "SO4_2-",
    state: "aqueous",
    color: "#F9A8D4",
    molarMass: 151.0,
  },
  {
    id: "cr2so43",
    name: "Chromium(III) Sulfate",
    formula: "Cr₂(SO₄)₃",
    type: "salt",
    cation: "Cr3+",
    anion: "SO4_2-",
    state: "aqueous",
    color: "#059669",
    molarMass: 392.18,
  },
  {
    id: "ag2so4",
    name: "Silver Sulfate",
    formula: "Ag₂SO₄",
    type: "salt",
    cation: "Ag+",
    anion: "SO4_2-",
    state: "aqueous",
    color: "transparent",
    molarMass: 311.8,
  },

  // --- NITRATES (15) ---
  {
    id: "nano3",
    name: "Sodium Nitrate",
    formula: "NaNO₃",
    type: "salt",
    cation: "Na+",
    anion: "NO3-",
    state: "aqueous",
    color: "transparent",
    molarMass: 84.99,
  },
  {
    id: "kno3",
    name: "Potassium Nitrate",
    formula: "KNO₃",
    type: "salt",
    cation: "K+",
    anion: "NO3-",
    state: "aqueous",
    color: "transparent",
    molarMass: 101.1,
  },
  {
    id: "agno3",
    name: "Silver Nitrate",
    formula: "AgNO₃",
    type: "salt",
    cation: "Ag+",
    anion: "NO3-",
    state: "aqueous",
    color: "transparent",
    molarMass: 169.87,
  },
  {
    id: "pb_no3_2",
    name: "Lead Nitrate",
    formula: "Pb(NO₃)₂",
    type: "salt",
    cation: "Pb2+",
    anion: "NO3-",
    state: "aqueous",
    color: "transparent",
    molarMass: 331.2,
  },
  {
    id: "cu_no3_2",
    name: "Copper Nitrate",
    formula: "Cu(NO₃)₂",
    type: "salt",
    cation: "Cu2+",
    anion: "NO3-",
    state: "aqueous",
    color: "#3B82F6",
    molarMass: 187.56,
  },
  {
    id: "zn_no3_2",
    name: "Zinc Nitrate",
    formula: "Zn(NO₃)₂",
    type: "salt",
    cation: "Zn2+",
    anion: "NO3-",
    state: "aqueous",
    color: "transparent",
    molarMass: 189.4,
  },
  {
    id: "fe_no3_3",
    name: "Iron(III) Nitrate",
    formula: "Fe(NO₃)₃",
    type: "salt",
    cation: "Fe3+",
    anion: "NO3-",
    state: "aqueous",
    color: "#F59E0B",
    molarMass: 241.86,
  },
  {
    id: "ni_no3_2",
    name: "Nickel Nitrate",
    formula: "Ni(NO₃)₂",
    type: "salt",
    cation: "Ni2+",
    anion: "NO3-",
    state: "aqueous",
    color: "#10B981",
    molarMass: 182.7,
  },
  {
    id: "co_no3_2",
    name: "Cobalt Nitrate",
    formula: "Co(NO₃)₂",
    type: "salt",
    cation: "Co2+",
    anion: "NO3-",
    state: "aqueous",
    color: "#EC4899",
    molarMass: 182.9,
  },
  {
    id: "ba_no3_2",
    name: "Barium Nitrate",
    formula: "Ba(NO₃)₂",
    type: "salt",
    cation: "Ba2+",
    anion: "NO3-",
    state: "aqueous",
    color: "transparent",
    molarMass: 261.34,
  },
  {
    id: "ca_no3_2",
    name: "Calcium Nitrate",
    formula: "Ca(NO₃)₂",
    type: "salt",
    cation: "Ca2+",
    anion: "NO3-",
    state: "aqueous",
    color: "transparent",
    molarMass: 164.09,
  },
  {
    id: "mg_no3_2",
    name: "Magnesium Nitrate",
    formula: "Mg(NO₃)₂",
    type: "salt",
    cation: "Mg2+",
    anion: "NO3-",
    state: "aqueous",
    color: "transparent",
    molarMass: 148.31,
  },
  {
    id: "al_no3_3",
    name: "Aluminum Nitrate",
    formula: "Al(NO₃)₃",
    type: "salt",
    cation: "Al3+",
    anion: "NO3-",
    state: "aqueous",
    color: "transparent",
    molarMass: 213.0,
  },
  {
    id: "nh4no3",
    name: "Ammonium Nitrate",
    formula: "NH₄NO₃",
    type: "salt",
    cation: "NH4+",
    anion: "NO3-",
    state: "aqueous",
    color: "transparent",
    molarMass: 80.04,
  },
  {
    id: "lino3",
    name: "Lithium Nitrate",
    formula: "LiNO₃",
    type: "salt",
    cation: "Li+",
    anion: "NO3-",
    state: "aqueous",
    color: "transparent",
    molarMass: 68.95,
  },

  // --- OTHERS & SPECIALS (20) ---
  {
    id: "na2co3",
    name: "Sodium Carbonate",
    formula: "Na₂CO₃",
    type: "salt",
    cation: "Na+",
    anion: "CO3_2-",
    state: "aqueous",
    color: "transparent",
    molarMass: 105.99,
  },
  {
    id: "k2co3",
    name: "Potassium Carbonate",
    formula: "K₂CO₃",
    type: "salt",
    cation: "K+",
    anion: "CO3_2-",
    state: "aqueous",
    color: "transparent",
    molarMass: 138.21,
  },
  {
    id: "caco3",
    name: "Calcium Carbonate",
    formula: "CaCO₃",
    type: "salt",
    cation: "Ca2+",
    anion: "CO3_2-",
    state: "solid",
    color: "#FFFFFF",
    molarMass: 100.09,
  },
  {
    id: "mgco3",
    name: "Magnesium Carbonate",
    formula: "MgCO₃",
    type: "salt",
    cation: "Mg2+",
    anion: "CO3_2-",
    state: "solid",
    color: "#FFFFFF",
    molarMass: 84.31,
  },
  {
    id: "baco3",
    name: "Barium Carbonate",
    formula: "BaCO₃",
    type: "salt",
    cation: "Ba2+",
    anion: "CO3_2-",
    state: "solid",
    color: "#FFFFFF",
    molarMass: 197.34,
  },
  {
    id: "ki",
    name: "Potassium Iodide",
    formula: "KI",
    type: "salt",
    cation: "K+",
    anion: "I-",
    state: "aqueous",
    color: "transparent",
    molarMass: 166.0,
  },
  {
    id: "nai",
    name: "Sodium Iodide",
    formula: "NaI",
    type: "salt",
    cation: "Na+",
    anion: "I-",
    state: "aqueous",
    color: "transparent",
    molarMass: 149.89,
  },
  {
    id: "pbi2",
    name: "Lead Iodide",
    formula: "PbI₂",
    type: "salt",
    cation: "Pb2+",
    anion: "I-",
    state: "solid",
    color: "#FDE047",
    molarMass: 461.0,
  },
  {
    id: "agi",
    name: "Silver Iodide",
    formula: "AgI",
    type: "salt",
    cation: "Ag+",
    anion: "I-",
    state: "solid",
    color: "#FEF08A",
    molarMass: 234.77,
  },
  {
    id: "kmno4",
    name: "Potassium Permanganate",
    formula: "KMnO₄",
    type: "salt",
    cation: "K+",
    anion: "MnO4-",
    state: "aqueous",
    color: "#701A75",
    molarMass: 158.03,
  },
  {
    id: "k2cr2o7",
    name: "Potassium Dichromate",
    formula: "K₂Cr₂O₇",
    type: "salt",
    cation: "K+",
    anion: "Cr2O7_2-",
    state: "aqueous",
    color: "#EA580C",
    molarMass: 294.18,
  },
  {
    id: "cus",
    name: "Copper Sulfide",
    formula: "CuS",
    type: "salt",
    cation: "Cu2+",
    anion: "S2-",
    state: "solid",
    color: "#111827",
    molarMass: 95.61,
  },
  {
    id: "fes",
    name: "Iron(II) Sulfide",
    formula: "FeS",
    type: "salt",
    cation: "Fe2+",
    anion: "S2-",
    state: "solid",
    color: "#111827",
    molarMass: 87.91,
  },
  {
    id: "nahco3",
    name: "Sodium Bicarbonate",
    formula: "NaHCO₃",
    type: "salt",
    cation: "Na+",
    anion: "HCO3-",
    state: "aqueous",
    color: "transparent",
    molarMass: 84.01,
  },
  {
    id: "kbr",
    name: "Potassium Bromide",
    formula: "KBr",
    type: "salt",
    cation: "K+",
    anion: "Br-",
    state: "aqueous",
    color: "transparent",
    molarMass: 119.0,
  },
  {
    id: "nabr",
    name: "Sodium Bromide",
    formula: "NaBr",
    type: "salt",
    cation: "Na+",
    anion: "Br-",
    state: "aqueous",
    color: "transparent",
    molarMass: 102.89,
  },
  {
    id: "cuco3",
    name: "Copper Carbonate",
    formula: "CuCO₃",
    type: "salt",
    cation: "Cu2+",
    anion: "CO3_2-",
    state: "solid",
    color: "#065F46",
    molarMass: 123.55,
  },
  {
    id: "ag2o",
    name: "Silver Oxide",
    formula: "Ag₂O",
    type: "oxide",
    cation: "Ag+",
    anion: "O2-",
    state: "solid",
    color: "#111827",
    molarMass: 231.74,
  },
  {
    id: "mno2",
    name: "Manganese Dioxide",
    formula: "MnO₂",
    type: "oxide",
    cation: "Mn4+",
    anion: "O2-",
    state: "solid",
    color: "#111827",
    molarMass: 86.94,
  },
  {
    id: "cuo",
    name: "Copper(II) Oxide",
    formula: "CuO",
    type: "oxide",
    cation: "Cu2+",
    anion: "O2-",
    state: "solid",
    color: "#111827",
    molarMass: 79.55,
  },

  // --- MOLECULES ---
  {
    id: "h2o",
    name: "Water",
    formula: "H₂O",
    type: "molecule",
    state: "liquid",
    color: "transparent",
    molarMass: 18.015,
  },
  {
    id: "co2",
    name: "Carbon Dioxide",
    formula: "CO₂",
    type: "molecule",
    state: "gas",
    color: "transparent",
    molarMass: 44.01,
  },
  {
    id: "ch4",
    name: "Methane",
    formula: "CH₄",
    type: "molecule",
    state: "gas",
    color: "transparent",
    molarMass: 16.04,
  },
  {
    id: "nh3",
    name: "Ammonia",
    formula: "NH₃",
    type: "molecule",
    state: "gas",
    color: "transparent",
    molarMass: 17.031,
  },
  {
    id: "c2h5oh",
    name: "Ethanol",
    formula: "C₂H₅OH",
    type: "molecule",
    state: "liquid",
    color: "transparent",
    molarMass: 46.07,
  },
  {
    id: "c6h12o6",
    name: "Glucose",
    formula: "C₆H₁₂O₆",
    type: "molecule",
    state: "solid",
    color: "#F3F4F6",
    molarMass: 180.16,
  },
  {
    id: "c2h4",
    name: "Ethene",
    formula: "C₂H₄",
    type: "molecule",
    state: "gas",
    color: "transparent",
    molarMass: 28.05,
  },
  {
    id: "o2",
    name: "Oxygen Gas",
    formula: "O₂",
    type: "molecule",
    state: "gas",
    color: "transparent",
    molarMass: 32.0,
  },
  {
    id: "n2",
    name: "Nitrogen Gas",
    formula: "N₂",
    type: "molecule",
    state: "gas",
    color: "transparent",
    molarMass: 28.02,
  },
  {
    id: "h2",
    name: "Hydrogen Gas",
    formula: "H₂",
    type: "molecule",
    state: "gas",
    color: "transparent",
    molarMass: 2.016,
  },
  {
    id: "f2",
    name: "Fluorine Gas",
    formula: "F₂",
    type: "molecule",
    state: "gas",
    color: "#F59E0B",
    molarMass: 38.0,
  },
  {
    id: "cl2",
    name: "Chlorine Gas",
    formula: "Cl₂",
    type: "molecule",
    state: "gas",
    color: "#F59E0B",
    molarMass: 70.9,
  },
  {
    id: "br2",
    name: "Bromine Liquid",
    formula: "Br₂",
    type: "molecule",
    state: "liquid",
    color: "#DC2626",
    molarMass: 159.8,
  },
  {
    id: "i2",
    name: "Iodine Solid",
    formula: "I₂",
    type: "molecule",
    state: "solid",
    color: "#7C3AED",
    molarMass: 253.8,
  },
  {
    id: "p4",
    name: "White Phosphorus",
    formula: "P₄",
    type: "molecule",
    state: "solid",
    color: "#F59E0B",
    molarMass: 123.9,
  },
  {
    id: "s8",
    name: "Sulfur",
    formula: "S₈",
    type: "molecule",
    state: "solid",
    color: "#F59E0B",
    molarMass: 256.5,
  },
  {
    id: "c60",
    name: "Buckminsterfullerene",
    formula: "C₆₀",
    type: "molecule",
    state: "solid",
    color: "#111827",
    molarMass: 720.6,
  },
  {
    id: "c70",
    name: "Fullerene C70",
    formula: "C₇₀",
    type: "molecule",
    state: "solid",
    color: "#111827",
    molarMass: 840.7,
  },
  {
    id: "graphite",
    name: "Graphite",
    formula: "C",
    type: "molecule",
    state: "solid",
    color: "#374151",
    molarMass: 12.01,
  },
  {
    id: "diamond",
    name: "Diamond",
    formula: "C",
    type: "molecule",
    state: "solid",
    color: "#F3F4F6",
    molarMass: 12.01,
  },
  {
    id: "co",
    name: "Carbon Monoxide",
    formula: "CO",
    type: "molecule",
    state: "gas",
    color: "transparent",
    molarMass: 28.01,
  },
  {
    id: "no2",
    name: "Nitrogen Dioxide",
    formula: "NO₂",
    type: "molecule",
    state: "gas",
    color: "#DC2626",
    molarMass: 46.01,
  },
  {
    id: "so2",
    name: "Sulfur Dioxide",
    formula: "SO₂",
    type: "molecule",
    state: "gas",
    color: "transparent",
    molarMass: 64.06,
  },
  {
    id: "ch3oh",
    name: "Methanol",
    formula: "CH₃OH",
    type: "molecule",
    state: "liquid",
    color: "transparent",
    molarMass: 32.04,
  },

  // --- ADDITIONAL OXIDES ---
  {
    id: "na2o",
    name: "Sodium Oxide",
    formula: "Na₂O",
    type: "oxide",
    cation: "Na+",
    anion: "O2-",
    state: "solid",
    color: "#F3F4F6",
    molarMass: 61.98,
  },
  {
    id: "mgo",
    name: "Magnesium Oxide",
    formula: "MgO",
    type: "oxide",
    cation: "Mg2+",
    anion: "O2-",
    state: "solid",
    color: "#F3F4F6",
    molarMass: 40.3,
  },
  {
    id: "al2o3",
    name: "Aluminum Oxide",
    formula: "Al₂O₃",
    type: "oxide",
    cation: "Al3+",
    anion: "O2-",
    state: "solid",
    color: "#F3F4F6",
    molarMass: 101.96,
  },
  {
    id: "sio2",
    name: "Silicon Dioxide",
    formula: "SiO₂",
    type: "oxide",
    cation: "Si4+",
    anion: "O2-",
    state: "solid",
    color: "#F3F4F6",
    molarMass: 60.08,
  },
  {
    id: "p4o10",
    name: "Phosphorus Pentoxide",
    formula: "P₄O₁₀",
    type: "oxide",
    cation: "P5+",
    anion: "O2-",
    state: "solid",
    color: "#F3F4F6",
    molarMass: 283.89,
  },
  {
    id: "so3",
    name: "Sulfur Trioxide",
    formula: "SO₃",
    type: "oxide",
    cation: "S6+",
    anion: "O2-",
    state: "liquid",
    color: "transparent",
    molarMass: 80.06,
  },

  // --- ADDITIONAL HALIDES ---
  {
    id: "lif",
    name: "Lithium Fluoride",
    formula: "LiF",
    type: "salt",
    cation: "Li+",
    anion: "F-",
    state: "solid",
    color: "#F3F4F6",
    molarMass: 25.94,
  },
  {
    id: "mgf2",
    name: "Magnesium Fluoride",
    formula: "MgF₂",
    type: "salt",
    cation: "Mg2+",
    anion: "F-",
    state: "solid",
    color: "#F3F4F6",
    molarMass: 62.3,
  },
  {
    id: "alf3",
    name: "Aluminum Fluoride",
    formula: "AlF₃",
    type: "salt",
    cation: "Al3+",
    anion: "F-",
    state: "solid",
    color: "#F3F4F6",
    molarMass: 83.98,
  },
  {
    id: "sif4",
    name: "Silicon Tetrafluoride",
    formula: "SiF₄",
    type: "salt",
    cation: "Si4+",
    anion: "F-",
    state: "gas",
    color: "transparent",
    molarMass: 104.08,
  },
  {
    id: "pf5",
    name: "Phosphorus Pentafluoride",
    formula: "PF₅",
    type: "salt",
    cation: "P5+",
    anion: "F-",
    state: "gas",
    color: "transparent",
    molarMass: 125.97,
  },
  {
    id: "sf6",
    name: "Sulfur Hexafluoride",
    formula: "SF₆",
    type: "salt",
    cation: "S6+",
    anion: "F-",
    state: "gas",
    color: "transparent",
    molarMass: 146.06,
  },

  // --- ADDITIONAL SULFIDES ---
  {
    id: "na2s",
    name: "Sodium Sulfide",
    formula: "Na₂S",
    type: "salt",
    cation: "Na+",
    anion: "S2-",
    state: "solid",
    color: "#F3F4F6",
    molarMass: 78.04,
  },
  {
    id: "mgs",
    name: "Magnesium Sulfide",
    formula: "MgS",
    type: "salt",
    cation: "Mg2+",
    anion: "S2-",
    state: "solid",
    color: "#F3F4F6",
    molarMass: 56.37,
  },
  {
    id: "al2s3",
    name: "Aluminum Sulfide",
    formula: "Al₂S₃",
    type: "salt",
    cation: "Al3+",
    anion: "S2-",
    state: "solid",
    color: "#F59E0B",
    molarMass: 150.16,
  },
  {
    id: "cas",
    name: "Calcium Sulfide",
    formula: "CaS",
    type: "salt",
    cation: "Ca2+",
    anion: "S2-",
    state: "solid",
    color: "#F3F4F6",
    molarMass: 72.14,
  },
  {
    id: "bas",
    name: "Barium Sulfide",
    formula: "BaS",
    type: "salt",
    cation: "Ba2+",
    anion: "S2-",
    state: "solid",
    color: "#F3F4F6",
    molarMass: 169.39,
  },

  // --- ADDITIONAL NITRATES ---
  {
    id: "linO3",
    name: "Lithium Nitrate",
    formula: "LiNO₃",
    type: "salt",
    cation: "Li+",
    anion: "NO3-",
    state: "solid",
    color: "#F3F4F6",
    molarMass: 68.95,
  },
  {
    id: "mgnO32",
    name: "Magnesium Nitrate",
    formula: "Mg(NO₃)₂",
    type: "salt",
    cation: "Mg2+",
    anion: "NO3-",
    state: "solid",
    color: "#F3F4F6",
    molarMass: 148.32,
  },
  {
    id: "alnO33",
    name: "Aluminum Nitrate",
    formula: "Al(NO₃)₃",
    type: "salt",
    cation: "Al3+",
    anion: "NO3-",
    state: "solid",
    color: "#F3F4F6",
    molarMass: 212.99,
  },

  // --- ADDITIONAL PHOSPHATES ---
  {
    id: "na3po4",
    name: "Sodium Phosphate",
    formula: "Na₃PO₄",
    type: "salt",
    cation: "Na+",
    anion: "PO4_3-",
    state: "solid",
    color: "#F3F4F6",
    molarMass: 163.94,
  },
  {
    id: "mg3po42",
    name: "Magnesium Phosphate",
    formula: "Mg₃(PO₄)₂",
    type: "salt",
    cation: "Mg2+",
    anion: "PO4_3-",
    state: "solid",
    color: "#F3F4F6",
    molarMass: 262.86,
  },
  {
    id: "ca3po42",
    name: "Calcium Phosphate",
    formula: "Ca₃(PO₄)₂",
    type: "salt",
    cation: "Ca2+",
    anion: "PO4_3-",
    state: "solid",
    color: "#F3F4F6",
    molarMass: 310.18,
  },

  // --- ADDITIONAL CARBONATES ---
  {
    id: "li2co3",
    name: "Lithium Carbonate",
    formula: "Li₂CO₃",
    type: "salt",
    cation: "Li+",
    anion: "CO3_2-",
    state: "solid",
    color: "#F3F4F6",
    molarMass: 73.89,
  },
  {
    id: "mgco3",
    name: "Magnesium Carbonate",
    formula: "MgCO₃",
    type: "salt",
    cation: "Mg2+",
    anion: "CO3_2-",
    state: "solid",
    color: "#F3F4F6",
    molarMass: 84.31,
  },
  {
    id: "srco3",
    name: "Strontium Carbonate",
    formula: "SrCO₃",
    type: "salt",
    cation: "Sr2+",
    anion: "CO3_2-",
    state: "solid",
    color: "#F3F4F6",
    molarMass: 147.63,
  },

  // --- ADDITIONAL HYDROXIDES ---
  {
    id: "liOH",
    name: "Lithium Hydroxide",
    formula: "LiOH",
    type: "base",
    cation: "Li+",
    anion: "OH-",
    state: "solid",
    color: "#F3F4F6",
    molarMass: 23.95,
  },
  {
    id: "caoh2",
    name: "Calcium Hydroxide",
    formula: "Ca(OH)₂",
    type: "base",
    cation: "Ca2+",
    anion: "OH-",
    state: "solid",
    color: "#F3F4F6",
    molarMass: 74.09,
  },
  {
    id: "baoh2",
    name: "Barium Hydroxide",
    formula: "Ba(OH)₂",
    type: "base",
    cation: "Ba2+",
    anion: "OH-",
    state: "solid",
    color: "#F3F4F6",
    molarMass: 171.34,
  },
  {
    id: "aloh3",
    name: "Aluminum Hydroxide",
    formula: "Al(OH)₃",
    type: "base",
    cation: "Al3+",
    anion: "OH-",
    state: "solid",
    color: "#F3F4F6",
    molarMass: 78.0,
  },

  // --- ADDITIONAL ACIDS ---
  {
    id: "h2so3",
    name: "Sulfurous Acid",
    formula: "H₂SO₃",
    type: "acid",
    cation: "H+",
    anion: "SO3_2-",
    state: "aqueous",
    color: "transparent",
    molarMass: 82.07,
  },
  {
    id: "h3po3",
    name: "Phosphorous Acid",
    formula: "H₃PO₃",
    type: "acid",
    cation: "H+",
    anion: "PO3_3-",
    state: "solid",
    color: "#F3F4F6",
    molarMass: 81.99,
  },
  {
    id: "hclo",
    name: "Hypochlorous Acid",
    formula: "HClO",
    type: "acid",
    cation: "H+",
    anion: "ClO-",
    state: "aqueous",
    color: "transparent",
    molarMass: 52.46,
  },
  {
    id: "hclo2",
    name: "Chlorous Acid",
    formula: "HClO₂",
    type: "acid",
    cation: "H+",
    anion: "ClO2-",
    state: "aqueous",
    color: "transparent",
    molarMass: 68.46,
  },
  {
    id: "hclo3",
    name: "Chloric Acid",
    formula: "HClO₃",
    type: "acid",
    cation: "H+",
    anion: "ClO3-",
    state: "aqueous",
    color: "transparent",
    molarMass: 84.46,
  },
  {
    id: "hclo4",
    name: "Perchloric Acid",
    formula: "HClO₄",
    type: "acid",
    cation: "H+",
    anion: "ClO4-",
    state: "aqueous",
    color: "transparent",
    molarMass: 100.46,
  },
];

export interface ReactionResult {
  occurred: boolean;
  type:
    | "displacement"
    | "precipitation"
    | "neutralization"
    | "photosynthesis"
    | "combustion"
    | "decomposition"
    | "synthesis"
    | "hydrolysis"
    | "no_reaction";
  equation: string;
  products: string[];
  observations: string[];
  liquidColor: string;
  precipitate?: { name: string; color: string; formula: string };
  gasProduced?: { name: string; formula: string };
  energyChange: "exothermic" | "endothermic" | "neutral";
  explanation: string;
}

// 6. Logic Functions
function getReactivityRank(metal: string): number {
  const index = REACTIVITY_SERIES.indexOf(
    metal as (typeof REACTIVITY_SERIES)[number]
  );
  return index === -1 ? 999 : index;
}

function isSoluble(cation: string, anion: string): boolean {
  if (
    SOLUBILITY_RULES.alwaysSoluble.includes(cation) ||
    SOLUBILITY_RULES.alwaysSoluble.includes(anion)
  )
    return true;
  if (anion === "Cl-" || anion === "Br-" || anion === "I-")
    return !SOLUBILITY_RULES.chlorides.exceptions.includes(cation);
  if (anion === "SO4_2-")
    return !SOLUBILITY_RULES.sulfates.exceptions.includes(cation);
  if (anion === "OH-")
    return SOLUBILITY_RULES.hydroxides.exceptions.includes(cation);
  if (anion === "CO3_2-")
    return SOLUBILITY_RULES.carbonates.exceptions.includes(cation);
  if (anion === "S2-")
    return SOLUBILITY_RULES.sulfides.exceptions.includes(cation);
  return true;
}

function getLiquidColor(ions: string[]): string {
  for (const ion of ions) {
    const color = ION_COLORS[ion];
    if (color && color !== "transparent") return color;
  }
  return "#CBD5E1";
}

// Helper function for synthesis reactions
function getSynthesisProduct(metal: string, nonmetal: string): string | null {
  const synthesisProducts: Record<string, Record<string, string>> = {
    Na: {
      Cl: "NaCl",
      O: "Na₂O",
      S: "Na₂S",
      N: "Na₃N",
      P: "Na₃P",
      Br: "NaBr",
      I: "NaI",
    },
    K: {
      Cl: "KCl",
      O: "K₂O",
      S: "K₂S",
      N: "K₃N",
      P: "K₃P",
      Br: "KBr",
      I: "KI",
    },
    Ca: {
      O: "CaO",
      S: "CaS",
      Cl: "CaCl₂",
      N: "Ca₃N₂",
      P: "Ca₃P₂",
      Br: "CaBr₂",
      I: "CaI₂",
    },
    Mg: {
      O: "MgO",
      S: "MgS",
      Cl: "MgCl₂",
      N: "Mg₃N₂",
      P: "Mg₃P₂",
      Br: "MgBr₂",
      I: "MgI₂",
    },
    Al: {
      O: "Al₂O₃",
      S: "Al₂S₃",
      Cl: "AlCl₃",
      N: "AlN",
      P: "AlP",
      Br: "AlBr₃",
      I: "AlI₃",
    },
    Zn: {
      O: "ZnO",
      S: "ZnS",
      Cl: "ZnCl₂",
      N: "Zn₃N₂",
      P: "Zn₃P₂",
      Br: "ZnBr₂",
      I: "ZnI₂",
    },
    Fe: {
      O: "Fe₂O₃",
      S: "FeS",
      Cl: "FeCl₃",
      N: "Fe₄N",
      P: "FeP",
      Br: "FeBr₃",
      I: "FeI₃",
    },
    Cu: {
      O: "CuO",
      S: "CuS",
      Cl: "CuCl₂",
      N: "Cu₃N",
      P: "CuP",
      Br: "CuBr₂",
      I: "CuI₂",
    },
  };

  return synthesisProducts[metal]?.[nonmetal] || null;
}

// Helper function to get metal symbol from cation
function getMetalFromCation(cation: string): string {
  const cationToMetal: Record<string, string> = {
    "Na+": "Na",
    "K+": "K",
    "Ca2+": "Ca",
    "Mg2+": "Mg",
    "Al3+": "Al",
    "Zn2+": "Zn",
    "Fe2+": "Fe",
    "Fe3+": "Fe",
    "Cu2+": "Cu",
    "Ag+": "Ag",
    "Pb2+": "Pb",
    "Hg2+": "Hg",
    "Sn2+": "Sn",
    "Ni2+": "Ni",
    "Co2+": "Co",
    "Mn2+": "Mn",
    "Cr3+": "Cr",
    "Ba2+": "Ba",
    "Sr2+": "Sr",
    "Li+": "Li",
    "Be2+": "Be",
    "Ra2+": "Ra",
    "Cs+": "Cs",
    "Rb+": "Rb",
    "Fr+": "Fr",
    "Sc3+": "Sc",
    "Ti4+": "Ti",
    "V5+": "V",
    "Nb5+": "Nb",
    "Ta5+": "Ta",
    "Mo6+": "Mo",
    "W6+": "W",
    "Tc7+": "Tc",
    "Re7+": "Re",
    "Ru4+": "Ru",
    "Os4+": "Os",
    "Rh3+": "Rh",
    "Ir4+": "Ir",
    "Pd2+": "Pd",
    "Pt4+": "Pt",
    "Au3+": "Au",
    "Cd2+": "Cd",
    "In3+": "In",
    "Tl3+": "Tl",
    "Ge4+": "Ge",
    "Sb5+": "Sb",
    "Bi5+": "Bi",
    "As5+": "As",
    "Se6+": "Se",
    "Te6+": "Te",
    "Po6+": "Po",
    "At7+": "At",
    "Ga3+": "Ga",
    "Tl+": "Tl",
    "Hg22+": "Hg",
  };

  return cationToMetal[cation] || "";
}

// Gemini API function for predicting unknown chemical reactions
async function predictReactionWithGemini(
  chemicals: Chemical[]
): Promise<ReactionResult | null> {
  try {
    // Get API key from environment variable
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      console.warn(
        "Gemini API key not found. Set VITE_GEMINI_API_KEY environment variable."
      );
      return null;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Format chemicals for the prompt
    const chemicalList = chemicals
      .map((c) => `${c.name} (${c.formula})`)
      .join(", ");

    const prompt = `You are a chemistry expert. Predict what happens when these chemicals are mixed: ${chemicalList}.

Please respond in this exact JSON format:
{
  "occurred": true/false,
  "type": "synthesis"/"decomposition"/"displacement"/"precipitation"/"neutralization"/"combustion"/"photosynthesis"/"hydrolysis"/"no_reaction",
  "equation": "chemical equation with proper formatting",
  "products": ["product1", "product2"],
  "observations": ["observation1", "observation2"],
  "liquidColor": "#hexcolor or description",
  "energyChange": "exothermic"/"endothermic"/"neutral",
  "explanation": "brief explanation of the reaction"
}

If no reaction occurs, set occurred to false and type to "no_reaction".
For the equation, use proper chemical notation with subscripts if needed.
For liquidColor, use hex colors like "#3B82F6" for blue solutions.
Only respond with valid JSON, no additional text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    const reactionData = JSON.parse(text.trim());

    // Validate the response structure
    if (reactionData.occurred && reactionData.type !== "no_reaction") {
      return {
        occurred: reactionData.occurred,
        type: reactionData.type,
        equation: reactionData.equation,
        products: reactionData.products || [],
        observations: reactionData.observations || [],
        liquidColor: reactionData.liquidColor || "#CBD5E1",
        energyChange: reactionData.energyChange || "neutral",
        explanation: reactionData.explanation || "Reaction predicted by AI",
      };
    }

    return null;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return null;
  }
}

export async function predictReaction(
  chemicals: Chemical[]
): Promise<ReactionResult> {
  const noReaction: ReactionResult = {
    occurred: false,
    type: "no_reaction",
    equation: "No reaction",
    products: [],
    observations: ["No observable change"],
    liquidColor: getLiquidColor(
      chemicals.filter((c) => c.cation).map((c) => c.cation!)
    ),
    energyChange: "neutral",
    explanation: "The chemicals do not react under these conditions.",
  };

  if (chemicals.length < 2) return noReaction;

  const metals = chemicals.filter((c) => c.type === "metal");
  const nonmetals = chemicals.filter((c) => c.type === "nonmetal");
  const salts = chemicals.filter((c) => c.type === "salt");
  const acids = chemicals.filter((c) => c.type === "acid");
  const bases = chemicals.filter((c) => c.type === "base");
  const molecules = chemicals.filter((c) => c.type === "molecule");
  const oxides = chemicals.filter((c) => c.type === "oxide");

  // Molecular Reactions - Expanded
  if (molecules.length >= 2) {
    // Photosynthesis: CO2 + H2O → glucose + O2 (simplified)
    const co2 = molecules.find((m) => m.formula === "CO₂");
    const h2o = molecules.find((m) => m.formula === "H₂O");

    if (co2 && h2o) {
      return {
        occurred: true,
        type: "photosynthesis",
        equation: "6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂",
        products: ["C₆H₁₂O₆", "O₂"],
        observations: [
          "Photosynthesis reaction",
          "Requires light energy",
          "Produces glucose and oxygen",
        ],
        liquidColor: "#10B981", // Green for photosynthesis
        energyChange: "endothermic",
        explanation:
          "Carbon dioxide and water undergo photosynthesis in the presence of light to produce glucose and oxygen.",
      };
    }

    // Combustion reactions - Expanded
    const o2 = molecules.find((m) => m.formula === "O₂");
    const ch4 = molecules.find((m) => m.formula === "CH₄");
    const ethanol = molecules.find((m) => m.formula === "C₂H₅OH");
    const ethene = molecules.find((m) => m.formula === "C₂H₄");
    const h2 = molecules.find((m) => m.formula === "H₂");
    const co = molecules.find((m) => m.formula === "CO");

    if (ch4 && o2) {
      return {
        occurred: true,
        type: "combustion",
        equation: "CH₄ + 2O₂ → CO₂ + 2H₂O",
        products: ["CO₂", "H₂O"],
        observations: [
          "Combustion reaction",
          "Heat and light produced",
          "Blue flame observed",
        ],
        liquidColor: "#F59E0B", // Orange for combustion
        energyChange: "exothermic",
        explanation:
          "Methane undergoes combustion with oxygen to produce carbon dioxide and water.",
      };
    }

    if (ethanol && o2) {
      return {
        occurred: true,
        type: "combustion",
        equation: "C₂H₅OH + 3O₂ → 2CO₂ + 3H₂O",
        products: ["CO₂", "H₂O"],
        observations: ["Combustion of ethanol", "Blue flame", "Produces heat"],
        liquidColor: "#F59E0B",
        energyChange: "exothermic",
        explanation: "Ethanol undergoes combustion with oxygen.",
      };
    }

    if (ethene && o2) {
      return {
        occurred: true,
        type: "combustion",
        equation: "C₂H₄ + 3O₂ → 2CO₂ + 2H₂O",
        products: ["CO₂", "H₂O"],
        observations: ["Combustion of ethene", "Bright flame", "Produces heat"],
        liquidColor: "#F59E0B",
        energyChange: "exothermic",
        explanation: "Ethene undergoes combustion with oxygen.",
      };
    }

    if (h2 && o2) {
      return {
        occurred: true,
        type: "combustion",
        equation: "2H₂ + O₂ → 2H₂O",
        products: ["H₂O"],
        observations: [
          "Hydrogen combustion",
          "Explosive reaction",
          "Produces water vapor",
        ],
        liquidColor: "#F59E0B",
        energyChange: "exothermic",
        explanation:
          "Hydrogen undergoes explosive combustion with oxygen to form water.",
      };
    }

    if (co && o2) {
      return {
        occurred: true,
        type: "combustion",
        equation: "2CO + O₂ → 2CO₂",
        products: ["CO₂"],
        observations: [
          "Carbon monoxide combustion",
          "Blue flame",
          "Toxic gas reaction",
        ],
        liquidColor: "#F59E0B",
        energyChange: "exothermic",
        explanation: "Carbon monoxide burns to form carbon dioxide.",
      };
    }

    // Acid-base with ammonia
    const nh3 = molecules.find((m) => m.formula === "NH₃");
    const hcl = acids.find((a) => a.formula === "HCl");

    if (nh3 && hcl) {
      return {
        occurred: true,
        type: "neutralization",
        equation: "NH₃ + HCl → NH₄Cl",
        products: ["NH₄Cl"],
        observations: [
          "Neutralization reaction",
          "White fumes produced",
          "Heat released",
        ],
        liquidColor: "#CBD5E1",
        energyChange: "exothermic",
        explanation:
          "Ammonia reacts with hydrochloric acid to form ammonium chloride.",
      };
    }

    // Haber process: N2 + H2 → NH3 (simplified)
    const n2 = molecules.find((m) => m.formula === "N₂");
    if (n2 && h2) {
      return {
        occurred: true,
        type: "synthesis",
        equation: "N₂ + 3H₂ ⇌ 2NH₃",
        products: ["NH₃"],
        observations: [
          "Haber process",
          "Requires high pressure and temperature",
          "Reversible reaction",
        ],
        liquidColor: "#CBD5E1",
        energyChange: "exothermic",
        explanation:
          "Nitrogen and hydrogen react to form ammonia in the Haber process.",
      };
    }
  }

  // Acid-Metal Reactions - Expanded
  if (acids.length > 0 && metals.length > 0) {
    const acid = acids[0];
    const metal = metals[0];

    // Reactive metals (above hydrogen in reactivity series) react with acids
    const metalRank = getReactivityRank(metal.formula);
    const hydrogenRank = getReactivityRank("H");

    if (metalRank < hydrogenRank) {
      // Specific reactions for different metals and acids
      if (metal.formula === "Mg" && acid.formula === "HCl") {
        return {
          occurred: true,
          type: "displacement",
          equation: "Mg + 2HCl → MgCl₂ + H₂",
          products: ["MgCl₂", "H₂"],
          observations: [
            "Vigorous bubbling",
            "Hydrogen gas evolved rapidly",
            "Metal dissolves with effervescence",
          ],
          liquidColor: ION_COLORS["Mg2+"] || "#CBD5E1",
          gasProduced: { name: "Hydrogen", formula: "H₂" },
          energyChange: "exothermic",
          explanation:
            "Magnesium reacts with hydrochloric acid to produce magnesium chloride and hydrogen gas.",
        };
      }

      if (metal.formula === "Zn" && acid.formula === "H₂SO₄") {
        return {
          occurred: true,
          type: "displacement",
          equation: "Zn + H₂SO₄ → ZnSO₄ + H₂",
          products: ["ZnSO₄", "H₂"],
          observations: [
            "Steady evolution of hydrogen gas",
            "Metal dissolves gradually",
            "Slight warming observed",
          ],
          liquidColor: ION_COLORS["Zn2+"] || "#CBD5E1",
          gasProduced: { name: "Hydrogen", formula: "H₂" },
          energyChange: "exothermic",
          explanation:
            "Zinc reacts with sulfuric acid to produce zinc sulfate and hydrogen gas.",
        };
      }

      if (metal.formula === "Fe" && acid.formula === "H₂SO₄") {
        return {
          occurred: true,
          type: "displacement",
          equation: "Fe + H₂SO₄ → FeSO₄ + H₂",
          products: ["FeSO₄", "H₂"],
          observations: [
            "Slow reaction",
            "Pale green solution forms",
            "Hydrogen gas bubbles",
          ],
          liquidColor: ION_COLORS["Fe2+"] || "#CBD5E1",
          gasProduced: { name: "Hydrogen", formula: "H₂" },
          energyChange: "exothermic",
          explanation:
            "Iron reacts with dilute sulfuric acid to produce iron(II) sulfate and hydrogen gas.",
        };
      }

      if (metal.formula === "Ca" && acid.formula === "HCl") {
        return {
          occurred: true,
          type: "displacement",
          equation: "Ca + 2HCl → CaCl₂ + H₂",
          products: ["CaCl₂", "H₂"],
          observations: [
            "Rapid reaction",
            "Heat released",
            "Hydrogen gas produced vigorously",
          ],
          liquidColor: ION_COLORS["Ca2+"] || "#CBD5E1",
          gasProduced: { name: "Hydrogen", formula: "H₂" },
          energyChange: "exothermic",
          explanation:
            "Calcium reacts with hydrochloric acid to produce calcium chloride and hydrogen gas.",
        };
      }

      if (metal.formula === "Na" && acid.formula === "HCl") {
        return {
          occurred: true,
          type: "displacement",
          equation: "2Na + 2HCl → 2NaCl + H₂",
          products: ["NaCl", "H₂"],
          observations: [
            "Very vigorous reaction",
            "Heat and light produced",
            "Sodium melts and reacts violently",
          ],
          liquidColor: ION_COLORS["Na+"] || "#CBD5E1",
          gasProduced: { name: "Hydrogen", formula: "H₂" },
          energyChange: "exothermic",
          explanation:
            "Sodium reacts violently with hydrochloric acid to produce sodium chloride and hydrogen gas.",
        };
      }

      // General case for other reactive metals
      return {
        occurred: true,
        type: "displacement",
        equation: `${metal.formula} + 2${acid.formula} → ${metal.formula}${acid.anion}₂ + H₂`,
        products: [`${metal.formula}${acid.anion}₂`, "H₂"],
        observations: [
          "Bubbles of hydrogen gas produced",
          "Metal dissolves",
          "Heat released",
        ],
        liquidColor: ION_COLORS[metal.formula + "2+"] || "#CBD5E1",
        gasProduced: { name: "Hydrogen", formula: "H₂" },
        energyChange: "exothermic",
        explanation:
          "Reactive metal reacts with acid to produce salt and hydrogen gas.",
      };
    }

    // Less reactive metals can still react with concentrated acids
    if (metal.formula === "Cu" && acid.formula === "H₂SO₄") {
      return {
        occurred: true,
        type: "displacement",
        equation: "Cu + H₂SO₄ → CuSO₄ + H₂",
        products: ["CuSO₄", "H₂"],
        observations: [
          "Slow reaction with concentrated acid",
          "Blue copper sulfate solution forms",
          "Hydrogen gas produced",
        ],
        liquidColor: ION_COLORS["Cu2+"] || "#3B82F6",
        gasProduced: { name: "Hydrogen", formula: "H₂" },
        energyChange: "exothermic",
        explanation:
          "Copper reacts with concentrated sulfuric acid to produce copper sulfate and hydrogen gas.",
      };
    }
  }

  // Acid-Carbonate Reactions
  if (acids.length > 0 && molecules.length > 0) {
    const acid = acids[0];
    const carbonate = molecules.find(
      (m) =>
        m.formula.includes("CO₃") || m.name.toLowerCase().includes("carbonate")
    );

    if (carbonate) {
      // Copper carbonate + sulfuric acid → copper sulfate + carbon dioxide + water
      if (carbonate.formula === "CuCO₃" && acid.formula === "H₂SO₄") {
        return {
          occurred: true,
          type: "neutralization",
          equation: "CuCO₃ + H₂SO₄ → CuSO₄ + CO₂ + H₂O",
          products: ["CuSO₄", "CO₂", "H₂O"],
          observations: [
            "Green copper carbonate dissolves",
            "Blue copper sulfate solution forms",
            "Bubbles of carbon dioxide gas",
            "Effervescence observed",
          ],
          liquidColor: ION_COLORS["Cu2+"] || "#3B82F6",
          gasProduced: { name: "Carbon Dioxide", formula: "CO₂" },
          energyChange: "exothermic",
          explanation:
            "Copper carbonate reacts with sulfuric acid to produce copper sulfate, carbon dioxide, and water.",
        };
      }

      return {
        occurred: true,
        type: "neutralization",
        equation: `${acid.formula} + ${carbonate.formula} → Salt + CO₂ + H₂O`,
        products: ["Salt", "CO₂", "H₂O"],
        observations: [
          "Bubbles of carbon dioxide gas produced",
          "Effervescence observed",
          "Solid dissolves",
        ],
        liquidColor: "#CBD5E1",
        gasProduced: { name: "Carbon Dioxide", formula: "CO₂" },
        energyChange: "exothermic",
        explanation:
          "Acid reacts with carbonate to produce salt, carbon dioxide, and water.",
      };
    }
  }

  // Acid-Oxide Reactions
  if (acids.length > 0 && oxides.length > 0) {
    const acid = acids[0];
    const oxide = oxides[0];

    // Copper oxide + sulfuric acid → copper sulfate + water
    if (oxide.formula === "CuO" && acid.formula === "H₂SO₄") {
      return {
        occurred: true,
        type: "neutralization",
        equation: "CuO + H₂SO₄ → CuSO₄ + H₂O",
        products: ["CuSO₄", "H₂O"],
        observations: [
          "Black copper oxide dissolves",
          "Blue copper sulfate solution forms",
          "Heat released",
        ],
        liquidColor: ION_COLORS["Cu2+"] || "#3B82F6",
        energyChange: "exothermic",
        explanation:
          "Copper oxide reacts with sulfuric acid to produce copper sulfate and water.",
      };
    }

    // General acid + oxide reaction
    if (acid.formula === "H₂SO₄" && oxide.formula.includes("O")) {
      const metal = oxide.formula.replace("O", "").replace(/[₂₃]/g, "");
      return {
        occurred: true,
        type: "neutralization",
        equation: `${oxide.formula} + ${acid.formula} → ${metal}SO₄ + H₂O`,
        products: [`${metal}SO₄`, "H₂O"],
        observations: [
          "Oxide dissolves in acid",
          "Salt solution forms",
          "Heat released",
        ],
        liquidColor: ION_COLORS[metal + "2+"] || "#CBD5E1",
        energyChange: "exothermic",
        explanation:
          "Metal oxide reacts with sulfuric acid to produce metal sulfate and water.",
      };
    }
  }

  // Precipitation Reactions - Expanded
  if (salts.length >= 2) {
    const salt1 = salts[0];
    const salt2 = salts[1];

    // Common precipitation reactions - expanded
    if (
      (salt1.cation === "Ag+" && salt2.anion === "Cl-") ||
      (salt2.cation === "Ag+" && salt1.anion === "Cl-")
    ) {
      return {
        occurred: true,
        type: "precipitation",
        equation: "Ag⁺ + Cl⁻ → AgCl",
        products: ["AgCl"],
        observations: [
          "White precipitate forms",
          "Cloudy solution",
          "Silver chloride precipitate",
        ],
        liquidColor: "#CBD5E1",
        precipitate: {
          name: "Silver Chloride",
          color: "#F5F5F5",
          formula: "AgCl",
        },
        energyChange: "exothermic",
        explanation:
          "Silver ions react with chloride ions to form insoluble silver chloride.",
      };
    }

    if (
      (salt1.cation === "Ba2+" && salt2.anion === "SO4_2-") ||
      (salt2.cation === "Ba2+" && salt1.anion === "SO4_2-")
    ) {
      return {
        occurred: true,
        type: "precipitation",
        equation: "Ba²⁺ + SO₄²⁻ → BaSO₄",
        products: ["BaSO₄"],
        observations: [
          "White precipitate forms",
          "Barium sulfate precipitate",
          "Insoluble in water",
        ],
        liquidColor: "#CBD5E1",
        precipitate: {
          name: "Barium Sulfate",
          color: "#FFFFFF",
          formula: "BaSO₄",
        },
        energyChange: "exothermic",
        explanation:
          "Barium ions react with sulfate ions to form insoluble barium sulfate.",
      };
    }

    if (
      (salt1.cation === "Pb2+" && salt2.anion === "I-") ||
      (salt2.cation === "Pb2+" && salt1.anion === "I-")
    ) {
      return {
        occurred: true,
        type: "precipitation",
        equation: "Pb²⁺ + 2I⁻ → PbI₂",
        products: ["PbI₂"],
        observations: [
          "Golden yellow precipitate forms",
          "Lead iodide precipitate",
          "Beautiful yellow crystals",
        ],
        liquidColor: "#CBD5E1",
        precipitate: { name: "Lead Iodide", color: "#FDE047", formula: "PbI₂" },
        energyChange: "exothermic",
        explanation:
          "Lead ions react with iodide ions to form insoluble lead iodide.",
      };
    }

    // Additional precipitation reactions
    if (
      (salt1.cation === "Ca2+" && salt2.anion === "CO3_2-") ||
      (salt2.cation === "Ca2+" && salt1.anion === "CO3_2-")
    ) {
      return {
        occurred: true,
        type: "precipitation",
        equation: "Ca²⁺ + CO₃²⁻ → CaCO₃",
        products: ["CaCO₃"],
        observations: [
          "White precipitate forms",
          "Calcium carbonate precipitate",
          "Milk of lime reaction",
        ],
        liquidColor: "#CBD5E1",
        precipitate: {
          name: "Calcium Carbonate",
          color: "#FFFFFF",
          formula: "CaCO₃",
        },
        energyChange: "exothermic",
        explanation:
          "Calcium ions react with carbonate ions to form insoluble calcium carbonate.",
      };
    }

    if (
      (salt1.cation === "Mg2+" && salt2.anion === "OH-") ||
      (salt2.cation === "Mg2+" && salt1.anion === "OH-")
    ) {
      return {
        occurred: true,
        type: "precipitation",
        equation: "Mg²⁺ + 2OH⁻ → Mg(OH)₂",
        products: ["Mg(OH)₂"],
        observations: [
          "White precipitate forms",
          "Magnesium hydroxide precipitate",
          "Milk of magnesia",
        ],
        liquidColor: "#CBD5E1",
        precipitate: {
          name: "Magnesium Hydroxide",
          color: "#FFFFFF",
          formula: "Mg(OH)₂",
        },
        energyChange: "exothermic",
        explanation:
          "Magnesium ions react with hydroxide ions to form insoluble magnesium hydroxide.",
      };
    }

    if (
      (salt1.cation === "Fe3+" && salt2.anion === "OH-") ||
      (salt2.cation === "Fe3+" && salt1.anion === "OH-")
    ) {
      return {
        occurred: true,
        type: "precipitation",
        equation: "Fe³⁺ + 3OH⁻ → Fe(OH)₃",
        products: ["Fe(OH)₃"],
        observations: [
          "Reddish-brown precipitate forms",
          "Iron(III) hydroxide precipitate",
          "Rust-like appearance",
        ],
        liquidColor: "#CBD5E1",
        precipitate: {
          name: "Iron(III) Hydroxide",
          color: "#92400E",
          formula: "Fe(OH)₃",
        },
        energyChange: "exothermic",
        explanation:
          "Iron(III) ions react with hydroxide ions to form insoluble iron(III) hydroxide.",
      };
    }

    if (
      (salt1.cation === "Cu2+" && salt2.anion === "OH-") ||
      (salt2.cation === "Cu2+" && salt1.anion === "OH-")
    ) {
      return {
        occurred: true,
        type: "precipitation",
        equation: "Cu²⁺ + 2OH⁻ → Cu(OH)₂",
        products: ["Cu(OH)₂"],
        observations: [
          "Blue precipitate forms",
          "Copper(II) hydroxide precipitate",
          "Light blue gelatinous precipitate",
        ],
        liquidColor: "#CBD5E1",
        precipitate: {
          name: "Copper(II) Hydroxide",
          color: "#0EA5E9",
          formula: "Cu(OH)₂",
        },
        energyChange: "exothermic",
        explanation:
          "Copper(II) ions react with hydroxide ions to form insoluble copper(II) hydroxide.",
      };
    }

    if (
      (salt1.cation === "Pb2+" && salt2.anion === "SO4_2-") ||
      (salt2.cation === "Pb2+" && salt1.anion === "SO4_2-")
    ) {
      return {
        occurred: true,
        type: "precipitation",
        equation: "Pb²⁺ + SO₄²⁻ → PbSO₄",
        products: ["PbSO₄"],
        observations: [
          "White precipitate forms",
          "Lead sulfate precipitate",
          "Insoluble in water",
        ],
        liquidColor: "#CBD5E1",
        precipitate: {
          name: "Lead Sulfate",
          color: "#FFFFFF",
          formula: "PbSO₄",
        },
        energyChange: "exothermic",
        explanation:
          "Lead ions react with sulfate ions to form insoluble lead sulfate.",
      };
    }
  }

  // Redox Reactions - Expanded
  if (metals.length > 0 && molecules.length > 0) {
    const metal = metals[0];
    const oxygen = molecules.find((m) => m.formula === "O₂");

    // Metal + Oxygen reactions (combustion) - expanded
    if (oxygen) {
      const metalOxides: Record<
        string,
        { formula: string; name: string; color: string; observations: string[] }
      > = {
        Mg: {
          formula: "MgO",
          name: "Magnesium Oxide",
          color: "#F3F4F6",
          observations: [
            "Bright white light",
            "White powder forms",
            "Metal burns intensely",
          ],
        },
        Al: {
          formula: "Al₂O₃",
          name: "Aluminum Oxide",
          color: "#F3F4F6",
          observations: [
            "Bright white light",
            "White powder forms",
            "Protective oxide layer",
          ],
        },
        Fe: {
          formula: "Fe₂O₃",
          name: "Iron(III) Oxide",
          color: "#92400E",
          observations: [
            "Sparks produced",
            "Red-brown powder forms",
            "Rust formation",
          ],
        },
        Cu: {
          formula: "CuO",
          name: "Copper(II) Oxide",
          color: "#111827",
          observations: ["Green flame", "Black powder forms", "Copper oxide"],
        },
        Zn: {
          formula: "ZnO",
          name: "Zinc Oxide",
          color: "#F3F4F6",
          observations: [
            "Yellow-green flame",
            "White powder forms",
            "Zinc oxide",
          ],
        },
        Ca: {
          formula: "CaO",
          name: "Calcium Oxide",
          color: "#F3F4F6",
          observations: [
            "Bright white light",
            "White powder forms",
            "Quicklime",
          ],
        },
        Na: {
          formula: "Na₂O",
          name: "Sodium Oxide",
          color: "#F3F4F6",
          observations: [
            "Violent reaction",
            "White powder forms",
            "Sodium oxide",
          ],
        },
        K: {
          formula: "K₂O",
          name: "Potassium Oxide",
          color: "#F3F4F6",
          observations: [
            "Violent reaction",
            "White powder forms",
            "Potassium oxide",
          ],
        },
        Li: {
          formula: "Li₂O",
          name: "Lithium Oxide",
          color: "#F3F4F6",
          observations: [
            "Bright red flame",
            "White powder forms",
            "Lithium oxide",
          ],
        },
        Pb: {
          formula: "PbO",
          name: "Lead(II) Oxide",
          color: "#92400E",
          observations: ["Red glow", "Yellow powder forms", "Lead oxide"],
        },
        Sn: {
          formula: "SnO₂",
          name: "Tin(IV) Oxide",
          color: "#F3F4F6",
          observations: ["White powder forms", "Tin oxide", "Stable oxide"],
        },
      };

      const oxideInfo = metalOxides[metal.formula];
      if (oxideInfo) {
        const equation =
          metal.formula === "Al" || metal.formula === "Fe"
            ? `4${metal.formula} + 3O₂ → 2${oxideInfo.formula}`
            : metal.formula === "Na" ||
              metal.formula === "K" ||
              metal.formula === "Li"
            ? `4${metal.formula} + O₂ → 2${oxideInfo.formula}`
            : `2${metal.formula} + O₂ → ${oxideInfo.formula}`;

        return {
          occurred: true,
          type: "combustion",
          equation: equation,
          products: [oxideInfo.formula],
          observations: [
            "Metal combustion",
            "Heat and light produced",
            ...oxideInfo.observations,
          ],
          liquidColor: "#CBD5E1",
          energyChange: "exothermic",
          explanation: `${metal.name} undergoes combustion with oxygen to form ${oxideInfo.name}.`,
        };
      }
    }

    // Metal + Halogen reactions
    const halogen = molecules.find((m) =>
      ["F2", "Cl2", "Br2", "I2"].includes(m.formula)
    );

    if (halogen) {
      const halogenProducts: Record<
        string,
        Record<string, { formula: string; name: string }>
      > = {
        F2: {
          Na: { formula: "NaF", name: "Sodium Fluoride" },
          K: { formula: "KF", name: "Potassium Fluoride" },
          Ca: { formula: "CaF₂", name: "Calcium Fluoride" },
          Mg: { formula: "MgF₂", name: "Magnesium Fluoride" },
          Al: { formula: "AlF₃", name: "Aluminum Fluoride" },
        },
        Cl2: {
          Na: { formula: "NaCl", name: "Sodium Chloride" },
          K: { formula: "KCl", name: "Potassium Chloride" },
          Ca: { formula: "CaCl₂", name: "Calcium Chloride" },
          Mg: { formula: "MgCl₂", name: "Magnesium Chloride" },
          Fe: { formula: "FeCl₃", name: "Iron(III) Chloride" },
          Cu: { formula: "CuCl₂", name: "Copper(II) Chloride" },
        },
        Br2: {
          Na: { formula: "NaBr", name: "Sodium Bromide" },
          K: { formula: "KBr", name: "Potassium Bromide" },
          Ca: { formula: "CaBr₂", name: "Calcium Bromide" },
          Mg: { formula: "MgBr₂", name: "Magnesium Bromide" },
        },
        I2: {
          Na: { formula: "NaI", name: "Sodium Iodide" },
          K: { formula: "KI", name: "Potassium Iodide" },
          Ca: { formula: "CaI₂", name: "Calcium Iodide" },
          Pb: { formula: "PbI₂", name: "Lead(II) Iodide" },
        },
      };

      const halogenKey = halogen.formula as keyof typeof halogenProducts;
      const metalProduct = halogenProducts[halogenKey]?.[metal.formula];

      if (metalProduct) {
        const equation =
          metal.formula === "Al" && halogen.formula === "F2"
            ? `2${metal.formula} + 3${halogen.formula} → 2${metalProduct.formula}`
            : metal.formula === "Fe" && halogen.formula === "Cl2"
            ? `2${metal.formula} + 3${halogen.formula} → 2${metalProduct.formula}`
            : `2${metal.formula} + ${halogen.formula} → 2${metalProduct.formula}`;

        return {
          occurred: true,
          type: "synthesis",
          equation: equation,
          products: [metalProduct.formula],
          observations: [
            `Metal reacts with ${halogen.name.toLowerCase()}`,
            "Heat and light produced",
            `${metalProduct.name} forms`,
          ],
          liquidColor: "#CBD5E1",
          energyChange: "exothermic",
          explanation: `${
            metal.name
          } reacts with ${halogen.name.toLowerCase()} to form ${
            metalProduct.name
          }.`,
        };
      }
    }
  }

  // Decomposition Reactions - Expanded
  if (molecules.length === 1) {
    const molecule = molecules[0];

    // Hydrogen peroxide decomposition
    if (molecule.formula === "H₂O₂") {
      return {
        occurred: true,
        type: "decomposition",
        equation: "2H₂O₂ → 2H₂O + O₂",
        products: ["H₂O", "O₂"],
        observations: [
          "Bubbles of oxygen gas produced",
          "Effervescence observed",
          "Catalytic decomposition",
        ],
        liquidColor: "#CBD5E1",
        gasProduced: { name: "Oxygen", formula: "O₂" },
        energyChange: "exothermic",
        explanation: "Hydrogen peroxide decomposes into water and oxygen gas.",
      };
    }

    // Carbonate decomposition (thermal)
    if (
      molecule.formula.includes("CO₃") &&
      molecule.name.toLowerCase().includes("carbonate")
    ) {
      return {
        occurred: true,
        type: "decomposition",
        equation: `${molecule.formula} → Metal Oxide + CO₂`,
        products: ["Metal Oxide", "CO₂"],
        observations: [
          "Carbon dioxide gas evolved",
          "Solid residue remains",
          "Thermal decomposition",
        ],
        liquidColor: "#CBD5E1",
        gasProduced: { name: "Carbon Dioxide", formula: "CO₂" },
        energyChange: "endothermic",
        explanation:
          "Carbonate decomposes upon heating to form metal oxide and carbon dioxide.",
      };
    }

    // Chlorate decomposition
    if (molecule.formula.includes("ClO₃")) {
      return {
        occurred: true,
        type: "decomposition",
        equation: `2${molecule.formula} → 2${molecule.formula.replace(
          "ClO₃",
          "Cl"
        )} + 3O₂`,
        products: [molecule.formula.replace("ClO₃", "Cl"), "O₂"],
        observations: [
          "Oxygen gas evolved rapidly",
          "May be explosive",
          "Heat released",
        ],
        liquidColor: "#CBD5E1",
        gasProduced: { name: "Oxygen", formula: "O₂" },
        energyChange: "exothermic",
        explanation: "Chlorate decomposes to form chloride and oxygen gas.",
      };
    }

    // Nitrate decomposition
    if (molecule.formula.includes("NO₃") && !molecule.formula.includes("H")) {
      return {
        occurred: true,
        type: "decomposition",
        equation: `2${molecule.formula} → 2${molecule.formula.replace(
          "NO₃",
          "O"
        )} + 4NO₂ + O₂`,
        products: [molecule.formula.replace("NO₃", "O"), "NO₂", "O₂"],
        observations: [
          "Brown fumes of NO₂ produced",
          "Oxygen gas evolved",
          "Thermal decomposition",
        ],
        liquidColor: "#CBD5E1",
        gasProduced: { name: "Nitrogen Dioxide", formula: "NO₂" },
        energyChange: "exothermic",
        explanation:
          "Nitrate decomposes to form metal oxide, nitrogen dioxide, and oxygen.",
      };
    }

    // Hydroxide decomposition (thermal)
    if (molecule.formula.includes("OH") && molecule.formula.includes("(")) {
      const metalMatch = molecule.formula.match(
        /^([A-Z][a-z]?)(\(OH\)_2|\(OH\)_3)$/
      );
      if (metalMatch) {
        const metal = metalMatch[1];
        const oxideFormula = metal + (metalMatch[2] === "(OH)₂" ? "O" : "₂O₃");
        return {
          occurred: true,
          type: "decomposition",
          equation: `${molecule.formula} → ${oxideFormula} + H₂O`,
          products: [oxideFormula, "H₂O"],
          observations: [
            "Water vapor produced",
            "Metal oxide residue",
            "Thermal decomposition",
          ],
          liquidColor: "#CBD5E1",
          gasProduced: { name: "Water Vapor", formula: "H₂O" },
          energyChange: "endothermic",
          explanation:
            "Hydroxide decomposes upon heating to form metal oxide and water.",
        };
      }
    }
  }

  // Synthesis Reactions (Combination) - Expanded
  if (metals.length > 0 && nonmetals.length > 0) {
    const metal = metals[0];
    const nonmetal = nonmetals[0];

    // Metal + Nonmetal → Ionic Compound - expanded
    if (metal.formula === "Na" && nonmetal.formula === "Cl") {
      return {
        occurred: true,
        type: "synthesis",
        equation: "2Na + Cl₂ → 2NaCl",
        products: ["NaCl"],
        observations: [
          "Violent reaction",
          "Heat and light produced",
          "White solid forms",
        ],
        liquidColor: "#CBD5E1",
        energyChange: "exothermic",
        explanation:
          "Sodium metal reacts violently with chlorine gas to form sodium chloride.",
      };
    }

    if (metal.formula === "Mg" && nonmetal.formula === "O") {
      return {
        occurred: true,
        type: "synthesis",
        equation: "2Mg + O₂ → 2MgO",
        products: ["MgO"],
        observations: [
          "Bright white light produced",
          "White powder forms",
          "Metal burns in oxygen",
        ],
        liquidColor: "#CBD5E1",
        energyChange: "exothermic",
        explanation: "Magnesium burns in oxygen to form magnesium oxide.",
      };
    }

    if (metal.formula === "Ca" && nonmetal.formula === "O") {
      return {
        occurred: true,
        type: "synthesis",
        equation: "2Ca + O₂ → 2CaO",
        products: ["CaO"],
        observations: [
          "Bright white light produced",
          "White powder forms",
          "Calcium burns in oxygen",
        ],
        liquidColor: "#CBD5E1",
        energyChange: "exothermic",
        explanation: "Calcium burns in oxygen to form calcium oxide.",
      };
    }

    if (metal.formula === "Al" && nonmetal.formula === "O") {
      return {
        occurred: true,
        type: "synthesis",
        equation: "4Al + 3O₂ → 2Al₂O₃",
        products: ["Al₂O₃"],
        observations: [
          "Intense white light produced",
          "White powder forms",
          "Aluminum burns in oxygen",
        ],
        liquidColor: "#CBD5E1",
        energyChange: "exothermic",
        explanation: "Aluminum burns in oxygen to form aluminum oxide.",
      };
    }

    if (metal.formula === "Fe" && nonmetal.formula === "S") {
      return {
        occurred: true,
        type: "synthesis",
        equation: "Fe + S → FeS",
        products: ["FeS"],
        observations: ["Heat produced", "Black solid forms", "Iron sulfide"],
        liquidColor: "#CBD5E1",
        energyChange: "exothermic",
        explanation: "Iron reacts with sulfur to form iron(II) sulfide.",
      };
    }

    if (metal.formula === "Cu" && nonmetal.formula === "S") {
      return {
        occurred: true,
        type: "synthesis",
        equation: "Cu + S → CuS",
        products: ["CuS"],
        observations: ["Heat produced", "Black solid forms", "Copper sulfide"],
        liquidColor: "#CBD5E1",
        energyChange: "exothermic",
        explanation: "Copper reacts with sulfur to form copper(II) sulfide.",
      };
    }

    if (metal.formula === "Zn" && nonmetal.formula === "S") {
      return {
        occurred: true,
        type: "synthesis",
        equation: "Zn + S → ZnS",
        products: ["ZnS"],
        observations: ["Heat produced", "White solid forms", "Zinc sulfide"],
        liquidColor: "#CBD5E1",
        energyChange: "exothermic",
        explanation: "Zinc reacts with sulfur to form zinc sulfide.",
      };
    }

    // General synthesis for other metal-nonmetal combinations
    if (
      ["Na", "K", "Ca", "Mg", "Al", "Zn", "Fe", "Cu"].includes(metal.formula) &&
      ["O", "S", "N", "P", "Cl", "Br", "I"].includes(nonmetal.formula)
    ) {
      const productFormula = getSynthesisProduct(
        metal.formula,
        nonmetal.formula
      );
      if (productFormula) {
        return {
          occurred: true,
          type: "synthesis",
          equation: `${metal.formula} + ${nonmetal.formula} → ${productFormula}`,
          products: [productFormula],
          observations: [
            "Synthesis reaction",
            "Heat produced",
            "New compound forms",
          ],
          liquidColor: "#CBD5E1",
          energyChange: "exothermic",
          explanation: `${metal.name} reacts with ${nonmetal.name} to form a new compound.`,
        };
      }
    }
  }

  // Diatomic Halogen Reactions with Metals
  if (metals.length > 0 && molecules.length > 0) {
    const metal = metals[0];
    const halogen = molecules.find((m) =>
      ["F2", "Cl2", "Br2", "I2"].includes(m.formula)
    );

    if (halogen) {
      const halogenName = halogen.formula.replace("2", "").toLowerCase();
      const productFormula =
        metal.formula +
        halogen.formula.replace(
          "2",
          metal.formula === "Na" || metal.formula === "K" ? "" : "2"
        );

      return {
        occurred: true,
        type: "synthesis",
        equation: `${metal.formula} + ${halogen.formula} → ${productFormula}`,
        products: [productFormula],
        observations: [
          `Metal reacts with ${halogen.name.toLowerCase()}`,
          "Heat and light produced",
          "Halide salt forms",
        ],
        liquidColor: "#CBD5E1",
        energyChange: "exothermic",
        explanation: `${
          metal.name
        } reacts with diatomic ${halogen.name.toLowerCase()} to form ${metal.name.toLowerCase()} ${halogenName}ide.`,
      };
    }
  }

  // Double Displacement Reactions - Expanded
  if (salts.length === 2) {
    const salt1 = salts[0];
    const salt2 = salts[1];

    // Acid-Base neutralization (already handled above)
    // But also other double displacement reactions

    // Example: NaCl + AgNO3 → NaNO3 + AgCl
    if (
      (salt1.cation === "Na+" &&
        salt1.anion === "Cl-" &&
        salt2.cation === "Ag+" &&
        salt2.anion === "NO3-") ||
      (salt2.cation === "Na+" &&
        salt2.anion === "Cl-" &&
        salt1.cation === "Ag+" &&
        salt1.anion === "NO3-")
    ) {
      return {
        occurred: true,
        type: "precipitation",
        equation: "NaCl + AgNO₃ → NaNO₃ + AgCl",
        products: ["NaNO₃", "AgCl"],
        observations: [
          "White precipitate forms",
          "Silver chloride precipitate",
          "Solution becomes cloudy",
        ],
        liquidColor: "#CBD5E1",
        precipitate: {
          name: "Silver Chloride",
          color: "#F5F5F5",
          formula: "AgCl",
        },
        energyChange: "exothermic",
        explanation:
          "Sodium chloride and silver nitrate undergo double displacement reaction forming silver chloride precipitate.",
      };
    }

    // More double displacement reactions
    // Na2SO4 + BaCl2 → BaSO4 + 2NaCl
    if (
      (salt1.cation === "Na+" &&
        salt1.anion === "SO4_2-" &&
        salt2.cation === "Ba2+" &&
        salt2.anion === "Cl-") ||
      (salt2.cation === "Na+" &&
        salt2.anion === "SO4_2-" &&
        salt1.cation === "Ba2+" &&
        salt1.anion === "Cl-")
    ) {
      return {
        occurred: true,
        type: "precipitation",
        equation: "Na₂SO₄ + BaCl₂ → BaSO₄ + 2NaCl",
        products: ["BaSO₄", "NaCl"],
        observations: [
          "White precipitate forms",
          "Barium sulfate precipitate",
          "Insoluble in water",
        ],
        liquidColor: "#CBD5E1",
        precipitate: {
          name: "Barium Sulfate",
          color: "#FFFFFF",
          formula: "BaSO₄",
        },
        energyChange: "exothermic",
        explanation:
          "Sodium sulfate and barium chloride undergo double displacement forming barium sulfate precipitate.",
      };
    }

    // Na2CO3 + CaCl2 → CaCO3 + 2NaCl
    if (
      (salt1.cation === "Na+" &&
        salt1.anion === "CO3_2-" &&
        salt2.cation === "Ca2+" &&
        salt2.anion === "Cl-") ||
      (salt2.cation === "Na+" &&
        salt2.anion === "CO3_2-" &&
        salt1.cation === "Ca2+" &&
        salt1.anion === "Cl-")
    ) {
      return {
        occurred: true,
        type: "precipitation",
        equation: "Na₂CO₃ + CaCl₂ → CaCO₃ + 2NaCl",
        products: ["CaCO₃", "NaCl"],
        observations: [
          "White precipitate forms",
          "Calcium carbonate precipitate",
          "Milk of lime reaction",
        ],
        liquidColor: "#CBD5E1",
        precipitate: {
          name: "Calcium Carbonate",
          color: "#FFFFFF",
          formula: "CaCO₃",
        },
        energyChange: "exothermic",
        explanation:
          "Sodium carbonate and calcium chloride undergo double displacement forming calcium carbonate precipitate.",
      };
    }

    // NaOH + HCl → NaCl + H2O (neutralization)
    if (
      (salt1.cation === "Na+" &&
        salt1.anion === "OH-" &&
        salt2.cation === "H+" &&
        salt2.anion === "Cl-") ||
      (salt2.cation === "Na+" &&
        salt2.anion === "OH-" &&
        salt1.cation === "H+" &&
        salt1.anion === "Cl-")
    ) {
      return {
        occurred: true,
        type: "neutralization",
        equation: "NaOH + HCl → NaCl + H₂O",
        products: ["NaCl", "H₂O"],
        observations: [
          "Neutralization reaction",
          "Heat released",
          "Salt and water formed",
        ],
        liquidColor: "#CBD5E1",
        energyChange: "exothermic",
        explanation:
          "Sodium hydroxide and hydrochloric acid undergo neutralization to form sodium chloride and water.",
      };
    }

    // KOH + H2SO4 → K2SO4 + H2O
    if (
      (salt1.cation === "K+" &&
        salt1.anion === "OH-" &&
        salt2.cation === "H+" &&
        salt2.anion === "SO4_2-") ||
      (salt2.cation === "K+" &&
        salt2.anion === "OH-" &&
        salt1.cation === "H+" &&
        salt1.anion === "SO4_2-")
    ) {
      return {
        occurred: true,
        type: "neutralization",
        equation: "2KOH + H₂SO₄ → K₂SO₄ + 2H₂O",
        products: ["K₂SO₄", "H₂O"],
        observations: [
          "Neutralization reaction",
          "Heat released",
          "Potassium sulfate and water formed",
        ],
        liquidColor: "#CBD5E1",
        energyChange: "exothermic",
        explanation:
          "Potassium hydroxide and sulfuric acid undergo neutralization to form potassium sulfate and water.",
      };
    }
  }

  // Specific Acid Reactions
  if (acids.length > 0 && metals.length > 0) {
    const acid = acids[0];
    const metal = metals[0];

    // Magnesium + Hydrochloric Acid
    if (metal.formula === "Mg" && acid.formula === "HCl") {
      return {
        occurred: true,
        type: "displacement",
        equation: "Mg + 2HCl → MgCl₂ + H₂",
        products: ["MgCl₂", "H₂"],
        observations: [
          "Vigorous bubbling",
          "Hydrogen gas evolved rapidly",
          "Metal dissolves with effervescence",
        ],
        liquidColor: ION_COLORS["Mg2+"] || "#CBD5E1",
        gasProduced: { name: "Hydrogen", formula: "H₂" },
        energyChange: "exothermic",
        explanation:
          "Magnesium reacts with hydrochloric acid to produce magnesium chloride and hydrogen gas.",
      };
    }

    // Zinc + Sulfuric Acid
    if (metal.formula === "Zn" && acid.formula === "H₂SO₄") {
      return {
        occurred: true,
        type: "displacement",
        equation: "Zn + H₂SO₄ → ZnSO₄ + H₂",
        products: ["ZnSO₄", "H₂"],
        observations: [
          "Steady evolution of hydrogen gas",
          "Metal dissolves gradually",
          "Slight warming observed",
        ],
        liquidColor: ION_COLORS["Zn2+"] || "#CBD5E1",
        gasProduced: { name: "Hydrogen", formula: "H₂" },
        energyChange: "exothermic",
        explanation:
          "Zinc reacts with sulfuric acid to produce zinc sulfate and hydrogen gas.",
      };
    }
  }

  // Halogen Displacement Reactions
  if (nonmetals.length === 2) {
    const halogen1 = nonmetals.find((n) =>
      ["Cl", "Br", "I"].includes(n.formula)
    );
    const halogen2 = nonmetals.find(
      (n) => ["Cl", "Br", "I"].includes(n.formula) && n !== halogen1
    );

    if (halogen1 && halogen2) {
      const halogenOrder = ["Cl", "Br", "I"]; // Cl displaces Br, Br displaces I
      const pos1 = halogenOrder.indexOf(halogen1.formula);
      const pos2 = halogenOrder.indexOf(halogen2.formula);

      if (pos1 < pos2) {
        return {
          occurred: true,
          type: "displacement",
          equation: `${halogen1.formula}₂ + 2${
            halogen2.anion || "K" + halogen2.formula
          } → 2${halogen1.anion || "K" + halogen1.formula} + ${
            halogen2.formula
          }₂`,
          products: [`${halogen2.formula}₂`],
          observations: [
            `Color change observed`,
            `${halogen2.name} is displaced by ${halogen1.name}`,
            "Halogen displacement reaction",
          ],
          liquidColor: "#CBD5E1",
          energyChange: "exothermic",
          explanation:
            "More reactive halogen displaces less reactive halogen from its compounds.",
        };
      }
    }
  }

  // Displacement Reaction
  if (metals.length > 0 && salts.length > 0) {
    const metal = metals[0];
    const salt = salts[0];
    const metalRank = getReactivityRank(metal.formula);
    const saltMetalRank = getReactivityRank(
      getMetalFromCation(salt.cation || "")
    );

    if (metalRank < saltMetalRank) {
      const newSaltFormula = `${metal.formula}SO₄`;
      return {
        occurred: true,
        type: "displacement",
        equation: `${metal.formula} + ${
          salt.formula
        } → ${newSaltFormula} + ${getMetalFromCation(salt.cation!)}`,
        products: [newSaltFormula, getMetalFromCation(salt.cation!)],
        observations: [
          `${metal.name} displaces ${getMetalFromCation(salt.cation!)}`,
        ],
        liquidColor: ION_COLORS[metal.formula + "2+"] || "#CBD5E1",
        energyChange: "exothermic",
        explanation: "More reactive metal displaced the less reactive one.",
      };
    }
  }

  // Neutralization Reactions - Expanded
  if (acids.length > 0 && bases.length > 0) {
    const acid = acids[0];
    const base = bases[0];

    // Specific neutralization reactions
    if (acid.formula === "HCl" && base.formula === "NaOH") {
      return {
        occurred: true,
        type: "neutralization",
        equation: "HCl + NaOH → NaCl + H₂O",
        products: ["NaCl", "H₂O"],
        observations: [
          "Neutralization reaction",
          "Heat released",
          "Sodium chloride and water formed",
        ],
        liquidColor: "#CBD5E1",
        energyChange: "exothermic",
        explanation:
          "Hydrochloric acid and sodium hydroxide undergo neutralization to form sodium chloride and water.",
      };
    }

    if (acid.formula === "H₂SO₄" && base.formula === "NaOH") {
      return {
        occurred: true,
        type: "neutralization",
        equation: "H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O",
        products: ["Na₂SO₄", "H₂O"],
        observations: [
          "Neutralization reaction",
          "Heat released",
          "Sodium sulfate and water formed",
        ],
        liquidColor: "#CBD5E1",
        energyChange: "exothermic",
        explanation:
          "Sulfuric acid and sodium hydroxide undergo neutralization to form sodium sulfate and water.",
      };
    }

    if (acid.formula === "HNO₃" && base.formula === "NaOH") {
      return {
        occurred: true,
        type: "neutralization",
        equation: "HNO₃ + NaOH → NaNO₃ + H₂O",
        products: ["NaNO₃", "H₂O"],
        observations: [
          "Neutralization reaction",
          "Heat released",
          "Sodium nitrate and water formed",
        ],
        liquidColor: "#CBD5E1",
        energyChange: "exothermic",
        explanation:
          "Nitric acid and sodium hydroxide undergo neutralization to form sodium nitrate and water.",
      };
    }

    if (acid.formula === "HCl" && base.formula === "KOH") {
      return {
        occurred: true,
        type: "neutralization",
        equation: "HCl + KOH → KCl + H₂O",
        products: ["KCl", "H₂O"],
        observations: [
          "Neutralization reaction",
          "Heat released",
          "Potassium chloride and water formed",
        ],
        liquidColor: "#CBD5E1",
        energyChange: "exothermic",
        explanation:
          "Hydrochloric acid and potassium hydroxide undergo neutralization to form potassium chloride and water.",
      };
    }

    if (acid.formula === "CH₃COOH" && base.formula === "NaOH") {
      return {
        occurred: true,
        type: "neutralization",
        equation: "CH₃COOH + NaOH → CH₃COONa + H₂O",
        products: ["CH₃COONa", "H₂O"],
        observations: [
          "Neutralization reaction",
          "Heat released",
          "Sodium acetate and water formed",
        ],
        liquidColor: "#CBD5E1",
        energyChange: "exothermic",
        explanation:
          "Acetic acid and sodium hydroxide undergo neutralization to form sodium acetate and water.",
      };
    }

    // General neutralization for other combinations
    return {
      occurred: true,
      type: "neutralization",
      equation: `${acid.formula} + ${base.formula} → Salt + H₂O`,
      products: ["Salt", "H₂O"],
      observations: [
        "Neutralization occurred",
        "Heat released",
        "Salt and water formed",
      ],
      liquidColor: "#CBD5E1",
      energyChange: "exothermic",
      explanation: "Acid and base reacted to form water and salt.",
    };
  }

  // Oxide Reactions
  if (oxides.length > 0) {
    const oxide = oxides[0];

    // Oxide + Acid reactions
    if (acids.length > 0) {
      const acid = acids[0];
      if (oxide.cation === "Ca2+" && acid.formula === "HCl") {
        return {
          occurred: true,
          type: "neutralization",
          equation: "CaO + 2HCl → CaCl₂ + H₂O",
          products: ["CaCl₂", "H₂O"],
          observations: [
            "Vigorous reaction",
            "Heat released",
            "Calcium chloride and water formed",
          ],
          liquidColor: ION_COLORS["Ca2+"] || "#CBD5E1",
          energyChange: "exothermic",
          explanation:
            "Calcium oxide reacts with hydrochloric acid to form calcium chloride and water.",
        };
      }

      if (oxide.cation === "Na2+" && acid.formula === "HCl") {
        return {
          occurred: true,
          type: "neutralization",
          equation: "Na₂O + 2HCl → 2NaCl + H₂O",
          products: ["NaCl", "H₂O"],
          observations: [
            "Vigorous reaction",
            "Heat released",
            "Sodium chloride and water formed",
          ],
          liquidColor: ION_COLORS["Na+"] || "#CBD5E1",
          energyChange: "exothermic",
          explanation:
            "Sodium oxide reacts with hydrochloric acid to form sodium chloride and water.",
        };
      }
    }

    // Oxide + Water reactions (forming bases)
    if (molecules.length > 0 && molecules[0].formula === "H₂O") {
      if (oxide.cation === "Ca2+") {
        return {
          occurred: true,
          type: "hydrolysis",
          equation: "CaO + H₂O → Ca(OH)₂",
          products: ["Ca(OH)₂"],
          observations: [
            "Exothermic reaction",
            "Heat released",
            "Calcium hydroxide formed",
          ],
          liquidColor: "#CBD5E1",
          energyChange: "exothermic",
          explanation:
            "Calcium oxide reacts with water to form calcium hydroxide (slaked lime).",
        };
      }

      if (oxide.cation === "Na2+") {
        return {
          occurred: true,
          type: "hydrolysis",
          equation: "Na₂O + H₂O → 2NaOH",
          products: ["NaOH"],
          observations: [
            "Vigorous reaction",
            "Heat released",
            "Sodium hydroxide formed",
          ],
          liquidColor: "#CBD5E1",
          energyChange: "exothermic",
          explanation:
            "Sodium oxide reacts with water to form sodium hydroxide.",
        };
      }
    }
  }

  // Carbonate Reactions (beyond acid reactions)
  if (
    molecules.length > 0 &&
    molecules[0].name.toLowerCase().includes("carbonate")
  ) {
    const carbonate = molecules[0];

    // Thermal decomposition of carbonates (already handled above)
    // But also reaction with acids (already handled)

    // Carbonate + Metal reactions (not common, but some cases)
    if (metals.length > 0) {
      const metal = metals[0];
      // Most carbonates don't react with metals, but some cases exist
    }
  }

  // Phosphate Reactions
  if (salts.length > 0 && salts[0].anion === "PO4_3-") {
    // Phosphate precipitation reactions
    if (salts.length > 1) {
      const phosphate = salts.find((s) => s.anion === "PO4_3-")!;
      const otherSalt = salts.find((s) => s !== phosphate)!;

      // Example: Calcium phosphate precipitation
      if (phosphate.cation === "Ca2+" && otherSalt.anion === "OH-") {
        // This would be complex, but simplified
      }
    }
  }

  // Sulfide Reactions
  if (salts.length > 0 && salts[0].anion === "S2-") {
    const sulfide = salts[0];

    // Sulfide + Acid reactions
    if (acids.length > 0) {
      const acid = acids[0];
      if (sulfide.cation === "Na+") {
        return {
          occurred: true,
          type: "neutralization",
          equation: "Na₂S + 2HCl → 2NaCl + H₂S",
          products: ["NaCl", "H₂S"],
          observations: [
            "Rotten egg smell",
            "Hydrogen sulfide gas produced",
            "Toxic gas evolved",
          ],
          liquidColor: "#CBD5E1",
          gasProduced: { name: "Hydrogen Sulfide", formula: "H₂S" },
          energyChange: "exothermic",
          explanation:
            "Sodium sulfide reacts with acid to produce hydrogen sulfide gas.",
        };
      }
    }
  }

  // Additional Metal Displacement Reactions
  if (metals.length > 0 && salts.length > 0) {
    const metal = metals[0];
    const salt = salts[0];
    const metalRank = getReactivityRank(metal.formula);
    const saltMetalRank = getReactivityRank(
      getMetalFromCation(salt.cation || "")
    );

    if (metalRank < saltMetalRank) {
      // More specific displacement reactions
      if (metal.formula === "Zn" && salt.cation === "Cu2+") {
        return {
          occurred: true,
          type: "displacement",
          equation: "Zn + CuSO₄ → ZnSO₄ + Cu",
          products: ["ZnSO₄", "Cu"],
          observations: [
            "Reddish-brown copper deposits",
            "Zinc dissolves",
            "Color change observed",
          ],
          liquidColor: ION_COLORS["Zn2+"] || "#CBD5E1",
          energyChange: "exothermic",
          explanation: "Zinc displaces copper from copper sulfate solution.",
        };
      }

      if (metal.formula === "Fe" && salt.cation === "Cu2+") {
        return {
          occurred: true,
          type: "displacement",
          equation: "Fe + CuSO₄ → FeSO₄ + Cu",
          products: ["FeSO₄", "Cu"],
          observations: [
            "Reddish-brown copper deposits",
            "Iron dissolves",
            "Pale green solution",
          ],
          liquidColor: ION_COLORS["Fe2+"] || "#CBD5E1",
          energyChange: "exothermic",
          explanation: "Iron displaces copper from copper sulfate solution.",
        };
      }

      if (metal.formula === "Mg" && salt.cation === "Cu2+") {
        return {
          occurred: true,
          type: "displacement",
          equation: "Mg + CuSO₄ → MgSO₄ + Cu",
          products: ["MgSO₄", "Cu"],
          observations: [
            "Reddish-brown copper deposits",
            "Magnesium dissolves rapidly",
            "Heat released",
          ],
          liquidColor: ION_COLORS["Mg2+"] || "#CBD5E1",
          energyChange: "exothermic",
          explanation:
            "Magnesium displaces copper from copper sulfate solution.",
        };
      }
    }
  }

  // Try Gemini API for reactions not covered by the rule-based system
  try {
    const geminiResult = await predictReactionWithGemini(chemicals);
    if (geminiResult) {
      return geminiResult;
    }
  } catch (error) {
    console.warn("Gemini API fallback failed:", error);
  }

  return noReaction;
}
