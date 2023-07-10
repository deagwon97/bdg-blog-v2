const randomNames = [
  '서장훈',
  '현주엽',
  '허재',
  '이상민',
  '정성조',
  '한준혁',
  '박스타',
  '크록스맨',
  '부대권',
  '김선형',
  '하승진',
  '여준석',
  '자밀 워니',
  '이대성',
  '전성현',
  '허웅',
  '허훈',
  '이정현',
  '라건아',
  '변준형',
  '이재도',
  '오세근',
  '양홍석',
  '이관희',
  '야니스 아테토쿤보',
  '니콜라 요키치',
  '루카 돈치치',
  '조엘 엠비드',
  '스테픈 커리 ',
  '케빈 듀랜트',
  '르브론 제임스',
  '카와이 레너드',
  '제임스 하든',
  '앤서니 데이비스',
  '제이슨 테이텀',
  '마이클 조던',
  '알랜 아이버슨',
  '캐빈 가넷',
  '코비 브라이언트',
  '팀 던컨',
  '케빈 맥테일',
  '존 월',
  '데릭 로즈',
  '데미안 릴라드',
  '루 윌리엄스',
  '트레이 영',
  '아이재아 토마스',
  '즈루 할러데이',
  '잭 라빈',
  '더마 드로잔',
  '브랜든 잉그램',
  '파스칼 시아캄',
  '앤드류 위긴스',
  '카이리 어빙',
  '마커스 스마트',
  '클레이 탐슨',
  '자이언 윌리엄슨',
  '라멜로 볼',
  '디존테 머레이',
  '드레이먼드 그린',
  '타이리스 맥시',
  'CJ 맥컬럼',
  '도만타스 사보니스',
  '미칼 브릿지스',
  '자말 머레이',
  '디안드레 에이튼',
  '자렛 알렌',
  '자렌 잭슨 주니어',
  '디애런 팍스',
  '조던 풀',
  '토바이어스 해리스',
  '로버트 윌리엄스 3세',
  '카일 라우리',
  '러셀 웨스트브룩',
  '알 호포드',
  '줄리어스 랜들',
  '마이클 포터 주니어',
  '벤 시몬스',
  '론조 볼',
  '클린트 카펠라',
  '파올로 밴케로',
  '애런 고든',
  '디안젤로 러셀',
  '세스 커리',
  '케빈 러브'
]

export const getRandomName = () => {
  const randomIdx = Math.floor(Math.random() * randomNames.length)
  return randomNames[randomIdx]
}