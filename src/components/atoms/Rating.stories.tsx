import React from 'react'
import Rating from './Rating'

export default {
  title: 'Atoms/Rating'
}

export const Normal = () => (
  <Rating
    readonly
    curation={{
      rating: 3,
      numVotes: 300
    }}
  />
)

export const WithFraction = () => (
  <Rating
    readonly
    curation={{
      rating: 3.3,
      numVotes: 300
    }}
  />
)

export const Interactive = () => (
  <Rating
    onClick={(value: any) => null}
    curation={{
      rating: 3.3,
      numVotes: 300
    }}
  />
)
