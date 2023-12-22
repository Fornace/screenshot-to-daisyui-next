// File path: /pages/api/openai.js

import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import SyStemPrompt from "../../prompts/daisyUI.js";

export const runtime = 'edge';

export default async function handleStream(req, res) {
  console.log('Receiving request for OpenAI');

  if (req.method !== 'POST') {
    console.error('Request method is not POST');
    return res.status(405).send('Method Not Allowed');
  }

  try {
    // Reading the request body only once
    const { messages, data } = await req.json();
    console.log('Received handleSubmit:', messages, data);

    // if (!messages || !messages.prompt) {
    //   console.error('Prompt is missing in request body');
    //   return res.status(400).send('Bad Request: Prompt is missing');
    // }

    const apiKey = requestBody.apiKey || process.env.OPENAI_API_KEY;
    console.log('API Key:', apiKey ? 'Provided' : 'Not provided, using environment variable');
    const openai = new OpenAI({
      apiKey,
    });

    let imageDataUrl = `data:image/png;base64,${data}`;
    console.log({ requestBody, imageDataUrl });

    const prompt = [
      {
        role: "system",
        content: SyStemPrompt,
      },
      {
        role: "user",
        content: [
          {
            "type": "text",
            "text": "Generate code for a web page that looks exactly like this. Don't use MD or ```"
          },
          {
            "type": "image_url",
            "image_url": imageDataUrl,
          },
        ],
      }
    ];

    console.log('Sending prompt to OpenAI:', prompt);
    const response = await openai.chat.completions.create({
      model: 'gpt-4-vision-preview',
      stream: true,
      messages: prompt,
      max_tokens: 4096,
    });

    console.log('OpenAI response received:', response);
    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error('Error in handleStream:', error);
    if (error instanceof OpenAI.APIError) {
      const { name, status, headers, message } = error;
      console.error('OpenAI APIError:', { name, status, headers, message });
      return res.status(500).send(({ name, status, headers, message }));
    } else {
      throw error;
    }
  }
}
