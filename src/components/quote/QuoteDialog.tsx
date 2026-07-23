"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { quoteSchema, type QuotePayload } from "@/lib/validation/quote";

type FormState = Record<keyof QuotePayload, string | boolean>;

export type QuoteDialogDetail = Partial<{
  requestType: QuotePayload["requestType"];
  bagType: string;
  finish: string;
  message: string;
  configuration: string;
  logoAttached: boolean;
  simulationAttached: boolean;
}>;

const initialForm: FormState = {
  requestType: "oferta",
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
      const customEvent = event as CustomEvent<QuoteDialogDetail | undefined>;
      setForm((current) => ({
        ...current,
        requestType: customEvent.detail?.requestType ?? current.requestType,
        configuration: customEvent.detail?.configuration ?? current.configuration,
        bagType: customEvent.detail?.bagType ?? current.bagType,
        finish: customEvent.detail?.finish ?? current.finish,
        message: customEvent.detail?.message ?? current.message,
        logoAttached: customEvent.detail?.logoAttached ?? current.logoAttached,
        simulationAttached: customEvent.detail?.simulationAttached ?? current.simulationAttached,
      }));
      setStatus("idle");
      setMessage("");
      setFallbackHref("");
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
        closeDialog();
      }
      if (event.key === "Tab" && dialogRef.current) {
        const focusables = Array.from(dialogRef.current.querySelectorAll<HTMLElement>("button, input, textarea, select, a"));
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function closeDialog() {
    setOpen(false);
    lastFocusRef.current?.focus();
  }

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

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const result = (await response.json().catch(() => null)) as {
        message?: string;
        mailto?: string;
        errors?: Record<string, string[]>;
      } | null;

      if (result?.errors) {
        setErrors(
          Object.fromEntries(
            Object.entries(result.errors).flatMap(([key, values]) => (values?.[0] ? [[key, values[0]]] : [])),
          ),
        );
      }

      setMessage(result?.message ?? "Cererea nu a putut fi trimisă momentan.");
      setFallbackHref(result?.mailto ?? "");
      setStatus(response.ok ? "success" : "error");
    } catch {
      setMessage("Cererea nu a putut fi trimisă momentan. Verifică conexiunea și încearcă din nou.");
      setStatus("error");
    }
  }

  if (!open) return null;

  const title = form.requestType === "mostre" ? "Cerere kit de mostre" : "Cerere de ofertă";

  return (
    <div className="modalLayer" role="presentation" onMouseDown={closeDialog}>
      <div
        className="modalPanel quotePanel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="quote-title"
        ref={dialogRef}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modalHeader">
          <h2 id="quote-title">{title}</h2>
          <button className="iconButton" type="button" aria-label="Închide" onClick={closeDialog}>
            ×
          </button>
        </div>
        <form className="quoteForm" onSubmit={submit}>
          <input
            className="honeypot"
            name="website"
            value={String(form.website)}
            onChange={(event) => setValue("website", event.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
          <label className="field" htmlFor="quote-requestType">
            <span>Tip cerere</span>
            <select
              id="quote-requestType"
              value={String(form.requestType)}
              onChange={(event) => setValue("requestType", event.target.value)}
            >
              <option value="oferta">Ofertă</option>
              <option value="mostre">Kit de mostre</option>
            </select>
          </label>
          <Field label="Nume" name="name" value={String(form.name)} error={errors.name} onChange={setValue} required />
          <Field label="Companie" name="company" value={String(form.company)} error={errors.company} onChange={setValue} />
          <Field label="E-mail" name="email" value={String(form.email)} error={errors.email} onChange={setValue} type="email" required />
          <Field label="Telefon" name="phone" value={String(form.phone)} error={errors.phone} onChange={setValue} type="tel" />
          <SelectField
            label="Tip pungă"
            name="bagType"
            value={String(form.bagType)}
            error={errors.bagType}
            onChange={setValue}
            required
            options={["Kraft Clasic", "Alb Premium", "Negru Elegant", "Culoare Intensă", "Alt model"]}
          />
          <Field
            label="Cantitate estimată"
            name="quantity"
            value={String(form.quantity)}
            error={errors.quantity}
            onChange={setValue}
            type="number"
            required
          />
          <Field label="Dimensiuni" name="dimensions" value={String(form.dimensions)} error={errors.dimensions} onChange={setValue} />
          <SelectField
            label="Mâner"
            name="handleType"
            value={String(form.handleType)}
            error={errors.handleType}
            onChange={setValue}
            options={["Mâner răsucit", "Mâner plat", "Panglică", "De confirmat"]}
          />
          <SelectField
            label="Finisaj"
            name="finish"
            value={String(form.finish)}
            error={errors.finish}
            onChange={setValue}
            options={["mat", "alb", "folie aurie", "De confirmat"]}
          />
          <Field label="Termen" name="deadline" value={String(form.deadline)} error={errors.deadline} onChange={setValue} type="date" />
          <label className="field fieldWide">
            <span>Mesaj</span>
            <textarea value={String(form.message)} onChange={(event) => setValue("message", event.target.value)} rows={4} />
          </label>
          <div className="attachmentState fieldWide" aria-live="polite">
            <span>Logo: {form.logoAttached ? "selectat local, nu se trimite automat" : "neatașat"}</span>
            <span>Simulare: {form.simulationAttached ? "generată local, atașeaz-o manual la e-mail" : "negenerată"}</span>
          </div>
          <label className="checkboxField fieldWide">
            <input
              type="checkbox"
              checked={Boolean(form.privacyAccepted)}
              onChange={(event) => setValue("privacyAccepted", event.target.checked)}
            />
            <span>
              Am citit <Link href="/politica-de-confidentialitate">politica de confidențialitate</Link> și sunt de acord să fiu
              contactat pentru această cerere.
            </span>
          </label>
          {errors.privacyAccepted ? <p className="formError fieldWide">{errors.privacyAccepted}</p> : null}
          <div className="modalActions fieldWide">
            <button className="button buttonGhost" type="button" onClick={closeDialog}>
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

function SelectField(props: {
  label: string;
  name: keyof QuotePayload;
  value: string;
  error?: string;
  required?: boolean;
  options: string[];
  onChange: (name: keyof QuotePayload, value: string) => void;
}) {
  const id = `quote-${props.name}`;

  return (
    <label className="field" htmlFor={id}>
      <span>{props.label}</span>
      <select
        id={id}
        value={props.value}
        required={props.required}
        aria-invalid={Boolean(props.error)}
        aria-describedby={props.error ? `${id}-error` : undefined}
        onChange={(event) => props.onChange(props.name, event.target.value)}
      >
        <option value="">Alege</option>
        {props.options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {props.error ? (
        <small className="formError" id={`${id}-error`}>
          {props.error}
        </small>
      ) : null}
    </label>
  );
}
