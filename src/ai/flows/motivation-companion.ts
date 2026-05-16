
'use server';
/**
 * @fileOverview An AI agent that provides motivational support and study wellness tips.
 *
 * - getMotivation - A function that handles motivational chatting and wellness advice.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MotivationInputSchema = z.object({
  feeling: z.string().describe('How the student is currently feeling or what they are struggling with (e.g., "burnt out", "anxious about exams", "need focus").'),
  recentAchievements: z.string().optional().describe('Any recent small wins or progress to include in the encouragement.'),
});
export type MotivationInput = z.infer<typeof MotivationInputSchema>;

const MotivationOutputSchema = z.object({
  message: z.string().describe('A personalized motivational message or response.'),
  wellnessTip: z.string().describe('A quick wellness tip (breathing, movement, or mindfulness).'),
  quote: z.string().describe('A relevant motivational quote.'),
  actionableStep: z.string().describe('One small, easy next step to get moving again.'),
});
export type MotivationOutput = z.infer<typeof MotivationOutputSchema>;

export async function getMotivation(input: MotivationInput): Promise<MotivationOutput> {
  return motivationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'motivationPrompt',
  input: { schema: MotivationInputSchema },
  output: { schema: MotivationOutputSchema },
  prompt: `You are Aura, an empathetic AI academic companion. Your goal is to support students who are feeling stressed, unmotivated, or burnt out.

Student's current state: {{{feeling}}}
{{#if recentAchievements}}Recent achievements: {{{recentAchievements}}}{{/if}}

Provide a response that is:
1. Empathetic and validating.
2. Highly motivational but realistic (not toxic positivity).
3. Includes a practical wellness exercise (e.g., "The 4-7-8 breathing technique").
4. A short inspirational quote.
5. A "tiny habit" or micro-action to break the paralysis.

Keep the tone warm, friendly, and Gen-Z friendly.`,
});

const motivationFlow = ai.defineFlow(
  {
    name: 'motivationFlow',
    inputSchema: MotivationInputSchema,
    outputSchema: MotivationOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
