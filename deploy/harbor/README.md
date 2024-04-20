## 1. Install Side Resources for Helm Chart

### a. Create Directory for Persistent Volumes

```
sudo mkdir -p /mnt/bdg-blog/harbor/registry
sudo mkdir -p /mnt/bdg-blog/harbor/jobservice
sudo mkdir -p /mnt/bdg-blog/harbor/chartmuseum
sudo mkdir -p /mnt/bdg-blog/harbor/trivy
sudo mkdir -p /mnt/bdg-blog/harbor/redis
sudo mkdir -p /mnt/bdg-blog/harbor/database
```

### b. customize helm values.yaml
```bash
# ./06harbor-helm/values.yaml
expose.type:clusterIP
expose.tls.enabled:false
externalURL:https//harbar.domain.com
persistence.persistentVolumeClaim.registry.existingClaim:"harbor-registry"
persistence.persistentVolumeClaim.chartmuseum.existingClaim:"harbor-chartmuseum"
persistence.persistentVolumeClaim.redis.existingClaim:"harbor-redis"
persistence.persistentVolumeClaim.jobservice.existingClaim:"harbor-jobservice"
persistence.persistentVolumeClaim.trivy.existingClaim:"harbor-trivy"
persistence.persistentVolumeClaim.database.existingClaim:"harbor-database"
harborAdminPassword: "newpassowrd"
```
### c. Install

```
kubectl kustomize . --enable-helm | kubectl apply -f -
```
