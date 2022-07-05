import React, { ReactElement } from 'react'
import Page from '@shared/Page'
// import { accountTruncate } from '@utils/web3'
import { useWeb3 } from '@context/Web3'
// import ProfileProvider from '@context/Profile'
// import AssetTeaser from '@shared/AssetTeaser/AssetTeaser'
// import AssetList from '@shared/AssetList/index'
// import { getEnsAddress, getEnsName } from '@utils/ens'
import { useRouter } from 'next/router'
// import web3 from 'web3'
import SettingsPage from '../../components/Settings'

// AssetTeaser
// import { AssetExtended } from 'src/@types/AssetExtended'
import { Asset } from '@oceanprotocol/lib'
// import { getAccessDetailsForAssets } from '@utils/accessDetailsAndPricing'
// import { useIsMounted } from '@hooks/useIsMounted'

declare type AssetListProps = {
  assets: Asset[]
  isLoading?: boolean
  noPublisher?: boolean
}

export default function PageSettings({
  assets,
  isLoading,
  noPublisher
}: AssetListProps): ReactElement {
  const router = useRouter()
  const { accountId } = useWeb3()
  //   const [finalAccountId, setFinalAccountId] = useState<string>()
  // const [finalAccountEns, setFinalAccountEns] = useState<string>()

  // for AssetTeaser
  // const [loading, setLoading] = useState<boolean>(isLoading)
  // const [assetsWithPrices, setAssetsWithPrices] = useState<AssetExtended[]>()
  // const isMounted = useIsMounted()

  // testing here if this hook works to get the prop for AssetTeaser
  // useEffect(() => {
  //   if (!assets) return
  //   setAssetsWithPrices(assets as AssetExtended[])
  //   setLoading(false)
  //   async function fetchPrices() {
  //     const assetsWithPrices = await getAccessDetailsForAssets(
  //       assets,
  //       accountId || ''
  //     )
  //     if (!isMounted()) return
  //     setAssetsWithPrices([...assetsWithPrices])
  //   }
  //   fetchPrices()
  // }, [assets, isMounted, accountId])

  //
  // useEffect(() => {
  //   if (!finalAccountEns || router.asPath === '/settings') return

  //   const newSettingsPath = `/settings`
  //   // make sure we only replace path once
  //   if (newSettingsPath !== router.asPath) router.replace(newSettingsPath)
  // }, [router, finalAccountEns, accountId])

  return (
    <Page uri={router.route} title="title" noPageHeader>
      {/* <ProfileProvider accountId={finalAccountId} accountEns={finalAccountEns}>
        <ProfilePage accountId={finalAccountId} />
      </ProfileProvider> */}
      {/* <p> HELLO </p> */}
      {/* <AssetTeaser asset={undefined} /> */}

      {/* <AssetList assets={[]} showPagination={false} /> */}
      {/* {assetsWithPrices.map((assetWithPrice) => (
        <AssetTeaser
          asset={assetWithPrice}
          key={assetWithPrice.id}
          noPublisher={noPublisher}
        />
      ))} */}
      <SettingsPage accountId={'123'} />
    </Page>
  )
}
