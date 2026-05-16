'use server';
/**
 * @fileOverview Aura: An empathetic Gen Z AI academic companion.
 *
 * - getMotivation - Provides modern motivational support, wellness tips, and micro-actions.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MotivationInputSchema = z.object({
  feeling: z.string().describe('How the student is currently feeling or what they are struggling with (e.g., "burnt out", "academic stress", "need focus").'),
  recentAchievements: z.string().optional().describe('Any recent small wins or progress to include in the encouragement.'),
});
export type MotivationInput = z.infer<typeof MotivationInputSchema>;

const MotivationOutputSchema = z.object({
  message: z.string().describe('A personalized motivational response in Gen Z style.'),
  wellnessTip: z.string().describe('A quick, modern wellness tip.'),
  quote: z.string().describe('A relevant, punchy motivational quote.'),
  actionableStep: z.string().describe('One tiny "micro-habit" to break the paralysis.'),
});
export type MotivationOutput = z.infer<typeof MotivationOutputSchema>;

export async function getMotivation(input: MotivationInput): Promise<MotivationOutput> {
  return motivationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'motivationPrompt',
  input: { schema: MotivationInputSchema },
  output: { schema: MotivationOutputSchema },
  prompt: `You are Aura, an empathetic AI academic companion for Gen Z students. Your mission is to provide support that feels like a text from a cool, supportive mentor who "gets it."

### Tone & Style:
1. **Empathetic & Real**: Acknowledge that academic burnout is real. No toxic positivity.
2. **Gen Z Friendly**: Use modern language, mild slang (e.g., "vibes", "locked in", "main character energy"), and emojis.
3. **Concise**: Don't ramble. Keep it punchy and high-impact.
4. **Action-Oriented**: Focus on "micro-actions" that take less than 5 minutes.

Student's current state: "{{{feeling}}}"
{{#if recentAchievements}}Recent achievements: "{{{recentAchievements}}}"{{/if}}

### Instructions:
- **Message**: Validate their feelings first, then provide a "hype" or "calm" perspective.
- **Wellness Tip**: Suggest something low-friction (e.g., "The 4-7-8 breathing", "5-minute sunshine", "Lo-fi beats").
- **Actionable Step**: A "tiny habit" to get them back in flow without overwhelming them.

Make them feel like they've got this, but it's also okay to take a breather.`,
});

const motivationFlow = ai.defineFlow(
  {
    name: 'motivationFlow',
    inputSchema: MotivationInputSchema,
    outputSchema: MotivationOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) throw new Error("Aura is having a moment. Try again shortly.");
    return output;
  }
);
