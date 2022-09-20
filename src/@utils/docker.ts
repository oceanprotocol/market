import { LoggerInstance } from '@oceanprotocol/lib'
import axios from 'axios'
import { toast } from 'react-toastify'

export async function getContainerChecksum(
  image: string,
  tag: string
): Promise<string> {
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
        'Could not fetch docker hub image info. Please input the container checksum manually'
      )
      return null
    }
    return response.data.result.checksum
  } catch (error) {
    LoggerInstance.error(error.message)
    toast.error(
      'Could not fetch docker hub image info. Please input the container checksum manually'
    )
    return null
  }
}
