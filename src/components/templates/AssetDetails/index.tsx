import React, { useState } from 'react'
import { DDO } from '@oceanprotocol/squid'
import { Link } from 'gatsby'
import Layout from '../../../components/Layout'
import { MetaDataMarket } from '../../../@types/MetaData'
import Time from '../../atoms/Time'
import Markdown from '../../atoms/Markdown'
import Consume from '../../organisms/Consume'
import Tags from '../../atoms/Tags'
import { Alert } from '../../atoms/Alert'
import MetaFull from './MetaFull'
import MetaSecondary from './MetaSecondary'
import Rating from '../../atoms/Rating'
import RatingAction from './RatingAction'
import styles from './index.module.css'
import { useMetadata, useOcean } from '@oceanprotocol/react'
import Compute from '../../organisms/Compute'
import DeleteAction from '../../molecules/DeleteAsset'

export declare type AssetDetailsPageProps = {
  title: string
  ddo?: DDO
  attributes?: MetaDataMarket
  error?: string
}

const AssetDetailsPageMeta = ({
  attributes,
  ddo
}: {
  attributes: MetaDataMarket
  ddo: DDO
}) => {
  if (!attributes) return null

  const { ocean, balanceInOcean } = useOcean()
  const { datePublished } = attributes.main
  const {
    description,
    copyrightHolder,
    categories,
    tags,
    access
  } = attributes.additionalInformation
  const { curation } = attributes

  const { getCuration } = useMetadata()
  const [rating, setRating] = useState<number>(curation ? curation.rating : 0)
  const [numVotes, setNumVotes] = useState<number>(
    curation ? curation.numVotes : 0
  )
  const isCompute = access && access === 'Compute'
  const onVoteUpdate = async () => {
    const { rating, numVotes } = await getCuration(ddo.id)

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
          <Rating curation={{ rating, numVotes }} readonly />
        </aside>

        <h2 className={styles.sectionTitle}>Summary</h2>
        <Markdown text={description || ''} />

        {tags && tags.length > 0 && <Tags items={tags} />}

        <MetaFull ddo={ddo} attributes={attributes} />
        <div className={styles.buttonGroup}>
          {/* <EditAction
            ddo={ddo}
            ocean={ocean}
            account={account}
            refetchMetadata={refetchMetadata}
          /> */}
          <DeleteAction ddo={ddo} />
        </div>
      </div>
      <div>
        <div className={styles.sticky}>
          {isCompute ? (
            <Compute ddo={ddo} ocean={ocean} balance={balanceInOcean} />
          ) : (
            <Consume ddo={ddo} />
          )}

          <RatingAction did={ddo.id} onVote={onVoteUpdate} />
          <MetaSecondary attributes={attributes} />
        </div>
      </div>
    </>
  )
}

const AssetDetailsPage = ({
  ddo,
  attributes,
  title,
  error
}: AssetDetailsPageProps) => {
  if (error) {
    return (
      <Layout title={title} noPageHeader>
        <Alert title={title} text={error} state="error" />
      </Layout>
    )
  }

  return (
    <Layout title={title}>
      <article className={styles.grid}>
        {attributes && (
          <AssetDetailsPageMeta ddo={ddo as DDO} attributes={attributes} />
        )}
      </article>
    </Layout>
  )
}

export default AssetDetailsPage
