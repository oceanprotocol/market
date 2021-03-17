import React, { useState, ReactElement, ChangeEvent, useEffect } from 'react'
import { File as FileMetadata, DDO, Logger } from '@oceanprotocol/lib'
import File from '../../../atoms/File'
import Web3Feedback from '../../../molecules/Wallet/Feedback'
import Price from '../../../atoms/Price'
import {
  computeOptions,
  useCompute,
  useOcean,
  usePricing
} from '@oceanprotocol/react'
import styles from './index.module.css'
import Input from '../../../atoms/Input'
import Alert from '../../../atoms/Alert'
import { useSiteMetadata } from '../../../../hooks/useSiteMetadata'
import checkPreviousOrder from '../../../../utils/checkPreviousOrder'
import { useAsset } from '../../../../providers/Asset'
import {
  validationSchema,
  getInitialValues
} from '../../../../models/FormStartComputeDataset'
import FormStartComputeDataset from './FormComputeDataset'
import { Formik } from 'formik'

export default function Compute({
  ddo,
  isBalanceSufficient,
  dtBalance,
  file
}: {
  ddo: DDO
  isBalanceSufficient: boolean
  dtBalance: string
  file: FileMetadata
}): ReactElement {
  const { marketFeeAddress } = useSiteMetadata()

  const { type } = useAsset()
  const { ocean, accountId, account } = useOcean()
  const { buyDT, dtSymbol } = usePricing(ddo)

  const [isJobStarting, setIsJobStarting] = useState(false)
  const [, setError] = useState('')
  const [computeType, setComputeType] = useState('nodejs')
  const [computeContainer, setComputeContainer] = useState(
    computeOptions[0].value
  )
  const [algorithms, setAlgorithms] = useState<DDO[]>()
  const [isPublished, setIsPublished] = useState(false)
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

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const comType = event.target.value
    setComputeType(comType)

    const selectedComputeOption = computeOptions.find((x) => x.name === comType)
    if (selectedComputeOption !== undefined)
      setComputeContainer(selectedComputeOption.value)
  }

  function getAlgorithmAsset(algorithmId: string): DDO {
    let assetDdo = null
    algorithms.forEach((ddo: DDO) => {
      if (ddo.id === algorithmId) assetDdo = ddo
    })
    return assetDdo
  }

  const startJob = async (algorithmId: string) => {
    try {
      if (!ocean) return

      setIsJobStarting(true)
      setIsPublished(false)
      setError('')

      !hasPreviousOrder && !hasDatatoken && (await buyDT('1'))

      const algorithmAsset = getAlgorithmAsset(algorithmId)
      const computeService = ddo.findServiceByType('compute')
      const serviceAlgo = algorithmAsset.findServiceByType('access')
      const computeAddress = await ocean.compute.getComputeAddress(
        ddo.id,
        computeService.index
      )
      console.log('computeAddress', computeAddress)

      const allowed = await ocean.compute.isOrderable(
        ddo.id,
        computeService.index,
        algorithmAsset.id,
        undefined
      )
      console.log('allowed', allowed)

      const order = await ocean.compute.orderAsset(
        accountId,
        ddo.id,
        computeService.index,
        algorithmAsset.id,
        undefined,
        marketFeeAddress,
        computeAddress
      )
      console.log('order', order)

      const orderalgo = await ocean.compute.orderAlgorithm(
        algorithmId,
        serviceAlgo.type,
        accountId,
        serviceAlgo.index,
        marketFeeAddress,
        computeAddress
      )

      console.log('orderalgo', orderalgo)
      const output = {}
      const respone = await ocean.compute.start(
        ddo.id,
        order,
        ddo.dataToken,
        account,
        algorithmAsset.id,
        undefined,
        output,
        `${computeService.index}`,
        computeService.type,
        orderalgo,
        algorithmAsset.dataToken
      )
      console.log('respone', respone)

      setHasPreviousOrder(true)
      setIsPublished(true)
    } catch (error) {
      setError('Failed to start job!')
      Logger.error(error.message)
    } finally {
      setIsJobStarting(false)
    }
  }

  async function handleSubmit(
    values: any,
    resetForm: () => void
  ): Promise<void> {
    console.log('befire await startJob()', values)
    await startJob(values.algorithm)
  }

  return (
    <>
      <div className={styles.info}>
        <div className={styles.filewrapper}>
          <File file={file} small />
        </div>
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
          initialValues={getInitialValues}
          validationSchema={validationSchema}
          onSubmit={async (values, { resetForm }) => {
            // move user's focus to top of screen
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
            // kick off editing
            await handleSubmit(values, resetForm)
          }}
        >
          <FormStartComputeDataset
            algorithmList={algorithms}
            setAlgorithmsList={setAlgorithms}
            loading={false}
          />
        </Formik>
      )}

      <footer className={styles.feedback}>
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
