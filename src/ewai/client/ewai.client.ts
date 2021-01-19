import axios from 'axios'
import * as EwaiTypes from './ewai.types'
import * as EwaiGraphQl from './ewai.graphql'

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
    log('<<<EWAI ewaiApiLoginAsync body>>>: ' + JSON.stringify(body))
    const {
      data: gqlResult
    } = await axios.post<EwaiGraphQl.IEwaiLoginGraphQLResult>(
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
  async getEwaiAuthHeaderConfigAsync(): Promise<EwaiGraphQl.IGraphQlAuthConfig> {
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
    log('<<<EWAI ewaiStats body>>>: ' + JSON.stringify(body))
    const {
      data: statsResult
    } = await axios.post<EwaiGraphQl.IEwaiStatsGraphQLResult>(
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
    log('<<<EWAI validateExternalDidsAsync body>>>: ' + JSON.stringify(body))
    const {
      data: validateExternalDidsResult
    } = await axios.post<EwaiGraphQl.IEwaiValidateDidsGraphQLResult>(
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
    } = await axios.post<EwaiGraphQl.IEwaiCanCreateAssetGraphQLResult>(
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
    assetInfo: EwaiTypes.IEwaiAssetFormFields,
    assetMetadata: EwaiTypes.IEwaiAssetMetadata,
    walletAddress: string,
    oceanDid: string | undefined
  ): Promise<EwaiTypes.IEwaiCreateAssetResult> {
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
    } = await axios.post<EwaiGraphQl.IEwaiCreateAssetGraphQLResult>(
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
    log('<<<EWAI setEwaiAssetExternalDidAsync body>>>: ' + JSON.stringify(body))
    const {
      data: updateDataResult
    } = await axios.post<EwaiGraphQl.IEwaiSetExternalDidGraphQLResult>(
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
    log('<<<EWAI lookupEwaiAssetAsync body>>>: ' + JSON.stringify(body))
    const {
      data: lookupAssetResult
    } = await axios.post<EwaiGraphQl.IEwaiLookupAssetGraphQLResult>(
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
    assetInfo: EwaiTypes.IEwaiAssetFormFields,
    assetMetadata: EwaiTypes.IEwaiAssetMetadata
  ): Promise<EwaiTypes.IEwaiUpdateAssetResult> {
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
    } = await axios.post<EwaiGraphQl.IEwaiUpdateAssetGraphQLResult>(
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
    } = await axios.post<EwaiGraphQl.IEwaiDeleteAssetGraphQLResult>(
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
