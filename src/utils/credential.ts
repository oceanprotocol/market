import { Credential } from '@oceanprotocol/lib'

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

function generateCredential(
  credentialType: string,
  values: string[]
): Credential {
  return {
    type: credentialType,
    values: values
  }
}

function removeCredential(
  credentials: Credential[],
  index: number
): Credential[] {
  credentials?.length > 1 ? credentials.splice(index, 1) : (credentials = [])
  return credentials
}

function getCredentialIndex(
  credentials: Credential[],
  credentialType: string
): number {
  const credentialTypes = credentials
    ? credentials.map((credential) => credential.type)
    : []
  return credentialTypes.indexOf(credentialType)
}

export function updateCredential(
  credentials: Credential[],
  credentialType: string,
  values: string[]
): Credential[] {
  const credentialIndex = getCredentialIndex(credentials, credentialType)
  if (!credentials) {
    credentials = [generateCredential(credentialType, values)]
    return credentials
  }
  if (credentialIndex === -1) {
    credentials.push(generateCredential(credentialType, values))
    return credentials
  }
  if (!values?.length) {
    return removeCredential(credentials, credentialIndex)
  }
  credentials[credentialIndex] = generateCredential(credentialType, values)
  return credentials
}
