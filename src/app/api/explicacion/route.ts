import { NextResponse } from "next/server";
import {
  buildSimulatedExplanation,
  isValidExplanationPayload,
  type ExplanationPayload,
} from "@/lib/explanation";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  if (!isValidExplanationPayload(body)) {
    return NextResponse.json(
      { error: "Solo se aceptan datos estructurados del caso simulado." },
      { status: 400 },
    );
  }

  const payload: ExplanationPayload = body;
  const fallback = buildSimulatedExplanation(payload);
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(fallback);
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.2,
        messages: [
          {
            role: "system",
            content:
              "Eres un texto claro para un prototipo. No diagnostiques. No des consejo médico. Usa solo los datos estructurados. Español simple.",
          },
          {
            role: "user",
            content: JSON.stringify(payload),
          },
        ],
      }),
    });

    if (!response.ok) {
      return NextResponse.json(fallback);
    }

    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = data.choices?.[0]?.message?.content?.trim();

    if (!text) {
      return NextResponse.json(fallback);
    }

    return NextResponse.json({
      text,
      source: "llm",
      labels: ["Generado por IA con datos simulados.", "No es consejo médico."],
    });
  } catch {
    return NextResponse.json(fallback);
  }
}
