// DDO spec
interface DDO {
  '@context': string[]
  id: string
  version: string
  chainId: number
  created: string
  updated?: string
  metadata: Metadata
  files: FileMetadata[]
  services: Service[]
  credentials?: Credentials
  status: {
    state: 0 | 1 | 2 | 3
    isListed?: boolean
    isOrderDisabled?: boolean
  }
}
