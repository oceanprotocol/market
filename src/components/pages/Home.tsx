import React from 'react'
import Link from 'next/link'
import shortid from 'shortid'
import Layout from '../../Layout'
import Button from '../atoms/Button'
import SearchBar from '../molecules/SearchBar'
import { title, description } from '../../../site.config'
import Explore from '../../images/explore.svg'
import Publish from '../../images/publish.svg'
import DataPool from '../../images/datapool.svg'
import styles from './Home.module.css'

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

const HomePage = () => {
  return (
    <Layout noPageHeader>
      <header className={styles.header}>
        <h1>{title}</h1>
        <h2>{description}</h2>
        <SearchBar large />
      </header>

      <div className={styles.actions}>
        {actions.map(action => (
          <Link key={shortid.generate()} href={action.link}>
            <a
              className={action.comingSoon ? styles.comingSoon : styles.action}
            >
              {action.icon}
              <h3 className={styles.actionTitle}>{action.title}</h3>
              <p>{action.text}</p>
              <Button primary={action.primary}>{action.action}</Button>
            </a>
          </Link>
        ))}
      </div>
    </Layout>
  )
}
export default HomePage
