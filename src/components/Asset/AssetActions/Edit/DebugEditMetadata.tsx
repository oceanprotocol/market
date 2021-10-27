import { DDO } from '@oceanprotocol/lib'
// import React, { ReactElement } from 'react'
// import { transformPublishFormToMetadata } from '@utils/metadata'
// import DebugOutput from '@shared/DebugOutput'
// import { FormPublishData } from '../../../Publish/_types'

// export default function Debug({
//   values,
//   ddo
// }: {
//   values: Partial<FormPublishData>
//   ddo: DDO
// }): ReactElement {
//   const newDdo = {
//     '@context': 'https://w3id.org/did/v1',
//     service: [
//       {
//         index: 0,
//         type: 'metadata',
//         attributes: { ...transformPublishFormToMetadata(values, ddo) }
//       }
//     ]
//   }

//   return (
//     <>
//       <DebugOutput title="Collected Form Values" output={values} />
//       <DebugOutput title="Transformed DDO Values" output={newDdo} />
//     </>
//   )
// }
