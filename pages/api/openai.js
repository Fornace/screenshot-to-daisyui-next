// pages/api/openai.js
import OpenAI from "openai";
import systemPrompt from "../../prompts/daisyUI";

const openai = new OpenAI(process.env.OPENAI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const imageUrl = req.body.imageUrl;

    // Add the image URL to the system prompt
    const promptWithImage = {
      ...systemPrompt,
      messages: [
        ...systemPrompt.messages,
        {
          role: "system",
          content: {
            type: "image_url",
            image_url: {
              url: imageUrl,
            },
          },
        },
      ],
    };

    const response = await openai.chat.completions.create(promptWithImage);

    res.status(200).json({ code: response.data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}