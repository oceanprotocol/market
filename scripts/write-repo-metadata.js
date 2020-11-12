#!/usr/bin/env node
'use strict'

const execSync = require('child_process').execSync

//
// VERCEL_GITHUB_COMMIT_REF & VERCEL_GITHUB_COMMIT_SHA need to be added with empty
// values in Vercel environment variables, making them available to builds.
// https://vercel.com/docs/build-step#system-environment-variables
//
process.stdout.write(
  JSON.stringify(
    {
      version: require('../package.json').version,
      branch:
        process.env.VERCEL_GITHUB_COMMIT_REF || process.env.BRANCH || 'dev',
      commit:
        process.env.VERCEL_GITHUB_COMMIT_SHA ||
        process.env.COMMIT_REF ||
        execSync(`git rev-parse HEAD`).toString().trim()
    },
    null,
    '  '
  )
)
