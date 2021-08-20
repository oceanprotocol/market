import React, { ReactElement, useState } from 'react'
import styles from './Tutorial.module.css'
import { graphql, useStaticQuery } from 'gatsby'
import { useScrollPosition } from '@n8tb1t/use-scroll-position'
import slugify from 'slugify'
import Permission from '../organisms/Permission'
import { SectionQueryResult } from './Home'
import Wallet from '../molecules/Wallet'
import TutorialChapter, {
  TutorialChapterProps
} from '../molecules/TutorialChapter'
import PageTemplateAssetDetails from '../../components/templates/PageAssetDetails'
import AssetProvider from '../../providers/Asset'
import OceanProvider from '../../providers/Ocean'
import Page from '../templates/Page'
import PagePublish from './Publish'
import { Spin as Hamburger } from 'hamburger-react'
import { DDO } from '@oceanprotocol/lib'
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

export default function PageTutorial(): ReactElement {
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
  const [ddo, setDdo] = useState<DDO>()

  const [scrollPosition, setScrollPosition] = useState(0)
  useScrollPosition(({ prevPos, currPos }) => {
    prevPos.y !== currPos.y && setScrollPosition(currPos.y * -1)
  })

  const interactivity = [
    {
      chapter: 2,
      component: <Wallet />
    },
    {
      chapter: 4,
      component: (
        <OceanProvider>
          <Page title="" description="" uri="/tutorial">
            <PagePublish
              content={{
                warning:
                  'Given the beta status, publishing on Ropsten or Rinkeby first is strongly recommended. Please familiarize yourself with [the market](https://oceanprotocol.com/technology/marketplaces), [the risks](https://blog.oceanprotocol.com/on-staking-on-data-in-ocean-market-3d8e09eb0a13), and the [Terms of Use](/terms).',
                datasetOnly: true,
                tutorial: true
              }}
              ddo={ddo}
              setDdo={setDdo}
            />
          </Page>
        </OceanProvider>
      )
    },
    {
      chapter: 9,
      component: ddo && (
        <Permission eventType="browse">
          <AssetProvider asset={ddo?.id}>
            <OceanProvider>
              <PageTemplateAssetDetails uri={`/tutorial/${ddo?.id}`} />
            </OceanProvider>
          </AssetProvider>
        </Permission>
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

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.sticky}>
          <div className={styles.hamburger}>
            <Hamburger toggled={isOpen} toggle={setOpen} />
          </div>
          <div className={styles.toc}>
            {isOpen && (
              <>
                <h3>Table of contents</h3>
                <ul>
                  {chapters.map((chapter, i) => (
                    <li key={i}>
                      <a href={`#${chapter.id}`}>{chapter.title}</a>
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
