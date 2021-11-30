interface Credential {
  type: string
  values: string[]
}

interface Credentials {
  allow: Credential[]
  deny: Credential[]
}
