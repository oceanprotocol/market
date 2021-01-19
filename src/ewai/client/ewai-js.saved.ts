import axios from 'axios'

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

export interface IGraphQlAuthConfig {
  headers: {
    Authorization: string
  }
}

export interface IGraphQLExtensionsError {
  code: string
  exception: any
}

export interface IGraphQlError {
  message?: string
  locations?: any[]
  path?: string[]
  extensions?: IGraphQLExtensionsError[]
}

export interface IGraphQlErrorArray {
  errors?: IGraphQlError[]
}

export interface IEwaiLoginGraphQLResult {
  data?: {
    login: IEwaiLoginResult
  }
  error?: string | IGraphQlErrorArray
  errors?: IGraphQlError[]
}

export interface IEwaiCanCreateAssetGraphQLResult {
  data?: {
    ewaiCanCreateAsset: IEwaiCanCreateAssetResult
  }
  error?: string | IGraphQlErrorArray
  errors?: IGraphQlError[]
}

export interface IEwaiCreateAssetGraphQLResult {
  data?: {
    createEwaiAsset: IEwaiCreateAssetResult
  }
  error?: string | IGraphQlErrorArray
  errors?: IGraphQlError[]
}

export interface IEwaiUpdateAssetGraphQLResult {
  data?: {
    updateEwaiAsset: IEwaiUpdateAssetResult
  }
  error?: string | IGraphQlErrorArray
  errors?: IGraphQlError[]
}

export interface IEwaiLookupAssetGraphQLResult {
  data?: {
    ewaiAsset: IEwaiLookupAssetResult
  }
  error?: string | IGraphQlErrorArray
  errors?: IGraphQlError[]
}

export interface IEwaiSetExternalDidGraphQLResult {
  data?: {
    updateEwaiAsset: IEwaiUpdateAssetResult
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
    ewaiStats: IEwaiStatsResult
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

/* import * as EwaiTypes from './ewai.types'
import * as EwaiGraphQl from './ewai.graphql'

// re-export for client convenience:
export * from './ewai.types'
export * from './ewai.graphql' */

// -------------------------------
// simple logger
// -------------------------------
function log(msg: string): void {
  console.log(msg)
}

export interface IEwaiClientOpts {
  username: string
  password: string
  graphQlUrl: string
}

export class EwaiClient {
  private username: string
  private password: string
  private graphQlUrl: string
  private credentials: IEwaiLoginResult

  constructor(opts: IEwaiClientOpts) {
    this.username = opts.username
    this.password = opts.password
    this.graphQlUrl = opts.graphQlUrl
    this.credentials = undefined // will be initialized first time needed
  }

  // -------------------------------
  // helper function to get
  // EWAI Login Auth Credentials
  // -------------------------------
  async ewaiApiLoginAsync(): Promise<[string, IEwaiLoginResult?]> {
    const body = {
      query: `
        query Login($username: String!, $password: String!) {
          login(
              username: $username, 
              password: $password) {
            access_token,
            expires_at
            }
          }
          `,
      variables: {
        username: this.username,
        password: this.password
      }
    }
    log('<<<EWAI ewaiApiLoginAsync body>>>: ' + JSON.stringify(body))
    const { data: gqlResult } = await axios.post<IEwaiLoginGraphQLResult>(
      this.graphQlUrl,
      body
    )
    log('<<<EWAI ewaiApiLoginAsync result>>>: ' + JSON.stringify(gqlResult))
    if (!gqlResult.data || gqlResult.errors) {
      return [gqlResult.errors[0].message]
    }
    // convert to a real date:
    //gqlResult.data.login.expires_at = Date.parse(
    //  gqlResult.data.login.expires_at
    //)
    return [null, gqlResult.data.login]
  }

  // ---------------------------------------
  // helper function to create
  // Axios config header for auth
  // ---------------------------------------
  async getEwaiAuthHeaderConfigAsync(): Promise<IGraphQlAuthConfig> {
    let isExpired: boolean = true
    if (this.credentials) {
      // add 2 mins to be safe to allow Ocean contracts to finish without needing to re-auth
      const tSoon = new Date().getTime() + 120_000
      const tExpiresAt = Date.parse(this.credentials.expires_at)
      if (tExpiresAt > tSoon) {
        isExpired = false
      }
    }
    if (!this.credentials || isExpired) {
      const [err, credentials] = await this.ewaiApiLoginAsync()
      if (err) {
        throw new Error('Unable to connect to EWAI, Reason: ' + err)
      }
      this.credentials = credentials
    }
    const config = {
      headers: {
        Authorization: `Bearer ${this.credentials.access_token}`
      }
    }
    return config
  }

  // --------------------------------------------
  // get asset stats from db
  // --------------------------------------------
  async ewaiStatsAsync(): Promise<IEwaiStatsResult> {
    const config = await this.getEwaiAuthHeaderConfigAsync()
    const body = {
      query: `
        query STATS {
          ewaiStats{
            ewaiInstance
            count
            addresses
          }
        }
      `
    }
    log('<<<EWAI ewaiStats body>>>: ' + JSON.stringify(body))
    const { data: statsResult } = await axios.post<IEwaiStatsGraphQLResult>(
      this.graphQlUrl,
      body,
      config
    )
    log('<<<EWAI ewaiStats result>>>: ' + JSON.stringify(statsResult))
    if (!statsResult.data || statsResult.errors) {
      throw new Error('EWAI Error, Reason: ' + statsResult.errors[0].message)
    }
    return statsResult.data.ewaiStats
  }

  // --------------------------------------------
  // check a list of on-chain assets for spam
  // --------------------------------------------
  async validateExternalDidsAsync(
    checkList: IEwaiSpamCheckType[]
  ): Promise<string[]> {
    const config = await this.getEwaiAuthHeaderConfigAsync()
    const body = {
      query: `
      query ValidateDids($checkList:[ValidateExternalDidsArg!]!) {
        ewaiValidateExternalDids(
          dids:$checkList)
      }
      `,
      variables: {
        checkList: checkList
      }
    }
    log('<<<EWAI validateExternalDidsAsync body>>>: ' + JSON.stringify(body))
    const {
      data: validateExternalDidsResult
    } = await axios.post<IEwaiValidateDidsGraphQLResult>(
      this.graphQlUrl,
      body,
      config
    )
    log(
      '<<<EWAI validateExternalDidsAsync result>>>: ' +
        JSON.stringify(validateExternalDidsResult)
    )
    if (!validateExternalDidsResult.data || validateExternalDidsResult.errors) {
      throw new Error(
        'EWAI Error, Reason: ' + validateExternalDidsResult.errors[0].message
      )
    }
    return validateExternalDidsResult.data.ewaiValidateExternalDids
  }

  // --------------------------------------------
  // check if an EWAI asset can be safely created
  // before we fire off all the Ocean stuff
  // --------------------------------------------
  async canCreateEwaiAssetAsync(
    ewns: string,
    walletAddress: string
  ): Promise<IEwaiCanCreateAssetResult> {
    const config = await this.getEwaiAuthHeaderConfigAsync()
    const body = {
      query: `
        query CanCreate($ewns: String!, $address: String!) {
          ewaiCanCreateAsset(
              ewns: $ewns, 
              address: $address) {
            ewaiInstance
            ewns
            address
            canCreate
            canUseUuid
            metadataKey
            message
          }
          ewaiInstance {
            name
          }
        }
      `,
      variables: {
        ewns: ewns,
        address: walletAddress
      }
    }
    log('<<<EWAI canCreateEwaiAssetAsync body>>>: ' + JSON.stringify(body))
    const {
      data: canCreateAssetResult
    } = await axios.post<IEwaiCanCreateAssetGraphQLResult>(
      this.graphQlUrl,
      body,
      config
    )
    log(
      '<<<EWAI canCreateEwaiAssetAsync result>>>: ' +
        JSON.stringify(canCreateAssetResult)
    )
    if (!canCreateAssetResult.data || canCreateAssetResult.errors) {
      throw new Error(
        'EWAI Error, Reason: ' + canCreateAssetResult.errors[0].message
      )
    }
    return canCreateAssetResult.data.ewaiCanCreateAsset
  }

  // -------------------------------
  // Create an EWAI Asset
  // -------------------------------
  async createEwaiAssetAsync(
    useUuid: string,
    assetInfo: IEwaiAssetFormFields,
    assetMetadata: IEwaiAssetMetadata,
    walletAddress: string,
    oceanDid: string | undefined
  ): Promise<IEwaiCreateAssetResult> {
    const config = await this.getEwaiAuthHeaderConfigAsync()

    const assetMetadataObject: any = {
      title: assetMetadata.title,
      description: assetMetadata.description,
      category: assetInfo.ewaiCategory,
      vendor: assetInfo.ewaiVendor,
      tags: assetMetadata.tags
    }

    const body = {
      query: `
    mutation CreateAsset(
      $ewns: String!,
      $uuid: String!,
      $createdBy: String!,
      $pathToMsgTimestamp: String,
      $schemaValidationOn: Boolean!,
      $externalDid: String,
      $dataPublishRole: String!,
      $incomingMsgFormat: IncomingMessageFormat!,
      $outputDataFormat: OutputDataFormat!,
      $msgSchema: JSON,
      $metadata: JSON,
      ) {
        createEwaiAsset(
          data: {
            ewns: $ewns,
            uuid: $uuid,
            createdBy: $createdBy,
            dataPublishRole: $dataPublishRole,
            pathToMsgTimestamp: $pathToMsgTimestamp,
            schemaValidationOn: $schemaValidationOn,
            externalDid: $externalDid,
            incomingMsgFormat: $incomingMsgFormat,
            defaultOutputFormat: $outputDataFormat,
            metadata: $metadata,
            msgSchema: $msgSchema
            } ) {
          uuid
          ewns
          createdOn
          createdBy
          dataPublishRole
          dataUrls
          previewUrls
          metadata
          }
    }
    `,
      variables: {
        ewns: assetInfo.ewaiEwns,
        uuid: useUuid,
        createdBy: walletAddress,
        dataPublishRole: assetInfo.ewaiPublishRole,
        pathToMsgTimestamp: assetInfo.ewaiPathToPtdTimestamp
          ? assetInfo.ewaiPathToPtdTimestamp
          : null,
        schemaValidationOn: assetInfo.ewaiSchemaValidationOn === 'Yes',
        externalDid: oceanDid ? oceanDid : null,
        incomingMsgFormat: assetInfo.ewaiIncomingMsgFormat.toLowerCase(),
        outputDataFormat: assetInfo.ewaiOutputFormat.toLowerCase(),
        msgSchema: assetInfo.ewaiMsgSchema
          ? JSON.parse(assetInfo.ewaiMsgSchema)
          : null,
        metadata: assetMetadataObject
      }
    }
    log('<<<EWAI createEwaiAssetAsync body>>>: ' + JSON.stringify(body))
    const {
      data: createAssetResult
    } = await axios.post<IEwaiCreateAssetGraphQLResult>(
      this.graphQlUrl,
      body,
      config
    )
    log(
      '<<<EWAI createEwaiAssetAsync result>>>: ' +
        JSON.stringify(createAssetResult)
    )
    if (!createAssetResult.data || createAssetResult.errors) {
      throw new Error(
        'EWAI Error, Reason: ' + createAssetResult.errors[0].message
      )
    }
    return createAssetResult.data.createEwaiAsset
  }

  // -------------------------------
  // Set The Asset External DID
  // -------------------------------
  async setEwaiAssetExternalDidAsync(
    uuid: string,
    oceanDid: string
  ): Promise<IEwaiUpdateAssetResult | undefined> {
    if (!oceanDid) {
      return undefined // this should never happen
    }
    const config = await this.getEwaiAuthHeaderConfigAsync()
    const body = {
      query: `
    mutation UpdateExternalDid($uuid: String!, $externalDid: String) {
        updateEwaiAsset(
            where: { uuid: $uuid },
            data: { externalDid: $externalDid }
          ) {
          uuid,
          ewns,
          externalDid}
        }
    `,
      variables: {
        uuid: uuid,
        externalDid: oceanDid || ''
      }
    }
    log('<<<EWAI setEwaiAssetExternalDidAsync body>>>: ' + JSON.stringify(body))
    const {
      data: updateDataResult
    } = await axios.post<IEwaiSetExternalDidGraphQLResult>(
      this.graphQlUrl,
      body,
      config
    )
    log(
      '<<<EWAI setEwaiAssetExternalDidAsync result>>>: ' +
        JSON.stringify(updateDataResult)
    )
    if (!updateDataResult.data || updateDataResult.errors) {
      throw new Error(
        'EWAI Error, Reason: ' + updateDataResult.errors[0].message
      )
    }
    return updateDataResult.data.updateEwaiAsset
  }

  // --------------------------------------------------------------
  // Lookup the info for an EWAI Asset
  // --------------------------------------------------------------
  async lookupEwaiAssetAsync(
    oceanDid: string
  ): Promise<IEwaiLookupAssetResult> {
    const config = await this.getEwaiAuthHeaderConfigAsync()

    const body = {
      query: `
    query LookupAsset(
      $externalDid: String!
      ) {
        ewaiAsset( where: { externalDid: $externalDid} ) {
          uuid
          ewns
          createdOn
          createdBy
          dataPublishRole
          externalDid
          msgSchema
          pathToMsgTimestamp
          incomingMsgFormat
          incomingMsgCustomHandler
          defaultOutputFormat
          schemaValidationOn
          customSchemaValidator
          incomingMsgCustomHandler
          metadata
          dataUrls
          previewUrls
          }
    }
    `,
      variables: {
        externalDid: oceanDid
      }
    }
    log('<<<EWAI lookupEwaiAssetAsync body>>>: ' + JSON.stringify(body))
    const {
      data: lookupAssetResult
    } = await axios.post<IEwaiLookupAssetGraphQLResult>(
      this.graphQlUrl,
      body,
      config
    )
    log(
      '<<<EWAI lookupEwaiAssetAsync result>>>: ' +
        JSON.stringify(lookupAssetResult)
    )
    if (!lookupAssetResult.data || lookupAssetResult.errors) {
      throw new Error(
        'EWAI Error, Reason: ' + lookupAssetResult.errors[0].message
      )
    }
    if (!lookupAssetResult?.data?.ewaiAsset?.ewns) {
      throw new Error(`The ${oceanDid} asset was not found in EWAI`)
    }
    return lookupAssetResult.data.ewaiAsset
  }

  // --------------------------------------------------------------
  // Update an EWAI Asset
  // Note: UUID, EWNS and ExternalDid (Ocean DID) cannot be changed
  // --------------------------------------------------------------
  async updateEwaiAssetAsync(
    oceanDid: string,
    assetInfo: IEwaiAssetFormFields,
    assetMetadata: IEwaiAssetMetadata
  ): Promise<IEwaiUpdateAssetResult> {
    const config = await this.getEwaiAuthHeaderConfigAsync()

    const assetMetadataObject: any = {
      title: assetMetadata.title,
      description: assetMetadata.description,
      category: assetInfo.ewaiCategory,
      vendor: assetInfo.ewaiVendor,
      tags: assetMetadata.tags
    }

    const body = {
      query: `
    mutation UpdateAsset(
      $externalDid: String!,
      $pathToMsgTimestamp: String,
      $schemaValidationOn: Boolean!,
      $dataPublishRole: String,
      $incomingMsgFormat: IncomingMessageFormat!,
      $outputDataFormat: OutputDataFormat!,
      $msgSchema: JSON,
      $metadata: JSON,
      ) {
        updateEwaiAsset(
          where: { externalDid: $externalDid},
          data: {
            dataPublishRole: $dataPublishRole,
            pathToMsgTimestamp: $pathToMsgTimestamp,
            schemaValidationOn: $schemaValidationOn,
            externalDid: $externalDid,
            incomingMsgFormat: $incomingMsgFormat,
            defaultOutputFormat: $outputDataFormat,
            metadata: $metadata,
            msgSchema: $msgSchema
            } ) {
          uuid
          ewns
          createdOn
          createdBy
          dataPublishRole
          dataUrls
          previewUrls
          metadata
          }
    }
    `,
      variables: {
        externalDid: oceanDid,
        dataPublishRole: assetInfo.ewaiPublishRole,
        pathToMsgTimestamp: assetInfo.ewaiPathToPtdTimestamp
          ? assetInfo.ewaiPathToPtdTimestamp
          : null,
        schemaValidationOn: assetInfo.ewaiSchemaValidationOn === 'Yes',
        incomingMsgFormat: assetInfo.ewaiIncomingMsgFormat.toLowerCase(),
        outputDataFormat: assetInfo.ewaiOutputFormat.toLowerCase(),
        msgSchema: assetInfo.ewaiMsgSchema
          ? JSON.parse(assetInfo.ewaiMsgSchema)
          : null,
        metadata: assetMetadataObject
      }
    }
    log('<<<EWAI updateEwaiAssetAsync body>>>: ' + JSON.stringify(body))
    const {
      data: updateAssetResult
    } = await axios.post<IEwaiUpdateAssetGraphQLResult>(
      this.graphQlUrl,
      body,
      config
    )
    log(
      '<<<EWAI updateEwaiAssetAsync result>>>: ' +
        JSON.stringify(updateAssetResult)
    )
    if (!updateAssetResult.data || updateAssetResult.errors) {
      throw new Error(
        'EWAI Error, Reason: ' + updateAssetResult.errors[0].message
      )
    }
    return updateAssetResult.data.updateEwaiAsset
  }

  // -------------------------------
  // delete an Asset
  // -------------------------------
  async deleteEwaiAssetAsync(uuid: string): Promise<boolean> {
    const config = await this.getEwaiAuthHeaderConfigAsync()
    const body = {
      query: `
        mutation DeleteAsset ($uuid: String!) {
          deleteEwaiAsset( where: { uuid: $uuid } )
        }
      `,
      variables: {
        uuid: uuid
      }
    }
    log('<<<EWAI deleteEwaiAssetAsync body>>>: ' + JSON.stringify(body))
    const {
      data: deleteAssetResult
    } = await axios.post<IEwaiDeleteAssetGraphQLResult>(
      this.graphQlUrl,
      body,
      config
    )
    log(
      '<<<EWAI deleteEwaiAssetAsync result>>>: ' +
        JSON.stringify(deleteAssetResult)
    )
    if (!deleteAssetResult.data || deleteAssetResult.errors) {
      return false
    }
    return deleteAssetResult.data.deleteEwaiAsset
  }
}
