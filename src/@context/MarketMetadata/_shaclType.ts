export interface ShaclSchema {
  chainId: {
    maxCount: number
    minCount: number
  }
  credentials: {
    allow: {
      type: {
        maxCount: number
        maxLength: number
        minCount: number
        pattern: string
      }
      values: {
        maxLength: number
        minCount: number
        pattern: string
      }
    }
    deny: {
      type: {
        maxCount: number
        maxLength: number
        minCount: number
        pattern: string
      }
      values: {
        maxLength: number
        minCount: number
        pattern: string
      }
    }
  }
  id: {
    maxCount: number
    maxLength: number
    minCount: number
    minLength: number
    pattern: string
  }
  metadata: {
    additionalInformation: any
    algorithm: {
      consumerParameters: {
        default: {
          maxCount: number
          maxLength: number
          minCount: number
          pattern: string
        }
        description: {
          maxCount: number
          maxLength: number
          minCount: number
          pattern: string
        }
        label: {
          maxCount: number
          maxLength: number
          minCount: number
          pattern: string
        }
        name: {
          maxCount: number
          maxLength: number
          minCount: number
          pattern: string
        }
        options: {
          maxLength: number
          pattern: string
        }
        required: {
          maxCount: number
          minCount: number
        }
        type: {
          maxCount: number
          maxLength: number
          minCount: number
          pattern: string
        }
      }
      container: {
        checksum: {
          maxCount: number
          maxLength: number
          minCount: number
          minLength: number
          pattern: string
        }
        entrypoint: {
          maxCount: number
          maxLength: number
          minCount: number
          pattern: string
        }
        image: {
          maxCount: number
          maxLength: number
          minCount: number
          pattern: string
        }
        tag: {
          maxCount: number
          maxLength: number
          minCount: number
          pattern: string
        }
      }
      language: {
        maxCount: number
        maxLength: number
        pattern: string
      }
      version: {
        maxCount: number
        maxLength: number
        pattern: string
      }
    }
    author: {
      maxCount: number
      maxLength: number
      minCount: number
      pattern: string
    }
    categories: {
      maxCount: number
      maxLength: number
      pattern: string
    }
    contentLanguage: {
      maxCount: number
      maxLength: number
      pattern: string
    }
    copyrightHolder: {
      maxCount: number
      maxLength: number
      pattern: string
    }
    description: {
      maxCount: number
      maxLength: number
      minCount: number
      pattern: string
    }
    license: {
      maxCount: number
      maxLength: number
      minCount: number
      pattern: string
    }
    links: {
      maxCount: number
      maxLength: number
      pattern: string
    }
    name: {
      maxCount: number
      maxLength: number
      minCount: number
      pattern: string
    }
    tags: {
      maxCount: number
      maxLength: number
      pattern: string
    }
    type: {
      maxCount: number
      maxLength: number
      minCount: number
      pattern: string
    }
  }
  nftAddress: {
    maxCount: number
    maxLength: number
    minCount: number
    minLength: number
  }
  services: {
    additionalInformation: any
    compute: {
      allowNetworkAccess: {
        maxCount: number
        minCount: number
      }
      allowRawAlgorithm: {
        maxCount: number
        minCount: number
      }
      publisherTrustedAlgorithmPublishers: {
        maxLength: number
        pattern: string
      }
      publisherTrustedAlgorithms: {
        containerSectionChecksum: {
          maxCount: number
          maxLength: number
          minCount: number
          pattern: string
        }
        did: {
          maxCount: number
          maxLength: number
          minCount: number
          pattern: string
        }
        filesChecksum: {
          maxCount: number
          maxLength: number
          minCount: number
          pattern: string
        }
      }
    }
    consumerParameters: {
      default: {
        maxCount: number
        maxLength: number
        minCount: number
        pattern: string
      }
      description: {
        maxCount: number
        maxLength: number
        minCount: number
        pattern: string
      }
      label: {
        maxCount: number
        maxLength: number
        minCount: number
        pattern: string
      }
      name: {
        maxCount: number
        maxLength: number
        minCount: number
        pattern: string
      }
      options: {
        maxLength: number
        pattern: string
      }
      required: {
        maxCount: number
        minCount: number
      }
      type: {
        maxCount: number
        maxLength: number
        minCount: number
        pattern: string
      }
    }
    datatokenAddress: {
      maxCount: number
      maxLength: number
      minCount: number
      minLength: number
      pattern: string
    }
    description: {
      maxCount: number
      maxLength: number
      minLength: number
      pattern: string
    }
    files: {
      maxCount: number
      maxLength: number
      minCount: number
      pattern: string
    }
    id: {
      maxCount: number
      maxLength: number
      minCount: number
      pattern: string
    }
    name: {
      maxCount: number
      maxLength: number
      minLength: number
      pattern: string
    }
    serviceEndpoint: {
      maxCount: number
      maxLength: number
      minCount: number
      minLength: number
      pattern: string
    }
    timeout: {
      maxCount: number
      minCount: number
      pattern: string
    }
    type: {
      maxCount: number
      maxLength: number
      minCount: number
      pattern: string
    }
  }
  version: {
    maxCount: number
    maxLength: number
    minCount: number
    pattern: string
  }
}
