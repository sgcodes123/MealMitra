import { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PrismAsyncLight as SyntaxHighlighter } from "react-syntax-highlighter";
import oneDark from "react-syntax-highlighter/dist/esm/styles/prism/one-dark";
import oneLight from "react-syntax-highlighter/dist/esm/styles/prism/one-light";
import { useTheme } from "../../context/useTheme";


function CodeBlock({ className, children }) {
    const { dark } = useTheme();
    const match = /language-(\w+)/.exec(className || "");
    const codeText = String(children).replace(/\n$/, "");

    if (!match) {
        return (
            <code className="rounded bg-emerald-900/10 px-1 py-0.5 text-[0.85em] dark:bg-white/10">
                {codeText}
            </code>
        );
    }

    return (
        <SyntaxHighlighter
            language={match[1]}
            style={dark ? oneDark : oneLight}
            customStyle={{ margin: 0, borderRadius: "0.75rem", fontSize: "0.8rem" }}
            wrapLongLines
        >
            {codeText}
        </SyntaxHighlighter>
    );
}

function MarkdownMessageBase({ text }) {
    return (
        <div className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-headings:my-1 dark:prose-invert prose-table:my-1 prose-pre:my-1 prose-pre:bg-transparent prose-pre:p-0">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ code: CodeBlock }}>
                {text}
            </ReactMarkdown>
        </div>
    );
}


export default memo(MarkdownMessageBase, (prev, next) => prev.text === next.text);