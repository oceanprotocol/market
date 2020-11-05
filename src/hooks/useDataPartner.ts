import { useEffect, useState } from 'react'
import listPartners from '@oceanprotocol/list-datapartners'
import { PartnerData } from '@oceanprotocol/list-datapartners/types'

export function useDataPartner(
  owner?: string
): {
  partner: PartnerData
  partnerAccounts: string[]
} {
  const [partnerAccounts, setPartnerAccounts] = useState<string[]>()
  const [partner, setPartner] = useState<PartnerData>()

  useEffect(() => {
    const accounts = [] as string[]
    listPartners.map((partner) => accounts.push(...partner.accounts))
    setPartnerAccounts(accounts)

    if (!owner) return

    const partner = listPartners.filter((partner) =>
      partner.accounts.includes(owner)
    )[0]
    setPartner(partner)
  }, [owner])

  return { partner, partnerAccounts }
}
