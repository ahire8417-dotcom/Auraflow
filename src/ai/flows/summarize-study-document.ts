'use server';
/**
 * @fileOverview This file defines a Genkit flow for summarizing study documents.
 *
 * - summarizeStudyDocument - A function that processes various study materials (PDF, DOCX, PPT, text)
 *   and generates short notes, key points, flashcards, and chapter-wise summaries using AI.
 * - SummarizeStudyDocumentInput - The input type for the summarizeStudyDocument function.
 * - SummarizeStudyDocumentOutput - The return type for the summarizeStudyDocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input Schema
const SummarizeStudyDocumentInputSchema = z.object({
  fileContent: z
    .string()
    .describe(
      "The content of the study material as a data URI. This can be a PDF, DOCX, PPT, or plain text file. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  documentDescription: z
    .string()
    .describe(
      'A brief description of the document content or its purpose (e.g., "Lecture notes on quantum physics", "History textbook chapter on World War II").'
    )
    .optional()
});
export type SummarizeStudyDocumentInput = z.infer<
  typeof SummarizeStudyDocumentInputSchema
>;

// Output Schema
const SummarizeStudyDocumentOutputSchema = z.object({
  shortNotes: z
    .string()
    .describe('A concise, overall summary of the entire document, highlighting main ideas.'),
  keyPoints: z
    .array(z.string())
    .describe('A bulleted list of the most critical key points and takeaways from the document.'),
  flashcards: z
    .array(
      z.object({
        question: z
          .string()
          .describe('The question part of a flashcard.'),
        answer: z
          .string()
          .describe('The answer part of a flashcard.')
      })
    )
    .describe('A set of question-and-answer flashcards generated from the document content.'),
  chapterSummaries: z
    .array(
      z.object({
        chapterTitle: z
          .string()
          .optional()
          .describe(
            'The title of the chapter or major section. This field is optional if explicit chapters are not identified.'
          ),
        summary: z
          .string()
          .describe('A summary of the specific chapter or section.')
      })
    )
    .describe(
      'A list of detailed summaries, broken down by chapters or significant sections of the document.'
    )
});
export type SummarizeStudyDocumentOutput = z.infer<
  typeof SummarizeStudyDocumentOutputSchema
>;

export async function summarizeStudyDocument(
  input: SummarizeStudyDocumentInput
): Promise<SummarizeStudyDocumentOutput> {
  return summarizeStudyDocumentFlow(input);
}

const summarizeStudyDocumentPrompt = ai.definePrompt({
  name: 'summarizeStudyDocumentPrompt',
  input: {schema: SummarizeStudyDocumentInputSchema},
  output: {schema: SummarizeStudyDocumentOutputSchema},
  prompt: `You are an intelligent study assistant specialized in helping students understand and revise study materials efficiently.\nYour task is to process the provided study document and generate various study aids.\n\nBased on the document, please provide the following in a structured JSON format:\n1.  **shortNotes**: A concise, overall summary of the entire document, highlighting its main ideas and purpose.\n2.  **keyPoints**: A bulleted list of the most critical key points, facts, and takeaways. Each point should be a separate string in an array.\n3.  **flashcards**: A set of question-and-answer flashcards. Each flashcard should be an object with a 'question' and an 'answer' field. Generate at least 5 flashcards if the content allows.\n4.  **chapterSummaries**: A list of detailed summaries, broken down by chapters or significant sections of the document. Each summary should be an object with a 'chapterTitle' (if identifiable, otherwise omit or use a generic title like 'Section X') and a 'summary' field.\n\nIf the document is about: {{{documentDescription}}}\n\nDocument Content: {{media url=fileContent}}\n\nEnsure the output is a valid JSON object matching the specified schema.`
});

const summarizeStudyDocumentFlow = ai.defineFlow(
  {
    name: 'summarizeStudyDocumentFlow',
    inputSchema: SummarizeStudyDocumentInputSchema,
    outputSchema: SummarizeStudyDocumentOutputSchema
  },
  async input => {
    const {output} = await summarizeStudyDocumentPrompt(input);
    if (!output) {
      throw new Error('Failed to generate study document summary.');
    }
    return output;
  }
);
