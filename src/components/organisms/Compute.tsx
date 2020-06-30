import React, { useState, useEffect } from 'react'
import { DDO, Ocean } from '@oceanprotocol/squid'
import { ServiceMetadata } from '@oceanprotocol/squid/dist/node/ddo/Service'
import { fromWei } from 'web3-utils'
import compareAsBN, { Comparisson } from '../../utils/compareAsBN'
import Loader from '../atoms/Loader'
import Web3Feedback from '../molecules/Web3Feedback'
import Dropzone from '../atoms/Dropzone'
import Price from '../atoms/Price'
import {
  computeOptions,
  useCompute,
  readFileContent
} from '@oceanprotocol/react'
import styles from './Compute.module.css'
import Button from '../atoms/Button'
import Input from '../atoms/Input'

export default function Compute({
  ddo,
  balance,
  ocean
}: {
  ddo: DDO | null
  balance: string | null
  ocean: Ocean | null
}) {
  if (!ddo) return null

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

  const metadata = ddo.findServiceByType('metadata') as ServiceMetadata
  const { price } = metadata.attributes.main

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

      await compute(ddo.id, algorithmRawCode, computeContainer)

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
      <Price price={price} className={styles.price} />

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

        {isLoading && <Loader message={computeStepText} />}
        {computeError !== undefined && (
          <div className={styles.feedback}>{computeError}</div>
        )}
        {isPublished && (
          <div className={styles.feedback}>
            <p>Your job started! Watch the progress in the history page.</p>
          </div>
        )}
      </div>

      <footer className={styles.feedback}>
        <Web3Feedback isBalanceInsufficient={!isBalanceSufficient} />
      </footer>
    </div>
  )
}
