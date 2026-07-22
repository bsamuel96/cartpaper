import { NextResponse, type NextRequest } from "next/server";
import { companyConfig } from "@/config/companyConfig";
import { buildMailtoFallback, quoteSchema } from "@/lib/validation/quote";

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

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) {
    return NextResponse.json({ message: "Cererea nu a putut fi validată." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = quoteSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Verifică datele introduse și încearcă din nou.",
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  if (parsed.data.website) {
    return NextResponse.json({ message: "Cererea nu a putut fi trimisă." }, { status: 400 });
  }

  const webhookUrl = process.env.QUOTE_WEBHOOK_URL;
  const emailTo = process.env.QUOTE_EMAIL_TO || companyConfig.contactEmail;
  const mailto = buildMailtoFallback(parsed.data, emailTo);

  if (!webhookUrl) {
    return NextResponse.json(
      {
        message:
          "Formularul online nu este configurat încă. Descarcă simularea și trimite-ne configurația prin e-mail.",
        mailto,
      },
      { status: 503 },
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...parsed.data,
        submittedAt: new Date().toISOString(),
        source: "cartpaper.ro",
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          message: "Cererea nu a putut fi trimisă momentan. Poți continua prin e-mail.",
          mailto,
        },
        { status: 502 },
      );
    }

    return NextResponse.json({ message: "Cererea a fost trimisă. Revenim cu pașii următori." });
  } catch {
    return NextResponse.json(
      {
        message: "Cererea nu a putut fi trimisă momentan. Poți continua prin e-mail.",
        mailto,
      },
      { status: 504 },
    );
  } finally {
    clearTimeout(timeout);
  }
}
