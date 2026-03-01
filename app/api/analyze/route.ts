import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    const prompt = `You are a senior UX/UI design expert reviewing a designer's work.
Analyze this design screenshot and return ONLY a valid JSON object with this exact structure:
{
  "score": <number 0-100>,
  "sections": [
    {
      "title": "Visual Hierarchy",
      "status": "Good" | "Needs Improvement",
      "feedback": "<specific, actionable feedback 1-2 sentences>"
    },
    {
      "title": "Layout & Spacing",
      "status": "Good" | "Needs Improvement",
      "feedback": "<specific, actionable feedback 1-2 sentences>"
    },
    {
      "title": "Typography",
      "status": "Good" | "Needs Improvement",
      "feedback": "<specific, actionable feedback 1-2 sentences>"
    },
    {
      "title": "Color & Contrast",
      "status": "Good" | "Needs Improvement",
      "feedback": "<specific, actionable feedback 1-2 sentences>"
    },
    {
      "title": "UX & Clarity",
      "status": "Good" | "Needs Improvement",
      "feedback": "<specific, actionable feedback 1-2 sentences>"
    }
  ],
  "summary": "<2-3 sentence overall assessment with key growth areas>"
}

Be specific to what you actually see in the image. Do not return anything except the JSON object.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: imageBase64,
                detail: "high",
              },
            },
            {
              type: "text",
              text: prompt,
            },
          ],
        },
      ],
    });

    const content = response.choices[0]?.message?.content ?? "";

    // Strip markdown fences if present
    const clean = content.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Analysis error:", err);
    return NextResponse.json(
      { error: "Analysis failed. Please try again." },
      { status: 500 }
    );
  }
}
