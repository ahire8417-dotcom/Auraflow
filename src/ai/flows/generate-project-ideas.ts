'use server';
/**
 * @fileOverview An AI agent that generates project ideas for student portfolios.
 *
 * - generateProjectIdeas - A function that generates tailored project concepts.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ProjectIdeasInputSchema = z.object({
  skills: z.array(z.string()).describe('List of skills the student has or wants to use.'),
  interestArea: z.string().describe('The domain of interest (e.g., "Sustainability", "FinTech", "Health").'),
  complexity: z.enum(['beginner', 'intermediate', 'advanced']).default('intermediate'),
});
export type ProjectIdeasInput = z.infer<typeof ProjectIdeasInputSchema>;

const ProjectIdeasOutputSchema = z.object({
  ideas: z.array(z.object({
    title: z.string().describe('The project title.'),
    description: z.string().describe('A brief overview of the project.'),
    keyFeatures: z.array(z.string()).describe('List of core features to implement.'),
    techStack: z.array(z.string()).describe('Suggested technologies.'),
    learningOutcome: z.string().describe('What the student will learn.'),
  })).describe('A list of 3-4 creative project ideas.'),
});
export type ProjectIdeasOutput = z.infer<typeof ProjectIdeasOutputSchema>;

export async function generateProjectIdeas(input: ProjectIdeasInput): Promise<ProjectIdeasOutput> {
  return projectIdeasFlow(input);
}

const prompt = ai.definePrompt({
  name: 'projectIdeasPrompt',
  input: { schema: ProjectIdeasInputSchema },
  output: { schema: ProjectIdeasOutputSchema },
  prompt: `You are an industry mentor helping a student build a standout portfolio.
Based on their skills: {{#each skills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
And their interest in: {{{interestArea}}}
At a {{{complexity}}} level.

Generate 3 unique, high-impact project ideas that would impress recruiters. 
Focus on solving real-world problems. Ensure the tech stack is modern and relevant.`,
});

const projectIdeasFlow = ai.defineFlow(
  {
    name: 'projectIdeasFlow',
    inputSchema: ProjectIdeasInputSchema,
    outputSchema: ProjectIdeasOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
