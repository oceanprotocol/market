import React, { ReactElement, useState, useRef, useEffect } from 'react'
import slugify from 'slugify'
import Progressbar from '../atoms/Progressbar'
import Markdown from '../atoms/Markdown'
import classNames from 'classnames/bind'
import styles from './TutorialChapter.module.css'
import VideoPlayer from './VideoPlayer'

export interface TutorialChapterProps {
  id: string
  title: string
  chapter?: number
  markdown: string
  titlePrefix?: string
  videoUrl?: string
}

const cx = classNames.bind(styles)

export default function TutorialChapter({
  chapter,
  pageProgress,
  videoUrl,
  interactiveComponent
}: {
  chapter: TutorialChapterProps
  pageProgress: number
  videoUrl?: string
  interactiveComponent?: ReactElement
}): ReactElement {
  const chapterRef = useRef<HTMLElement>()
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const progress = pageProgress - chapterRef.current.offsetTop
    if (
      progress > chapterRef.current.clientHeight ||
      pageProgress < chapterRef.current.offsetTop
    )
      setProgress(0)
    else setProgress((progress / chapterRef.current.clientHeight) * 100)
  }, [pageProgress])

  return (
    <>
      <section
        id={slugify(chapter.title)}
        className={styles.chapter}
        key={chapter.id}
        ref={chapterRef}
      >
        <Progressbar
          progress={progress}
          className={cx({
            progressbar: true,
            visible: progress > 0
          })}
          id={`${chapter.id}-Progressbar`}
        />
        <h3 className={styles.chapter_title}>
          {chapter.titlePrefix && `${chapter.titlePrefix} `}
          {chapter.title}
        </h3>
        <Markdown text={chapter.markdown} />
        {videoUrl && <VideoPlayer videoUrl={videoUrl} />}
        {interactiveComponent && (
          <div className={styles.interactive}>{interactiveComponent}</div>
        )}
      </section>
    </>
  )
}
