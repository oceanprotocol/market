import React, { ReactElement, useEffect, useState } from 'react'
import { usePrices } from '@context/Prices'
import { useWeb3 } from '@context/Web3'
import useNftFactory from '@hooks/contracts/useNftFactory'
import { NftFactory } from '@oceanprotocol/lib'
import Conversion from '@shared/Price/Conversion'
import { generateNftCreateData, NftMetadata } from '@utils/nft'

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

export default function TxFee({
  nftMetadata
}: {
  nftMetadata: NftMetadata
}): ReactElement {
  const { accountId } = useWeb3()
  const { prices } = usePrices()
  const nftFactory = useNftFactory()
  const [gasFee, setGasFee] = useState('')

  useEffect(() => {
    const calculateGasFee = async () =>
      setGasFee(
        await getEstGasFee(
          accountId,
          nftFactory,
          nftMetadata,
          (prices as any)?.eth
        )
      )
    calculateGasFee()
  }, [accountId, nftFactory, nftMetadata, prices])

  return gasFee ? (
    <p>
      Gas fee estimation for this artwork
      <Conversion price={gasFee} />
    </p>
  ) : accountId ? (
    <p>
      An error occurred while estimating the gas fee for this artwork, please
      try again.
    </p>
  ) : (
    <p>Please connect your wallet to get a gas fee estimate for this artwork</p>
  )
}
