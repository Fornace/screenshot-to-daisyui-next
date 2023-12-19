// components/DropZone.js
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const DropZone = ({ setCode, setLoading, setShowOptions }) => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    setLoading(true);

    try {
      const uploadResponse = await axios.post(`/api/upload?filename=${file.name}`, file, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const openAIResponse = await axios.post('/api/openai', {
        imageUrl: uploadResponse.data.url,
      });

      setCode(openAIResponse.data.code);
      setShowOptions(true);
      setUploadedImage(URL.createObjectURL(file));
    } catch (error) {
      console.error('Error processing file:', error);
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

  if (uploadedImage) {
    return (
      <div className="h-64 bg-base-200 rounded-box" style={{ backgroundImage: `url(${uploadedImage})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}></div>
    );
  }

  return (
    <div {...getRootProps()} className="border-dashed border-2 border-base-300 rounded-box h-64 flex justify-center items-center cursor-pointer bg-base-200 hover:bg-base-300">
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center p-4">
        {isDragActive ? (
          <p className="text-base-content text-opacity-40">Drop the files here...</p>
        ) : (
          <>
            <p className="text-base-content text-opacity-40 text-center">Drag & drop a screenshot here, or click to upload</p>
            <div className="mt-2">
              <button className="btn btn-sm">Select file</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DropZone;