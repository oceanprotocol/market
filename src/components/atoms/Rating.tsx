import React from 'react'
import ReactRating from 'react-rating'
import Star from '../../images/star.svg'
import { Curation } from '@oceanprotocol/squid'
import styles from './Rating.module.css'

export default function Rating({
  curation,
  readonly,
  isLoading,
  onClick
}: {
  curation: Curation | undefined
  readonly?: boolean
  isLoading?: boolean
  onClick?: (value: any) => void
}) {
  let numVotes = 0
  let rating = 0

  if (!curation) return null
  ;({ numVotes, rating } = curation)

  // if it's readonly then the fraction is 10 to show the average rating proper. When you select the rating you select from 1 to 5
  const fractions = readonly ? 2 : 1

  return (
    <div className={`${readonly ? styles.readonly : styles.ratings}`}>
      <ReactRating
        emptySymbol={
          <div className={styles.star}>
            <Star />
          </div>
        }
        fullSymbol={
          <div className={styles.full}>
            <Star />
          </div>
        }
        initialRating={rating}
        readonly={readonly || isLoading || false}
        onClick={onClick}
        fractions={fractions}
      />

      <span className={styles.ratingVotes}>
        {rating} {readonly ? `(${numVotes})` : ''}
      </span>
    </div>
  )
}
