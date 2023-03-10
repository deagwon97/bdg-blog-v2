
```bash
ARGO_TOKEN="Bearer $(kubectl get secret argo-executor.service-account-token -n argo-workflows -o=jsonpath='{.data.token}' | base64 --decode)"

echo $ARGO_TOKEN
```

