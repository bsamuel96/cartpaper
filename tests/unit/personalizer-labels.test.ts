import { expect, it } from "vitest";
import { backgroundMethodLabels, logoColorLabels, printFinishLabels } from "@/lib/personalizer/labels";

it("maps internal personalizer values to Romanian labels", () => {
  expect(logoColorLabels.black).toBe("negru");
  expect(logoColorLabels.lime).toBe("verde Cartpaper");
  expect(printFinishLabels["gold-foil"]).toBe("folie aurie");
  expect(backgroundMethodLabels.local).toBe("eliminat local");
});
