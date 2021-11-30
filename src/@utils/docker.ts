import { Logger } from '@oceanprotocol/lib'
import axios from 'axios'
import isUrl from 'is-url-superb'
import { toast } from 'react-toastify'

async function isDockerHubImageValid(
  image: string,
  tag: string
): Promise<boolean> {
  try {
    const response = await axios.post(
      `https://dockerhub-proxy.oceanprotocol.com`,
      { image, tag }
    )
    if (
      !response ||
      response.status !== 200 ||
      response.data.status !== 'success'
    ) {
      toast.error(
        'Could not fetch docker hub image info. Please check image name and tag and try again'
      )
      return false
    }

    return true
  } catch (error) {
    Logger.error(error.message)
    toast.error(
      'Could not fetch docker hub image info. Please check image name and tag and try again'
    )
    return false
  }
}

async function is3rdPartyImageValid(imageURL: string): Promise<boolean> {
  try {
    const response = await axios.head(imageURL)
    if (!response || response.status !== 200) {
      toast.error(
        'Could not fetch docker image info. Please check URL and try again'
      )
      return false
    }
    return true
  } catch (error) {
    Logger.error(error.message)
    toast.error(
      'Could not fetch docker image info. Please check URL and try again'
    )
    return false
  }
}

export async function validateDockerImage(
  dockerImage: string,
  tag: string
): Promise<boolean> {
  const isValid = isUrl(dockerImage)
    ? await is3rdPartyImageValid(dockerImage)
    : await isDockerHubImageValid(dockerImage, tag)
  return isValid
}
