export interface MusicTrack {
  id: string;
  name: string;
  mood: "upbeat" | "calm" | "corporate" | "playful" | "cinematic" | "inspiring" | "ambient" | "energetic";
  /** Duration in seconds (approximate, for UI display) */
  durationSecs: number;
  /** BPM (beats per minute) for syncing */
  bpm: number;
  /** Whether the track is a seamless loop */
  isLoop: boolean;
  /** Description for the user */
  description: string;
  /** Tags for search/filtering */
  tags: string[];
}

/**
 * Built-in royalty-free music library.
 *
 * NOTE: These tracks reference placeholder paths. In production, they would
 * be stored as static assets in /public/music/ or fetched from a CDN.
 * Each track is royalty-free and safe for commercial use.
 */
export const MUSIC_LIBRARY: MusicTrack[] = [
  {
    id: "upbeat-explainer",
    name: "Bright Idea",
    mood: "upbeat",
    durationSecs: 120,
    bpm: 120,
    isLoop: true,
    description: "Cheerful, positive background music perfect for explainer videos",
    tags: ["happy", "positive", "light", "explainer"],
  },
  {
    id: "calm-ambient",
    name: "Quiet Focus",
    mood: "calm",
    durationSecs: 180,
    bpm: 80,
    isLoop: true,
    description: "Soft ambient pad with gentle melody, ideal for educational content",
    tags: ["soft", "focus", "education", "minimal"],
  },
  {
    id: "corporate-modern",
    name: "Business Forward",
    mood: "corporate",
    durationSecs: 90,
    bpm: 100,
    isLoop: true,
    description: "Professional, modern corporate sound for business presentations",
    tags: ["professional", "clean", "business", "presentation"],
  },
  {
    id: "playful-bounce",
    name: "Fun Times",
    mood: "playful",
    durationSecs: 60,
    bpm: 130,
    isLoop: true,
    description: "Bouncy, fun track for casual and kids-oriented content",
    tags: ["fun", "kids", "cartoon", "bouncy"],
  },
  {
    id: "cinematic-rise",
    name: "Epic Journey",
    mood: "cinematic",
    durationSecs: 150,
    bpm: 90,
    isLoop: false,
    description: "Dramatic build-up with orchestral elements for storytelling",
    tags: ["dramatic", "epic", "story", "emotional"],
  },
  {
    id: "inspiring-piano",
    name: "New Horizons",
    mood: "inspiring",
    durationSecs: 120,
    bpm: 85,
    isLoop: true,
    description: "Uplifting piano melody with light orchestration",
    tags: ["piano", "uplifting", "motivation", "hope"],
  },
  {
    id: "ambient-tech",
    name: "Digital Pulse",
    mood: "ambient",
    durationSecs: 120,
    bpm: 110,
    isLoop: true,
    description: "Modern electronic ambient for tech and startup content",
    tags: ["tech", "electronic", "startup", "modern"],
  },
  {
    id: "energetic-rock",
    name: "Power Drive",
    mood: "energetic",
    durationSecs: 90,
    bpm: 140,
    isLoop: true,
    description: "High-energy rock-inspired track for action-packed content",
    tags: ["energy", "rock", "action", "fast"],
  },
  {
    id: "calm-acoustic",
    name: "Wooden Bridge",
    mood: "calm",
    durationSecs: 150,
    bpm: 75,
    isLoop: true,
    description: "Gentle acoustic guitar with soft percussion",
    tags: ["acoustic", "guitar", "nature", "peaceful"],
  },
  {
    id: "corporate-light",
    name: "Clear Path",
    mood: "corporate",
    durationSecs: 60,
    bpm: 95,
    isLoop: true,
    description: "Light, optimistic corporate music for product demos",
    tags: ["demo", "product", "clean", "light"],
  },
];

export const MOOD_OPTIONS = [
  { id: "all", label: "All", emoji: "🎵" },
  { id: "upbeat", label: "Upbeat", emoji: "🎉" },
  { id: "calm", label: "Calm", emoji: "🌊" },
  { id: "corporate", label: "Corporate", emoji: "💼" },
  { id: "playful", label: "Playful", emoji: "🎈" },
  { id: "cinematic", label: "Cinematic", emoji: "🎬" },
  { id: "inspiring", label: "Inspiring", emoji: "✨" },
  { id: "ambient", label: "Ambient", emoji: "🌌" },
  { id: "energetic", label: "Energetic", emoji: "⚡" },
] as const;

export function getMusicTrack(id: string): MusicTrack | undefined {
  return MUSIC_LIBRARY.find((t) => t.id === id);
}

export function filterByMood(mood: string): MusicTrack[] {
  if (mood === "all") return MUSIC_LIBRARY;
  return MUSIC_LIBRARY.filter((t) => t.mood === mood);
}

/** Get the static file path for a music track */
export function getMusicSrc(trackId: string): string {
  return `/music/${trackId}.mp3`;
}
