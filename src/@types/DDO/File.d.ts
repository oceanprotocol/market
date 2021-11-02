interface File {
  contentType: string
  url?: string
  name?: string
  checksum?: string
  checksumType?: string
  contentLength?: string
  encoding?: string
  compression?: string
  encrypted?: boolean
  encryptionMode?: string
  resourceId?: string
  attributes?: { [key: string]: any }
}
