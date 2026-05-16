'use server';
/**
 * @fileOverview An AI agent that provides step-by-step explanations for academic questions.
 *
 * - solveAcademicDoubt - A function that handles solving academic doubts.
 * - SolveAcademicDoubtInput - The input type for the solveAcademicDoubt function.
 * - SolveAcademicDoubtOutput - The return type for the solveAcademicDoubt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SolveAcademicDoubtInputSchema = z.object({
  question: z.string().describe('The academic question the student wants to solve.'),
});
export type SolveAcademicDoubtInput = z.infer<typeof SolveAcademicDoubtInputSchema>;

const SolveAcademicDoubtOutputSchema = z.object({
  explanation: z
    .string()
    .describe('A step-by-step explanation to the academic question.'),
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
  prompt: `You are an expert academic tutor. Provide a detailed, step-by-step explanation for the following academic question to help a student understand the topic thoroughly.

Question: {{{question}}}

Explanation:`,
});

const solveAcademicDoubtFlow = ai.defineFlow(
  {
    name: 'solveAcademicDoubtFlow',
    inputSchema: SolveAcademicDoubtInputSchema,
    outputSchema: SolveAcademicDoubtOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
