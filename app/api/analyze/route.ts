import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json(
        { error: "No text provided" },
        { status: 400 }
      );
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a senior product design reviewer.",
        },
        {
          role: "user",
          content: `Give structured UX feedback for this portfolio:\n\n${text}`,
        },
      ],
    });

    return NextResponse.json({
      result: response.choices[0].message.content,
    });
  } catch (error: any) {
    console.error("OPENAI ERROR:", error);
    return NextResponse.json(
      { error: error.message || "OpenAI request failed" },
      { status: 500 }
    );
  }
}