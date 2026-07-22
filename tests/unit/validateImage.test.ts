import { expect, it } from "vitest";
import { validateFileMeta } from "@/lib/image/validateImage";

it("accepts supported image files under 10 MB", () => {
  const file = new File(["x"], "logo.png", { type: "image/png" });
  expect(validateFileMeta(file)).toEqual({ ok: true });
});

it("rejects unsupported extensions and mime types", () => {
  const file = new File(["x"], "logo.txt", { type: "text/plain" });
  expect(validateFileMeta(file)).toEqual({
    ok: false,
    message: "Formatul fișierului nu este acceptat. Folosește PNG, JPG, WEBP sau SVG.",
  });
});
