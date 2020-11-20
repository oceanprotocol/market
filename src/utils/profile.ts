// https://ipfs.3box.io/profile?address=0x4d156a2ef69ffddc55838176c6712c90f60a2285
import { Profile } from '../models/Profile'
import axios, { CancelToken } from 'axios'

const ipfsUrl = 'https://ipfs.3box.io/profile?address='

async function get3BoxProfile(
  accountId: string,
  cancelToken: CancelToken
): Promise<Profile> {
  return {} as Profile
}
