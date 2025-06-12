import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './OptimizedPromptBox.css';

interface OptimizedPromptBoxProps {
  markdown: string;
}

// Helper to remove 'node' and 'key' from props
function filterProps<T extends object>(props: T) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { node, key, ...rest } = props as any;
  return rest;
}

const OptimizedPromptBox: React.FC<OptimizedPromptBoxProps> = ({ markdown }) => (
  <div className="optimized-prompt-box">
    <ReactMarkdown
      children={markdown}
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children, ...props }) => (
          <h1 className="opb-heading" {...filterProps(props)}>
            {children}
          </h1>
        ),
        h2: ({ children, ...props }) => (
          <h2 className="opb-heading" {...filterProps(props)}>
            {children}
          </h2>
        ),
        h3: ({ children, ...props }) => (
          <h3 className="opb-heading" {...filterProps(props)}>
            {children}
          </h3>
        ),
        li: ({ children, ...props }) => (
          <li className="opb-list-item" {...filterProps(props)}>
            {children}
          </li>
        ),
        p: ({ children, ...props }) => (
          <p className="opb-paragraph" {...filterProps(props)}>
            {children}
          </p>
        ),
        strong: ({ children, ...props }) => (
          <strong className="opb-strong" {...filterProps(props)}>
            {children}
          </strong>
        ),
        code: ({ children, ...props }) => {
          // ReactMarkdown sometimes passes children as an array of strings or elements
          let codeString = '';
          if (typeof children === 'string' || typeof children === 'number') {
            codeString = String(children);
          } else if (Array.isArray(children)) {
            codeString = children.map(child =>
              typeof child === 'string' || typeof child === 'number' ? String(child) : ''
            ).join('');
          } else if (children && typeof children === 'object') {
            codeString = JSON.stringify(children);
          }
          return <code className="opb-code" {...filterProps(props)}>{codeString}</code>;
        },
      }}
    />
  </div>
);

export default OptimizedPromptBox;
