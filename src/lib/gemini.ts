const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

export async function analyzeMalariaCell(
  base64Data: string,
  mimeType: string,
): Promise<string> {
  const response = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              inlineData: {
                mimeType,
                data: base64Data,
              },
            },
            {
              text: `You are an expert medical AI specializing in malaria diagnosis from microscopic blood cell images.

Analyze this microscopic blood cell image and determine whether malaria parasites are present.

Provide your analysis in this exact structure:

## Diagnosis
State clearly: **POSITIVE** (malaria detected) or **NEGATIVE** (no malaria detected)

## Confidence Level
State your confidence as a percentage (e.g., 85%) and explain why.

## Observations
- Describe what you see in the cell image
- Note any parasites, ring forms, trophozoites, schizonts, or gametocytes if present
- Describe the red blood cell morphology

## Parasite Species
If positive, identify the likely species (P. falciparum, P. vivax, P. ovale, P. malariae, P. knowlesi) and explain why.

## Parasitemia Level
If positive, estimate the level (low/moderate/high) based on visible infected cells.

## Recommendation
Provide a brief medical recommendation based on the findings.

Always remind the user that this is an AI-assisted analysis and they should consult a medical professional for confirmed diagnosis.`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 2048,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error: ${error}`);
  }

  const data = await response.json();
  return (
    data.candidates?.[0]?.content?.parts?.[0]?.text ||
    "Unable to analyze the image."
  );
}
