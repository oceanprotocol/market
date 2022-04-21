import siteContent from '../../content/site.json'
import appConfig from '../../app.config'
import { SiteMetadata } from '@context/MarketMetadata/_types'

export function getSiteMetadata(): SiteMetadata {
  const siteMeta: SiteMetadata = {
    ...siteContent,
    appConfig
  }

  return siteMeta
}
