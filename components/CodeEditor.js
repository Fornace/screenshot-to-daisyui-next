// File path: /components/CodeEditor.js

import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { gradientDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { toast, Toaster } from 'react-hot-toast';
import { ClipboardIcon, ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/outline';

const CodeEditor = ({ code }) => {
  const [showPreview, setShowPreview] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(code).then(() => {
      toast.success('Copied to clipboard', {
        position: 'top-right',
      });
    }, () => {
      toast.error('Failed to copy code', {
        position: 'top-right',
      });
    });
  };

  const openInNewTab = () => {
    const newWindow = window.open();
    newWindow.document.write(code);
    newWindow.document.close();
  };

  return (
    <div className="mockup-code">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="flex justify-between mb-4">
        <div className="tabs tabs-boxed">
          <button className={`tab tab-lifted ${!showPreview ? 'tab-active' : ''}`} onClick={() => setShowPreview(false)}>Code</button>
          <button className={`tab tab-lifted ${showPreview ? 'tab-active' : ''}`} onClick={() => setShowPreview(true)}>Preview</button>
        </div>
        <div className="flex">
          <button onClick={copyCode} className="btn btn-square btn-sm">
            <ClipboardIcon className="w-6 h-6" />
          </button>
          <button onClick={openInNewTab} className="btn btn-square btn-sm ml-2">
            <ArrowRightStartOnRectangleIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
      {showPreview ? (
        <iframe
          title="Preview"
          srcDoc={code}
          frameBorder="0"
          width="100%"
          style={{ height: '60vh' }}
          sandbox="allow-scripts allow-presentation allow-forms"
        ></iframe>
      ) : (
        <SyntaxHighlighter
          language="html"
          style={gradientDark}
          customStyle={{ margin: 0, borderRadius: '0.5rem' }}
          codeTagProps={{ style: { fontFamily: 'inherit' } }}
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
