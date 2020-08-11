import React, { useState, ReactElement } from 'react'
import { DDO } from '@oceanprotocol/lib'
import Loader from '../../atoms/Loader'
import Web3Feedback from '../../molecules/Wallet/Feedback'
import Dropzone from '../../atoms/Dropzone'
import Price from '../../atoms/Price'
import {
  computeOptions,
  useCompute,
  readFileContent,
  useOcean
} from '@oceanprotocol/react'
import styles from './Compute.module.css'
import Button from '../../atoms/Button'
import Input from '../../atoms/Input'
import Alert from '../../atoms/Alert'

export default function Compute({
  ddo,
  isBalanceSufficient,
  setPrice
}: {
  ddo: DDO
  isBalanceSufficient: boolean
  setPrice: (price: string) => void
}): ReactElement {
  const { ocean } = useOcean()
  const { compute, isLoading, computeStepText, computeError } = useCompute()
  const computeService = ddo.findServiceByType('compute').attributes.main

  const [isJobStarting, setIsJobStarting] = useState(false)
  const [, setError] = useState('')
  const [computeType, setComputeType] = useState('')
  const [computeContainer, setComputeContainer] = useState({
    entrypoint: '',
    image: '',
    tag: ''
  })
  const [algorithmRawCode, setAlgorithmRawCode] = useState('')
  const [isPublished, setIsPublished] = useState(false)
  const [file, setFile] = useState(null)

  const isComputeButtonDisabled =
    isJobStarting ||
    file === null ||
    computeType === '' ||
    !ocean ||
    !isBalanceSufficient

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

      await compute(
        ddo.id,
        computeService,
        ddo.dataToken,
        algorithmRawCode,
        computeContainer
      )

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
      <Price ddo={ddo} setPriceOutside={setPrice} />

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
