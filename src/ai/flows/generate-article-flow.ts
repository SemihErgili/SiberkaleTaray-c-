'use server';

/**
 * @fileOverview Analyzes a cybersecurity topic, breaking it down into detailed sections.
 *
 * - generateArticle - A function that creates a detailed analysis of a topic.
 * - GenerateArticleInput - The input type for the generateArticle function.
 * - GenerateArticleOutput - The output type for the generateArticle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

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
            'Detailed explanation for this section, formatted with paragraphs (separated by newlines) and code snippets where applicable.'
          ),
      })
    )
    .describe(
      'An array of 5-7 detailed analysis sections about the topic. Only generate if isCybersecurityTopic is true.'
    ).optional(),
    relatedTopics: z.array(z.string()).describe('An array of 3-5 related cybersecurity topics.').optional(),
});
export type GenerateArticleOutput = z.infer<typeof GenerateArticleOutputSchema>;

export async function generateArticle(
  input: GenerateArticleInput
): Promise<GenerateArticleOutput> {
  // The Genkit plugin will handle the API key check internally.
  // If the key is missing, it will throw a specific error which we'll catch below.
  return analyzeThreatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeThreatPrompt',
  input: {schema: GenerateArticleInputSchema},
  output: {schema: GenerateArticleOutputSchema},
  prompt: `
You are a senior cybersecurity analyst and educator. Your task is to analyze the topic: '{{{topic}}}'.

You MUST respond with a valid JSON object that strictly adheres to the provided output schema.
The entire response, including all keys and values in the JSON, MUST be in Turkish.
Do not include any text, notes, or explanations outside of the main JSON object.

First, determine if the topic is related to cybersecurity, hacking, penetration testing, digital forensics, or a similar technical field.
- If it IS a cybersecurity topic, set 'isCybersecurityTopic' to true and proceed with the detailed analysis.
- If it is NOT a cybersecurity topic (e.g., 'love', 'cooking', 'sports'), set 'isCybersecurityTopic' to false and DO NOT generate the 'topicTitle', 'analysis', or 'relatedTopics' fields.

For valid cybersecurity topics, your analysis must be practical and deeply technical, aimed at security professionals and ethical hacking students.
For each section, you MUST explain the concept with practical, hands-on examples.
For instance, when explaining SQL Injection, you MUST provide sample vulnerable code snippets (e.g., in PHP or Python) and the corresponding malicious SQL queries.
Show how the attack works step-by-step.
Then, explain the defense mechanisms and provide corrected, secure code examples.
Use markdown code blocks (\`\`\`) for all code examples and shell commands.

The goal is to teach by showing. The content should be actionable and illustrative.
Create between 5 and 7 detailed analysis sections.
After the analysis, suggest 3 to 5 related topics that a user interested in '{{{topic}}}' might also want to learn about.

Ethical Warning: DO NOT provide instructions for illegal activities. All examples must be presented in the context of ethical hacking and cybersecurity education to build better defenses. Explicitly state that these techniques should only be used on systems you have permission to test.

Generate the analysis for the topic now.
`,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_CIVIC_INTEGRITY',
        threshold: 'BLOCK_NONE',
      },
    ],
  },
});

const analyzeThreatFlow = ai.defineFlow(
  {
    name: 'analyzeThreatFlow',
    inputSchema: GenerateArticleInputSchema,
    outputSchema: GenerateArticleOutputSchema,
  },
  async input => {
    let response;
    try {
        response = await prompt(input);
    } catch (e: any) {
        if (e.message.includes('API key') || e.message.includes('FAILED_PRECONDITION')) {
             throw new Error(`Yapay zeka servisi için API anahtarı yapılandırılmamış veya geçersiz. Lütfen .env dosyanıza GEMINI_API_KEY anahtarını eklediğinizden emin olun. Eğer uygulamayı Vercel gibi bir platformda çalıştırıyorsanız, bu anahtarı proje ayarlarındaki Ortam Değişkenleri (Environment Variables) bölümüne eklemelisiniz.`);
        }
        // Re-throw other errors
        throw e;
    }
    
    const output = response.output;

    if (!output) {
      const finishReason = response.candidates?.[0]?.finishReason;
      const safetyRatings = response.candidates?.[0]?.safetyRatings;
      console.error('AI model returned no output.', { finishReason, safetyRatings });
      
      let errorMessage = `"${input.topic}" konusu analiz edilirken bir hata oluştu. Model beklenen formatta bir yanıt üretemedi.`;
      if (finishReason === 'SAFETY') {
        errorMessage = `"${input.topic}" konusu için yapılan analiz, yapay zekanın içerik güvenlik politikaları tarafından engellendi. Lütfen daha genel bir konu deneyin.`;
      } else if (finishReason === 'RECITATION' || finishReason === 'OTHER') {
        errorMessage = `"${input.topic}" konusu analiz edilemedi. Model, bu konu hakkında yeterli veya güvenli bilgi üretemedi.`;
      } else if (response.candidates?.[0]?.finishReason === 'ERROR') {
        errorMessage = 'Yapay zeka servisiyle iletişim kurarken bir hata oluştu. Lütfen API anahtarınızı kontrol edin ve tekrar deneyin.'
      }

      throw new Error(errorMessage);
    }

    return output;
  }
);
