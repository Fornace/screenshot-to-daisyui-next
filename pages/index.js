// File path: /pages/index.js

import { useState, useEffect } from 'react';
import CodeEditor from '../components/CodeEditor';
import DropZone from '../components/DropZone';
import Settings from '../components/Settings';
import { useCompletion } from 'ai/react';

export default function Home() {
  const [openAIKey, setOpenAIKey] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [statusText, setStatusText] = useState('Ready');

  // Initialize the AI completion hook
  const { completion, input, handleInputChange, handleSubmit, isLoading, stop } = useCompletion({ api: 'api/openai' });

  useEffect(() => {
    const savedOpenAIKey = localStorage.getItem('openAIKey');
    if (savedOpenAIKey) {
      setOpenAIKey(savedOpenAIKey);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('openAIKey', openAIKey);
  }, [openAIKey]);

  // Handle the image URL change and submit the form
  useEffect(() => {
    if (input) {
      (async () => {
        setStatusText('Sending image to AI...');
        await handleSubmit({ preventDefault: () => { } }); // Mock event object with preventDefault
      })();
    }
  }, [input, handleSubmit]);

  // Update the code when the AI completes the response
  useEffect(() => {
    if (completion) {
      setCode(completion);
      setStatusText('AI response received!');
      console.log(completion);
    }
  }, [completion]);

  // Function to handle a successful image upload
  const handleUploadSuccess = (imageUrl) => {
    setLoading(true);
    setShowOptions(true);
    setStatusText('AI is generating code, please wait...');
    handleInputChange(imageUrl); // Trigger the AI completion process
  };

  return (
    <div className="container mx-auto p-8 bg-base-200" data-theme="dark">
      <div className="prose lg:prose-2xl prose-invert mb-8">
        <h1>Screenshot to daisyUI</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col gap-8">
          {showOptions && (
            <div className="space-y-4">
              <textarea className="textarea textarea-bordered w-full" placeholder="Tell the AI what to change..." value={input} onChange={(e) => handleInputChange(e.target.value)}></textarea>
              <div className="flex gap-4">
                <button className="btn btn-primary flex-1" onClick={() => handleSubmit({ preventDefault: () => { } })}> {/* Mock event object with preventDefault */}
                  Update
                </button>
                <button className="btn btn-outline flex-1" onClick={() => setCode('')}>
                  Reset
                </button>
              </div>
            </div>
          )}
          <Settings openAIKey={openAIKey} setOpenAIKey={setOpenAIKey} />
        </div>
        <div>
          <DropZone
            setLoading={setLoading}
            setShowOptions={setShowOptions}
            setStatusText={setStatusText}
            onUploadSuccess={handleUploadSuccess}
          />
        </div>
        {isLoading &&
          <button type="button" onClick={stop}>
            Stop
          </button>
        }
      </div>
      <CodeEditor code={completion} />
      {loading && (
        <div className="toast toast-center">
          <div className="toast-message">{statusText}</div>
        </div>
      )}
    </div>
  );
}
