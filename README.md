# 오먹지 🍽

교대 근처 점심 맛집 공유 앱

## 파일 구조

```
src/
  index.html   - 메인 HTML
  style.css    - 스타일
  app.js       - 앱 로직 (ES module)
  data.js      - 맛집 데이터 (44곳)
```

## 로컬 실행

브라우저에서 ES module을 사용하기 때문에 로컬 서버가 필요해요.

```bash
# Python
python -m http.server 8080 --directory src

# Node (npx)
npx serve src
```

## 맛집 데이터 업데이트

`src/data.js` 에서 각 항목을 수정하세요.

- `naver: ""` → 네이버 지도 직접 링크가 있으면 입력, 없으면 비워두면 식당명으로 자동 검색
- `walk: null` → 거리 미확인 항목 (미우미우, 함평원, 광해떡볶이)

## 날씨 추천 로직

| 날씨 | 추천 카테고리 |
|------|-------------|
| 비 / 추움 (5°C 이하) | 국물 |
| 더움 (28°C 이상) | 가볍게 + 면 |
| 맑음 / 흐림 | 전체 랜덤 |
