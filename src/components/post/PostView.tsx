import React from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { NormalComponents } from 'react-markdown/lib/complex-types'
import { SpecialComponents } from 'react-markdown/lib/ast-to-react'

type Props = {
  content: string
}
const PostMarkdown: React.FunctionComponent<Props> = (props) => {
  const components: Partial<NormalComponents & SpecialComponents> = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '')
      return !inline && match ? (
        <div style={{ width: '100%' }}>
          <SyntaxHighlighter
            style={atomDark}
            PreTag="div"
            language={match[1]}
            {...props}>
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        </div>
      ) : inline ? (
        <code className={className ? className : ''} {...props}>
          {children}
        </code>
      ) : (
        <SyntaxHighlighter
          style={atomDark}
          PreTag="div"
          language={'text'}
          {...props}>
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      )
    }
  }

  return (
    <div className="markdown-body">
      <ReactMarkdown
        components={components}
        rehypePlugins={[rehypeRaw]}
        remarkPlugins={[remarkGfm]}>
        {props.content}
      </ReactMarkdown>
      {/* generate ReactMarkDown Editor */}
    </div>
  )
}

export default PostMarkdown
