import React, { ChangeEvent, ReactElement } from 'react'
import Label from '../../atoms/Input/Label'
import { useUserPreferences } from '../../../providers/UserPreferences'
import { useSiteMetadata } from '../../../hooks/useSiteMetadata'
import NetworkName from '../../atoms/NetworkName'
import { removeItemFromArray } from '../../../utils'
import FormHelp from '../../atoms/Input/Help'
import { useStaticQuery, graphql } from 'gatsby'
import { EthereumListsChain, getNetworkDataById } from '../../../utils/web3'
import Tooltip from '../../atoms/Tooltip'
import { ReactComponent as Caret } from '../../../images/caret.svg'
import { ReactComponent as Network } from '../../../images/network.svg'
import stylesIndex from './index.module.css'
import styles from './Chain.module.css'

const networksQuery = graphql`
  query {
    allNetworksMetadataJson {
      edges {
        node {
          chain
          network
          networkId
          chainId
        }
      }
    }
  }
`

function ChainItem({
  isDefaultChecked,
  chainId,
  handleChainChanged
}: {
  isDefaultChecked: boolean
  chainId: number
  handleChainChanged: (e: ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <div className={styles.radioWrap} key={chainId}>
      <label className={styles.radioLabel} htmlFor={`opt-${chainId}`}>
        <input
          className={styles.input}
          id={`opt-${chainId}`}
          type="checkbox"
          name="chainIds"
          value={chainId}
          onChange={handleChainChanged}
          defaultChecked={isDefaultChecked}
        />
        <NetworkName key={chainId} networkId={chainId} />
      </label>
    </div>
  )
}

export default function Chain(): ReactElement {
  const data = useStaticQuery(networksQuery)
  const networksList: { node: EthereumListsChain }[] =
    data.allNetworksMetadataJson.edges

  const { appConfig } = useSiteMetadata()
  const { chainIds, setChainIds } = useUserPreferences()

  function handleChainChanged(e: ChangeEvent<HTMLInputElement>) {
    const { value } = e.target

    // storing all chainId everywhere as a number so convert from here
    const valueAsNumber = Number(value)

    const newChainIds = chainIds.includes(valueAsNumber)
      ? [...removeItemFromArray(chainIds, valueAsNumber)]
      : [...chainIds, valueAsNumber]
    setChainIds(newChainIds)
  }

  const chainsMain = appConfig.chainIdsSupported
    .filter((chainId: number) => {
      const networkData = getNetworkDataById(networksList, chainId)
      return networkData.network === 'mainnet'
    })
    .map((chainId) => (
      <ChainItem
        key={chainId}
        chainId={chainId}
        isDefaultChecked={chainIds.includes(chainId)}
        handleChainChanged={handleChainChanged}
      />
    ))

  const chainsTest = appConfig.chainIdsSupported
    .filter((chainId: number) => {
      const networkData = getNetworkDataById(networksList, chainId)
      return networkData.network !== 'mainnet'
    })
    .map((chainId) => (
      <ChainItem
        key={chainId}
        chainId={chainId}
        isDefaultChecked={chainIds.includes(chainId)}
        handleChainChanged={handleChainChanged}
      />
    ))

  return (
    <Tooltip
      content={
        <ul className={stylesIndex.preferencesDetails}>
          <li>
            <Label htmlFor="chains">Chains</Label>
            <FormHelp>Switch the data source for the interface.</FormHelp>

            <h4 className={styles.titleGroup}>Main</h4>
            <div className={styles.chains}>{chainsMain}</div>
            <h4 className={styles.titleGroup}>Test</h4>
            <div className={styles.chains}>{chainsTest}</div>
          </li>
        </ul>
      }
      trigger="click focus"
      className={`${stylesIndex.preferences} ${styles.chain}`}
    >
      <Network aria-label="Chain" className={stylesIndex.icon} />
      <Caret aria-hidden="true" />
    </Tooltip>
  )
}
