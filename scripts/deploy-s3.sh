#!/usr/bin/env bash
#
# required environment variables:
# AWS_ACCESS_KEY_ID
# AWS_SECRET_ACCESS_KEY
# AWS_DEFAULT_REGION us-east-1
AWS_S3_BUCKET="www-market"

#
set -e;

function s3sync {
  aws s3 sync ./out s3://"$1" \
    --include "*" \
    --exclude "*.html" \
    --exclude "sw.js" \
    --exclude "*page-data.json" \
    --exclude "*app-data.json" \
    --exclude "chunk-map.json" \
    --exclude "sitemap.xml" \
    --exclude ".iconstats.json" \
    --exclude "robots.txt" \
    --cache-control public,max-age=31536000,immutable \
    --delete \
    --acl public-read

  aws s3 sync ./out s3://"$1" \
    --exclude "*" \
    --include "*.html" \
    --include "sw.js" \
    --include "*page-data.json" \
    --include "*app-data.json" \
    --include "chunk-map.json" \
    --include "sitemap.xml" \
    --include ".iconstats.json" \
    --include "robots.txt" \
    --cache-control public,max-age=0,must-revalidate \
    --delete \
    --acl public-read
}

s3sync $AWS_S3_BUCKET
