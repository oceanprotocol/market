import React, { ReactElement } from 'react'
import styles from './enrol.module.css'
import { useEwaiInstance } from '../../../ewai/client/ewai-js'

const NoLinkSection = ({ title, text }: { title: string; text: string }) => {
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>{title}:</h3>
      <ol>
        <li style={{ listStyleType: 'disc' }}>{text}</li>
      </ol>
    </div>
  )
}

const LinksSection = ({
  title,
  links
}: {
  title: string
  links: [{ text: string; url: string; blank: boolean }]
}) => {
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>{title}:</h3>
      <ol>
        {links.map((link, idx) => (
          <li style={{ listStyleType: 'disc' }} key={idx}>
            <a href={link.url} target={link.blank ? '_blank' : '_self'}>
              {link.text}
            </a>
          </li>
        ))}
      </ol>
    </div>
  )
}

function clickSignup(url: string) {
  const win = window.open(url, '_blank')
  win.focus()
}

interface EnrolPageContent {
  content: {
    title: string
    description: string
    warning: string
    infolinks: [
      {
        title: string
        links: [{ text: string; url: string; blank: boolean }]
      }
    ]
  }
}

export default function EnrolPage({
  content // content comes from the enrol.tsx EnrolPageQuery
}: EnrolPageContent): ReactElement {
  const ewaiInstance = useEwaiInstance()
  return (
    <>
      {/*       <Alert text={content.warning} state="info" className={styles.alert} />
      <br />
      <br /> */}
      <div>
        <p>{content.description}</p>
      </div>
      <NoLinkSection title="Marketplace Name (EWNS)" text={ewaiInstance.name} />
      <NoLinkSection
        title="Publish Role Required (EWNS)"
        text={ewaiInstance.marketplacePublishRole}
      />
      <div style={{ textAlign: 'center' }}>
        <button
          className="Button-module--button--XbPwb Button-module--primary--3zvkW"
          type="submit"
          onClick={() => {
            clickSignup(ewaiInstance.marketplacePublishRoleEnrolUrl)
          }}
        >
          ENROL IN SWITCHBOARD
        </button>
      </div>
      {content.infolinks.map((section) => (
        <LinksSection title={section.title} links={section.links} />
      ))}
    </>
  )
}
