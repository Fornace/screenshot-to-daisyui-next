// pages/index.js
import { useState } from 'react';
import CodeEditor from '../components/CodeEditor';
import DropZone from '../components/DropZone';
import Settings from '../components/Settings';
import axios from 'axios';

export default function Home() {
  const [openAIKey, setOpenAIKey] = useState('');
  const [screenshotOneAPIKey, setScreenshotOneAPIKey] = useState('');
  const [url, setUrl] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const onFileAccepted = async (file) => {
    setLoading(true);
    setShowOptions(false);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setCode(response.data.code);
      setShowOptions(true);
    } catch (error) {
      console.error('Error uploading file:', error);
      // Handle error case here
    }

    setLoading(false);
  };

  return (
    <div className="p-4 md:p-8 flex flex-col gap-4 md:gap-8" data-theme="dark">
      <div className="text-3xl md:text-5xl font-bold text-white">
        Screenshot to daisyUI
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        <div className="flex flex-col gap-4">
          {showOptions && (
            <>
              <textarea
                className="textarea textarea-bordered h-24"
                placeholder="Tell the AI what to change..."
              ></textarea>
              <label className="label cursor-pointer justify-start gap-2">
                <span className="label-text text-white">
                  Include screenshot of current version?
                </span>
                <input type="checkbox" className="toggle toggle-primary" />
              </label>
              <div className="flex gap-2">
                <button
                  className="btn btn-primary gap-2"
                  onClick={() => setCode('// Code updated...')}
                >
                  {/* Icon component */}
                  Update
                </button>
                <button
                  className="btn btn-outline gap-2"
                  onClick={() => setCode('')}
                >
                  {/* Icon component */}
                  Reset
                </button>
              </div>
            </>
          )}
          <Settings
            openAIKey={openAIKey}
            setOpenAIKey={setOpenAIKey}
            screenshotOneAPIKey={screenshotOneAPIKey}
            setScreenshotOneAPIKey={setScreenshotOneAPIKey}
          />
        </div>
        <div className="flex flex-col gap-4">
          <DropZone setCode={setCode} setLoading={setLoading} setShowOptions={setShowOptions} />
          <div className="flex flex-col gap-2">
            <span className="text-base-content text-opacity-40">
              Or screenshot a URL...
            </span>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter URL"
                className="input input-bordered w-full"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <button className="btn btn-primary">
                Capture
              </button>
            </div>
          </div>
        </div>
      </div>
      {code && <CodeEditor code={code} />}
      {loading && <div>Loading...</div>}
    </div>
  );
}