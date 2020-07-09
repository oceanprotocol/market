import React, { useState, useEffect, ReactElement } from 'react'
import { Router } from '@reach/router'
import AssetContent from '../../components/organisms/AssetContent'
import Layout from '../../components/Layout'
import { PageProps } from 'gatsby'
import { MetaDataMarket, ServiceMetaDataMarket } from '../../@types/MetaData'
import { Aquarius, Logger } from '@oceanprotocol/squid'
import { oceanConfig } from '../../../app.config'
import { Alert } from '../../components/atoms/Alert'

export default function AssetRoute(props: PageProps): ReactElement {
  const [metadata, setMetadata] = useState<MetaDataMarket>()
  const [title, setTitle] = useState<string>()
  const [error, setError] = useState<string>()

  const did = props.location.pathname.split('/')[2]

  useEffect(() => {
    async function init() {
      try {
        const aquarius = new Aquarius(oceanConfig.aquariusUri, Logger)
        const ddo = await aquarius.retrieveDDO(did)

        if (!ddo) {
          setTitle('Could not retrieve asset')
          setError('The DDO was not found in Aquarius.')
          return
        }

        const { attributes }: ServiceMetaDataMarket = ddo.findServiceByType(
          'metadata'
        )

        setTitle(attributes.main.name)
        setMetadata(attributes)
      } catch (error) {
        setTitle('Error retrieving asset')
        setError(error.message)
      }
    }
    init()
  }, [])

  return error ? (
    <Layout title={title} noPageHeader uri={props.location.pathname}>
      <Alert title={title} text={error} state="error" />
    </Layout>
  ) : did && metadata ? (
    <Layout title={title} uri={props.location.pathname}>
      <Router basepath="/asset">
        <AssetContent did={did} metadata={metadata} path="/asset/:did" />
      </Router>
    </Layout>
  ) : (
    <Layout title="Loading..." uri={props.location.pathname}>
      Loading...
    </Layout>
  )
}
