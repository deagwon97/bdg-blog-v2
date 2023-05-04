#!/bin/bash
namespace=bdg-blog-argocd
kubectl -n $namespace get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d; echo