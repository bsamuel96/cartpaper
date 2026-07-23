"use client";

/* eslint-disable @next/next/no-img-element -- Uploaded Blob URLs are local previews and cannot be optimized by next/image. */

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Download,
  Eye,
  ImagePlus,
  Maximize2,
  RotateCcw,
  Save,
  Share2,
  WandSparkles,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getMockupPreset, mockupPresets } from "@/data/mockups";
import { useObjectUrl } from "@/hooks/useObjectUrl";
import { type StoredPersonalizerState, usePersonalizerSession } from "@/hooks/usePersonalizerSession";
import { detectTransparencyFromBlob } from "@/lib/image/detectTransparency";
import { exportMockupPng } from "@/lib/image/exportStage";
import { removeBackgroundLocal } from "@/lib/image/localRemovalClient";
import { sanitizeSvg } from "@/lib/image/sanitizeSvg";
import { decodeImageDimensions, resolutionWarning, validateFileMeta } from "@/lib/image/validateImage";
import { backgroundMethodLabels, logoColorLabels, printFinishLabels } from "@/lib/personalizer/labels";
import {
  centerTransform,
  clampTransformToPrintBounds,
  fitTransform,
  isMockupId,
  resetTransform,
  transformFromPreset,
  transformWidthPercent,
} from "@/lib/personalizer/transform";
import type { LogoColorMode, LogoTransform, MockupId, PrintFinish } from "@/types/mockup";
import { MockupStage } from "@/components/personalizer/MockupStage";

type LogoAsset = {
  name: string;
  blob: Blob;
  originalBlob: Blob;
  type: string;
  size: number;
  aspect: number;
  hasTransparency: boolean;
  originalHasTransparency: boolean;
  warning?: string;
};

type SavedProjectRecord = {
  id: "latest";
  updatedAt: string;
  logo: Blob;
  originalLogo: Blob;
  logoName: string;
  logoType: string;
  logoAspect: number;
  hasTransparency: boolean;
  originalHasTransparency: boolean;
  configuration: StoredPersonalizerState;
};

const steps = ["Logo", "Personalizează", "Finalizează"] as const;
const finishOptions: Array<[PrintFinish, string]> = [
  ["matte-ink", "Mat"],
  ["white-ink", "Alb"],
  ["gold-foil", "Folie aurie"],
];

function initialTransforms() {
  return Object.fromEntries(mockupPresets.map((preset) => [preset.id, transformFromPreset(preset)])) as Record<
    MockupId,
    LogoTransform
  >;
}

function initialStoredState(): StoredPersonalizerState {
  const firstPreset = mockupPresets[0];
  return {
    selectedMockupId: firstPreset.id,
    logoMode: firstPreset.recommendedColorMode,
    customColor: "#bded15",
    blendMode: firstPreset.recommendedBlendMode,
    printFinish: firstPreset.defaultFinish,
    transformsByMockup: initialTransforms(),
    backgroundMethod: "none",
  };
}

async function sampleBackgroundColor(blob: Blob) {
  const bitmap = await createImageBitmap(blob);
  const canvas = document.createElement("canvas");
  canvas.width = 8;
  canvas.height = 8;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) {
    bitmap.close();
    return null;
  }

  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
  const samples = [
    0,
    (canvas.width - 1) * 4,
    (canvas.width * (canvas.height - 1)) * 4,
    (canvas.width * canvas.height - 1) * 4,
  ];
  const total = samples.reduce(
    (acc, index) => {
      acc.r += pixels[index] ?? 0;
      acc.g += pixels[index + 1] ?? 0;
      acc.b += pixels[index + 2] ?? 0;
      return acc;
    },
    { r: 0, g: 0, b: 0 },
  );

  const toHex = (value: number) => Math.round(value / samples.length).toString(16).padStart(2, "0");
  return `#${toHex(total.r)}${toHex(total.g)}${toHex(total.b)}`;
}

export default function PersonalizerClient() {
  const [currentStep, setCurrentStep] = useState(0);
  const [logo, setLogo] = useState<LogoAsset | null>(null);
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [tolerance, setTolerance] = useState(34);
  const [feather, setFeather] = useState(2);
  const [backgroundColor, setBackgroundColor] = useState<string | null>(null);
  const [advancedAvailable, setAdvancedAvailable] = useState(false);
  const [advancedConsent, setAdvancedConsent] = useState(false);
  const [showTransparentTools, setShowTransparentTools] = useState(false);
  const [exportUrl, setExportUrl] = useState<string | null>(null);
  const [exportBlob, setExportBlob] = useState<Blob | null>(null);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const [savedProject, setSavedProject] = useState<SavedProjectRecord | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const urlPresetAppliedRef = useRef(false);
  const [stored, setStored] = usePersonalizerSession(initialStoredState());
  const preset = getMockupPreset(stored.selectedMockupId);
  const transform = stored.transformsByMockup[preset.id] ?? transformFromPreset(preset);
  const logoUrl = useObjectUrl(logo?.blob ?? null);
  const originalLogoUrl = useObjectUrl(logo?.originalBlob ?? null);
  const logoAspect = logo?.aspect ?? 1;

  const clearExport = useCallback(() => {
    setExportUrl((previous) => {
      if (previous) URL.revokeObjectURL(previous);
      return null;
    });
    setExportBlob(null);
  }, []);

  const updateStored = useCallback(
    (next: Partial<StoredPersonalizerState> | ((current: StoredPersonalizerState) => StoredPersonalizerState)) => {
      clearExport();
      setStored((current) => (typeof next === "function" ? next(current) : { ...current, ...next }));
    },
    [clearExport, setStored],
  );

  const updateActiveTransform = useCallback(
    (next: Partial<LogoTransform> | ((current: LogoTransform) => LogoTransform)) => {
      updateStored((current) => {
        const activePreset = getMockupPreset(current.selectedMockupId);
        const currentTransform = current.transformsByMockup[activePreset.id] ?? transformFromPreset(activePreset);
        const rawTransform = typeof next === "function" ? next(currentTransform) : { ...currentTransform, ...next };

        return {
          ...current,
          transformsByMockup: {
            ...current.transformsByMockup,
            [activePreset.id]: clampTransformToPrintBounds(rawTransform, activePreset, logoAspect),
          },
        };
      });
    },
    [logoAspect, updateStored],
  );

  const summary = useMemo(
    () =>
      [
        `Pungă: ${preset.label}`,
        `Logo: ${logoColorLabels[stored.logoMode]}`,
        `Finisaj: ${printFinishLabels[stored.printFinish]}`,
        `Fundal logo: ${backgroundMethodLabels[stored.backgroundMethod]}`,
        `Dimensiune: aproximativ ${transformWidthPercent(transform, preset)}% din zona de tipar`,
        `Rotire: ${Math.round(transform.rotation)}°`,
      ].join("\n"),
    [preset, stored.backgroundMethod, stored.logoMode, stored.printFinish, transform],
  );

  useEffect(() => {
    return () => {
      if (exportUrl) URL.revokeObjectURL(exportUrl);
    };
  }, [exportUrl]);

  useEffect(() => {
    fetch("/api/remove-background", { method: "GET" })
      .then((response) => response.json())
      .then((result: { enabled?: boolean }) => setAdvancedAvailable(Boolean(result.enabled)))
      .catch(() => setAdvancedAvailable(false));
  }, []);

  useEffect(() => {
    loadProjectRecord()
      .then((record) => setSavedProject(record))
      .catch(() => setSavedProject(null));
  }, []);

  useEffect(() => {
    if (urlPresetAppliedRef.current) return;

    const params = new URLSearchParams(window.location.search);
    const model = params.get("model");
    if (!isMockupId(model)) return;

    const nextPreset = getMockupPreset(model);
    const timeout = window.setTimeout(() => {
      if (urlPresetAppliedRef.current) return;
      urlPresetAppliedRef.current = true;
      updateStored((current) => ({
        ...current,
        selectedMockupId: model,
        logoMode: nextPreset.recommendedColorMode,
        blendMode: nextPreset.recommendedBlendMode,
        printFinish: nextPreset.defaultFinish,
        transformsByMockup: {
          ...current.transformsByMockup,
          [model]: current.transformsByMockup[model] ?? transformFromPreset(nextPreset),
        },
      }));
      setStatus(`Model selectat din colecție: ${nextPreset.label}.`);
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [updateStored]);

  async function handleFile(file: File) {
    clearExport();
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
      const aspect = dimensions.width > 0 ? dimensions.height / dimensions.width : 1;
      const transparent = file.type === "image/svg+xml" ? true : await detectTransparencyFromBlob(blob);
      const sampledColor = transparent ? null : await sampleBackgroundColor(blob).catch(() => null);
      setLogo({
        name: file.name,
        blob,
        originalBlob: blob,
        type: file.type,
        size: file.size,
        aspect,
        hasTransparency: transparent,
        originalHasTransparency: transparent,
        warning: transparent ? "Fundal deja transparent." : resolutionWarning(dimensions.width, dimensions.height),
      });
      setBackgroundColor(sampledColor);
      updateStored({ backgroundMethod: transparent ? "transparent" : "none" });
      setShowTransparentTools(false);
      setStatus(
        transparent
          ? "Fundal deja transparent. Poți continua cu personalizarea."
          : "Logo încărcat. Poți elimina fundalul înainte de personalizare.",
      );
      if (transparent) setCurrentStep(1);
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
      const output = await removeBackgroundLocal(logo.originalBlob, { tolerance, feather });
      setLogo((current) =>
        current
          ? {
              ...current,
              blob: output,
              hasTransparency: true,
              warning: "Fundal eliminat local.",
            }
          : current,
      );
      clearExport();
      updateStored({ backgroundMethod: "local" });
      setStatus("Fundal eliminat local. Verifică marginile înainte de export.");
    } catch {
      setError("Fundalul pare complex. Ajustează toleranța sau folosește un PNG transparent.");
    } finally {
      setProcessing(false);
    }
  }

  async function runAdvancedRemoval() {
    if (!logo || !advancedAvailable || !advancedConsent) return;
    setProcessing(true);
    setError("");
    setStatus("Se procesează avansat...");

    try {
      const form = new FormData();
      form.append("file", logo.originalBlob, logo.name);
      const response = await fetch("/api/remove-background", { method: "POST", body: form });
      if (!response.ok) {
        const result = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(result?.message);
      }
      const output = await response.blob();
      setLogo((current) =>
        current
          ? {
              ...current,
              blob: output,
              hasTransparency: true,
              warning: "Fundal eliminat avansat.",
            }
          : current,
      );
      clearExport();
      updateStored({ backgroundMethod: "advanced" });
      setStatus("Fundal eliminat avansat.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Fundalul nu a putut fi eliminat automat. Poți continua cu instrumentele locale.");
    } finally {
      setProcessing(false);
    }
  }

  function restoreOriginalLogo() {
    if (!logo) return;
    clearExport();
    setLogo({
      ...logo,
      blob: logo.originalBlob,
      hasTransparency: logo.originalHasTransparency,
      warning: logo.originalHasTransparency ? "Fundal deja transparent." : undefined,
    });
    updateStored({ backgroundMethod: logo.originalHasTransparency ? "transparent" : "none" });
    setStatus("Logo-ul original a fost restaurat.");
  }

  function selectPreset(mockupId: MockupId) {
    const nextPreset = getMockupPreset(mockupId);
    updateStored((current) => ({
      ...current,
      selectedMockupId: mockupId,
      logoMode: nextPreset.recommendedColorMode,
      blendMode: nextPreset.recommendedBlendMode,
      printFinish: nextPreset.defaultFinish,
      transformsByMockup: {
        ...current.transformsByMockup,
        [mockupId]: current.transformsByMockup[mockupId] ?? transformFromPreset(nextPreset),
      },
    }));
    setStatus(`${nextPreset.label} este selectată.`);
  }

  async function createCurrentExport() {
    if (!logoUrl) throw new Error("Încarcă logo-ul înainte de export.");

    return exportMockupPng({
      preset,
      logoSrc: logoUrl,
      transform,
      logoMode: stored.logoMode,
      customColor: stored.customColor,
      blendMode: stored.blendMode,
      printFinish: stored.printFinish,
    }).catch(() =>
      exportMockupPng({
        preset,
        logoSrc: logoUrl,
        transform,
        logoMode: stored.logoMode,
        customColor: stored.customColor,
        blendMode: stored.blendMode,
        printFinish: stored.printFinish,
        pixelRatio: 1,
      }),
    );
  }

  function downloadBlob(blob: Blob) {
    const url = URL.createObjectURL(blob);
    setExportUrl((previous) => {
      if (previous) URL.revokeObjectURL(previous);
      return url;
    });
    setExportBlob(blob);
    const date = new Date().toISOString().slice(0, 10);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `cartpaper-simulare-${preset.id}-${date}.png`;
    anchor.click();
  }

  async function downloadSimulation() {
    setProcessing(true);
    setStatus("Se pregătește exportul PNG...");
    setError("");

    try {
      const blob = await createCurrentExport();
      downloadBlob(blob);
      setStatus("Simularea PNG a fost descărcată.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Exportul nu poate fi generat pe acest dispozitiv. Încearcă din nou.");
    } finally {
      setProcessing(false);
    }
  }

  async function shareSimulation() {
    setProcessing(true);
    setStatus("Se pregătește partajarea...");
    setError("");

    try {
      const blob = await createCurrentExport();
      setExportBlob(blob);
      const file = new File([blob], `cartpaper-simulare-${preset.id}.png`, { type: "image/png" });
      if (!navigator.share || !navigator.canShare?.({ files: [file] })) {
        downloadBlob(blob);
        setStatus("Partajarea directă nu este disponibilă în acest browser. Am pregătit descărcarea PNG.");
        return;
      }

      await navigator.share({
        title: "Simulare Cartpaper",
        text: `Simulare ${preset.label} cu finisaj ${printFinishLabels[stored.printFinish]}.`,
        files: [file],
      });
      setStatus("Simularea curentă a fost partajată.");
    } catch (caught) {
      if (caught instanceof DOMException && caught.name === "AbortError") {
        setStatus("Partajarea a fost anulată.");
      } else {
        setError("Partajarea nu a putut fi pornită. Poți descărca simularea PNG.");
      }
    } finally {
      setProcessing(false);
    }
  }

  function openQuote() {
    window.dispatchEvent(
      new CustomEvent("cartpaper:open-quote", {
        detail: {
          requestType: "oferta",
          bagType: preset.label,
          finish: printFinishLabels[stored.printFinish],
          logoAttached: Boolean(logo),
          simulationAttached: Boolean(exportBlob),
          configuration: summary,
          message: "Simularea nu este atașată automat la e-mail. Descarcă PNG-ul și atașează-l dacă trimiți cererea prin e-mail.",
        },
      }),
    );
  }

  async function saveProjectToDevice() {
    if (!logo) return;
    setSaveStatus("Se salvează local...");

    try {
      const record: SavedProjectRecord = {
        id: "latest",
        updatedAt: new Date().toISOString(),
        logo: logo.blob,
        originalLogo: logo.originalBlob,
        logoName: logo.name,
        logoType: logo.type,
        logoAspect: logo.aspect,
        hasTransparency: logo.hasTransparency,
        originalHasTransparency: logo.originalHasTransparency,
        configuration: stored,
      };
      await saveProjectRecord(record);
      setSavedProject(record);
      setSaveStatus("Proiect salvat pe acest dispozitiv.");
    } catch {
      setSaveStatus("Proiectul nu a putut fi salvat local în acest browser.");
    }
  }

  function restoreSavedProject() {
    if (!savedProject) return;
    if (logo && !window.confirm("Înlocuiești proiectul curent cu proiectul salvat pe acest dispozitiv?")) return;

    clearExport();
    setStored(savedProject.configuration);
    setLogo({
      name: savedProject.logoName,
      blob: savedProject.logo,
      originalBlob: savedProject.originalLogo,
      type: savedProject.logoType,
      size: savedProject.logo.size,
      aspect: savedProject.logoAspect,
      hasTransparency: savedProject.hasTransparency,
      originalHasTransparency: savedProject.originalHasTransparency,
      warning: savedProject.hasTransparency ? "Fundal deja transparent." : undefined,
    });
    setCurrentStep(1);
    setStatus("Proiectul salvat a fost restaurat.");
  }

  async function deleteSavedProject() {
    await deleteProjectRecord().catch(() => undefined);
    setSavedProject(null);
    setSaveStatus("Proiectul salvat a fost șters.");
  }

  const canContinue = currentStep === 0 ? Boolean(logo) : true;

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
            disabled={index > 0 && !logo}
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
              originalLogoUrl={originalLogoUrl}
              fileInputRef={fileInputRef}
              tolerance={tolerance}
              feather={feather}
              backgroundColor={backgroundColor}
              processing={processing}
              advancedAvailable={advancedAvailable}
              advancedConsent={advancedConsent}
              showTransparentTools={showTransparentTools}
              savedProject={savedProject}
              onFile={handleFile}
              onRemove={() => {
                clearExport();
                setLogo(null);
                setStatus("");
                setError("");
                setBackgroundColor(null);
                updateStored({ backgroundMethod: "none" });
              }}
              onTolerance={setTolerance}
              onFeather={setFeather}
              onRecommended={() => {
                setTolerance(34);
                setFeather(2);
              }}
              onLocal={runLocalRemoval}
              onAdvanced={runAdvancedRemoval}
              onAdvancedConsent={setAdvancedConsent}
              onRestoreOriginal={restoreOriginalLogo}
              onShowTransparentTools={() => setShowTransparentTools(true)}
              onRestoreSaved={restoreSavedProject}
              onDeleteSaved={deleteSavedProject}
            />
          ) : null}
          {currentStep === 1 ? (
            <StepPersonalize
              preset={preset}
              logoUrl={logoUrl}
              stored={stored}
              transform={transform}
              summary={summary}
              onSelectPreset={selectPreset}
              onStored={updateStored}
              onTransform={updateActiveTransform}
              onCenter={() => {
                setStatus("Logo centrat în zona de tipar.");
                updateActiveTransform((current) => centerTransform(current, preset, logoAspect));
              }}
              onFit={() => {
                setStatus("Logo potrivit în zona de tipar.");
                updateActiveTransform((current) => fitTransform(current, preset, logoAspect));
              }}
              onReset={() => {
                setStatus("Poziționarea a fost resetată.");
                updateActiveTransform(() => resetTransform(preset, logoAspect));
              }}
              onFullscreen={() => setFullscreenOpen(true)}
            />
          ) : null}
          {currentStep === 2 ? (
            <StepFinalize
              preset={preset}
              logoUrl={logoUrl}
              stored={stored}
              transform={transform}
              summary={summary}
              processing={processing}
              saveStatus={saveStatus}
              onDownload={downloadSimulation}
              onShare={shareSimulation}
              onSave={saveProjectToDevice}
              onEdit={setCurrentStep}
            />
          ) : null}

          {status ? <p className="statusMessage">{status}</p> : null}
          {error ? <p className="statusMessage error">{error}</p> : null}
        </section>

        {currentStep !== 1 ? (
          <aside className="previewRail" aria-label="Previzualizare curentă">
            <MockupStage
              preset={preset}
              logoUrl={logoUrl}
              transform={transform}
              logoMode={stored.logoMode}
              customColor={stored.customColor}
              blendMode={stored.blendMode}
              printFinish={stored.printFinish}
            />
            <p className="previewSummary">{summary}</p>
          </aside>
        ) : null}
      </div>

      <div className="stickyStepActions">
        {currentStep < steps.length - 1 ? (
          <>
            <button
              className="button buttonGhost"
              type="button"
              disabled={currentStep === 0}
              onClick={() => setCurrentStep((step) => Math.max(0, step - 1))}
            >
              Înapoi
            </button>
            <button
              className="button buttonPrimary"
              type="button"
              disabled={!canContinue}
              onClick={() => setCurrentStep((step) => Math.min(steps.length - 1, step + 1))}
            >
              Continuă
            </button>
          </>
        ) : (
          <>
            <button className="button buttonSecondary" type="button" disabled={!logoUrl || processing} onClick={downloadSimulation}>
              <Download aria-hidden="true" size={18} />
              Descarcă simularea
            </button>
            <button className="button buttonPrimary" type="button" onClick={openQuote}>
              Cere ofertă
            </button>
          </>
        )}
      </div>

      {fullscreenOpen ? (
        <PreviewDialog title="Previzualizare pe tot ecranul" onClose={() => setFullscreenOpen(false)}>
          <MockupStage
            preset={preset}
            logoUrl={logoUrl}
            transform={transform}
            logoMode={stored.logoMode}
            customColor={stored.customColor}
            blendMode={stored.blendMode}
            printFinish={stored.printFinish}
          />
        </PreviewDialog>
      ) : null}
    </div>
  );
}

function StepLogo({
  logo,
  logoUrl,
  originalLogoUrl,
  fileInputRef,
  tolerance,
  feather,
  backgroundColor,
  processing,
  advancedAvailable,
  advancedConsent,
  showTransparentTools,
  savedProject,
  onFile,
  onRemove,
  onTolerance,
  onFeather,
  onRecommended,
  onLocal,
  onAdvanced,
  onAdvancedConsent,
  onRestoreOriginal,
  onShowTransparentTools,
  onRestoreSaved,
  onDeleteSaved,
}: {
  logo: LogoAsset | null;
  logoUrl: string | null;
  originalLogoUrl: string | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  tolerance: number;
  feather: number;
  backgroundColor: string | null;
  processing: boolean;
  advancedAvailable: boolean;
  advancedConsent: boolean;
  showTransparentTools: boolean;
  savedProject: SavedProjectRecord | null;
  onFile: (file: File) => void;
  onRemove: () => void;
  onTolerance: (value: number) => void;
  onFeather: (value: number) => void;
  onRecommended: () => void;
  onLocal: () => void;
  onAdvanced: () => void;
  onAdvancedConsent: (value: boolean) => void;
  onRestoreOriginal: () => void;
  onShowTransparentTools: () => void;
  onRestoreSaved: () => void;
  onDeleteSaved: () => void;
}) {
  const shouldShowBackgroundTools = Boolean(logo && (!logo.hasTransparency || showTransparentTools || !logo.originalHasTransparency));

  return (
    <div className="stepContent">
      <p className="overline">LOGO</p>
      <h1>Încarcă logo-ul pentru simulare.</h1>
      <p>PNG, JPG, WEBP sau SVG. Maximum 10 MB.</p>
      <p className="privacyNote">Procesarea locală are loc pe dispozitivul tău. Logo-ul nu este salvat pe server.</p>

      {savedProject && !logo ? (
        <div className="restoreCard">
          <strong>Ai un proiect salvat</strong>
          <span>
            {new Date(savedProject.updatedAt).toLocaleDateString("ro-RO")} · {getMockupPreset(savedProject.configuration.selectedMockupId).label}
          </span>
          <div className="inlineActions">
            <button className="button buttonSecondary" type="button" onClick={onRestoreSaved}>
              Continuă proiectul
            </button>
            <button className="button buttonGhost" type="button" onClick={onDeleteSaved}>
              Șterge
            </button>
          </div>
        </div>
      ) : null}

      <input
        ref={fileInputRef}
        className="srOnly"
        type="file"
        tabIndex={-1}
        aria-hidden="true"
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

      {logo && originalLogoUrl && logoUrl ? (
        <LogoComparison originalUrl={originalLogoUrl} processedUrl={logoUrl} />
      ) : null}

      {logo?.hasTransparency && !showTransparentTools ? (
        <div className="transparentNotice">
          <strong>Fundal deja transparent</strong>
          <button className="button buttonGhost" type="button" onClick={onShowTransparentTools}>
            Editează fundalul
          </button>
        </div>
      ) : null}

      {shouldShowBackgroundTools ? (
        <div className="backgroundToolPanel">
          {backgroundColor ? (
            <p className="detectedColor">
              Culoare fundal detectată <span style={{ background: backgroundColor }} /> <strong>{backgroundColor}</strong>
            </p>
          ) : null}
          <label className="rangeField">
            <span>Toleranță: {tolerance}</span>
            <input type="range" min="8" max="86" value={tolerance} onChange={(event) => onTolerance(Number(event.target.value))} />
          </label>
          <label className="rangeField">
            <span>Netezire margini: {feather}</span>
            <input type="range" min="0" max="8" value={feather} onChange={(event) => onFeather(Number(event.target.value))} />
          </label>
          <button className="button buttonSecondary" type="button" onClick={onRecommended}>
            Resetări recomandate
          </button>
          <p className="privacyNote">Dacă fundalul are umbre sau texturi, verifică marginile după procesare.</p>
          <div className="inlineActions">
            <button className="button buttonPrimary" type="button" disabled={processing || !logo} onClick={onLocal}>
              <WandSparkles aria-hidden="true" size={18} />
              Elimină fundalul
            </button>
            {advancedAvailable ? (
              <>
                <label className="checkboxField advancedConsent">
                  <input type="checkbox" checked={advancedConsent} onChange={(event) => onAdvancedConsent(event.target.checked)} />
                  <span>Sunt de acord ca logo-ul să fie trimis temporar pentru procesare avansată.</span>
                </label>
                <button className="button buttonSecondary" type="button" disabled={processing || !advancedConsent} onClick={onAdvanced}>
                  Procesare avansată
                </button>
              </>
            ) : null}
            <button className="button buttonGhost" type="button" disabled={!logo} onClick={onRestoreOriginal}>
              Revino la original
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function LogoComparison({ originalUrl, processedUrl }: { originalUrl: string; processedUrl: string }) {
  const [position, setPosition] = useState(50);
  const frameRef = useRef<HTMLDivElement>(null);

  function updateFromClientX(clientX: number) {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPosition(Math.min(86, Math.max(14, Math.round(((clientX - rect.left) / rect.width) * 100))));
  }

  return (
    <div className="logoComparison" style={{ "--split": `${position}%` } as React.CSSProperties}>
      <div
        ref={frameRef}
        className="logoComparisonFrame"
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture?.(event.pointerId);
          updateFromClientX(event.clientX);
        }}
        onPointerMove={(event) => {
          if (event.buttons === 1) updateFromClientX(event.clientX);
        }}
        onMouseDown={(event) => updateFromClientX(event.clientX)}
        onMouseMove={(event) => {
          if (event.buttons === 1) updateFromClientX(event.clientX);
        }}
      >
        <span className="beforeAfterLabel beforeAfterLabelLeft">Înainte</span>
        <span className="beforeAfterLabel beforeAfterLabelRight">După</span>
        <div className="logoComparisonOriginal" aria-hidden="true">
          <img src={originalUrl} alt="" />
        </div>
        <div className="logoComparisonProcessed" aria-hidden="true">
          <img src={processedUrl} alt="" />
        </div>
        <label className="srOnly" htmlFor="logo-comparison-range">
          Compară logo-ul original cu logo-ul procesat
        </label>
        <input
          id="logo-comparison-range"
          className="beforeAfterRange"
          type="range"
          min="14"
          max="86"
          value={position}
          aria-valuetext={`${position}% procesat`}
          onChange={(event) => setPosition(Number(event.target.value))}
          onPointerDown={(event) => updateFromClientX(event.clientX)}
          onPointerMove={(event) => {
            if (event.buttons === 1) updateFromClientX(event.clientX);
          }}
          onMouseDown={(event) => updateFromClientX(event.clientX)}
          onMouseMove={(event) => {
            if (event.buttons === 1) updateFromClientX(event.clientX);
          }}
        />
        <span className="beforeAfterHandle" aria-hidden="true">
          <span>
            <Maximize2 size={18} />
          </span>
        </span>
      </div>
    </div>
  );
}

function StepPersonalize(props: {
  preset: (typeof mockupPresets)[number];
  logoUrl: string | null;
  stored: StoredPersonalizerState;
  transform: LogoTransform;
  summary: string;
  onSelectPreset: (id: MockupId) => void;
  onStored: (partial: Partial<StoredPersonalizerState> | ((current: StoredPersonalizerState) => StoredPersonalizerState)) => void;
  onTransform: (partial: Partial<LogoTransform> | ((current: LogoTransform) => LogoTransform)) => void;
  onCenter: () => void;
  onFit: () => void;
  onReset: () => void;
  onFullscreen: () => void;
}) {
  return (
    <div className="stepContent placementStep">
      <p className="overline">PERSONALIZEAZĂ</p>
      <h1>Alege punga și poziționează logo-ul.</h1>
      <div className="mobilePreview">
        <MockupStage
          preset={props.preset}
          logoUrl={props.logoUrl}
          transform={props.transform}
          logoMode={props.stored.logoMode}
          customColor={props.stored.customColor}
          blendMode={props.stored.blendMode}
          printFinish={props.stored.printFinish}
          editable
          onTransformChange={(transform) => props.onTransform(() => transform)}
        />
      </div>
      <p className="previewSummary">{props.summary}</p>
      <div className="inlineActions">
        <button className="button buttonSecondary" type="button" onClick={props.onFullscreen}>
          <Eye aria-hidden="true" size={18} />
          Vezi pe tot ecranul
        </button>
      </div>
      <div className="controlGroup">
        <span>Model pungă</span>
        <div className="mockupChoiceGrid compact">
          {mockupPresets.map((mockup) => (
            <button
              className="mockupChoice"
              type="button"
              key={mockup.id}
              aria-pressed={props.preset.id === mockup.id}
              onClick={() => props.onSelectPreset(mockup.id)}
            >
              <Image src={mockup.thumbnailSrc} width={480} height={600} alt="" />
              <span>
                <strong>{mockup.label}</strong>
                <small>{mockup.shortDescription}</small>
              </span>
              {props.preset.id === mockup.id ? <Check aria-hidden="true" size={20} /> : null}
            </button>
          ))}
        </div>
      </div>
      <div className="controlGroup">
        <span>Culoare logo</span>
        <div className="segmentedControl" aria-label="Culoare logo">
          {[
            ["original", "Original"],
            ["black", "Negru"],
            ["white", "Alb"],
            ["lime", "Verde Cartpaper"],
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
      </div>
      <div className="finishPanel">
        <span>Finisaj</span>
        <div className="finishGrid">
          {finishOptions.map(([id, label]) => (
            <button
              key={id}
              type="button"
              aria-pressed={props.stored.printFinish === id}
              onClick={() => props.onStored({ printFinish: id })}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <label className="rangeField">
        <span>Dimensiune: {transformWidthPercent(props.transform, props.preset)}%</span>
        <input
          type="range"
          min="120"
          max="720"
          value={props.transform.width}
          onChange={(event) => props.onTransform({ width: Number(event.target.value) })}
        />
      </label>
      <label className="rangeField">
        <span>Rotire: {Math.round(props.transform.rotation)}°</span>
        <input
          type="range"
          min="-35"
          max="35"
          value={props.transform.rotation}
          onChange={(event) => props.onTransform({ rotation: Number(event.target.value) })}
        />
      </label>
      <div className="inlineActions">
        <button className="button buttonSecondary" type="button" onClick={props.onCenter}>
          Centrează
        </button>
        <button className="button buttonSecondary" type="button" onClick={props.onFit}>
          Potrivește în zona de tipar
        </button>
        <button className="button buttonGhost" type="button" onClick={props.onReset}>
          <RotateCcw aria-hidden="true" size={18} />
          Resetează
        </button>
      </div>
    </div>
  );
}

function StepFinalize(props: {
  preset: (typeof mockupPresets)[number];
  logoUrl: string | null;
  stored: StoredPersonalizerState;
  transform: LogoTransform;
  summary: string;
  processing: boolean;
  saveStatus: string;
  onDownload: () => void;
  onShare: () => void;
  onSave: () => void;
  onEdit: (step: number) => void;
}) {
  return (
    <div className="stepContent">
      <p className="overline">FINALIZEAZĂ</p>
      <h1>Verifică simularea înainte de ofertă.</h1>
      <MockupStage
        preset={props.preset}
        logoUrl={props.logoUrl}
        transform={props.transform}
        logoMode={props.stored.logoMode}
        customColor={props.stored.customColor}
        blendMode={props.stored.blendMode}
        printFinish={props.stored.printFinish}
      />
      <dl className="reviewList">
        {props.summary.split("\n").map((line) => {
          const [label, value] = line.split(": ");
          return (
            <div key={line}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          );
        })}
      </dl>
      <p className="privacyNote">
        Simularea este orientativă. Dacă trimiți cererea prin e-mail, descarcă PNG-ul și atașează-l manual.
      </p>
      <div className="inlineActions">
        <button className="button buttonSecondary" type="button" disabled={!props.logoUrl || props.processing} onClick={props.onDownload}>
          <Download aria-hidden="true" size={18} />
          Descarcă simularea
        </button>
        <button className="button buttonSecondary" type="button" disabled={!props.logoUrl || props.processing} onClick={props.onShare}>
          <Share2 aria-hidden="true" size={18} />
          Partajează
        </button>
        <button className="button buttonGhost" type="button" disabled={!props.logoUrl} onClick={props.onSave}>
          <Save aria-hidden="true" size={18} />
          Salvează pe dispozitiv
        </button>
      </div>
      {props.saveStatus ? <p className="statusMessage">{props.saveStatus}</p> : null}
      <div className="editLinks">
        {[0, 1].map((step) => (
          <button type="button" key={step} onClick={() => props.onEdit(step)}>
            Editează {steps[step].toLowerCase()}
          </button>
        ))}
      </div>
    </div>
  );
}

function PreviewDialog({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const lastFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    lastFocusRef.current = document.activeElement as HTMLElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("button")?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab" && panelRef.current) {
        const focusables = Array.from(panelRef.current.querySelectorAll<HTMLElement>("button, a, input, select, textarea"));
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
      lastFocusRef.current?.focus();
    };
  }, [onClose]);

  return (
    <div className="modalLayer previewDialogLayer" role="presentation" onMouseDown={onClose}>
      <div
        ref={panelRef}
        className="modalPanel previewDialogPanel"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modalHeader">
          <h2>{title}</h2>
          <button className="iconButton" type="button" aria-label="Închide previzualizarea" onClick={onClose}>
            <X aria-hidden="true" size={22} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function openDatabase() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB nu este disponibil."));
      return;
    }

    const request = indexedDB.open("cartpaper-personalizer", 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore("projects", { keyPath: "id" });
    };
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

async function loadProjectRecord() {
  const db = await openDatabase();
  return new Promise<SavedProjectRecord | null>((resolve, reject) => {
    const transaction = db.transaction("projects", "readonly");
    const request = transaction.objectStore("projects").get("latest");
    request.onsuccess = () => resolve((request.result as SavedProjectRecord | undefined) ?? null);
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => db.close();
    transaction.onerror = () => db.close();
  });
}

async function saveProjectRecord(record: SavedProjectRecord) {
  const db = await openDatabase();
  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction("projects", "readwrite");
    transaction.objectStore("projects").put(record);
    transaction.oncomplete = () => {
      db.close();
      resolve();
    };
    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };
  });
}

async function deleteProjectRecord() {
  const db = await openDatabase();
  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction("projects", "readwrite");
    transaction.objectStore("projects").delete("latest");
    transaction.oncomplete = () => {
      db.close();
      resolve();
    };
    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };
  });
}
