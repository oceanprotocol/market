/* eslint-disable prettier/prettier */
import { useAsset } from '@context/Asset'
import React from 'react'
import styles from './index.module.css'
import Copy from '@shared/atoms/Copy'
import { LoggerInstance } from '@oceanprotocol/lib'
import { accountTruncate, endpointTruncate } from '@utils/web3'
import Input from '@shared/FormInput'

export default function StreamSubs() {
  const { asset } = useAsset()
  LoggerInstance.log('asset_:', asset)
  const endpointFormatted = endpointTruncate(asset)

  return (
    <div className={styles.stats}>
      <label className={styles.label}>Datastream EndPoint</label>
      <section className={styles.endpoint}>
        <Input
          type="text"
          value={endpointFormatted}
          // readOnly={true}
          onChange={() => {}}
          // disabled={true}
          // prefix={accountTruncate(`${asset.services[0].streamFiles}`)}
        />
      </section>
    </div>
  )

  // return (
  //   <footer className={styles.stats}>
  //     {!asset ||
  //       !asset?.accessDetails ||
  //       !asset?.accessDetails?.validOrderTx ? (
  //       ''
  //     ) : (
  //       <>
  //         {asset?.metadata?.type === 'datastream' && (
  //           <div>
  //             <label className={styles.label}>Datastream EndPoint</label>
  //             <div>
  //               <section className={styles.endpoint}>
  //                 <Input
  //                   type="text"
  //                   value={endpointFormatted}
  //                   // readOnly={true}
  //                   onChange={() => { }}
  //                 // disabled={true}
  //                 // prefix={accountTruncate(`${asset.services[0].streamFiles}`)}
  //                 />

  //               </section>
  //             </div>
  //           </div>
  //         )}
  //       </>
  //     )}
  //   </footer>
  // )
}
