// File path: /pages/index.js
import React, { useState } from 'react';
import CodeEditor from '../components/CodeEditor';
import ChatComponent from '../components/ChatComponent';
import Settings from '../components/Settings';

export default function Home() {
  const [openAIKey, setOpenAIKey] = useState('');
  const [code, setCode] = useState('');

  return (
    <div className="container mx-auto p-8 bg-base-200" data-theme="dark">
      <div className="prose lg:prose-xl prose-invert mb-8">
        <h1>Image to Code Converter</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Settings openAIKey={openAIKey} setOpenAIKey={setOpenAIKey} />
          <ChatComponent setCode={setCode} />
        </div>
        <div>
          {/* CodeEditor will be dynamically loaded with the last message content if it's HTML */}
          <CodeEditor code={code} />
        </div>
      </div>
    </div>
  );
}
