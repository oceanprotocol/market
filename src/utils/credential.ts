import { CredentialAction, Credential, Credentials } from '@oceanprotocol/lib'

export function getCredentialList(
  credential: Credential[],
  credentialType: string
): string[] {
  if (!credentialType) return []
  if (!credential) return []
  const credentialByType = credential.find(
    (credential) => credential.type === credentialType
  )
  return credentialByType &&
    credentialByType.values &&
    credentialByType.values.length > 0
    ? credentialByType.values
    : []
}

export function getAssetCredentials(
  credentials: Credentials,
  credentialType: string,
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

export function updateCredential(
  credentials: Credential[],
  credentialType: string,
  value: string[]
): Credential[] {
  const credentialTypes = credentials
    ? credentials.map((credential) => credential.type)
    : []
  const isCredntialTypesExsit = credentialTypes.indexOf(credentialType) !== -1
  if (!credentials) {
    credentials = [
      {
        type: credentialType,
        values: value
      }
    ]
    return credentials
  }
  if (!isCredntialTypesExsit) {
    credentials.push({
      type: credentialType,
      values: value
    })
    return credentials
  }
  credentials.forEach((credential) => {
    if (credential.type === credentialType) {
      credential.values = value
    }
  })
  return credentials
}
