
'use server';
/**
 * @fileOverview An AI agent that generates interactive quizzes with specific difficulty contexts.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateQuizInputSchema = z.object({
  topic: z.string().describe('The subject or topic for the quiz.'),
  difficulty: z.enum(['easy', 'medium', 'hard', 'expert']).default('medium'),
  numQuestions: z.number().min(1).max(5).default(3),
  academicLevel: z.string().optional().describe('The academic level of the student (e.g., "Class 10", "Engineering").'),
});
export type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;

const QuizQuestionSchema = z.object({
  question: z.string(),
  options: z.array(z.string()).length(4),
  correctAnswerIndex: z.number().min(0).max(3),
  explanation: z.string().describe('Detailed explanation of why the answer is correct.'),
});

const GenerateQuizOutputSchema = z.object({
  quizTitle: z.string(),
  questions: z.array(QuizQuestionSchema),
});
export type GenerateQuizOutput = z.infer<typeof GenerateQuizOutputSchema>;

export async function generateQuiz(input: GenerateQuizInput): Promise<GenerateQuizOutput> {
  return generateQuizFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizPrompt',
  input: { schema: GenerateQuizInputSchema },
  output: { schema: GenerateQuizOutputSchema },
  prompt: `You are an elite academic educator and subject matter expert. Generate a high-quality, high-accuracy multiple-choice quiz.

### Context:
Topic: "{{{topic}}}"
Academic Level: {{{academicLevel}}}
Difficulty: {{{difficulty}}}
Target Questions: {{{numQuestions}}}

### Guidelines:
1. **Curriculum Alignment**: Ensure questions are relevant to the Indian Education System (NCERT/Board standards) if the academic level suggests it.
2. **Complexity Logic**:
   - If difficulty is 'easy', focus on fundamental definitions and core concepts.
   - If difficulty is 'medium', focus on conceptual application and basic problem-solving.
   - If difficulty is 'hard', focus on critical analysis and multi-concept synthesis.
   - If difficulty is 'expert', focus on advanced derivation, nuanced edge cases, and high-level strategy.
3. **Quality Control**: Distractors must be plausible but definitively wrong. Explanations must be educational and clear.

Generate a quiz that is challenging yet fair for a student at the specified level.`,
});

const generateQuizFlow = ai.defineFlow(
  {
    name: 'generateQuizFlow',
    inputSchema: GenerateQuizInputSchema,
    outputSchema: GenerateQuizOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) throw new Error("Failed to generate quiz content.");
    return output;
  }
);
