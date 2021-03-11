[![banner](https://raw.githubusercontent.com/oceanprotocol/art/master/github/repo-banner%402x.png)](https://oceanprotocol.com)

<h1 align="center">Ocean Marketplace</h1>

[![Build Status](https://github.com/oceanprotocol/market/workflows/CI/badge.svg)](https://github.com/oceanprotocol/market/actions)
[![Netlify Status](https://api.netlify.com/api/v1/badges/c85f4d8b-95e1-4010-95a4-2bacd8b90981/deploy-status)](https://app.netlify.com/sites/market-oceanprotocol/deploys)
[![Maintainability](https://api.codeclimate.com/v1/badges/d114f94f75e6efd2ee71/maintainability)](https://codeclimate.com/repos/5e3933869a31771fd800011c/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/d114f94f75e6efd2ee71/test_coverage)](https://codeclimate.com/repos/5e3933869a31771fd800011c/test_coverage)
[![js oceanprotocol](https://img.shields.io/badge/js-oceanprotocol-7b1173.svg)](https://github.com/oceanprotocol/eslint-config-oceanprotocol)

**Table of Contents**

- [🏄 Get Started](#-get-started)
  - [Local components with Barge](#local-components-with-barge)
- [🦑 Environment variables](#-environment-variables)
- [🦀 Data Sources](#-data-sources)
  - [Aquarius](#aquarius)
  - [Ocean Protocol Subgraph](#ocean-protocol-subgraph)
  - [3Box](#3box)
  - [Purgatory](#purgatory)
- [🎨 Storybook](#-storybook)
- [✨ Code Style](#-code-style)
- [👩‍🔬 Testing](#-testing)
- [🛳 Production](#-production)
- [⬆️ Deployment](#️-deployment)
- [💖 Contributing](#-contributing)
- [🏛 License](#-license)

## 🏄 Get Started

The app is a React app built with [Gatsby.js](https://www.gatsbyjs.org) + TypeScript + CSS modules and will connect to Ocean components in Rinkeby by default.

To start local development:

```bash
git clone git@github.com:oceanprotocol/market.git
cd market

npm install
npm start
```

This will start the development server under
`http://localhost:8000`.

To explore the generated GraphQL data structure fire up the accompanying GraphiQL IDE under
`http://localhost:8000/__graphql`.

### Local components with Barge

If you prefer to connect to locally running components instead of remote connections, you can spin up [`barge`](https://github.com/oceanprotocol/barge) and use a local Ganache network in another terminal before running `npm start`:

```bash
git clone git@github.com:oceanprotocol/barge.git
cd barge

# startup with local Ganache node
./start_ocean.sh
```

Barge will deploy contracts to the local Ganache node which will take some time. At the end the compiled artifacts need to be copied over to this project into `node_modules/@oceanprotocol/contracts/artifacts`. This script will do that for you:

```bash
./scripts/copy-contracts.sh
```

Finally, set environment variables to use this local connection in `.env` in the app:

```bash
# modify env variables, setting GATSBY_NETWORK="development"
cp .env.example .env

npm start
```

To use the app together with MetaMask, importing one of the accounts auto-generated by the Ganache container is the easiest way to have test ETH available. All of them have 100 ETH by default. Upon start, the `ocean_ganache_1` container will print out the private keys of multiple accounts in its logs. Pick one of them and import into MetaMask.

To fully test all [The Graph](https://thegraph.com) integrations, you have to run your own local Graph node with our [`ocean-subgraph`](https://github.com/oceanprotocol/ocean-subgraph) deployed to it. Barge does not include a local subgraph so by default, the `config.subgraphUri` is hardcoded to the Rinkeby subgraph in our [`NetworkMonitor` component](https://github.com/oceanprotocol/market/blob/main/src/helpers/NetworkMonitor.tsx).

> Cleaning all Docker images so they are fetched freshly is often a good idea to make sure no issues are caused by old or stale images: `docker system prune --all --volumes`

## 🦑 Environment variables

The `app.config.js` file is setup to prioritize environment variables for setting each Ocean component endpoint. By setting environment variables, you can easily switch between Ocean networks the app connects to, without directly modifying `app.config.js`.

For local development, you can use a `.env` file:

```bash
# modify env variables, Rinkeby is enabled by default when using those files
cp .env.example .env
```

## 🦀 Data Sources

All displayed data in the app is presented around the concept of one data set, which is a combination of:

- metadata about a data set
- the actual data set files
- the datatoken which represents the data set
- financial data connected to this datatoken, either a pool or a fixed rate exchange contract
- calculations and conversions based on financial data
- metadata about publishers

All this data then comes from multiple sources:

### Aquarius

All initial data sets and their metadata (DDO) is retrieved client-side on run-time from the [Aquarius](https://github.com/oceanprotocol/aquarius) instance for each network. All app calls to Aquarius are done with 2 internal methods which mimic the same methods in ocean.js, but allow us:

- to cancel requests when components get unmounted in combination with [axios](https://github.com/axios/axios)
- hit Aquarius as early as possible without relying on any ocean.js initialization

Aquarius runs Elasticsearch under the hood so its stored metadata can be queried with [Elasticsearch queries](https://www.elastic.co/guide/en/elasticsearch/reference/current/full-text-queries.html) like so:

```tsx
import { QueryResult } from '@oceanprotocol/lib/dist/node/metadatacache/MetadataCache'
import { queryMetadata } from '../../utils/aquarius'

const queryLatest = {
  page: 1,
  offset: 9,
  query: {
    nativeSearch: 1,
    // https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html
    query_string: { query: `-isInPurgatory:true` }
  },
  sort: { created: -1 }
}

function Component() {
  const { config } = useOcean()
  const [result, setResult] = useState<QueryResult>()

  useEffect(() => {
    if (!config?.metadataCacheUri) return
    const source = axios.CancelToken.source()

    async function init() {
      const result = await queryMetadata(
        query,
        config.metadataCacheUri,
        source.token
      )
      setResult(result)
    }
    init()

    return () => {
      source.cancel()
    }
  }, [config?.metadataCacheUri, query])

  return <div>{result}</div>
}
```

For components within a single data set view the `useAsset()` hook can be used, which in the background gets the respective metadata from Aquarius.

```tsx
import { useAsset } from '../../../providers/Asset'

function Component() {
  const { ddo } = useAsset()
  return <div>{ddo}</div>
}
```

### Ocean Protocol Subgraph

Most financial data in the market is retrieved with GraphQL from [our own subgraph](https://github.com/oceanprotocol/ocean-subgraph), rendered on top of the initial data coming from Aquarius.

The app has [Apollo Client](https://www.apollographql.com/docs/react/) setup to query the respective subgraph based on network. In any component this client can be used like so:

```tsx
import { gql, useQuery } from '@apollo/client'

const query = gql`
  query PoolLiquidity($id: ID!, $shareId: ID) {
    pool(id: $id) {
      id
      totalShares
    }
  }
`

function Component() {
  const { data } = useQuery(query, {}, pollInterval: 5000 })
  return <div>{data}</div>
}
```

### 3Box

Publishers can create a profile on [3Box Hub](https://www.3box.io/hub) and when found, it will be displayed in the app.

For this our own [3box-proxy](https://github.com/oceanprotocol/3box-proxy) is used, within the app the utility method `get3BoxProfile()` can be used to get all info:

```tsx
import get3BoxProfile from '../../../utils/profile'

function Component() {
  const [profile, setProfile] = useState<Profile>()

  useEffect(() => {
    if (!account) return
    const source = axios.CancelToken.source()

    async function get3Box() {
      const profile = await get3BoxProfile(account, source.token)
      if (!profile) return

      setProfile(profile)
    }
    get3Box()

    return () => {
      source.cancel()
    }
  }, [account])
  return (
    <div>
      {profile.emoji} {profile.name}
    </div>
  )
}
```

### Purgatory

Based on [list-purgatory](https://github.com/oceanprotocol/list-purgatory) some data sets get additional data. Within most components this can be done with the internal `useAsset()` hook which fetches data from the [market-purgatory](https://github.com/oceanprotocol/market-purgatory) endpoint in the background.

For asset purgatory:

```tsx
import { useAsset } from '../../../providers/Asset'

function Component() {
  const { isInPurgatory, purgatoryData } = useAsset()
  return isInPurgatory ? <div>{purgatoryData.reason}</div> : null
}
```

For account purgatory:

```tsx
import { useWeb3 } from '../../../providers/Web3'
import { useAccountPurgatory } from '../../../hooks/useAccountPurgatory'

function Component() {
  const { accountId } = useWeb3()
  const { isInPurgatory, purgatoryData } = useAccountPurgatory(accountId)
  return isInPurgatory ? <div>{purgatoryData.reason}</div> : null
}
```

## 🎨 Storybook

> TODO: this is broken for most components. See https://github.com/oceanprotocol/market/issues/128

[Storybook](https://storybook.js.org) is set up for this project and is used for UI development of components. Stories are created inside `src/components/` alongside each component in the form of `ComponentName.stories.tsx`.

To run the Storybook server, execute in your Terminal:

```bash
npm run storybook
```

This will launch the Storybook UI with all stories loaded under [localhost:4000](http://localhost:4000).

## ✨ Code Style

Code style is automatically enforced through [ESLint](https://eslint.org) & [Prettier](https://prettier.io) rules:

- Git pre-commit hook runs `prettier` on staged files, setup with [Husky](https://typicode.github.io/husky)
- VS Code suggested extensions and settings for auto-formatting on file save
- CI runs a linting & TypeScript typings check with `npm run lint`, and fails if errors are found

For running linting and auto-formatting manually, you can use from the root of the project:

```bash
# linting check, also runs Typescript typings check
npm run lint

# auto format all files in the project with prettier, taking all configs into account
npm run format
```

## 👩‍🔬 Testing

> TODO: this is broken and never runs in CI. See https://github.com/oceanprotocol/market/issues/128

Test suite for unit tests is setup with [Jest](https://jestjs.io) as a test runner and:

- [react-testing-library](https://github.com/kentcdodds/react-testing-library) for all React components

To run all linting and unit tests:

```bash
npm test
```

For local development, you can start the test runner in a watch mode.

```bash
npm run test:watch
```

For analyzing the generated JavaScript bundle sizes you can use:

```bash
npm run analyze
```

## 🛳 Production

To create a production build, run from the root of the project:

```bash
npm run build
# serve production build
npm run serve
```

## ⬆️ Deployment

Every branch or Pull Request is automatically deployed to multiple hosts for redundancy and emergency reasons:

- [Netlify](https://netlify.com)
- [Vercel](https://vercel.com)
- [S3](https://aws.amazon.com/s3/)

A link to a preview deployment will appear under each Pull Request.

The latest deployment of the `main` branch is automatically aliased to `market.oceanprotocol.com`, where the deployment on Netlify is the current live deployment.

## 💖 Contributing

We welcome contributions in form of bug reports, feature requests, code changes, or documentation improvements. Have a look at our contribution documentation for instructions and workflows:

- [**Ways to Contribute →**](https://docs.oceanprotocol.com/concepts/contributing/)
- [Code of Conduct →](https://docs.oceanprotocol.com/concepts/code-of-conduct/)
- [Reporting Vulnerabilities →](https://docs.oceanprotocol.com/concepts/vulnerabilities/)

## 🏛 License

```text
Copyright 2021 Ocean Protocol Foundation Ltd.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
