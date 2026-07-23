import { NextResponse, type NextRequest } from "next/server";
import { acceptedMimeTypes, maxUploadBytes } from "@/lib/image/validateImage";

function sameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host) return true;

  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

async function callRemoveBgProvider(file: File, apiKey: string, signal: AbortSignal) {
  const form = new FormData();
  form.append("image_file", file, file.name);
  form.append("size", "auto");

  const response = await fetch("https://api.remove.bg/v1.0/removebg", {
    method: "POST",
    headers: {
      "X-Api-Key": apiKey,
    },
    body: form,
    signal,
  });

  if (response.status === 402 || response.status === 429) {
    return { type: "busy" as const };
  }
  if (!response.ok) {
    return { type: "failure" as const };
  }

  return { type: "success" as const, blob: await response.blob() };
}

export async function GET() {
  return NextResponse.json(
    { enabled: Boolean(process.env.REMOVE_BG_API_KEY) },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) {
    return NextResponse.json({ message: "Cererea nu a putut fi validată." }, { status: 403 });
  }

  const apiKey = process.env.REMOVE_BG_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ message: "Procesarea avansată nu este configurată momentan." }, { status: 503 });
  }

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ message: "Fișierul nu a putut fi citit. Încearcă un alt export al logo-ului." }, { status: 400 });
  }

  if (file.size > maxUploadBytes || !acceptedMimeTypes.includes(file.type as (typeof acceptedMimeTypes)[number])) {
    return NextResponse.json(
      { message: "Formatul fișierului nu este acceptat. Folosește PNG, JPG, WEBP sau SVG." },
      { status: 400 },
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);

  try {
    const result = await callRemoveBgProvider(file, apiKey, controller.signal);

    if (result.type === "busy") {
      return NextResponse.json(
        { message: "Serviciul de procesare este ocupat. Încearcă din nou peste câteva minute." },
        { status: 429 },
      );
    }
    if (result.type === "failure") {
      return NextResponse.json(
        { message: "Fundalul nu a putut fi eliminat automat. Poți continua cu instrumentele locale." },
        { status: 502 },
      );
    }

    return new NextResponse(result.blob, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json(
      { message: "Fundalul nu a putut fi eliminat automat. Poți continua cu instrumentele locale." },
      { status: 504 },
    );
  } finally {
    clearTimeout(timeout);
  }
}
