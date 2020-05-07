import React from 'react'
import { NextPage, GetStaticProps, GetStaticPaths } from 'next'
import { useRouter } from 'next/router'
import axios from 'axios'
import { Aquarius, Logger } from '@oceanprotocol/squid'
import AssetDetailsPage, {
  AssetDetailsPageProps
} from '../../components/templates/AssetDetails'
import { config } from '../../config/ocean'
import { findServiceByType, isDid } from '../../utils'
import Loader from '../../components/atoms/Loader'
import Layout from '../../Layout'
import styles from '../../components/templates/AssetDetails/index.module.css'

const AssetDetails: NextPage<AssetDetailsPageProps> = (
  props: AssetDetailsPageProps
) => {
  const router = useRouter()

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return (
      <Layout title={props.title}>
        <div className={styles.loaderWrap}>
          <Loader />
        </div>
      </Layout>
    )
  }

  // parse back the DDO object, workaround for Next.js
  let ddo
  if (props.ddo) {
    ddo = JSON.parse(props.ddo as any)
  }

  return (
    <AssetDetailsPage
      title={props.title}
      ddo={ddo}
      attributes={props.attributes}
      error={props.error}
    />
  )
}

export async function getMetadata(did?: string) {
  if (!did || !isDid(did)) {
    return {
      title: 'Not a DID',
      error:
        'The provided DID in the URL is not a valid DID. Please check your URL.'
    }
  }

  let ddo

  try {
    const aquarius = new Aquarius(config.aquariusUri as string, Logger)
    ddo = await aquarius.retrieveDDO(did as string)

    if (!ddo) {
      return {
        title: 'Could not retrieve asset',
        error: 'The DDO was not found in Aquarius.'
      }
    }
  } catch (error) {
    return { title: 'Error retrieving asset', error: error.message }
  }

  const { attributes } = findServiceByType(ddo, 'metadata')
  const title = attributes.main.name

  // stringify the DDO object, workaround for Next.js
  return { ddo: JSON.stringify(ddo), attributes, title }
}

export const getStaticProps: GetStaticProps = async ({
  params
}: {
  params?: { did?: string }
}) => {
  if (!params) return { props: { title: 'Not found' } }
  const props = await getMetadata(params.did)
  return { props }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await axios(`${config.aquariusUri}/api/v1/aquarius/assets`)
  const assets = response.data.ids

  const paths = assets.map((did: string) => ({
    params: { did }
  }))

  return { paths, fallback: true }
}

export default AssetDetails
