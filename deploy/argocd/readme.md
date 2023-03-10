
```
kubectl apply -k .


kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d; echo

argocd login cd.argo.deagwon.com
```