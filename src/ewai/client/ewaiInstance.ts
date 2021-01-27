import { useStaticQuery, graphql } from 'gatsby'
import { IEwaiInstanceResult } from './ewai-js'

export const useEwaiInstance = () => {
  const data = useStaticQuery(
    graphql`
      query EwaiInstanceQuery {
        ewai {
          ewaiInstance {
            name
            apiVersion
            marketplacePublishRole
            marketplacePublishRoleEnrolUrl
            switchboardUrl
            enforceMarketplacePublishRole
            restApiUrl
            graphQlUrl
            ethRpcUrl
            ethChainId
            ewcRpcUrl
            ewcChainId
          }
        }
      }
    `
  )
  return data.ewai.ewaiInstance as IEwaiInstanceResult
}
