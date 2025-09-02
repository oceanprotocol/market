import React, {
  createClient,
  Provider,
  Client,
  dedupExchange,
  fetchExchange
} from 'urql'
import { useState, useEffect, ReactNode, ReactElement } from 'react'
import { LoggerInstance } from '@oceanprotocol/lib'
import { getOceanConfig } from '@utils/ocean'

let urqlClient: Client

function createUrqlClient(subgraphUri: string) {
  // for now let's keep this file
  const client = createClient({
    url: `${subgraphUri}/subgraphs/name/oceanprotocol/ocean-subgraph`,
    exchanges: [dedupExchange, fetchExchange]
  })
  return client
}

export function getUrqlClientInstance(): Client {
  return urqlClient
}

export default function UrqlClientProvider({
  children
}: {
  children: ReactNode
}): ReactElement {
  //
  // Set a default client here based on ETH Mainnet, as that's required for
  // urql to work.
  // Throughout code base this client is then used and altered by passing
  // a new queryContext holding different subgraph URLs.
  //
  const [client, setClient] = useState<Client>()

  useEffect(() => {
    const oceanConfig = getOceanConfig(1)

    if (!oceanConfig?.nodeUri) {
      LoggerInstance.error(
        'No NodeURI defined, preventing UrqlProvider from initialization.'
      )
      return
    }

    const newClient = createUrqlClient(oceanConfig.nodeUri)
    urqlClient = newClient
    setClient(newClient)
    LoggerInstance.log(`[URQL] Client connected to ${oceanConfig.nodeUri}`)
  }, [])

  return client ? <Provider value={client}>{children}</Provider> : <></>
}

export { UrqlClientProvider }
