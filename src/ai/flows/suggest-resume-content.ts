'use server';
/**
 * @fileOverview An elite AI resume strategist that crafts high-impact, ATS-optimized content.
 *
 * - suggestResumeContent - Generates professional bullet points and summaries with metric-driven focus.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SuggestResumeContentInputSchema = z.object({
  resumeSection: z.string().describe('The resume section (e.g., "Experience", "Projects", "Summary").'),
  studentSummary: z.string().describe('Student background and skills.'),
  jobDescription: z.string().optional().describe('Target job requirements.'),
  existingSectionContent: z.string().optional().describe('Existing content to refine.'),
});
export type SuggestResumeContentInput = z.infer<typeof SuggestResumeContentInputSchema>;

const SuggestResumeContentOutputSchema = z.object({
  suggestedContent: z.string().describe('The AI-generated content, formatted with high-impact bullet points.'),
  keyPhrases: z.array(z.string()).describe('ATS keywords identified.'),
  proTip: z.string().describe('A specific tip to make this section stand out further.'),
});
export type SuggestResumeContentOutput = z.infer<typeof SuggestResumeContentOutputSchema>;

export async function suggestResumeContent(input: SuggestResumeContentInput): Promise<SuggestResumeContentOutput> {
  return suggestResumeContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestResumeContentPrompt',
  input: { schema: SuggestResumeContentInputSchema },
  output: { schema: SuggestResumeContentOutputSchema },
  prompt: `You are an Elite Resume Strategist and Career Coach. Your goal is to transform student experiences into high-impact, professional narratives that pass both ATS filters and human recruiter scrutiny.

### The "Aura Strategy":
1. **Action Verbs**: Start every bullet point with a powerful action verb (e.g., "Spearheaded", "Engineered", "Orchestrated").
2. **Quantifiable Impact**: Whenever possible, include metrics or scale (e.g., "Increased efficiency by 20%", "Managed a team of 5", "Reduced latency by 150ms").
3. **Keyword Density**: Integrate relevant keywords from the job description naturally.
4. **Brevity & Punch**: Keep points concise but dense with meaning.

### Student Profile:
Summary: {{{studentSummary}}}
Section to Build: {{{resumeSection}}}
{{#if jobDescription}}Target Job: {{{jobDescription}}}{{/if}}
{{#if existingSectionContent}}Current Draft: {{{existingSectionContent}}}{{/if}}

### Instructions:
- Generate 3-5 high-impact bullet points or a 3-sentence powerful summary depending on the section.
- Ensure the formatting is clean (using "•" for bullets).
- Provide a "Pro Tip" specifically for this section.
- Identify the top 5 ATS keywords used.`,
});

const suggestResumeContentFlow = ai.defineFlow(
  {
    name: 'suggestResumeContentFlow',
    inputSchema: SuggestResumeContentInputSchema,
    outputSchema: SuggestResumeContentOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) throw new Error("Failed to strategize resume content.");
    return output;
  }
);
