import React, { ReactElement, useEffect, useState } from 'react'
import { graphql, Link, useStaticQuery } from 'gatsby'
import Markdown from '../../atoms/Markdown'
import MetaFull from './MetaFull'
import MetaSecondary from './MetaSecondary'
import styles from './index.module.css'
import AssetActions from '../AssetActions'
import { useUserPreferences } from '../../../providers/UserPreferences'
import Pricing from './Pricing'
import { useOcean } from '@oceanprotocol/react'
import EtherscanLink from '../../atoms/EtherscanLink'
import Bookmark from './Bookmark'
import Publisher from '../../atoms/Publisher'
import { useAsset } from '../../../providers/Asset'
import Alert from '../../atoms/Alert'
import Button from '../../atoms/Button'
import Edit from '../AssetActions/Edit'
import Time from '../../atoms/Time'
import DebugOutput from '../../atoms/DebugOutput'

export interface AssetContentProps {
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

export default function AssetContent(props: AssetContentProps): ReactElement {
  const data = useStaticQuery(contentQuery)
  const content = data.purgatory.edges[0].node.childContentJson.asset

  const { debug } = useUserPreferences()
  const { accountId, networkId } = useOcean()
  const { owner, isInPurgatory, purgatoryData } = useAsset()
  const [showPricing, setShowPricing] = useState(false)
  const [showEdit, setShowEdit] = useState<boolean>()
  const { ddo, price, metadata } = useAsset()

  const isOwner = accountId === owner

  useEffect(() => {
    if (!price) return

    setShowPricing(isOwner && price.isConsumable === '')
  }, [isOwner, price])

  function handleEditButton() {
    // move user's focus to top of screen
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    setShowEdit(true)
  }

  return showEdit ? (
    <Edit setShowEdit={setShowEdit} />
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
                {`${ddo.dataTokenInfo.name} — ${ddo.dataTokenInfo.symbol}`}
              </EtherscanLink>
            </p>
            <p>
              Published By <Publisher account={owner} />
            </p>
            <p className={styles.date}>
              <Time date={ddo.created} relative />
              {ddo.created !== ddo.updated && (
                <>
                  {' — '}
                  updated <Time date={ddo.updated} relative />
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

              <MetaSecondary />

              {isOwner && (
                <div className={styles.ownerActions}>
                  <Button style="text" size="small" onClick={handleEditButton}>
                    Edit Metadata
                  </Button>
                </div>
              )}
            </>
          )}

          <MetaFull />

          {debug === true && <DebugOutput title="DDO" output={ddo} />}

          <Bookmark did={ddo.id} />
        </div>
      </div>

      <div className={styles.actions}>
        <AssetActions />
      </div>
    </article>
  )
}
