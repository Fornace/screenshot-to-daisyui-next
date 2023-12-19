// components/CodeEditor.js
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import { gradientDark } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import { useCallback, useState } from 'react';
import copy from 'copy-to-clipboard';
import { Toaster, toast } from 'react-hot-toast';
import { ClipboardIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

const CodeEditor = ({ code }) => {
  const [showFiddle, setShowFiddle] = useState(false);
  const [fiddleUrl, setFiddleUrl] = useState('');

  const doOpenInJSFiddle = useCallback(async () => {
    try {
      const response = await axios.post('https://api.jsfiddle.net/fiddles', {
        html: code,
        css: '',
        js: '',
        panel_js: 3, // Use Babel for JavaScript
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200 && response.data && response.data.fiddleHash) {
        setFiddleUrl(`https://jsfiddle.net/${response.data.fiddleHash}/embedded/result/`);
        setShowFiddle(true);
      } else {
        console.error('Failed to create JSFiddle:', response);
      }
    } catch (error) {
      console.error('Error sending code to JSFiddle:', error);
    }
  }, [code]);

  const copyCode = useCallback(() => {
    copy(code);
    toast.success("Copied to clipboard", {
      position: "top-right",
    });
  }, [code]);

  return (
    <div className="mockup-code">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="flex justify-end mb-2">
        <div className="join">
          <button onClick={() => setShowFiddle(false)} className={`btn join-item ${!showFiddle ? 'btn-active' : ''}`}>
            Code
          </button>
          <button onClick={doOpenInJSFiddle} className={`btn join-item ${showFiddle ? 'btn-active' : ''}`}>
            Fiddle
          </button>
        </div>
        <button onClick={copyCode} className="btn btn-square btn-sm ml-2">
          <ClipboardIcon className="w-5 h-5" />
        </button>
      </div>
      {showFiddle ? (
        <iframe src={fiddleUrl} frameBorder="0" width="100%" height="300"></iframe>
      ) : (
        <SyntaxHighlighter
          language="javascript"
          style={gradientDark}
          wrapLongLines={true}
          showLineNumbers={true}
          lineNumberStyle={{ opacity: 0.2 }}
        >
          {code}
        </SyntaxHighlighter>
      )}
    </div>
  );
};

export default CodeEditor;