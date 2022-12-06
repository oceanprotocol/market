import * as isIPFS from 'is-ipfs'

export function isCID(value: string) {
  return isIPFS.cid(value)
}
