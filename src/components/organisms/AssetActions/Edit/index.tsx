import React, { ReactElement } from 'react'
import { MetadataMarket } from '../../../../@types/MetaData'
import Button from '../../../atoms/Button'
import Input from '../../../atoms/Input'
import MetadataPreview from '../../../molecules/MetadataPreview'
import Web3Feedback from '../../../molecules/Wallet/Feedback'
import styles from './index.module.css'

export default function Edit({
  metadata,
  setShowEdit
}: {
  metadata: MetadataMarket
  setShowEdit: (show: boolean) => void
}): ReactElement {
  const values = {
    name: metadata.main.name,
    description: metadata.additionalInformation.description
  }

  return (
    <>
      <p className={styles.description}>
        Update selected metadata of this data set. Updating metadata will create
        a transaction on-chain.
      </p>
      <article className={styles.grid}>
        <form className={styles.form}>
          <Input
            name="name"
            label="New Title"
            value={values.name}
            help="Enter a concise title."
          />
          <Input
            name="description"
            label="New Description"
            value={values.description}
            help="Add a thorough description with as much detail as possible. You can use [Markdown](https://daringfireball.net/projects/markdown/basics)."
            type="textarea"
            rows={10}
          />

          <Button style="primary" disabled>
            Submit
          </Button>
          <Button style="text" onClick={() => setShowEdit(false)}>
            Cancel
          </Button>
        </form>

        <aside>
          <MetadataPreview values={values} />
          <Web3Feedback />
        </aside>
      </article>
    </>
  )
}
