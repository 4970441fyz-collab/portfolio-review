import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { text } = await req.json();

  return NextResponse.json({
    result: `
1. Visual Hierarchy  
Strong hero section. CTA is visible but secondary actions compete visually.

2. Layout & Spacing  
Good overall structure. Inconsistent vertical rhythm between sections.

3. Typography  
Clear hierarchy in headings. Body text contrast could be improved.

4. Color & Contrast  
Primary gradient works well. Accessibility contrast needs refinement.

5. UX & Clarity  
Navigation is intuitive. Upload / action flow lacks feedback state.

6. Strengths  
Strong positioning and clear value proposition.

7. Areas for Improvement  
Refine spacing system and improve visual consistency.

8. Overall Level  
Mid-level portfolio with solid structure and potential polish.
`,
  });
}