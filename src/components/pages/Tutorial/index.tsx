import React, { ReactElement, useEffect, useRef, useState } from 'react'
import styles from './index.module.css'
import { graphql, useStaticQuery } from 'gatsby'
import { useScrollPosition } from '@n8tb1t/use-scroll-position'
import slugify from 'slugify'
import Permission from '../../organisms/Permission'
import { SectionQueryResult } from '../Home'
import TutorialChapter, {
  TutorialChapterProps
} from '../../molecules/TutorialChapter'
import { useAsset } from '../../../providers/Asset'
import { Spin as Hamburger } from 'hamburger-react'
import { DDO } from '@oceanprotocol/lib'
import Chapter2 from './Chapters/Chapter2'
import Chapter4 from './Chapters/Chapter4'
import Chapter9 from './Chapters/Chapter9'
import Chapter10 from './Chapters/Chapter10'
interface TutorialChapterNode {
  node: {
    frontmatter: {
      title: string
      chapter: number
      videoUrl?: string
    }
    rawMarkdownBody: string
    id: string
  }
}

interface Interactivity {
  chapter: number
  component: ReactElement
}

const query = graphql`
  query {
    content: allMarkdownRemark(filter: {fileAbsolutePath: {regex: "/.+\/pages\/tutorial\/.+\\.md/"}}, sort: { fields: frontmatter___chapter}) {
      edges {
        node {
          frontmatter {
            title
            chapter
            videoUrl
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

export default function PageTutorial({
  setTutorialDdo
}: {
  setTutorialDdo: (ddo: DDO) => void
}): ReactElement {
  const data = useStaticQuery(query)
  const [isOpen, setOpen] = useState(false)
  const chapterNodes = data.content.edges as TutorialChapterNode[]
  const chapters: TutorialChapterProps[] = chapterNodes.map((edge, i) => ({
    title: edge.node.frontmatter.title,
    markdown: edge.node.rawMarkdownBody,
    chapter: edge.node.frontmatter?.chapter,
    id: slugify(edge.node.frontmatter.title),
    titlePrefix: `Chapter ${i + 1}:`,
    videoUrl: edge.node.frontmatter?.videoUrl
  }))
  const [showPriceTutorial, setShowPriceTutorial] = useState(false)
  const [showComputeTutorial, setShowComputeTutorial] = useState(false)

  const [scrollPosition, setScrollPosition] = useState(0)
  useScrollPosition(({ prevPos, currPos }) => {
    prevPos.y !== currPos.y && setScrollPosition(currPos.y * -1)
  })

  const interactivity = [
    {
      chapter: 2,
      component: <Chapter2 />
    },
    {
      chapter: 4,
      component: (
        <Chapter4
          showPriceTutorial={showPriceTutorial}
          setTutorialDdo={setTutorialDdo}
          setShowPriceTutorial={setShowPriceTutorial}
        />
      )
    },
    {
      chapter: 9,
      component: (
        <Chapter9
          showPriceTutorial={showPriceTutorial}
          showComputeTutorial={showComputeTutorial}
          setShowComputeTutorial={setShowComputeTutorial}
        />
      )
    },
    {
      chapter: 10,
      component: (
        <Chapter10
          showPriceTutorial={showPriceTutorial}
          showComputeTutorial={showComputeTutorial}
        />
      )
    }
  ]

  const findInteractiveComponent = (
    arr: Interactivity[],
    chapterNumber: number
  ) => {
    if (!chapterNumber) return
    return arr.find((e) => e.chapter === chapterNumber)?.component
  }

  const handleBurgerClose = () => {
    if (isOpen) setOpen(false)
  }

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.hamburger}>
          <Hamburger toggled={isOpen} toggle={setOpen} />
          <div className={`${styles.toc} ${isOpen && styles.open}`}>
            {isOpen && (
              <>
                <h3>Table of contents</h3>
                <ul>
                  {chapters.map((chapter, i) => (
                    <li key={i}>
                      <a href={`#${chapter.id}`} onClick={handleBurgerClose}>
                        {chapter.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>

        <div className={styles.toc2}>
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
              <TutorialChapter
                chapter={chapter}
                key={i}
                pageProgress={scrollPosition}
                videoUrl={chapter.videoUrl}
                interactiveComponent={findInteractiveComponent(
                  interactivity,
                  chapter.chapter
                )}
              />
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
