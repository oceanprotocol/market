import { Formik } from 'formik'
import React, { ReactElement, useState } from 'react'
import { useAsset } from '../../../../providers/Asset'
import { useUserPreferences } from '../../../../providers/UserPreferences'
import styles from './index.module.css'
import { Logger, CredentialType, DDO } from '@oceanprotocol/lib'
import MetadataFeedback from '../../../molecules/MetadataFeedback'
import { graphql, useStaticQuery } from 'gatsby'
import { useWeb3 } from '../../../../providers/Web3'
import { useOcean } from '../../../../providers/Ocean'
import FormAdvancedSettings from './FormAdvancedSettings'
import {
  AdvancedSettingsForm,
  getInitialValues,
  validationSchema
} from '../../../../models/FormEditCredential'
import DebugEditCredential from './DebugEditAdvancedSettings'
import { useSiteMetadata } from '../../../../hooks/useSiteMetadata'

const contentQuery = graphql`
  query EditAvanceSettingsQuery {
    content: allFile(
      filter: { relativePath: { eq: "pages/editAdvancedSettings.json" } }
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
                options
              }
            }
          }
        }
      }
    }
  }
`

function getDefaultCredentialType(credentialType: string): CredentialType {
  switch (credentialType) {
    case 'address':
      return CredentialType.address
    case 'credential3Box':
      return CredentialType.credential3Box
    default:
      return CredentialType.address
  }
}

export default function EditAdvancedSettings({
  setShowEdit
}: {
  setShowEdit: (show: boolean) => void
}): ReactElement {
  const data = useStaticQuery(contentQuery)
  const content = data.content.edges[0].node.childPagesJson

  const { debug } = useUserPreferences()
  const { accountId } = useWeb3()
  const { ocean } = useOcean()
  const { metadata, ddo, refreshDdo } = useAsset()
  const [success, setSuccess] = useState<string>()
  const [error, setError] = useState<string>()
  const { appConfig } = useSiteMetadata()

  const hasFeedback = error || success

  const credentialType = getDefaultCredentialType(appConfig.credentialType)

  async function handleSubmit(
    values: Partial<AdvancedSettingsForm>,
    resetForm: () => void
  ) {
    try {
      let newDdo: DDO
      newDdo = await ocean.assets.updateCredentials(
        ddo,
        credentialType,
        values.allow,
        values.deny
      )

      newDdo = await ocean.assets.editMetadata(newDdo, {
        status: {
          isOrderDisabled: values.isOrderDisabled
        }
      })

      const storedddo = await ocean.assets.updateMetadata(newDdo, accountId)

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
      {({ isSubmitting, values }) =>
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
              <FormAdvancedSettings
                data={content.form.data}
                setShowEdit={setShowEdit}
              />
            </article>

            {debug === true && (
              <div className={styles.grid}>
                <DebugEditCredential
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
