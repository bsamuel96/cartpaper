import { describe, expect, it } from "vitest";
import { sanitizeSvg } from "@/lib/image/sanitizeSvg";

describe("sanitizeSvg", () => {
  it("removes script tags and event attributes", () => {
    const sanitized = sanitizeSvg('<svg viewBox="0 0 10 10"><script>alert(1)</script><path onload="x" d="M0 0"/></svg>');
    expect(sanitized).not.toContain("script");
    expect(sanitized).not.toContain("onload");
  });

  it("rejects external URLs", () => {
    expect(() => sanitizeSvg('<svg><image href="https://example.com/x.png"/></svg>')).toThrow();
  });
});
