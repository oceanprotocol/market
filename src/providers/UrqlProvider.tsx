import { createClient, Provider, Client } from 'urql'
import { getIntrospectionQuery } from 'graphql'
import axios from 'axios'
import React, { useState, useEffect, ReactNode, ReactElement } from 'react'
import { useWeb3 } from './Web3'
import { Logger } from '@oceanprotocol/lib'
import { getOceanConfig } from '../utils/ocean'

let urqlClient: Client

function createUrqlClient(subgraphUri: string) {
  const client = createClient({
    url: `${subgraphUri}/subgraphs/name/oceanprotocol/ocean-subgraph`
  })
  generateGraphSchema(subgraphUri)
  return client
}

export function getUrqlClientInstance(): Client {
  return urqlClient
}

async function generateGraphSchema(subgraphUri: string) {
  const query = JSON.stringify({
    query: getIntrospectionQuery({ descriptions: false })
  })
  const response = await axios.post(
    `${subgraphUri}/subgraphs/name/oceanprotocol/ocean-subgraph`,
    query
  )
}

export default function UrqlClientProvider({
  children
}: {
  children: ReactNode
}): ReactElement {
  const { networkId } = useWeb3()
  const [client, setClient] = useState<Client>()

  useEffect(() => {
    const oceanConfig = getOceanConfig(networkId || 1)

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
  }, [networkId])

  return client ? <Provider value={client}>{children}</Provider> : <></>
}
export { UrqlClientProvider }
