import { expect, it } from "vitest";
import { quoteSchema } from "@/lib/validation/quote";

it("validates a complete quote payload", () => {
  const result = quoteSchema.safeParse({
    name: "Ana Popescu",
    company: "Atelier",
    email: "ana@example.com",
    phone: "0712345678",
    bagType: "Kraft Clasic",
    quantity: "500",
    dimensions: "",
    handleType: "",
    finish: "",
    colorCount: "",
    deadline: "",
    message: "",
    logoAttached: true,
    simulationAttached: false,
    privacyAccepted: true,
    website: "",
    configuration: "",
  });

  expect(result.success).toBe(true);
});

it("rejects false privacy acknowledgement", () => {
  const result = quoteSchema.safeParse({
    name: "Ana Popescu",
    email: "ana@example.com",
    bagType: "Kraft Clasic",
    quantity: "500",
    privacyAccepted: false,
    website: "",
  });

  expect(result.success).toBe(false);
});
