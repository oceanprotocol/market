// DDO spec
interface DDO {
  '@context': string[]
  id: string
  version: string
  chainId: number
  metadata: Metadata
  services: Service[]
  credentials?: Credentials
}
