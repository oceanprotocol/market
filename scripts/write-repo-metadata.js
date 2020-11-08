#!/usr/bin/env node
'use strict'

const execSync = require('child_process').execSync

process.stdout.write(
  JSON.stringify(
    {
      version: require('../package.json').version,
      branch: process.env.VERCEL_GITHUB_COMMIT_REF || 'dev',
      commit:
        process.env.VERCEL_GITHUB_COMMIT_SHA ||
        execSync(`git rev-parse HEAD`).toString().trim()
    },
    null,
    '  '
  )
)
