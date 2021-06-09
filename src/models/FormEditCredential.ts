import {
  CredentialAction,
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

export const validationSchema: Yup.SchemaOf<AdvanceSettingsForm> = Yup.object().shape(
  {
    allow: Yup.array().nullable(),
    deny: Yup.array().nullable(),
    isOrderDisabled: Yup.boolean().nullable()
  }
)

function getAssetCredentials(
  credentials: Credentials,
  credentialType: CredentialType,
  credentialAction: CredentialAction
): string[] {
  let values: string[] = []
  if (credentialAction === 'allow') {
    if (credentials && credentials.allow) {
      const allowList = credentials.allow.find(
        (credential) => credential.type === credentialType
      )
      values = allowList && allowList.value.length > 0 ? allowList.value : []
    }
  } else {
    if (credentials && credentials.deny) {
      const dennyList = credentials.deny.find(
        (credential) => credential.type === credentialType
      )
      values = dennyList && dennyList.value.length > 0 ? dennyList.value : []
    }
  }
  return values
}

export function getInitialValues(
  ddo: DDO,
  credentailType: CredentialType
): AdvanceSettingsForm {
  const allowCrendtail = getAssetCredentials(
    ddo.credentials,
    credentailType,
    'allow'
  )
  const denyCrendtail = getAssetCredentials(
    ddo.credentials,
    credentailType,
    'deny'
  )
  const metadata = ddo.findServiceByType('metadata')
  return {
    allow: allowCrendtail,
    deny: denyCrendtail,
    isOrderDisabled: metadata.attributes?.status?.isOrderDisabled || false
  }
}
