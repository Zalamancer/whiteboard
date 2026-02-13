import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const ICONS_DIR = path.join(
  process.cwd(),
  "node_modules/@tabler/icons/icons/outline"
);

// Simple category mapping based on icon name keywords
function categorize(name: string): string[] {
  const cats: string[] = [];
  const n = name.toLowerCase();

  // People & Social
  if (
    /user|person|people|man|woman|friend|team|group|baby|face|mood|emoji|smile|skull/.test(n)
  )
    cats.push("People");

  // Business & Finance
  if (
    /chart|graph|report|briefcase|building|office|cash|coin|money|currency|wallet|bank|receipt|invoice|calculator|percent|tax|piggy|credit|diamond|trophy|award|medal|crown|badge|star|thumb/.test(n)
  )
    cats.push("Business");

  // Technology
  if (
    /computer|laptop|phone|mobile|tablet|device|screen|monitor|server|database|cpu|chip|code|terminal|bug|api|cloud|wifi|bluetooth|antenna|signal|battery|usb|keyboard|mouse|printer|robot|drone/.test(n)
  )
    cats.push("Technology");

  // Education
  if (
    /book|school|pencil|pen|note|paper|graduate|certificate|math|abc|language|ruler|backpack|chalkboard|microscope|atom|flask|dna|brain/.test(n)
  )
    cats.push("Education");

  // Health & Medical
  if (
    /heart|health|hospital|medical|pill|vaccine|stethoscope|first-aid|ambulance|blood|virus|lungs|eye|ear|tooth|wheelchair|activity/.test(n)
  )
    cats.push("Health");

  // Nature & Weather
  if (
    /sun|moon|star|cloud|rain|snow|wind|storm|tree|leaf|flower|plant|seed|mountain|wave|water|fire|flame|bolt|temperature|thermometer|rainbow|sunrise|sunset/.test(n)
  )
    cats.push("Nature");

  // Transport
  if (
    /car|truck|bus|train|plane|ship|boat|bike|bicycle|rocket|helicopter|submarine|motor|wheel|road|gas|parking|anchor|compass|map|location|pin|globe|world/.test(n)
  )
    cats.push("Transport");

  // Media & Communication
  if (
    /photo|camera|video|film|music|mic|speaker|volume|headphone|radio|tv|podcast|stream|play|pause|record|mail|message|chat|comment|phone|call|send|inbox|bell|notification/.test(n)
  )
    cats.push("Media");

  // Home & Living
  if (
    /home|house|door|window|key|lock|bed|chair|table|lamp|bulb|light|fan|fridge|bath|shower|toilet|sofa|couch|garden|grill|tool|hammer|wrench|drill|paint|brush/.test(n)
  )
    cats.push("Home");

  // Food & Drink
  if (
    /food|eat|cook|kitchen|pizza|burger|coffee|tea|beer|wine|bottle|cup|mug|plate|fork|knife|spoon|cake|candy|ice-cream|fruit|apple|egg|bread|meat|fish|salt|pepper/.test(n)
  )
    cats.push("Food");

  // Arrows & UI
  if (
    /arrow|chevron|caret|corner|move|resize|maximize|minimize|expand|collapse|sort|filter|menu|dots|grid|list|layout|sidebar|panel|toggle|switch/.test(n)
  )
    cats.push("Arrows & UI");

  // Shapes & Symbols
  if (
    /circle|square|triangle|hexagon|octagon|polygon|diamond|cross|plus|minus|check|x-mark|slash|equal|hash|at|ampersand|question|exclamation|info|alert|warning|ban|block/.test(n)
  )
    cats.push("Shapes");

  if (cats.length === 0) cats.push("Other");
  return cats;
}

// Cache the icon list
let iconListCache: { name: string; categories: string[] }[] | null = null;

function getIconList() {
  if (iconListCache) return iconListCache;

  const files = fs.readdirSync(ICONS_DIR).filter((f) => f.endsWith(".svg"));
  iconListCache = files.map((f) => {
    const name = f.replace(".svg", "");
    return { name, categories: categorize(name) };
  });
  return iconListCache;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const iconName = searchParams.get("name");

  // If a specific icon is requested, return its SVG content
  if (iconName) {
    const filePath = path.join(ICONS_DIR, `${iconName}.svg`);
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Icon not found" }, { status: 404 });
    }
    const svg = fs.readFileSync(filePath, "utf-8");
    return NextResponse.json({ name: iconName, svg });
  }

  // Otherwise return the full icon list (names + categories only, no SVG data)
  const icons = getIconList();
  return NextResponse.json({ icons, total: icons.length });
}
