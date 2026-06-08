export interface BackgroundScene {
  id: string;
  name: string;
  category: "office" | "education" | "nature" | "tech" | "medical" | "abstract";
  description: string;
  /** CSS/SVG pattern rendered behind all elements */
  patternType: "svg" | "css-gradient" | "css-pattern";
  /** CSS or inline SVG definition */
  cssValue: string;
  /** Thumbnail preview color for the picker */
  previewColor: string;
}

export const BACKGROUND_SCENES: BackgroundScene[] = [
  {
    id: "none",
    name: "None",
    category: "abstract",
    description: "No background pattern",
    patternType: "css-gradient",
    cssValue: "none",
    previewColor: "transparent",
  },
  {
    id: "office-desk",
    name: "Office Desk",
    category: "office",
    description: "Subtle desk wood grain texture pattern",
    patternType: "css-pattern",
    cssValue: `repeating-linear-gradient(
      90deg,
      rgba(139, 119, 101, 0.03) 0px,
      rgba(139, 119, 101, 0.03) 1px,
      transparent 1px,
      transparent 20px
    ), repeating-linear-gradient(
      0deg,
      rgba(139, 119, 101, 0.02) 0px,
      rgba(139, 119, 101, 0.02) 1px,
      transparent 1px,
      transparent 80px
    )`,
    previewColor: "#f5ebe0",
  },
  {
    id: "classroom-board",
    name: "Classroom Board",
    category: "education",
    description: "Green chalkboard with subtle chalk dust",
    patternType: "css-pattern",
    cssValue: `radial-gradient(
      circle at 20% 30%,
      rgba(255, 255, 255, 0.03) 0%,
      transparent 50%
    ), radial-gradient(
      circle at 80% 70%,
      rgba(255, 255, 255, 0.02) 0%,
      transparent 40%
    ), radial-gradient(
      circle at 50% 50%,
      rgba(255, 255, 255, 0.01) 0%,
      transparent 100%
    )`,
    previewColor: "#2d5016",
  },
  {
    id: "nature-leaves",
    name: "Nature",
    category: "nature",
    description: "Soft green gradient with subtle leaf-like shapes",
    patternType: "css-gradient",
    cssValue: `radial-gradient(
      ellipse at 10% 90%,
      rgba(76, 175, 80, 0.05) 0%,
      transparent 50%
    ), radial-gradient(
      ellipse at 90% 20%,
      rgba(129, 199, 132, 0.04) 0%,
      transparent 40%
    ), linear-gradient(
      180deg,
      rgba(200, 230, 201, 0.08) 0%,
      transparent 100%
    )`,
    previewColor: "#e8f5e9",
  },
  {
    id: "tech-grid",
    name: "Tech Grid",
    category: "tech",
    description: "Circuit-board inspired grid pattern",
    patternType: "css-pattern",
    cssValue: `linear-gradient(
      rgba(66, 165, 245, 0.05) 1px,
      transparent 1px
    ), linear-gradient(
      90deg,
      rgba(66, 165, 245, 0.05) 1px,
      transparent 1px
    )`,
    previewColor: "#e3f2fd",
  },
  {
    id: "tech-dots",
    name: "Tech Dots",
    category: "tech",
    description: "Subtle dot matrix pattern",
    patternType: "css-pattern",
    cssValue: `radial-gradient(
      circle,
      rgba(66, 165, 245, 0.08) 1px,
      transparent 1px
    )`,
    previewColor: "#e8eaf6",
  },
  {
    id: "medical-cross",
    name: "Medical",
    category: "medical",
    description: "Subtle cross pattern in medical blue",
    patternType: "css-pattern",
    cssValue: `linear-gradient(
      rgba(33, 150, 243, 0.04) 2px,
      transparent 2px
    ), linear-gradient(
      90deg,
      rgba(33, 150, 243, 0.04) 2px,
      transparent 2px
    )`,
    previewColor: "#e1f5fe",
  },
  {
    id: "abstract-waves",
    name: "Waves",
    category: "abstract",
    description: "Soft flowing wave gradients",
    patternType: "css-gradient",
    cssValue: `radial-gradient(
      ellipse at 0% 100%,
      rgba(103, 58, 183, 0.04) 0%,
      transparent 60%
    ), radial-gradient(
      ellipse at 100% 0%,
      rgba(33, 150, 243, 0.04) 0%,
      transparent 60%
    )`,
    previewColor: "#ede7f6",
  },
  {
    id: "abstract-topography",
    name: "Topography",
    category: "abstract",
    description: "Contour-line inspired subtle pattern",
    patternType: "css-pattern",
    cssValue: `repeating-linear-gradient(
      45deg,
      transparent,
      transparent 20px,
      rgba(158, 158, 158, 0.03) 20px,
      rgba(158, 158, 158, 0.03) 21px
    ), repeating-linear-gradient(
      -45deg,
      transparent,
      transparent 30px,
      rgba(158, 158, 158, 0.02) 30px,
      rgba(158, 158, 158, 0.02) 31px
    )`,
    previewColor: "#f5f5f5",
  },
  {
    id: "warm-gradient",
    name: "Warm Glow",
    category: "abstract",
    description: "Warm, inviting gradient for storytelling",
    patternType: "css-gradient",
    cssValue: `radial-gradient(
      ellipse at 30% 80%,
      rgba(255, 183, 77, 0.06) 0%,
      transparent 50%
    ), radial-gradient(
      ellipse at 70% 20%,
      rgba(255, 138, 101, 0.04) 0%,
      transparent 50%
    )`,
    previewColor: "#fff3e0",
  },
];

export const BACKGROUND_CATEGORIES = [
  { id: "all", label: "All" },
  { id: "abstract", label: "Abstract" },
  { id: "office", label: "Office" },
  { id: "education", label: "Education" },
  { id: "nature", label: "Nature" },
  { id: "tech", label: "Tech" },
  { id: "medical", label: "Medical" },
] as const;

export function getBackgroundScene(id: string): BackgroundScene | undefined {
  return BACKGROUND_SCENES.find((bg) => bg.id === id);
}

export function getBackgroundCSS(sceneId: string): string {
  const scene = getBackgroundScene(sceneId);
  if (!scene || scene.cssValue === "none") return "none";

  // For CSS patterns that need background-size
  if (scene.patternType === "css-pattern") {
    return scene.cssValue;
  }

  return scene.cssValue;
}

export function getBackgroundSize(sceneId: string): string | undefined {
  const scene = getBackgroundScene(sceneId);
  if (!scene) return undefined;

  // Grid/dot patterns need specific background-size
  if (scene.id === "tech-grid") return "40px 40px";
  if (scene.id === "tech-dots") return "20px 20px";
  if (scene.id === "medical-cross") return "40px 40px";
  if (scene.id === "office-desk") return "20px 80px";

  return undefined;
}
