import { expect, it } from "vitest";
import { createConsentRecord, parseConsent, readCookie, serializeConsent } from "@/lib/consent/consent";

it("round-trips a consent record", () => {
  const record = createConsentRecord({ analytics: true, marketing: false });
  expect(parseConsent(serializeConsent(record))).toEqual(record);
});

it("reads a named cookie", () => {
  expect(readCookie("other=1; cartpaper_consent=value; theme=dark")).toBe("value");
});
