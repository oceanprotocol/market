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

const OrbisContext = createContext(null)

function OrbisProvider({ children }: { children: ReactNode }): ReactElement {
  const [orbis, setOrbis] = useState<OrbisInterface>()
  const [account, setAccount] = useState<AccountInterface>()

  // Connecting to Orbis
  const connectOrbis = async (): Promise<void> => {
    if (!orbis) return

    const res = await orbis.connect()
    if (res.status !== 200) {
      await sleep(2000)
      connectOrbis()
    } else {
      setAccount(res)
    }
  }

  // Init Orbis
  useEffect(() => {
    const _orbis = new Orbis()
    setOrbis(_orbis)
  }, [])

  // Check if already has ceramic-session
  useEffect(() => {
    if (!orbis) return

    const isConnected = async (): Promise<void> => {
      const res = await orbis.isConnected()

      if (res.status !== 200) {
        await sleep(2000)
        isConnected()
      } else {
        setAccount(res)
      }
    }

    isConnected()
  }, [orbis])

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
