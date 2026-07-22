"use client";

/* eslint-disable @next/next/no-img-element -- Uploaded Blob URLs are local previews and cannot be optimized by next/image. */

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, Download, ImagePlus, RotateCcw, WandSparkles } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { mockupPresets } from "@/data/mockups";
import { useObjectUrl } from "@/hooks/useObjectUrl";
import { usePersonalizerSession } from "@/hooks/usePersonalizerSession";
import { detectTransparencyFromBlob } from "@/lib/image/detectTransparency";
import { exportMockupPng } from "@/lib/image/exportStage";
import { removeBackgroundLocal } from "@/lib/image/localRemovalClient";
import { sanitizeSvg } from "@/lib/image/sanitizeSvg";
import { decodeImageDimensions, resolutionWarning, validateFileMeta } from "@/lib/image/validateImage";
import type { BlendMode, LogoColorMode, LogoTransform, MockupId } from "@/types/mockup";
import { MockupStage } from "@/components/personalizer/MockupStage";

type LogoAsset = {
  name: string;
  blob: Blob;
  originalBlob: Blob;
  type: string;
  size: number;
  hasTransparency: boolean;
  warning?: string;
};

const steps = ["Logo", "Fundal", "Pungă", "Poziționare", "Previzualizare"] as const;
const defaultTransform: LogoTransform = { x: 600, y: 820, width: 360, rotation: 0, opacity: 1 };

export default function PersonalizerClient() {
  const [currentStep, setCurrentStep] = useState(0);
  const [logo, setLogo] = useState<LogoAsset | null>(null);
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [tolerance, setTolerance] = useState(34);
  const [feather, setFeather] = useState(2);
  const [exportUrl, setExportUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stored, setStored] = usePersonalizerSession({
    selectedMockupId: "kraft-classic",
    logoMode: "black",
    customColor: "#bdec14",
    blendMode: "automatic",
    transform: defaultTransform,
    backgroundMethod: "none",
  });
  const preset = mockupPresets.find((item) => item.id === stored.selectedMockupId) ?? mockupPresets[0];
  const logoUrl = useObjectUrl(logo?.blob ?? null);

  const canContinue = currentStep === 0 ? Boolean(logo) : true;
  const summary = useMemo(
    () =>
      `Logo ${Math.round(stored.transform.width / 6)}% din lățimea zonei de tipar, rotire ${Math.round(
        stored.transform.rotation,
      )} grade, opacitate ${Math.round(stored.transform.opacity * 100)}%.`,
    [stored.transform],
  );

  function updateStored(partial: Partial<typeof stored>) {
    setStored((current) => ({ ...current, ...partial }));
  }

  function resetForPreset(mockupId: MockupId) {
    const nextPreset = mockupPresets.find((item) => item.id === mockupId) ?? mockupPresets[0];
    updateStored({
      selectedMockupId: mockupId,
      logoMode: nextPreset.recommendedColorMode,
      blendMode: nextPreset.recommendedBlendMode,
      transform: { ...nextPreset.defaultLogo, opacity: 1 },
    });
  }

  async function handleFile(file: File) {
    setError("");
    setStatus("");
    const validation = validateFileMeta(file);
    if (!validation.ok) {
      setError(validation.message);
      return;
    }

    try {
      let blob: Blob = file;
      if (file.type === "image/svg+xml") {
        blob = new Blob([sanitizeSvg(await file.text())], { type: "image/svg+xml" });
      }
      const dimensions = await decodeImageDimensions(blob);
      const transparent = file.type === "image/svg+xml" ? true : await detectTransparencyFromBlob(blob);
      setLogo({
        name: file.name,
        blob,
        originalBlob: blob,
        type: file.type,
        size: file.size,
        hasTransparency: transparent,
        warning: transparent ? "Logo-ul are deja fundal transparent." : resolutionWarning(dimensions.width, dimensions.height),
      });
      updateStored({ backgroundMethod: transparent ? "transparent" : "none" });
      setStatus(transparent ? "Logo-ul are deja fundal transparent." : "Logo încărcat. Poți curăța fundalul la pasul următor.");
      setCurrentStep(transparent ? 2 : 1);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Fișierul nu a putut fi citit. Încearcă un alt export al logo-ului.");
    }
  }

  async function runLocalRemoval() {
    if (!logo) return;
    setProcessing(true);
    setError("");
    setStatus("Se elimină fundalul local...");

    try {
      const output = await removeBackgroundLocal(logo.blob, { tolerance, feather });
      setLogo((current) => current && { ...current, blob: output, hasTransparency: true, warning: "Fundal eliminat local." });
      updateStored({ backgroundMethod: "local" });
      setStatus("Fundal eliminat local. Verifică marginile înainte de export.");
    } catch {
      setError("Fundalul pare complex. Ajustează culoarea și toleranța sau folosește eliminarea avansată.");
    } finally {
      setProcessing(false);
    }
  }

  async function runAdvancedRemoval() {
    if (!logo) return;
    const confirmed = window.confirm(
      "Procesarea avansată trimite temporar fișierul către un furnizor extern. Continuă numai dacă ești de acord.",
    );
    if (!confirmed) return;

    setProcessing(true);
    setError("");
    setStatus("Se procesează avansat...");

    try {
      const form = new FormData();
      form.append("file", logo.blob, logo.name);
      const response = await fetch("/api/remove-background", { method: "POST", body: form });
      if (!response.ok) {
        const result = (await response.json()) as { message?: string };
        throw new Error(result.message);
      }
      const output = await response.blob();
      setLogo((current) => current && { ...current, blob: output, hasTransparency: true, warning: "Fundal eliminat avansat." });
      updateStored({ backgroundMethod: "advanced" });
      setStatus("Fundal eliminat avansat.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Fundalul nu a putut fi eliminat automat. Poți continua cu instrumentele locale.");
    } finally {
      setProcessing(false);
    }
  }

  function updateTransform(partial: Partial<LogoTransform>) {
    updateStored({ transform: { ...stored.transform, ...partial } });
  }

  function centerLogo() {
    const [topLeft, topRight, bottomRight, bottomLeft] = preset.printQuad;
    updateTransform({
      x: (topLeft.x + topRight.x + bottomRight.x + bottomLeft.x) / 4,
      y: (topLeft.y + topRight.y + bottomRight.y + bottomLeft.y) / 4,
      rotation: 0,
    });
  }

  function fitLogo() {
    const left = Math.min(...preset.printQuad.map((point) => point.x));
    const right = Math.max(...preset.printQuad.map((point) => point.x));
    updateTransform({ width: (right - left) * 0.56, rotation: 0 });
    centerLogo();
  }

  async function downloadSimulation() {
    if (!logoUrl) return;
    setProcessing(true);
    setStatus("Se pregătește exportul PNG...");
    setError("");

    try {
      const blob = await exportMockupPng({
        preset,
        logoSrc: logoUrl,
        transform: stored.transform,
        logoMode: stored.logoMode,
        customColor: stored.customColor,
        blendMode: stored.blendMode,
      }).catch(() =>
        exportMockupPng({
          preset,
          logoSrc: logoUrl,
          transform: stored.transform,
          logoMode: stored.logoMode,
          customColor: stored.customColor,
          blendMode: stored.blendMode,
          pixelRatio: 1,
        }),
      );
      const url = URL.createObjectURL(blob);
      setExportUrl((previous) => {
        if (previous) URL.revokeObjectURL(previous);
        return url;
      });
      const date = new Date().toISOString().slice(0, 10);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `cartpaper-simulare-${preset.id}-${date}.png`;
      anchor.click();
      setStatus("Simularea PNG a fost pregătită.");
    } catch {
      setError("Exportul nu poate fi generat pe acest dispozitiv. Încearcă din nou.");
    } finally {
      setProcessing(false);
    }
  }

  function openQuote() {
    window.dispatchEvent(
      new CustomEvent("cartpaper:open-quote", {
        detail: {
          bagType: preset.label,
          logoAttached: Boolean(logo),
          simulationAttached: Boolean(exportUrl),
          configuration: `${preset.label}; mod logo: ${stored.logoMode}; fundal: ${stored.backgroundMethod}; ${summary}`,
        },
      }),
    );
  }

  return (
    <div className="personalizerShell">
      <header className="personalizerTop">
        <Link href="/" className="backLink">
          <ArrowLeft aria-hidden="true" size={18} />
          Acasă
        </Link>
        <div>
          <p>Personalizator</p>
          <strong>
            Pasul {currentStep + 1} din {steps.length}
          </strong>
        </div>
      </header>

      <div className="stepProgress" aria-label="Progres personalizare">
        {steps.map((step, index) => (
          <button
            key={step}
            type="button"
            aria-current={index === currentStep ? "step" : undefined}
            disabled={index > currentStep + 1 && !logo}
            onClick={() => setCurrentStep(index)}
          >
            <span>{index + 1}</span>
            {step}
          </button>
        ))}
      </div>

      <div className="personalizerGrid">
        <section className="stepPanel" aria-live="polite">
          {currentStep === 0 ? (
            <StepLogo
              logo={logo}
              logoUrl={logoUrl}
              fileInputRef={fileInputRef}
              onFile={handleFile}
              onRemove={() => {
                setLogo(null);
                setExportUrl(null);
                setStatus("");
                updateStored({ backgroundMethod: "none" });
              }}
            />
          ) : null}
          {currentStep === 1 ? (
            <StepBackground
              logo={logo}
              logoUrl={logoUrl}
              tolerance={tolerance}
              feather={feather}
              processing={processing}
              onTolerance={setTolerance}
              onFeather={setFeather}
              onLocal={runLocalRemoval}
              onAdvanced={runAdvancedRemoval}
              onUndo={() => {
                if (!logo) return;
                setLogo({ ...logo, blob: logo.originalBlob, hasTransparency: false, warning: undefined });
                updateStored({ backgroundMethod: "none" });
              }}
            />
          ) : null}
          {currentStep === 2 ? <StepBag selected={preset.id} onSelect={resetForPreset} /> : null}
          {currentStep === 3 ? (
            <StepPlacement
              preset={preset}
              logoUrl={logoUrl}
              stored={stored}
              summary={summary}
              onStored={updateStored}
              onTransform={updateTransform}
              onCenter={centerLogo}
              onFit={fitLogo}
              onReset={() => updateStored({ transform: { ...preset.defaultLogo, opacity: 1 } })}
            />
          ) : null}
          {currentStep === 4 ? (
            <StepReview
              preset={preset}
              logoUrl={logoUrl}
              stored={stored}
              summary={summary}
              processing={processing}
              onDownload={downloadSimulation}
              onQuote={openQuote}
              onEdit={setCurrentStep}
            />
          ) : null}

          {status ? <p className="statusMessage">{status}</p> : null}
          {error ? <p className="statusMessage error">{error}</p> : null}
        </section>

        <aside className="previewRail" aria-label="Previzualizare curentă">
          <MockupStage
            preset={preset}
            logoUrl={logoUrl}
            transform={stored.transform}
            logoMode={stored.logoMode}
            customColor={stored.customColor}
            blendMode={stored.blendMode}
            editable={currentStep === 3}
            onTransformChange={(transform) => updateStored({ transform })}
          />
          <p className="previewSummary">{summary}</p>
        </aside>
      </div>

      <div className="stickyStepActions">
        <button className="button buttonGhost" type="button" disabled={currentStep === 0} onClick={() => setCurrentStep((step) => Math.max(0, step - 1))}>
          Înapoi
        </button>
        <button
          className="button buttonPrimary"
          type="button"
          disabled={!canContinue}
          onClick={() => setCurrentStep((step) => Math.min(steps.length - 1, step + 1))}
        >
          {currentStep === steps.length - 1 ? "Gata" : "Continuă"}
        </button>
      </div>
    </div>
  );
}

function StepLogo({
  logo,
  logoUrl,
  fileInputRef,
  onFile,
  onRemove,
}: {
  logo: LogoAsset | null;
  logoUrl: string | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFile: (file: File) => void;
  onRemove: () => void;
}) {
  return (
    <div className="stepContent">
      <p className="overline">LOGO</p>
      <h1>Încarcă logo-ul pentru simulare.</h1>
      <p>PNG, JPG, WEBP sau SVG. Maximum 10 MB.</p>
      <p className="privacyNote">Procesarea de bază are loc direct pe dispozitivul tău. Logo-ul nu este salvat pe server.</p>
      <input
        ref={fileInputRef}
        className="srOnly"
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onFile(file);
        }}
      />
      <button className="uploadZone" type="button" onClick={() => fileInputRef.current?.click()}>
        {logoUrl ? (
          <img src={logoUrl} alt="Previzualizarea logo-ului încărcat" />
        ) : (
          <>
            <ImagePlus aria-hidden="true" size={32} />
            <span>Alege fișierul</span>
          </>
        )}
      </button>
      {logo ? (
        <div className="inlineActions">
          <button className="button buttonSecondary" type="button" onClick={() => fileInputRef.current?.click()}>
            Înlocuiește
          </button>
          <button className="button buttonGhost" type="button" onClick={onRemove}>
            Elimină
          </button>
        </div>
      ) : null}
      {logo?.warning ? <p className="statusMessage">{logo.warning}</p> : null}
    </div>
  );
}

function StepBackground(props: {
  logo: LogoAsset | null;
  logoUrl: string | null;
  tolerance: number;
  feather: number;
  processing: boolean;
  onTolerance: (value: number) => void;
  onFeather: (value: number) => void;
  onLocal: () => void;
  onAdvanced: () => void;
  onUndo: () => void;
}) {
  return (
    <div className="stepContent">
      <p className="overline">FUNDAL</p>
      <h1>Curăță fundalul fără să pierzi detaliile logo-ului.</h1>
      <div className="beforeAfter">
        <div>
          <span>Înainte</span>
          {props.logoUrl ? <img src={props.logoUrl} alt="Logo înainte de curățare" /> : null}
        </div>
        <div>
          <span>După</span>
          {props.logoUrl ? <img src={props.logoUrl} alt="Logo după curățare" /> : null}
        </div>
      </div>
      {props.logo?.hasTransparency ? <p className="statusMessage">Logo-ul are deja fundal transparent.</p> : null}
      <label className="rangeField">
        Toleranță
        <input type="range" min="8" max="86" value={props.tolerance} onChange={(event) => props.onTolerance(Number(event.target.value))} />
      </label>
      <label className="rangeField">
        Feather
        <input type="range" min="0" max="8" value={props.feather} onChange={(event) => props.onFeather(Number(event.target.value))} />
      </label>
      <p className="privacyNote">
        Unele elemente ale logo-ului au aceeași culoare ca fundalul. Pentru cel mai bun rezultat, folosește un PNG transparent sau un SVG.
      </p>
      <div className="inlineActions">
        <button className="button buttonPrimary" type="button" disabled={props.processing || !props.logo} onClick={props.onLocal}>
          <WandSparkles aria-hidden="true" size={18} />
          Elimină local
        </button>
        <button className="button buttonSecondary" type="button" disabled={props.processing || !props.logo} onClick={props.onAdvanced}>
          Procesare avansată
        </button>
        <button className="button buttonGhost" type="button" disabled={!props.logo} onClick={props.onUndo}>
          Undo
        </button>
      </div>
    </div>
  );
}

function StepBag(props: { selected: MockupId; onSelect: (id: MockupId) => void }) {
  return (
    <div className="stepContent">
      <p className="overline">PUNGĂ</p>
      <h1>Alege suprafața pe care testăm logo-ul.</h1>
      <div className="mockupChoiceGrid">
        {mockupPresets.map((mockup) => (
          <button
            className="mockupChoice"
            type="button"
            key={mockup.id}
            aria-pressed={props.selected === mockup.id}
            onClick={() => props.onSelect(mockup.id)}
          >
            <Image src={mockup.thumbnailSrc} width={480} height={600} alt="" />
            <span>
              <strong>{mockup.label}</strong>
              <small>{mockup.shortDescription}</small>
            </span>
            {props.selected === mockup.id ? <Check aria-hidden="true" size={20} /> : null}
          </button>
        ))}
      </div>
    </div>
  );
}

function StepPlacement(props: {
  preset: (typeof mockupPresets)[number];
  logoUrl: string | null;
  stored: ReturnType<typeof usePersonalizerSession>[0];
  summary: string;
  onStored: (partial: Partial<ReturnType<typeof usePersonalizerSession>[0]>) => void;
  onTransform: (partial: Partial<LogoTransform>) => void;
  onCenter: () => void;
  onFit: () => void;
  onReset: () => void;
}) {
  return (
    <div className="stepContent placementStep">
      <p className="overline">POZIȚIONARE</p>
      <h1>Așază logo-ul în zona de tipar.</h1>
      <div className="mobilePreview">
        <MockupStage
          preset={props.preset}
          logoUrl={props.logoUrl}
          transform={props.stored.transform}
          logoMode={props.stored.logoMode}
          customColor={props.stored.customColor}
          blendMode={props.stored.blendMode}
          editable
          onTransformChange={(transform) => props.onStored({ transform })}
        />
      </div>
      <p className="previewSummary">{props.summary}</p>
      <div className="segmentedControl" aria-label="Mod culoare logo">
        {[
          ["original", "Culori originale"],
          ["black", "Negru"],
          ["white", "Alb"],
          ["lime", "Verde Cartpaper"],
          ["custom", "Culoare personalizată"],
        ].map(([id, label]) => (
          <button
            key={id}
            type="button"
            aria-pressed={props.stored.logoMode === id}
            onClick={() => props.onStored({ logoMode: id as LogoColorMode })}
          >
            {label}
          </button>
        ))}
      </div>
      {props.stored.logoMode === "custom" ? (
        <label className="colorField">
          Culoare
          <input type="color" value={props.stored.customColor} onChange={(event) => props.onStored({ customColor: event.target.value })} />
        </label>
      ) : null}
      <label className="rangeField">
        Dimensiune
        <input type="range" min="120" max="720" value={props.stored.transform.width} onChange={(event) => props.onTransform({ width: Number(event.target.value) })} />
      </label>
      <label className="rangeField">
        Rotire
        <input type="range" min="-35" max="35" value={props.stored.transform.rotation} onChange={(event) => props.onTransform({ rotation: Number(event.target.value) })} />
      </label>
      <label className="rangeField">
        Opacitate
        <input type="range" min="0.35" max="1" step="0.01" value={props.stored.transform.opacity} onChange={(event) => props.onTransform({ opacity: Number(event.target.value) })} />
      </label>
      <details className="advancedOptions">
        <summary>Opțiuni avansate</summary>
        <label className="field">
          <span>Blend mode</span>
          <select value={props.stored.blendMode} onChange={(event) => props.onStored({ blendMode: event.target.value as BlendMode })}>
            <option value="automatic">Automat</option>
            <option value="normal">Normal</option>
            <option value="multiply">Multiply</option>
            <option value="screen">Screen</option>
          </select>
        </label>
      </details>
      <div className="inlineActions">
        <button className="button buttonSecondary" type="button" onClick={props.onCenter}>
          Centrează
        </button>
        <button className="button buttonSecondary" type="button" onClick={props.onFit}>
          Potrivește
        </button>
        <button className="button buttonGhost" type="button" onClick={props.onReset}>
          <RotateCcw aria-hidden="true" size={18} />
          Resetează
        </button>
      </div>
    </div>
  );
}

function StepReview(props: {
  preset: (typeof mockupPresets)[number];
  logoUrl: string | null;
  stored: ReturnType<typeof usePersonalizerSession>[0];
  summary: string;
  processing: boolean;
  onDownload: () => void;
  onQuote: () => void;
  onEdit: (step: number) => void;
}) {
  return (
    <div className="stepContent">
      <p className="overline">PREVIZUALIZARE</p>
      <h1>Verifică simularea înainte de ofertă.</h1>
      <MockupStage
        preset={props.preset}
        logoUrl={props.logoUrl}
        transform={props.stored.transform}
        logoMode={props.stored.logoMode}
        customColor={props.stored.customColor}
        blendMode={props.stored.blendMode}
      />
      <dl className="reviewList">
        <div>
          <dt>Pungă</dt>
          <dd>{props.preset.label}</dd>
        </div>
        <div>
          <dt>Mod logo</dt>
          <dd>{props.stored.logoMode}</dd>
        </div>
        <div>
          <dt>Fundal</dt>
          <dd>{props.stored.backgroundMethod}</dd>
        </div>
        <div>
          <dt>Poziționare</dt>
          <dd>{props.summary}</dd>
        </div>
      </dl>
      <p className="privacyNote">Simulare orientativă. Dimensiunea, poziționarea și culorile finale se confirmă în bunul de tipar.</p>
      <div className="inlineActions">
        <button className="button buttonPrimary" type="button" disabled={!props.logoUrl || props.processing} onClick={props.onDownload}>
          <Download aria-hidden="true" size={18} />
          Descarcă simularea
        </button>
        <button className="button buttonSecondary" type="button" onClick={props.onQuote}>
          Adaugă la cererea de ofertă
        </button>
      </div>
      <div className="editLinks">
        {[0, 1, 2, 3].map((step) => (
          <button type="button" key={step} onClick={() => props.onEdit(step)}>
            Editează {steps[step].toLowerCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
