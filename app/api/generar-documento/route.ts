import { NextRequest, NextResponse } from 'next/server';
import { SYSTEM_PROMPT, buildUserPrompt, sanitizeLegalLanguage } from '@/lib/claude-prompt';
import type { DocumentoGenerado, WizardData } from '@/lib/types';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key no configurada. Añade DEEPSEEK_API_KEY en .env.local' },
        { status: 503 },
      );
    }

    const body = await request.json();
    const wizardData = body.wizardData as WizardData;

    if (!wizardData) {
      return NextResponse.json({ error: 'No wizard data provided' }, { status: 400 });
    }

    const model = process.env.DEEPSEEK_MODEL ?? 'deepseek-chat';

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        max_tokens: 2000,
        temperature: 0.3,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: buildUserPrompt(wizardData) },
        ],
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error('DeepSeek API error:', response.status, errBody);
      return NextResponse.json(
        { error: 'Error al generar el documento. Por favor, inténtalo de nuevo.' },
        { status: 502 },
      );
    }

    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };

    const rawText = data.choices?.[0]?.message?.content ?? '';
    const cleaned = rawText.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned) as DocumentoGenerado;

    const documento: DocumentoGenerado = {
      identificacionReclamante: sanitizeLegalLanguage(parsed.identificacionReclamante ?? ''),
      identificacionReclamado: sanitizeLegalLanguage(parsed.identificacionReclamado ?? ''),
      relacionHechos: sanitizeLegalLanguage(parsed.relacionHechos ?? ''),
      peticion: sanitizeLegalLanguage(parsed.peticion ?? ''),
      lugar: parsed.lugar ?? wizardData.step3?.ciudad ?? '',
      fecha: parsed.fecha ?? '',
    };

    return NextResponse.json({ documento });
  } catch (error) {
    console.error('Error generating document:', error);
    return NextResponse.json(
      { error: 'Error al generar el documento. Por favor, inténtalo de nuevo.' },
      { status: 500 },
    );
  }
}
