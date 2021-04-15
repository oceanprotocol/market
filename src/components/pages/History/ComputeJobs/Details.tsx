import React, { ReactElement, useState } from 'react'
import Time from '../../../atoms/Time'
import Button from '../../../atoms/Button'
import { ComputeJobMetaData } from '../../../../@types/ComputeJobMetaData'
import Modal from '../../../atoms/Modal'
import ComputeResults from './Results'
import { Status } from '.'
import styles from './Details.module.css'

export default function Details({
  row
}: {
  row: ComputeJobMetaData
}): ReactElement {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const isFinished = row.dateFinished !== null

  return (
    <>
      <Button style="text" size="small" onClick={() => setIsDialogOpen(true)}>
        Show Details
      </Button>
      <Modal
        title="Compute job details"
        isOpen={isDialogOpen}
        onToggleModal={() => setIsDialogOpen(false)}
      >
        <h3 className={styles.title}>{row.assetName}</h3>
        <p>
          Created <Time date={row.dateCreated} isUnix relative />
          {row.dateFinished && (
            <>
              <br />
              Finished <Time date={row.dateFinished} isUnix relative />
            </>
          )}
        </p>
        <Status>{row.statusText}</Status>
        {isFinished && <ComputeResults computeJob={row} />}
      </Modal>
    </>
  )
}
