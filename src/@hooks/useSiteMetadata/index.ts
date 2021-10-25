import { UseSiteMetadata } from './types'
import siteContent from '../../../content/site.json'
import siteConfig from '../../../app.config'

export function useSiteMetadata(): UseSiteMetadata {
  const siteMeta: UseSiteMetadata = {
    ...siteContent,
    appConfig: siteConfig
  }

  return siteMeta
}
