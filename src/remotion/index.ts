/**
 * Remotion entry point for server-side rendering.
 * This file registers the composition(s) that can be rendered by @remotion/renderer.
 * It is bundled separately from the Next.js app via @remotion/bundler.
 */

import { registerRoot } from "remotion";
import { Root } from "./Root";

registerRoot(Root);
