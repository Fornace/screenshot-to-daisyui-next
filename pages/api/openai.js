// pages/api/openai.js
import OpenAI from "openai";
import SyStemPrompt from "../../prompts/daisyUI.js";

const openai = new OpenAI(process.env.OPENAI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  // console.log({prompt: systemPrompt.prompt})

  try {
    const imageUrl = req.body.imageUrl;

    // Add the image URL to the system prompt
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "system",
          content: [{
            type: "text",
            text: SyStemPrompt
          }]
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Generate code for a web page that looks exactly like this. Don't use MD or ```"
            },
            {
              type: "image_url",
              image_url: {
                "url": imageUrl,
              },
            },
          ],
        },
      ],
      "max_tokens": 4096
    });
    // console.log(response.choices[0]);

    // const response = await openai.chat.completions.create(promptWithImage);

    res.status(200).json({ code: response.choices[0].message.content, response });
  } catch (error) {
    console.log({error})
    res.status(500).json({ error: error.message });
  }
}