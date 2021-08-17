import React, { ReactElement, useState, useRef, useEffect } from 'react'
import styles from './Tutorial.module.css'
import { graphql, useStaticQuery } from 'gatsby'
import Markdown from '../atoms/Markdown'
import Progressbar from '../atoms/Progressbar'
import { useScrollPosition } from '@n8tb1t/use-scroll-position'
import slugify from 'slugify'
import classNames from 'classnames/bind'
import Permission from '../organisms/Permission'
import { SectionQueryResult } from './Home'

interface TutorialChapterNode {
  node: {
    frontmatter: {
      title: string
    }
    rawMarkdownBody: string
    id: string
  }
}

interface TutorialChapterProps {
  id: string
  title: string
  markdown: string
  titlePrefix?: string
}

const cx = classNames.bind(styles)

const query = graphql`
  query {
    content: allMarkdownRemark(filter: {fileAbsolutePath: {regex: "/.+\/pages\/tutorial\/.+\\.md/"}}, sort: { fields: frontmatter___chapter}) {
      edges {
        node {
          frontmatter {
            title
          }
          rawMarkdownBody
          id
        }
      }
    }
  }
`

const queryDemonstrators = {
  page: 1,
  offset: 2,
  query: {
    query_string: {
      query:
        'id:did\\:op\\:Dd64fD4Ff847A2FBEC2596E7A58fbB439654acB5 id:did\\:op\\:55D7212b58a04D8D24a2B302D749ADEF83B4a7d3'
    }
  },
  sort: { created: -1 }
}

export function TutorialChapter({
  chapter,
  pageProgress
}: {
  chapter: TutorialChapterProps
  pageProgress: number
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
      </section>
    </>
  )
}

export default function PageTutorial(): ReactElement {
  const data = useStaticQuery(query)
  const chapterNodes = data.content.edges as TutorialChapterNode[]
  const chapters: TutorialChapterProps[] = chapterNodes.map((edge, i) => ({
    title: edge.node.frontmatter.title,
    markdown: edge.node.rawMarkdownBody,
    id: slugify(edge.node.frontmatter.title),
    titlePrefix: `Chapter ${i + 1}:`
  }))

  const [scrollPosition, setScrollPosition] = useState(0)

  useScrollPosition(({ prevPos, currPos }) => {
    prevPos.y !== currPos.y && setScrollPosition(currPos.y * -1)
  })

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.toc}>
          <h3>Table of contents</h3>
          <ul>
            {chapters.map((chapter, i) => (
              <li key={i}>
                <a href={`#${chapter.id}`}>{chapter.title}</a>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.tutorial}>
          {chapters.map((chapter, i) => {
            return (
              i !== 0 && (
                <TutorialChapter
                  chapter={chapter}
                  key={i}
                  pageProgress={scrollPosition}
                />
              )
            )
          })}
          <Permission eventType="browse">
            <>
              {/* !TODO: query content from json? */}
              <h3>Congratulations!</h3>
              <h5>Go ahead and try it yourself</h5>
              <p>
                Feel free to start your journey into the new european data
                economy right away. You can use our demonstrator assets listed
                below to experience what this data economy could feel like.
              </p>
              <SectionQueryResult
                className="demo"
                title=""
                query={queryDemonstrators}
              />
            </>
          </Permission>
        </div>
      </div>
    </>
  )
}
