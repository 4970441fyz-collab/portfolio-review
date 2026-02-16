import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { image } = await req.json();

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `
You are a senior product designer and design mentor.

Analyze the provided UI screenshot professionally.

Provide structured feedback in the following format:

1. Visual Hierarchy
2. Layout & Spacing
3. Typography
4. Color & Contrast
5. UX & Clarity
6. Strengths
7. Areas for Improvement
8. Overall Level (Junior / Middle / Senior with short justification)

Rules:
- Be specific and concrete.
- Do not give generic advice.
- Reference visible elements in the design.
- Keep tone professional and direct.
- Avoid motivational language.
- Keep it concise but insightful.
`,
            },
            {
              type: "input_image",
              image_url: image,
            },
          ],
        },
      ],
    });

    return NextResponse.json({
      result: response.output_text,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { result: "AI analysis failed." },
      { status: 500 }
    );
  }
}