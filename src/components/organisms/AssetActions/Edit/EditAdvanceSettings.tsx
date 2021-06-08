import { Formik } from 'formik'
import React, { ReactElement, useState } from 'react'
import { useAsset } from '../../../../providers/Asset'
import { useUserPreferences } from '../../../../providers/UserPreferences'
import styles from './index.module.css'
import { Logger, CredentialType } from '@oceanprotocol/lib'
import MetadataFeedback from '../../../molecules/MetadataFeedback'
import { graphql, useStaticQuery } from 'gatsby'
import { useWeb3 } from '../../../../providers/Web3'
import { useOcean } from '../../../../providers/Ocean'
import FormAdvanceSettings from './FormAdvanceSettings'
import {
  AdvanceSettingsForm,
  getInitialValues,
  validationSchema
} from '../../../../models/FormEditCredential'
import DebugEditAdvanceSettings from './DebugEditAdvanceSettings'
import { useSiteMetadata } from '../../../../hooks/useSiteMetadata'

const contentQuery = graphql`
  query EditAvanceSettingsQuery {
    content: allFile(
      filter: { relativePath: { eq: "pages/editAdvanceSettings.json" } }
    ) {
      edges {
        node {
          childPagesJson {
            description
            form {
              success
              successAction
              error
              data {
                name
                placeholder
                label
                help
                type
              }
            }
          }
        }
      }
    }
  }
`

export default function EditAdvanceSettings({
  setShowEdit
}: {
  setShowEdit: (show: boolean) => void
}): ReactElement {
  const data = useStaticQuery(contentQuery)
  const content = data.content.edges[0].node.childPagesJson

  const { debug } = useUserPreferences()
  const { accountId } = useWeb3()
  const { ocean } = useOcean()
  const { metadata, ddo, refreshDdo, price } = useAsset()
  const [success, setSuccess] = useState<string>()
  const [error, setError] = useState<string>()
  const { appConfig } = useSiteMetadata()

  const hasFeedback = error || success

  let credentialType: CredentialType
  switch (appConfig.credentialType) {
    case 'address':
      credentialType = CredentialType.address
      break
    case 'credential3Box':
      credentialType = CredentialType.credential3Box
      break
    default:
      credentialType = CredentialType.address
  }

  async function handleSubmit(
    values: Partial<AdvanceSettingsForm>,
    resetForm: () => void
  ) {
    try {
      const ddoEditedCredential = await ocean.assets.updateCredentials(
        ddo,
        credentialType,
        values.allowCredentail,
        [] // TODO: denyCredential
      )

      const storedddo = await ocean.assets.updateMetadata(
        ddoEditedCredential,
        accountId
      )

      if (!storedddo) {
        setError(content.form.error)
        Logger.error(content.form.error)
        return
      } else {
        setSuccess(content.form.success)
        resetForm()
      }
    } catch (error) {
      Logger.error(error.message)
      setError(error.message)
    }
  }

  return (
    <Formik
      initialValues={getInitialValues(ddo, credentialType)}
      validationSchema={validationSchema}
      onSubmit={async (values, { resetForm }) => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
        await handleSubmit(values, resetForm)
      }}
    >
      {({ isSubmitting, values, initialValues }) =>
        isSubmitting || hasFeedback ? (
          <MetadataFeedback
            title="Updating Data Set"
            error={error}
            success={success}
            setError={setError}
            successAction={{
              name: content.form.successAction,
              onClick: async () => {
                await refreshDdo()
                setShowEdit(false)
              }
            }}
          />
        ) : (
          <>
            <p className={styles.description}>{content.description}</p>
            <article className={styles.grid}>
              <FormAdvanceSettings
                data={content.form.data}
                setShowEdit={setShowEdit}
              />
            </article>

            {debug === true && (
              <div className={styles.grid}>
                <DebugEditAdvanceSettings
                  values={values}
                  ddo={ddo}
                  credentialType={credentialType}
                />
              </div>
            )}
          </>
        )
      }
    </Formik>
  )
}
