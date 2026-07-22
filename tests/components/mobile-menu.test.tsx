import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";
import { MobileMenu } from "@/components/layout/MobileMenu";

it("opens and closes the mobile menu", async () => {
  render(<MobileMenu />);
  await userEvent.click(screen.getByRole("button", { name: "Deschide meniul" }));
  expect(screen.getByRole("dialog", { name: "Meniu principal" })).toBeInTheDocument();
  await userEvent.click(screen.getByRole("button", { name: "Închide meniul" }));
  expect(screen.queryByRole("dialog", { name: "Meniu principal" })).not.toBeInTheDocument();
});
