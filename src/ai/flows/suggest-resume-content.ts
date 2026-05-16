'use server';
/**
 * @fileOverview An AI agent that provides content suggestions for resume sections.
 *
 * - suggestResumeContent - A function that handles the resume content suggestion process.
 * - SuggestResumeContentInput - The input type for the suggestResumeContent function.
 * - SuggestResumeContentOutput - The return type for the suggestResumeContent function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SuggestResumeContentInputSchema = z.object({
  resumeSection: z.string().describe('The specific resume section (e.g., "Experience", "Skills", "Education", "Summary", "Projects") for which to suggest content.'),
  studentSummary: z.string().describe('A summary of the student\'s academic background, skills, and career goals. This is crucial for personalizing suggestions.'),
  jobDescription: z.string().optional().describe('Optional: The job description the student is applying for, to tailor suggestions for ATS compatibility.'),
  existingSectionContent: z.string().optional().describe('Optional: Any existing content in the specified resume section that the AI should refine, expand, or improve.'),
});
export type SuggestResumeContentInput = z.infer<typeof SuggestResumeContentInputSchema>;

const SuggestResumeContentOutputSchema = z.object({
  suggestedContent: z.string().describe('The AI-generated content suggestions for the specified resume section, formatted professionally.'),
  keyPhrases: z.array(z.string()).describe('Important keywords or phrases identified for ATS optimization, relevant to the job description or student summary.'),
});
export type SuggestResumeContentOutput = z.infer<typeof SuggestResumeContentOutputSchema>;

export async function suggestResumeContent(input: SuggestResumeContentInput): Promise<SuggestResumeContentOutput> {
  return suggestResumeContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestResumeContentPrompt',
  input: { schema: SuggestResumeContentInputSchema },
  output: { schema: SuggestResumeContentOutputSchema },
  prompt: `You are an expert resume builder and career advisor. Your goal is to help a student create an ATS-friendly and professional resume by providing content suggestions for a specific section.

Here is the student's general background and goals:
Student Summary: {{{studentSummary}}}

{{#if jobDescription}}
They are applying for the following job:
Job Description: {{{jobDescription}}}
{{/if}}

{{#if existingSectionContent}}
They currently have this content in the '{{{resumeSection}}}' section:
Existing Content: {{{existingSectionContent}}}

Improve upon this content to make it more professional and ATS-friendly, focusing on action verbs and measurable achievements.
{{else}}
Generate new content for the '{{{resumeSection}}}' section of their resume. Focus on making it ATS-friendly, professional, and tailored to the student's summary and the job description (if provided).
{{/if}}

Ensure the suggestions are concise, use strong action verbs, and highlight achievements. If appropriate for the section, use bullet points.

Please provide the suggested content and a list of key phrases for ATS optimization.`,
});

const suggestResumeContentFlow = ai.defineFlow(
  {
    name: 'suggestResumeContentFlow',
    inputSchema: SuggestResumeContentInputSchema,
    outputSchema: SuggestResumeContentOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
