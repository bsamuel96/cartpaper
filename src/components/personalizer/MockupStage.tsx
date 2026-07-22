"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Group, Image as KonvaImage, Layer, Line, Rect, Stage, Text, Transformer } from "react-konva";
import Konva from "konva";
import useImage from "use-image";
import type { BlendMode, LogoColorMode, LogoTransform, MockupPreset } from "@/types/mockup";

const lime = "#bdec14";

type MockupStageProps = {
  preset: MockupPreset;
  logoUrl: string | null;
  transform: LogoTransform;
  logoMode: LogoColorMode;
  customColor: string;
  blendMode: BlendMode;
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
  editable = false,
  onTransformChange,
}: MockupStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<Konva.Image>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const [width, setWidth] = useState(360);
  const [base] = useImage(preset.baseSrc);
  const [overlay] = useImage(preset.overlaySrc);
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

  function emitTransform(node: Konva.Image) {
    const nextWidth = Math.max(80, node.width() * node.scaleX());
    node.scaleX(1);
    node.scaleY(1);
    onTransformChange?.({
      ...transform,
      x: node.x(),
      y: node.y(),
      width: nextWidth,
      rotation: node.rotation(),
    });
  }

  useEffect(() => {
    if (!imageRef.current) return;
    if (tintRgb) {
      imageRef.current.cache();
    } else {
      imageRef.current.clearCache();
    }
    imageRef.current.getLayer()?.batchDraw();
  }, [logo, tintRgb]);

  return (
    <div className="mockupStageFrame" ref={containerRef}>
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
                  filters={tintRgb ? [Konva.Filters.RGBA] : undefined}
                  red={tintRgb?.red}
                  green={tintRgb?.green}
                  blue={tintRgb?.blue}
                  alpha={tintRgb ? 1 : undefined}
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
          {overlay ? <KonvaImage image={overlay} width={preset.stage.width} height={preset.stage.height} listening={false} /> : null}
          {editable && logo ? (
            <Transformer
              ref={transformerRef}
              rotateEnabled
              enabledAnchors={["top-left", "top-right", "bottom-left", "bottom-right"]}
              anchorSize={22}
              borderStroke="#bdec14"
              anchorStroke="#11120e"
              anchorFill="#bdec14"
              keepRatio
            />
          ) : null}
        </Layer>
      </Stage>
    </div>
  );
}
