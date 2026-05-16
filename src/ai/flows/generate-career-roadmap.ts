'use server';
/**
 * @fileOverview An elite Gen Z career strategist that charts high-impact career pathways.
 *
 * - generateCareerRoadmap - A function that handles the strategic roadmap generation process.
 * - GenerateCareerRoadmapInput - The input type for the function.
 * - GenerateCareerRoadmapOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCareerRoadmapInputSchema = z.object({
  academicStream: z
    .string()
    .describe('The student\'s current academic stream or major (e.g., "Computer Science", "Commerce", "Arts").'),
  interests: z
    .array(z.string())
    .describe('A list of modern interests (e.g., ["AI", "Sustainability", "Content Creation"]).'),
  careerGoals: z
    .string()
    .describe('The student\'s long-term career aspirations or "dream role".'),
});
export type GenerateCareerRoadmapInput = z.infer<
  typeof GenerateCareerRoadmapInputSchema
>;

const RoadmapStepSchema = z.object({
  title: z.string().describe('The milestone title.'),
  description: z.string().describe('Actionable details for this step.'),
  timeframe: z.string().describe('Estimated timeframe (e.g., "Months 1-3", "Year 1").'),
});

const GenerateCareerRoadmapOutputSchema = z.object({
  careerPathTitle: z.string().describe('A high-impact title for the recommended career path.'),
  careerSummary: z.string().describe('An inspiring overview of why this path fits the student.'),
  marketVibe: z.string().describe('A Gen Z styled "vibe check" on the industry (e.g., "It\'s giving high growth").'),
  recommendedSkills: z.array(z.string()).describe('List of essential technical and soft skills.'),
  recommendedCourses: z.array(z.string()).describe('Suggested certifications, bootcamps, or degrees.'),
  futureOpportunities: z
    .array(z.string())
    .describe('Specific job roles and emerging niches in this field.'),
  milestones: z
    .array(RoadmapStepSchema)
    .describe('Actionable, chronologically ordered steps to achieve the goals.'),
});
export type GenerateCareerRoadmapOutput = z.infer<
  typeof GenerateCareerRoadmapOutputSchema
>;

export async function generateCareerRoadmap(
  input: GenerateCareerRoadmapInput
): Promise<GenerateCareerRoadmapOutput> {
  return generateCareerRoadmapFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCareerRoadmapPrompt',
  input: {schema: GenerateCareerRoadmapInputSchema},
  output: {schema: GenerateCareerRoadmapOutputSchema},
  prompt: `You are an Elite Career Strategist and Futurist specializing in Gen Z and Alpha generation career paths. Your goal is to chart a high-velocity, strategic roadmap for a student.

### Your Persona:
- **Insightful & Modern**: You understand the gig economy, the creator economy, AI-disruption, and remote work.
- **Strategic**: You don't just suggest jobs; you suggest "career architectures" that are future-proof.
- **Empathetic**: You know that today's youth value purpose, work-life balance, and impact as much as salary.

### Input Context:
Academic Stream: {{{academicStream}}}
Interests: {{#each interests}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
Ambition: {{{careerGoals}}}

### Instructions:
1. **The Market Vibe**: Provide a punchy, Gen Z-styled industry analysis (e.g., "High demand, major AI tailwinds").
2. **The Pathway**: Create a coherent career path that leverages their academic background while integrating their personal interests.
3. **Strategic Milestones**: Break down the journey into 4-5 high-impact milestones.
4. **Skill Synergy**: Recommend a mix of technical skills (e.g., "Prompt Engineering", "Data Viz") and soft skills (e.g., "Storytelling", "Adaptability").

Generate a roadmap that feels like a professional strategy brief from a top-tier consultant who "gets" the current generation.`,
});

const generateCareerRoadmapFlow = ai.defineFlow(
  {
    name: 'generateCareerRoadmapFlow',
    inputSchema: GenerateCareerRoadmapInputSchema,
    outputSchema: GenerateCareerRoadmapOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) throw new Error("Failed to chart your future. The stars are misaligned. Try again.");
    return output!;
  }
);
