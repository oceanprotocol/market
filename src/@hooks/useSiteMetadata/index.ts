import { UseSiteMetadata } from './types'
import { getSiteMetadata } from '@utils/siteConfig'

export function useSiteMetadata(): UseSiteMetadata {
  return getSiteMetadata()
}
