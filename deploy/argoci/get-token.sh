#!/bin/bash
namespace=bdg-blog-argoci

ARGO_TOKEN="Bearer $(kubectl get secret argo-executor.service-account-token -n $namespace -o=jsonpath='{.data.token}' | base64 --decode)"
echo $ARGO_TOKEN
