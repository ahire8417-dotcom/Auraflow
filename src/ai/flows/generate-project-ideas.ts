'use server';
/**
 * @fileOverview An AI agent that generates project ideas for student portfolios.
 *
 * - generateProjectIdeas - A function that generates tailored project concepts with market analysis.
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
    marketImpact: z.string().describe('Why this project is impressive on a resume/portfolio.'),
    uniqueSpark: z.string().describe('A creative twist or unique feature that makes it stand out.'),
  })).describe('A list of 3 creative, high-impact project ideas.'),
});
export type ProjectIdeasOutput = z.infer<typeof ProjectIdeasOutputSchema>;

export async function generateProjectIdeas(input: ProjectIdeasInput): Promise<ProjectIdeasOutput> {
  return projectIdeasFlow(input);
}

const prompt = ai.definePrompt({
  name: 'projectIdeasPrompt',
  input: { schema: ProjectIdeasInputSchema },
  output: { schema: ProjectIdeasOutputSchema },
  prompt: `You are an Industry Elite Mentor helping a high-potential student build a standout portfolio.
Based on their skills: {{#each skills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
And their interest in: {{{interestArea}}}
At a {{{complexity}}} level.

### Objectives:
1. **Innovation**: Don't suggest generic "Todo" apps. Think of real-world problems.
2. **Complexity Alignment**:
   - Beginner: Focus on core logic and clean UI.
   - Intermediate: Focus on integrations, data management, and state.
   - Advanced: Focus on scale, performance, security, or complex algorithms.
3. **The Spark**: Provide a unique twist that makes this project unlike any other on GitHub.
4. **Marketability**: Explain the specific industry value of this project.

Generate 3 unique, high-impact project ideas.`,
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
