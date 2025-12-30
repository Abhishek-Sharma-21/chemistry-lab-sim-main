const fs = require("fs");

const content = fs.readFileSync("src/lib/chemistryEngine.ts", "utf8");

const start = content.indexOf("export const CHEMICALS: Chemical[] = [");

const end = content.lastIndexOf("];") + 2;

const arrayText = content.slice(start, end);

const arrayContent = arrayText.slice(
  arrayText.indexOf("[") + 1,
  arrayText.lastIndexOf("]")
);

// Remove comment lines

const lines = arrayContent.split("\n");

const cleanLines = lines.filter(
  (line) => !line.trim().startsWith("//") && line.trim() !== ""
);

// Join back

let cleanContent = cleanLines.join("\n");

// Remove trailing commas

cleanContent = cleanContent.replace(/,(\s*})/g, "$1");

cleanContent = cleanContent.replace(/,(\s*])/g, "$1");

// Now parse

const chemicals = JSON.parse("[" + cleanContent + "]");

// Sort by name case insensitive

chemicals.sort((a, b) =>
  a.name.toLowerCase().localeCompare(b.name.toLowerCase())
);

// Now format back

const formatted = chemicals
  .map((chem) => {
    let obj = "  {\n";

    obj += `    id: "${chem.id}",\n`;

    obj += `    name: "${chem.name}",\n`;

    obj += `    formula: "${chem.formula}",\n`;

    obj += `    type: "${chem.type}",\n`;

    if (chem.cation) obj += `    cation: "${chem.cation}",\n`;

    if (chem.anion) obj += `    anion: "${chem.anion}",\n`;

    obj += `    state: "${chem.state}",\n`;

    obj += `    color: "${chem.color}",\n`;

    obj += `    molarMass: ${chem.molarMass},\n`;

    obj += "  },";

    return obj;
  })
  .join("\n");

// Output the full array

console.log("export const CHEMICALS: Chemical[] = [");

console.log(formatted.slice(0, -1)); // remove last comma

console.log("];");
