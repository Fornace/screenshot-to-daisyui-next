import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import SyStemPrompt from "../../prompts/daisyUI.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = "edge";

const createRequestMessages = async (req) => {
  const { messages, data } = await req.json();

// console.log("req", {messages, data})


  if (!data?.imageUrl) return messages;

  const initialMessages = messages.slice(0, -1);
  const currentMessage = messages[messages.length - 1];
  const payload = [

    {
      role: "system",
      content: SyStemPrompt,
    },
    ...initialMessages,
    {
      ...currentMessage,
      content: [
        // { type: "text", text: currentMessage.content },

        {
          "type": "text",
          "text": "Generate code for a web page that looks exactly like this. Don't use MD or ```"
        },
        {
          type: "image_url",
          image_url: {url: data.imageUrl},
        },
      ],
    },
  ];


  // console.log("payload", {payload})

  return payload
};

export default async function POST(req) {
  const inputMessages = await createRequestMessages(req);
  console.log({inputMessages})
  const response = await openai.chat.completions.create({
    model: "gpt-4-vision-preview",
    stream: true,
    messages: inputMessages,
    max_tokens: 2000,
  });
  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}