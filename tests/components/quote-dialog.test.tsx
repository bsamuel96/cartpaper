import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { QuoteDialog } from "@/components/quote/QuoteDialog";

afterEach(() => {
  vi.restoreAllMocks();
});

it("exits loading state after a recoverable quote network failure", async () => {
  vi.spyOn(window, "fetch").mockRejectedValue(new Error("offline"));
  render(<QuoteDialog />);
  window.dispatchEvent(new CustomEvent("cartpaper:open-quote", { detail: { requestType: "mostre", bagType: "Kraft Clasic" } }));

  await userEvent.type(await screen.findByLabelText("Nume"), "Ana Popescu");
  await userEvent.type(screen.getByLabelText("E-mail"), "ana@example.com");
  await userEvent.selectOptions(screen.getByLabelText("Tip pungă"), "Kraft Clasic");
  await userEvent.type(screen.getByLabelText("Cantitate estimată"), "500");
  await userEvent.click(screen.getByLabelText(/Am citit/));
  await userEvent.click(screen.getByRole("button", { name: "Trimite cererea" }));

  await waitFor(() => expect(screen.getByRole("button", { name: "Trimite cererea" })).not.toBeDisabled());
  expect(screen.getByText(/nu a putut fi trimisă momentan/i)).toBeInTheDocument();
});
