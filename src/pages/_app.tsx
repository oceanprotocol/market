import React from 'react'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { DefaultSeo } from 'next-seo'
import { useRouter } from 'next/router'
import Web3Provider from '../context/Web3Provider'
import NProgress from '../components/atoms/NProgress'
import { title, description, url } from '../../site.config'
import { toast } from 'react-toastify'

// this is the place to import global css
import 'react-toastify/dist/ReactToastify.css'
import '../styles/global.css'
import '../components/atoms/NProgress.css'

export default function dexfreightApp({ Component, pageProps }: AppProps) {
  const { asPath } = useRouter()

  toast.configure()
  // Hacky workaround for mode: pure css modules disallowing any
  // css modules with :global scope. We load this as global css ideally
  // only when date picker is present which rpesently is only on the
  // /publish route.
  if (asPath.includes('/publish')) {
    require('../styles/datepicker.css')
  }

  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css?family=Montserrat:400,400i,600&display=swap"
          rel="stylesheet"
          key="google-fonts-montserrat"
        />
      </Head>
      <DefaultSeo
        title={title}
        description={description}
        canonical={`${url}${asPath}`}
        openGraph={{
          type: 'website',
          locale: 'en_US',
          images: [{ url: `${url}/share.png` }],
          // eslint-disable-next-line @typescript-eslint/camelcase
          site_name: title
        }}
        twitter={{
          handle: '@oceanprotocol',
          site: '@oceanprotocol',
          cardType: 'summary_large_image'
        }}
      />
      <NProgress />
      <Web3Provider>
        <Component {...pageProps} />
      </Web3Provider>
    </>
  )
}
