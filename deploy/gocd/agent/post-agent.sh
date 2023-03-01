#!/bin/bash

protocall=https
gocd_public_ip=dashboard.gocd.deagwon.com
USERNAME=admin
PASSWORD=hwTFSDsSSfb5jks1em

# container name 길이 제한
# The maximum name length is 63 characters.

# Create a new agent profile
curl -vi "$protocall://$gocd_public_ip/go/api/elastic/profiles" \
           -u "$USERNAME:$PASSWORD" \
           -H 'Accept: application/vnd.go.cd.v2+json' \
           -H 'Content-Type: application/json' \
           -X POST -d '{
        "id": "goagent-kaniko",
        "plugin_id": "cd.go.contrib.elasticagent.kubernetes",
        "cluster_profile_id": "k8-cluster-profile",
        "properties": [
          {
            "key": "PodConfiguration",
            "value": "apiVersion: v1
kind: Pod
metadata:
  name: gocd-kaniko-{{ POD_POSTFIX }}
  labels:
    app: web
spec:
  serviceAccountName: default
  securityContext:
    runAsUser: 0
    runAsGroup: 0
    fsGroup: 0
  containers:
    - name: gocd-kaniko-{{ CONTAINER_POSTFIX }}
      image: harbor.deagwon.com/gocd/gocd-kaniko-agent:latest
      env:
        - name: DOCKER_CONFIG
          value: "/kaniko/.docker"
      volumeMounts:
      - name: gocd-agent-ssh
        mountPath: \"/home/go/.ssh\"
        readOnly: true  
      - name: docker-config
        mountPath: /kaniko/.docker
  imagePullSecrets:
    - name: harbor-pull-config    
  nodeName: bdg-msi
  volumes:
    - name: gocd-agent-ssh
      secret:
        secretName: gocd-agent-ssh
    - name: docker-config
      configMap:
        name: bdg-blog-v2-push-config
        defaultMode: 0644"
    },
          {
            "key": "PodSpecType",
            "value": "yaml"
          },
          {
            "key": "Privileged",
            "value": "true"
          }
        ]
      }'