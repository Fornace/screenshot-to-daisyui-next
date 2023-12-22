import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import SyStemPrompt from "../../prompts/daisyUI.js";

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
 
// Set the runtime to edge for best performance
export const runtime = 'edge';
 
export default async function POST(req) {
  const body = await req.json();
  // const { prompt, data } = await req.json();
  console.log( {body})
    const { prompt, data } = body;

  // Ask OpenAI for a streaming completion given the prompt


  const messages = [
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
          "image_url": data.imageUrl,
        },
      ],
    }
  ];




  const response = await openai.chat.completions.create({
    model: 'gpt-4-vision-preview',
    stream: true,
    max_tokens: 1000,
    messages,
  });
  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}




// import OpenAI from 'openai';
// import { OpenAIStream, StreamingTextResponse } from 'ai';
 
// // Create an OpenAI API client (that's edge friendly!)
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });
 
// // IMPORTANT! Set the runtime to edge
// export const runtime = 'edge';
 
// export default async function POST(req) {
//   // 'data' contains the additional data that you have sent:
//   const { messages, data } = await req.json();
 
//   const initialMessages = messages.slice(0, -1);
//   const currentMessage = messages[messages.length - 1];
 
//   // Ask OpenAI for a streaming chat completion given the prompt
//   const response = await openai.chat.completions.create({
//     model: 'gpt-4-vision-preview',
//     stream: true,
//     max_tokens: 150,
//     messages: [
//       ...initialMessages,
//       {
//         ...currentMessage,
//         content: [
//           { type: 'text', text: currentMessage.content },
 
//           // forward the image information to OpenAI:
//           {
//             type: 'image_url',
//             image_url: data.imageUrl,
//           },
//         ],
//       },
//     ],
//   });
 
//   // Convert the response into a friendly text-stream
//   const stream = OpenAIStream(response);
//   // Respond with the stream
//   return new StreamingTextResponse(stream);
// }