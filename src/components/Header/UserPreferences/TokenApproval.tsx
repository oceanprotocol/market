import React, { ReactElement } from 'react'
import { useUserPreferences } from '@context/UserPreferences'
import Input from '@shared/FormInput'

export default function TokenApproval(): ReactElement {
  const { infiniteApproval, setInfiniteApproval } = useUserPreferences()

  return (
    <li>
      <Input
        label="Token Approvals"
        help="Use infinite amount when approving tokens in _Use_."
        name="infiniteApproval"
        type="checkbox"
        options={['Allow infinite amount']}
        defaultChecked={infiniteApproval === true}
        onChange={() => setInfiniteApproval(!infiniteApproval)}
      />
    </li>
  )
}
