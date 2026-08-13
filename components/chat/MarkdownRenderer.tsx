"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

type CodeProps = React.HTMLAttributes<HTMLElement> & { inline?: boolean; children?: React.ReactNode };

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="markdown min-w-0 text-[15px]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, inline, ...props }: CodeProps) {
            const language = /language-(\\w+)/.exec(className || "")?.[1];
            if (!inline && language) {
              return <SyntaxHighlighter style={oneDark} language={language} PreTag="div" customStyle={{ margin: "0.8em 0", borderRadius: 10, fontSize: "0.84rem", padding: "1rem" }}>{String(children).replace(/\\n$/, "")}</SyntaxHighlighter>;
            }
            return <code className={className} {...props}>{children}</code>;
          },
          a({ href, children, ...props }) { return <a href={href} target="_blank" rel="noreferrer" {...props}>{children}</a>; },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
