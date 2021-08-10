import React, { ReactElement } from 'react'
import { useUserPreferences } from '../../../providers/UserPreferences'
import Input from '../../atoms/Input'

export default function TokenApproval(): ReactElement {
  const { infiniteApproval, setInfiniteApproval } = useUserPreferences()

  return (
    <li>
      <Input
        label="Token Approvals"
        help="Use infinite amount when approving tokens in _Use_, _Pool_, or _Trade_."
        name="infiniteApproval"
        type="checkbox"
        options={['Allow infinite amount']}
        defaultChecked={infiniteApproval === true}
        onChange={() => setInfiniteApproval(!infiniteApproval)}
      />
    </li>
  )
}
