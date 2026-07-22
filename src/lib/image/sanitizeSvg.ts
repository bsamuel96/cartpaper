import DOMPurify from "dompurify";

const externalUrlPattern = /\b(?:href|xlink:href|src|url)\s*=\s*["']\s*(?:https?:|\/\/)/i;

export function sanitizeSvg(svgText: string): string {
  if (externalUrlPattern.test(svgText)) {
    throw new Error("SVG-ul conține resurse externe și nu poate fi folosit în siguranță.");
  }

  const sanitized = DOMPurify.sanitize(svgText, {
    USE_PROFILES: { svg: true, svgFilters: true },
    FORBID_TAGS: ["script", "foreignObject", "iframe", "object", "embed"],
    FORBID_ATTR: [
      "onload",
      "onclick",
      "onerror",
      "onmouseover",
      "onfocus",
      "onmouseenter",
      "onmouseleave",
      "formaction",
    ],
  });

  if (externalUrlPattern.test(sanitized)) {
    throw new Error("SVG-ul conține resurse externe și nu poate fi folosit în siguranță.");
  }

  return sanitized;
}
