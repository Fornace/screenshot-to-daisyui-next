// components/CodeEditor.js
import Editor from '@monaco-editor/react'

const CodeEditor = ({ code, setCode }) => {
  return (
    <div>
      <Editor
        height="30vh"
        // defaultLanguage="jsx"
        value={code.replace('```html', '').replace('```', '')}
        // onChange={setCode}
        theme="vs-dark"
        language="xml"
        automaticLayout={true}
      />
      <iframe style={{backgroundColor: 'transparent'}}><h1>hello</h1>{code.replace('```html', '').replace('```', '')}</iframe>
    </div>
  )
}

export default CodeEditor