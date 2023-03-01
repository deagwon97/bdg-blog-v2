# create history

- gocd는 helm으로 설치한다.
- 설정 저장을 위해서 persistant volume과 peristant volume claim을 생성한다.
- 보안을 위해 gocd password를 설정한다. 
    - htpasswd로 go-password 파일을 생성한다. 
    - go-password로 k3s secret을 생성한다.
    - gocd 설치시 helm chart의 extraVolumeMounts를 수정하여 생성한 secret을 마운트한다.
    - 설정 페이지에서 gui로 password 파일을 지정한다. (/etc/go/go-password)
    
```bash

helm repo add gocd https://gocd.github.io/helm-chart

helm repo update

helm show values gocd/gocd > gocd-values.yaml

helm install gocd gocd/gocd  -f gocd-values.yaml --namespace gocd --create-namespace

helm upgrade gocd gocd/gocd  -f gocd-values.yaml --namespace gocd 

helm uninstall gocd --namespace gocd 

```

```
NAME: gocd
LAST DEPLOYED: Sun Feb 19 19:47:02 2023
NAMESPACE: gocd
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
1. Get the GoCD server URL by running these commands:
    export POD_NAME=$(kubectl get pods --namespace gocd -l "app=gocd,release=gocd" -o jsonpath="{.items[0].metadata.name}")
    echo "Visit http://127.0.0.1:8080 to use your application"
    kubectl port-forward $POD_NAME 8080:8153

2. Get the service account token to configure the elastic agent plugin by doing the following:
    A default role gocd with cluster scoped privileges has been configured.
    
    The service account called gocd in namespace gocd has been associated with the role. To check,
        secret_name=$(kubectl get serviceaccount gocd --namespace=gocd  -o jsonpath="{.secrets[0].name}")
        kubectl get secret $secret_name --namespace=gocd -o jsonpath="{.data['token']}" | base64 --decode

    To obtain the CA certificate, do
        kubectl get secret $secret_name --namespace=gocd  -o jsonpath="{.data['ca\.crt']}" | base64 --decode


3. The GoCD server URL for configuring the Kubernetes elastic agent plugin settings:
    echo "http://$(kubectl get service gocd-server --namespace=gocd  -o jsonpath='{.spec.clusterIP}'):8153/go"

4. The cluster URL for configuring the Kubernetes elastic agent plugin settings can be obtained by:
    kubectl cluster-info

5. Persistence
    ################################################################################################
    WARNING: The default storage class will be used. The reclaim policy for this is usually `Delete`.
    You will lose all data at the time of pod termination!
    ################################################################################################

```


```
    extraVolumes: 
      - name: go-password-volume
        secret:
          secretName: go-password
          defaultMode: 0744
          
    # - name: gocd-server-init-scripts
    #   configMap:
    #      name: gocd-server-init-scripts
    #      defaultMode: 0755
    # - name: github-key
    #   secret:
    #     secretName: github-key
    #     defaultMode: 0744

    # server.persistence.extraVolumeMounts additional server volumeMounts
    extraVolumeMounts: 
      - name: go-password-volume
        mountPath: /etc/go
        readOnly: true
```