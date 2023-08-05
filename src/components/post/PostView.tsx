import React, { useCallback, useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { NormalComponents } from 'react-markdown/lib/complex-types'
import { SpecialComponents } from 'react-markdown/lib/ast-to-react'
import { onLoadPresignedUrl } from 'server/service/post.telefunc'

type Props = {
  content: string
}

const reloadImage = async (content: string): Promise<string> => {
  const fileTagList = content.match(/<bdg-minio=(.*?)\/>/g)
  if (fileTagList === null) return content
  const convertMap: Map<string, string> = new Map()
  for (const fileTag of fileTagList) {
    const fileUID = fileTag.replace('<bdg-minio=', '').replace('/>', '')
    const url = await onLoadPresignedUrl(fileUID)
    const imageTag = `<Image  src="${url}" alt="thumbnail"/>`
    convertMap.set(fileTag, imageTag)
  }
  return content.replace(/<bdg-minio=(.*?)\/>/g, (matched) => {
    return convertMap.get(matched) || 'not-found'
  })
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

  const [content, setContent] = useState(props.content)
  const updateContent = useCallback(async () => {
    setContent(await reloadImage(props.content))
  }, [props.content])

  useEffect(() => {
    updateContent()
  }, [props.content, updateContent])

  return (
    <div className="markdown-body">
      <ReactMarkdown
        components={components}
        rehypePlugins={[rehypeRaw]}
        remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  )
}

export default PostMarkdown
