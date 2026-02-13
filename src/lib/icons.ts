export interface IconEntry {
  name: string;
  category: string;
  svg: string;
}

// Bundled SVG icons for the whiteboard (whiteboard-style line drawings)
export const ICON_LIBRARY: IconEntry[] = [
  // Business
  {
    name: "Lightbulb",
    category: "Business",
    svg: `<svg viewBox="0 0 100 140" fill="none" stroke="currentColor" stroke-width="3"><path d="M50 10 C25 10 10 30 10 50 C10 70 30 85 35 95 L35 110 L65 110 L65 95 C70 85 90 70 90 50 C90 30 75 10 50 10 Z"/><line x1="35" y1="115" x2="65" y2="115"/><line x1="38" y1="122" x2="62" y2="122"/><line x1="42" y1="129" x2="58" y2="129"/><line x1="50" y1="40" x2="50" y2="70"/><line x1="35" y1="55" x2="50" y2="70"/><line x1="65" y1="55" x2="50" y2="70"/></svg>`,
  },
  {
    name: "Chart",
    category: "Business",
    svg: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3"><line x1="10" y1="90" x2="90" y2="90"/><line x1="10" y1="10" x2="10" y2="90"/><rect x="20" y="50" width="12" height="40" rx="2"/><rect x="38" y="30" width="12" height="60" rx="2"/><rect x="56" y="45" width="12" height="45" rx="2"/><rect x="74" y="20" width="12" height="70" rx="2"/></svg>`,
  },
  {
    name: "Target",
    category: "Business",
    svg: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3"><circle cx="50" cy="50" r="40"/><circle cx="50" cy="50" r="28"/><circle cx="50" cy="50" r="16"/><circle cx="50" cy="50" r="4"/></svg>`,
  },
  {
    name: "Trophy",
    category: "Business",
    svg: `<svg viewBox="0 0 100 120" fill="none" stroke="currentColor" stroke-width="3"><path d="M30 10 L70 10 L70 50 C70 70 60 80 50 80 C40 80 30 70 30 50 Z"/><path d="M30 25 C20 25 10 30 10 45 C10 55 20 60 30 55"/><path d="M70 25 C80 25 90 30 90 45 C90 55 80 60 70 55"/><line x1="50" y1="80" x2="50" y2="95"/><line x1="35" y1="95" x2="65" y2="95"/><rect x="30" y="100" width="40" height="8" rx="2"/></svg>`,
  },
  {
    name: "Handshake",
    category: "Business",
    svg: `<svg viewBox="0 0 120 80" fill="none" stroke="currentColor" stroke-width="3"><path d="M10 30 L30 15 L50 30 L70 15 L90 30"/><path d="M30 30 C30 50 50 60 60 50"/><path d="M70 30 C70 50 50 60 60 50"/><line x1="5" y1="35" x2="30" y2="35"/><line x1="90" y1="35" x2="115" y2="35"/></svg>`,
  },
  // Education
  {
    name: "Book",
    category: "Education",
    svg: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3"><path d="M15 15 L50 10 L50 85 L15 90 Z"/><path d="M85 15 L50 10 L50 85 L85 90 Z"/><line x1="25" y1="30" x2="45" y2="27"/><line x1="25" y1="42" x2="45" y2="39"/><line x1="25" y1="54" x2="45" y2="51"/></svg>`,
  },
  {
    name: "Graduation Cap",
    category: "Education",
    svg: `<svg viewBox="0 0 120 80" fill="none" stroke="currentColor" stroke-width="3"><path d="M60 10 L10 35 L60 55 L110 35 Z"/><path d="M30 42 L30 62 C30 72 60 78 60 78 C60 78 90 72 90 62 L90 42"/><line x1="110" y1="35" x2="110" y2="65"/></svg>`,
  },
  {
    name: "Pencil",
    category: "Education",
    svg: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3"><path d="M75 5 L95 25 L35 85 L10 90 L15 65 Z"/><line x1="65" y1="15" x2="85" y2="35"/><line x1="15" y1="65" x2="35" y2="85"/></svg>`,
  },
  // Technology
  {
    name: "Laptop",
    category: "Technology",
    svg: `<svg viewBox="0 0 120 80" fill="none" stroke="currentColor" stroke-width="3"><rect x="20" y="5" width="80" height="55" rx="4"/><rect x="25" y="10" width="70" height="45" rx="2"/><path d="M10 60 L110 60 L105 72 L15 72 Z"/></svg>`,
  },
  {
    name: "Gear",
    category: "Technology",
    svg: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3"><circle cx="50" cy="50" r="15"/><path d="M50 5 L55 20 L45 20 Z"/><path d="M50 95 L55 80 L45 80 Z"/><path d="M5 50 L20 45 L20 55 Z"/><path d="M95 50 L80 45 L80 55 Z"/><path d="M18 18 L30 27 L24 33 Z"/><path d="M82 82 L70 73 L76 67 Z"/><path d="M82 18 L73 30 L67 24 Z"/><path d="M18 82 L27 70 L33 76 Z"/></svg>`,
  },
  {
    name: "Cloud",
    category: "Technology",
    svg: `<svg viewBox="0 0 120 80" fill="none" stroke="currentColor" stroke-width="3"><path d="M30 60 C15 60 5 50 5 40 C5 28 15 20 27 20 C30 10 42 2 55 2 C72 2 85 13 87 28 C100 28 110 38 110 50 C110 62 100 70 88 70 L30 70 C18 70 8 62 8 50"/></svg>`,
  },
  {
    name: "Wifi",
    category: "Technology",
    svg: `<svg viewBox="0 0 100 80" fill="none" stroke="currentColor" stroke-width="3"><circle cx="50" cy="70" r="4"/><path d="M30 55 C35 48 42 45 50 45 C58 45 65 48 70 55"/><path d="M18 40 C26 30 38 25 50 25 C62 25 74 30 82 40"/><path d="M5 25 C18 12 33 5 50 5 C67 5 82 12 95 25"/></svg>`,
  },
  // People
  {
    name: "Person",
    category: "People",
    svg: `<svg viewBox="0 0 60 100" fill="none" stroke="currentColor" stroke-width="3"><circle cx="30" cy="18" r="14"/><path d="M5 90 L10 55 C12 42 20 35 30 35 C40 35 48 42 50 55 L55 90"/><line x1="30" y1="55" x2="30" y2="70"/></svg>`,
  },
  {
    name: "Team",
    category: "People",
    svg: `<svg viewBox="0 0 120 80" fill="none" stroke="currentColor" stroke-width="3"><circle cx="60" cy="18" r="12"/><path d="M40 70 L45 45 C47 35 53 30 60 30 C67 30 73 35 75 45 L80 70"/><circle cx="25" cy="25" r="10"/><path d="M10 70 L14 48 C16 40 20 36 25 36 C30 36 34 40 36 48 L40 70"/><circle cx="95" cy="25" r="10"/><path d="M80 70 L84 48 C86 40 90 36 95 36 C100 36 104 40 106 48 L110 70"/></svg>`,
  },
  // Nature
  {
    name: "Sun",
    category: "Nature",
    svg: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3"><circle cx="50" cy="50" r="18"/><line x1="50" y1="5" x2="50" y2="22"/><line x1="50" y1="78" x2="50" y2="95"/><line x1="5" y1="50" x2="22" y2="50"/><line x1="78" y1="50" x2="95" y2="50"/><line x1="18" y1="18" x2="30" y2="30"/><line x1="70" y1="70" x2="82" y2="82"/><line x1="82" y1="18" x2="70" y2="30"/><line x1="30" y1="70" x2="18" y2="82"/></svg>`,
  },
  {
    name: "Tree",
    category: "Nature",
    svg: `<svg viewBox="0 0 80 120" fill="none" stroke="currentColor" stroke-width="3"><path d="M40 10 L15 50 L25 50 L10 80 L70 80 L55 50 L65 50 Z"/><rect x="35" y="80" width="10" height="30"/></svg>`,
  },
  {
    name: "Heart",
    category: "Nature",
    svg: `<svg viewBox="0 0 100 90" fill="none" stroke="currentColor" stroke-width="3"><path d="M50 85 C20 60 5 40 5 25 C5 12 15 2 28 2 C38 2 46 8 50 18 C54 8 62 2 72 2 C85 2 95 12 95 25 C95 40 80 60 50 85 Z"/></svg>`,
  },
  // Arrows & Symbols
  {
    name: "Checkmark",
    category: "Symbols",
    svg: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="5"><path d="M15 55 L40 80 L85 20"/></svg>`,
  },
  {
    name: "Question Mark",
    category: "Symbols",
    svg: `<svg viewBox="0 0 60 100" fill="none" stroke="currentColor" stroke-width="3"><path d="M15 25 C15 10 45 5 45 25 C45 40 30 42 30 60"/><circle cx="30" cy="78" r="4"/></svg>`,
  },
  {
    name: "Money",
    category: "Business",
    svg: `<svg viewBox="0 0 80 100" fill="none" stroke="currentColor" stroke-width="3"><path d="M55 25 C55 15 25 10 25 25 C25 45 55 40 55 60 C55 75 25 72 25 62"/><line x1="40" y1="5" x2="40" y2="95"/></svg>`,
  },
  {
    name: "Clock",
    category: "Business",
    svg: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3"><circle cx="50" cy="50" r="42"/><line x1="50" y1="50" x2="50" y2="22"/><line x1="50" y1="50" x2="72" y2="50"/><circle cx="50" cy="50" r="3"/></svg>`,
  },
  {
    name: "Email",
    category: "Technology",
    svg: `<svg viewBox="0 0 120 80" fill="none" stroke="currentColor" stroke-width="3"><rect x="5" y="10" width="110" height="60" rx="5"/><path d="M5 10 L60 45 L115 10"/></svg>`,
  },
  {
    name: "Phone",
    category: "Technology",
    svg: `<svg viewBox="0 0 60 100" fill="none" stroke="currentColor" stroke-width="3"><rect x="5" y="2" width="50" height="96" rx="8"/><line x1="5" y1="15" x2="55" y2="15"/><line x1="5" y1="80" x2="55" y2="80"/><circle cx="30" cy="90" r="5"/></svg>`,
  },
  {
    name: "Lock",
    category: "Technology",
    svg: `<svg viewBox="0 0 80 100" fill="none" stroke="currentColor" stroke-width="3"><rect x="10" y="40" width="60" height="50" rx="5"/><path d="M22 40 L22 28 C22 14 58 14 58 28 L58 40"/><circle cx="40" cy="62" r="6"/><line x1="40" y1="68" x2="40" y2="78"/></svg>`,
  },
  {
    name: "Rocket",
    category: "Business",
    svg: `<svg viewBox="0 0 80 120" fill="none" stroke="currentColor" stroke-width="3"><path d="M40 5 C25 25 20 55 20 75 L40 65 L60 75 C60 55 55 25 40 5 Z"/><circle cx="40" cy="40" r="8"/><path d="M20 75 L10 95 L25 85"/><path d="M60 75 L70 95 L55 85"/><path d="M35 75 L40 95 L45 75"/></svg>`,
  },
  {
    name: "Flag",
    category: "Symbols",
    svg: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3"><line x1="15" y1="10" x2="15" y2="95"/><path d="M15 10 L85 10 L70 32 L85 55 L15 55"/></svg>`,
  },
  {
    name: "Speech Bubble",
    category: "Symbols",
    svg: `<svg viewBox="0 0 120 90" fill="none" stroke="currentColor" stroke-width="3"><path d="M10 10 L110 10 C112 10 115 13 115 15 L115 55 C115 58 112 60 110 60 L45 60 L25 80 L30 60 L10 60 C8 60 5 58 5 55 L5 15 C5 13 8 10 10 10 Z"/></svg>`,
  },
  {
    name: "Puzzle",
    category: "Business",
    svg: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 45 L35 45 C35 35 50 35 50 45 L80 45 L80 55 C70 55 70 70 80 70 L80 95 L5 95 Z"/><path d="M5 45 L5 5 L95 5 L95 45 L80 45"/></svg>`,
  },
];

export function getCategories(): string[] {
  const cats = new Set(ICON_LIBRARY.map((i) => i.category));
  return Array.from(cats);
}

export function getIconsByCategory(category: string): IconEntry[] {
  return ICON_LIBRARY.filter((i) => i.category === category);
}

export function searchIcons(query: string): IconEntry[] {
  const q = query.toLowerCase();
  return ICON_LIBRARY.filter(
    (i) =>
      i.name.toLowerCase().includes(q) ||
      i.category.toLowerCase().includes(q)
  );
}
