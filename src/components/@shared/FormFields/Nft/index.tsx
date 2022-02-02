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
import Conversion from '@shared/Price/Conversion'
import { usePrices } from '@context/Prices'

const getEstGasFee = async (
  address: string,
  nftFactory: NftFactory,
  nftMetadata: NftMetadata,
  ethToOceanConversionRate: number
): Promise<string> => {
  if (!address || !nftFactory || !nftMetadata || !ethToOceanConversionRate)
    return

  const { web3 } = nftFactory
  const nft = generateNftCreateData(nftMetadata)

  const gasPrice = await web3.eth.getGasPrice()
  const gasLimit = await nftFactory?.estGasCreateNFT(address, nft)
  const gasFeeEth = web3.utils.fromWei(
    (+gasPrice * +gasLimit).toString(),
    'ether'
  )
  const gasFeeOcean = (+gasFeeEth / +ethToOceanConversionRate).toString()
  return gasFeeOcean
}

export default function Nft(props: InputProps): ReactElement {
  const { accountId } = useWeb3()
  const { prices } = usePrices()
  const nftFactory = useNftFactory()

  const [gasFee, setGasFee] = useState('')
  const [field, meta, helpers] = useField(props.name)

  const refreshNftMetadata = () => {
    const nftMetadata = generateNftMetadata()
    helpers.setValue({ ...nftMetadata })
  }

  // Generate on first mount
  useEffect(() => {
    if (field.value?.name !== '') return

    refreshNftMetadata()
  }, [field.value?.name])

  useEffect(() => {
    const calculateGasFee = async () =>
      setGasFee(
        await getEstGasFee(
          accountId,
          nftFactory,
          field.value,
          (prices as any)?.eth
        )
      )
    calculateGasFee()
  }, [accountId, nftFactory, field.value, prices])

  return (
    <div className={styles.nft}>
      <figure className={styles.image}>
        <img src={field?.value?.image_data} width="128" height="128" />
        <div className={styles.actions}>
          <Tooltip
            content={
              gasFee ? (
                <>
                  Gas fee estimation for this artwork
                  <Conversion price={gasFee} />
                </>
              ) : accountId ? (
                'An error occurred while estimating the gas fee for this artwork, please try again.'
              ) : (
                'Please connect your wallet to get a gas fee estimate for this artwork'
              )
            }
          />
          <Button
            style="text"
            size="small"
            className={styles.refresh}
            title="Generate new image"
            onClick={(e) => {
              e.preventDefault()
              refreshNftMetadata()
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
