'use server';
/**
 * @fileOverview An advanced AI tutor that solves academic doubts with high accuracy and step-by-step logic.
 *
 * - solveAcademicDoubt - Provides comprehensive, structured academic explanations.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SolveAcademicDoubtInputSchema = z.object({
  question: z.string().describe('The academic question or topic the student needs help with.'),
});
export type SolveAcademicDoubtInput = z.infer<typeof SolveAcademicDoubtInputSchema>;

const SolveAcademicDoubtOutputSchema = z.object({
  explanation: z
    .string()
    .describe('A comprehensive, step-by-step academic explanation with key takeaways.'),
});
export type SolveAcademicDoubtOutput = z.infer<typeof SolveAcademicDoubtOutputSchema>;

export async function solveAcademicDoubt(
  input: SolveAcademicDoubtInput
): Promise<SolveAcademicDoubtOutput> {
  return solveAcademicDoubtFlow(input);
}

const prompt = ai.definePrompt({
  name: 'solveAcademicDoubtPrompt',
  input: {schema: SolveAcademicDoubtInputSchema},
  output: {schema: SolveAcademicDoubtOutputSchema},
  prompt: `You are an elite academic tutor with expertise across STEM, Humanities, and the Arts. 
Your goal is to provide a comprehensive, accurate, and easy-to-understand answer to the student's question.

Question: "{{{question}}}"

Follow this structure for your explanation:
1. **Direct Answer**: Provide a concise summary of the answer first.
2. **Step-by-Step Breakdown**: Explain the logic, formulas, or historical context in logical steps.
3. **Key Concepts**: Define any difficult terms used.
4. **Example**: Provide a real-world example or a similar problem solved.
5. **Study Tip**: A quick tip on how to remember this concept.

Use professional but encouraging tone. If the question is about coding, provide clear code snippets. If it's math, show all steps.`,
});

const solveAcademicDoubtFlow = ai.defineFlow(
  {
    name: 'solveAcademicDoubtFlow',
    inputSchema: SolveAcademicDoubtInputSchema,
    outputSchema: SolveAcademicDoubtOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      return { explanation: "I couldn't generate a specific answer for that. Could you please provide more details or rephrase the question?" };
    }
    return output;
  }
);
