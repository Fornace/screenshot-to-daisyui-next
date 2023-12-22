// File: ChatComponent.jsx
import React, { useState, useEffect } from 'react';
import { useChat } from 'ai/react';

export default function Chat({ setCode }) {
  const { messages, input, handleInputChange, handleSubmit, append } = useChat('api/chat');
  const [showTextInput, setShowTextInput] = useState(false);
  const [image, setImage] = useState('');

  useEffect(() => {
    setShowTextInput(!!input);
  }, [input]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.addEventListener(
        "load",
        () => {
          setImage(reader.result)
          append(
            {
              content: "analyzing image",
              role: 'user',
              createdAt: new Date(),
            },
            { data: { imageUrl: reader.result } },
          );
        },
        false,
      );
      reader.readAsDataURL(file);
    }
  };

  global.submit = () => handleSubmit({ target: { value: "some text" }, preventDefault: () => { } }, { data: { imageUrl: image } });

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (image) {
      handleSubmit({ target: { value: "some text" }, preventDefault: () => { } }, { data: { imageUrl: image } });
    }
  };

  useEffect(() => {
    setCode(messages[messages.length - 1]?.content)
  }, [messages])


  return (
    <div className="container mx-auto p-4 bg-base-200">

      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">Pick a file</span>
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="file-input file-input-bordered w-full max-w-xs"
        />
      </div>

      {showTextInput && (
        <form onSubmit={handleTextSubmit} className="form-control w-full max-w-md mt-4">
          <img src={image} />
          <textarea
            className="textarea textarea-bordered h-24"
            value={input}
            placeholder="Request changes..."
            onChange={handleInputChange}
          ></textarea>
          <button className="btn btn-primary mt-4">Send</button>
        </form>
      )}
    </div>
  );
}
