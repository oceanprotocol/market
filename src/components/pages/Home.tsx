import React from 'react'
import { Link } from 'gatsby'
import shortid from 'shortid'
import Layout from '../../components/Layout'
import Button from '../atoms/Button'
import SearchBar from '../molecules/SearchBar'
import Explore from '../../images/explore.svg'
import Publish from '../../images/publish.svg'
import DataPool from '../../images/datapool.svg'
import styles from './Home.module.css'
import { useSiteMetadata } from '../../hooks/useSiteMetadata'

const actions = [
  {
    title: 'Explore Data Sets',
    text: 'Browse and consume a wide range of logistics data.',
    link: '/explore',
    action: 'Explore Now',
    icon: <Explore />
  },
  {
    title: 'Monetize Your Data',
    text: 'Publish and monetize on your data to open up new revenue streams.',
    link: '/publish',
    action: 'Publish Data',
    icon: <Publish />,
    primary: true
  },
  {
    title: 'Data Pool',
    text: 'Create or join data pools to generate more revenue.',
    link: '/',
    action: 'Coming Soon',
    icon: <DataPool />,
    comingSoon: true
  }
]

export default function HomePage() {
  const { siteTitle, siteDescription } = useSiteMetadata()

  return (
    <Layout noPageHeader>
      <header className={styles.header}>
        <h1>{siteTitle}</h1>
        <h2>{siteDescription}</h2>
        <SearchBar large />
      </header>

      <div className={styles.actions}>
        {actions.map((action) => (
          <Link key={shortid.generate()} to={action.link}>
            <a
              className={action.comingSoon ? styles.comingSoon : styles.action}
            >
              {action.icon}
              <h3 className={styles.actionTitle}>{action.title}</h3>
              <p>{action.text}</p>
              <Button style={action.primary ? 'primary' : null}>
                {action.action}
              </Button>
            </a>
          </Link>
        ))}
      </div>
    </Layout>
  )
}
