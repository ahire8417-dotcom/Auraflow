'use server';
/**
 * @fileOverview A career roadmap generation AI agent.
 *
 * - generateCareerRoadmap - A function that handles the career roadmap generation process.
 * - GenerateCareerRoadmapInput - The input type for the generateCareerRoadmap function.
 * - GenerateCareerRoadmapOutput - The return type for the generateCareerRoadmap function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCareerRoadmapInputSchema = z.object({
  academicStream: z
    .string()
    .describe('The student\'s current academic stream or major (e.g., "Computer Science", "Biology", "Arts").'),
  interests: z
    .array(z.string())
    .describe('A list of the student\'s interests (e.g., ["AI", "web development", "environmental conservation"]).'),
  careerGoals: z
    .string()
    .describe('The student\'s long-term career aspirations (e.g., "become a software engineer at a tech giant", "work as a research scientist").'),
});
export type GenerateCareerRoadmapInput = z.infer<
  typeof GenerateCareerRoadmapInputSchema
>;

const GenerateCareerRoadmapOutputSchema = z.object({
  careerPathTitle: z.string().describe('A concise title for the recommended career path.'),
  careerSummary: z.string().describe('A brief summary and overview of the recommended career path.'),
  recommendedSkills: z.array(z.string()).describe('A list of essential skills to acquire for this career path.'),
  recommendedCourses: z.array(z.string()).describe('A list of suggested courses, certifications, or educational programs.'),
  futureOpportunities: z
    .array(z.string())
    .describe('Potential job roles, industries, and growth areas within this career path.'),
  stepsToAchieve: z
    .array(z.string())
    .describe('Actionable steps and milestones to achieve the career goals.'),
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
  prompt: `You are an expert career counselor specializing in guiding Gen Z students. Your task is to analyze a student's academic stream, interests, and career goals to generate a personalized and optimized career roadmap. Provide actionable insights, including recommended skills, courses, and future opportunities.

Student Details:
Academic Stream: {{{academicStream}}}
Interests: {{#each interests}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
Career Goals: {{{careerGoals}}}

Based on these details, generate a comprehensive career roadmap structured as follows:
`,
});

const generateCareerRoadmapFlow = ai.defineFlow(
  {
    name: 'generateCareerRoadmapFlow',
    inputSchema: GenerateCareerRoadmapInputSchema,
    outputSchema: GenerateCareerRoadmapOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
