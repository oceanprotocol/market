import { StringSchema } from 'yup'

export enum IncomingMessageFormat {
  json = 'json',
  text = 'text'
}

// names and values must match the values in the db table EwaiOutgoingDatasetFormat
// names are in all lowercase to match the db also. Query/rest/api args and everything should be all lowercase also
export enum OutputDataFormat {
  json = 'json',
  csv = 'csv',
  xml = 'xml'
}

export interface IEwaiInstanceResult {
  name: string
  apiVersion: string
  marketplacePublishRole: string
  marketplacePublishRoleEnrolUrl: string
  switchboardUrl: string
  enforceMarketplacePublishRole: boolean
  restApiUrl: string
  graphQlUrl: string
  ethRpcUrl: string
  ethChainId: number
  ewcRpcUrl: string
  ewcChainId: number
  addresses: number
}

export interface EwaiInstanceQuery {
  ewai: {
    ewaiInstance: IEwaiInstanceResult
  }
}

export interface MDInfo {
  node: {
    id: string
    fields: { slug: string }
    frontmatter: { title: string; description: string }
    html: string
  }
}
export interface EwaiEnrolQuery {
  allMarkdownRemark: {
    edges: MDInfo[]
  }
  ewai: {
    ewaiInstance: {
      name: string
      marketplacePublishRole: string
      marketplacePublishRoleEnrolUrl: string
      enforceMarketplacePublishRole: boolean
      graphQlUrl: string
    }
  }
}

/* eslint-disable camelcase */
export interface IEwaiLoginResult {
  access_token: string
  expires_at: string
}

export interface IEwaiStatsResult {
  ewaiInstance: string
  count: number
  addresses: number
}

export class IEwaiSpamCheckType {
  did: string
  base: string
  constructor(did: string, base: string) {
    this.did = did
    this.base = base
  }
}

export interface IEwaiCanCreateAssetResult {
  ewaiInstance: string
  ewns: string
  address: string
  canCreate: boolean
  canUseUuid?: string
  metadataKey?: string
  message?: string
}

export interface IEwaiCanPublishAssetsOnMarketplaceResult {
  ewaiInstance: string
  marketplacePublishRole: string
  enforceMarketplacePublishRole: boolean
  address: string
  canPublish: boolean
  enrolUrl: string
  message?: string
}

export interface IEwaiCreateAssetResult {
  uuid: string
  ewns: string
  createdOn: Date
  createdBy: string
  dataPublishRole: string
  dataUrls: string[]
  previewUrls: string[]
}

/* eslint-disable @typescript-eslint/no-empty-interface */
export interface IEwaiUpdateAssetResult extends IEwaiCreateAssetResult {}

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IEwaiLookupAssetResult {
  uuid: string
  ewns: string
  createdOn: Date
  createdBy: string
  dataPublishRole: string
  externalDid: string
  msgSchema: any
  pathToMsgTimestamp: string
  incomingMsgFormat: string
  incomingMsgCustomHandler: string
  defaultOutputFormat: string
  schemaValidationOn: boolean
  customSchemaValidator: string
  metadata: any
  dataUrls: string[]
  previewUrls: string[]
}

export interface IEwaiAssetFormFields {
  ewaiEwns?: string
  ewaiCategory?:
    | 'Bioenergy'
    | 'EV'
    | 'Geothermal'
    | 'Hydropower'
    | 'Hydrogen'
    | 'Ocean/Marine'
    | 'Solar'
    | 'Wind'
    | 'Other'
    | string
  ewaiVendor?: string
  ewaiPublishRole?: string
  ewaiIncomingMsgFormat?: 'Json' | 'Text' | string
  ewaiSchemaValidationOn?: 'Yes' | 'No' | string
  ewaiMsgSchema?: string
  ewaiPathToPtdTimestamp?: string
  ewaiOutputFormat?: 'Json' | 'Csv' | 'Xml' | string
}

export interface IEwaiAssetMetadata {
  title?: string
  description?: string
  category?: string
  vendor?: string
  tags?: string[]
}

export interface IEwaiAdditionalInfoForOcean {
  ewai: {
    instance: string
    base: string
  }
}
