import { MetadataMarket } from '../../../@types/MetaData'
import React, { ReactElement, useEffect, useState } from 'react'
import { graphql, Link, useStaticQuery } from 'gatsby'
import Markdown from '../../atoms/Markdown'
import MetaFull from './MetaFull'
import MetaSecondary from './MetaSecondary'
import styles from './index.module.css'
import AssetActions from '../AssetActions'
import { DDO } from '@oceanprotocol/lib'
import { useUserPreferences } from '../../../providers/UserPreferences'
import Pricing from './Pricing'
import { useOcean, usePricing } from '@oceanprotocol/react'
import EtherscanLink from '../../atoms/EtherscanLink'
import Bookmark from './Bookmark'
import Publisher from '../../atoms/Publisher'
import { useAsset } from '../../../providers/Asset'
import Alert from '../../atoms/Alert'

export interface AssetContentProps {
  metadata: MetadataMarket
  ddo: DDO
  path?: string
}

const contentQuery = graphql`
  query AssetContentQuery {
    purgatory: allFile(filter: { relativePath: { eq: "purgatory.json" } }) {
      edges {
        node {
          childContentJson {
            asset {
              title
              description
            }
          }
        }
      }
    }
  }
`

export default function AssetContent({
  metadata,
  ddo
}: AssetContentProps): ReactElement {
  const data = useStaticQuery(contentQuery)
  const content = data.purgatory.edges[0].node.childContentJson.asset

  const { debug } = useUserPreferences()
  const { accountId, networkId } = useOcean()
  const { owner, isInPurgatory, purgatoryData } = useAsset()
  const { dtSymbol, dtName } = usePricing(ddo)
  const [showPricing, setShowPricing] = useState(false)
  const { price } = useAsset()

  useEffect(() => {
    setShowPricing(accountId === owner && price.isConsumable === '')
  }, [accountId, owner, price])

  return (
    <article className={styles.grid}>
      <div>
        {showPricing && <Pricing ddo={ddo} />}
        <div className={styles.content}>
          {metadata?.additionalInformation?.categories?.length && (
            <p>
              <Link
                to={`/search?categories=${metadata?.additionalInformation?.categories[0]}`}
              >
                {metadata?.additionalInformation?.categories[0]}
              </Link>
            </p>
          )}

          <aside className={styles.meta}>
            <p className={styles.datatoken}>
              <EtherscanLink
                networkId={networkId}
                path={`token/${ddo.dataToken}`}
              >
                {dtName ? (
                  `${dtName} — ${dtSymbol}`
                ) : (
                  <code>{ddo.dataToken}</code>
                )}
              </EtherscanLink>
            </p>
            Published By <Publisher account={owner} />
          </aside>

          {isInPurgatory && purgatoryData ? (
            <Alert
              title={content.title}
              badge={`Reason: ${purgatoryData.reason}`}
              text={content.description}
              state="error"
            />
          ) : (
            <>
              <Markdown
                className={styles.description}
                text={metadata?.additionalInformation?.description || ''}
              />

              <MetaSecondary metadata={metadata} />
            </>
          )}

          <MetaFull
            ddo={ddo}
            metadata={metadata}
            isInPurgatory={isInPurgatory}
          />

          {debug === true && (
            <pre>
              <code>{JSON.stringify(ddo, null, 2)}</code>
            </pre>
          )}

          <Bookmark did={ddo.id} />
        </div>
      </div>

      <div className={styles.actions}>
        <AssetActions ddo={ddo} />
      </div>
    </article>
  )
}
