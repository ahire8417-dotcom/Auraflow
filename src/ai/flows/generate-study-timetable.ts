'use server';
/**
 * @fileOverview A Genkit flow for generating a personalized study timetable.
 *
 * - generateStudyTimetable - A function that handles the study timetable generation process.
 * - GenerateStudyTimetableInput - The input type for the generateStudyTimetable function.
 * - GenerateStudyTimetableOutput - The return type for the generateStudyTimetable function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStudyTimetableInputSchema = z.object({
  subjects: z.array(z.string()).describe('List of subjects to be included in the timetable.'),
  dailyStudyHours: z
    .number()
    .positive()
    .describe('The total number of study hours available per day.'),
  examDates: z
    .array(
      z.object({
        subject: z.string().describe('The subject for the exam.'),
        date: z.string().describe('The date of the exam in YYYY-MM-DD format.'),
      })
    )
    .describe('List of upcoming exams with their subjects and dates.'),
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .describe('The start date for the timetable generation in YYYY-MM-DD format.'),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .describe('The end date for the timetable generation in YYYY-MM-DD format.'),
  additionalNotes: z
    .string()
    .optional()
    .describe(
      'Any additional constraints or preferences for the timetable (e.g., preferred study times, breaks).'
    ),
});
export type GenerateStudyTimetableInput = z.infer<typeof GenerateStudyTimetableInputSchema>;

const StudyBlockSchema = z.object({
  subject: z.string().describe('The subject to be studied.'),
  topic: z.string().optional().describe('A specific topic or chapter to focus on.'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/).describe('The start time of the study block in HH:MM format.'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/).describe('The end time of the study block in HH:MM format.'),
  durationMinutes: z.number().positive().describe('Duration of the study block in minutes.'),
});

const DailyScheduleSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe('The date of the schedule in YYYY-MM-DD format.'),
  studyBlocks: z.array(StudyBlockSchema).describe('A list of study blocks for the day.'),
});

const GenerateStudyTimetableOutputSchema = z.object({
  timetable: z.array(DailyScheduleSchema).describe('The generated personalized study timetable.'),
  summary: z.string().describe('A summary of the generated timetable and optimization strategy.'),
});
export type GenerateStudyTimetableOutput = z.infer<typeof GenerateStudyTimetableOutputSchema>;

export async function generateStudyTimetable(
  input: GenerateStudyTimetableInput
): Promise<GenerateStudyTimetableOutput> {
  return generateStudyTimetableFlow(input);
}

const generateStudyTimetablePrompt = ai.definePrompt({
  name: 'generateStudyTimetablePrompt',
  input: {schema: GenerateStudyTimetableInputSchema},
  output: {schema: GenerateStudyTimetableOutputSchema},
  prompt: `You are an AI-powered study planner. Your task is to create a personalized and optimized study timetable for a student.

The student has provided the following information:
- Subjects: {{{json subjects}}}
- Daily Study Hours: {{{dailyStudyHours}}} hours
- Exam Dates: {{{json examDates}}}
- Timetable Start Date: {{{startDate}}}
- Timetable End Date: {{{endDate}}}
{{#if additionalNotes}}- Additional Notes/Preferences: {{{additionalNotes}}}{{/if}}

Create a detailed study timetable for each day within the specified date range. Optimize the schedule to maximize study efficiency, considering exam dates, subject load, and daily available study hours. Ensure subjects with closer exam dates receive more focus.

For each day, specify study blocks including the subject, a suggested topic to study (if applicable), start time, end time, and duration in minutes.

Provide a summary explaining the optimization strategy used to create the timetable.

Ensure all times are in 24-hour HH:MM format.
`,
});

const generateStudyTimetableFlow = ai.defineFlow(
  {
    name: 'generateStudyTimetableFlow',
    inputSchema: GenerateStudyTimetableInputSchema,
    outputSchema: GenerateStudyTimetableOutputSchema,
  },
  async input => {
    const {output} = await generateStudyTimetablePrompt(input);
    return output!;
  }
);
