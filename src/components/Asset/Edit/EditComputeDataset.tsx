import { useWeb3 } from '@context/Web3'
import { Formik } from 'formik'
import React, { ReactElement, useState } from 'react'
import FormEditComputeDataset from './FormEditComputeDataset'
import {
  LoggerInstance,
  ServiceComputeOptions,
  Service,
  Asset
} from '@oceanprotocol/lib'
import { useUserPreferences } from '@context/UserPreferences'
import styles from './index.module.css'
import Web3Feedback from '@shared/Web3Feedback'
import { useCancelToken } from '@hooks/useCancelToken'
import {
  getComputeSettingsInitialValues,
  computeSettingsValidationSchema
} from './_constants'
import content from '../../../../content/pages/editComputeDataset.json'
import { AssetExtended } from 'src/@types/AssetExtended'
import { getServiceByName } from '@utils/ddo'
import { setMinterToPublisher, setMinterToDispenser } from '@utils/dispenser'
import { transformComputeFormToServiceComputeOptions } from '@utils/compute'
import { useAbortController } from '@hooks/useAbortController'
import DebugEditCompute from './DebugEditCompute'
import { useAsset } from '@context/Asset'
import EditFeedback from './EditFeedback'
import { setNftMetadata } from '@utils/nft'
import { ComputeEditForm } from './_types'

export default function EditComputeDataset({
  asset
}: {
  asset: AssetExtended
}): ReactElement {
  const { debug } = useUserPreferences()
  const { accountId, web3 } = useWeb3()
  const { fetchAsset, isAssetNetwork } = useAsset()
  const [success, setSuccess] = useState<string>()
  const [error, setError] = useState<string>()
  const newAbortController = useAbortController()
  const newCancelToken = useCancelToken()
  const hasFeedback = error || success

  async function handleSubmit(values: ComputeEditForm, resetForm: () => void) {
    try {
      if (asset?.accessDetails?.type === 'free') {
        const tx = await setMinterToPublisher(
          web3,
          asset?.accessDetails?.addressOrId,
          asset?.accessDetails?.datatoken?.address,
          accountId,
          setError
        )
        if (!tx) return
      }
      const newComputeSettings: ServiceComputeOptions =
        await transformComputeFormToServiceComputeOptions(
          values,
          asset.services[0].compute,
          asset.chainId,
          newCancelToken()
        )

      LoggerInstance.log(
        '[edit compute settings]  newComputeSettings',
        newComputeSettings
      )

      const updatedService: Service = {
        ...asset.services[0],
        compute: newComputeSettings
      }

      LoggerInstance.log(
        '[edit compute settings]  updatedService',
        updatedService
      )

      const updatedAsset: Asset = {
        ...asset,
        services: [updatedService]
      }

      const setMetadataTx = await setNftMetadata(
        updatedAsset,
        accountId,
        web3,
        newAbortController()
      )

      LoggerInstance.log('[edit] setMetadata result', setMetadataTx)

      if (!setMetadataTx) {
        setError(content.form.error)
        LoggerInstance.error(content.form.error)
        return
      } else {
        if (asset.accessDetails.type === 'free') {
          const tx = await setMinterToDispenser(
            web3,
            asset?.accessDetails?.datatoken?.address,
            accountId,
            setError
          )
          if (!tx) return
        }
      }
      // Edit succeeded
      setSuccess(content.form.success)
      resetForm()
    } catch (error) {
      LoggerInstance.error(error.message)
      setError(error.message)
    }
  }

  return (
    <Formik
      initialValues={getComputeSettingsInitialValues(
        getServiceByName(asset, 'compute')?.compute
      )}
      validationSchema={computeSettingsValidationSchema}
      onSubmit={async (values, { resetForm }) => {
        // move user's focus to top of screen
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
        // kick off editing
        await handleSubmit(values, resetForm)
      }}
      enableReinitialize
    >
      {({ values, isSubmitting }) =>
        isSubmitting || hasFeedback ? (
          <EditFeedback
            loading="Updating data set with new compute settings..."
            error={error}
            success={success}
            setError={setError}
            successAction={{
              name: 'Back to Asset',
              onClick: async () => {
                await fetchAsset()
              },
              to: `/asset/${asset.id}`
            }}
          />
        ) : (
          <>
            <FormEditComputeDataset />
            <Web3Feedback
              networkId={asset?.chainId}
              isAssetNetwork={isAssetNetwork}
            />
            {debug === true && (
              <div className={styles.grid}>
                <DebugEditCompute values={values} asset={asset} />
              </div>
            )}
          </>
        )
      }
    </Formik>
  )
}
