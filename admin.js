/* ====== КОНФИГУРАЦИЯ EMAILJS ====== */
const EMAILJS_CONFIG = {
  publicKey: 'm_EQVhRH6QurkJZhe',     
  serviceId: 'service_0z0jsrk',      
  templateId: 'template_f7gkvnr'     
};

/* ====== ХРАНИЛИЩЕ ====== */
const STORE = {
  students: 'sch2090_students_v1',
  settings: 'sch2090_settings_v1',
  password: 'sch2090_password_hash_v1', // Ключ для хранения хэша пароля
  session: 'sch2090_session_v1'
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

/* ====== ХЭШИРОВАНИЕ И БЕЗОПАСНОСТЬ ====== */
// Функция хэширования SHA-256 с использованием встроенного Web Crypto API
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Инициализация пароля по умолчанию (admin2090 в Base64)
async function initPassword() {
  if (!localStorage.getItem(STORE.password)) {
    // Base64 от "admin2090" -> YWRtaW4yMDkw
    const defaultPwd = atob("YWRtaW4yMDkw"); 
    const hash = await sha256(defaultPwd);
    localStorage.setItem(STORE.password, hash);
  }
}

function isLoggedIn() {
  return sessionStorage.getItem(STORE.session) === 'true';
}
function setLoggedIn(v) {
  if (v) sessionStorage.setItem(STORE.session, 'true');
  else sessionStorage.removeItem(STORE.session);
}

/* ====== ДЕМО-ДАННЫЕ ====== */
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

/* ====== АВТО-ПЕРЕВОД ====== */
function checkAutoPromote() {
  const settings = getSettings();
  if (!settings.autoPromote) return;
  const now = new Date();
  const currentYear = now.getFullYear();
  const promoteDate = new Date(currentYear, 8, 1, 0, 0, 0);
  if (now >= promoteDate && settings.lastPromoteYear !== currentYear) {
    const result = promoteStudents();
    settings.lastPromoteYear = currentYear;
    saveSettings(settings);
    console.log(`Авто-перевод: +${result.promoted} класс, ${result.alumni} выпускников`);
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

/* ====== СЖАТИЕ ИЗОБРАЖЕНИЯ ====== */
function compressImage(file, maxSize = 900, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        if (width > height) {
          if (width > maxSize) { height = Math.round(height * maxSize / width); width = maxSize; }
        } else {
          if (height > maxSize) { width = Math.round(width * maxSize / height); height = maxSize; }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* ====== УТИЛИТЫ ====== */
function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
function uuid() {
  return 's-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9);
}
function showToast(msg, type = '') {
  const toast = document.getElementById('toast');
  if (!toast) return alert(msg);
  toast.textContent = msg;
  toast.className = 'toast show ' + type;
  clearTimeout(toast._t);
  toast._t = setTimeout(() => { toast.className = 'toast ' + type; }, 3000);
}
function formatDate(year) {
  if (!year) return '—';
  return `1 сентября ${year} года`;
}

/* ====== АВТОРИЗАЦИЯ И ВОССТАНОВЛЕНИЕ ====== */
const loginScreen = document.getElementById('loginScreen');
const dashboard = document.getElementById('dashboard');
const loginForm = document.getElementById('loginForm');

function showLogin() {
  if (loginScreen) loginScreen.style.display = 'flex';
  if (dashboard) dashboard.hidden = true;
}
function showDashboard() {
  if (loginScreen) loginScreen.style.display = 'none';
  if (dashboard) dashboard.hidden = false;
  renderDashboard();
}

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const pwd = document.getElementById('passwordInput').value;
    const inputHash = await sha256(pwd);
    const storedHash = localStorage.getItem(STORE.password);
    
    if (inputHash === storedHash) {
      setLoggedIn(true);
      showDashboard();
      showToast('Добро пожаловать!', 'success');
    } else {
      showToast('Неверный пароль', 'error');
    }
  });
}

document.getElementById('logoutBtn')?.addEventListener('click', () => {
  setLoggedIn(false);
  showLogin();
  document.getElementById('passwordInput').value = '';
});

// Инициализация EmailJS
function initEmailJS() {
  if (typeof emailjs !== 'undefined' && EMAILJS_CONFIG.publicKey !== 'ВАШ_PUBLIC_KEY') {
    emailjs.init({
      publicKey: EMAILJS_CONFIG.publicKey,
    });
  }
}

// Обработка кнопки "Забыл пароль"
document.getElementById('forgotPasswordLink')?.addEventListener('click', async (e) => {
  e.preventDefault();
  
  if (EMAILJS_CONFIG.publicKey === 'ВАШ_PUBLIC_KEY') {
    alert('Восстановление пароля не настроено. Обратитесь к разработчику.');
    return;
  }

  if (!confirm('Сгенерировать новый временный пароль и отправить его на почту администратора?')) {
    return;
  }

  // Генерируем случайный временный пароль
  const tempPassword = Math.random().toString(36).slice(-8);
  const tempHash = await sha256(tempPassword);

  // Сохраняем новый хэш пароля
  localStorage.setItem(STORE.password, tempHash);

  // Параметры для отправки письма
  const templateParams = {
    temp_password: tempPassword
  };

  showToast('Отправка письма...', '');

  try {
    await emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, templateParams);
    showToast('Новый пароль отправлен на почту администратора!', 'success');
  } catch (error) {
    console.error('EmailJS error:', error);
    showToast('Ошибка отправки письма. Проверьте настройки EmailJS.', 'error');
  }
});

/* ====== РЕНДЕР ДАШБОРДА ====== */
function renderDashboard() {
  const students = getStudents();
  const active = students.filter(s => !s.alumni).length;
  const alumni = students.filter(s => s.alumni).length;
  
  document.getElementById('adminStatTotal').textContent = active;
  document.getElementById('adminStatAlumni').textContent = alumni;
  
  renderSettings();
  renderTable();
}

/* ====== НАСТРОЙКИ ====== */
function renderSettings() {
  const settings = getSettings();
  const toggle = document.getElementById('autoPromoteToggle');
  const lastDate = document.getElementById('lastPromoteDate');
  const status = document.getElementById('autoStatus');
  
  toggle.checked = settings.autoPromote;
  lastDate.textContent = settings.lastPromoteYear ? formatDate(settings.lastPromoteYear) : '—';
  status.textContent = settings.autoPromote ? 'Включено ✓' : 'Отключено';
  status.style.color = settings.autoPromote ? 'var(--success)' : 'var(--text-muted)';
}

document.getElementById('autoPromoteToggle')?.addEventListener('change', (e) => {
  const settings = getSettings();
  settings.autoPromote = e.target.checked;
  saveSettings(settings);
  renderSettings();
  showToast(
    e.target.checked 
      ? 'Авто-перевод включён. Ученики будут переведены 1 сентября.' 
      : 'Авто-перевод отключён.',
    e.target.checked ? 'success' : ''
  );
});

document.getElementById('manualPromoteBtn')?.addEventListener('click', () => {
  if (!confirm('Перевести всех учеников в следующий класс прямо сейчас? Выпускники 11-го класса будут перенесены в раздел «Выпускники».')) return;
  const result = promoteStudents();
  const settings = getSettings();
  settings.lastPromoteYear = new Date().getFullYear();
  saveSettings(settings);
  renderDashboard();
  showPromoteAlert(`Готово! Переведено в следующий класс: ${result.promoted}. Стало выпускниками: ${result.alumni}.`, 'success');
  showToast('Перевод выполнен', 'success');
});

function showPromoteAlert(msg, type = 'info') {
  const alert = document.getElementById('promoteAlert');
  alert.textContent = msg;
  alert.className = 'alert alert-' + type;
  alert.hidden = false;
  setTimeout(() => { alert.hidden = true; }, 6000);
}

/* ====== СМЕНА ПАРОЛЯ ====== */
const changePwdForm = document.getElementById('changePasswordForm');
changePwdForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const oldPwd = document.getElementById('oldPassword').value;
  const newPwd = document.getElementById('newPassword').value;
  const confirmPwd = document.getElementById('confirmPassword').value;

  const oldHash = await sha256(oldPwd);
  const storedHash = localStorage.getItem(STORE.password);

  if (oldHash !== storedHash) {
    showPasswordAlert('Текущий пароль введен неверно.', 'error');
    return;
  }
  if (newPwd.length < 4) {
    showPasswordAlert('Новый пароль слишком короткий. Минимум 4 символа.', 'error');
    return;
  }
  if (newPwd !== confirmPwd) {
    showPasswordAlert('Новый пароль и подтверждение не совпадают.', 'error');
    return;
  }

  // Сохраняем хэш нового пароля
  const newHash = await sha256(newPwd);
  localStorage.setItem(STORE.password, newHash);
  
  changePwdForm.reset();
  showPasswordAlert('Пароль успешно изменён!', 'success');
  showToast('Пароль обновлён', 'success');
});

function showPasswordAlert(msg, type = 'info') {
  const alert = document.getElementById('passwordAlert');
  if (!alert) return;
  alert.textContent = msg;
  alert.className = 'alert alert-' + (type === 'error' ? 'warning' : 'success');
  alert.hidden = false;
  setTimeout(() => { alert.hidden = true; }, 5000);
}

/* ====== ТАБЛИЦА ====== */
function renderTable() {
  const tbody = document.getElementById('studentsTableBody');
  const empty = document.getElementById('adminEmpty');
  const filterClass = document.getElementById('filterClass').value;
  const search = document.getElementById('searchInput').value.toLowerCase().trim();
  
  let students = getStudents();
  
  if (filterClass === 'alumni') {
    students = students.filter(s => s.alumni);
  } else if (filterClass !== 'all') {
    students = students.filter(s => !s.alumni && s.class === parseInt(filterClass));
  }
  
  if (search) {
    students = students.filter(s => s.name.toLowerCase().includes(search));
  }
  
  students.sort((a, b) => {
    if (a.alumni && !b.alumni) return 1;
    if (!a.alumni && b.alumni) return -1;
    if (a.alumni && b.alumni) return (b.year || 0) - (a.year || 0);
    return (a.class || 0) - (b.class || 0);
  });
  
  tbody.innerHTML = '';
  if (students.length === 0) {
    document.querySelector('.table-wrap').style.display = 'none';
    if (empty) empty.hidden = false;
    return;
  }
  document.querySelector('.table-wrap').style.display = '';
  if (empty) empty.hidden = true;
  
  students.forEach(s => {
    const tr = document.createElement('tr');
    const photoCell = s.photo
      ? `<img src="${s.photo}" class="table-photo" alt="">`
      : `<div class="table-photo-placeholder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/></svg></div>`;
    
    const classBadge = s.alumni
      ? `<span class="table-class alumni">Выпуск ${s.year || ''}</span>`
      : `<span class="table-class">${s.class} класс</span>`;
    
    tr.innerHTML = `
      <td>${photoCell}</td>
      <td><strong>${escapeHtml(s.name)}</strong></td>
      <td>${classBadge}</td>
      <td><div class="table-desc">${escapeHtml(s.shortDesc || s.description || '—')}</div></td>
      <td>
        <div class="table-actions">
          <button class="icon-btn" data-edit="${s.id}" title="Редактировать">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="icon-btn danger" data-delete="${s.id}" title="Удалить">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z"/></svg>
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
  
  tbody.querySelectorAll('[data-edit]').forEach(btn => {
    btn.addEventListener('click', () => openEditForm(btn.dataset.edit));
  });
  tbody.querySelectorAll('[data-delete]').forEach(btn => {
    btn.addEventListener('click', () => deleteStudent(btn.dataset.delete));
  });
}

document.getElementById('filterClass')?.addEventListener('change', renderTable);
document.getElementById('searchInput')?.addEventListener('input', renderTable);

/* ====== ФОРМА УЧЕНИКА ====== */
const formModal = document.getElementById('studentFormModal');
const studentForm = document.getElementById('studentForm');
const formTitle = document.getElementById('formTitle');
const photoFile = document.getElementById('photoFile');
const photoUrl = document.getElementById('photoUrl');
const photoPreview = document.getElementById('photoPreview');
let currentPhotoData = '';

function openAddForm() {
  formTitle.textContent = 'Новый ученик';
  studentForm.reset();
  document.getElementById('studentId').value = '';
  currentPhotoData = '';
  updatePhotoPreview('');
  openModal(formModal);
}

function openEditForm(id) {
  const s = getStudents().find(x => x.id === id);
  if (!s) return;
  formTitle.textContent = 'Редактировать ученика';
  document.getElementById('studentId').value = s.id;
  document.getElementById('studentName').value = s.name;
  document.getElementById('studentClass').value = s.class || 1;
  document.getElementById('studentShort').value = s.shortDesc || '';
  document.getElementById('studentDesc').value = s.description || '';
  document.getElementById('studentAchievements').value = s.achievements || '';
  document.getElementById('photoUrl').value = '';
  currentPhotoData = s.photo || '';
  updatePhotoPreview(s.photo);
  openModal(formModal);
}

function deleteStudent(id) {
  const s = getStudents().find(x => x.id === id);
  if (!s) return;
  if (!confirm(`Удалить ученика «${s.name}»? Это действие нельзя отменить.`)) return;
  saveStudents(getStudents().filter(x => x.id !== id));
  renderTable();
  renderDashboard();
  showToast('Ученик удалён', 'success');
}

function updatePhotoPreview(photo) {
  if (photo) {
    photoPreview.innerHTML = `<img src="${photo}" alt="">`;
  } else {
    photoPreview.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/></svg><span>Нет фото</span>`;
  }
}

photoFile?.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    showToast('Выберите изображение', 'error');
    return;
  }
  if (file.size > 10 * 1024 * 1024) {
    showToast('Файл слишком большой (макс. 10 МБ)', 'error');
    return;
  }
  try {
    showToast('Обработка фото...');
    const compressed = await compressImage(file);
    currentPhotoData = compressed;
    document.getElementById('photoUrl').value = '';
    updatePhotoPreview(compressed);
  } catch (err) {
    showToast('Ошибка обработки изображения', 'error');
  }
});

photoUrl?.addEventListener('input', (e) => {
  const url = e.target.value.trim();
  if (url) {
    currentPhotoData = url;
    updatePhotoPreview(url);
  } else if (!currentPhotoData.startsWith('data:')) {
    currentPhotoData = '';
    updatePhotoPreview('');
  }
});

studentForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const id = document.getElementById('studentId').value;
  const name = document.getElementById('studentName').value.trim();
  const cls = parseInt(document.getElementById('studentClass').value);
  const short = document.getElementById('studentShort').value.trim();
  const desc = document.getElementById('studentDesc').value.trim();
  const achievements = document.getElementById('studentAchievements').value.trim();
  
  if (!name) {
    showToast('Введите имя ученика', 'error');
    return;
  }
  
  const students = getStudents();
  
  if (id) {
    const idx = students.findIndex(s => s.id === id);
    if (idx === -1) return;
    students[idx] = {
      ...students[idx],
      name, class: cls, shortDesc: short,
      description: desc, achievements, photo: currentPhotoData
    };
    showToast('Изменения сохранены', 'success');
  } else {
    students.push({
      id: uuid(),
      name, class: cls, shortDesc: short,
      description: desc, achievements,
      photo: currentPhotoData,
      alumni: false, year: null,
      createdAt: Date.now()
    });
    showToast('Ученик добавлен', 'success');
  }
  
  saveStudents(students);
  closeModal(formModal);
  renderDashboard();
});

document.getElementById('addStudentBtn')?.addEventListener('click', openAddForm);

/* ====== УПРАВЛЕНИЕ МОДАЛКОЙ ====== */
function openModal(modal) {
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeModal(modal) {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
/* ====== ЭКСПОРТ / ИМПОРТ ДАННЫХ ====== */
const exportBtn = document.getElementById('exportBtn');
const importBtn = document.getElementById('importBtn');
const importFile = document.getElementById('importFile');
const backupAlert = document.getElementById('backupAlert');

function showBackupAlert(msg, type = 'info') {
  if (!backupAlert) return;
  backupAlert.textContent = msg;
  backupAlert.className = 'alert alert-' + (type === 'error' ? 'warning' : 'success');
  backupAlert.hidden = false;
  setTimeout(() => { backupAlert.hidden = true; }, 6000);
}

// Экспорт данных в JSON-файл
exportBtn?.addEventListener('click', () => {
  const data = {
    version: 1,
    exportDate: new Date().toISOString(),
    school: "Школа № 2090 им. Героя Советского Союза Л.Х. Паперника",
    students: getStudents(),
    settings: getSettings()
    // Внимание: пароль не экспортируем!
  };
  
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const dateStr = new Date().toISOString().slice(0, 10);
  const a = document.createElement('a');
  a.href = url;
  a.download = `school-2090-backup-${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  showToast('Файл резервной копии сохранён', 'success');
  showBackupAlert(`Резервная копия от ${new Date().toLocaleString('ru-RU')} успешно создана. Сохраните файл в надёжное место.`, 'success');
});

// Кнопка "Импортировать" открывает диалог выбора файла
importBtn?.addEventListener('click', () => {
  importFile.click();
});

// Обработка выбранного файла
importFile?.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  try {
    const text = await file.text();
    const data = JSON.parse(text);
    
    // Проверка структуры файла
    if (!data.students || !Array.isArray(data.students)) {
      throw new Error('Неверный формат файла');
    }
    
    const currentCount = getStudents().length;
    const newCount = data.students.length;
    
    let msg = `В файле найдено учеников: ${newCount}.\n`;
    if (currentCount > 0) {
      msg += `Сейчас в базе: ${currentCount}.\n\n`;
      msg += `Выберите действие:\n`;
      msg += `• OK — ЗАМЕНИТЬ все данные данными из файла (текущие будут удалены)\n`;
      msg += `• Отмена — отказаться от импорта`;
      
      if (!confirm(msg)) {
        importFile.value = '';
        return;
      }
      // Полная замена
      saveStudents(data.students);
    } else {
      // В базе пусто — просто добавляем
      saveStudents(data.students);
    }
    
    // Импортируем настройки, если они есть
    if (data.settings) {
      saveSettings(data.settings);
    }
    
    renderDashboard();
    showBackupAlert(`Импорт завершён! Загружено учеников: ${newCount}.`, 'success');
    showToast('Данные импортированы', 'success');
    
  } catch (err) {
    console.error('Import error:', err);
    showBackupAlert('Ошибка импорта: файл повреждён или имеет неверный формат.', 'error');
    showToast('Ошибка импорта файла', 'error');
  }
  
  // Сбрасываем input, чтобы можно было выбрать тот же файл повторно
  importFile.value = '';
});
document.querySelectorAll('[data-close]').forEach(el => {
  el.addEventListener('click', () => {
    closeModal(formModal);
  });
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal(formModal);
});

/* ====== ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ ====== */
async function init() {
  initDemoData();
  await initPassword(); // Ждем инициализацию хэша пароля
  initEmailJS();        // Инициализируем сервис почты
  
  if (isLoggedIn()) {
    showDashboard();
  } else {
    showLogin();
  }
}

init();
