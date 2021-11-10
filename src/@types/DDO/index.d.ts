// DDO spec
interface DDO {
  '@context': string[]
  id: string
  version: string
  chainId: number
  created: string
  updated?: string
  metadata: Metadata
  services: Service[]
  credentials?: Credentials
}
