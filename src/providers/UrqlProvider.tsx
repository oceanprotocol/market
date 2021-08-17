import { createClient, Provider, Client } from 'urql'
import React, { useState, useEffect, ReactNode, ReactElement } from 'react'
import { Logger } from '@oceanprotocol/lib'
import { getOceanConfig } from '../utils/ocean'

let urqlClient: Client

function createUrqlClient(subgraphUri: string) {
  const client = createClient({
    url: `${subgraphUri}/subgraphs/name/oceanprotocol/ocean-subgraph`
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
  const [client, setClient] = useState<Client>()

  useEffect(() => {
    const oceanConfig = getOceanConfig(1)

    if (!oceanConfig?.subgraphUri) {
      Logger.error(
        'No subgraphUri defined, preventing UrqlProvider from initialization.'
      )
      return
    }

    const newClient = createUrqlClient(oceanConfig.subgraphUri)
    urqlClient = newClient
    setClient(newClient)
    Logger.log(`[URQL] Client connected to ${oceanConfig.subgraphUri}`)
  }, [])

  return client ? <Provider value={client}>{children}</Provider> : <></>
}

export { UrqlClientProvider }
