export interface ProfileLink {
  name: string
  value: string
}

export interface Profile {
  did?: string
  name?: string
  accountEns?: string
  description?: string
  emoji?: string
  image?: string
  links?: ProfileLink[]
}

export interface ResponseData3Box {
  name: string
  description: string
  website: string
  status?: 'error'
  /* eslint-disable camelcase */
  proof_did: string
  proof_twitter: string
  proof_github: string
  /* eslint-enable camelcase */
  emoji: string
  job: string
  employer: string
  location: string
  memberSince: string
  image: {
    contentUrl: {
      [key: string]: string
    }
  }[]
}
