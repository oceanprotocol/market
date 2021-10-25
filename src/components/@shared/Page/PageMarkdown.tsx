import React, { ReactElement } from 'react'
import Page from '.'
import styles from './PageMarkdown.module.css'
import Container from '@shared/atoms/Container'
import PrivacyPolicyHeader from '../../Privacy/PrivacyHeader'

// export default function PageTemplateMarkdown(): ReactElement {
//   const { title, description } = frontmatter
//   const { slug } = fields

//   const isPrivacy = slug.includes('/privacy/')

//   return (
//     <Page title={title} description={description} uri={props.uri} headerCenter>
//       <Container narrow>
//         {isPrivacy && (
//           <PrivacyPolicyHeader
//             tableOfContents={tableOfContents}
//             policy={slug.replace('/privacy/', '')}
//           />
//         )}
//         <div
//           className={styles.content}
//           dangerouslySetInnerHTML={{ __html: html }}
//         />
//       </Container>
//     </Page>
//   )
// }
