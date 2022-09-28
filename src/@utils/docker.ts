import { LoggerInstance } from '@oceanprotocol/lib'
import axios from 'axios'
import isUrl from 'is-url-superb'
import { toast } from 'react-toastify'

export interface dockerContainerInfo {
  exists: boolean
  checksum: string
}

async function getDockerHubImageChecksum(
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
        'Could not fetch docker hub image info. Please check container image and tag and try again'
      )
      return containerInfo
    }
    containerInfo.exists = true
    containerInfo.checksum = response.data.result.checksum
    return containerInfo
  } catch (error) {
    LoggerInstance.error(error.message)
    toast.error(
      'Could not fetch docker hub image info. Please check container image and tag and try again'
    )
    return containerInfo
  }
}

async function validateContainerImageUrl(
  imageURL: string
): Promise<dockerContainerInfo> {
  const containerInfo: dockerContainerInfo = {
    exists: false,
    checksum: null
  }
  try {
    const response = await axios.head(imageURL)
    if (!response || response.status !== 200) {
      toast.error(
        'Could not fetch docker image info. Please check URL and try again'
      )
      return containerInfo
    }
    containerInfo.exists = true
    return containerInfo
  } catch (error) {
    LoggerInstance.error(error.message)
    toast.error(
      'Could not fetch docker image info. Please check URL and try again'
    )
    return containerInfo
  }
}

export async function getContainerChecksum(
  dockerImage: string,
  tag: string
): Promise<dockerContainerInfo> {
  const isValid = isUrl(dockerImage)
    ? await validateContainerImageUrl(dockerImage)
    : await getDockerHubImageChecksum(dockerImage, tag)
  return isValid
}
