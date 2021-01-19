import React, { ReactElement, useState } from 'react'
import { Formik } from 'formik'
import { usePublish, useOcean } from '@oceanprotocol/react'
import styles from './index.module.css'
import FormPublish from './FormPublish'
import Web3Feedback from '../../molecules/Wallet/Feedback'
import { FormContent } from '../../../@types/Form'
import { initialValues, validationSchema } from '../../../models/FormPublish'
import { transformPublishFormToMetadata } from '../../../utils/metadata'
import MetadataPreview from '../../molecules/MetadataPreview'
import { MetadataPublishForm } from '../../../@types/MetaData'
import { useUserPreferences } from '../../../providers/UserPreferences'
import { File as OceanFile, Logger, Metadata } from '@oceanprotocol/lib'
import { Persist } from '../../atoms/FormikPersist'
import Debug from './Debug'
import Alert from '../../atoms/Alert'
import MetadataFeedback from '../../molecules/MetadataFeedback'
import * as EwaiUtils from '../../../ewai/ewaiutils'
import {
  EwaiClient,
  IEwaiAssetFormFields,
  IEwaiAssetMetadata
} from '../../../ewai/client/ewai-js'
import ddo from '../../../../tests/unit/__fixtures__/ddo'

const formName = 'ocean-publish-form'

export default function PublishPage({
  content
}: {
  content: { warning: string; form: FormContent }
}): ReactElement {
  const { debug } = useUserPreferences()
  const { publish, publishError, isLoading, publishStepText } = usePublish()
  const { isInPurgatory, purgatoryData, account } = useOcean()
  const [success, setSuccess] = useState<string>()
  const [error, setError] = useState<string>()
  const [did, setDid] = useState<string>()

  const hasFeedback = isLoading || error || success

  async function handleSubmit(
    values: Partial<MetadataPublishForm>,
    resetForm: () => void
  ): Promise<void> {
    const walletAddress = account.getId()

    // create an EWAI Client instance:
    const ewaiClient = new EwaiClient({
      username: process.env.EWAI_API_USERNAME,
      password: process.env.EWAI_API_PASSWORD,
      graphQlUrl: process.env.EWAI_API_GRAPHQL_URL
    })
    // place to save the uuid being used, in case we need to delete it in the catch block at end
    // this is assigned after we know the result of canCreate call
    let ewaiUuid: string = undefined

    // get ewai specific form fields:
    const ewaiAssetFormInfo: IEwaiAssetFormFields = EwaiUtils.transformPublishFormToEwaiAssetInfo(
      values
    )

    // check to see if any schema that was entered (if any) is valid JSON Schema:
    if (ewaiAssetFormInfo.ewaiMsgSchema) {
      let msgSchemaValidatedOk = false
      if (EwaiUtils.hasJsonStructure(ewaiAssetFormInfo.ewaiMsgSchema)) {
        const check = EwaiUtils.safeJsonParse(ewaiAssetFormInfo.ewaiMsgSchema)
        msgSchemaValidatedOk = check.error === null || check.error === undefined
      }
      if (!msgSchemaValidatedOk) {
        const errMsg =
          'Please enter valid JSON Schema in the EWAI Message Schema field (or you must leave it blank)'
        setError(errMsg)
        Logger.error(errMsg)
        return
      }
    }

    try {
      // get the Ocean form values:
      const metadata = transformPublishFormToMetadata(values)
      const serviceType = values.access === 'Download' ? 'access' : 'compute'

      // check if the desired EWNS is available and also that this wallet address has
      // either ownership of that EWNS and role permission to publish on this marketplace
      //
      // TBD: we should have checked this wallet has role permission to publish on
      // this marketplace before here! TBD
      const ewaiCanCreateAsset = await ewaiClient.canCreateEwaiAssetAsync(
        ewaiAssetFormInfo.ewaiEwns,
        walletAddress
      )
      if (!ewaiCanCreateAsset.canCreate) {
        const errMsg = `The EWNS '${ewaiCanCreateAsset.ewns}' cannot be used, Reason: ${ewaiCanCreateAsset.message}`
        setError(errMsg)
        Logger.error(errMsg)
        return
      }
      // we can create, and we have a uuid that we will be using, save it here so we can get it later anywhere below
      // including in the final catch block:
      ewaiUuid = ewaiCanCreateAsset.canUseUuid

      // create a (partial) EWAI asset that will be used for this dataset
      // we don't have the OceanDid at this time, so we will have to poke that
      // in later after Ocean does it's stuff. So this is a fully formed EWAI asset
      // but just missing the externalDid field:
      const ewaiAssetMetadata: any = {
        title: metadata.main.name,
        description: metadata.additionalInformation.description,
        category: ewaiAssetFormInfo.ewaiCategory,
        vendor: ewaiAssetFormInfo.ewaiVendor,
        tags: metadata.additionalInformation.tags
      }
      const createEwaiAsset = await ewaiClient.createEwaiAssetAsync(
        ewaiUuid,
        ewaiAssetFormInfo,
        ewaiAssetMetadata,
        walletAddress,
        undefined
      )

      // We now have the EWAI asset created, but we need to tell Ocean
      // where it's data files will be (set data and preview urls):
      // remember to set the url to matche the current ewaiAssetFormInfo.ewaiOutputFormat specified:
      const dataFile: OceanFile = {
        url: createEwaiAsset.dataUrls[0],
        contentType: EwaiUtils.outputDataFormatToFileContentType(
          ewaiAssetFormInfo.ewaiOutputFormat
        ),
        contentLength: '0' // don't care
      }
      metadata.main.files = [dataFile]

      const previewFile: OceanFile = {
        url: createEwaiAsset.previewUrls[0],
        contentType: EwaiUtils.outputDataFormatToFileContentType(
          ewaiAssetFormInfo.ewaiOutputFormat
        ),
        contentLength: '0' // don't care
      }
      metadata.additionalInformation.links = [previewFile]

      // add/set a field in the metadata additional info that could be used to later
      // to search for and only list EWAI assets for this marketplace instance
      // from the entire Ocean eth chain
      // (all assets are mingled together out on the chain from all marketplaces)
      metadata.additionalInformation.energyweb = {
        ewai: {
          instance: ewaiCanCreateAsset.ewaiInstance,
          base: ewaiCanCreateAsset.metadataKey
        }
      }

      Logger.log(
        'Publish with ',
        metadata,
        serviceType,
        values.dataTokenOptions
      )

      // Skipping Ocean should never be set true in production, just for dev/debug
      const skipOcean: boolean = process.env.EWAI_SKIP_OCEAN_CREATE === 'true'
      let oceanDid = undefined

      if (!skipOcean) {
        // fire off the Ocean create logic:
        const ddo = await publish(
          (metadata as unknown) as Metadata,
          serviceType,
          values.dataTokenOptions
        )

        // Publish failed
        if (!ddo || publishError) {
          // remember we must delete EWAI asset we created at top
          // expecting successful Ocean creation to follow:
          await ewaiClient.deleteEwaiAssetAsync(ewaiUuid)
          setError(publishError || 'Publishing DDO failed.')
          Logger.error(publishError || 'Publishing DDO failed.')
          return
        }

        // Publish succeeded
        setDid(ddo.id)
        oceanDid = ddo.id
      }

      // now update the EWAI Asset to use the proper Ocean Did:
      // NOTE: this call better not fail...not sure how we'd cleanup all the Ocean creation steps above!!
      if (oceanDid) {
        const ewaiUpdateAsset = await ewaiClient.setEwaiAssetExternalDidAsync(
          ewaiUuid,
          oceanDid
        )
      }

      setSuccess(
        '🎉 Successfully published. 🎉 Now create a price on your data set.'
      )

      // just to help debug, don't reset the form if in dev/debug mode:
      // remember Skip Ocean should never be true in production
      if (!skipOcean) {
        resetForm()
      }
    } catch (error) {
      // something bad went wrong somewhere, delete any EWAI
      // asset that was created (if any)
      const s = JSON.stringify(error)
      if (ewaiUuid) {
        try {
          await ewaiClient.deleteEwaiAssetAsync(ewaiUuid)
        } catch {}
      }
      if (error.message.toString().indexOf('status code 400') !== -1) {
        setError(JSON.stringify(error))
      } else {
        setError(error.message)
      }
      Logger.error(error.message)
    }
  }

  return isInPurgatory && purgatoryData ? null : (
    <Formik
      initialValues={initialValues}
      initialStatus="empty"
      validationSchema={validationSchema}
      onSubmit={async (values, { resetForm }) => {
        // move user's focus to top of screen
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
        // kick off publishing
        await handleSubmit(values, resetForm)
      }}
    >
      {({ values }) => (
        <>
          <Persist name={formName} ignoreFields={['isSubmitting']} />

          {hasFeedback ? (
            <MetadataFeedback
              title="Publishing Energy Data Set"
              error={error}
              success={success}
              loading={publishStepText}
              setError={setError}
              successAction={{
                name: 'Go to data set →',
                to: `/asset/${did}`
              }}
            />
          ) : (
            <>
              <Alert
                text={content.warning}
                state="info"
                className={styles.alert}
              />
              <article className={styles.grid}>
                <FormPublish content={content.form} />

                <aside>
                  <div className={styles.sticky}>
                    <MetadataPreview values={values} />
                    <Web3Feedback />
                  </div>
                </aside>
              </article>
            </>
          )}

          {debug === true && <Debug values={values} />}
        </>
      )}
    </Formik>
  )
}
