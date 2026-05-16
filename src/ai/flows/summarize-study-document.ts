'use server';
/**
 * @fileOverview Elite AI document synthesizer for rapid study notes and high-density analysis.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeStudyDocumentInputSchema = z.object({
  fileContent: z
    .string()
    .describe(
      "The content of the study material as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  documentDescription: z
    .string()
    .describe('A brief description of the document.')
    .optional()
});
export type SummarizeStudyDocumentInput = z.infer<typeof SummarizeStudyDocumentInputSchema>;

const SummarizeStudyDocumentOutputSchema = z.object({
  shortNotes: z.string().describe('Executive summary for fast review.'),
  keyPoints: z.array(z.string()).describe('High-impact critical takeaways.'),
  flashcards: z.array(z.object({
    question: z.string(),
    answer: z.string()
  })).describe('Active recall flashcards.'),
  chapterSummaries: z.array(z.object({
    chapterTitle: z.string().optional(),
    summary: z.string()
  })).describe('Structural breakdown of content.')
});
export type SummarizeStudyDocumentOutput = z.infer<typeof SummarizeStudyDocumentOutputSchema>;

export async function summarizeStudyDocument(
  input: SummarizeStudyDocumentInput
): Promise<SummarizeStudyDocumentOutput> {
  return summarizeStudyDocumentFlow(input);
}

const summarizeStudyDocumentPrompt = ai.definePrompt({
  name: 'summarizeStudyDocumentPrompt',
  input: {schema: SummarizeStudyDocumentInputSchema},
  output: {schema: SummarizeStudyDocumentOutputSchema},
  prompt: `You are an Elite Academic Synthesizer. Your goal is to process the following document with extreme speed and accuracy, providing high-density knowledge extraction.

### Objectives:
1. **Executive Synthesis**: Provide a high-level summary that captures the core thesis.
2. **Critical Extraction**: Identify the "must-know" points that would appear on an exam.
3. **Active Recall**: Create challenging flashcards focusing on definitions and relationships.
4. **Structural Audit**: Break down the content into logical sections or chapters.

If context is provided: {{{documentDescription}}}

Document Source: {{media url=fileContent}}

Provide the synthesis in high-fidelity markdown-ready structure inside the JSON fields.`
});

const summarizeStudyDocumentFlow = ai.defineFlow(
  {
    name: 'summarizeStudyDocumentFlow',
    inputSchema: SummarizeStudyDocumentInputSchema,
    outputSchema: SummarizeStudyDocumentOutputSchema
  },
  async input => {
    const {output} = await summarizeStudyDocumentPrompt(input);
    if (!output) throw new Error('Failed to synthesize document.');
    return output;
  }
);
