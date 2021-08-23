import React, { ReactElement, useEffect, useRef, useState } from 'react'
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
import { BestPrice, DDO } from '@oceanprotocol/lib'
import Pricing from '../organisms/AssetContent/Pricing'
import SuccessConfetti from '../atoms/SuccessConfetti'
import AssetTeaser from '../molecules/AssetTeaser'
import StylesTeaser from '../molecules/MetadataFeedback.module.css'
import AssetActionsWrapper from '../templates/AssetActionsWrapper'
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
  const [price, setPrice] = useState<BestPrice>()
  const [showPriceTutorial, setShowPriceTutorial] = useState(false)
  const [showComputeTutorial, setShowComputeTutorial] = useState(false)

  const [scrollPosition, setScrollPosition] = useState(0)
  useScrollPosition(({ prevPos, currPos }) => {
    prevPos.y !== currPos.y && setScrollPosition(currPos.y * -1)
  })

  const confettiRef = useRef(null)
  const executeScroll = () =>
    confettiRef.current.scrollIntoView({ block: 'center', behavior: 'smooth' })
  useEffect(() => {
    if (showPriceTutorial) {
      executeScroll()
    }
  }, [showPriceTutorial])

  const interactivity = [
    {
      chapter: 2,
      component: <Wallet />
    },
    {
      chapter: 4,
      component: (
        <OceanProvider>
          <Page
            title="Publish"
            description="Highlight the important features of your data set or algorithm to make it more discoverable and catch the interest of data consumers."
            uri="/tutorial"
          >
            {!showPriceTutorial && (
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
            )}
            {ddo && !showPriceTutorial && (
              <>
                <h3>Set price</h3>
                <p>Set a price for your data asset</p>
                <Pricing
                  ddo={ddo}
                  tutorial
                  setShowPriceTutorial={setShowPriceTutorial}
                />
              </>
            )}
            {ddo && showPriceTutorial && (
              <>
                <div ref={confettiRef} className={StylesTeaser.feedback}>
                  <div className={StylesTeaser.box}>
                    <h3>🎉 Congratulations 🎉</h3>
                    <SuccessConfetti
                      success="You successfully set the price to your data set."
                      action={
                        <div className={StylesTeaser.teaser}>
                          <AssetTeaser ddo={ddo} price={price} />
                        </div>
                      }
                    />
                  </div>
                </div>
              </>
            )}
          </Page>
        </OceanProvider>
      )
    },
    {
      chapter: 9,
      component: ddo && showPriceTutorial && (
        <Permission eventType="browse">
          <AssetProvider asset={ddo.id}>
            <OceanProvider>
              <PageTemplateAssetDetails
                uri={`/tutorial/${ddo.id}`}
                setShowComputeTutorial={setShowComputeTutorial}
              />
            </OceanProvider>
          </AssetProvider>
        </Permission>
      )
    },
    {
      chapter: 10,
      component: ddo && showPriceTutorial && showComputeTutorial && (
        <Permission eventType="browse">
          <AssetProvider asset={ddo.id}>
            <OceanProvider>
              <AssetActionsWrapper
                uri={`/tutorial/${ddo.id}`}
                setPrice={setPrice}
              />
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
