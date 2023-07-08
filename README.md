#

- node: v16.18.0
- yarn: 1.22.19
- npm : 8.19.2

```
1. upload

1) 파일을 업로드
2) post 저장할 때, 처음부터 meta data를 post에 저장
3) 파일을 minio에 저장

2. view

1) 서버에서 post 정보를 클라이언트에게 전달할 때, 특정 문자열을 검사해서, meta data를 presigned url로 변경
2) 클라이언트는 presigned url을 받아서 랜더링
3) minio 서버는 이미지 파일을 클라이언트에게 전달
```
