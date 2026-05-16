'use server';
/**
 * @fileOverview An elite AI academic tutor that adapts its response depth based on question complexity.
 *
 * - solveAcademicDoubt - Provides comprehensive or concise answers based on user intent and difficulty.
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
    .describe('The adapted response, ranging from direct answers to complex breakdowns.'),
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
  prompt: `You are an elite AI Academic Tutor, designed to match the intelligence, depth, and conversational versatility of ChatGPT.

Your goal is to provide high-accuracy answers while adapting your response style to the user's specific query:

### 1. Complexity Assessment
Before answering, evaluate the complexity of the question:
- **Level 1 (Direct/Simple):** e.g., "What is the capital of France?" or "2+2". Provide a brief, direct, and helpful answer immediately. No fluff.
- **Level 2 (Standard Academic):** e.g., "Explain photosynthesis." Provide a structured explanation with clear definitions and key points.
- **Level 3 (Complex/Deep):** e.g., "Compare the economic policies of the Great Depression vs 2008." Provide a comprehensive, nuanced analysis with sections, comparisons, and historical context.

### 2. Adaptation Rules
- **If the user asks "in detail" or "explain thoroughly":** Always provide an exhaustive, deep-dive response regardless of the base complexity. Use multi-step breakdowns.
- **If the question is open-ended:** Use a conversational but professional tone, exploring different angles and synthesizing conclusions.
- **If the question is technical (Code/Math):** Show the solution clearly. For code, explain logic step-by-step. For math, show the full derivation.

### 3. Response Structure (for Level 2 & 3)
1. **The Core Answer:** Start with a clear, concise direct answer (Bottom Line Up Front).
2. **Detailed Breakdown:** Elaborate based on complexity. Use bullet points, bold text, and numbered lists for readability.
3. **Synthesis & Context:** Briefly explain why this answer matters or provide a mnemonic/tip to remember it.

Question: "{{{question}}}"

Provide the most helpful, accurate, and context-aware response possible. Match the quality and depth expected of ChatGPT.`,
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
