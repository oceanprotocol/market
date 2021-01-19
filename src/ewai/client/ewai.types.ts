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

export interface EwaiInstanceQuery {
  ewai: { ewaiInstance: { name: string } }
}

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

export interface IEwaiCreateAssetResult {
  uuid: string
  ewns: string
  createdOn: Date
  createdBy: string
  dataPublishRole: string
  dataUrls: string[]
  previewUrls: string[]
}

export interface IEwaiUpdateAssetResult extends IEwaiCreateAssetResult {}

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
