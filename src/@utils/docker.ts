import { LoggerInstance } from '@oceanprotocol/lib'
import axios from 'axios'
import { toast } from 'react-toastify'

export interface dockerContainerInfo {
  exists: boolean
  checksum: string
}

export async function getContainerChecksum(
  image: string,
  tag: string
): Promise<dockerContainerInfo> {
  const containerInfo: dockerContainerInfo = {
    exists: false,
    checksum: null
  }
  try {
    const response = await axios.post(
      `https://dockerhub-proxy.oceanprotocol.com`,
      {
        image,
        tag
      }
    )
    if (
      !response ||
      response.status !== 200 ||
      response.data.status !== 'success'
    ) {
      toast.error(
        'Could not fetch docker hub image informations. If you have it hosted in a 3rd party repository please fill in the container checksum manually.'
      )
      return containerInfo
    }
    containerInfo.exists = true
    containerInfo.checksum = response.data.result.checksum
    return containerInfo
  } catch (error) {
    LoggerInstance.error(error.message)
    toast.error(
      'Could not fetch docker hub image informations. If you have it hosted in a 3rd party repository please fill in the container checksum manually.'
    )
    return containerInfo
  }
}
