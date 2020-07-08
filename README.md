[![banner](https://raw.githubusercontent.com/oceanprotocol/art/master/github/repo-banner%402x.png)](https://oceanprotocol.com)

<h1 align="center">Ocean Marketplace</h1>

[![Build Status](https://travis-ci.com/oceanprotocol/market.svg?branch=master)](https://travis-ci.com/oceanprotocol/market)
[![Now deployment](https://flat.badgen.net/badge/now/auto-deployment/21c4dd?icon=now)](https://zeit.co/oceanprotocol/market)
[![Maintainability](https://api.codeclimate.com/v1/badges/d114f94f75e6efd2ee71/maintainability)](https://codeclimate.com/repos/5e3933869a31771fd800011c/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/d114f94f75e6efd2ee71/test_coverage)](https://codeclimate.com/repos/5e3933869a31771fd800011c/test_coverage)
[![js oceanprotocol](https://img.shields.io/badge/js-oceanprotocol-7b1173.svg)](https://github.com/oceanprotocol/eslint-config-oceanprotocol)

**Table of Contents**

- [🤓 Resources](#-resources)
- [🏄 Get Started](#-get-started)
  - [Local Spree components with Barge](#local-spree-components-with-barge)
  - [API](#api)
- [🦑 Environment variables](#-environment-variables)
- [🎨 Storybook](#-storybook)
- [✨ Code Style](#-code-style)
- [👩‍🔬 Testing](#-testing)
- [🛳 Production](#-production)
- [⬆️ Deployment](#️-deployment)
  - [Manual Deployment](#manual-deployment)
- [🏗 Ocean Protocol Infrastructure](#-ocean-protocol-infrastructure)
- [🏛 License](#-license)

## 🤓 Resources

## 🏄 Get Started

The app is a React app built with [Gatsby.js](https://www.gatsbyjs.org) + TypeScript + CSS modules and will connect to Ocean components in Pacific by default.

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

### Local Spree components with Barge

If you prefer to connect to locally running components instead of remote connections to Ocean's network, you can spin up [`barge`](https://github.com/oceanprotocol/barge) and use a local Spree network in another terminal before running `npm start`:

```bash
git clone git@github.com:oceanprotocol/barge.git
cd barge

# startup with local Spree node
./start_ocean.sh --no-commons
```

This will take some time on first start, and at the end you need to copy the generated contract artifacts out of the Docker container. To do so, use this script from the root of the app folder:

```bash
./scripts/keeper.sh
```

The script will wait for all contracts to be generated in the `keeper-contracts` Docker container, then will copy the artifacts in place into `node_modules/@oceanprotocol/keeper-contracts/artifacts/`.

Finally, set environment variables to use those local connections in `.env` in the app:

```bash
# modify env variables, Spree is enabled by default when using those files
cp .env.example .env
```

### API

Files under `/api` are isolated and not part of Gatsby.

- [API Documentation](api/)

## 🦑 Environment variables

The `app.config.js` file is setup to prioritize environment variables for setting each Ocean component endpoint. By setting environment variables, you can easily switch between Ocean networks the app connects to, without directly modifying `app.config.js`.

For local development, you can use a `.env` file:

```bash
# modify env variables, Spree is enabled by default when using those files
cp .env.example .env
```

## 🎨 Storybook

[Storybook](https://storybook.js.org) is set up for this project and is used for UI development of components. Stories are created inside `src/components/` alongside each component in the form of `ComponentName.stories.tsx`.

To run the Storybook server, execute in your Terminal:

```bash
npm run storybook
```

This will launch the Storybook UI with all stories loaded under [localhost:4000](http://localhost:4000).

Every deployment run will build and deploy the exported storybook under `/storybook/`, e.g. the current one matching `master` under [https://dexfreight-ten.now.sh/storybook/](https://dexfreight-ten.now.sh/storybook/).

## ✨ Code Style

For linting and auto-formatting you can use from the root of the project:

```bash
# lint all js with eslint
npm run lint

# auto format all js & css with prettier, taking all configs into account
npm run format
```

## 👩‍🔬 Testing

Test suite for unit tests is setup with [Jest](https://jestjs.io) as a test runner and:

- [react-testing-library](https://github.com/kentcdodds/react-testing-library) for all React components
- [node-mocks-http](https://github.com/howardabrams/node-mocks-http) for all `api/` routes

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

Every branch or Pull Request is automatically deployed by [Vercel](https://vercel.com) with their GitHub integration. A link to a deployment will appear under each Pull Request.

The latest deployment of the `master` branch is automatically aliased to `xxx`.

### Manual Deployment

If needed, app can be deployed manually. Make sure to switch to Ocean Protocol org before deploying:

```bash
# first run
vercel login
vercel switch

# deploy
vercel
# switch alias to new deployment
vercel alias
```

## 🏗 Ocean Protocol Infrastructure

The following Aquarius & Brizo instances specifically for marketplace are deployed in Ocean Protocol's AWS K8:

**Nile (Staging)**

- K8 namespace: `market-nile`
- `aquarius.nile.market.dev-ocean.com`
- `brizo.nile.market.dev-ocean.com`

Edit command with `kubectl`, e.g.:

```bash
kubectl edit deployment -n market-nile aquarius
```

**Pacific (Production)**

- K8 namespace: `market-pacific`
- `aquarius.pacific.market.dev-ocean.com`
- `brizo.pacific.market.dev-ocean.com`

Edit command with `kubectl`, e.g.:

```bash
kubectl edit deployment -n market-pacific aquarius
```

## 🏛 License

```text
Copyright 2020 Ocean Protocol Foundation Ltd.

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
