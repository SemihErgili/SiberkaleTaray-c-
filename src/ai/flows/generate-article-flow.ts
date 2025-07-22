'use server';

/**
 * @fileOverview Manages the generation of a complete cybersecurity article in a single flow using the Groq SDK.
 * - generateArticle: Analyzes a topic and produces a full article with multiple sections and related topics.
 * - GenerateArticleInput: The input type for the generateArticle function.
 * - GenerateArticleOutput: The output type for the generateArticle function.
 */

import Groq from 'groq-sdk';
import { z } from 'zod';

// == SCHEMA DEFINITIONS =======================================================

const GenerateArticleInputSchema = z.object({
  topic: z.string().describe('The cybersecurity topic to analyze.'),
});
export type GenerateArticleInput = z.infer<typeof GenerateArticleInputSchema>;

const GenerateArticleOutputSchema = z.object({
  isCybersecurityTopic: z
    .boolean()
    .describe('Is the topic related to cybersecurity, hacking, infosec, or a related technical field?'),
  topicTitle: z
    .string()
    .describe('The main topic title, properly capitalized.')
    .optional(),
  analysis: z
    .array(
      z.object({
        title: z.string().describe('The title of this analysis section.'),
        content: z
          .string()
          .describe(
            'Detailed explanation for this section, formatted in Turkish with paragraphs (separated by newlines) and markdown code snippets (```) where applicable. Provide practical, hands-on examples. For attacks, show vulnerable code, the exploit, and then the secure/patched code. State that examples are for educational/ethical hacking purposes only.'
          ).optional(), // Make content optional to prevent Zod errors
      })
    )
    .describe(
      'An array of 5-7 detailed analysis sections about the topic. Only generate if isCybersecurityTopic is true.'
    )
    .optional(),
  relatedTopics: z
    .array(z.string())
    .describe(
      'An array of 3-5 related cybersecurity topics. Only generate if isCybersecurityTopic is true.'
    )
    .optional(),
});
export type GenerateArticleOutput = z.infer<typeof GenerateArticleOutputSchema>;


// == GROQ SDK IMPLEMENTATION =================================================

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const systemPrompt = `
You are a senior cybersecurity analyst and educator. Your task is to generate a complete, in-depth article about the user's topic.

You MUST respond with a single, valid JSON object that strictly adheres to the provided output schema.
The entire response, including all keys and values in the JSON, MUST be in Turkish.
Do not include any text, notes, or explanations outside of the main JSON object.

First, determine if the topic is related to cybersecurity, hacking, penetration testing, digital forensics, or a similar technical field.
- If it IS a cybersecurity topic, set 'isCybersecurityTopic' to true. Generate a 'topicTitle', a list of 5-7 detailed 'analysis' sections, and 3-5 'relatedTopics'.
- If it is NOT a cybersecurity topic (e.g., 'love', 'cooking', 'sports'), set 'isCybersecurityTopic' to false and DO NOT generate any other fields.

For each analysis section, you must provide deeply technical content aimed at security professionals.
Explain concepts with practical, hands-on examples.
For attack vectors, you MUST provide sample vulnerable code (e.g., PHP, Python), the exploit commands/queries, and then the secure/patched code for defense.
Use markdown code blocks (\`\`\`) for all code.

Ethical Warning: Present all examples in the context of ethical hacking for educational purposes. Explicitly state that these techniques should only be used on systems you have permission to test.
`;


/**
 * Generates a complete cybersecurity article using the Groq SDK.
 * @param input The topic to analyze.
 * @returns A promise that resolves to the full article content.
 */
export async function generateArticle(input: GenerateArticleInput): Promise<GenerateArticleOutput> {
  try {
    const stream = await groq.chat.completions.create({
        messages: [
            {
                role: "system",
                content: systemPrompt
            },
            {
                role: "user",
                content: `Lütfen '${input.topic}' konusu hakkında bir analiz oluşturun.`,
            },
        ],
        model: "llama3-70b-8192",
        temperature: 0.5,
        max_tokens: 4096,
        top_p: 1,
        stop: null,
        stream: true,
        response_format: { type: "json_object" },
    });

    let completeContent = '';
    for await (const chunk of stream) {
      completeContent += chunk.choices[0]?.delta?.content || '';
    }

    if (!completeContent) {
      throw new Error(`Groq'tan yanıt alınamadı. Model, '${input.topic}' konusu için bir analiz oluşturamadı.`);
    }

    const parsedOutput = JSON.parse(completeContent);
    const validationResult = GenerateArticleOutputSchema.safeParse(parsedOutput);

    if (!validationResult.success) {
      console.error("Groq response validation failed:", validationResult.error);
      throw new Error("Yapay zeka modeli beklenen formatta bir yanıt vermedi. Lütfen tekrar deneyin.");
    }
    
    // Filter out sections with no content
    if (validationResult.data.analysis) {
        validationResult.data.analysis = validationResult.data.analysis.filter(
            (section) => section.content && section.content.trim() !== ''
        );
    }
    
    return validationResult.data;

  } catch (error: any) {
    console.error("[Groq SDK Error] Failed to generate article:", error);
    // Re-throw the error to be handled by the page component for user feedback.
    throw error;
  }
}