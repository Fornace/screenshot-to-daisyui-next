import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const DropZone = ({ setLoading, setShowOptions, setStatusText, onUploadSuccess }) => {
    const [uploadedImage, setUploadedImage] = useState(null);

    const fileToBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });

    const onDrop = useCallback(async (acceptedFiles) => {
        const file = acceptedFiles[0];
        setLoading(true);

        try {
            console.log('File accepted:', file);
            
            const base64 = await fileToBase64(file);
            console.log('File converted to base64:', base64);

            setStatusText('Analysing...');
            setShowOptions(true);

            // Pass the base64 string to the onUploadSuccess handler
            onUploadSuccess(base64);

            // Set the uploaded image for preview
            setUploadedImage(base64);
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
