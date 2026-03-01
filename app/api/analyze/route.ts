import { NextRequest, NextResponse } from "next/server";

// Realistic demo responses that rotate based on image hash
const demoResponses = [
  {
    score: 74,
    sections: [
      {
        title: "Visual Hierarchy",
        status: "Good",
        feedback: "Primary actions are clearly distinguished from secondary ones. The heading scale creates a readable flow, though mid-level elements could use stronger differentiation.",
      },
      {
        title: "Layout & Spacing",
        status: "Needs Improvement",
        feedback: "Overall grid structure is solid, but vertical rhythm between sections is inconsistent. Some components feel cramped — increase padding to at least 24px for breathing room.",
      },
      {
        title: "Typography",
        status: "Good",
        feedback: "Heading hierarchy is well-defined. Body text size and line-height are comfortable for reading, though contrast on secondary text falls slightly below WCAG AA standard.",
      },
      {
        title: "Color & Contrast",
        status: "Needs Improvement",
        feedback: "The primary color palette is cohesive, but interactive elements lack a clear hover/active state system. Consider a consistent +10% lightness rule for state changes.",
      },
      {
        title: "UX & Clarity",
        status: "Good",
        feedback: "User flow is logical and navigation is predictable. CTA placement is effective, but empty states and loading feedback are missing — add them before production.",
      },
    ],
    summary:
      "A solid mid-level design with clear structural thinking and good typographic discipline. Main growth areas: spacing consistency and a more systematic approach to interactive states. Strengthening the color system and adding micro-feedback patterns will push this to a senior level.",
  },
  {
    score: 81,
    sections: [
      {
        title: "Visual Hierarchy",
        status: "Good",
        feedback: "Strong use of size and weight contrast to guide the eye. The primary CTA stands out effectively against supporting content.",
      },
      {
        title: "Layout & Spacing",
        status: "Good",
        feedback: "Clean grid application with consistent margins. The 8px spacing system is mostly followed — a few edge cases with 10px gaps break the rhythm slightly.",
      },
      {
        title: "Typography",
        status: "Needs Improvement",
        feedback: "Font pairing works, but the scale jumps too aggressively between H2 and body text. Consider adding an intermediate text-lg style to smooth the transition.",
      },
      {
        title: "Color & Contrast",
        status: "Good",
        feedback: "Accessible contrast ratios on primary text. The accent color is used with restraint, which keeps the interface from feeling noisy.",
      },
      {
        title: "UX & Clarity",
        status: "Good",
        feedback: "Information architecture is clear and form flows feel natural. Error states are handled — good attention to edge cases.",
      },
    ],
    summary:
      "Above-average execution with a clear design system sensibility. Typography scaling and minor spacing inconsistencies are the main areas to address. This work demonstrates product thinking beyond surface-level styling.",
  },
  {
    score: 67,
    sections: [
      {
        title: "Visual Hierarchy",
        status: "Needs Improvement",
        feedback: "Multiple elements compete for attention simultaneously. Establish a clearer primary/secondary/tertiary weight system — not everything can be bold.",
      },
      {
        title: "Layout & Spacing",
        status: "Needs Improvement",
        feedback: "Spacing feels arbitrary rather than systematic. Adopting a strict 8px grid would immediately improve visual consistency across components.",
      },
      {
        title: "Typography",
        status: "Good",
        feedback: "Font choice is appropriate for the context and readability is decent. Line-height on long-form text is well-calibrated.",
      },
      {
        title: "Color & Contrast",
        status: "Needs Improvement",
        feedback: "Some text-background combinations don't meet WCAG AA (4.5:1). Run the palette through a contrast checker and adjust the lighter gray tones.",
      },
      {
        title: "UX & Clarity",
        status: "Good",
        feedback: "Core user journey is identifiable. Adding progress indicators and clearer feedback on user actions would significantly reduce cognitive load.",
      },
    ],
    summary:
      "The design shows potential but needs more systematic thinking. Focus on establishing a spacing scale and fixing contrast issues first — these are quick wins that will have the most visible impact on quality perception.",
  },
];

export async function POST(req: NextRequest) {
  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    // Simulate realistic AI processing time (2–3.5 seconds)
    const delay = 2000 + Math.random() * 1500;
    await new Promise((resolve) => setTimeout(resolve, delay));

    // Pick response based on image length (feels deterministic per image)
    const index = imageBase64.length % demoResponses.length;
    const response = demoResponses[index];

    // Add slight score variation ±3 to feel less static
    const variation = Math.floor(Math.random() * 7) - 3;
    const finalScore = Math.min(100, Math.max(0, response.score + variation));

    return NextResponse.json({
      ...response,
      score: finalScore,
    });
  } catch (err) {
    console.error("Analysis error:", err);
    return NextResponse.json(
      { error: "Analysis failed. Please try again." },
      { status: 500 }
    );
  }
}
