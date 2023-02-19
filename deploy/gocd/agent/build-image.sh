#!/bin/bash
docker build -t harbor.deagwon.com/gocd/gocd-kaniko-agent:latest .

docker push harbor.deagwon.com/gocd/gocd-kaniko-agent:latest

source pull-config
ENCODED_KEY=`echo -n $PULL_ID:$PULL_PW | base64 -w 0`
echo "{
  \"auths\": {
    \"https://harbor.deagwon.com\": {
      \"auth\": \"$ENCODED_KEY\"
    }
  }
}" > pull-config.json


source push-config
ENCODED_KEY=`echo -n $PUSH_ID:$PUSH_PW | base64 -w 0`
echo "{
  \"auths\": {
    \"https://harbor.deagwon.com\": {
      \"auth\": \"$ENCODED_KEY\"
    }
  }
}" > push-config.json