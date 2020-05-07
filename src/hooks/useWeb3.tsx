import { useContext } from 'react'
import { context, Web3Context } from '../context/Web3Context'

export default function useWeb3() {
  const web3Context = useContext(context)

  if (web3Context === null) {
    throw new Error('useWeb3Context must be used in children of Web3Provider')
  }

  return web3Context as Web3Context
}
