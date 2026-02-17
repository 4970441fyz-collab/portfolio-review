import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { text } = await req.json();

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: `Give short UX feedback for this portfolio:\n\n${text}`,
      },
    ],
  });

  return NextResponse.json({
    result: response.choices[0].message.content,
  });
}
