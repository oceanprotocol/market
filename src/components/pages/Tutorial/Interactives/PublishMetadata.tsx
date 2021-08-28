import React, { useEffect, useRef } from 'react'
import { ReactElement } from 'react-markdown'
import Loader from '../../../atoms/Loader'
import SuccessConfetti from '../../../atoms/SuccessConfetti'
import AssetTeaser from '../../../molecules/AssetTeaser'
import Pricing from '../../../organisms/AssetContent/Pricing'
import Page from '../../../templates/Page'
import PagePublish from '../../Publish'
import StylesTeaser from '../../../molecules/MetadataFeedback.module.css'
import { DDO } from '@oceanprotocol/lib'
import { useAsset } from '../../../../providers/Asset'

export default function PublishMetadata({
  showPriceTutorial,
  setTutorialDdo,
  setShowPriceTutorial
}: {
  showPriceTutorial: boolean
  setTutorialDdo: (value: DDO) => void
  setShowPriceTutorial: (value: boolean) => void
}): ReactElement {
  const { ddo, price, refreshDdo, loading } = useAsset()
  const confettiRef = useRef(null)
  const executeScroll = () =>
    confettiRef.current.scrollIntoView({ block: 'center', behavior: 'smooth' })
  useEffect(() => {
    if (showPriceTutorial && loading) {
      executeScroll()
    }
  }, [showPriceTutorial])

  return (
    <Page
      title="Publish"
      description="Highlight the important features of your data set or algorithm to make it more discoverable and catch the interest of data consumers."
      uri="/tutorial"
    >
      {!showPriceTutorial && (
        <PagePublish
          content={{
            warning:
              'Given the beta status, publishing on Ropsten or Rinkeby first is strongly recommended. Please familiarize yourself with [the market](https://oceanprotocol.com/technology/marketplaces), [the risks](https://blog.oceanprotocol.com/on-staking-on-data-in-ocean-market-3d8e09eb0a13), and the [Terms of Use](/terms).'
          }}
          datasetOnly
          tutorial
          ddo={ddo}
          setTutorialDdo={setTutorialDdo}
          loading={loading}
        />
      )}
      {ddo && !showPriceTutorial && !loading && (
        <>
          <h3>Set price</h3>
          <p>Set a price for your data asset</p>
          <Pricing
            ddo={ddo}
            tutorial
            setShowPriceTutorial={setShowPriceTutorial}
            refreshDdo={refreshDdo}
          />
        </>
      )}
      {ddo && showPriceTutorial && loading && (
        <div className={StylesTeaser.feedback} ref={confettiRef}>
          <div className={StylesTeaser.box}>
            <Loader />
          </div>
        </div>
      )}
      {ddo && showPriceTutorial && !loading && (
        <>
          <div className={StylesTeaser.feedback}>
            <div className={StylesTeaser.box}>
              <h3>🎉 Congratulations 🎉</h3>
              <SuccessConfetti
                success="You successfully set the price to your data set."
                action={
                  <div className={StylesTeaser.teaser}>
                    <AssetTeaser ddo={ddo} price={price} />
                  </div>
                }
              />
            </div>
          </div>
        </>
      )}
    </Page>
  )
}
