import Button from '@shared/atoms/Button'
import { InputProps } from '@shared/FormInput'
import {
  generateNftCreateData,
  generateNftMetadata,
  NftMetadata
} from '@utils/nft'
import { useField } from 'formik'
import React, { ReactElement, useEffect, useState } from 'react'
import Refresh from '@images/refresh.svg'
import styles from './index.module.css'
import { useWeb3 } from '@context/Web3'
import useNftFactory from '@hooks/contracts/useNftFactory'
import { NftFactory } from '@oceanprotocol/lib'
import Tooltip from '@shared/atoms/Tooltip'
import Markdown from '@shared/Markdown'

const getEstGasFee = async ({
  address,
  nftFactory,
  nftMetadata
}: {
  address: string
  nftFactory: NftFactory
  nftMetadata: NftMetadata
}): Promise<string> => {
  if (!address || !nftFactory) return

  const { web3 } = nftFactory
  const nft = generateNftCreateData(nftMetadata)

  const gasPrice = await web3.eth.getGasPrice()
  const gasLimit = await nftFactory?.estGasCreateNFT(address, nft)
  const gasFeeEth = web3.utils.fromWei(
    (+gasPrice * +gasLimit).toString(),
    'ether'
  )
  return (+gasFeeEth).toFixed(8)
}

export default function Nft(props: InputProps): ReactElement {
  const { accountId } = useWeb3()
  const nftFactory = useNftFactory()

  const [gasFee, setGasFee] = useState('')
  const [field, meta, helpers] = useField(props.name)

  const refreshNftMetadata = async ({
    address,
    nftFactory
  }: {
    address: string
    nftFactory: NftFactory
  }) => {
    if (!address || !nftFactory) return

    const nftMetadata = generateNftMetadata()
    helpers.setValue({ ...nftMetadata })
    setGasFee(await getEstGasFee({ address, nftFactory, nftMetadata }))
  }

  // Generate on first mount
  useEffect(() => {
    if (field.value?.name !== '' || !accountId || !nftFactory) return

    const initialize = async () =>
      await refreshNftMetadata({ address: accountId, nftFactory })

    initialize()
  }, [field.value?.name, accountId, nftFactory])

  return (
    <div className={styles.nft}>
      <figure className={styles.image}>
        <img src={field?.value?.image_data} width="128" height="128" />
        <div className={styles.actions}>
          <Tooltip
            content={`Gas fee estimation for this artwork: ${gasFee} ETH`}
          />
          <Button
            style="text"
            size="small"
            className={styles.refresh}
            title="Generate new image"
            onClick={async (e) => {
              e.preventDefault()
              await refreshNftMetadata({ address: accountId, nftFactory })
            }}
          >
            <Refresh />
          </Button>
        </div>
      </figure>

      <div className={styles.token}>
        <strong>{field?.value?.name}</strong> —{' '}
        <strong>{field?.value?.symbol}</strong>
        <br />
        {field?.value?.description}
      </div>
    </div>
  )
}
