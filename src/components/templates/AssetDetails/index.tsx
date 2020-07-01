import React, { useState, ReactElement, useEffect } from 'react'
import { Aquarius, Logger } from '@oceanprotocol/squid'
import { Link, PageProps } from 'gatsby'
import { config } from '../../../config/ocean'
import Layout from '../../../components/Layout'
import { MetaDataMarket, ServiceMetaDataMarket } from '../../../@types/MetaData'
import Time from '../../atoms/Time'
import Markdown from '../../atoms/Markdown'
import Consume from '../../organisms/Consume'
import Tags from '../../atoms/Tags'
import { Alert } from '../../atoms/Alert'
import MetaFull from './MetaFull'
import MetaSecondary from './MetaSecondary'
// import Rating from '../../atoms/Rating'
// import RatingAction from './RatingAction'
import styles from './index.module.css'
import { useMetadata, useOcean } from '@oceanprotocol/react'
import Compute from '../../organisms/Compute'
// import DeleteAction from '../../molecules/DeleteAsset'

const AssetDetailsPageMeta = ({
  metadata,
  did
}: {
  metadata: MetaDataMarket
  did: string
}) => {
  const { ocean, balanceInOcean } = useOcean()
  const { datePublished } = metadata.main
  const {
    description,
    copyrightHolder,
    categories,
    tags,
    access
  } = metadata.additionalInformation
  const { curation } = metadata

  const { getCuration } = useMetadata()
  const [rating, setRating] = useState<number>(curation ? curation.rating : 0)
  const [numVotes, setNumVotes] = useState<number>(
    curation ? curation.numVotes : 0
  )
  const isCompute = access && access === 'Compute'

  const onVoteUpdate = async () => {
    const { rating, numVotes } = await getCuration(did)

    setRating(rating)
    setNumVotes(numVotes)
  }

  return (
    <>
      <div>
        <aside className={styles.meta}>
          <p>
            <span title="Copyright Holder">{copyrightHolder}</span> -{' '}
            {datePublished && <Time date={datePublished} />}
          </p>
          {categories && (
            <p>
              <Link to={`/search?categories=["${categories[0]}"]`}>
                <a>{categories[0]}</a>
              </Link>
            </p>
          )}
          {/* <Rating curation={{ rating, numVotes }} readonly /> */}
        </aside>

        <h2 className={styles.sectionTitle}>Summary</h2>
        <Markdown text={description || ''} />

        {tags && tags.length > 0 && <Tags items={tags} />}

        <MetaFull did={did} metadata={metadata} />
        <div className={styles.buttonGroup}>
          {/* <EditAction
            ddo={ddo}
            ocean={ocean}
            account={account}
            refetchMetadata={refetchMetadata}
          /> */}
          {/* <DeleteAction ddo={ddo} /> */}
        </div>
      </div>
      <div>
        <div className={styles.sticky}>
          {isCompute ? (
            <Compute
              did={did}
              metadata={metadata}
              ocean={ocean}
              balance={balanceInOcean}
            />
          ) : (
            <Consume did={did} metadata={metadata} />
          )}

          {/* <RatingAction did={did} onVote={onVoteUpdate} /> */}
          <MetaSecondary metadata={metadata} />
        </div>
      </div>
    </>
  )
}

export default function AssetDetailsPage(props: PageProps): ReactElement {
  const [metadata, setMetadata] = useState<MetaDataMarket>()
  const [title, setTitle] = useState<string>()
  const [error, setError] = useState<string>()

  const { did } = props.pageContext as { did: string }

  useEffect(() => {
    async function init() {
      try {
        const aquarius = new Aquarius(config.aquariusUri, Logger)
        const ddo = await aquarius.retrieveDDO(did)

        if (!ddo) {
          setTitle('Could not retrieve asset')
          setError('The DDO was not found in Aquarius.')
          return
        }

        const { attributes }: ServiceMetaDataMarket = ddo.findServiceByType(
          'metadata'
        )

        setTitle(attributes.main.name)
        console.log(attributes)
        setMetadata(attributes)
      } catch (error) {
        setTitle('Error retrieving asset')
        setError(error.message)
      }
    }
    init()
  }, [])

  return error ? (
    <Layout title={title} noPageHeader uri={props.path}>
      <Alert title={title} text={error} state="error" />
    </Layout>
  ) : did && metadata ? (
    <Layout title={title} uri={props.path}>
      <article className={styles.grid}>
        <AssetDetailsPageMeta did={did} metadata={metadata} />
      </article>
    </Layout>
  ) : null
}
