import { restaurants } from './data.js';

// --- Category styles ---
const CAT_STYLE = {
  '밥':    { bg: '#D4845A', emoji: '🍚' },
  '국물':  { bg: '#C0392B', emoji: '🍲' },
  '면':    { bg: '#D4A017', emoji: '🍜' },
  '고기':  { bg: '#8B5E3C', emoji: '🥩' },
  '가볍게': { bg: '#4A7C59', emoji: '🥗' },
};

// --- State ---
let state = {
  category: '전체',
  filters: { min7: false, honja: false, safe: false, cheap: false },
  weather: null,
  filtered: [],
};
let spinInterval = null;

// --- Helpers ---
function formatPrice(price) {
  if (!price) return '-';
  return price >= 10000
    ? `₩${(price / 10000).toFixed(1)}만`
    : `₩${price.toLocaleString()}`;
}

// --- Naver map link ---
function naverLink(name) {
  return `https://map.naver.com/v5/search/${encodeURIComponent(name + ' 교대')}`;
}

// --- Filter logic ---
function getFiltered() {
  return restaurants.filter(r => {
    if (state.category !== '전체' && r.cat !== state.category) return false;
    if (state.filters.min7 && !r.min7) return false;
    if (state.filters.honja && !['가능', '좋음', '매우좋음'].includes(r.honja)) return false;
    if (state.filters.safe && r.safe === '붐빔') return false;
    if (state.filters.cheap && r.price > 10000) return false;
    return true;
  });
}

// --- Render ---
function safeBadge(safe) {
  if (safe === '안전') return `<span class="badge badge-safe">안전</span>`;
  if (safe === '붐빔') return `<span class="badge badge-busy">붐빔</span>`;
  return `<span class="badge badge-normal">보통</span>`;
}

function honjaLabel(honja) {
  if (honja === '매우좋음' || honja === '좋음') return '👤 혼밥 OK';
  if (honja === '가능') return '👤 혼밥 가능';
  return '';
}

function renderCard(r) {
  const link = r.naver || naverLink(r.name);
  const cat = CAT_STYLE[r.cat] || { bg: '#9E9E9E', emoji: '🍽' };
  const hasImg = r.img && r.img !== 'URL' && r.img !== '';
  const thumb = hasImg
    ? `<div class="card-thumb"><img src="${r.img}" alt="${r.menu || r.name}" loading="lazy" /></div>`
    : `<div class="card-thumb" style="background:${cat.bg}40"><span>${cat.emoji}</span></div>`;

  const honjaOK = ['가능', '좋음', '매우좋음'].includes(r.honja);

  return `
    <div class="card">
      ${thumb}
      <div class="card-body">
        <div class="card-title-row">
          <div class="card-title-left">
            <span class="card-name">${r.name}</span>
            <span class="card-cat-label">· ${r.cat}</span>
          </div>
          <a class="card-arrow" href="${link}" target="_blank" rel="noopener" aria-label="${r.name} 네이버 지도">↗</a>
        </div>
        <p class="card-meta">${r.menu || '-'} · 도보 ${r.walk ?? '?'}분 · ${formatPrice(r.price)}</p>
        ${r.point ? `<p class="card-point">"${r.point}"</p>` : ''}
        <div class="badges">
          ${r.min7 ? '<span class="badge badge-7min">⚡ 7분컷</span>' : ''}
          ${honjaOK ? '<span class="badge badge-honja">👤 혼밥</span>' : ''}
          ${r.safe !== '붐빔' ? '<span class="badge badge-safe">😌 안붐빔</span>' : ''}
          ${r.price && r.price <= 10000 ? '<span class="badge badge-cheap">💸 1만원↓</span>' : ''}
        </div>
      </div>
    </div>
  `;
}

function render() {
  state.filtered = getFiltered();
  const grid = document.getElementById('grid');
  const countText = document.getElementById('countText');

  countText.innerHTML = `<strong>${state.filtered.length}곳</strong> 표시 중`;

  if (state.filtered.length === 0) {
    grid.innerHTML = '<div class="empty">조건에 맞는 식당이 없어요 😅<br><small>필터를 조정해보세요</small></div>';
    return;
  }
  grid.innerHTML = state.filtered.map(renderCard).join('');
}

// --- Category filter ---
document.getElementById('catFilters').addEventListener('click', e => {
  const btn = e.target.closest('.cat-btn');
  if (!btn) return;
  state.category = btn.dataset.cat;
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.toggle('active', b === btn));
  render();
});

// --- Sub filters ---
document.getElementById('subFilters').addEventListener('click', e => {
  const btn = e.target.closest('.sub-btn');
  if (!btn) return;
  const key = btn.dataset.filter;
  state.filters[key] = !state.filters[key];
  btn.classList.toggle('active', state.filters[key]);
  render();
});

// --- Slot machine ---
function setSlotCol(id, top, mid, bot, isFinal) {
  document.getElementById(id).innerHTML = `
    <div class="slot-item slot-dim">${top}</div>
    <div class="slot-item slot-active${isFinal ? ' slot-final' : ''}">${mid}</div>
    <div class="slot-item slot-dim">${bot}</div>
  `;
}

function setSlotCols(prev, curr, next, isFinal) {
  setSlotCol('slotName', prev.name, curr.name, next.name, isFinal);
  setSlotCol('slotMenu',
    prev.menu || prev.cat,
    curr.menu || curr.cat,
    next.menu || next.cat,
    isFinal
  );
  setSlotCol('slotCat', prev.cat, curr.cat, next.cat, isFinal);
}

function showResultInfo(r) {
  const hasImg = r.img && r.img !== 'URL' && r.img !== '';
  const cat = CAT_STYLE[r.cat] || { emoji: '🍽' };

  document.getElementById('resultThumb').innerHTML = hasImg
    ? `<img src="${r.img}" alt="${r.name}" />`
    : cat.emoji;

  document.getElementById('resultName').textContent = r.name;
  document.getElementById('resultCatBadge').textContent = `· ${r.cat}`;
  document.getElementById('resultMeta').textContent =
    `${r.menu || '-'} · 도보 ${r.walk ?? '?'}분 · ${formatPrice(r.price)}`;
  document.getElementById('resultPoint').textContent = r.point ? `"${r.point}"` : '';

  const info = document.getElementById('resultInfo');
  info.classList.remove('hidden');
}

function runSlot(final, label = '오늘의 추천') {
  const pool = state.filtered.length ? state.filtered : restaurants;

  document.getElementById('resultLabel').textContent = label;
  document.getElementById('resultInfo').classList.add('hidden');

  const card = document.getElementById('resultCard');
  card.classList.remove('hidden');
  card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  if (spinInterval) clearInterval(spinInterval);

  let ticks = 0;
  const maxTicks = 20;

  spinInterval = setInterval(() => {
    ticks++;

    if (ticks < maxTicks) {
      const i = Math.floor(Math.random() * pool.length);
      setSlotCols(
        pool[(i - 1 + pool.length) % pool.length],
        pool[i],
        pool[(i + 1) % pool.length],
        false
      );
    } else {
      clearInterval(spinInterval);
      spinInterval = null;

      const fi = pool.indexOf(final) !== -1 ? pool.indexOf(final) : 0;
      setSlotCols(
        pool[(fi - 1 + pool.length) % pool.length],
        final,
        pool[(fi + 1) % pool.length],
        true
      );
      setTimeout(() => showResultInfo(final), 150);
    }
  }, 80);
}

// --- Random pick ---
function pickRandom(list, label) {
  if (!list.length) return;
  const r = list[Math.floor(Math.random() * list.length)];
  runSlot(r, label);
}

document.getElementById('randomBtn').addEventListener('click', () => {
  const pool = state.filtered.length ? state.filtered : restaurants;
  pickRandom(pool, '오늘의 랜덤 점심');
});

document.getElementById('rerollBtn').addEventListener('click', () => {
  const pool = state.filtered.length ? state.filtered : restaurants;
  pickRandom(pool, '다시 뽑기');
});

document.getElementById('confirmBtn').addEventListener('click', () => {
  document.getElementById('resultCard').classList.add('hidden');
});

// --- Weather recommend ---
document.getElementById('weatherRecommendBtn').addEventListener('click', () => {
  const pool = state.filtered.length ? state.filtered : restaurants;
  let candidates = pool;
  let label = '날씨 기반 추천';

  if (state.weather === 'rain') {
    candidates = pool.filter(r => r.cat === '국물');
    label = '비 오는 날엔 국물!';
  } else if (state.weather === 'freeze') {
    candidates = pool.filter(r => r.cat === '국물');
    label = '영하의 날엔 국물이 답!';
  } else if (state.weather === 'cold') {
    candidates = pool.filter(r => r.cat === '국물');
    label = '추운 날엔 뜨끈하게!';
  } else if (state.weather === 'chilly') {
    candidates = pool.filter(r => r.cat === '국물' || r.cat === '고기');
    label = '쌀쌀한 날엔 든든하게!';
  } else if (state.weather === 'warm') {
    candidates = pool.filter(r => r.cat === '가볍게' || r.cat === '면');
    label = '따뜻한 날엔 산뜻하게!';
  } else if (state.weather === 'hot') {
    candidates = pool.filter(r => r.cat === '가볍게' || (r.cat === '면' && r.safe !== '붐빔'));
    label = '더운 날엔 가볍게!';
  }

  if (!candidates.length) candidates = pool;
  pickRandom(candidates, label);
});

// --- Weather API ---
async function loadWeather() {
  try {
    const res = await fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=37.4932&longitude=127.0136&current=temperature_2m,precipitation,weathercode&timezone=Asia/Seoul'
    );
    const data = await res.json();
    const temp = Math.round(data.current.temperature_2m);
    const precip = data.current.precipitation;
    const code = data.current.weathercode;

    let icon, label, sub;

    // 비/눈 우선 처리
    if (precip > 0 || (code >= 51 && code <= 99)) {
      icon = '🌧'; label = `비 · ${temp}°C`; sub = '따뜻한 국물 어때요?';
      state.weather = 'rain';
    } else if (temp <= 0) {
      icon = '❄️'; label = `영하 · ${temp}°C`; sub = '뜨끈한 국물이 간절한 날';
      state.weather = 'freeze';
    } else if (temp <= 7) {
      icon = '🥶'; label = `추움 · ${temp}°C`; sub = '뜨끈한 국물 강추!';
      state.weather = 'cold';
    } else if (temp <= 14) {
      icon = '🧥'; label = `쌀쌀 · ${temp}°C`; sub = '든든하게 먹어요';
      state.weather = 'chilly';
    } else if (temp <= 22) {
      icon = '😊'; label = `적당 · ${temp}°C`; sub = '뭐든 다 맛있는 날';
      state.weather = 'mild';
    } else if (temp <= 27) {
      icon = '🌤'; label = `따뜻 · ${temp}°C`; sub = '산뜻한 메뉴 어때요?';
      state.weather = 'warm';
    } else {
      icon = '🌡'; label = `더움 · ${temp}°C`; sub = '시원하고 가볍게!';
      state.weather = 'hot';
    }

    // 우산 / 썬글라스 팁
    const tipEl = document.getElementById('weatherTip');
    if (state.weather === 'rain') {
      tipEl.innerHTML = `<span class="tip-icon">☂️</span><span class="tip-text">우산 챙기세요</span>`;
    } else if (state.weather === 'hot') {
      tipEl.innerHTML = `<span class="tip-icon">🕶️</span><span class="tip-text">썬글라스 챙기세요</span>`;
    } else {
      tipEl.innerHTML = '';
    }

    document.getElementById('weatherIcon').textContent = icon;
    document.getElementById('weatherLabel').textContent = label;
    document.getElementById('weatherSub').textContent = sub;
  } catch {
    document.getElementById('weatherLabel').textContent = '날씨 정보 없음';
    document.getElementById('weatherSub').textContent = '랜덤 추천을 이용해보세요';
  }
}

// --- Init ---
loadWeather();
render();
