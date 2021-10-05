import {
  CredentialAction,
  Credential,
  Credentials,
  CredentialType,
  DDO
} from '@oceanprotocol/lib'
import * as Yup from 'yup'

export interface AdvancedSettingsForm {
  allow: string[]
  deny: string[]
  isOrderDisabled: boolean
}

export const validationSchema: Yup.SchemaOf<AdvancedSettingsForm> =
  Yup.object().shape({
    allow: Yup.array().nullable(),
    deny: Yup.array().nullable(),
    isOrderDisabled: Yup.boolean().nullable()
  })

function getCredentialList(
  credential: Credential[],
  credentialType: CredentialType
): string[] {
  const credentialByType = credential.find(
    (credential) => credential.type === credentialType
  )
  return credentialByType &&
    credentialByType.values &&
    credentialByType.values.length > 0
    ? credentialByType.values
    : []
}

function getAssetCredentials(
  credentials: Credentials,
  credentialType: CredentialType,
  credentialAction: CredentialAction
): string[] {
  if (!credentials) return []

  if (credentialAction === 'allow') {
    return credentials.allow
      ? getCredentialList(credentials.allow, credentialType)
      : []
  }
  return credentials.deny
    ? getCredentialList(credentials.deny, credentialType)
    : []
}

export function getInitialValues(
  ddo: DDO,
  credentailType: CredentialType
): AdvancedSettingsForm {
  const allowCredential = getAssetCredentials(
    ddo.credentials,
    credentailType,
    'allow'
  )
  const denyCredential = getAssetCredentials(
    ddo.credentials,
    credentailType,
    'deny'
  )
  const metadata = ddo.findServiceByType('metadata')
  return {
    allow: allowCredential,
    deny: denyCredential,
    isOrderDisabled: metadata.attributes?.status?.isOrderDisabled || false
  }
}
