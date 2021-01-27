import { EwaiClient, IEwaiSpamCheckType } from './client/ewai-js'
import { QueryResult } from '@oceanprotocol/lib/dist/node/metadatacache/MetadataCache'
import { DDO } from '@oceanprotocol/lib'

// EWAI added: filter out any that are on chain but no longer in
// this ewai marketplace. Could have been deleted from ewai or
// they could be spam data tokens on chain which have our
// energyweb additionalInformation metatdata tag stuffed in them.
// verify that the assets really belong to this marketplace.
// this is necessary because we are using on-chain Ocean search
// results, not querying the EWAI db directly (we could do the latter)
export async function ewaiCheckResultsForSpamAsync(
  unfilteredResult: QueryResult
): Promise<QueryResult> {
  const checkList = new Array<IEwaiSpamCheckType>()
  unfilteredResult?.results?.forEach((ddo: DDO) =>
    checkList.push(
      new IEwaiSpamCheckType(
        ddo.id,
        ddo?.service[0].attributes?.additionalInformation?.energyweb?.ewai?.base
          ? ddo?.service[0].attributes?.additionalInformation?.energyweb?.ewai
              ?.base
          : ''
      )
    )
  )
  if (checkList.length > 0) {
    const ewaiClient = new EwaiClient({
      username: process.env.EWAI_API_USERNAME,
      password: process.env.EWAI_API_PASSWORD,
      graphQlUrl: process.env.EWAI_API_GRAPHQL_URL
    })
    const validatedDids = await ewaiClient.validateExternalDidsAsync(checkList)
    const filteredDDOs = unfilteredResult.results.filter(
      (ddo) => validatedDids.indexOf(ddo.id) !== -1
    )
    // TO DO: since we may have filtered out many (spam) asset results,
    // the paging may be off now. (if it becomes an issue fix later)
    const filteredResults = {
      results: filteredDDOs,
      page: unfilteredResult.page,
      totalPages: unfilteredResult.totalPages,
      totalResults: unfilteredResult.totalResults
    }
    return filteredResults
  }
}
