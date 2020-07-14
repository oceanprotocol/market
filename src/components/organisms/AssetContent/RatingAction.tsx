import React, { useState, useEffect, ReactElement } from 'react'
import { toast } from 'react-toastify'
import Rating from '../../atoms/Rating'
import rateAsset from '../../../utils/rateAsset'
import { DID } from '@oceanprotocol/lib'
import styles from './RatingAction.module.css'
import getAssetRating from '../../../utils/getAssetRating'
import Loader from '../../atoms/Loader'
import { useWeb3 } from '@oceanprotocol/react'
export default function RatingAction({
  did,
  onVote
}: {
  did: DID | string
  onVote: () => void
}): ReactElement {
  const { web3, account } = useWeb3()
  const [rating, setRating] = useState<number>(0)
  const [isloading, setIsLoading] = useState(false)

  useEffect(() => {
    async function getOwnRating() {
      if (!account) return
      const currentRating = await getAssetRating(did, account)
      currentRating && setRating(currentRating.vote)
    }
    getOwnRating()
  }, [account])

  async function handleRatingClick(value: number) {
    if (!web3) return
    setIsLoading(true)
    try {
      const response = await rateAsset(did, web3, value)
      if (!response) return

      onVote()
      setRating(value)
      toast.success('Thank you for rating!', {
        className: styles.success
      })
    } catch (error) {
      toast.error(`There was an error: ${error.message}`, {
        className: styles.error
      })
    }
    setIsLoading(false)
  }

  return account ? (
    <aside className={styles.rating}>
      <h3 className={styles.title}>Review this data</h3>

      {isloading ? (
        <Loader />
      ) : (
        <Rating
          curation={{ rating: rating, numVotes: 0 }}
          isLoading={isloading}
          onClick={handleRatingClick}
        />
      )}
    </aside>
  ) : null
}
