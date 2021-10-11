import React, { ReactElement, useEffect } from 'react'
import { graphql, PageProps, useStaticQuery } from 'gatsby'
import Alert from './atoms/Alert'
import Footer from './organisms/Footer'
import Header from './organisms/Header'
import Styles from '../global/Styles'
import { useWeb3 } from '../providers/Web3'
import { useSiteMetadata } from '../hooks/useSiteMetadata'
import { useAccountPurgatory } from '../hooks/useAccountPurgatory'
import AnnouncementBanner from './atoms/AnnouncementBanner'
import styles from './App.module.css'
import { getAssetsFromDidList } from '../utils/aquarius'
import { useCancelToken } from '../hooks/useCancelToken'

const contentQuery = graphql`
  query AppQuery {
    purgatory: allFile(filter: { relativePath: { eq: "purgatory.json" } }) {
      edges {
        node {
          childContentJson {
            account {
              title
              description
            }
          }
        }
      }
    }
  }
`

export default function App({
  children,
  ...props
}: {
  children: ReactElement
}): ReactElement {
  const data = useStaticQuery(contentQuery)
  const purgatory = data.purgatory.edges[0].node.childContentJson.account

  const { warning } = useSiteMetadata()
  const { accountId } = useWeb3()
  const { isInPurgatory, purgatoryData } = useAccountPurgatory(accountId)
  const newCancelToken = useCancelToken()
  useEffect(() => {
    const qq = {
      // must: [
      //   {
      //     query_string: {
      //       query: `product*`,
      //       fields: ['service.attributes.main.name'],
      //       boost: 5,
      //       lenient: true
      //     }
      //   }
      // ]
    }
    // const newquey = generateBaseQuery(
    //   [1, 3],
    //   qq,
    //   { size: 5 },
    //   {
    //     sortBy: SortTermOptions.Relevance
    //   },
    //   [
    //     getFilterTerm('id', [
    //       'did:op:119F22fa21D4ee54c9911E1Bf876Fcf24A0ADFC1',
    //       'did:op:a2B8b3aC4207CFCCbDe4Ac7fa40214fd00A2BA71'
    //     ])
    //   ]
    // )
    // console.log('neq', newquey)
    // queryMetadata(newquey, newCancelToken()).then((res) => {
    //   console.log('res', res.results)
    // })
    getAssetsFromDidList(
      [
        'did:op:119F22fa21D4ee54c9911E1Bf876Fcf24A0ADFC1',
        'did:op:a2B8b3aC4207CFCCbDe4Ac7fa40214fd00A2BA71'
      ],
      [1, 3],
      newCancelToken()
    ).then((res) => {
      console.log('res', res)
    })
    // const filt = getFilterTerm(FilterByTypeOptions.Algorithm, "")
  }, [])
  return (
    <Styles>
      <div className={styles.app}>
        {(props as PageProps).uri === '/' && (
          <AnnouncementBanner text={warning.main} />
        )}
        <Header />

        {isInPurgatory && (
          <Alert
            title={purgatory.title}
            badge={`Reason: ${purgatoryData?.reason}`}
            text={purgatory.description}
            state="error"
          />
        )}
        <main className={styles.main}>{children}</main>
        <Footer />
      </div>
    </Styles>
  )
}
