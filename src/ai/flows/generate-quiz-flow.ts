
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
  prompt: `You are an elite academic educator. Generate a high-quality, high-accuracy multiple-choice quiz.

Context:
Topic: "{{{topic}}}"
Difficulty: {{{difficulty}}}
Questions: {{{numQuestions}}}

Guidelines:
- If difficulty is 'easy', focus on basic definitions and core facts.
- If difficulty is 'medium', focus on application of concepts.
- If difficulty is 'hard', focus on complex analysis and multi-step reasoning.
- If difficulty is 'expert', create extremely challenging questions that require deep synthesis of the topic.

Ensure distractors (wrong options) are plausible but clearly incorrect compared to the correct answer. Provide a helpful explanation for each answer.`,
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
