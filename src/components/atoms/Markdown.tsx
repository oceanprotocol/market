import React from 'react'
import ReactMarkdown from 'react-markdown'

const Markdown = ({
  text,
  className
}: {
  text: string
  className?: string
}) => {
  // fix react-markdown \n transformation
  // https://github.com/rexxars/react-markdown/issues/105#issuecomment-351585313
  const textCleaned = text.replace(/\\n/g, '\n ')

  return <ReactMarkdown source={textCleaned} className={className} />
}

export default Markdown
