import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const { name } = request.query
  response.end(`Hello, how are you ${name}?`)
}
