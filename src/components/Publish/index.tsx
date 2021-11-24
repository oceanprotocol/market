import React, { ReactElement, useState, useRef } from 'react'
import { Form, Formik } from 'formik'
import { initialValues } from './_constants'
import { validationSchema } from './_validation'
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
import { generateNftCreateData } from '@utils/nft'
import { useUserPreferences } from '@context/UserPreferences'

// TODO: restore FormikPersist, add back clear form action
const formName = 'ocean-publish-form'

export default function PublishPage({
  content
}: {
  content: { title: string; description: string; warning: string }
}): ReactElement {
  const { debug } = useUserPreferences()
  const { accountId, chainId } = useWeb3()
  const { isInPurgatory, purgatoryData } = useAccountPurgatory(accountId)
  const [success, setSuccess] = useState<string>()
  const [error, setError] = useState<string>()
  const scrollToRef = useRef()

  async function handleSubmit(values: FormPublishData) {
    try {
      // --------------------------------------------------
      // 1. Mint NFT & datatokens & put in pool
      // --------------------------------------------------
      // const nftOptions = values.metadata.nft
      // const nftCreateData = generateNftCreateData(nftOptions)
      // const ercParams = {}
      // const priceOptions = {
      //   ...values,
      //   // swapFee is tricky: to get 0.1% you need to send 0.001 as value
      //   swapFee: `${values.swapFee / 100}`
      // }
      // const txMint = await createNftWithErc(accountId, nftCreateData)
      // const { nftAddress, datatokenAddress } = txMint.logs[0].args
      //
      // --------------------------------------------------
      // 2. Construct and publish DDO
      // --------------------------------------------------
      // const did = sha256(`${nftAddress}${chainId}`)
      // const ddo = transformPublishFormToDdo(values, datatokenAddress, nftAddress)
      // const txPublish = await publish(ddo)
      //
      // --------------------------------------------------
      // 3. Integrity check of DDO before & after publishing
      // --------------------------------------------------
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
          <>
            <Form className={styles.form} ref={scrollToRef}>
              <Navigation />
              <Steps />
              <Actions scrollToRef={scrollToRef} />
            </Form>
            {debug && <Debug />}
          </>
        </Formik>
      )}
    </>
  )
}
