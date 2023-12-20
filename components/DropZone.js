// /components/DropZone.js

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const DropZone = ({ setLoading, setShowOptions, setStatusText, onUploadSuccess }) => {
  const [uploadedImage, setUploadedImage] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await fetch(`/api/upload?filename=${file.name}`, {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed: ${uploadResponse.statusText}`);
      }

      const { url: imageUrl } = await uploadResponse.json();
      setStatusText('Analysing...');
      setShowOptions(true);
      
      // Trigger onUploadSuccess with an object structured to simulate an event.
      onUploadSuccess({ target: { value: imageUrl } });

      setUploadedImage(URL.createObjectURL(file));
    } catch (error) {
      console.error('Error processing file:', error);
      setStatusText('Failed to process the image. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [setLoading, setShowOptions, setStatusText, onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {'image/*': ['.jpeg', '.jpg', '.png']},
  });

  return (
    <div {...getRootProps()} className="border-dashed border-2 border-base-300 rounded-box h-64 flex justify-center items-center cursor-pointer bg-base-200 hover:bg-base-300">
      <input {...getInputProps()} />
      {
        uploadedImage ?
          <div style={{ backgroundImage: `url(${uploadedImage})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }} className="w-full h-full rounded-box" /> :
          <div className="flex flex-col items-center justify-center p-4">
            {isDragActive ? (
              <p className="text-base-content text-opacity-40">Drop the files here...</p>
            ) : (
              <p className="text-base-content text-opacity-40 text-center">Drag & drop a screenshot here, or click to upload</p>
            )}
            <button className="btn btn-sm mt-2">Select file</button>
          </div>
      }
    </div>
  );
};

export default DropZone;
