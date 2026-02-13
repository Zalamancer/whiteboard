import type { SVGPathData } from "@/store/types";

export function parseSVGToPathData(svgString: string): SVGPathData {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, "image/svg+xml");
  const svg = doc.querySelector("svg");

  const viewBox = svg?.getAttribute("viewBox") || "0 0 100 100";
  const paths: string[] = [];

  // Extract all path d attributes (skip invisible/background paths like Tabler's M0 0h24v24H0z)
  doc.querySelectorAll("path").forEach((pathEl) => {
    const d = pathEl.getAttribute("d");
    const stroke = pathEl.getAttribute("stroke");
    const fill = pathEl.getAttribute("fill");
    if (!d) return;
    // Skip paths that are explicitly invisible (stroke=none + fill=none) — these are Tabler's background rects
    if (stroke === "none" && fill === "none") return;
    // Skip degenerate rect-as-path background (e.g. "M0 0h24v24H0z")
    if (/^M\s*0\s+0\s*[hH]\s*\d+\s*[vV]\s*\d+\s*[hH]/i.test(d.trim())) return;
    paths.push(d);
  });

  // Convert basic shapes to paths
  doc.querySelectorAll("circle").forEach((circle) => {
    const cx = parseFloat(circle.getAttribute("cx") || "0");
    const cy = parseFloat(circle.getAttribute("cy") || "0");
    const r = parseFloat(circle.getAttribute("r") || "0");
    if (r > 0) {
      paths.push(
        `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx} ${cy + r} A ${r} ${r} 0 1 1 ${cx} ${cy - r} Z`
      );
    }
  });

  doc.querySelectorAll("rect").forEach((rect) => {
    const x = parseFloat(rect.getAttribute("x") || "0");
    const y = parseFloat(rect.getAttribute("y") || "0");
    const w = parseFloat(rect.getAttribute("width") || "0");
    const h = parseFloat(rect.getAttribute("height") || "0");
    if (w > 0 && h > 0) {
      paths.push(`M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`);
    }
  });

  doc.querySelectorAll("line").forEach((line) => {
    const x1 = parseFloat(line.getAttribute("x1") || "0");
    const y1 = parseFloat(line.getAttribute("y1") || "0");
    const x2 = parseFloat(line.getAttribute("x2") || "0");
    const y2 = parseFloat(line.getAttribute("y2") || "0");
    paths.push(`M ${x1} ${y1} L ${x2} ${y2}`);
  });

  doc.querySelectorAll("polyline, polygon").forEach((poly) => {
    const points = poly.getAttribute("points");
    if (points) {
      const coords = points
        .trim()
        .split(/[\s,]+/)
        .map(parseFloat);
      let d = "";
      for (let i = 0; i < coords.length; i += 2) {
        d += i === 0 ? `M ${coords[i]} ${coords[i + 1]}` : ` L ${coords[i]} ${coords[i + 1]}`;
      }
      if (poly.tagName === "polygon") d += " Z";
      paths.push(d);
    }
  });

  // Try to get stroke/fill from first path element
  const firstPath = doc.querySelector("path");
  const strokeColor =
    firstPath?.getAttribute("stroke") ||
    svg?.getAttribute("stroke") ||
    "#333333";
  const fillColor =
    firstPath?.getAttribute("fill") ||
    svg?.getAttribute("fill") ||
    "none";

  return {
    type: "svg-path",
    paths,
    strokeColor: strokeColor === "none" ? "#333333" : strokeColor,
    strokeWidth: 3,
    fillColor: fillColor === "none" ? "transparent" : fillColor,
    fillOpacity: fillColor === "none" ? 0 : 0.3,
    viewBox,
  };
}
