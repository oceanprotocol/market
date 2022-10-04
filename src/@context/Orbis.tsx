import React, {
  useContext,
  createContext,
  useState,
  useEffect,
  ReactNode,
  ReactElement
} from 'react'
import { sleep } from '@utils/index'
import { Orbis } from '@orbisclub/orbis-sdk'
import { useWeb3 } from './Web3'

const OrbisContext = createContext(null)

function OrbisProvider({ children }: { children: ReactNode }): ReactElement {
  const { web3Provider } = useWeb3()
  const [orbis, setOrbis] = useState<OrbisInterface>()
  const [account, setAccount] = useState<OrbisAccountInterface>()

  // Connecting to Orbis
  const connectOrbis = async (provider: object): Promise<void> => {
    if (!orbis) return

    const res = await orbis.connect(provider)
    if (res.status !== 200) {
      await sleep(2000)
      connectOrbis(provider)
    } else {
      setAccount(res)
    }
  }

  const checkConnection = async (): Promise<void> => {
    const res = await orbis.isConnected()

    if (res.status === 200) {
      setAccount(res)
    } else {
      connectOrbis(web3Provider)
    }
  }

  // Init Orbis
  useEffect(() => {
    const _orbis = new Orbis()
    setOrbis(_orbis)
  }, [])

  // Check if already connected to orbis
  // useEffect(() => {
  //   if (!orbis) return

  //   const isConnected = async (): Promise<void> => {
  //     const res = await orbis.isConnected()

  //     if (res.status !== 200) {
  //       await sleep(2000)
  //       isConnected()
  //     } else {
  //       setAccount(res)
  //     }
  //   }

  //   isConnected()
  // }, [orbis])

  // Check if wallet connected
  useEffect(() => {
    if (!account && orbis && web3Provider) {
      checkConnection()
    }
  }, [account, orbis, web3Provider])

  return (
    <OrbisContext.Provider value={{ orbis, account, connectOrbis }}>
      {children}
    </OrbisContext.Provider>
  )
}

const useOrbis = () => {
  return useContext(OrbisContext)
}

export { OrbisProvider, useOrbis }
