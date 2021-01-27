![EWAI Header](https://adivate.net/doc/ewai/header2.jpg)

# EnergyWeb Renewables & Clean Energy Data Marketplace for Analytics and A.I. Learning

# OVERVIEW

Imagine being able to do analysis and learning across clean energy and renewables devices, networks and industries, for example, by analyzing and learning from energy consumption and usage patterns across wind, solar, EV, hydro and geothermal networks by being able to apply AI learning to energy consumption patterns to improve overall grid and IOT device efficiencies. The application of AI techniques can potentially expose heretofore unknown energy consumption patterns across clean energy and renewables networks resulting in efficiency recommendations and improvements.

EWAI, short for EnergyWeb A.I., is a conceptual prototype for an EW to OCEAN API bridge and subsystem which enables the creation of OCEAN IOT Energy Data Marketplace(s) fed by millions/billions of EW-DOS enabled devices. The EW-DOS devices send Power Telemetry Data (PDT) about energy and power usage and consumption metrics to the marketplace(s). OCEAN's data marketplaces would be an ideal way to apply AI learning to improve the energy efficiency of IOT devices and networks by studying patterns visible from their real-world consumption data. Gathering decentralized PTD data together into Ocean data tokens would also allow algos to be developed and applied to energy data which may look for and identify unusual and heretofore unknown consumption patterns, and even potentially start automatically addressing areas of network and system efficiency improvements and optimizations through learning techniques.

An EWAI deployment consists of an [EWAI-SERVER](https://github.com/energywebfoundation/ewai) instance paired with an [EWAI-MARKET](https://github.com/energywebfoundation/ewai-market) instance (along with supporting EnergyWeb components):

1. [EWAI-SERVER](https://github.com/energywebfoundation/ewai): This is the server component which offers a streaming data cache for DER PTD (Power Telemetry Data), and
2. [EWAI-MARKET](https://github.com/energywebfoundation/ewai-market): This repository, which is a fork of the [V3 Ocean Protocol Marketplace](https://github.com/oceanprotocol/market), whereby the EWAI energy data assets can be published via Ocean Protocol data tokens. You should familiarize yourself first therefore with Ocean Protocol, as understanding how Ocean works will be necessary also.

---

**🐲🦑 THERE BE ELVES AND GREMLINS LURKING. This is in ALPHA state and you can expect to run into problems. If you see any issues, please open up [a new issue](#). 🦑🐲**

---

# START HERE FIRST!!

You will not be able to use this repo unless you properly setup EWAI-SERVER first and understand what is needed. Please therefore start here FIRST:

[Read the EWAI Docs](https://readthedocs.com/projects/energy-web-foundation-energyweb-ewai/)

# PREREQUISITES

In order to setup and run this EWAI-MARKET code, you must first learn, configure and setup an [EWAI-SERVER](https://github.com/energywebfoundation/ewai) instance. Therefore, please start with [that repo]https://github.com/energywebfoundation/ewai) as it contains the main documentation and instructions for setting up an EWAI instance. EWAI also requires an understanding (and prior configuration) of all of the following EnergyWeb subsystems:

1. Energy Web: https://energyweb.org
2. Energy Web Chain (EWC): https://www.energyweb.org/technology/energy-web-chain/
3. Energy Web Token (EWT): https://www.energyweb.org/technology/token/
4. Ocean Protocol: https://oceanprotocol.com/
5. Energy Web EW-DOS: https://www.energyweb.org/technology/ew-dos/
6. Energy Web Name Service (EWNS): https://ens.energyweb.org
7. Energy Web EW-Switchboard: https://switchboard.energyweb.org/
8. Energy Web EW-Messaging: https://github.com/energywebfoundation/messaging
9. Decentralized Identifiers (DIDs): https://github.com/energywebfoundation/passport-did-auth, https://github.com/energywebfoundation/iam-client-lib, https://en.wikipedia.org/wiki/Decentralized_Identifiers

The Instructions below are about how to setup and utilize this marketplace component.

# EWAI-MARKETPLACE

[![Build Status](https://travis-ci.com/oceanprotocol/market.svg?token=3psqw6c8KMDqfdGQ2x6d&branch=main)](https://travis-ci.com/oceanprotocol/market)
[![Netlify Status](https://api.netlify.com/api/v1/badges/c85f4d8b-95e1-4010-95a4-2bacd8b90981/deploy-status)](https://app.netlify.com/sites/market-oceanprotocol/deploys)
[![Maintainability](https://api.codeclimate.com/v1/badges/d114f94f75e6efd2ee71/maintainability)](https://codeclimate.com/repos/5e3933869a31771fd800011c/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/d114f94f75e6efd2ee71/test_coverage)](https://codeclimate.com/repos/5e3933869a31771fd800011c/test_coverage)
[![js oceanprotocol](https://img.shields.io/badge/js-oceanprotocol-7b1173.svg)](https://github.com/oceanprotocol/eslint-config-oceanprotocol)

**Table of Contents**

- [🏄 Get Started](#-get-started)
  - [Local components with Barge](#local-components-with-barge)
- [🦑 Environment variables](#-environment-variables)
- [🎨 Storybook](#-storybook)
- [✨ Code Style](#-code-style)
- [👩‍🔬 Testing](#-testing)
- [🛳 Production](#-production)
- [⬆️ Deployment](#️-deployment)
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

Finally, set environment variables to use this local connection in `.env` in the app:

```bash
# modify env variables, Rinkeby is enabled by default when using those files
cp .env.example .env
```

## 🦑 Environment variables

The `app.config.js` file is setup to prioritize environment variables for setting each Ocean component endpoint. By setting environment variables, you can easily switch between Ocean networks the app connects to, without directly modifying `app.config.js`.

For local development, you can use a `.env` file:

```bash
# modify env variables, Rinkeby is enabled by default when using those files
cp .env.example .env
```

## 🎨 Storybook

[Storybook](https://storybook.js.org) is set up for this project and is used for UI development of components. Stories are created inside `src/components/` alongside each component in the form of `ComponentName.stories.tsx`.

To run the Storybook server, execute in your Terminal:

```bash
npm run storybook
```

This will launch the Storybook UI with all stories loaded under [localhost:4000](http://localhost:4000).

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

Every branch or Pull Request is automatically deployed by [Netlify](https://netlify.com) with their GitHub integration. A link to a deployment will appear under each Pull Request.

The latest deployment of the `main` branch is automatically aliased to `market.oceanprotocol.com`.

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
