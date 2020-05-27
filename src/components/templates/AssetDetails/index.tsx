import React, { useEffect, useState } from 'react'
import { DDO, Aquarius, Logger, Curation } from '@oceanprotocol/squid'
import Link from 'next/link'
import Layout from '../../../Layout'
import { MetaDataDexFreight } from '../../../@types/MetaData'
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
import { config } from '../../../config/ocean'
import { findServiceByType } from '../../../utils'
import { useMetadata, useWeb3, useOcean } from '@oceanprotocol/react'
import Compute from '../../organisms/Compute'

export declare type AssetDetailsPageProps = {
  title: string
  ddo?: DDO
  attributes?: MetaDataDexFreight
  error?: string
}

const AssetDetailsPageMeta = ({
  attributes,
  ddo
}: {
  attributes: MetaDataDexFreight
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
              <Link href={`/search?categories=["${categories[0]}"]`}>
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
