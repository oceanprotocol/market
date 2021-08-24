import { useStaticQuery, graphql } from 'gatsby'

import React, { ReactElement } from 'react'
import Button from '../atoms/Button'
import Container from '../atoms/Container'
import styles from './HomeIntro.module.css'
import { ReactComponent as Globe } from '../../images/network-globe.svg'
import Permission from '../organisms/Permission'
import { SectionQueryResult } from '../pages/Home'

const query = graphql`
{
    file(absolutePath: {regex: "/intro\\.json/"}) {
      childIndexJson {
        intro {
          teaser {
            title
            text
            cta
          }
          paragraphs {
            title
            body
          }
        }
      }
    }
  }
`

const queryDemonstrators = {
  page: 1,
  offset: 2,
  query: {
    query_string: {
      query:
        'id:did\\:op\\:Dd64fD4Ff847A2FBEC2596E7A58fbB439654acB5 id:did\\:op\\:55D7212b58a04D8D24a2B302D749ADEF83B4a7d3'
    }
  },
  sort: { created: -1 }
}

interface HomeIntroData {
  file: {
    childIndexJson: {
      intro: {
        teaser: {
          title: string
          text: string
          cta: string
        }
        paragraphs: {
          title: string
          body: string
        }[]
      }
    }
  }
}

export default function HomeIntro(): ReactElement {
  const data: HomeIntroData = useStaticQuery(query)
  const { paragraphs, teaser } = data.file.childIndexJson.intro

  return (
    <div className={styles.introWrapper}>
      <Container>
        <div className={styles.intro}>
          <div className={styles.left}>
            {paragraphs.map((paragraph) => (
              <div key={paragraph.title} className={styles.paragraph}>
                <h2>{paragraph.title}</h2>
                <p>{paragraph.body}</p>
              </div>
            ))}
          </div>
          <div className={styles.spacer} />
          <div className={styles.right}>
            <Globe className={styles.globe} />
            <Permission eventType="browse">
              <SectionQueryResult
                className="demonstrators"
                title=""
                query={queryDemonstrators}
                assetListClassName={styles.demonstrators}
              />
            </Permission>
            <h2>{teaser.title}</h2>
            <p>{teaser.text}</p>
            <Button style="primary" className={styles.button} to="#">
              {teaser.cta}
            </Button>
          </div>
        </div>
      </Container>
    </div>
  )
}
