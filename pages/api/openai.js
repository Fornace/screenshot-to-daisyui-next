// /pages/api/openai.js
import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import SyStemPrompt from "../../prompts/daisyUI.js";

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

export default async function handleStream(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  const apiKey = req.body.apiKey || process.env.OPENAI_API_KEY;
  const openai = new OpenAI({
    apiKey,
  });

  const imageUrl = req.body.imageUrl;

  const messages = [
    {
      role: "system",
      content: SyStemPrompt,
    },
    {
      role: "user",
      content: `Generate code for a web page that looks exactly like this. Don't use MD or \`\`\` ${imageUrl}`
    }
  ];
  try {

    const response = await openai.chat.completions.create({
      model: 'gpt-4-vision-preview',
      stream: true,
      messages: messages,
    });

    const stream = OpenAIStream(response);

    return new StreamingTextResponse(stream);

  } catch (error) {
    // Check if the error is an APIError
    if (error instanceof OpenAI.APIError) {
      const { name, status, headers, message } = error;
      return NextResponse.json({ name, status, headers, message }, { status });
    } else {
      throw error;
    }
  }

}
