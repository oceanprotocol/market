// This is all super questionable,
// but we most likely need something to represent what we get
// back from fileinfo endpoint in Provider.

interface FileMetadata {
  url: string
  contentType: string
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
