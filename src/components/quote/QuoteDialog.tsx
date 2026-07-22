"use client";

import { useEffect, useRef, useState } from "react";
import { quoteSchema, type QuotePayload } from "@/lib/validation/quote";

type FormState = Record<keyof QuotePayload, string | boolean>;

const initialForm: FormState = {
  name: "",
  company: "",
  email: "",
  phone: "",
  bagType: "",
  quantity: "",
  dimensions: "",
  handleType: "",
  finish: "",
  colorCount: "",
  deadline: "",
  message: "",
  logoAttached: false,
  simulationAttached: false,
  privacyAccepted: false,
  website: "",
  configuration: "",
};

export function QuoteDialog() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [fallbackHref, setFallbackHref] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onOpen = (event: Event) => {
      lastFocusRef.current = document.activeElement as HTMLElement;
      const customEvent = event as CustomEvent<{ configuration?: string; bagType?: string; logoAttached?: boolean; simulationAttached?: boolean }>;
      setForm((current) => ({
        ...current,
        configuration: customEvent.detail?.configuration ?? current.configuration,
        bagType: customEvent.detail?.bagType ?? current.bagType,
        logoAttached: customEvent.detail?.logoAttached ?? current.logoAttached,
        simulationAttached: customEvent.detail?.simulationAttached ?? current.simulationAttached,
      }));
      setOpen(true);
    };
    window.addEventListener("cartpaper:open-quote", onOpen);
    return () => window.removeEventListener("cartpaper:open-quote", onOpen);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.querySelector<HTMLElement>("input, button, textarea, select")?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        lastFocusRef.current?.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function setValue(name: keyof QuotePayload, value: string | boolean) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");
    setFallbackHref("");

    const parsed = quoteSchema.safeParse(form);
    if (!parsed.success) {
      setErrors(Object.fromEntries(parsed.error.issues.map((issue) => [issue.path.join("."), issue.message])));
      setStatus("idle");
      return;
    }

    setErrors({});
    const response = await fetch("/api/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });
    const result = (await response.json()) as { message: string; mailto?: string };
    setMessage(result.message);
    setFallbackHref(result.mailto ?? "");
    setStatus(response.ok ? "success" : "error");
  }

  if (!open) return null;

  return (
    <div className="modalLayer" role="presentation" onMouseDown={() => setOpen(false)}>
      <div
        className="modalPanel quotePanel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="quote-title"
        ref={dialogRef}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modalHeader">
          <h2 id="quote-title">Cerere de ofertă</h2>
          <button className="iconButton" type="button" aria-label="Închide" onClick={() => setOpen(false)}>
            ×
          </button>
        </div>
        <form className="quoteForm" onSubmit={submit}>
          <input className="honeypot" name="website" value={String(form.website)} onChange={(event) => setValue("website", event.target.value)} tabIndex={-1} autoComplete="off" />
          <Field label="Nume" name="name" value={String(form.name)} error={errors.name} onChange={setValue} required />
          <Field label="Companie" name="company" value={String(form.company)} error={errors.company} onChange={setValue} />
          <Field label="E-mail" name="email" value={String(form.email)} error={errors.email} onChange={setValue} type="email" required />
          <Field label="Telefon" name="phone" value={String(form.phone)} error={errors.phone} onChange={setValue} />
          <Field label="Tipul pungii" name="bagType" value={String(form.bagType)} error={errors.bagType} onChange={setValue} required />
          <Field label="Cantitate estimată" name="quantity" value={String(form.quantity)} error={errors.quantity} onChange={setValue} required />
          <Field label="Dimensiuni dorite" name="dimensions" value={String(form.dimensions)} error={errors.dimensions} onChange={setValue} />
          <Field label="Tip de mâner" name="handleType" value={String(form.handleType)} error={errors.handleType} onChange={setValue} />
          <Field label="Finisaj" name="finish" value={String(form.finish)} error={errors.finish} onChange={setValue} />
          <Field label="Număr de culori" name="colorCount" value={String(form.colorCount)} error={errors.colorCount} onChange={setValue} />
          <Field label="Termen orientativ" name="deadline" value={String(form.deadline)} error={errors.deadline} onChange={setValue} />
          <label className="field fieldWide">
            <span>Mesaj</span>
            <textarea value={String(form.message)} onChange={(event) => setValue("message", event.target.value)} rows={4} />
          </label>
          <div className="attachmentState" aria-live="polite">
            <span>Logo: {form.logoAttached ? "selectat" : "neatașat"}</span>
            <span>Simulare: {form.simulationAttached ? "pregătită" : "neexportată"}</span>
          </div>
          <label className="checkboxField fieldWide">
            <input
              type="checkbox"
              checked={Boolean(form.privacyAccepted)}
              onChange={(event) => setValue("privacyAccepted", event.target.checked)}
            />
            <span>Am citit informațiile despre confidențialitate și sunt de acord să fiu contactat pentru ofertă.</span>
          </label>
          {errors.privacyAccepted ? <p className="formError fieldWide">{errors.privacyAccepted}</p> : null}
          <div className="modalActions fieldWide">
            <button className="button buttonGhost" type="button" onClick={() => setOpen(false)}>
              Închide
            </button>
            <button className="button buttonPrimary" type="submit" disabled={status === "loading"}>
              {status === "loading" ? "Se trimite..." : "Trimite cererea"}
            </button>
          </div>
          {message ? (
            <p className={`formStatus fieldWide ${status === "success" ? "success" : "error"}`} aria-live="polite">
              {message}
              {fallbackHref ? (
                <>
                  {" "}
                  <a href={fallbackHref}>Deschide e-mailul pregătit</a>
                </>
              ) : null}
            </p>
          ) : null}
        </form>
      </div>
    </div>
  );
}

function Field(props: {
  label: string;
  name: keyof QuotePayload;
  value: string;
  error?: string;
  required?: boolean;
  type?: string;
  onChange: (name: keyof QuotePayload, value: string) => void;
}) {
  const id = `quote-${props.name}`;

  return (
    <label className="field" htmlFor={id}>
      <span>{props.label}</span>
      <input
        id={id}
        type={props.type ?? "text"}
        value={props.value}
        required={props.required}
        aria-invalid={Boolean(props.error)}
        aria-describedby={props.error ? `${id}-error` : undefined}
        onChange={(event) => props.onChange(props.name, event.target.value)}
      />
      {props.error ? (
        <small className="formError" id={`${id}-error`}>
          {props.error}
        </small>
      ) : null}
    </label>
  );
}
