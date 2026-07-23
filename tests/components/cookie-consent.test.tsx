import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, it } from "vitest";
import { CookieConsent } from "@/components/consent/CookieConsent";

beforeEach(() => {
  document.cookie = "cartpaper_consent=; Max-Age=0; Path=/";
  window.localStorage?.removeItem?.("cartpaper_consent");
});

it("shows first visit controls and stores rejection of optional cookies", async () => {
  render(<CookieConsent />);
  const reject = await screen.findByRole("button", { name: "Refuză opționale" });
  expect(screen.queryByRole("button", { name: "Închide bannerul cookie" })).not.toBeInTheDocument();
  await userEvent.click(reject);
  expect(document.cookie).toContain("cartpaper_consent=");
});
