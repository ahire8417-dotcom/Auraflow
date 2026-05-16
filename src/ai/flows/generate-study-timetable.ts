'use server';
/**
 * @fileOverview A high-performance academic strategist flow for generating optimized study blueprints.
 *
 * - generateStudyTimetable - A function that handles the strategic study timetable generation.
 * - GenerateStudyTimetableInput - The input type for the function.
 * - GenerateStudyTimetableOutput - The return type for the function.
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
      'Any additional constraints or preferences for the timetable.'
    ),
});
export type GenerateStudyTimetableInput = z.infer<typeof GenerateStudyTimetableInputSchema>;

const StudyBlockSchema = z.object({
  subject: z.string().describe('The subject to be studied.'),
  topic: z.string().optional().describe('A specific high-impact topic or chapter to focus on.'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/).describe('The start time of the study block in HH:MM format.'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/).describe('The end time of the study block in HH:MM format.'),
  durationMinutes: z.number().positive().describe('Duration of the study block in minutes.'),
  strategy: z.string().describe('The specific study strategy for this block (e.g., "Active Recall", "Problem Solving", "Conceptual Mapping").'),
});

const DailyScheduleSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe('The date of the schedule in YYYY-MM-DD format.'),
  dailyTheme: z.string().describe('A motivating theme for the day (e.g., "Quant Mastery", "Linguistic Flow").'),
  studyBlocks: z.array(StudyBlockSchema).describe('A list of study blocks for the day.'),
});

const GenerateStudyTimetableOutputSchema = z.object({
  timetable: z.array(DailyScheduleSchema).describe('The generated personalized study timetable.'),
  strategicBriefing: z.string().describe('A high-level explanation of the academic strategies applied (Spaced Repetition, Interleaving, etc.).'),
  optimizationScore: z.number().min(0).max(100).describe('An AI-calculated efficiency score for the generated plan.'),
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
  prompt: `You are an Elite Academic Strategist and High-Performance Study Coach. Your goal is to design a scientifically optimized study blueprint for a student within the Indian Education System.

### Scientific Principles to Apply:
1. **Interleaving**: Mix related but distinct subjects to improve long-term retention. Do not let the student study the same subject for too long.
2. **Spaced Repetition**: Ensure subjects are revisited at strategic intervals.
3. **Cognitive Load Balancing**: Place highly demanding subjects (e.g., Physics, Mathematics, Accountancy) in the early morning or when focus is highest.
4. **Active Recall**: Every block should focus on active retrieval rather than passive reading.
5. **The 80/20 Rule**: Prioritize core concepts that yield the highest academic results.

### Student Context:
- **Subjects**: {{{json subjects}}}
- **Daily Study Capacity**: {{{dailyStudyHours}}} hours
- **Exam Timeline**: {{{json examDates}}}
- **Blueprint Range**: From {{{startDate}}} to {{{endDate}}}
{{#if additionalNotes}}- **Contextual Notes**: {{{additionalNotes}}}{{/if}}

### Instructions:
- Create a day-by-day study schedule.
- For each block, specify a **topic** and a **strategy** (e.g., "Solving Numerical Problems", "Deriving Formulas", "Essay Structuring").
- Provide a **Strategic Briefing** explaining *why* this plan will work (mention the methods used).
- Calculate an **Optimization Score** based on how well the plan balances intensity and recovery.

Ensure all times are in 24-hour HH:MM format. Return the output in the specified JSON schema.`,
});

const generateStudyTimetableFlow = ai.defineFlow(
  {
    name: 'generateStudyTimetableFlow',
    inputSchema: GenerateStudyTimetableInputSchema,
    outputSchema: GenerateStudyTimetableOutputSchema,
  },
  async input => {
    const {output} = await generateStudyTimetablePrompt(input);
    if (!output) throw new Error("Failed to generate strategic blueprint.");
    return output;
  }
);
