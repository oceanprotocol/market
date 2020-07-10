import React, { ReactElement } from 'react'
import Eye from '../../../images/eye.svg'
import Button from '../Button'
import Tooltip from '../Tooltip'
import { ComputeItem } from '@oceanprotocol/react'

export declare type ActionsCellProps = {
  handleOnClickViewJobDetails?: (computeItem: ComputeItem) => void
}

export default function ActionsCell({
  handleOnClickViewJobDetails
}: ActionsCellProps): ReactElement {
  return (
    <>
      {handleOnClickViewJobDetails && (
        <Tooltip content="View job details">
          <Button onClick={handleOnClickViewJobDetails}>
            <Eye />
          </Button>
        </Tooltip>
      )}
    </>
  )
}
