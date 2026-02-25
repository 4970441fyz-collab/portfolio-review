import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    score: 78,
    sections: [
      {
        title: "Visual Hierarchy",
        status: "Good",
        feedback:
          "Strong hero section. CTA is visible but secondary actions compete visually.",
      },
      {
        title: "Layout & Spacing",
        status: "Needs Improvement",
        feedback:
          "Overall structure is clear, but vertical rhythm between sections is inconsistent.",
      },
      {
        title: "Typography",
        status: "Good",
        feedback:
          "Clear heading hierarchy. Body text contrast could be improved.",
      },
      {
        title: "Color & Contrast",
        status: "Needs Improvement",
        feedback:
          "Primary gradient works well. Accessibility contrast needs refinement.",
      },
      {
        title: "UX & Clarity",
        status: "Good",
        feedback:
          "Navigation is intuitive, but action flow lacks feedback state.",
      },
    ],
    summary:
      "Mid-level portfolio with strong structure and clear positioning, but inconsistent visual system discipline.",
  });
}