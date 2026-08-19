/* ====== ХРАНИЛИЩЕ ДАННЫХ ====== */
const STORE = {
  students: 'sch2090_students_v1',
  settings: 'sch2090_settings_v1',
  password: 'sch2090_password_v1'
};

function getStudents() {
  try { return JSON.parse(localStorage.getItem(STORE.students)) || []; }
  catch { return []; }
}
function saveStudents(arr) {
  localStorage.setItem(STORE.students, JSON.stringify(arr));
}
function getSettings() {
  try {
    return JSON.parse(localStorage.getItem(STORE.settings)) || {
      autoPromote: false,
      lastPromoteYear: null
    };
  } catch {
    return { autoPromote: false, lastPromoteYear: null };
  }
}
function saveSettings(s) {
  localStorage.setItem(STORE.settings, JSON.stringify(s));
}

/* ====== ДЕМО-ДАННЫЕ ПРИ ПЕРВОМ ЗАПУСКЕ ====== */
function initDemoData() {
  if (getStudents().length > 0) return;
  const demo = [
    { name: 'Алексей Морозов', class: 1, short: 'Победитель школьной олимпиады по окружающему миру', desc: 'Алексей — любознательный первоклассник, который уже в 6 лет научился читать и проявляет огромный интерес к природе и животным.', achievements: ['Победитель олимпиады «Умка» 2024', 'Призёр конкурса рисунков «Мир вокруг нас»'] },
    { name: 'Мария Власова', class: 1, short: 'Лучший читатель класса', desc: 'Мария прочитала более 60 книг за учебный год и стала победителем в школьном конкурсе чтецов.', achievements: ['Победитель конкурса «Живая классика»', 'Призёр конкурса чтецов'] },
    { name: 'Дмитрий Соколов', class: 3, short: 'Призёр городской олимпиады по математике', desc: 'Дмитрий с 5 лет увлекается математикой и уже участвовал в городской олимпиаде.', achievements: ['Призёр олимпиады «Кенгуру» 2024', 'Победитель школьного тура'] },
    { name: 'Анна Петрова', class: 5, short: 'Победитель конкурса «Русский медвежонок»', desc: 'Анна — отличница, любит литературу и русский язык, пишет стихи.', achievements: ['Победитель «Русского медвежонка»', 'Автор школьного литературного журнала'] },
    { name: 'Иван Кузнецов', class: 7, short: 'Призёр ВсОШ по физике', desc: 'Иван — будущий учёный, увлекается физикой и астрономией.', achievements: ['Призёр школьного этапа ВсОШ по физике', 'Участник научной конференции'] },
    { name: 'София Иванова', class: 7, short: 'Победитель конкурса «Британский бульдог»', desc: 'София свободно владеет английским языком и представляет школу на языковых олимпиадах.', achievements: ['Победитель «Британского бульдога»', 'Призёр олимпиады по английскому языку'] },
    { name: 'Артём Новиков', class: 9, short: 'Призёр регионального этапа ВсОШ по информатике', desc: 'Артём — программист, победитель хакатонов и соревнований по робототехнике.', achievements: ['Призёр регионального этапа ВсОШ по информатике', 'Победитель городского хакатона'] },
    { name: 'Екатерина Лебедева', class: 9, short: 'Победитель олимпиады по обществознанию', desc: 'Екатерина — староста школы, активистка, участница волонтёрского движения.', achievements: ['Победитель школьного этапа ВсОШ по обществознанию', 'Лидер волонтёрского отряда школы'] },
    { name: 'Михаил Зайцев', class: 11, short: 'Победитель ВсОШ по химии', desc: 'Михаил — выпускник, поступает в МГУ на химический факультет.', achievements: ['Победитель муниципального этапа ВсОШ по химии', 'Призёр регионального этапа'] },
    { name: 'Дарья Орлова', class: 11, short: 'Победитель олимпиады по литературе', desc: 'Дарья — автор сборника стихов, призёр литературных конкурсов всероссийского уровня.', achievements: ['Призёр ВсОШ по литературе', 'Автор сборника стихов «Первая строка»'] },
    { name: 'Никита Волков', class: 11, short: 'Чемпион Москвы по плаванию', desc: 'Никита — кандидат в мастера спорта по плаванию, многократный призёр соревнований.', achievements: ['Чемпион Москвы по плаванию 2024', 'КМС по плаванию'] }
  ];
  const students = demo.map((d, i) => ({
    id: 'demo-' + i + '-' + Date.now(),
    name: d.name,
    shortDesc: d.short,
    description: d.desc,
    achievements: d.achievements.join('\n'),
    photo: '',
    class: d.class,
    alumni: false,
    year: null,
    createdAt: Date.now() + i
  }));
  saveStudents(students);
}

/* ====== АВТОМАТИЧЕСКИЙ ПЕРЕВОД КЛАССА ====== */
function checkAutoPromote() {
  const settings = getSettings();
  if (!settings.autoPromote) return;

  const now = new Date();
  const currentYear = now.getFullYear();
  const promoteDate = new Date(currentYear, 8, 1, 0, 0, 0);

  if (now >= promoteDate && settings.lastPromoteYear !== currentYear) {
    promoteStudents();
    settings.lastPromoteYear = currentYear;
    saveSettings(settings);
    console.log(`Автоматический перевод выполнен ${currentDateStr()}`);
  }
}

function promoteStudents() {
  const students = getStudents();
  const currentYear = new Date().getFullYear();
  let promoted = 0, alumni = 0;
  
  students.forEach(s => {
    if (s.alumni) return;
    if (s.class >= 11) {
      s.alumni = true;
      s.year = currentYear;
      s.class = null;
      alumni++;
    } else {
      s.class = (s.class || 0) + 1;
      promoted++;
    }
  });
  
  saveStudents(students);
  return { promoted, alumni };
}

function currentDateStr() {
  return new Date().toLocaleDateString('ru-RU', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
}

/* ====== ОТРИСОВКА ГЛАВНОЙ СТРАНИЦЫ ====== */
const classNav = document.getElementById('classNav');
const studentsGrid = document.getElementById('studentsGrid');
const alumniGrid = document.getElementById('alumniGrid');
const alumniEmpty = document.getElementById('alumniEmpty');
const emptyState = document.getElementById('emptyState');
const statTotal = document.getElementById('statTotal');
const statAlumni = document.getElementById('statAlumni');
const yearEl = document.getElementById('year');

let activeClass = 1;

function renderClassNav(students) {
  if (!classNav) return;
  const classCounts = {};
  for (let i = 1; i <= 11; i++) classCounts[i] = 0;
  students.forEach(s => {
    if (!s.alumni && s.class >= 1 && s.class <= 11) {
      classCounts[s.class] = (classCounts[s.class] || 0) + 1;
    }
  });

  classNav.innerHTML = '';
  for (let i = 1; i <= 11; i++) {
    const btn = document.createElement('button');
    btn.className = 'class-btn' + (i === activeClass ? ' active' : '');
    btn.innerHTML = `${i} класс <span class="count">${classCounts[i]}</span>`;
    btn.addEventListener('click', () => {
      activeClass = i;
      renderClassNav(getStudents());
      renderStudents();
      document.getElementById('classes').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    classNav.appendChild(btn);
  }
}

function renderStudents() {
  if (!studentsGrid) return;
  const students = getStudents();
  const filtered = students.filter(s => !s.alumni && s.class === activeClass);
  
  studentsGrid.innerHTML = '';
  
  if (filtered.length === 0) {
    studentsGrid.style.display = 'none';
    if (emptyState) emptyState.hidden = false;
    return;
  }
  
  studentsGrid.style.display = '';
  if (emptyState) emptyState.hidden = true;
  
  filtered.forEach((s, i) => {
    studentsGrid.appendChild(createStudentCard(s, i));
  });
}

function renderAlumni() {
  if (!alumniGrid) return;
  const students = getStudents();
  const alumni = students.filter(s => s.alumni);
  
  alumniGrid.innerHTML = '';
  
  if (alumni.length === 0) {
    alumniGrid.style.display = 'none';
    if (alumniEmpty) alumniEmpty.hidden = false;
    return;
  }
  
  alumniGrid.style.display = '';
  if (alumniEmpty) alumniEmpty.hidden = true;
  
  alumni
    .sort((a, b) => (b.year || 0) - (a.year || 0))
    .forEach((s, i) => {
      alumniGrid.appendChild(createStudentCard(s, i));
    });
}

function createStudentCard(s, index) {
  const card = document.createElement('div');
  card.className = 'student-card';
  card.style.animationDelay = (index * 0.05) + 's';
  
  const photoHtml = s.photo
    ? `<img src="${s.photo}" alt="${escapeHtml(s.name)}" loading="lazy">`
    : `<div class="student-photo-placeholder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/></svg></div>`;
  
  // Новая логика ярлычка
  const badgeHtml = s.alumni 
    ? `<div class="student-badge alumni-circle">${s.year || ''}</div>`
    : `<div class="student-badge">${s.class} класс</div>`;
  
  card.innerHTML = `
    <div class="student-photo">
      ${photoHtml}
      ${badgeHtml}
    </div>
    <div class="student-info">
      <h3 class="student-name">${escapeHtml(s.name)}</h3>
      ${s.shortDesc ? `<p class="student-short">${escapeHtml(s.shortDesc)}</p>` : ''}
    </div>
  `;
  
  card.addEventListener('click', () => openStudentModal(s));
  return card;
}

function openStudentModal(s) {
  const modal = document.getElementById('studentModal');
  const body = document.getElementById('modalBody');
  const photoHtml = s.photo
    ? `<img src="${s.photo}" alt="${escapeHtml(s.name)}">`
    : `<div class="student-photo-placeholder" style="width:100%;height:100%"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/></svg></div>`;
  
  const badgeText = s.alumni 
    ? (s.year ? `Выпускник ${s.year} года` : 'Выпускник')
    : `${s.class} класс`;
  
  const achievements = (s.achievements || '').split('\n').filter(a => a.trim());
  const achievementsHtml = achievements.length
    ? `<div class="modal-detail-section-title">Достижения</div><ul class="modal-detail-achievements">${achievements.map(a => `<li>${escapeHtml(a)}</li>`).join('')}</ul>`
    : '';
  
  body.innerHTML = `
    <div class="modal-detail-photo">${photoHtml}</div>
    <div class="modal-detail-body">
      <span class="modal-detail-badge">${badgeText}</span>
      <h2 class="modal-detail-name">${escapeHtml(s.name)}</h2>
      ${s.description ? `<p class="modal-detail-desc">${escapeHtml(s.description)}</p>` : ''}
      ${achievementsHtml}
    </div>
  `;
  
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeStudentModal() {
  const modal = document.getElementById('studentModal');
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function updateStats() {
  const students = getStudents();
  const active = students.filter(s => !s.alumni).length;
  const alumni = students.filter(s => s.alumni).length;
  if (statTotal) animateNumber(statTotal, active);
  if (statAlumni) animateNumber(statAlumni, alumni);
}

function animateNumber(el, target) {
  const start = parseInt(el.textContent) || 0;
  const duration = 1000;
  const startTime = performance.now();
  function tick(now) {
    const t = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(start + (target - start) * eased);
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* ====== МОБИЛЬНОЕ МЕНЮ ====== */
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.querySelector('.main-nav');
if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    mainNav.classList.toggle('open');
  });
  mainNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      mainNav.classList.remove('open');
    });
  });
}

/* ====== МОДАЛЬНОЕ ОКНО ====== */
document.addEventListener('click', (e) => {
  if (e.target.matches('[data-close]') || e.target.closest('[data-close]')) {
    closeStudentModal();
  }
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeStudentModal();
});

/* ====== ИНИЦИАЛИЗАЦИЯ ====== */
function init() {
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  initDemoData();
  checkAutoPromote();
  renderClassNav(getStudents());
  renderStudents();
  renderAlumni();
  updateStats();
}

init();