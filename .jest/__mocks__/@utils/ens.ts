export async function getEnsName() {
  return 'test.ens.eth'
}

export async function getEnsAvatar() {
  return 'https://metadata.ens.domains/mainnet/avatar/test.ens.eth'
}

export async function getEnsProfile() {
  return {
    name: 'test.ens.eth',
    url: 'https://demo.com',
    avatar: 'https://metadata.ens.domains/mainnet/avatar/test.ens.eth',
    description: 'test.ens.eth'
  }
}
