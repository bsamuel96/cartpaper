import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { BeforeAfterPreview } from "@/components/sections/BeforeAfterPreview";

it("moves the before/after divider from pointer movement", () => {
  const { container } = render(<BeforeAfterPreview />);
  const frame = container.querySelector(".beforeAfterCanvas") as HTMLElement;
  Object.defineProperty(frame, "getBoundingClientRect", {
    value: () => ({ left: 0, width: 200, top: 0, height: 250, right: 200, bottom: 250 }),
  });

  fireEvent.pointerDown(frame, { clientX: 160, pointerId: 1 });

  expect((screen.getByRole("slider", { name: "Curățare fundal" }) as HTMLInputElement).value).toBe("80");
});

it("updates the comparison range from keyboard-compatible change events", () => {
  render(<BeforeAfterPreview />);
  const slider = screen.getByRole("slider", { name: "Curățare fundal" }) as HTMLInputElement;

  fireEvent.change(slider, { target: { value: "30" } });

  expect(slider.value).toBe("30");
});
