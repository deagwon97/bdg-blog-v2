#!/bin/bash
source harbor-config
# echo -n : 개행 문자를 출력하지 않음
# base64 -w 0 : base64로 인코딩한 결과를 한 줄로 출력
ENCODED_KEY=`echo -n $HARBOR_ID:$HARBOR_PW | base64 -w 0`
echo "{
  \"auths\": {
    \"https://harbor.deagwon.com\": {
      \"auth\": \"$ENCODED_KEY\"
    }
  }
}" > config.json

