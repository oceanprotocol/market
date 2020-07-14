import React, { useState, useEffect, ReactElement } from 'react'
import { Ocean } from '@oceanprotocol/lib'
import { fromWei } from 'web3-utils'
import compareAsBN, { Comparisson } from '../../../utils/compareAsBN'
import Loader from '../../atoms/Loader'
import Web3Feedback from '../../molecules/Wallet/Feedback'
import Dropzone from '../../atoms/Dropzone'
import Price from '../../atoms/Price'
import {
  computeOptions,
  useCompute,
  readFileContent
} from '@oceanprotocol/react'
import styles from './Compute.module.css'
import Button from '../../atoms/Button'
import Input from '../../atoms/Input'
import { MetaDataMarket } from '../../../@types/MetaData'
import Alert from '../../atoms/Alert'

export default function Compute({
  did,
  metadata,
  balance,
  ocean
}: {
  did: string
  metadata: MetaDataMarket
  balance: string | null
  ocean: Ocean | null
}): ReactElement {
  const { compute, isLoading, computeStepText, computeError } = useCompute()
  const [isJobStarting, setIsJobStarting] = useState(false)
  const [, setError] = useState('')
  const [isBalanceSufficient, setIsBalanceSufficient] = useState(false)
  const [computeType, setComputeType] = useState('')
  const [computeContainer, setComputeContainer] = useState({
    entrypoint: '',
    image: '',
    tag: ''
  })
  const [algorithmRawCode, setAlgorithmRawCode] = useState('')
  const [isPublished, setIsPublished] = useState(false)
  const [file, setFile] = useState(null)

  const { price } = metadata.main
  const isFree = price === '0'

  const [isTermsAgreed, setIsTermsAgreed] = useState(true)
  const isComputeButtonDisabled =
    isJobStarting ||
    file === null ||
    computeType === '' ||
    !ocean ||
    !isBalanceSufficient ||
    !isTermsAgreed

  useEffect(() => {
    setIsBalanceSufficient(
      isFree ||
        (balance !== null &&
          compareAsBN(balance, fromWei(price), Comparisson.gte))
    )
  }, [balance])

  const onDrop = async (files: any) => {
    setFile(files[0])
    const fileText = await readFileContent(files[0])
    setAlgorithmRawCode(fileText)
  }

  const handleSelectChange = (event: any) => {
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

      await compute(did, algorithmRawCode, computeContainer)

      setIsPublished(true)
      setFile(null)
    } catch (error) {
      setError('Failed to start job!')
      console.log(error)
    }
    setIsJobStarting(false)
  }

  return (
    <div className={styles.compute}>
      <Price price={price} />

      <div className={styles.info}>
        <div className={styles.selectType}>
          <Input
            type="select"
            name="algorithm"
            label="Select image to run the algorithm"
            placeholder=""
            value={computeType}
            options={computeOptions.map((x) => x.name)}
            onChange={handleSelectChange}
          />
        </div>
        <div>
          <Dropzone multiple={false} handleOnDrop={onDrop} />

          <div className={styles.jobButtonWrapper}>
            <Button
              style="primary"
              onClick={() => startJob()}
              disabled={isComputeButtonDisabled}
            >
              Start job
            </Button>
          </div>
          {/* <TermsCheckbox onChange={onCheck} /> */}
        </div>

        <footer className={styles.feedback}>
          {isLoading && <Loader message={computeStepText} />}
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
          <Web3Feedback isBalanceInsufficient={!isBalanceSufficient} />
        </footer>
      </div>
    </div>
  )
}
