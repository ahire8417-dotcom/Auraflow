'use server';
/**
 * @fileOverview An AI agent that generates interactive quizzes from study topics.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateQuizInputSchema = z.object({
  topic: z.string().describe('The subject or topic for the quiz.'),
  difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
  numQuestions: z.number().min(1).max(10).default(5),
});
export type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;

const QuizQuestionSchema = z.object({
  question: z.string(),
  options: z.array(z.string()).length(4),
  correctAnswerIndex: z.number().min(0).max(3),
  explanation: z.string(),
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
  prompt: `You are an expert educator. Generate a high-quality multiple-choice quiz on the topic: "{{{topic}}}".
Difficulty level: {{{difficulty}}}.
Total questions: {{{numQuestions}}}.

Ensure the questions are challenging but fair. Provide detailed explanations for each correct answer.`,
});

const generateQuizFlow = ai.defineFlow(
  {
    name: 'generateQuizFlow',
    inputSchema: GenerateQuizInputSchema,
    outputSchema: GenerateQuizOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
