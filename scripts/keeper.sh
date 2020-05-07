#!/bin/bash

# Wait for contracts migration and extract Keeper artifacts

RETRY_COUNT=0
COMMAND_STATUS=1

printf '\n\e[33m◯ Waiting for contracts to be generated...\e[0m\n'

mkdir -p artifacts

until [ $COMMAND_STATUS -eq 0 ] || [ $RETRY_COUNT -eq 120 ]; do
  keeper_contracts_docker_id=$(docker container ls | grep keeper-contracts | awk '{print $1}')
  docker cp ${keeper_contracts_docker_id}:/keeper-contracts/artifacts/ready ./artifacts/ > /dev/null 2>&1
  COMMAND_STATUS=$?
  sleep 5
  (( RETRY_COUNT=RETRY_COUNT+1 ))
done

printf '\e[32m✔ Found new contract artifacts.\e[0m\n'

rm -rf ./artifacts/

if [ $COMMAND_STATUS -ne 0 ]; then
  echo "Waited for more than two minutes, but keeper contracts have not been migrated yet. Did you run an Ethereum RPC client and the migration script?"
  exit 1
fi

docker cp "${keeper_contracts_docker_id}":/keeper-contracts/artifacts/. ./node_modules/@oceanprotocol/keeper-contracts/artifacts/

printf '\e[32m✔ Copied new contract artifacts.\e[0m\n'
