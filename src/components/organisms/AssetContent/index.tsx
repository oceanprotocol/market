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
import Button from '../../atoms/Button'
import Edit from '../AssetActions/Edit'
import Time from '../../atoms/Time'

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
  const [showEdit, setShowEdit] = useState<boolean>()
  const { price } = useAsset()

  const isOwner = accountId === owner

  useEffect(() => {
    setShowPricing(isOwner && price.isConsumable === '')
  }, [isOwner, price])

  function handleEditButton() {
    setShowEdit(true)
  }

  return showEdit ? (
    <Edit metadata={metadata} setShowEdit={setShowEdit} />
  ) : (
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
            <p>
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
            <p>
              Published By <Publisher account={owner} />
            </p>
            <p>
              <Time date={ddo.created} relative />
              {ddo.created !== ddo.updated && (
                <>
                  {' — '}
                  <span className={styles.dateUpdated}>
                    updated <Time date={ddo.updated} relative />
                  </span>
                </>
              )}
            </p>
          </aside>

          {isInPurgatory ? (
            <Alert
              title={content.title}
              badge={`Reason: ${purgatoryData?.reason}`}
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

        {isOwner && (
          <Button
            style="text"
            size="small"
            onClick={handleEditButton}
            className={styles.actionLink}
          >
            Edit Metadata
          </Button>
        )}
      </div>
    </article>
  )
}
