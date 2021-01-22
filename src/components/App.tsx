import React, { ReactElement, useEffect, useState } from 'react'
import Footer from './organisms/Footer'
import Header from './organisms/Header'
import Styles from '../global/Styles'
import styles from './App.module.css'
import { useSiteMetadata } from '../hooks/useSiteMetadata'
import { useOcean } from '@oceanprotocol/react'
import Alert from './atoms/Alert'
import { graphql, PageProps, useStaticQuery } from 'gatsby'
import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject
} from '@apollo/client'
import fetch from 'cross-fetch'
import { ConfigHelperConfig } from '@oceanprotocol/lib/dist/node/utils/ConfigHelper'
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
  const {
    isInPurgatory: isAccountInPurgatory,
    purgatoryData: accountPurgatory,
    config
  } = useOcean()

  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject>>()

  useEffect(() => {
    const newClient = new ApolloClient({
      link: new HttpLink({
        uri: `${
          (config as ConfigHelperConfig).subgraphUri
        }/subgraphs/name/oceanprotocol/ocean-subgraph`,
        fetch
      }),
      cache: new InMemoryCache()
    })
    setClient(newClient)
  }, [config])
  return (
    <Styles>
      <div className={styles.app}>
        <Header />
        {(props as PageProps).uri === '/' && (
          <Alert text={warning} state="info" />
        )}
        {isAccountInPurgatory && (
          <Alert
            title={purgatory.title}
            badge={`Reason: ${accountPurgatory?.reason}`}
            text={purgatory.description}
            state="error"
          />
        )}
        {client ? (
          <ApolloProvider client={client}>
            <main className={styles.main}>{children}</main>
          </ApolloProvider>
        ) : (
          <></>
        )}
        <Footer />
      </div>
    </Styles>
  )
}
