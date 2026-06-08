export interface FontDefinition {
  id: string;
  name: string;
  family: string;
  cssVariable: string;
  category: "handwriting" | "display" | "serif" | "sans-serif" | "monospace";
  preview: string;
}

/**
 * Built-in font library for the whiteboard editor.
 * Handwriting & display fonts are loaded via next/font/google in layout.tsx.
 * System fonts (serif, sans-serif, monospace) are always available.
 */
export const FONT_LIBRARY: FontDefinition[] = [
  // Handwriting fonts (loaded via Google Fonts)
  {
    id: "caveat",
    name: "Caveat",
    family: "var(--font-caveat), cursive",
    cssVariable: "--font-caveat",
    category: "handwriting",
    preview: "Aa Bb Cc 123",
  },
  {
    id: "indie-flower",
    name: "Indie Flower",
    family: "var(--font-indie-flower), cursive",
    cssVariable: "--font-indie-flower",
    category: "handwriting",
    preview: "Aa Bb Cc 123",
  },
  {
    id: "patrick-hand",
    name: "Patrick Hand",
    family: "var(--font-patrick-hand), cursive",
    cssVariable: "--font-patrick-hand",
    category: "handwriting",
    preview: "Aa Bb Cc 123",
  },
  {
    id: "architects-daughter",
    name: "Architects Daughter",
    family: "var(--font-architects-daughter), cursive",
    cssVariable: "--font-architects-daughter",
    category: "handwriting",
    preview: "Aa Bb Cc 123",
  },
  {
    id: "shadows-into-light",
    name: "Shadows Into Light",
    family: "var(--font-shadows-into-light), cursive",
    cssVariable: "--font-shadows-into-light",
    category: "handwriting",
    preview: "Aa Bb Cc 123",
  },
  {
    id: "permanent-marker",
    name: "Permanent Marker",
    family: "var(--font-permanent-marker), cursive",
    cssVariable: "--font-permanent-marker",
    category: "display",
    preview: "Aa Bb Cc 123",
  },
  {
    id: "coming-soon",
    name: "Coming Soon",
    family: "var(--font-coming-soon), cursive",
    cssVariable: "--font-coming-soon",
    category: "handwriting",
    preview: "Aa Bb Cc 123",
  },
  {
    id: "gloria-hallelujah",
    name: "Gloria Hallelujah",
    family: "var(--font-gloria-hallelujah), cursive",
    cssVariable: "--font-gloria-hallelujah",
    category: "handwriting",
    preview: "Aa Bb Cc 123",
  },

  // System fonts (always available)
  {
    id: "georgia",
    name: "Georgia",
    family: "Georgia, serif",
    cssVariable: "",
    category: "serif",
    preview: "Aa Bb Cc 123",
  },
  {
    id: "times",
    name: "Times New Roman",
    family: "'Times New Roman', serif",
    cssVariable: "",
    category: "serif",
    preview: "Aa Bb Cc 123",
  },
  {
    id: "arial",
    name: "Arial",
    family: "Arial, sans-serif",
    cssVariable: "",
    category: "sans-serif",
    preview: "Aa Bb Cc 123",
  },
  {
    id: "helvetica",
    name: "Helvetica",
    family: "Helvetica, Arial, sans-serif",
    cssVariable: "",
    category: "sans-serif",
    preview: "Aa Bb Cc 123",
  },
  {
    id: "inter",
    name: "Inter",
    family: "Inter, system-ui, sans-serif",
    cssVariable: "",
    category: "sans-serif",
    preview: "Aa Bb Cc 123",
  },
  {
    id: "monospace",
    name: "Monospace",
    family: "'Courier New', monospace",
    cssVariable: "",
    category: "monospace",
    preview: "Aa Bb Cc 123",
  },
];

export const FONT_CATEGORIES = [
  { id: "handwriting", label: "Handwriting" },
  { id: "display", label: "Display" },
  { id: "serif", label: "Serif" },
  { id: "sans-serif", label: "Sans Serif" },
  { id: "monospace", label: "Mono" },
] as const;

export function getFontFamily(fontId: string): string {
  const font = FONT_LIBRARY.find((f) => f.id === fontId);
  return font?.family || "Georgia, serif";
}

export function getFontById(fontId: string): FontDefinition | undefined {
  return FONT_LIBRARY.find((f) => f.id === fontId);
}
