import React, { useState, ReactElement, ChangeEvent, useEffect } from 'react'
import { DDO, Logger } from '@oceanprotocol/lib'
import Loader from '../../../atoms/Loader'
import Web3Feedback from '../../../molecules/Wallet/Feedback'
import Dropzone from '../../../atoms/Dropzone'
import Price from '../../../atoms/Price'
import {
  computeOptions,
  useCompute,
  readFileContent,
  useOcean,
  usePricing
} from '@oceanprotocol/react'
import styles from './index.module.css'
import Input from '../../../atoms/Input'
import Alert from '../../../atoms/Alert'
import { useSiteMetadata } from '../../../../hooks/useSiteMetadata'
import checkPreviousOrder from '../../../../utils/checkPreviousOrder'
import { useAsset } from '../../../../providers/Asset'
import Button from '../../../atoms/Button'
import {
  validationSchema,
  getInitialValues
} from '../../../../models/FormStartComputeDataset'
import FormStartComputeDataset from './FormComputeDataset'
import { Formik } from 'formik'

export default function Compute({
  ddo,
  isBalanceSufficient,
  dtBalance
}: {
  ddo: DDO
  isBalanceSufficient: boolean
  dtBalance: string
}): ReactElement {
  const { marketFeeAddress } = useSiteMetadata()

  const { type } = useAsset()
  const { ocean, accountId } = useOcean()
  const { compute, isLoading, computeStepText, computeError } = useCompute()
  const { buyDT, dtSymbol } = usePricing(ddo)

  const computeService = ddo.findServiceByType('compute')
  const metadataService = ddo.findServiceByType('metadata')

  const [isJobStarting, setIsJobStarting] = useState(false)
  const [, setError] = useState('')
  const [computeType, setComputeType] = useState('nodejs')
  const [computeContainer, setComputeContainer] = useState(
    computeOptions[0].value
  )
  const [algorithmRawCode, setAlgorithmRawCode] = useState('')
  const [isPublished, setIsPublished] = useState(false)
  const [file, setFile] = useState(null)
  const [hasPreviousOrder, setHasPreviousOrder] = useState(false)
  const [previousOrderId, setPreviousOrderId] = useState<string>()
  const isComputeButtonDisabled =
    isJobStarting === true ||
    file === null ||
    computeType === '' ||
    !ocean ||
    !isBalanceSufficient
  const hasDatatoken = Number(dtBalance) >= 1

  useEffect(() => {
    if (!ocean || !accountId) return

    async function checkPreviousOrders() {
      const orderId = await checkPreviousOrder(ocean, accountId, ddo, 'compute')
      setPreviousOrderId(orderId)
      setHasPreviousOrder(!!orderId)
    }
    checkPreviousOrders()
  }, [ocean, ddo, accountId])

  const onDrop = async (files: File[]) => {
    setFile(files[0])
    const fileText = await readFileContent(files[0])
    setAlgorithmRawCode(fileText)
  }

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const comType = event.target.value
    setComputeType(comType)

    const selectedComputeOption = computeOptions.find((x) => x.name === comType)
    if (selectedComputeOption !== undefined)
      setComputeContainer(selectedComputeOption.value)
  }

  const startJob = async () => {
    try {
      if (!ocean) return

      setIsJobStarting(true)
      setIsPublished(false)
      setError('')

      !hasPreviousOrder && !hasDatatoken && (await buyDT('1'))

      await compute(
        ddo.id,
        computeService,
        ddo.dataToken,
        algorithmRawCode,
        computeContainer,
        marketFeeAddress,
        previousOrderId
      )

      setHasPreviousOrder(true)
      setIsPublished(true)
      setFile(null)
    } catch (error) {
      setError('Failed to start job!')
      Logger.error(error.message)
    } finally {
      setIsJobStarting(false)
    }
  }

  return (
    <>
      <div className={styles.info}>
        <div className={styles.pricewrapper}>
          <Price ddo={ddo} conversion />
          {hasDatatoken && (
            <div className={styles.hasTokens}>
              You own {dtBalance} {dtSymbol} allowing you to use this data set
              without paying again.
            </div>
          )}
        </div>
      </div>

      {type === 'algorithm' ? (
        <Input
          type="select"
          name="data"
          label="Select dataset for the algorithm"
          placeholder=""
          size="small"
          value="dataset-1"
          options={['dataset-1', 'dataset-2', 'dataset-3'].map((x) => x)}
          onChange={handleSelectChange}
        />
      ) : (
        <Formik
          initialValues={[]}
          validationSchema={validationSchema}
          onSubmit={async (values, { resetForm }) => {
            // move user's focus to top of screen
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
            // kick off editing
            // await handleSubmit(values, resetForm)
            await startJob()
          }}
        >
          <FormStartComputeDataset></FormStartComputeDataset>
        </Formik>
      )}
      {type === 'algorithm' ? (
        <Dropzone multiple={false} handleOnDrop={onDrop} />
      ) : (
        ''
      )}

      <footer className={styles.feedback}>
        {computeError !== undefined && (
          <Alert text={computeError} state="error" />
        )}
        {isPublished && (
          <Alert
            title="Your job started!"
            text="Watch the progress in the history page."
            state="success"
          />
        )}
        <Web3Feedback isBalanceSufficient={isBalanceSufficient} />
      </footer>
    </>
  )
}
