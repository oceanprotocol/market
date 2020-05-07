import React, { useEffect } from 'react'
import NProgress, { NProgressOptions } from 'nprogress'
import Router from 'next/router'

//
// Component loosely taken from, but highly refactored
// https://github.com/sergiodxa/next-nprogress/blob/master/src/component.js
//

declare type NProgressContainerProps = {
  showAfterMs?: number
  options?: NProgressOptions
}

export default function NProgressContainer({
  showAfterMs = 300,
  options
}: NProgressContainerProps) {
  let timer: NodeJS.Timeout

  function routeChangeStart() {
    clearTimeout(timer)
    timer = setTimeout(NProgress.start, showAfterMs)
  }

  function routeChangeEnd() {
    clearTimeout(timer)
    NProgress.done()
  }

  useEffect(() => {
    if (options) {
      NProgress.configure(options)
    }

    Router.events.on('routeChangeStart', routeChangeStart)
    Router.events.on('routeChangeComplete', routeChangeEnd)
    Router.events.on('routeChangeError', routeChangeEnd)

    return () => {
      clearTimeout(timer)
      Router.events.off('routeChangeStart', routeChangeStart)
      Router.events.off('routeChangeComplete', routeChangeEnd)
      Router.events.off('routeChangeError', routeChangeEnd)
    }
  }, [])

  return <div />
}
