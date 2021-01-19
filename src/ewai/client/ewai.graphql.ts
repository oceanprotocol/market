import * as EwaiTypes from './ewai.types'

export interface IGraphQlAuthConfig {
  headers: {
    Authorization: string
  }
}

export interface IGraphQlExtensionsError {
  code: string
  exception: any
}

export interface IGraphQlError {
  message?: string
  locations?: any[]
  path?: string[]
  extensions?: IGraphQlExtensionsError[]
}

export interface IGraphQlErrorArray {
  errors?: IGraphQlError[]
}

export interface IEwaiLoginGraphQLResult {
  data?: {
    login: EwaiTypes.IEwaiLoginResult
  }
  error?: string | IGraphQlErrorArray
  errors?: IGraphQlError[]
}

export interface IEwaiCanCreateAssetGraphQLResult {
  data?: {
    ewaiCanCreateAsset: EwaiTypes.IEwaiCanCreateAssetResult
  }
  error?: string | IGraphQlErrorArray
  errors?: IGraphQlError[]
}

export interface IEwaiCreateAssetGraphQLResult {
  data?: {
    createEwaiAsset: EwaiTypes.IEwaiCreateAssetResult
  }
  error?: string | IGraphQlErrorArray
  errors?: IGraphQlError[]
}

export interface IEwaiUpdateAssetGraphQLResult {
  data?: {
    updateEwaiAsset: EwaiTypes.IEwaiUpdateAssetResult
  }
  error?: string | IGraphQlErrorArray
  errors?: IGraphQlError[]
}

export interface IEwaiLookupAssetGraphQLResult {
  data?: {
    ewaiAsset: EwaiTypes.IEwaiLookupAssetResult
  }
  error?: string | IGraphQlErrorArray
  errors?: IGraphQlError[]
}

export interface IEwaiSetExternalDidGraphQLResult {
  data?: {
    updateEwaiAsset: EwaiTypes.IEwaiUpdateAssetResult
  }
  error?: string | IGraphQlErrorArray
  errors?: IGraphQlError[]
}

export interface IEwaiDeleteAssetGraphQLResult {
  data?: {
    deleteEwaiAsset: boolean
  }
  error?: string | IGraphQlErrorArray
  errors?: IGraphQlError[]
}

export interface IEwaiStatsGraphQLResult {
  data?: {
    ewaiStats: EwaiTypes.IEwaiStatsResult
  }
  error?: string | IGraphQlErrorArray
  errors?: IGraphQlError[]
}

export interface IEwaiValidateDidsGraphQLResult {
  data?: {
    ewaiValidateExternalDids: string[]
  }
  error?: string | IGraphQlErrorArray
  errors?: IGraphQlError[]
}
