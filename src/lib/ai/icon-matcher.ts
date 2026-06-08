/**
 * Matches visual descriptions from AI script to Tabler icon names.
 * Uses keyword matching against the 5,000 Tabler icon set.
 */

// Common synonym mappings from AI descriptions to Tabler icon names
const SYNONYM_MAP: Record<string, string[]> = {
  lightbulb: ["bulb", "lightbulb"],
  idea: ["bulb", "lightbulb", "sparkles"],
  money: ["cash", "coin", "currency-dollar", "wallet"],
  dollar: ["currency-dollar", "cash"],
  people: ["users", "user-group", "friends"],
  team: ["users", "user-group"],
  person: ["user", "man", "woman"],
  growth: ["chart-line", "trending-up", "growth"],
  chart: ["chart-bar", "chart-line", "chart-pie"],
  graph: ["chart-bar", "chart-line"],
  target: ["target", "target-arrow", "bullseye"],
  goal: ["target", "flag"],
  rocket: ["rocket"],
  speed: ["rocket", "bolt", "run"],
  fast: ["rocket", "bolt"],
  phone: ["phone", "device-mobile", "smartphone"],
  computer: ["laptop", "device-desktop", "computer"],
  email: ["mail", "at"],
  message: ["message", "message-circle", "chat"],
  heart: ["heart", "heartbeat"],
  love: ["heart", "hearts"],
  star: ["star", "stars", "sparkle"],
  check: ["check", "circle-check", "checkbox"],
  success: ["circle-check", "trophy", "thumb-up"],
  warning: ["alert-triangle", "exclamation-mark"],
  error: ["alert-circle", "x"],
  search: ["search", "zoom-in"],
  settings: ["settings", "adjustments", "tool"],
  gear: ["settings", "adjustments"],
  lock: ["lock", "shield-lock", "key"],
  security: ["shield", "shield-check", "lock"],
  cloud: ["cloud", "cloud-computing"],
  globe: ["world", "globe", "map"],
  world: ["world", "globe"],
  home: ["home", "home-2", "building"],
  building: ["building", "building-skyscraper"],
  clock: ["clock", "clock-hour-3", "hourglass"],
  time: ["clock", "calendar", "hourglass"],
  calendar: ["calendar", "calendar-event"],
  book: ["book", "book-2", "notebook"],
  education: ["school", "book", "certificate"],
  brain: ["brain", "bulb"],
  think: ["brain", "bulb", "question-mark"],
  question: ["question-mark", "help"],
  arrow: ["arrow-right", "arrow-narrow-right"],
  link: ["link", "external-link"],
  share: ["share", "share-2"],
  download: ["download", "cloud-download"],
  upload: ["upload", "cloud-upload"],
  play: ["player-play", "player-play-filled"],
  video: ["video", "movie", "camera"],
  music: ["music", "headphones"],
  photo: ["photo", "camera"],
  file: ["file", "file-text", "clipboard"],
  folder: ["folder", "folders"],
  trash: ["trash", "trash-x"],
  edit: ["edit", "pencil", "writing"],
  plus: ["plus", "circle-plus"],
  minus: ["minus", "circle-minus"],
  location: ["map-pin", "location", "map"],
  compass: ["compass", "navigation"],
  sun: ["sun", "brightness"],
  moon: ["moon", "moon-stars"],
  weather: ["cloud", "sun", "cloud-rain"],
  fire: ["flame", "fire"],
  water: ["droplet", "wave"],
  plant: ["plant", "leaf", "tree"],
  food: ["pizza", "burger", "apple"],
  coffee: ["coffee", "mug-hot"],
  gift: ["gift", "present"],
  trophy: ["trophy", "award", "medal"],
  crown: ["crown"],
  diamond: ["diamond"],
  bolt: ["bolt", "lightning-bolt"],
  battery: ["battery", "battery-charging"],
  wifi: ["wifi", "antenna-bars-5"],
  bluetooth: ["bluetooth"],
  printer: ["printer"],
  robot: ["robot"],
  bug: ["bug"],
  database: ["database", "server"],
  code: ["code", "braces", "terminal"],
  api: ["api", "webhook"],
  tools: ["tool", "tools", "hammer"],
  paint: ["paint", "brush", "palette"],
  handshake: ["handshake"],
  presentation: ["presentation", "slideshow"],
};

/**
 * Find the best matching Tabler icon name for a description.
 */
export function matchIcon(
  description: string,
  availableIcons: string[]
): string {
  const desc = description.toLowerCase();

  // 1. Try exact match
  const exactMatch = availableIcons.find((name) => desc.includes(name));
  if (exactMatch) return exactMatch;

  // 2. Try synonym mapping
  for (const [keyword, candidates] of Object.entries(SYNONYM_MAP)) {
    if (desc.includes(keyword)) {
      const found = candidates.find((c) => availableIcons.includes(c));
      if (found) return found;
    }
  }

  // 3. Try word-by-word matching
  const words = desc
    .replace(/[^a-z0-9\s-]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 2);

  for (const word of words) {
    const match = availableIcons.find(
      (name) => name === word || name.startsWith(word) || name.endsWith(word)
    );
    if (match) return match;
  }

  // 4. Try partial matching
  for (const word of words) {
    const match = availableIcons.find((name) => name.includes(word));
    if (match) return match;
  }

  // 5. Fallback to a generic icon
  return "point";
}

/**
 * Match all visual descriptions in a script to icon names.
 */
export function matchAllIcons(
  descriptions: string[],
  availableIcons: string[]
): Map<string, string> {
  const results = new Map<string, string>();
  for (const desc of descriptions) {
    results.set(desc, matchIcon(desc, availableIcons));
  }
  return results;
}
