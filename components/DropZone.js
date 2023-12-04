// components/DropZone.js
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const DropZone = ({ setCode, setLoading, setShowOptions }) => {
  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    setLoading(true);

    try {
      // Upload file to Vercel Storage
      const uploadResponse = await axios.post(`/api/upload?filename=${file.name}`, file, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Send the file URL to the OpenAI API
      const openAIResponse = await axios.post('/api/openai', {
        imageUrl: uploadResponse.data.url,
      });

      // Set the code received from the OpenAI API response
      console.log({openAIResponse})
      setCode(openAIResponse.data.code);
      setShowOptions(true);
    } catch (error) {
      console.error('Error processing file:', error);
      // Handle error case here
    }

    setLoading(false);
  }, [setCode, setLoading, setShowOptions]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.heic'],
    },
  });

  return (
    <div {...getRootProps()} className="border-dashed border-2 border-base-300 rounded-box h-64 flex justify-center items-center cursor-pointer">
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className="text-base-content text-opacity-40">Drop the files here ...</p>
      ) : (
        <p className="text-base-content text-opacity-40">Drag & drop a screenshot here, or click to upload</p>
      )}
    </div>
  );
};

export default DropZone;