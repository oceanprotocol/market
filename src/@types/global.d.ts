declare module '*.svg' {
  import * as React from 'react'
  export const ReactComponent: React.FunctionComponent<React.SVGProps<
    SVGSVGElement
  >>
  const src: string
  export default src
}

declare type Nullable<T> = T | null
declare module '*.md'
