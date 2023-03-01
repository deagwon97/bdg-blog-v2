FROM gocd/gocd-agent-alpine-3.16:v22.3.0
COPY --chown=go:root --from=gcr.io/kaniko-project/executor:latest /kaniko /kaniko
COPY --chown=go:root --from=gcr.io/kaniko-project/executor:latest /etc/nsswitch.conf /etc/nsswitch.conf
ENV SSL_CERT_DIR=/kaniko/ssl/certs
ENV DOCKER_CONFIG /kaniko/.docker/
ENV DOCKER_CREDENTIAL_GCR_CONFIG /kaniko/.config/gcloud/docker_credential_gcr_config.json
RUN chmod -R 777 /kaniko