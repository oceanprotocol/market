import React, { FormEvent, ReactElement, useEffect, useState } from 'react'
import Markdown from '@shared/Markdown'
import Tags from '@shared/atoms/Tags'
import MetaItem from '../../Asset/AssetContent/MetaItem'
import FileIcon from '@shared/FileIcon'
import Button from '@shared/atoms/Button'
import NetworkName from '@shared/NetworkName'
import { useWeb3 } from '@context/Web3'
import styles from './index.module.css'
import Web3Feedback from '@shared/Web3Feedback'
import { FormPublishData } from '../_types'
import { useFormikContext } from 'formik'
import AssetContent from 'src/components/Asset/AssetContent'
import { transformPublishFormToDdo } from '../_utils'

export default function Preview(): ReactElement {
  const [ddo, setDdo] = useState<DDO>()
  const { values } = useFormikContext<FormPublishData>()

  useEffect(() => {
    async function makeDdo() {
      const ddo = await transformPublishFormToDdo(values)
      setDdo(ddo)
    }
    makeDdo()
  }, [values])

  return (
    <div className={styles.preview}>
      <h2 className={styles.previewTitle}>Preview</h2>
      <AssetContent ddo={ddo} />
    </div>
  )
}
