import React, { useState, ReactElement, ChangeEvent } from 'react'
import { DDO, Logger } from '@oceanprotocol/lib'
import Loader from '../../atoms/Loader'
import Web3Feedback from '../../molecules/Wallet/Feedback'
import Dropzone from '../../atoms/Dropzone'
import Price from '../../atoms/Price'
import File from '../../atoms/File'
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
import { useSiteMetadata } from '../../../hooks/useSiteMetadata'

export default function Compute({
  ddo,
  isBalanceSufficient
}: {
  ddo: DDO
  isBalanceSufficient: boolean
}): ReactElement {
  const { ocean } = useOcean()
  const { compute, isLoading, computeStepText, computeError } = useCompute()
  const { marketFeeAddress } = useSiteMetadata()
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

  const isComputeButtonDisabled =
    isJobStarting === true ||
    file === null ||
    computeType === '' ||
    !ocean ||
    !isBalanceSufficient

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

      await compute(
        ddo.id,
        computeService,
        ddo.dataToken,
        algorithmRawCode,
        computeContainer,
        marketFeeAddress
      )

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
        <div className={styles.filewrapper}>
          <File file={metadataService.attributes.main.files[0]} small />
        </div>
        <div className={styles.pricewrapper}>
          <Price ddo={ddo} conversion />
        </div>
      </div>

      <Input
        type="select"
        name="algorithm"
        label="Select image to run the algorithm"
        placeholder=""
        small
        value={computeType}
        options={computeOptions.map((x) => x.name)}
        onChange={handleSelectChange}
      />
      <Dropzone multiple={false} handleOnDrop={onDrop} />

      <div className={styles.actions}>
        <Button
          style="primary"
          onClick={() => startJob()}
          disabled={isComputeButtonDisabled}
        >
          Start job
        </Button>
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
        <Web3Feedback isBalanceSufficient={isBalanceSufficient} />
      </footer>
    </>
  )
}
