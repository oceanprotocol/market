import React, { ReactElement, useState, useRef } from 'react'
import { Form, Formik, FormikState } from 'formik'
import { initialValues, validationSchema } from './_constants'
import { validateDockerImage } from '@utils/docker'
import { Logger, Metadata } from '@oceanprotocol/lib'
import { useAccountPurgatory } from '@hooks/useAccountPurgatory'
import { useWeb3 } from '@context/Web3'
import { transformPublishFormToDdo } from './_utils'
import PageHeader from '@shared/Page/PageHeader'
import Title from './Title'
import styles from './index.module.css'
import Actions from './Actions'
import Debug from './Debug'
import Navigation from './Navigation'
import { Steps } from './Steps'
import { FormPublishData } from './_types'
import { sha256 } from 'js-sha256'

const formName = 'ocean-publish-form'

export default function PublishPage({
  content
}: {
  content: { title: string; description: string; warning: string }
}): ReactElement {
  const { accountId, chainId } = useWeb3()
  const { isInPurgatory, purgatoryData } = useAccountPurgatory(accountId)
  // const { publish, publishError, isLoading, publishStepText } = usePublish()
  const [success, setSuccess] = useState<string>()
  const [error, setError] = useState<string>()
  const scrollToRef = useRef()

  async function handleSubmit(values: FormPublishData) {
    try {
      // 1. Mint NFT & datatokens & put in pool
      // const txMint = await createNftWithErc()
      // const { nftAddress, datatokenAddress } = txMint.logs[0].args
      //
      // 2. Construct and publish DDO
      // const did = sha256(`${nftAddress}${chainId}`)
      // const ddo = transformPublishFormToDdo(values, datatokenAddress, nftAddress)
      // const txPublish = await publish(ddo)
      //
      // 3. Integrity check of DDO before & after publishing
      // const checksumBefore = sha256(ddo)
      // const ddoFromChain = await getDdoFromChain(ddo.id)
      // const ddoFromChainDecrypted = await decryptDdo(ddoFromChain)
      // const checksumAfter = sha256(ddoFromChainDecrypted)

      // if (checksumBefore !== checksumAfter) {
      //   throw new Error('DDO integrity check failed!')
      // }

      setSuccess('Your DDO was published successfully!')
    } catch (error) {
      setError(error.message)
    }
  }

  // async function handleSubmit(
  //   values: Partial<FormPublishData>,
  //   resetForm: (
  //     nextState?: Partial<FormikState<Partial<FormPublishData>>>
  //   ) => void
  // ): Promise<void> {
  //   try {
  //     const metadata = transformPublishFormToMetadata(values)
  //     const timeout = mapTimeoutStringToSeconds(values.timeout)

  //     const serviceType = values.access === 'Download' ? 'access' : 'compute'
  //     Logger.log(
  //       'Publish with ',
  //       metadata,
  //       serviceType,
  //       values.dataTokenOptions,
  //       values.providerUri
  //     )

  //     const ddo = await publish(
  //       metadata as unknown as Metadata,
  //       serviceType,
  //       values.dataTokenOptions,
  //       timeout,
  //       values.providerUri
  //     )

  //     // Publish failed
  //     if (!ddo || publishError) {
  //       setError(publishError || 'Publishing DDO failed.')
  //       Logger.error(publishError || 'Publishing DDO failed.')
  //       return
  //     }

  //     // Publish succeeded
  //     // setDid(ddo.id)
  //     setSuccess(
  //       '🎉 Successfully published. 🎉 Now create a price on your data set.'
  //     )
  //     resetForm({
  //       values: initialValues as FormPublishData,
  //       status: 'empty'
  //     })
  //     // move user's focus to top of screen
  //     window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  //   } catch (error) {
  //     setError(error.message)
  //     Logger.error(error.message)
  //   }
  // }

  return (
    <>
      <PageHeader title={<Title />} description={content.description} />

      {isInPurgatory && purgatoryData ? null : (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values, { resetForm }) => {
            // kick off publishing
            await handleSubmit(values)
          }}
        >
          <Form className={styles.form} ref={scrollToRef}>
            <Navigation />
            <Steps />
            <Actions scrollToRef={scrollToRef} />
          </Form>
          <Debug />
        </Formik>
      )}
    </>
  )
}
