#!/usr/bin/env bash
#
# required environment variables:
# AWS_ACCESS_KEY_ID
# AWS_SECRET_ACCESS_KEY
# AWS_DEFAULT_REGION us-east-1
AWS_S3_BUCKET="www-market"
AWS_S3_BUCKET_BETA="www-market-beta"

#
set -e;

function s3sync {
  aws s3 sync ./public s3://"$1" \
    --include "*" \
    --exclude "*.html" \
    --exclude "sw.js" \
    --exclude "*page-data.json" \
    --exclude "chunk-map.json" \
    --exclude "sitemap.xml" \
    --exclude ".iconstats.json" \
    --exclude "humans.txt" \
    --exclude "robots.txt" \
    --cache-control public,max-age=31536000,immutable \
    --delete \
    --acl public-read

  aws s3 sync ./public s3://"$1" \
    --exclude "*" \
    --include "*.html" \
    --include "sw.js" \
    --include "*page-data.json" \
    --include "chunk-map.json" \
    --include "sitemap.xml" \
    --include ".iconstats.json" \
    --include "humans.txt" \
    --include "robots.txt" \
    --cache-control public,max-age=0,must-revalidate \
    --delete \
    --acl public-read
}

##
## check for pull request against master
##
if [ "$TRAVIS_PULL_REQUEST" != "false" ] && [ "$TRAVIS_BRANCH" == "main" ]; then

  s3sync $AWS_S3_BUCKET_BETA

##
## check for master push which is no pull request
##
elif [ "$TRAVIS_BRANCH" == "main" ] && [ "$TRAVIS_PULL_REQUEST" == "false" ] || [ "$TRAVIS" != true ]; then

  s3sync $AWS_S3_BUCKET


  echo "---------------------------------------------"
  echo "         ✓ done deployment "
  echo "---------------------------------------------"

  exit;

else

  echo "---------------------------------------------"
  echo "          nothing to deploy "
  echo "---------------------------------------------"

fi
