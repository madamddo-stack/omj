const SHEET_URL = 'https://script.google.com/macros/s/AKfycbxdocDjKI_oS7iJde-DIH6WgX1FiKogdRviTbeAXSn0FUAxNaAyqr24CZ2lAlnm3ucf/exec';
let restaurants = [];

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
  picked: null,
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
          <a class="card-arrow" href="${link}" target="_blank" rel="noopener" aria-label="${r.name} 네이버 지도"><span class="material-icons mi-sm">open_in_new</span></a>
        </div>
        <p class="card-meta">${r.menu || '-'} · 도보 ${r.walk ?? '?'}분 · ${formatPrice(r.price)}</p>
        ${r.point ? `<p class="card-point">"${r.point}"</p>` : ''}
        <div class="badges">
          ${r.min7 ? '<span class="badge badge-7min"><span class="material-icons mi-xs">bolt</span> 7분컷</span>' : ''}
          ${honjaOK ? '<span class="badge badge-honja"><span class="material-icons mi-xs">person</span> 혼밥</span>' : ''}
          ${r.safe !== '붐빔' ? '<span class="badge badge-safe"><span class="material-icons mi-xs">sentiment_satisfied</span> 안붐빔</span>' : ''}
          ${r.price && r.price <= 10000 ? '<span class="badge badge-cheap"><span class="material-icons mi-xs">payments</span> 1만원↓</span>' : ''}
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

  document.getElementById('modalOverlay').classList.remove('hidden');

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
      state.picked = final;
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

function closeModal() {
  document.getElementById('modalOverlay').classList.add('hidden');
}

document.getElementById('confirmBtn').addEventListener('click', () => {
  if (state.picked) {
    const link = state.picked.naver || naverLink(state.picked.name);
    window.open(link, '_blank', 'noopener');
  }
  closeModal();
});

// 오버레이 바깥 클릭 시 닫기
document.getElementById('modalOverlay').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeModal();
});

// ESC 키로 닫기
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

// --- Weather hero 자동 추천 ---
function getWeatherCandidates() {
  if (state.weather === 'rain' || state.weather === 'freeze' || state.weather === 'cold')
    return restaurants.filter(r => r.cat === '국물');
  if (state.weather === 'chilly')
    return restaurants.filter(r => r.cat === '국물' || r.cat === '고기');
  if (state.weather === 'warm')
    return restaurants.filter(r => r.cat === '가볍게' || r.cat === '면');
  if (state.weather === 'hot')
    return restaurants.filter(r => r.cat === '가볍게' || r.cat === '면');
  return restaurants;
}

function renderHeroRec() {
  const pool = getWeatherCandidates();
  if (!pool.length) return;
  const r = pool[Math.floor(Math.random() * pool.length)];
  const link = r.naver || naverLink(r.name);
  document.getElementById('heroRec').innerHTML = `
    <div class="hero-rec-name">${r.name}</div>
    <div class="hero-rec-menu">${r.menu || r.cat}</div>
    <div class="hero-rec-meta">도보 ${r.walk ?? '?'}분 · ${formatPrice(r.price)}</div>
    <a class="hero-rec-link" href="${link}" target="_blank" rel="noopener">
      <span class="material-icons mi-xs">open_in_new</span> 지도
    </a>
  `;
}

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

    // 히어로 카드 설정
    const HERO = {
      rain:   { bg: '#D6E8F5', deco: '🌧', heroLabel: '🌧 Rainy',       msg: '비 오는 날엔\n따뜻한 국물 한 그릇\n어떠세요?' },
      freeze: { bg: '#D8ECF9', deco: '❄️', heroLabel: '❄️ Freezing',    msg: '꽁꽁 언 오늘\n뜨끈한 국물이\n간절한 날이에요' },
      cold:   { bg: '#D8ECF9', deco: '🥶', heroLabel: '🥶 Cold',         msg: '추운 날엔\n뜨끈한 국물로\n속을 채워요' },
      chilly: { bg: '#EDE0D4', deco: '🧥', heroLabel: '🧥 Chilly',       msg: '쌀쌀한 오늘\n든든한 한 끼로\n따뜻하게 시작해요' },
      mild:   { bg: '#E6EFDF', deco: '😊', heroLabel: '😊 Perfect',      msg: '딱 좋은 날씨\n오늘은 뭐든\n다 맛있어요' },
      warm:   { bg: '#FFF3CD', deco: '🌤', heroLabel: '🌤 Warm',         msg: '따뜻한 오늘\n산뜻한 메뉴로\n가볍게 가볼까요?' },
      hot:    { bg: '#F6C36B', deco: '☁️', heroLabel: '🌡 Sunny & Hot',  msg: '무더운 오늘\n시원한 면 메뉴로\n가볍게 가볼까요?' },
    };
    const h = HERO[state.weather];
    if (h) {
      const hero = document.getElementById('weatherHero');
      hero.style.background = h.bg;
      document.getElementById('heroLabel').textContent = h.heroLabel;
      document.getElementById('heroMsg').textContent = h.msg;
      document.getElementById('heroDeco').textContent = h.deco;
      hero.classList.remove('hidden');
      renderHeroRec();
    }
  } catch {
    document.getElementById('weatherLabel').textContent = '날씨 정보 없음';
    document.getElementById('weatherSub').textContent = '랜덤 추천을 이용해보세요';
  }
}

// --- Init ---
async function init() {
  document.getElementById('grid').innerHTML = '<div class="empty">데이터 불러오는 중…</div>';
  try {
    const res = await fetch(SHEET_URL);
    restaurants = await res.json();
  } catch {
    document.getElementById('grid').innerHTML = '<div class="empty">데이터를 불러올 수 없어요 😅<br><small>잠시 후 새로고침 해보세요</small></div>';
    return;
  }
  loadWeather();
  render();
}
init();
