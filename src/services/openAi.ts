import OpenAI from 'openai';
import config from '../config.json';

const OPENAI_API_KEY = config.OPENAI_API_KEY;

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

export async function generateOpenAIResponse(question: string, topic: string, description: string): Promise<string> {
  const prompt = `You are an expert in real estate. Use the following context about the topic "${topic}" to provide a detailed and structured response to the question:

Context: "${description}"

Question: "${question}"

Always make sure to align with the context. Format the response with bold headings for the main points.
And Also Use Emojis for Necessary areas. 

Answer:`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 1000,
  });

  const choice = response.choices?.[0];
  const messageContent = choice?.message?.content;

  if (!messageContent) {
    throw new Error("Failed to generate a response from OpenAI");
  }

  return messageContent.trim();
}
