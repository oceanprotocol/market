import {
  CredentialAction,
  Credential,
  Credentials,
  CredentialType,
  DDO
} from '@oceanprotocol/lib'
import * as Yup from 'yup'

export interface AdvanceSettingsForm {
  allow: string[]
  deny: string[]
  isOrderDisabled: boolean
}

export const validationSchema: Yup.SchemaOf<AdvanceSettingsForm> =
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
  return credentialByType.value && credentialByType.value.length > 0
    ? credentialByType.value
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
): AdvanceSettingsForm {
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
