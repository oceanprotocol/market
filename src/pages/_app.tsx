// import App from "next/app";
import React, { ReactElement } from 'react'
import type { AppProps /*, AppContext */ } from 'next/app'
import Web3Provider from '@context/Web3'
import { UserPreferencesProvider } from '@context/UserPreferences'
import PricesProvider from '@context/Prices'
import UrqlProvider from '@context/UrqlProvider'
import ConsentProvider from '@context/CookieConsent'
import App from 'src/components/App'

<<<<<<< HEAD:src/pages/_app.tsx
import '@oceanprotocol/typographies/css/ocean-typo.css'
import '../stylesGlobal/styles.css'

function MyApp({ Component, pageProps }: AppProps): ReactElement {
=======
// Referenced in gatsby-browser.js & gatsby-ssr.js
export default function ContextProviders({
  element
}: {
  element: ReactElement
}): ReactElement {
>>>>>>> 4a56991b (more refactor):src/components/App/ContextProviders.tsx
  return (
    <Web3Provider>
      <UrqlProvider>
        <UserPreferencesProvider>
          <PricesProvider>
            <ConsentProvider>
              <App>
                <Component {...pageProps} />
              </App>
            </ConsentProvider>
          </PricesProvider>
        </UserPreferencesProvider>
      </UrqlProvider>
    </Web3Provider>
  )
}

export default MyApp
