import type { Project, VideoStyle, AspectRatio, AnimationType } from "@/store/types";

export interface TemplateInfo {
  id: string;
  name: string;
  description: string;
  category: string;
  videoStyle: VideoStyle;
  aspectRatio: AspectRatio;
}

// Template factory — creates a fresh Project from a template
type TemplateFactory = () => Project;

const templates: Record<string, { info: TemplateInfo; factory: TemplateFactory }> = {
  // ─── EDUCATION (5) ──────────────────────────────────────────────

  explainer: {
    info: {
      id: "explainer",
      name: "3-Step Explainer",
      description: "Introduce a concept in 3 clear steps with icons and text",
      category: "Education",
      videoStyle: "classic-whiteboard",
      aspectRatio: "16:9",
    },
    factory: () => ({
      id: crypto.randomUUID(),
      name: "3-Step Explainer",
      width: 5760,
      height: 1080,
      fps: 30,
      backgroundColor: "#FFFFFF",
      videoStyle: "classic-whiteboard",
      aspectRatio: "16:9",
      elements: [
        // Scene 1: Problem
        makeText("scene1-title", "The Problem", 100, 80, 500, 80, 0, 48, 700, "#2c3e50"),
        makeShape("scene1-icon", "circle", 300, 300, 200, 200, 30, "#e74c3c"),
        makeText("scene1-desc", "Describe the problem\nyour audience faces", 100, 550, 600, 100, 60, 28, 400, "#7f8c8d"),
        // Scene 2: Solution
        makeShape("scene1-arrow", "arrow", 750, 400, 200, 60, 100, "#3498db"),
        makeText("scene2-title", "The Solution", 2000, 80, 500, 80, 130, 48, 700, "#2c3e50"),
        makeShape("scene2-icon", "star", 2200, 300, 200, 200, 160, "#f39c12"),
        makeText("scene2-desc", "Explain how your\nsolution works", 2000, 550, 600, 100, 190, 28, 400, "#7f8c8d"),
        // Scene 3: Benefits
        makeShape("scene2-arrow", "arrow", 2650, 400, 200, 60, 230, "#3498db"),
        makeText("scene3-title", "The Result", 3900, 80, 500, 80, 260, 48, 700, "#2c3e50"),
        makeShape("scene3-icon", "circle", 4100, 300, 200, 200, 290, "#27ae60"),
        makeText("scene3-desc", "Show the benefits\nand outcomes", 3900, 550, 600, 100, 320, 28, 400, "#7f8c8d"),
      ],
      cameraKeyframes: [
        { id: "cam1", frame: 0, x: 0, y: 0, scale: 1, easing: "linear" },
        { id: "cam2", frame: 120, x: -1900, y: 0, scale: 1, easing: "ease-in-out" },
        { id: "cam3", frame: 250, x: -3800, y: 0, scale: 1, easing: "ease-in-out" },
      ],
      audioTracks: [],
    }),
  },

  "how-to": {
    info: {
      id: "how-to",
      name: "How-To Tutorial",
      description: "Step-by-step tutorial with numbered steps",
      category: "Education",
      videoStyle: "classic-whiteboard",
      aspectRatio: "16:9",
    },
    factory: () => ({
      id: crypto.randomUUID(),
      name: "How-To Tutorial",
      width: 1920,
      height: 1080,
      fps: 30,
      backgroundColor: "#FFFFFF",
      videoStyle: "classic-whiteboard",
      aspectRatio: "16:9",
      elements: [
        makeText("title", "How To [Your Topic]", 200, 50, 1500, 100, 0, 56, 700, "#2c3e50"),
        makeText("step1-num", "1", 150, 200, 80, 80, 40, 48, 700, "#22c55e"),
        makeText("step1-text", "First step description", 250, 210, 600, 60, 50, 28, 400, "#34495e"),
        makeText("step2-num", "2", 150, 350, 80, 80, 100, 48, 700, "#22c55e"),
        makeText("step2-text", "Second step description", 250, 360, 600, 60, 110, 28, 400, "#34495e"),
        makeText("step3-num", "3", 150, 500, 80, 80, 160, 48, 700, "#22c55e"),
        makeText("step3-text", "Third step description", 250, 510, 600, 60, 170, 28, 400, "#34495e"),
        makeText("step4-num", "4", 150, 650, 80, 80, 220, 48, 700, "#22c55e"),
        makeText("step4-text", "Fourth step description", 250, 660, 600, 60, 230, 28, 400, "#34495e"),
        makeShape("decoration", "star", 1200, 300, 400, 400, 60, "#f39c12"),
      ],
      cameraKeyframes: [],
      audioTracks: [],
    }),
  },

  "concept-map": {
    info: {
      id: "concept-map",
      name: "Concept Map",
      description: "Central idea with branching sub-topics connected by lines",
      category: "Education",
      videoStyle: "sketch-notebook",
      aspectRatio: "16:9",
    },
    factory: () => ({
      id: crypto.randomUUID(),
      name: "Concept Map",
      width: 1920,
      height: 1080,
      fps: 30,
      backgroundColor: "#faf3e0",
      videoStyle: "sketch-notebook",
      aspectRatio: "16:9",
      elements: [
        // Central concept
        makeShape("center-bg", "circle", 760, 390, 400, 300, 0, "#e17055"),
        makeText("center", "Main\nConcept", 830, 470, 260, 100, 10, 40, 700, "#3d3425"),
        // Branch 1 - top left
        makeShape("line1", "line", 600, 350, 200, 4, 40, "#5d4e37"),
        makeShape("branch1-bg", "circle", 200, 180, 300, 200, 50, "#00cec9"),
        makeText("branch1", "Sub-topic 1", 260, 245, 180, 60, 60, 24, 600, "#3d3425"),
        // Branch 2 - top right
        makeShape("line2", "line", 1120, 350, 200, 4, 40, "#5d4e37"),
        makeShape("branch2-bg", "circle", 1400, 180, 300, 200, 80, "#6c5ce7"),
        makeText("branch2", "Sub-topic 2", 1460, 245, 180, 60, 90, 24, 600, "#3d3425"),
        // Branch 3 - bottom left
        makeShape("line3", "line", 600, 700, 200, 4, 100, "#5d4e37"),
        makeShape("branch3-bg", "circle", 200, 700, 300, 200, 110, "#fdcb6e"),
        makeText("branch3", "Sub-topic 3", 260, 765, 180, 60, 120, 24, 600, "#3d3425"),
        // Branch 4 - bottom right
        makeShape("line4", "line", 1120, 700, 200, 4, 130, "#5d4e37"),
        makeShape("branch4-bg", "circle", 1400, 700, 300, 200, 140, "#55efc4"),
        makeText("branch4", "Sub-topic 4", 1460, 765, 180, 60, 150, 24, 600, "#3d3425"),
      ],
      cameraKeyframes: [],
      audioTracks: [],
    }),
  },

  timeline: {
    info: {
      id: "timeline",
      name: "Timeline / History",
      description: "Chronological timeline with events and dates",
      category: "Education",
      videoStyle: "classic-whiteboard",
      aspectRatio: "16:9",
    },
    factory: () => ({
      id: crypto.randomUUID(),
      name: "Timeline",
      width: 7680,
      height: 1080,
      fps: 30,
      backgroundColor: "#FFFFFF",
      videoStyle: "classic-whiteboard",
      aspectRatio: "16:9",
      elements: [
        makeText("title", "Timeline", 200, 50, 600, 80, 0, 56, 700, "#2c3e50"),
        // Horizontal line
        makeShape("timeline-line", "line", 100, 540, 7400, 4, 20, "#bdc3c7"),
        // Event 1
        makeShape("dot1", "circle", 350, 520, 40, 40, 30, "#e74c3c"),
        makeText("date1", "2020", 300, 460, 140, 40, 40, 20, 700, "#e74c3c"),
        makeText("event1", "First milestone\nachievement", 250, 580, 250, 80, 50, 22, 400, "#34495e"),
        // Event 2
        makeShape("dot2", "circle", 1850, 520, 40, 40, 80, "#f39c12"),
        makeText("date2", "2021", 1800, 460, 140, 40, 90, 20, 700, "#f39c12"),
        makeText("event2", "Second key\nevent here", 1750, 580, 250, 80, 100, 22, 400, "#34495e"),
        // Event 3
        makeShape("dot3", "circle", 3350, 520, 40, 40, 130, "#3498db"),
        makeText("date3", "2022", 3300, 460, 140, 40, 140, 20, 700, "#3498db"),
        makeText("event3", "Third important\nmilestone", 3250, 580, 250, 80, 150, 22, 400, "#34495e"),
        // Event 4
        makeShape("dot4", "circle", 4850, 520, 40, 40, 180, "#27ae60"),
        makeText("date4", "2023", 4800, 460, 140, 40, 190, 20, 700, "#27ae60"),
        makeText("event4", "Fourth significant\nevent occurs", 4750, 580, 250, 80, 200, 22, 400, "#34495e"),
        // Event 5
        makeShape("dot5", "circle", 6350, 520, 40, 40, 230, "#9b59b6"),
        makeText("date5", "2024", 6300, 460, 140, 40, 240, 20, 700, "#9b59b6"),
        makeText("event5", "Latest achievement\nand future plans", 6250, 580, 250, 80, 250, 22, 400, "#34495e"),
      ],
      cameraKeyframes: [
        { id: "cam1", frame: 0, x: 0, y: 0, scale: 1, easing: "linear" },
        { id: "cam2", frame: 80, x: -1500, y: 0, scale: 1, easing: "ease-in-out" },
        { id: "cam3", frame: 140, x: -3000, y: 0, scale: 1, easing: "ease-in-out" },
        { id: "cam4", frame: 200, x: -4500, y: 0, scale: 1, easing: "ease-in-out" },
        { id: "cam5", frame: 260, x: -5760, y: 0, scale: 1, easing: "ease-in-out" },
      ],
      audioTracks: [],
    }),
  },

  "quiz-review": {
    info: {
      id: "quiz-review",
      name: "Quiz Review",
      description: "Question & answer format for educational review",
      category: "Education",
      videoStyle: "blackboard",
      aspectRatio: "16:9",
    },
    factory: () => ({
      id: crypto.randomUUID(),
      name: "Quiz Review",
      width: 5760,
      height: 1080,
      fps: 30,
      backgroundColor: "#2d3436",
      videoStyle: "blackboard",
      aspectRatio: "16:9",
      elements: [
        // Q1
        makeText("q1-label", "Question 1", 100, 80, 400, 60, 0, 32, 700, "#74b9ff"),
        makeText("q1", "What is the main concept\nof this topic?", 100, 160, 700, 100, 15, 36, 400, "#f5f5f5"),
        makeShape("q1-line", "line", 100, 300, 700, 3, 40, "#636e72"),
        makeText("a1", "Answer: The key idea is...", 100, 330, 700, 80, 60, 28, 400, "#55efc4"),
        // Q2
        makeText("q2-label", "Question 2", 2000, 80, 400, 60, 100, 32, 700, "#74b9ff"),
        makeText("q2", "How does process X\nwork in practice?", 2000, 160, 700, 100, 115, 36, 400, "#f5f5f5"),
        makeShape("q2-line", "line", 2000, 300, 700, 3, 140, "#636e72"),
        makeText("a2", "Answer: It works by...", 2000, 330, 700, 80, 160, 28, 400, "#55efc4"),
        // Q3
        makeText("q3-label", "Question 3", 3900, 80, 400, 60, 200, 32, 700, "#74b9ff"),
        makeText("q3", "Why is this important\nfor understanding?", 3900, 160, 700, 100, 215, 36, 400, "#f5f5f5"),
        makeShape("q3-line", "line", 3900, 300, 700, 3, 240, "#636e72"),
        makeText("a3", "Answer: Because it...", 3900, 330, 700, 80, 260, 28, 400, "#55efc4"),
      ],
      cameraKeyframes: [
        { id: "cam1", frame: 0, x: 0, y: 0, scale: 1, easing: "linear" },
        { id: "cam2", frame: 100, x: -1920, y: 0, scale: 1, easing: "ease-in-out" },
        { id: "cam3", frame: 200, x: -3840, y: 0, scale: 1, easing: "ease-in-out" },
      ],
      audioTracks: [],
    }),
  },

  // ─── BUSINESS (5) ───────────────────────────────────────────────

  comparison: {
    info: {
      id: "comparison",
      name: "Comparison (vs)",
      description: "Compare two options side by side",
      category: "Business",
      videoStyle: "classic-whiteboard",
      aspectRatio: "16:9",
    },
    factory: () => ({
      id: crypto.randomUUID(),
      name: "Comparison",
      width: 1920,
      height: 1080,
      fps: 30,
      backgroundColor: "#FFFFFF",
      videoStyle: "classic-whiteboard",
      aspectRatio: "16:9",
      elements: [
        makeText("title", "Option A  vs  Option B", 300, 50, 1300, 100, 0, 48, 700, "#2c3e50"),
        makeShape("divider", "line", 910, 180, 4, 700, 30, "#bdc3c7"),
        makeText("left-title", "Option A", 200, 200, 400, 60, 40, 36, 700, "#e74c3c"),
        makeText("left-1", "Feature one", 200, 300, 400, 40, 70, 24, 400, "#34495e"),
        makeText("left-2", "Feature two", 200, 360, 400, 40, 100, 24, 400, "#34495e"),
        makeText("left-3", "Feature three", 200, 420, 400, 40, 130, 24, 400, "#34495e"),
        makeText("right-title", "Option B", 1100, 200, 400, 60, 40, 36, 700, "#27ae60"),
        makeText("right-1", "Feature one", 1100, 300, 400, 40, 70, 24, 400, "#34495e"),
        makeText("right-2", "Feature two", 1100, 360, 400, 40, 100, 24, 400, "#34495e"),
        makeText("right-3", "Feature three", 1100, 420, 400, 40, 130, 24, 400, "#34495e"),
      ],
      cameraKeyframes: [],
      audioTracks: [],
    }),
  },

  "problem-solution": {
    info: {
      id: "problem-solution",
      name: "Problem \u2192 Solution",
      description: "Present a problem and reveal the solution",
      category: "Business",
      videoStyle: "classic-whiteboard",
      aspectRatio: "16:9",
    },
    factory: () => ({
      id: crypto.randomUUID(),
      name: "Problem \u2192 Solution",
      width: 3840,
      height: 1080,
      fps: 30,
      backgroundColor: "#FFFFFF",
      videoStyle: "classic-whiteboard",
      aspectRatio: "16:9",
      elements: [
        makeText("p-title", "The Problem", 200, 100, 600, 80, 0, 48, 700, "#e74c3c"),
        makeShape("p-icon", "circle", 400, 300, 250, 250, 30, "#e74c3c"),
        makeText("p-desc", "Describe the challenge\nor pain point here", 200, 600, 700, 100, 60, 28, 400, "#7f8c8d"),
        makeShape("arrow", "arrow", 950, 400, 250, 60, 120, "#3498db"),
        makeText("s-title", "The Solution", 2100, 100, 600, 80, 150, 48, 700, "#27ae60"),
        makeShape("s-icon", "star", 2300, 300, 250, 250, 180, "#27ae60"),
        makeText("s-desc", "Explain your solution\nand how it helps", 2100, 600, 700, 100, 210, 28, 400, "#7f8c8d"),
      ],
      cameraKeyframes: [
        { id: "cam1", frame: 0, x: 0, y: 0, scale: 1, easing: "linear" },
        { id: "cam2", frame: 140, x: -1920, y: 0, scale: 1, easing: "ease-in-out" },
      ],
      audioTracks: [],
    }),
  },

  "pitch-deck": {
    info: {
      id: "pitch-deck",
      name: "Pitch Deck",
      description: "Present your idea with problem, solution, market, and ask",
      category: "Business",
      videoStyle: "corporate-clean",
      aspectRatio: "16:9",
    },
    factory: () => ({
      id: crypto.randomUUID(),
      name: "Pitch Deck",
      width: 7680,
      height: 1080,
      fps: 30,
      backgroundColor: "#FFFFFF",
      videoStyle: "corporate-clean",
      aspectRatio: "16:9",
      elements: [
        // Slide 1: Hook
        makeText("s1-title", "Your Big Idea", 400, 300, 1000, 120, 0, 64, 700, "#1a1a2e", "fade-in"),
        makeText("s1-sub", "A one-line pitch that hooks the audience", 400, 450, 1000, 60, 20, 28, 400, "#7f8c8d", "fade-in"),
        // Slide 2: Problem
        makeText("s2-title", "The Problem", 2200, 100, 600, 80, 90, 48, 700, "#e74c3c", "fade-in"),
        makeText("s2-desc", "What problem exists today?\nWhy is it painful?", 2200, 300, 700, 150, 120, 32, 400, "#34495e", "fade-in"),
        // Slide 3: Solution
        makeText("s3-title", "Our Solution", 4100, 100, 600, 80, 180, 48, 700, "#4a6cf7", "fade-in"),
        makeText("s3-desc", "How we solve it.\nWhat makes us different.", 4100, 300, 700, 150, 210, 32, 400, "#34495e", "fade-in"),
        // Slide 4: Ask
        makeText("s4-title", "The Ask", 6000, 100, 600, 80, 270, 48, 700, "#27ae60", "fade-in"),
        makeText("s4-desc", "What do you need?\nFunding? Users? Partners?", 6000, 300, 700, 150, 300, 32, 400, "#34495e", "fade-in"),
      ],
      cameraKeyframes: [
        { id: "cam1", frame: 0, x: 0, y: 0, scale: 1, easing: "linear" },
        { id: "cam2", frame: 80, x: -1920, y: 0, scale: 1, easing: "ease-in-out" },
        { id: "cam3", frame: 170, x: -3840, y: 0, scale: 1, easing: "ease-in-out" },
        { id: "cam4", frame: 260, x: -5760, y: 0, scale: 1, easing: "ease-in-out" },
      ],
      audioTracks: [],
    }),
  },

  "swot-analysis": {
    info: {
      id: "swot-analysis",
      name: "SWOT Analysis",
      description: "Strengths, Weaknesses, Opportunities, and Threats grid",
      category: "Business",
      videoStyle: "colorful-flat",
      aspectRatio: "16:9",
    },
    factory: () => ({
      id: crypto.randomUUID(),
      name: "SWOT Analysis",
      width: 1920,
      height: 1080,
      fps: 30,
      backgroundColor: "#f8f9fa",
      videoStyle: "colorful-flat",
      aspectRatio: "16:9",
      elements: [
        makeText("title", "SWOT Analysis", 560, 30, 800, 80, 0, 48, 700, "#2d3436", "fade-in"),
        // Strengths (top-left)
        makeShape("s-bg", "rect", 80, 130, 860, 420, 20, "#27ae60"),
        makeText("s-title", "Strengths", 160, 155, 300, 50, 30, 32, 700, "#27ae60", "fade-in"),
        makeText("s-items", "\u2022 Strong brand\n\u2022 Skilled team\n\u2022 Good revenue", 160, 220, 700, 200, 45, 22, 400, "#2d3436", "fade-in"),
        // Weaknesses (top-right)
        makeShape("w-bg", "rect", 980, 130, 860, 420, 60, "#e74c3c"),
        makeText("w-title", "Weaknesses", 1060, 155, 300, 50, 70, 32, 700, "#e74c3c", "fade-in"),
        makeText("w-items", "\u2022 Limited market\n\u2022 High costs\n\u2022 Small team", 1060, 220, 700, 200, 85, 22, 400, "#2d3436", "fade-in"),
        // Opportunities (bottom-left)
        makeShape("o-bg", "rect", 80, 570, 860, 420, 100, "#3498db"),
        makeText("o-title", "Opportunities", 160, 595, 300, 50, 110, 32, 700, "#3498db", "fade-in"),
        makeText("o-items", "\u2022 New markets\n\u2022 Partnerships\n\u2022 Tech trends", 160, 660, 700, 200, 125, 22, 400, "#2d3436", "fade-in"),
        // Threats (bottom-right)
        makeShape("t-bg", "rect", 980, 570, 860, 420, 140, "#f39c12"),
        makeText("t-title", "Threats", 1060, 595, 300, 50, 150, 32, 700, "#f39c12", "fade-in"),
        makeText("t-items", "\u2022 Competitors\n\u2022 Regulation\n\u2022 Economy", 1060, 660, 700, 200, 165, 22, 400, "#2d3436", "fade-in"),
      ],
      cameraKeyframes: [],
      audioTracks: [],
    }),
  },

  "customer-journey": {
    info: {
      id: "customer-journey",
      name: "Customer Journey",
      description: "Map the customer experience from awareness to advocacy",
      category: "Business",
      videoStyle: "corporate-clean",
      aspectRatio: "16:9",
    },
    factory: () => ({
      id: crypto.randomUUID(),
      name: "Customer Journey",
      width: 9600,
      height: 1080,
      fps: 30,
      backgroundColor: "#FFFFFF",
      videoStyle: "corporate-clean",
      aspectRatio: "16:9",
      elements: [
        makeText("title", "Customer Journey Map", 200, 50, 800, 80, 0, 48, 700, "#1a1a2e", "fade-in"),
        // Stage 1: Awareness
        makeShape("s1-bg", "rect", 150, 200, 1600, 700, 15, "#4a6cf7"),
        makeText("s1-title", "Awareness", 400, 250, 600, 60, 25, 40, 700, "#4a6cf7", "fade-in"),
        makeText("s1-desc", "Customer discovers\nyour product", 400, 380, 600, 100, 40, 28, 400, "#34495e", "fade-in"),
        makeShape("arrow1", "arrow", 1800, 500, 200, 60, 60, "#bdc3c7"),
        // Stage 2: Consideration
        makeShape("s2-bg", "rect", 2100, 200, 1600, 700, 70, "#6c5ce7"),
        makeText("s2-title", "Consideration", 2350, 250, 600, 60, 80, 40, 700, "#6c5ce7", "fade-in"),
        makeText("s2-desc", "Customer evaluates\noptions and compares", 2350, 380, 600, 100, 95, 28, 400, "#34495e", "fade-in"),
        makeShape("arrow2", "arrow", 3750, 500, 200, 60, 115, "#bdc3c7"),
        // Stage 3: Decision
        makeShape("s3-bg", "rect", 4050, 200, 1600, 700, 125, "#00cec9"),
        makeText("s3-title", "Decision", 4300, 250, 600, 60, 135, 40, 700, "#00cec9", "fade-in"),
        makeText("s3-desc", "Customer commits\nto purchase", 4300, 380, 600, 100, 150, 28, 400, "#34495e", "fade-in"),
        makeShape("arrow3", "arrow", 5700, 500, 200, 60, 170, "#bdc3c7"),
        // Stage 4: Retention
        makeShape("s4-bg", "rect", 6000, 200, 1600, 700, 180, "#fdcb6e"),
        makeText("s4-title", "Retention", 6250, 250, 600, 60, 190, 40, 700, "#e17055", "fade-in"),
        makeText("s4-desc", "Customer stays\nand re-purchases", 6250, 380, 600, 100, 205, 28, 400, "#34495e", "fade-in"),
        makeShape("arrow4", "arrow", 7650, 500, 200, 60, 225, "#bdc3c7"),
        // Stage 5: Advocacy
        makeShape("s5-bg", "rect", 7950, 200, 1600, 700, 235, "#55efc4"),
        makeText("s5-title", "Advocacy", 8200, 250, 600, 60, 245, 40, 700, "#27ae60", "fade-in"),
        makeText("s5-desc", "Customer recommends\nto others", 8200, 380, 600, 100, 260, 28, 400, "#34495e", "fade-in"),
      ],
      cameraKeyframes: [
        { id: "cam1", frame: 0, x: 0, y: 0, scale: 1, easing: "linear" },
        { id: "cam2", frame: 70, x: -1920, y: 0, scale: 1, easing: "ease-in-out" },
        { id: "cam3", frame: 140, x: -3840, y: 0, scale: 1, easing: "ease-in-out" },
        { id: "cam4", frame: 210, x: -5760, y: 0, scale: 1, easing: "ease-in-out" },
        { id: "cam5", frame: 280, x: -7680, y: 0, scale: 1, easing: "ease-in-out" },
      ],
      audioTracks: [],
    }),
  },

  // ─── MARKETING (3) ──────────────────────────────────────────────

  "product-explainer": {
    info: {
      id: "product-explainer",
      name: "Product Explainer",
      description: "Showcase your product features and benefits",
      category: "Marketing",
      videoStyle: "colorful-flat",
      aspectRatio: "16:9",
    },
    factory: () => ({
      id: crypto.randomUUID(),
      name: "Product Explainer",
      width: 5760,
      height: 1080,
      fps: 30,
      backgroundColor: "#f8f9fa",
      videoStyle: "colorful-flat",
      aspectRatio: "16:9",
      elements: [
        // Scene 1: Product intro
        makeText("s1-title", "Introducing\n[Your Product]", 300, 200, 1000, 200, 0, 56, 700, "#2d3436", "fade-in"),
        makeText("s1-sub", "The smarter way to do X", 300, 450, 800, 60, 25, 28, 400, "#636e72", "fade-in"),
        makeShape("s1-circle", "circle", 1400, 300, 300, 300, 10, "#6c5ce7"),
        // Scene 2: Key features
        makeText("s2-title", "Key Features", 2100, 100, 600, 80, 90, 48, 700, "#2d3436", "fade-in"),
        makeShape("f1-icon", "circle", 2150, 280, 100, 100, 110, "#00cec9"),
        makeText("f1", "Lightning fast\nperformance", 2280, 300, 400, 80, 115, 24, 400, "#34495e", "fade-in"),
        makeShape("f2-icon", "circle", 2150, 450, 100, 100, 140, "#6c5ce7"),
        makeText("f2", "Easy to use\ninterface", 2280, 470, 400, 80, 145, 24, 400, "#34495e", "fade-in"),
        makeShape("f3-icon", "circle", 2150, 620, 100, 100, 170, "#fd79a8"),
        makeText("f3", "Secure and\nreliable", 2280, 640, 400, 80, 175, 24, 400, "#34495e", "fade-in"),
        // Scene 3: CTA
        makeText("s3-title", "Get Started Today", 4000, 300, 1000, 100, 230, 56, 700, "#2d3436", "fade-in"),
        makeShape("cta-btn", "rect", 4200, 450, 400, 80, 250, "#6c5ce7"),
        makeText("cta", "Try It Free", 4280, 462, 240, 50, 255, 28, 700, "#ffffff", "fade-in"),
      ],
      cameraKeyframes: [
        { id: "cam1", frame: 0, x: 0, y: 0, scale: 1, easing: "linear" },
        { id: "cam2", frame: 90, x: -1920, y: 0, scale: 1, easing: "ease-in-out" },
        { id: "cam3", frame: 220, x: -3840, y: 0, scale: 1, easing: "ease-in-out" },
      ],
      audioTracks: [],
    }),
  },

  "feature-highlight": {
    info: {
      id: "feature-highlight",
      name: "Feature Highlight",
      description: "Spotlight a single feature with details and benefits",
      category: "Marketing",
      videoStyle: "neon-dark",
      aspectRatio: "16:9",
    },
    factory: () => ({
      id: crypto.randomUUID(),
      name: "Feature Highlight",
      width: 3840,
      height: 1080,
      fps: 30,
      backgroundColor: "#0a0a0a",
      videoStyle: "neon-dark",
      aspectRatio: "16:9",
      elements: [
        // Scene 1: Feature intro
        makeText("s1-title", "[Feature Name]", 400, 200, 1000, 100, 0, 56, 700, "#00ff88"),
        makeText("s1-sub", "A game-changing capability", 400, 340, 800, 60, 20, 28, 400, "#ffffff"),
        makeShape("s1-glow", "circle", 1400, 250, 300, 300, 10, "#ff00ff"),
        // Scene 2: Details
        makeText("s2-title", "How It Works", 2200, 100, 600, 80, 90, 44, 700, "#00ff88"),
        makeText("s2-step1", "1. Configure your settings", 2200, 280, 700, 50, 110, 26, 400, "#ffffff"),
        makeText("s2-step2", "2. Deploy with one click", 2200, 370, 700, 50, 130, 26, 400, "#ffffff"),
        makeText("s2-step3", "3. See results instantly", 2200, 460, 700, 50, 150, 26, 400, "#ffffff"),
        makeShape("s2-line", "line", 2200, 560, 600, 3, 170, "#ff00ff"),
        makeText("s2-benefit", "10x faster than alternatives", 2200, 590, 700, 60, 180, 32, 700, "#00ff88"),
      ],
      cameraKeyframes: [
        { id: "cam1", frame: 0, x: 0, y: 0, scale: 1, easing: "linear" },
        { id: "cam2", frame: 100, x: -1920, y: 0, scale: 1, easing: "ease-in-out" },
      ],
      audioTracks: [],
    }),
  },

  "testimonial-showcase": {
    info: {
      id: "testimonial-showcase",
      name: "Testimonial Showcase",
      description: "Display customer testimonials and social proof",
      category: "Marketing",
      videoStyle: "corporate-clean",
      aspectRatio: "16:9",
    },
    factory: () => ({
      id: crypto.randomUUID(),
      name: "Testimonial Showcase",
      width: 5760,
      height: 1080,
      fps: 30,
      backgroundColor: "#FFFFFF",
      videoStyle: "corporate-clean",
      aspectRatio: "16:9",
      elements: [
        makeText("title", "What Our Customers Say", 400, 50, 1100, 80, 0, 48, 700, "#1a1a2e", "fade-in"),
        // Testimonial 1
        makeShape("t1-bg", "rect", 200, 200, 1500, 400, 20, "#f8f9fa"),
        makeText("t1-quote", "\u201cThis product transformed\nhow we work. Incredible!\"", 280, 260, 1200, 150, 35, 32, 400, "#34495e", "fade-in"),
        makeText("t1-author", "— Sarah Johnson, CEO", 280, 460, 600, 40, 55, 22, 700, "#4a6cf7", "fade-in"),
        makeShape("t1-stars", "star", 280, 520, 30, 30, 65, "#f39c12"),
        // Testimonial 2
        makeShape("t2-bg", "rect", 2100, 200, 1500, 400, 100, "#f8f9fa"),
        makeText("t2-quote", "\u201cBest investment we\u2019ve\nmade this year. 5 stars.\"", 2180, 260, 1200, 150, 115, 32, 400, "#34495e", "fade-in"),
        makeText("t2-author", "— Mark Chen, CTO", 2180, 460, 600, 40, 135, 22, 700, "#4a6cf7", "fade-in"),
        makeShape("t2-stars", "star", 2180, 520, 30, 30, 145, "#f39c12"),
        // Testimonial 3
        makeShape("t3-bg", "rect", 4000, 200, 1500, 400, 180, "#f8f9fa"),
        makeText("t3-quote", "\u201cSeamless integration and\namazing support team.\"", 4080, 260, 1200, 150, 195, 32, 400, "#34495e", "fade-in"),
        makeText("t3-author", "— Lisa Park, VP Sales", 4080, 460, 600, 40, 215, 22, 700, "#4a6cf7", "fade-in"),
        makeShape("t3-stars", "star", 4080, 520, 30, 30, 225, "#f39c12"),
      ],
      cameraKeyframes: [
        { id: "cam1", frame: 0, x: 0, y: 0, scale: 1, easing: "linear" },
        { id: "cam2", frame: 100, x: -1920, y: 0, scale: 1, easing: "ease-in-out" },
        { id: "cam3", frame: 200, x: -3840, y: 0, scale: 1, easing: "ease-in-out" },
      ],
      audioTracks: [],
    }),
  },

  // ─── TECHNICAL (3) ──────────────────────────────────────────────

  "process-flow": {
    info: {
      id: "process-flow",
      name: "Process Flow",
      description: "Visualize a multi-step process with connected stages",
      category: "Technical",
      videoStyle: "corporate-clean",
      aspectRatio: "16:9",
    },
    factory: () => ({
      id: crypto.randomUUID(),
      name: "Process Flow",
      width: 7680,
      height: 1080,
      fps: 30,
      backgroundColor: "#FFFFFF",
      videoStyle: "corporate-clean",
      aspectRatio: "16:9",
      elements: [
        makeText("title", "Process Overview", 300, 50, 800, 80, 0, 48, 700, "#1a1a2e", "fade-in"),
        // Step 1
        makeShape("step1-box", "rect", 200, 300, 1400, 500, 15, "#4a6cf7"),
        makeText("step1-num", "01", 300, 340, 200, 60, 25, 48, 700, "#4a6cf7", "fade-in"),
        makeText("step1-title", "Input", 300, 420, 400, 50, 35, 32, 700, "#1a1a2e", "fade-in"),
        makeText("step1-desc", "Gather requirements\nand data sources", 300, 490, 500, 100, 45, 22, 400, "#636e72", "fade-in"),
        makeShape("arrow1", "arrow", 1650, 500, 200, 60, 65, "#bdc3c7"),
        // Step 2
        makeShape("step2-box", "rect", 2100, 300, 1400, 500, 75, "#6c5ce7"),
        makeText("step2-num", "02", 2200, 340, 200, 60, 85, 48, 700, "#6c5ce7", "fade-in"),
        makeText("step2-title", "Process", 2200, 420, 400, 50, 95, 32, 700, "#1a1a2e", "fade-in"),
        makeText("step2-desc", "Transform and\nvalidate data", 2200, 490, 500, 100, 105, 22, 400, "#636e72", "fade-in"),
        makeShape("arrow2", "arrow", 3550, 500, 200, 60, 125, "#bdc3c7"),
        // Step 3
        makeShape("step3-box", "rect", 4000, 300, 1400, 500, 135, "#00cec9"),
        makeText("step3-num", "03", 4100, 340, 200, 60, 145, 48, 700, "#00cec9", "fade-in"),
        makeText("step3-title", "Review", 4100, 420, 400, 50, 155, 32, 700, "#1a1a2e", "fade-in"),
        makeText("step3-desc", "Quality check\nand approval", 4100, 490, 500, 100, 165, 22, 400, "#636e72", "fade-in"),
        makeShape("arrow3", "arrow", 5450, 500, 200, 60, 185, "#bdc3c7"),
        // Step 4
        makeShape("step4-box", "rect", 5900, 300, 1400, 500, 195, "#27ae60"),
        makeText("step4-num", "04", 6000, 340, 200, 60, 205, 48, 700, "#27ae60", "fade-in"),
        makeText("step4-title", "Output", 6000, 420, 400, 50, 215, 32, 700, "#1a1a2e", "fade-in"),
        makeText("step4-desc", "Deploy and\nmonitor results", 6000, 490, 500, 100, 225, 22, 400, "#636e72", "fade-in"),
      ],
      cameraKeyframes: [
        { id: "cam1", frame: 0, x: 0, y: 0, scale: 1, easing: "linear" },
        { id: "cam2", frame: 70, x: -1920, y: 0, scale: 1, easing: "ease-in-out" },
        { id: "cam3", frame: 140, x: -3840, y: 0, scale: 1, easing: "ease-in-out" },
        { id: "cam4", frame: 210, x: -5760, y: 0, scale: 1, easing: "ease-in-out" },
      ],
      audioTracks: [],
    }),
  },

  "architecture-overview": {
    info: {
      id: "architecture-overview",
      name: "Architecture Overview",
      description: "System architecture with connected components",
      category: "Technical",
      videoStyle: "sketch-notebook",
      aspectRatio: "16:9",
    },
    factory: () => ({
      id: crypto.randomUUID(),
      name: "Architecture Overview",
      width: 1920,
      height: 1080,
      fps: 30,
      backgroundColor: "#faf3e0",
      videoStyle: "sketch-notebook",
      aspectRatio: "16:9",
      elements: [
        makeText("title", "System Architecture", 500, 30, 920, 80, 0, 44, 700, "#3d3425"),
        // Client layer
        makeShape("client-box", "rect", 100, 130, 500, 200, 15, "#e17055"),
        makeText("client", "Client\n(Web / Mobile)", 160, 180, 380, 100, 25, 24, 600, "#3d3425"),
        // API layer
        makeShape("api-arrow", "arrow", 350, 350, 4, 100, 45, "#5d4e37"),
        makeShape("api-box", "rect", 100, 460, 500, 200, 55, "#00cec9"),
        makeText("api", "API Gateway\n(REST / GraphQL)", 160, 510, 380, 100, 65, 24, 600, "#3d3425"),
        // Services
        makeShape("svc-arrow", "arrow", 620, 540, 100, 4, 85, "#5d4e37"),
        makeShape("svc1-box", "rect", 740, 130, 440, 200, 95, "#6c5ce7"),
        makeText("svc1", "Auth Service", 810, 195, 300, 60, 105, 22, 600, "#3d3425"),
        makeShape("svc2-box", "rect", 740, 400, 440, 200, 115, "#fdcb6e"),
        makeText("svc2", "Business Logic", 810, 465, 300, 60, 125, 22, 600, "#3d3425"),
        makeShape("svc3-box", "rect", 740, 670, 440, 200, 135, "#55efc4"),
        makeText("svc3", "Data Service", 810, 735, 300, 60, 145, 22, 600, "#3d3425"),
        // Database
        makeShape("db-arrow", "arrow", 1200, 770, 100, 4, 155, "#5d4e37"),
        makeShape("db-box", "rect", 1350, 350, 480, 500, 165, "#74b9ff"),
        makeText("db", "Database\n(PostgreSQL)", 1430, 540, 320, 100, 175, 24, 600, "#3d3425"),
      ],
      cameraKeyframes: [],
      audioTracks: [],
    }),
  },

  "code-walkthrough": {
    info: {
      id: "code-walkthrough",
      name: "Code Walkthrough",
      description: "Step through code concepts with visual annotations",
      category: "Technical",
      videoStyle: "neon-dark",
      aspectRatio: "16:9",
    },
    factory: () => ({
      id: crypto.randomUUID(),
      name: "Code Walkthrough",
      width: 5760,
      height: 1080,
      fps: 30,
      backgroundColor: "#0a0a0a",
      videoStyle: "neon-dark",
      aspectRatio: "16:9",
      elements: [
        // Slide 1: Concept
        makeText("s1-title", "Understanding\n[Concept]", 300, 200, 1000, 200, 0, 52, 700, "#00ff88"),
        makeText("s1-desc", "A walkthrough of the core idea", 300, 440, 800, 60, 20, 24, 400, "#ffffff"),
        // Slide 2: Code block
        makeText("s2-title", "The Code", 2100, 80, 600, 60, 80, 36, 700, "#00ff88"),
        makeShape("code-bg", "rect", 2100, 170, 1200, 500, 90, "#1a1a2e"),
        makeText("code-line1", "function example() {", 2150, 200, 1100, 40, 100, 22, 400, "#ffffff"),
        makeText("code-line2", "  const data = fetch(url);", 2150, 250, 1100, 40, 110, 22, 400, "#74b9ff"),
        makeText("code-line3", "  return process(data);", 2150, 300, 1100, 40, 120, 22, 400, "#74b9ff"),
        makeText("code-line4", "}", 2150, 350, 1100, 40, 130, 22, 400, "#ffffff"),
        makeText("s2-explain", "Key insight: data flows from\nfetch \u2192 process \u2192 return", 2100, 720, 800, 80, 150, 24, 400, "#ff00ff"),
        // Slide 3: Summary
        makeText("s3-title", "Key Takeaways", 4000, 200, 800, 80, 200, 44, 700, "#00ff88"),
        makeText("s3-p1", "\u2022 Concept A explained", 4000, 350, 700, 50, 220, 26, 400, "#ffffff"),
        makeText("s3-p2", "\u2022 Pattern B demonstrated", 4000, 420, 700, 50, 235, 26, 400, "#ffffff"),
        makeText("s3-p3", "\u2022 Best practice applied", 4000, 490, 700, 50, 250, 26, 400, "#ffffff"),
      ],
      cameraKeyframes: [
        { id: "cam1", frame: 0, x: 0, y: 0, scale: 1, easing: "linear" },
        { id: "cam2", frame: 90, x: -1920, y: 0, scale: 1, easing: "ease-in-out" },
        { id: "cam3", frame: 190, x: -3840, y: 0, scale: 1, easing: "ease-in-out" },
      ],
      audioTracks: [],
    }),
  },

  // ─── SOCIAL MEDIA (2) ──────────────────────────────────────────

  "tiktok-quick-tip": {
    info: {
      id: "tiktok-quick-tip",
      name: "TikTok Quick Tip",
      description: "Vertical short-form tip video for TikTok/Reels/Shorts",
      category: "Social Media",
      videoStyle: "neon-dark",
      aspectRatio: "9:16",
    },
    factory: () => ({
      id: crypto.randomUUID(),
      name: "Quick Tip",
      width: 1080,
      height: 5760,
      fps: 30,
      backgroundColor: "#0a0a0a",
      videoStyle: "neon-dark",
      aspectRatio: "9:16",
      elements: [
        // Scene 1: Hook
        makeText("hook", "Did you\nknow?", 140, 500, 800, 300, 0, 72, 700, "#00ff88"),
        makeShape("hook-line", "line", 200, 850, 680, 4, 20, "#ff00ff"),
        // Scene 2: Tip
        makeText("tip-label", "PRO TIP", 200, 2200, 680, 80, 60, 32, 700, "#ff00ff"),
        makeText("tip-text", "Your amazing tip\ngoes right here.\nKeep it concise.", 140, 2350, 800, 300, 75, 40, 400, "#ffffff"),
        // Scene 3: CTA
        makeText("cta-title", "Try it\ntoday!", 200, 4200, 680, 250, 140, 64, 700, "#00ff88"),
        makeText("cta-sub", "Follow for more tips", 200, 4500, 680, 60, 160, 28, 400, "#ffffff"),
      ],
      cameraKeyframes: [
        { id: "cam1", frame: 0, x: 0, y: 0, scale: 1, easing: "linear" },
        { id: "cam2", frame: 60, x: 0, y: -1920, scale: 1, easing: "ease-in-out" },
        { id: "cam3", frame: 130, x: 0, y: -3840, scale: 1, easing: "ease-in-out" },
      ],
      audioTracks: [],
    }),
  },

  "instagram-carousel": {
    info: {
      id: "instagram-carousel",
      name: "Instagram Carousel",
      description: "Square-format carousel with multiple slides",
      category: "Social Media",
      videoStyle: "colorful-flat",
      aspectRatio: "1:1",
    },
    factory: () => ({
      id: crypto.randomUUID(),
      name: "Instagram Carousel",
      width: 4320,
      height: 1080,
      fps: 30,
      backgroundColor: "#f8f9fa",
      videoStyle: "colorful-flat",
      aspectRatio: "1:1",
      elements: [
        // Slide 1: Title card
        makeText("s1-title", "5 Tips for\n[Your Topic]", 200, 250, 700, 250, 0, 52, 700, "#2d3436", "fade-in"),
        makeText("s1-sub", "Swipe to learn \u2192", 200, 550, 400, 50, 20, 22, 400, "#636e72", "fade-in"),
        makeShape("s1-accent", "circle", 750, 700, 200, 200, 10, "#6c5ce7"),
        // Slide 2: Tip 1
        makeText("s2-num", "01", 1200, 150, 200, 100, 60, 64, 700, "#6c5ce7", "fade-in"),
        makeText("s2-title", "First Tip", 1200, 300, 600, 60, 70, 36, 700, "#2d3436", "fade-in"),
        makeText("s2-desc", "Explain your first tip\nin a concise way", 1200, 400, 600, 100, 80, 24, 400, "#636e72", "fade-in"),
        // Slide 3: Tip 2
        makeText("s3-num", "02", 2280, 150, 200, 100, 110, 64, 700, "#00cec9", "fade-in"),
        makeText("s3-title", "Second Tip", 2280, 300, 600, 60, 120, 36, 700, "#2d3436", "fade-in"),
        makeText("s3-desc", "Explain your second tip\nwith clear details", 2280, 400, 600, 100, 130, 24, 400, "#636e72", "fade-in"),
        // Slide 4: CTA
        makeText("s4-title", "Want More?", 3400, 250, 600, 80, 170, 48, 700, "#2d3436", "fade-in"),
        makeText("s4-sub", "Follow @yourhandle\nfor daily tips!", 3400, 400, 600, 100, 185, 28, 400, "#636e72", "fade-in"),
        makeShape("s4-heart", "star", 3600, 600, 100, 100, 195, "#fd79a8"),
      ],
      cameraKeyframes: [
        { id: "cam1", frame: 0, x: 0, y: 0, scale: 1, easing: "linear" },
        { id: "cam2", frame: 60, x: -1080, y: 0, scale: 1, easing: "ease-in-out" },
        { id: "cam3", frame: 120, x: -2160, y: 0, scale: 1, easing: "ease-in-out" },
        { id: "cam4", frame: 180, x: -3240, y: 0, scale: 1, easing: "ease-in-out" },
      ],
      audioTracks: [],
    }),
  },

  // ─── TRAINING (2) ──────────────────────────────────────────────

  "onboarding-checklist": {
    info: {
      id: "onboarding-checklist",
      name: "Onboarding Checklist",
      description: "Employee onboarding steps with checkmarks",
      category: "Training",
      videoStyle: "corporate-clean",
      aspectRatio: "16:9",
    },
    factory: () => ({
      id: crypto.randomUUID(),
      name: "Onboarding Checklist",
      width: 1920,
      height: 1080,
      fps: 30,
      backgroundColor: "#FFFFFF",
      videoStyle: "corporate-clean",
      aspectRatio: "16:9",
      elements: [
        makeText("title", "Welcome Aboard!", 400, 40, 1100, 80, 0, 52, 700, "#1a1a2e", "fade-in"),
        makeText("subtitle", "Your onboarding checklist", 400, 120, 800, 40, 10, 22, 400, "#636e72", "fade-in"),
        // Checklist items
        makeShape("check1", "rect", 200, 220, 40, 40, 30, "#4a6cf7"),
        makeText("item1", "Complete your profile and settings", 270, 225, 800, 40, 35, 24, 400, "#1a1a2e", "fade-in"),
        makeShape("check2", "rect", 200, 310, 40, 40, 60, "#4a6cf7"),
        makeText("item2", "Meet your team and manager", 270, 315, 800, 40, 65, 24, 400, "#1a1a2e", "fade-in"),
        makeShape("check3", "rect", 200, 400, 40, 40, 90, "#4a6cf7"),
        makeText("item3", "Review company policies and culture", 270, 405, 800, 40, 95, 24, 400, "#1a1a2e", "fade-in"),
        makeShape("check4", "rect", 200, 490, 40, 40, 120, "#4a6cf7"),
        makeText("item4", "Set up your development environment", 270, 495, 800, 40, 125, 24, 400, "#1a1a2e", "fade-in"),
        makeShape("check5", "rect", 200, 580, 40, 40, 150, "#4a6cf7"),
        makeText("item5", "Complete security training", 270, 585, 800, 40, 155, 24, 400, "#1a1a2e", "fade-in"),
        makeShape("check6", "rect", 200, 670, 40, 40, 180, "#4a6cf7"),
        makeText("item6", "Schedule your first 1-on-1", 270, 675, 800, 40, 185, 24, 400, "#1a1a2e", "fade-in"),
        // Decoration
        makeShape("accent", "circle", 1400, 400, 300, 300, 40, "#4a6cf7"),
      ],
      cameraKeyframes: [],
      audioTracks: [],
    }),
  },

  "compliance-overview": {
    info: {
      id: "compliance-overview",
      name: "Compliance Overview",
      description: "Regulatory compliance training with key policies",
      category: "Training",
      videoStyle: "corporate-clean",
      aspectRatio: "16:9",
    },
    factory: () => ({
      id: crypto.randomUUID(),
      name: "Compliance Overview",
      width: 5760,
      height: 1080,
      fps: 30,
      backgroundColor: "#FFFFFF",
      videoStyle: "corporate-clean",
      aspectRatio: "16:9",
      elements: [
        // Section 1: Overview
        makeText("s1-title", "Compliance Training", 300, 100, 1200, 80, 0, 52, 700, "#1a1a2e", "fade-in"),
        makeText("s1-sub", "Understanding our key policies\nand regulations", 300, 250, 800, 100, 15, 28, 400, "#636e72", "fade-in"),
        makeShape("s1-icon", "circle", 1300, 300, 300, 300, 10, "#4a6cf7"),
        // Section 2: Data Privacy
        makeText("s2-title", "Data Privacy", 2200, 100, 600, 60, 80, 40, 700, "#e74c3c", "fade-in"),
        makeText("s2-p1", "\u2022 Handle data responsibly", 2200, 240, 700, 40, 95, 24, 400, "#34495e", "fade-in"),
        makeText("s2-p2", "\u2022 Follow GDPR guidelines", 2200, 300, 700, 40, 105, 24, 400, "#34495e", "fade-in"),
        makeText("s2-p3", "\u2022 Report data breaches", 2200, 360, 700, 40, 115, 24, 400, "#34495e", "fade-in"),
        makeText("s2-p4", "\u2022 Encrypt sensitive info", 2200, 420, 700, 40, 125, 24, 400, "#34495e", "fade-in"),
        // Section 3: Best Practices
        makeText("s3-title", "Best Practices", 4100, 100, 600, 60, 170, 40, 700, "#27ae60", "fade-in"),
        makeText("s3-p1", "\u2022 Regular training updates", 4100, 240, 700, 40, 185, 24, 400, "#34495e", "fade-in"),
        makeText("s3-p2", "\u2022 Document everything", 4100, 300, 700, 40, 195, 24, 400, "#34495e", "fade-in"),
        makeText("s3-p3", "\u2022 Escalate concerns", 4100, 360, 700, 40, 205, 24, 400, "#34495e", "fade-in"),
        makeText("s3-p4", "\u2022 Stay informed", 4100, 420, 700, 40, 215, 24, 400, "#34495e", "fade-in"),
      ],
      cameraKeyframes: [
        { id: "cam1", frame: 0, x: 0, y: 0, scale: 1, easing: "linear" },
        { id: "cam2", frame: 90, x: -1920, y: 0, scale: 1, easing: "ease-in-out" },
        { id: "cam3", frame: 180, x: -3840, y: 0, scale: 1, easing: "ease-in-out" },
      ],
      audioTracks: [],
    }),
  },

  // ─── STORYTELLING (2) ──────────────────────────────────────────

  "before-after": {
    info: {
      id: "before-after",
      name: "Before & After",
      description: "Show transformation from before to after state",
      category: "Storytelling",
      videoStyle: "colorful-flat",
      aspectRatio: "16:9",
    },
    factory: () => ({
      id: crypto.randomUUID(),
      name: "Before & After",
      width: 3840,
      height: 1080,
      fps: 30,
      backgroundColor: "#f8f9fa",
      videoStyle: "colorful-flat",
      aspectRatio: "16:9",
      elements: [
        // Before
        makeText("before-label", "BEFORE", 400, 80, 400, 60, 0, 40, 700, "#e74c3c", "fade-in"),
        makeShape("before-bg", "rect", 200, 170, 1500, 700, 10, "#ffeaa7"),
        makeText("before-title", "The Old Way", 350, 250, 1000, 80, 20, 44, 700, "#2d3436", "fade-in"),
        makeText("before-desc", "Slow, manual processes\nInefficient workflows\nHigh error rate\nFrustrated users", 350, 370, 800, 250, 35, 26, 400, "#636e72", "fade-in"),
        makeShape("before-x", "star", 1300, 400, 200, 200, 50, "#e74c3c"),
        // After
        makeText("after-label", "AFTER", 2300, 80, 400, 60, 100, 40, 700, "#27ae60", "fade-in"),
        makeShape("after-bg", "rect", 2100, 170, 1500, 700, 110, "#55efc4"),
        makeText("after-title", "The New Way", 2250, 250, 1000, 80, 120, 44, 700, "#2d3436", "fade-in"),
        makeText("after-desc", "Automated pipelines\nStreamlined workflows\nNear-zero errors\nHappy users", 2250, 370, 800, 250, 135, 26, 400, "#636e72", "fade-in"),
        makeShape("after-check", "star", 3200, 400, 200, 200, 150, "#27ae60"),
      ],
      cameraKeyframes: [
        { id: "cam1", frame: 0, x: 0, y: 0, scale: 1, easing: "linear" },
        { id: "cam2", frame: 100, x: -1920, y: 0, scale: 1, easing: "ease-in-out" },
      ],
      audioTracks: [],
    }),
  },

  "problem-agitate-solve": {
    info: {
      id: "problem-agitate-solve",
      name: "Problem-Agitate-Solve",
      description: "Classic PAS framework: state, amplify, and resolve",
      category: "Storytelling",
      videoStyle: "classic-whiteboard",
      aspectRatio: "16:9",
    },
    factory: () => ({
      id: crypto.randomUUID(),
      name: "Problem-Agitate-Solve",
      width: 5760,
      height: 1080,
      fps: 30,
      backgroundColor: "#FFFFFF",
      videoStyle: "classic-whiteboard",
      aspectRatio: "16:9",
      elements: [
        // Problem
        makeText("p-title", "The Problem", 200, 80, 600, 80, 0, 48, 700, "#e74c3c"),
        makeText("p-desc", "Your audience is\nstruggling with X.\nThis costs them time,\nmoney, and peace of mind.", 200, 220, 700, 250, 20, 28, 400, "#34495e"),
        makeShape("p-icon", "circle", 1100, 300, 300, 300, 30, "#e74c3c"),
        // Agitate
        makeText("a-title", "Why It's Worse\nThan You Think", 2100, 80, 700, 120, 100, 48, 700, "#f39c12"),
        makeText("a-desc", "Without solving this:\n\u2022 Revenue drops 30%\n\u2022 Customer churn rises\n\u2022 Competitors pull ahead", 2100, 260, 700, 250, 120, 28, 400, "#34495e"),
        makeShape("a-icon", "star", 3000, 300, 300, 300, 140, "#f39c12"),
        // Solve
        makeText("s-title", "The Solution", 4000, 80, 600, 80, 200, 48, 700, "#27ae60"),
        makeText("s-desc", "With [Your Product]:\n\u2022 Automate the process\n\u2022 Save 10+ hours/week\n\u2022 Grow 3x faster", 4000, 260, 700, 250, 220, 28, 400, "#34495e"),
        makeShape("s-icon", "star", 4900, 300, 300, 300, 240, "#27ae60"),
      ],
      cameraKeyframes: [
        { id: "cam1", frame: 0, x: 0, y: 0, scale: 1, easing: "linear" },
        { id: "cam2", frame: 100, x: -1920, y: 0, scale: 1, easing: "ease-in-out" },
        { id: "cam3", frame: 210, x: -3840, y: 0, scale: 1, easing: "ease-in-out" },
      ],
      audioTracks: [],
    }),
  },

  // ─── MEDIA (1 - existing listicle) ─────────────────────────────

  listicle: {
    info: {
      id: "listicle",
      name: "Top 5 Listicle",
      description: "Count down 5 key points with visuals",
      category: "Media",
      videoStyle: "classic-whiteboard",
      aspectRatio: "16:9",
    },
    factory: () => ({
      id: crypto.randomUUID(),
      name: "Top 5 List",
      width: 1920,
      height: 1080,
      fps: 30,
      backgroundColor: "#FFFFFF",
      videoStyle: "classic-whiteboard",
      aspectRatio: "16:9",
      elements: [
        makeText("title", "Top 5 [Your Topic]", 300, 40, 1300, 100, 0, 52, 700, "#2c3e50"),
        ...[1, 2, 3, 4, 5].flatMap((n, i) => [
          makeText(`n${n}`, `${n}`, 200, 160 + i * 150, 60, 60, 30 + i * 50, 40, 700, "#22c55e"),
          makeText(`item${n}`, `Point number ${n}`, 280, 168 + i * 150, 800, 50, 40 + i * 50, 28, 400, "#34495e"),
        ]),
      ],
      cameraKeyframes: [],
      audioTracks: [],
    }),
  },
};

// ─── HELPER FUNCTIONS ──────────────────────────────────────────

function makeText(
  id: string, content: string,
  x: number, y: number, w: number, h: number,
  startFrame: number,
  fontSize: number, fontWeight: number, color: string,
  animationType: AnimationType = "fade-in"
) {
  return {
    id,
    type: "text" as const,
    position: { x, y },
    size: { width: w, height: h },
    rotation: 0,
    startFrame,
    durationFrames: 300,
    animationType,
    drawSpeed: 20,
    opacity: 1,
    zIndex: 0,
    locked: false,
    visible: true,
    data: {
      type: "text" as const,
      content,
      fontFamily: "Georgia, serif",
      fontSize,
      fontWeight,
      color,
      textAlign: "left" as const,
    },
  };
}

function makeShape(
  id: string, shapeType: string,
  x: number, y: number, w: number, h: number,
  startFrame: number, color: string
) {
  return {
    id,
    type: "shape" as const,
    position: { x, y },
    size: { width: w, height: h },
    rotation: 0,
    startFrame,
    durationFrames: 300,
    animationType: "draw" as const,
    drawSpeed: 45,
    opacity: 1,
    zIndex: 0,
    locked: false,
    visible: true,
    data: {
      type: "shape" as const,
      shapeType: shapeType as "rect" | "circle" | "ellipse" | "arrow" | "line" | "star",
      strokeColor: color,
      strokeWidth: 3,
      fillColor: color,
    },
  };
}

export function getTemplateList(): TemplateInfo[] {
  return Object.values(templates).map((t) => t.info);
}

export function getTemplateProject(templateId: string): Project | null {
  const t = templates[templateId];
  if (!t) return null;
  return t.factory();
}
