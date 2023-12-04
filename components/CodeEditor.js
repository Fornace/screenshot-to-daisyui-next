import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import { gradientDark } from 'react-syntax-highlighter/dist/cjs/styles/hljs';

const CodeEditor = ({ code }) => {
  return (<div className="mockup-code">
    <pre data-prefix="$">    <SyntaxHighlighter
      language="javascript"
      style={gradientDark}
      wrapLongLines={true}
      showLineNumbers={true}
      showInlineLineNumbers={true}
      wrapLongLines={true}

      lineNumberStyle={{ opacity: 0.2 }}
    >
      {code}
    </SyntaxHighlighter>
    </pre>
  </div>
  );
};

export default CodeEditor;