"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Group, Image as KonvaImage, Layer, Line, Rect, Stage, Text, Transformer } from "react-konva";
import Konva from "konva";
import useImage from "use-image";
import { clampTransformToPrintBounds } from "@/lib/personalizer/transform";
import type { BlendMode, LogoColorMode, LogoTransform, MockupPreset, PrintFinish } from "@/types/mockup";

const lime = "#bded15";

type MockupStageProps = {
  preset: MockupPreset;
  logoUrl: string | null;
  transform: LogoTransform;
  logoMode: LogoColorMode;
  customColor: string;
  blendMode: BlendMode;
  printFinish?: PrintFinish;
  editable?: boolean;
  onTransformChange?: (transform: LogoTransform) => void;
};

export function MockupStage({
  preset,
  logoUrl,
  transform,
  logoMode,
  customColor,
  blendMode,
  printFinish = "matte-ink",
  editable = false,
  onTransformChange,
}: MockupStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<Konva.Image>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const [width, setWidth] = useState(360);
  const [base] = useImage(preset.baseSrc);
  const [overlay] = useImage(preset.overlaySrc);
  const [shadowOverlay] = useImage(preset.shadowOverlaySrc);
  const [highlightOverlay] = useImage(preset.highlightOverlaySrc);
  const [handleOverlay] = useImage(preset.handleOverlaySrc);
  const [logo] = useImage(logoUrl ?? "");
  const logoAspect = logo ? logo.height / logo.width : 1;
  const scale = width / preset.stage.width;
  const height = preset.stage.height * scale;
  const quadPoints = preset.printQuad.flatMap((point) => [point.x, point.y]);

  useEffect(() => {
    if (!containerRef.current) return undefined;

    const observer = new ResizeObserver(([entry]) => {
      setWidth(Math.max(280, Math.min(entry.contentRect.width, 960)));
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (editable && imageRef.current && transformerRef.current) {
      transformerRef.current.nodes([imageRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [editable, logo]);

  const tintFilter = useMemo(() => {
    if (logoMode === "original") return undefined;
    return logoMode === "black" ? "#11120e" : logoMode === "white" ? "#ffffff" : logoMode === "lime" ? lime : customColor;
  }, [customColor, logoMode]);
  const tintRgb = useMemo(() => {
    if (!tintFilter) return null;
    const hex = tintFilter.replace("#", "");
    return {
      red: Number.parseInt(hex.slice(0, 2), 16),
      green: Number.parseInt(hex.slice(2, 4), 16),
      blue: Number.parseInt(hex.slice(4, 6), 16),
    };
  }, [tintFilter]);

  const composite = blendMode === "automatic" ? preset.recommendedBlendMode : blendMode;
  const finishTint = printFinish === "gold-foil" ? "#d4af37" : printFinish === "white-ink" ? "#ffffff" : tintFilter;
  const finishRgb = useMemo(() => {
    if (!finishTint || logoMode === "original" && printFinish === "matte-ink") return tintRgb;
    const hex = finishTint.replace("#", "");
    return {
      red: Number.parseInt(hex.slice(0, 2), 16),
      green: Number.parseInt(hex.slice(2, 4), 16),
      blue: Number.parseInt(hex.slice(4, 6), 16),
    };
  }, [finishTint, logoMode, printFinish, tintRgb]);
  const logoShadow = printFinish === "gold-foil" ? { color: "#ffffff", blur: 10, offset: { x: -3, y: -3 }, opacity: 0.5 } : null;

  function emitTransform(node: Konva.Image) {
    const nextWidth = Math.max(80, node.width() * node.scaleX());
    node.scaleX(1);
    node.scaleY(1);
    onTransformChange?.(
      clampTransformToPrintBounds(
        {
          ...transform,
          x: node.x(),
          y: node.y(),
          width: nextWidth,
          rotation: node.rotation(),
        },
        preset,
        logoAspect,
      ),
    );
  }

  useEffect(() => {
    if (!imageRef.current) return;
    if (finishRgb) {
      imageRef.current.cache();
    } else {
      imageRef.current.clearCache();
    }
    imageRef.current.getLayer()?.batchDraw();
  }, [logo, finishRgb]);

  return (
    <div className="mockupStageFrame" ref={containerRef}>
      <p className="srOnly">
        Previzualizare {preset.label}. Logo la {Math.round(transform.x)} pe orizontală, {Math.round(transform.y)} pe verticală,
        lățime {Math.round(transform.width)} și rotire {Math.round(transform.rotation)} grade.
      </p>
      <Stage width={width} height={height} scaleX={scale} scaleY={scale} className="mockupStage">
        <Layer listening={editable}>
          {base ? (
            <KonvaImage image={base} width={preset.stage.width} height={preset.stage.height} listening={false} />
          ) : (
            <Rect width={preset.stage.width} height={preset.stage.height} fill="#efe9dd" />
          )}
          <Line points={quadPoints} closed fill="rgba(255,255,255,0.02)" stroke="rgba(17,18,14,0.16)" strokeWidth={editable ? 4 : 0} listening={false} />
          <Group
            clipFunc={(context) => {
              context.beginPath();
              preset.printQuad.forEach((point, index) => {
                if (index === 0) context.moveTo(point.x, point.y);
                else context.lineTo(point.x, point.y);
              });
              context.closePath();
            }}
          >
          {logo ? (
              <>
                <KonvaImage
                  ref={imageRef}
                  image={logo}
                  x={transform.x}
                  y={transform.y}
                  width={transform.width}
                  height={transform.width * logoAspect}
                  offsetX={transform.width / 2}
                  offsetY={(transform.width * logoAspect) / 2}
                  rotation={transform.rotation}
                  opacity={transform.opacity}
                  draggable={editable}
                  globalCompositeOperation={composite === "multiply" || composite === "screen" ? composite : "source-over"}
                  filters={finishRgb ? [Konva.Filters.RGBA] : undefined}
                  red={finishRgb?.red}
                  green={finishRgb?.green}
                  blue={finishRgb?.blue}
                  alpha={finishRgb ? 1 : undefined}
                  shadowColor={logoShadow?.color}
                  shadowBlur={logoShadow?.blur}
                  shadowOffset={logoShadow?.offset}
                  shadowOpacity={logoShadow?.opacity}
                  dragBoundFunc={(position) => {
                    const clamped = clampTransformToPrintBounds({ ...transform, x: position.x, y: position.y }, preset, logoAspect);
                    return { x: clamped.x, y: clamped.y };
                  }}
                  onDragMove={(event) => emitTransform(event.target as Konva.Image)}
                  onTransformEnd={(event) => emitTransform(event.target as Konva.Image)}
                  preventDefault
                />
              </>
            ) : (
              <Text
                x={330}
                y={745}
                width={540}
                align="center"
                text="Încarcă logo-ul pentru previzualizare"
                fontSize={40}
                fontFamily="Manrope, Arial, sans-serif"
                fill="#11120e"
                opacity={0.52}
                listening={false}
              />
            )}
          </Group>
          {shadowOverlay ? <KonvaImage image={shadowOverlay} width={preset.stage.width} height={preset.stage.height} listening={false} /> : null}
          {overlay ? <KonvaImage image={overlay} width={preset.stage.width} height={preset.stage.height} listening={false} /> : null}
          {highlightOverlay ? <KonvaImage image={highlightOverlay} width={preset.stage.width} height={preset.stage.height} listening={false} /> : null}
          {handleOverlay ? <KonvaImage image={handleOverlay} width={preset.stage.width} height={preset.stage.height} listening={false} /> : null}
          {editable && logo ? (
            <Transformer
              ref={transformerRef}
              rotateEnabled
              enabledAnchors={["top-left", "top-right", "bottom-left", "bottom-right"]}
              anchorSize={34}
              borderStroke="#bded15"
              anchorStroke="#11120e"
              anchorFill="#bded15"
              keepRatio
            />
          ) : null}
        </Layer>
      </Stage>
    </div>
  );
}
