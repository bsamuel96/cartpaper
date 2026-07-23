import { z } from "zod";

export const quoteSchema = z.object({
  requestType: z.enum(["oferta", "mostre"]).default("oferta"),
  name: z.string().trim().min(2, "Completează numele."),
  company: z.string().trim().optional(),
  email: z.string().trim().email("Adresa de e-mail nu este validă."),
  phone: z.string().trim().min(6, "Completează un număr de telefon valid.").optional().or(z.literal("")),
  bagType: z.string().trim().min(1, "Alege tipul pungii."),
  quantity: z.string().trim().min(1, "Completează cantitatea estimată."),
  dimensions: z.string().trim().optional(),
  handleType: z.string().trim().optional(),
  finish: z.string().trim().optional(),
  colorCount: z.string().trim().optional(),
  deadline: z.string().trim().optional(),
  message: z.string().trim().optional(),
  logoAttached: z.boolean().default(false),
  simulationAttached: z.boolean().default(false),
  privacyAccepted: z.literal(true, {
    message: "Confirmă că ai citit informațiile despre confidențialitate.",
  }),
  website: z.string().max(0, "Cererea nu a putut fi trimisă."),
  configuration: z.string().trim().optional(),
});

export type QuotePayload = z.infer<typeof quoteSchema>;

export function buildMailtoFallback(payload: QuotePayload, to: string) {
  const subject = encodeURIComponent(
    `${payload.requestType === "mostre" ? "Cerere kit de mostre" : "Cerere ofertă"} Cartpaper - ${payload.company || payload.name}`,
  );
  const body = encodeURIComponent(
    [
      `Tip cerere: ${payload.requestType === "mostre" ? "kit de mostre" : "ofertă"}`,
      `Nume: ${payload.name}`,
      `Companie: ${payload.company || "-"}`,
      `E-mail: ${payload.email}`,
      `Telefon: ${payload.phone || "-"}`,
      `Tip pungă: ${payload.bagType}`,
      `Cantitate: ${payload.quantity}`,
      `Dimensiuni: ${payload.dimensions || "-"}`,
      `Mâner: ${payload.handleType || "-"}`,
      `Finisaj: ${payload.finish || "-"}`,
      `Număr culori: ${payload.colorCount || "-"}`,
      `Termen: ${payload.deadline || "-"}`,
      `Logo atașat: ${payload.logoAttached ? "da" : "nu"}`,
      `Simulare atașată: ${payload.simulationAttached ? "da" : "nu"}`,
      `Configurație: ${payload.configuration || "-"}`,
      "",
      payload.message || "",
    ].join("\n"),
  );

  return `mailto:${encodeURIComponent(to)}?subject=${subject}&body=${body}`;
}
