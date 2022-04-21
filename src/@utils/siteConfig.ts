import siteContent from '../../content/site.json'
import appConfig from '../../app.config'
import { SiteContent, AppConfig } from '@context/MarketMetadata/_types'

export function getSiteMetadata(): {
  siteContent: SiteContent
  appConfig: AppConfig
} {
  return {
    siteContent,
    appConfig
  }
}
