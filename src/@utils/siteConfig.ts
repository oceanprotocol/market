import { UseSiteMetadata } from '@hooks/useSiteMetadata/types'
import siteContent from '../../content/site.json'
import appConfig from '../../app.config'

export function getSiteMetadata(): UseSiteMetadata {
  const siteMeta: UseSiteMetadata = {
    ...siteContent,
    appConfig
  }

  return siteMeta
}
