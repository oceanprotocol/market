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
  return credentialByType?.values || []
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

function generateCredential(
  credentialType: string,
  value: string[]
): Credential {
  return {
    type: credentialType,
    values: value
  }
}

function isCredentialTypeExist(
  credentials: Credential[],
  credentialType: string
): boolean {
  const credentialTypes = credentials
    ? credentials.map((credential) => credential.type)
    : []
  return credentialTypes.indexOf(credentialType) !== -1
}

export function updateCredential(
  credentials: Credential[],
  credentialType: string,
  value: string[]
): Credential[] {
  if (!credentials) {
    credentials = [generateCredential(credentialType, value)]
    return credentials
  }
  if (!isCredentialTypeExist(credentials, credentialType)) {
    credentials.push(generateCredential(credentialType, value))
    return credentials
  }
  credentials.forEach((credential) => {
    if (credential.type === credentialType) {
      credential.values = value
    }
  })
  return credentials
}
