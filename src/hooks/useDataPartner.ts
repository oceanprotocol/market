import listPartners from '../../content/list-datapartners.json'

export interface PartnerData {
  name: string
  accounts: string[]
  links: {
    [key: string]: string
  }
}

export function useDataPartner(
  owner: string
): {
  partner: PartnerData
} {
  // if (!owner) return

  const partner = listPartners.filter((partner) =>
    partner.accounts.includes(owner)
  )[0]

  return { partner }
}
