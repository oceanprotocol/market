import { UseSiteMetadata } from './types'
import siteContent from '../../../content/site.json'
import appConfig from '../../../app.config'

export function useSiteMetadata(): UseSiteMetadata {
  const siteMeta: UseSiteMetadata = {
    ...siteContent,
    appConfig
  }

  return siteMeta
}
