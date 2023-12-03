// components/CodeEditor.js
import Editor from '@monaco-editor/react'

const CodeEditor = ({ code, setCode }) => {
  return (
    <Editor
      height="90vh"
      defaultLanguage="javascript"
      defaultValue={code}
      onChange={setCode}
    />
  )
}

export default CodeEditor