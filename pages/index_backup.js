// File path: /pages/index.js

import { useState, useEffect, useRef } from 'react';
import CodeEditor from '../components/CodeEditor';
import DropZone from '../components/DropZone';
import Settings from '../components/Settings';
import { useChat } from 'ai/react';

export default function Home() {
  const [openAIKey, setOpenAIKey] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [statusText, setStatusText] = useState('Ready');
  const [imageBlob, setImageBlob] = useState(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading, stop } = useChat({ api: 'api/chat' });


  {messages.length > 0
    ? messages.map(m => (
        <div key={m.id} className="whitespace-pre-wrap">
          {m.role === 'user' ? 'User: ' : 'AI: '}
          {m.content}
        </div>
      ))
    : null}



  const formRef = useRef();

  useEffect(() => {
    const savedOpenAIKey = localStorage.getItem('openAIKey');
    if (savedOpenAIKey) {
      setOpenAIKey(savedOpenAIKey);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('openAIKey', openAIKey);
  }, [openAIKey]);

  useEffect(() => {
    if (messages) {
      console.log('AI completion received:', messages);
      setCode(messages[messages.length - 1]?.content);
      setStatusText('AI response received!');
    }
  }, [messages]);

  const handleUploadSuccess = (blob) => {
    if (blob) {
      console.log('Blob received:', blob);
      setLoading(true);
      setShowOptions(true);
      setStatusText('AI is generating code, please wait...');
      setImageBlob(blob);
    }
  };

  // const handleFormSubmit = async (e) => {
  //   // e.preventDefault();
  //   if (imageBlob) {
  //     console.log({"this is the blob": imageBlob})
  //     // const formData = new FormData();
  //     // formData.append('image', imageBlob);
  //     // handleSubmit called with a data object containing the image blob
  //     await handleSubmit(e, {
  //       data: {
  //         imageUrl: imageBlob
  //       }
  //     });
  //     console.log('Submission to AI successful');
  //   }
  // };

  return (
    <div className="container mx-auto p-8 bg-base-200" data-theme="dark">
      <div className="prose lg:prose-2xl prose-invert mb-8">
        <h1>Screenshot to daisyUI</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col gap-8">


        <form
        onSubmit={e => {
          console.log({imageBlob})
          handleSubmit(e, {
            data: {
              imageUrl: "" + imageBlob.toString(),
            },
          });
        }}
      >
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="What does the image show..."
          onChange={handleInputChange}
        />
      </form>




          {showOptions && (
            <form ref={formRef} onSubmit={e => {(e, {
              data: {
                imageUrl: imageBlob,
              },
            })}}>
            <input hidden value={imageBlob} onChange={handleInputChange} />
              <textarea placeholder="Tell the AI what to change..." className="textarea textarea-bordered w-full" value={input} onChange={handleInputChange}></textarea>
              <div className="flex gap-4">
                <button type="submit" className="btn btn-primary flex-1">
                  Submit to AI
                </button>
                <button className="btn btn-outline flex-1" onClick={() => setCode('')}>
                  Reset
                </button>
              </div>
            </form>
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
      {code && <CodeEditor code={code} />}
      <div className="toast toast-center">
        <div className="toast-message">{statusText}</div>
      </div>
    </div>
  );
}
