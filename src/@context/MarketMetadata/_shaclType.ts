export interface ShaclSchemaField {
  maxCount: number
  minCount: number
  minLength?: number
  maxLength?: number
  pattern?: string
}

export interface ShaclSchema {
  chainId: ShaclSchemaField
  credentials: {
    allow: {
      type: ShaclSchemaField
      values: ShaclSchemaField
    }
    deny: {
      type: ShaclSchemaField
      values: ShaclSchemaField
    }
  }
  id: ShaclSchemaField
  metadata: {
    additionalInformation: any
    algorithm: {
      consumerParameters: {
        default: ShaclSchemaField
        description: ShaclSchemaField
        label: ShaclSchemaField
        name: ShaclSchemaField
        options: ShaclSchemaField
        required: ShaclSchemaField
        type: ShaclSchemaField
      }
      container: {
        checksum: ShaclSchemaField
        entrypoint: ShaclSchemaField
        image: ShaclSchemaField
        tag: ShaclSchemaField
      }
      language: ShaclSchemaField
      version: ShaclSchemaField
    }
    author: ShaclSchemaField
    categories: ShaclSchemaField
    contentLanguage: ShaclSchemaField
    copyrightHolder: ShaclSchemaField
    description: ShaclSchemaField
    license: ShaclSchemaField
    links: ShaclSchemaField
    name: ShaclSchemaField
    tags: ShaclSchemaField
    type: ShaclSchemaField
  }
  nftAddress: ShaclSchemaField
  services: {
    additionalInformation: any
    compute: {
      allowNetworkAccess: ShaclSchemaField
      allowRawAlgorithm: ShaclSchemaField
      publisherTrustedAlgorithmPublishers: ShaclSchemaField
      publisherTrustedAlgorithms: {
        containerSectionChecksum: ShaclSchemaField
        did: ShaclSchemaField
        filesChecksum: ShaclSchemaField
      }
    }
    consumerParameters: {
      default: ShaclSchemaField
      description: ShaclSchemaField
      label: ShaclSchemaField
      name: ShaclSchemaField
      options: ShaclSchemaField
      required: ShaclSchemaField
      type: ShaclSchemaField
    }
    datatokenAddress: ShaclSchemaField
    description: {
      maxCount: number
      maxLength: number
      minLength: number
      pattern: string
    }
    files: ShaclSchemaField
    id: ShaclSchemaField
    name: {
      maxCount: number
      maxLength: number
      minLength: number
      pattern: string
    }
    serviceEndpoint: ShaclSchemaField
    timeout: ShaclSchemaField
    type: ShaclSchemaField
  }
  version: ShaclSchemaField
}
