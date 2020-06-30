import { NextApiRequest, NextApiResponse } from 'next'
import axios, { AxiosResponse } from 'axios'
import siteConfig from '../../../site.config'

async function redeploy(
  req: NextApiRequest
): Promise<AxiosResponse | undefined | string> {
  // Cancel if we are not on live
  if (req.headers.host !== siteConfig.url) return ''
  console.log('not canceled', req)
  try {
    // Trigger new `master` deployment with Deploy Hook
    const newDeployment = await axios.post(
      'https://api.zeit.co/v1/integrations/deploy/Qmd5YCS9PCCCqn4mjgVR3vGkYWNmEB5UnAzhnjZiGbMCKa/Q6viwRoT4V'
    )
    return newDeployment
  } catch (error) {
    console.error(error.message)
  }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'POST':
      res.status(200).json(await redeploy(req))
      break
    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
