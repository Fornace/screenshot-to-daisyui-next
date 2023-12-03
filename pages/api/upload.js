// pages/api/upload.js
import { put } from '@vercel/blob';

export default async function handler(request, response) {
  const { filename } = request.query;
  const blob = await put(filename, request, {
    access: 'public',
  });

  return response.status(200).json(blob);
}

export const config = {
  api: {
    bodyParser: false,
  },
};