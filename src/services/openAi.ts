import OpenAI from 'openai';
import config from '../config.json';

const OPENAI_API_KEY = config.OPENAI_API_KEY;

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

export async function generateOpenAIResponse(question: string, topic: string ,description: string): Promise<string> {
  const prompt = `Use the following context about this topics "${topic}", provide a detailed response to the question:

Context: "${description}" , 

Question: "${question}"
always make sure to align with the context
Answer:`;

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 250,
  });

  const choice = response.choices?.[0];
  const messageContent = choice?.message?.content;

  if (!messageContent) {
    throw new Error("Failed to generate a response from OpenAI");
  }

  return messageContent.trim();
}
