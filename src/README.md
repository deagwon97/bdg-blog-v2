### start project

```

yarn dev

yarn build

yarn start

```

### prisma update

```
1. prototype a schema at the start of a project and initialize a migration history

>> prisma db push

2. generate a migration from your changes
prisma migrate dev

3. generate prisma client type
prisma generate
```

# test codes

```
yarn add -D playwright
npm install -g playwright
playwright test --ui
yarn create playwright
cd src/
ls
clear
ls
yarn add jest jest-dom jest-environment-jsdom ts-jest babel-jest --dev
yarn add @jest/global
yarn add @types/jest
```

## service test 만들기

- 방법1. jest가 실행되는 순간 transaction prisma 객체로 reopsitory global 객체를 생성
  - 장점: 지금의 telefunc 함수들을 그대로 사용가능
  - 단점: 가능할지 불활실, global 객체의 상태관리 병렬로 테스트 코드 실행 x
- 방법2. service도 따로 class 만들어서 관리
  - 장점: repository 객체를 di 할 때 관리가능
  - 단점: 중복되는 telefunc 를 추가로 만들어야함 -> telefunc의 장점이 많이 사라짐
