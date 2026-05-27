# 오먹지 Design System
> Reference: Catchtable (WAD Inc.) · Warm Editorial Adaptation

---

## 1. Visual Theme & Atmosphere

캐치테이블의 핵심 철학: **editorial restraint** — 사진이 말하게 하고, UI는 물러선다.
오먹지는 이를 warm editorial로 해석: 흰 캔버스 대신 크림 배경, 블랙 대신 딥 웜브라운.

**Key principles:**
- 액센트 컬러는 CTA 딱 한 곳에만 (scarcity is the discipline)
- 깊이는 border + surface tint로 — shadow는 거의 안 씀
- Pretendard only — 150% line-height 전체 통일
- Hard-square 기본 (0px radius) — 카드/CTA만 소프트닝
- 콘텐츠(식당명, 메뉴)가 스타 — UI 크롬은 조연

---

## 2. Color Palette

### Base (Catchtable 원본)
| Token | Hex | 용도 |
|-------|-----|------|
| `--bg` | `#F9F9F9` | 페이지 배경 (Subdued) |
| `--surface` | `#FFFFFF` | 카드, 헤더 (Pure White) |
| `--surface-sub` | `#F5F5F5` | 서브 서피스 (Muted) |
| `--border` | `#E4E4E4` | 기본 구분선 (Border Default) |
| `--border-hover` | `#B5B5B5` | hover 강조 (Disabled) |
| `--border-cool` | `#DCE3E8` | 쿨 테마 border |
| `--hairline` | `rgba(0,0,0,0.08)` | 카드 구분선 (Hairline Alpha) |

### Typography Colors (Ink Ladder — Catchtable 원본)
| Token | Hex | 용도 |
|-------|-----|------|
| `--text` | `#000000` | 본문 기본 (Pure Black) |
| `--text-title` | `#222222` | 식당명, 섹션 타이틀 (Title Black) |
| `--text-strong` | `#424242` | 탭 레이블 강조 (Body Strong) |
| `--text-secondary` | `#666666` | 설명, 부제목 (Body Muted) |
| `--text-tertiary` | `#5F5F5F` | 칩 텍스트 (Tertiary) |
| `--text-placeholder` | `#9E9E9E` | 인풋 placeholder |
| `--text-disabled` | `#B5B5B5` | 비활성 컨트롤 |
| `--icon-default` | `#8F8F8F` | 아이콘 기본 |
| `--icon-subtle` | `#AAAAAA` | 장식 아이콘 |

### Action (CatchTable Orange)
| Token | Hex | 용도 |
|-------|-----|------|
| `--accent` | `#FF3D00` | CTA 버튼 (CatchTable Orange) |
| `--accent-soft` | `#FA8D6B` | 눌림 상태, 웜 액센트 (Orange Soft) |
| `--accent-tint` | `#FDF0EC` | 배너/알림 배경 (Orange Tint Warm) |
| `--accent-tint-pale` | `#FCF3F2` | 서브틀 알림 (Orange Tint Pale) |
| `--accent-hover` | `#FC9086` | hover-state surface (Orange Pressed) |
| `--accent-fg` | `#FFFFFF` | 버튼 위 텍스트 |

### Category Colors (오먹지 오리지널)
| 카테고리 | Hex | 이모지 |
|---------|-----|--------|
| 밥 | `#D4845A` | 🍚 |
| 국물 | `#C0392B` | 🍲 |
| 면 | `#D4A017` | 🍜 |
| 고기 | `#8B5E3C` | 🥩 |
| 가볍게 | `#4A7C59` | 🥗 |

### Semantic
| Token | Hex | 용도 |
|-------|-----|------|
| `--success` | `#43C478` | 성공 |
| `--success-tint` | `#EBF7ED` | 성공 배경 |
| `--danger` | `#D91F11` | 오류 (brand orange와 구분) |
| `--info` | `#186ADE` | 정보 |
| `--info-tint` | `#F0F4FA` | 정보 배경 |

### Status Badge
| 상태 | Background | Text |
|-----|-----------|------|
| 안전 | `#EBF7ED` | `#077D55` |
| 보통 | `#FDF3E3` | `#8A5A00` |
| 붐빔 | `#FDECEA` | `#B03020` |
| 7분컷 | `#F0F4FA` | `#186ADE` |

---

## 3. Typography

### Font Stack
```
Pretendard, -apple-system, system-ui, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif
```
> No display font. Pretendard alone carries the entire system.

### Scale (150% line-height 전체 통일)
| Role | Size | Weight | Line-height | Letter-spacing | 용도 |
|------|------|--------|-------------|----------------|------|
| Section Title | 20px | 700 | 150% | normal | 섹션 헤더 |
| Big Section | 18px | 700 | 150% | normal | 큰 카드 타이틀 |
| Card Title | 16px | 600 | 150% | normal | 식당명 |
| Body Default | 14px | 400 | 150% | normal | 기본 본문 (dominant) |
| Chip Label | 14px | 500 | 150% | normal | 필터 칩 |
| Caption | 13px | 500 | 150% | normal | 메타, 검색 |
| Badge / Label | 12px | 400 | 150% | normal | 타임스탬프, 서브 |
| Policy Link | 11px | 500 | 150% | normal | 푸터 링크 |
| Micro Meta | 10px | 500 | 150% | normal | 카운터, 컴팩트 |

### Principles
- **400 dominates (91%), 700 punctuates (2%)** — weight는 binary (body or title)
- **letter-spacing: normal** 전체 통일 — 개별 조정 없음
- **150% line-height** — 모든 타이포 토큰에 동일 적용, 절대 깨지 않기

---

## 4. Radius & Shape
> Catchtable: hard-square by default (0px = 92% of elements)

| Use | Radius | 적용 |
|-----|--------|------|
| Default chrome | `0px` | 섹션, 구분선, 리스트 행, 검색 인풋 |
| Photo thumbnail | `4px` | 카드 썸네일 이미지 |
| Avatar | `50%` | 프로필 이미지 |
| Interactive controls | `8px` | 버튼 (ghost), 서브 필터 |
| Primary CTA pill | `12px` | 메인 CTA 버튼, 카드 |
| Pill-full | `999px` | 카테고리 필터 칩 |

> ⚠️ global `border-radius: 8px` reset 절대 금지 — 브랜드 사라짐

---

## 5. Elevation (Shadow)
> Depth는 **border + surface tint**로. Shadow는 부유 요소에만.

| Tier | Token | Recipe | 사용처 |
|------|-------|--------|--------|
| xs | `--shadow-xs` | `0 1px 2px rgba(0,0,0,.12), 0 0 1px rgba(0,0,0,.08)` | 최소 부유 |
| sm | `--shadow-sm` | `0 2px 8px rgba(0,0,0,.12), 0 1px 4px rgba(0,0,0,.08)` | hover 카드 |
| drop | `--shadow-drop` | `0 2px 12px rgba(0,0,0,.12)` | 드롭다운 |
| md | `--shadow-md` | `0 6px 12px rgba(0,0,0,.12), 0 4px 8px rgba(0,0,0,.08)` | 결과 카드, 모달 |
| lg | `--shadow-lg` | `0 16px 20px rgba(0,0,0,.12), 0 8px 16px rgba(0,0,0,.08)` | 바텀시트 |

**카드-at-rest: shadow 없음** → hairline border(`rgba(0,0,0,0.08)`)로 분리

---

## 6. Spacing Scale
```
4 / 8 / 12 / 16 / 20 / 24 / 32 / 45 / 60 px
```
| 용도 | 값 |
|------|-----|
| 배지 내부 padding | 4px |
| 요소 간 최소 gap | 8px |
| 카드 내부 간격 | 12px |
| 카드 패딩 | 16px |
| 섹션 간격 | 24–32px |
| 섹션 하단 padding | 45px |
| 넓은 여백 | 60px |

---

## 7. Components

### Primary CTA Button
```
bg: --accent (#C4622D)
text: white / 14px / 500
radius: 12px
padding: 10px 20px
height: ~44px
hover: --accent-hover
active: opacity 0.85
transition: background 0.2s, opacity 0.2s
```

### Ghost Button
```
bg: transparent
border: 1px solid --border-hover
text: --text / 14px / 400
radius: 8px
hover: bg --surface-sub
active: opacity 0.85
```

### Card — elevated (오먹지 커스텀)
```
bg: --surface
border: 1px solid --border  (hairline 대신 warm border 사용)
border-radius: 12px
overflow: hidden
box-shadow: none (at-rest)

Thumb (카테고리 블록)
  height: 96px
  bg: category color
  border-radius: 4px (photo thumbnail 기준)
  emoji: 40px centered
  overlay: rgba(0,0,0,0.08)

Body
  padding: 14px 16px 16px

hover:
  border-color: --border-hover
  box-shadow: --shadow-sm
  transform: translateY(-2px)
  transition: 0.2s
```

### Header — glass
```
bg: rgba(255,255,255,0.85)
backdrop-filter: blur(8px)
border-bottom: 1px solid --border
position: sticky / top: 0
padding: 18px 24px
```

### Filter Chip (Pill)
```
default:
  bg: --surface
  border: 1px solid --border
  text: --text-secondary / 14px / 500
  radius: 999px
  padding: 7px 16px

active:
  bg: --accent
  border: --accent
  text: white
```

### Sub Filter Chip
```
default:
  bg: transparent
  border: 1px solid --border
  text: --text-tertiary / 12px / 400
  radius: 8px

active:
  bg: --text
  border: --text
  text: white
```

### Badge
```
font: 11px / 600
padding: 2px 8px
radius: 999px
letter-spacing: normal
```

### Result Card
```
bg: --surface
border: 1.5px solid --accent
border-radius: 12px
padding: 28px 24px
text-align: center
box-shadow: --shadow-md

label: 11px / 600 / uppercase / --accent
name: 28px / 700
meta: 14px / --text-secondary
```

---

## 8. Iconography
```
Style: line-style, inline SVG
Default color: #8F8F8F (--text-tertiary 참고)
Active: #000 (--text)
No illustration system — category emoji block이 유일한 그래픽 요소
```

---

## 9. Motion
```
duration: 0.2s
easing: ease
properties: background, border-color, box-shadow, transform, opacity

hover lift: translateY(-2px)
button press: opacity 0.85
```

---

## 10. Responsive
```
Mobile  : ~600px  — 1 column, stacked header/controls
Tablet  : 601px~  — 2 column grid (auto-fill 280px)
Desktop : 980px+  — 3 column grid, max-width 980px centered
```

---

## 11. Voice & Microcopy (오먹지 적용)
> Catchtable 톤: curatorial-warm, gerund-light, second-person-implied

**Do:**
- "오늘 뭐 먹지?" — 질문형, 동료에게 말 건네듯
- "지금 날씨엔 이게 어울려요" — 추천, 강요 아님
- "다시 뽑기" — 가볍게

**Don't:**
- "지금 바로 가세요!" — urgency timer 금지
- 할인/특가 강조 — editorial restraint
- 딱딱한 명령형

---

## 12. Accessibility
```
--text (#1C1410) on --bg (#F7F4EF) : 충분한 대비
--accent (#C4622D) on white        : CTA는 16px/600 이상 유지 (large text AA 통과)
최소 touch target: 44px
focus ring 필수 (interactive elements)
```

---

## 13. Naver Map Link
```
Format: https://map.naver.com/p/entry/place/{place_id}
Fallback: https://map.naver.com/p/search/{식당명}+교대
Style: --accent / 12px / 500 / no-underline / hover opacity 0.75
```
