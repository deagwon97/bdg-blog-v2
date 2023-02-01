#!/bin/bash

# for pull context from private github repository
# kubectl create secret generic git-secret --from-env-file ./git-secret -n bdg-blog-v2

# for push image to private registry
source harbor-config

ENCODED_KEY=`echo -n $HARBOR_ID:$HARBOR_PW | base64`

# config\.json=$(mktemp)

echo "{
  \"auths\": {
    \"https://harbor.deagwon.com\": {
      \"auth\": \"$ENCODED_KEY\"
    }
  }
}" > config.json

kubectl create configmap harbor-config --from-file=config.json -n bdg-blog-v2

# rm $CONFIG_JSON