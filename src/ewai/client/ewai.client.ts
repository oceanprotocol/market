import * as EwaiTypes from './ewai.types'
import * as EwaiGraphQl from './ewai.graphql'

export interface IEwaiLoginGraphQLResult {
  data?: {
    login: EwaiTypes.IEwaiLoginResult
  }
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
  private credentials: EwaiTypes.IEwaiLoginResult

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
  async ewaiApiLoginAsync(): Promise<[string, EwaiTypes.IEwaiLoginResult?]> {
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
    const result = await EwaiGraphQl.ewaiCallGraphQlAsync<EwaiTypes.IEwaiLoginResult>(
      'login',
      this.graphQlUrl,
      body
    )
    if (result.message !== EwaiGraphQl.GraphQlCallSuccess || !result.data) {
      return [result.message]
    }
    return [null, result.data]
  }

  // ---------------------------------------
  // helper function to create
  // Axios config header for auth
  // ---------------------------------------
  async getEwaiAuthHeaderConfigAsync(): Promise<EwaiGraphQl.IGraphQlAuthConfig> {
    let isExpired = true
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
  // get ewai instance info
  // --------------------------------------------
  async ewaiInstanceAsync(): Promise<EwaiTypes.IEwaiInstanceResult> {
    const config = await this.getEwaiAuthHeaderConfigAsync()
    const body = {
      query: `
        query EWAIINSTANCE {
          ewaiInstance {
            name
            apiVersion
            marketplacePublishRole
            marketplacePublishRoleEnrolUrl
            switchboardUrl
            enforceMarketplacePublishRole
            restApiUrl
            graphQlUrl
            ethRpcUrl
            ethChainId
            ewcRpcUrl
            ewcChainId
          }
        }
      `
    }
    const result = await EwaiGraphQl.ewaiCallGraphQlAsync<EwaiTypes.IEwaiInstanceResult>(
      'ewaiInstance',
      this.graphQlUrl,
      body,
      config
    )
    if (result.message !== EwaiGraphQl.GraphQlCallSuccess || !result.data) {
      throw new Error('EWAI Error, Reason: ' + result.message)
    }
    return result.data
  }

  // --------------------------------------------
  // get asset stats from db
  // --------------------------------------------
  async ewaiStatsAsync(): Promise<EwaiTypes.IEwaiStatsResult> {
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
    const result = await EwaiGraphQl.ewaiCallGraphQlAsync<EwaiTypes.IEwaiStatsResult>(
      'ewaiStats',
      this.graphQlUrl,
      body,
      config
    )
    if (result.message !== EwaiGraphQl.GraphQlCallSuccess || !result.data) {
      throw new Error('EWAI Error, Reason: ' + result.message)
    }
    return result.data
  }

  // --------------------------------------------
  // check a list of on-chain assets for spam
  // --------------------------------------------
  async validateExternalDidsAsync(
    checkList: EwaiTypes.IEwaiSpamCheckType[]
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
    const result = await EwaiGraphQl.ewaiCallGraphQlAsync<string[]>(
      'ewaiValidateExternalDids',
      this.graphQlUrl,
      body,
      config
    )
    if (result.message !== EwaiGraphQl.GraphQlCallSuccess || !result.data) {
      throw new Error('EWAI Error, Reason: ' + result.message)
    }
    return result.data
  }

  // --------------------------------------------
  // check if an EWAI asset can be safely created
  // before we fire off all the Ocean stuff
  // --------------------------------------------
  async canCreateEwaiAssetAsync(
    ewns: string,
    walletAddress: string
  ): Promise<EwaiTypes.IEwaiCanCreateAssetResult> {
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
        }
      `,
      variables: {
        ewns: ewns,
        address: walletAddress
      }
    }
    const result = await EwaiGraphQl.ewaiCallGraphQlAsync<EwaiTypes.IEwaiCanCreateAssetResult>(
      'ewaiCanCreateAsset',
      this.graphQlUrl,
      body,
      config
    )
    if (result.message !== EwaiGraphQl.GraphQlCallSuccess || !result.data) {
      throw new Error('EWAI Error, Reason: ' + result.message)
    }
    return result.data
  }

  // --------------------------------------------
  // check if a user has the necessary publish role
  // for this marketplace
  // --------------------------------------------
  async ewaiCanPublishAssetsOnMarketplaceAsync(
    walletAddress: string
  ): Promise<EwaiTypes.IEwaiCanPublishAssetsOnMarketplaceResult> {
    const config = await this.getEwaiAuthHeaderConfigAsync()
    const body = {
      query: `
        query CanPublish($address: String!) {
          ewaiCanPublishAssetsOnMarketplace(address: $address) {
            ewaiInstance
            marketplacePublishRole
            enforceMarketplacePublishRole
            address
            canPublish
            enrolUrl
            message
          }
        }
      `,
      variables: {
        address: walletAddress
      }
    }
    const result = await EwaiGraphQl.ewaiCallGraphQlAsync<EwaiTypes.IEwaiCanPublishAssetsOnMarketplaceResult>(
      'ewaiCanPublishAssetsOnMarketplace',
      this.graphQlUrl,
      body,
      config
    )
    if (result.message !== EwaiGraphQl.GraphQlCallSuccess || !result.data) {
      throw new Error('EWAI Error, Reason: ' + result.message)
    }
    return result.data
  }

  // -------------------------------
  // Create an EWAI Asset
  // -------------------------------
  async createEwaiAssetAsync(
    useUuid: string,
    assetInfo: EwaiTypes.IEwaiAssetFormFields,
    assetMetadata: EwaiTypes.IEwaiAssetMetadata,
    walletAddress: string,
    oceanDid: string | undefined
  ): Promise<EwaiTypes.IEwaiCreateAssetResult> {
    const config = await this.getEwaiAuthHeaderConfigAsync()

    /* eslint-disable @typescript-eslint/no-explicit-any */
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
        /* eslint-disable no-unneeded-ternary */
        externalDid: oceanDid ? oceanDid : null, // I actually think the ternary is needed here, we want null specifically (not undefined)
        incomingMsgFormat: assetInfo.ewaiIncomingMsgFormat.toLowerCase(),
        outputDataFormat: assetInfo.ewaiOutputFormat.toLowerCase(),
        msgSchema: assetInfo.ewaiMsgSchema
          ? JSON.parse(assetInfo.ewaiMsgSchema)
          : null,
        metadata: assetMetadataObject
      }
    }
    const result = await EwaiGraphQl.ewaiCallGraphQlAsync<EwaiTypes.IEwaiCreateAssetResult>(
      'createEwaiAsset',
      this.graphQlUrl,
      body,
      config
    )
    if (result.message !== EwaiGraphQl.GraphQlCallSuccess || !result.data) {
      throw new Error('EWAI Error, Reason: ' + result.message)
    }
    return result.data
  }

  // -------------------------------
  // Set The Asset External DID
  // -------------------------------
  async setEwaiAssetExternalDidAsync(
    uuid: string,
    oceanDid: string
  ): Promise<EwaiTypes.IEwaiUpdateAssetResult | undefined> {
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
    const result = await EwaiGraphQl.ewaiCallGraphQlAsync<EwaiTypes.IEwaiUpdateAssetResult>(
      'updateEwaiAsset',
      this.graphQlUrl,
      body,
      config
    )
    if (result.message !== EwaiGraphQl.GraphQlCallSuccess || !result.data) {
      throw new Error('EWAI Error, Reason: ' + result.message)
    }
    return result.data
  }

  // --------------------------------------------------------------
  // Lookup the info for an EWAI Asset
  // --------------------------------------------------------------
  async lookupEwaiAssetAsync(
    oceanDid: string
  ): Promise<EwaiTypes.IEwaiLookupAssetResult> {
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
    const result = await EwaiGraphQl.ewaiCallGraphQlAsync<EwaiTypes.IEwaiLookupAssetResult>(
      'ewaiAsset',
      this.graphQlUrl,
      body,
      config
    )
    if (result.message !== EwaiGraphQl.GraphQlCallSuccess || !result.data) {
      throw new Error('EWAI Error, Reason: ' + result.message)
    }
    if (!result?.data?.ewns) {
      throw new Error(`The ${oceanDid} asset was not found in EWAI`)
    }
    return result.data
  }

  // --------------------------------------------------------------
  // Update an EWAI Asset
  // Note: UUID, EWNS and ExternalDid (Ocean DID) cannot be changed
  // --------------------------------------------------------------
  async updateEwaiAssetAsync(
    oceanDid: string,
    assetInfo: EwaiTypes.IEwaiAssetFormFields,
    assetMetadata: EwaiTypes.IEwaiAssetMetadata
  ): Promise<EwaiTypes.IEwaiUpdateAssetResult> {
    const config = await this.getEwaiAuthHeaderConfigAsync()

    /* eslint-disable @typescript-eslint/no-explicit-any */
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
    const result = await EwaiGraphQl.ewaiCallGraphQlAsync<EwaiTypes.IEwaiUpdateAssetResult>(
      'updateEwaiAsset',
      this.graphQlUrl,
      body,
      config
    )
    if (result.message !== EwaiGraphQl.GraphQlCallSuccess || !result.data) {
      throw new Error('EWAI Error, Reason: ' + result.message)
    }
    return result.data
  }

  // -------------------------------
  // reset Asset data
  // -------------------------------
  async resetEwaiAssetDataAsync(oceanDid: string): Promise<boolean> {
    const config = await this.getEwaiAuthHeaderConfigAsync()
    const body = {
      query: `
        mutation ResetAssetData ($externalDid: String!) {
          resetEwaiAssetData( where: { externalDid: $externalDid } )
        }
      `,
      variables: {
        externalDid: oceanDid
      }
    }
    const result = await EwaiGraphQl.ewaiCallGraphQlAsync<boolean>(
      'resetEwaiAssetData',
      this.graphQlUrl,
      body,
      config
    )
    if (result.message !== EwaiGraphQl.GraphQlCallSuccess || !result.data) {
      throw new Error('EWAI Error, Reason: ' + result.message)
    }
    return result.data
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
    const result = await EwaiGraphQl.ewaiCallGraphQlAsync<boolean>(
      'deleteEwaiAsset',
      this.graphQlUrl,
      body,
      config
    )
    if (result.message !== EwaiGraphQl.GraphQlCallSuccess || !result.data) {
      throw new Error('EWAI Error, Reason: ' + result.message)
    }
    return result.data
  }
}
