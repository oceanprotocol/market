import { MetaDataMarket } from '../../../@types/MetaData'
import React, { ReactElement } from 'react'
import { useOcean } from '@oceanprotocol/react'
import Time from '../../atoms/Time'
import { Link } from 'gatsby'
import Markdown from '../../atoms/Markdown'
import Tags from '../../atoms/Tags'
import MetaFull from './MetaFull'
import Compute from '../Compute'
import Consume from '../Consume'
import MetaSecondary from './MetaSecondary'
import styles from './index.module.css'

export interface AssetContentProps {
  metadata: MetaDataMarket
  did: string
  path?: string
}

export default function AssetContent({
  metadata,
  did
}: AssetContentProps): ReactElement {
  const { ocean, balanceInOcean } = useOcean()
  const { datePublished } = metadata.main
  const {
    description,
    categories,
    tags,
    access
  } = metadata.additionalInformation
  const isCompute = access && access === 'Compute'

  // const { curation } = metadata

  // const { getCuration } = useMetadata()
  // const [rating, setRating] = useState<number>(curation ? curation.rating : 0)
  // const [numVotes, setNumVotes] = useState<number>(
  //   curation ? curation.numVotes : 0
  // )

  // const onVoteUpdate = async () => {
  //   const { rating, numVotes } = await getCuration(did)

  //   setRating(rating)
  //   setNumVotes(numVotes)
  // }

  return (
    <article className={styles.grid}>
      <div>
        <aside className={styles.meta}>
          <p>{datePublished && <Time date={datePublished} />}</p>
          {categories && (
            <p>
              <Link to={`/search?categories=["${categories[0]}"]`}>
                <a>{categories[0]}</a>
              </Link>
            </p>
          )}
          {/* <Rating curation={{ rating, numVotes }} readonly /> */}
        </aside>

        <Markdown text={description || ''} />

        {tags && tags.length > 0 && <Tags items={tags} />}

        <MetaSecondary metadata={metadata} />

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
        </div>
      </div>
    </article>
  )
}
