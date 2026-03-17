/* ========================================================
   AURA SHOP — script.js
   Полная логика: товары, корзина, избранное, заказы, аккаунт
   ======================================================== */

/* =========================================================
   1. БАЗА ДАННЫХ ТОВАРОВ
   ========================================================= */
const PRODUCTS = [
  {
    id: 1,
    name: 'Оверсайз футболка',
    category: 'Одежда',
    price: 2490,
    oldPrice: 3200,
    emoji: '👕',
    badge: 'Хит',
    desc: 'Мягкая хлопковая футболка оверсайз с уникальным принтом. Идеальна для повседневного образа.'
  },
  {
    id: 2,
    name: 'Худи Premium',
    category: 'Одежда',
    price: 5990,
    oldPrice: null,
    emoji: '🧥',
    badge: 'Новинка',
    desc: 'Тёплое худи из флиса с капюшоном. Элегантный крой и фиолетовые акценты.'
  },
  {
    id: 3,
    name: 'Кроссовки Air Aura',
    category: 'Обувь',
    price: 9990,
    oldPrice: 12500,
    emoji: '👟',
    badge: 'Скидка',
    desc: 'Лёгкие кроссовки с амортизирующей подошвой. Поддержка стопы и стиль в одном.'
  },
  {
    id: 4,
    name: 'Кеды Low Profile',
    category: 'Обувь',
    price: 6490,
    oldPrice: null,
    emoji: '👞',
    badge: null,
    desc: 'Классические низкие кеды для городского стиля. Натуральная кожа, анатомическая стелька.'
  },
  {
    id: 5,
    name: 'Чёрные джинсы Slim',
    category: 'Одежда',
    price: 4290,
    oldPrice: 5200,
    emoji: '👖',
    badge: 'Скидка',
    desc: 'Зауженные джинсы с высокой посадкой. Стрейч-ткань — комфорт на весь день.'
  },
  {
    id: 6,
    name: 'Панама Aura Logo',
    category: 'Аксессуары',
    price: 1890,
    oldPrice: null,
    emoji: '🎩',
    badge: null,
    desc: 'Стильная панама с логотипом Aura Shop. Защита от солнца и модный акцент образа.'
  },
  {
    id: 7,
    name: 'Рюкзак Urban Pack',
    category: 'Аксессуары',
    price: 7490,
    oldPrice: 8800,
    emoji: '🎒',
    badge: 'Хит',
    desc: '20-литровый рюкзак с отделением для ноутбука. Водонепроницаемый материал.'
  },
  {
    id: 8,
    name: 'Спортивные шорты',
    category: 'Спорт',
    price: 2190,
    oldPrice: null,
    emoji: '🩳',
    badge: 'Новинка',
    desc: 'Лёгкие дышащие шорты для тренировок и активного отдыха.'
  },
  {
    id: 9,
    name: 'Носки Logo Pack (5 пар)',
    category: 'Аксессуары',
    price: 990,
    oldPrice: 1400,
    emoji: '🧦',
    badge: 'Скидка',
    desc: 'Набор из 5 пар носков с фирменным логотипом Aura. Хлопок 80%.'
  },
  {
    id: 10,
    name: 'Спортивный костюм',
    category: 'Спорт',
    price: 8490,
    oldPrice: null,
    emoji: '🩱',
    badge: 'Новинка',
    desc: 'Флисовый спортивный костюм — куртка + брюки. Для зала и улицы.'
  },
  {
    id: 11,
    name: 'Цепочка Aura Silver',
    category: 'Аксессуары',
    price: 3290,
    oldPrice: null,
    emoji: '📿',
    badge: null,
    desc: 'Серебряная цепочка с фирменным подвесом-кристаллом. Стальной сплав.'
  },
  {
    id: 12,
    name: 'Бомбер Varsity',
    category: 'Одежда',
    price: 10990,
    oldPrice: 14500,
    emoji: '🧤',
    badge: 'Хит',
    desc: 'Культовый бомбер в университетском стиле. Плотная ткань, вышитый логотип.'
  }
];

/* =========================================================
   2. STATE — состояние приложения
   ========================================================= */
let state = {
  cart: [],           // [{id, qty}]
  favorites: [],      // [id, ...]
  orders: [],         // [{id, date, items, total, user}]
  users: [],          // [{id, username, password}]
  currentUser: null,  // username | null
  currentSection: 'hero'
};

/* =========================================================
   3. ИНИЦИАЛИЗАЦИЯ
   ========================================================= */
function init() {
  loadState();
  renderProducts(PRODUCTS);
  updateCartBadge();
  updateFavBadge();
  updateUserLabel();
  showHero();
}

/* =========================================================
   4. LOCALSTORAGE
   ========================================================= */
function saveState() {
  try {
    localStorage.setItem('aura_cart',      JSON.stringify(state.cart));
    localStorage.setItem('aura_favorites', JSON.stringify(state.favorites));
    localStorage.setItem('aura_orders',    JSON.stringify(state.orders));
    localStorage.setItem('aura_users',     JSON.stringify(state.users));
    localStorage.setItem('aura_user',      JSON.stringify(state.currentUser));
  } catch (e) { console.warn('LocalStorage error:', e); }
}

function loadState() {
  try {
    state.cart        = JSON.parse(localStorage.getItem('aura_cart'))      || [];
    state.favorites   = JSON.parse(localStorage.getItem('aura_favorites')) || [];
    state.orders      = JSON.parse(localStorage.getItem('aura_orders'))    || [];
    state.users       = JSON.parse(localStorage.getItem('aura_users'))     || [];
    state.currentUser = JSON.parse(localStorage.getItem('aura_user'))      || null;
  } catch (e) {
    console.warn('LocalStorage read error:', e);
  }
}

/* =========================================================
   5. НАВИГАЦИЯ — секции
   ========================================================= */
function showHero() {
  document.getElementById('heroSection').style.display = 'flex';
  document.getElementById('catalog').style.display     = 'none';
  document.getElementById('orders').style.display      = 'none';
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
}

function showSection(section) {
  document.getElementById('heroSection').style.display = 'none';
  document.getElementById('catalog').style.display     = section === 'catalog' ? 'block' : 'none';
  document.getElementById('orders').style.display      = section === 'orders'  ? 'block' : 'none';

  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  if (section === 'catalog') document.getElementById('showCatalogBtn').classList.add('active');
  if (section === 'orders')  {
    document.getElementById('showOrdersBtn').classList.add('active');
    renderOrders();
  }
  state.currentSection = section;
}

/* =========================================================
   6. РЕНДЕР ТОВАРОВ
   ========================================================= */
function renderProducts(products) {
  const grid = document.getElementById('productsGrid');
  if (!products || products.length === 0) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1">
      <i class="fas fa-search"></i>
      <p>Товары не найдены</p>
    </div>`;
    return;
  }

  grid.innerHTML = products.map((p, idx) => {
    const inCart = state.cart.some(c => c.id === p.id);
    const inFav  = state.favorites.includes(p.id);
    return `
    <div class="product-card" style="animation-delay:${idx * 0.05}s"
         onclick="openProduct(${p.id})">
      ${p.badge ? `<div class="product-card__badge">${p.badge}</div>` : ''}
      <button class="product-card__fav ${inFav ? 'active' : ''}"
              onclick="event.stopPropagation(); toggleFav(${p.id})"
              title="${inFav ? 'Убрать из избранного' : 'В избранное'}">
        <i class="fas fa-heart"></i>
      </button>
      <div class="product-card__img" style="overflow:hidden">
        <span>${p.emoji}</span>
      </div>
      <div class="product-card__body">
        <div class="product-card__cat">${p.category}</div>
        <div class="product-card__name">${p.name}</div>
        <div class="product-card__desc">${p.desc}</div>
        <div class="product-card__footer">
          <div>
            <div class="product-card__price">${formatPrice(p.price)}</div>
            ${p.oldPrice ? `<div class="product-card__old-price">${formatPrice(p.oldPrice)}</div>` : ''}
          </div>
          <button class="add-cart-btn ${inCart ? 'in-cart' : ''}"
                  onclick="event.stopPropagation(); addToCart(${p.id})"
                  title="${inCart ? 'В корзине' : 'В корзину'}">
            <i class="fas ${inCart ? 'fa-check' : 'fa-plus'}"></i>
          </button>
        </div>
      </div>
    </div>`;
  }).join('');
}

/* =========================================================
   7. ФИЛЬТР / ПОИСК
   ========================================================= */
function filterProducts() {
  const query    = document.getElementById('searchInput').value.toLowerCase().trim();
  const category = document.getElementById('categoryFilter').value;

  const filtered = PRODUCTS.filter(p => {
    const matchQ = !query ||
      p.name.toLowerCase().includes(query) ||
      p.desc.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query);
    const matchC = category === 'all' || p.category === category;
    return matchQ && matchC;
  });

  renderProducts(filtered);

  // Автоматически показываем каталог при поиске
  if (query && state.currentSection !== 'catalog') {
    showSection('catalog');
  }
}

/* =========================================================
   8. ПРОДУКТ МОДАЛ
   ========================================================= */
function openProduct(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;

  const inCart = state.cart.some(c => c.id === p.id);
  const inFav  = state.favorites.includes(p.id);

  document.getElementById('productModalBody').innerHTML = `
    <div class="pm-emoji">${p.emoji}</div>
    <div class="pm-cat">${p.category}</div>
    <div class="pm-name">${p.name}</div>
    <div class="pm-desc">${p.desc}</div>
    <div class="pm-price">
      ${formatPrice(p.price)}
      ${p.oldPrice ? `<span style="font-size:1rem;color:var(--text2);text-decoration:line-through;margin-left:10px;">${formatPrice(p.oldPrice)}</span>` : ''}
    </div>
    <div class="pm-actions">
      <button class="btn-primary ${inCart ? 'in-cart-btn' : ''}" onclick="addToCart(${p.id}); closeProduct()">
        <i class="fas ${inCart ? 'fa-check' : 'fa-cart-plus'}"></i>
        ${inCart ? 'Уже в корзине' : 'В корзину'}
      </button>
      <button class="btn-outline" onclick="toggleFav(${p.id})" title="${inFav ? 'Убрать' : 'В избранное'}">
        <i class="fas fa-heart" style="color:${inFav ? 'var(--pink)' : ''}"></i>
      </button>
    </div>
  `;

  document.getElementById('productOverlay').classList.add('show');
}

function closeProduct() {
  document.getElementById('productOverlay').classList.remove('show');
}

function closeProductModal(e) {
  if (e.target === document.getElementById('productOverlay')) closeProduct();
}

/* =========================================================
   9. КОРЗИНА
   ========================================================= */
function addToCart(id) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;

  const existing = state.cart.find(c => c.id === id);
  if (existing) {
    existing.qty++;
    showToast(`<i class="fas fa-plus"></i> Количество увеличено`, 'info');
  } else {
    state.cart.push({ id, qty: 1 });
    showToast(`<i class="fas fa-shopping-cart"></i> ${product.name} добавлен в корзину`, 'success');
  }

  saveState();
  updateCartBadge();
  renderProducts(getCurrentFiltered());
  renderCartItems();
}

function removeFromCart(id) {
  state.cart = state.cart.filter(c => c.id !== id);
  saveState();
  updateCartBadge();
  renderCartItems();
  renderProducts(getCurrentFiltered());
}

function changeQty(id, delta) {
  const item = state.cart.find(c => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(id);
    return;
  }
  saveState();
  updateCartBadge();
  renderCartItems();
}

function clearCart() {
  if (state.cart.length === 0) return;
  state.cart = [];
  saveState();
  updateCartBadge();
  renderCartItems();
  renderProducts(getCurrentFiltered());
  showToast('<i class="fas fa-trash"></i> Корзина очищена', 'info');
}

function updateCartBadge() {
  const total = state.cart.reduce((s, c) => s + c.qty, 0);
  document.getElementById('cartBadge').textContent = total;
  document.getElementById('cartBadge').style.display = total > 0 ? 'flex' : 'none';
}

function renderCartItems() {
  const container = document.getElementById('cartItems');
  const totalEl   = document.getElementById('cartTotal');

  if (state.cart.length === 0) {
    container.innerHTML = `<div class="empty-state">
      <i class="fas fa-shopping-cart"></i>
      <p>Корзина пуста</p>
    </div>`;
    totalEl.textContent = '0 ₽';
    return;
  }

  let total = 0;
  container.innerHTML = state.cart.map(item => {
    const p = PRODUCTS.find(x => x.id === item.id);
    if (!p) return '';
    const subtotal = p.price * item.qty;
    total += subtotal;
    return `
    <div class="cart-item">
      <div class="cart-item__emoji">${p.emoji}</div>
      <div class="cart-item__info">
        <div class="cart-item__name">${p.name}</div>
        <div class="cart-item__price">${formatPrice(subtotal)}</div>
        <div class="cart-item__qty">
          <button class="qty-btn" onclick="changeQty(${p.id}, -1)"><i class="fas fa-minus"></i></button>
          <span class="qty-value">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${p.id}, +1)"><i class="fas fa-plus"></i></button>
        </div>
      </div>
      <button class="cart-item__del" onclick="removeFromCart(${p.id})" title="Удалить">
        <i class="fas fa-times"></i>
      </button>
    </div>`;
  }).join('');

  totalEl.textContent = formatPrice(total);
}

function toggleCart() {
  const panel   = document.getElementById('cartPanel');
  const overlay = document.getElementById('cartOverlay');
  const isOpen  = panel.classList.contains('open');

  // Закрываем другую панель если открыта
  closeFavPanel();

  if (!isOpen) {
    renderCartItems();
    panel.classList.add('open');
    overlay.classList.add('show');
  } else {
    panel.classList.remove('open');
    overlay.classList.remove('show');
  }
}

/* =========================================================
   10. ОФОРМЛЕНИЕ ЗАКАЗА
   ========================================================= */
function checkout() {
  if (!state.currentUser) {
    showToast('<i class="fas fa-lock"></i> Войдите в аккаунт для оформления заказа', 'error');
    toggleCart();
    setTimeout(() => toggleAccount(), 400);
    return;
  }
  if (state.cart.length === 0) {
    showToast('<i class="fas fa-shopping-cart"></i> Корзина пуста', 'error');
    return;
  }

  const items = state.cart.map(c => {
    const p = PRODUCTS.find(x => x.id === c.id);
    return { id: c.id, name: p.name, emoji: p.emoji, price: p.price, qty: c.qty };
  });

  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const order = {
    id:   'ORD-' + Date.now().toString(36).toUpperCase(),
    date: new Date().toLocaleString('ru-RU'),
    user: state.currentUser,
    items,
    total
  };

  state.orders.unshift(order);
  state.cart = [];
  saveState();
  updateCartBadge();
  renderCartItems();
  renderProducts(getCurrentFiltered());
  toggleCart();
  showToast(`<i class="fas fa-check-circle"></i> Заказ ${order.id} оформлен!`, 'success');
}

/* =========================================================
   11. ИЗБРАННОЕ
   ========================================================= */
function toggleFav(id) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;

  const idx = state.favorites.indexOf(id);
  if (idx === -1) {
    state.favorites.push(id);
    showToast(`<i class="fas fa-heart"></i> ${product.name} добавлен в избранное`, 'info');
  } else {
    state.favorites.splice(idx, 1);
    showToast(`<i class="fas fa-heart-broken"></i> Убрано из избранного`, 'info');
  }

  saveState();
  updateFavBadge();
  renderProducts(getCurrentFiltered());
  renderFavItems();
}

function updateFavBadge() {
  const count = state.favorites.length;
  document.getElementById('favBadge').textContent = count;
  document.getElementById('favBadge').style.display = count > 0 ? 'flex' : 'none';
}

function renderFavItems() {
  const container = document.getElementById('favItems');
  if (state.favorites.length === 0) {
    container.innerHTML = `<div class="empty-state">
      <i class="fas fa-heart"></i>
      <p>Список избранного пуст</p>
    </div>`;
    return;
  }

  container.innerHTML = state.favorites.map(id => {
    const p = PRODUCTS.find(x => x.id === id);
    if (!p) return '';
    const inCart = state.cart.some(c => c.id === p.id);
    return `
    <div class="fav-item">
      <div class="fav-item__emoji">${p.emoji}</div>
      <div class="fav-item__info">
        <div class="fav-item__name">${p.name}</div>
        <div class="fav-item__price">${formatPrice(p.price)}</div>
      </div>
      <div class="fav-item__actions">
        <button class="fav-add-btn ${inCart ? 'in-cart' : ''}"
                onclick="addToCart(${p.id})"
                title="${inCart ? 'В корзине' : 'В корзину'}">
          <i class="fas ${inCart ? 'fa-check' : 'fa-cart-plus'}"></i>
        </button>
        <button class="fav-del-btn" onclick="toggleFav(${p.id})" title="Убрать">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>`;
  }).join('');
}

function toggleFavorites() {
  const panel   = document.getElementById('favPanel');
  const overlay = document.getElementById('favOverlay');
  const isOpen  = panel.classList.contains('open');

  // Закрываем корзину если открыта
  closeCartPanel();

  if (!isOpen) {
    renderFavItems();
    panel.classList.add('open');
    overlay.classList.add('show');
  } else {
    closeFavPanel();
  }
}

function closeFavPanel() {
  document.getElementById('favPanel').classList.remove('open');
  document.getElementById('favOverlay').classList.remove('show');
}

function closeCartPanel() {
  document.getElementById('cartPanel').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('show');
}

/* =========================================================
   12. АККАУНТ — ЛОГИН / РЕГИСТРАЦИЯ / ПРОФИЛЬ
   ========================================================= */
function toggleAccount() {
  const overlay = document.getElementById('accountOverlay');
  const isOpen  = overlay.classList.contains('show');

  if (!isOpen) {
    if (state.currentUser) {
      showProfile();
    } else {
      showLoginForm();
    }
    overlay.classList.add('show');
  } else {
    overlay.classList.remove('show');
  }
}

function closeAccountModal(e) {
  if (e.target === document.getElementById('accountOverlay')) {
    document.getElementById('accountOverlay').classList.remove('show');
  }
}

function showLoginForm() {
  document.getElementById('loginForm').style.display    = 'block';
  document.getElementById('registerForm').style.display = 'none';
  document.getElementById('profileView').style.display  = 'none';
  document.getElementById('loginError').textContent = '';
}

function showRegisterForm() {
  document.getElementById('loginForm').style.display    = 'none';
  document.getElementById('registerForm').style.display = 'block';
  document.getElementById('profileView').style.display  = 'none';
  document.getElementById('regError').textContent = '';
}

function showProfile() {
  document.getElementById('loginForm').style.display    = 'none';
  document.getElementById('registerForm').style.display = 'none';
  document.getElementById('profileView').style.display  = 'block';
  document.getElementById('profileName').textContent = '👤 ' + state.currentUser;
  const myOrders = state.orders.filter(o => o.user === state.currentUser);
  document.getElementById('profileOrdersCount').textContent =
    myOrders.length > 0
      ? `Заказов: ${myOrders.length} • Потрачено: ${formatPrice(myOrders.reduce((s,o)=>s+o.total,0))}`
      : 'Заказов пока нет';
}

function switchToRegister() { showRegisterForm(); }
function switchToLogin()     { showLoginForm(); }

function register() {
  const username = document.getElementById('regUsername').value.trim();
  const password = document.getElementById('regPassword').value.trim();
  const confirm  = document.getElementById('regPasswordConfirm').value.trim();
  const errEl    = document.getElementById('regError');

  if (!username || !password || !confirm) {
    errEl.textContent = 'Заполните все поля';
    return;
  }
  if (username.length < 3) {
    errEl.textContent = 'Логин минимум 3 символа';
    return;
  }
  if (password.length < 4) {
    errEl.textContent = 'Пароль минимум 4 символа';
    return;
  }
  if (password !== confirm) {
    errEl.textContent = 'Пароли не совпадают';
    return;
  }
  if (state.users.find(u => u.username === username)) {
    errEl.textContent = 'Пользователь уже существует';
    return;
  }

  const newUser = { id: Date.now(), username, password };
  state.users.push(newUser);
  state.currentUser = username;
  saveState();
  updateUserLabel();
  document.getElementById('accountOverlay').classList.remove('show');
  showToast(`<i class="fas fa-user-plus"></i> Добро пожаловать, ${username}!`, 'success');

  // Очистим поля
  document.getElementById('regUsername').value = '';
  document.getElementById('regPassword').value = '';
  document.getElementById('regPasswordConfirm').value = '';
}

function login() {
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value.trim();
  const errEl    = document.getElementById('loginError');

  if (!username || !password) {
    errEl.textContent = 'Введите логин и пароль';
    return;
  }

  const user = state.users.find(u => u.username === username && u.password === password);
  if (!user) {
    errEl.textContent = 'Неверный логин или пароль';
    return;
  }

  state.currentUser = username;
  saveState();
  updateUserLabel();
  document.getElementById('accountOverlay').classList.remove('show');
  showToast(`<i class="fas fa-sign-in-alt"></i> Привет, ${username}!`, 'success');

  // Очистим поля
  document.getElementById('loginUsername').value = '';
  document.getElementById('loginPassword').value = '';
  errEl.textContent = '';
}

function logout() {
  const name = state.currentUser;
  state.currentUser = null;
  saveState();
  updateUserLabel();
  document.getElementById('accountOverlay').classList.remove('show');
  showToast(`<i class="fas fa-sign-out-alt"></i> До свидания, ${name}!`, 'info');
}

function updateUserLabel() {
  document.getElementById('userLabel').textContent = state.currentUser || 'Войти';
}

/* =========================================================
   13. ЗАКАЗЫ
   ========================================================= */
function renderOrders() {
  const container = document.getElementById('ordersList');

  let myOrders = state.orders;
  if (state.currentUser) {
    myOrders = state.orders.filter(o => o.user === state.currentUser);
  }

  if (!state.currentUser) {
    container.innerHTML = `<div class="no-orders">
      <i class="fas fa-lock"></i>
      <p>Войдите в аккаунт, чтобы увидеть заказы</p>
    </div>`;
    return;
  }

  if (myOrders.length === 0) {
    container.innerHTML = `<div class="no-orders">
      <i class="fas fa-box-open"></i>
      <p>У вас пока нет заказов. <a onclick="showSection('catalog')">Перейти в каталог →</a></p>
    </div>`;
    return;
  }

  container.innerHTML = myOrders.map(order => `
    <div class="order-card">
      <div class="order-card__header">
        <div>
          <div class="order-card__id">Заказ #${order.id}</div>
          <div class="order-card__date">${order.date}</div>
        </div>
        <div class="order-card__status">✓ Оформлен</div>
      </div>
      <div class="order-items">
        ${order.items.map(item => `
          <div class="order-item">
            <span class="order-item__emoji">${item.emoji}</span>
            <span class="order-item__name">${item.name} × ${item.qty}</span>
            <span class="order-item__price">${formatPrice(item.price * item.qty)}</span>
          </div>
        `).join('')}
      </div>
      <div class="order-total">
        <span>Итого:</span>
        <span>${formatPrice(order.total)}</span>
      </div>
    </div>
  `).join('');
}

/* =========================================================
   14. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
   ========================================================= */
function formatPrice(price) {
  return price.toLocaleString('ru-RU') + ' ₽';
}

function getCurrentFiltered() {
  const query    = document.getElementById('searchInput').value.toLowerCase().trim();
  const category = document.getElementById('categoryFilter').value;
  return PRODUCTS.filter(p => {
    const matchQ = !query ||
      p.name.toLowerCase().includes(query) ||
      p.desc.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query);
    const matchC = category === 'all' || p.category === category;
    return matchQ && matchC;
  });
}

/* =========================================================
   15. TOAST УВЕДОМЛЕНИЯ
   ========================================================= */
let toastTimer = null;
function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  toast.innerHTML = message;
  toast.className = `toast ${type} show`;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

/* =========================================================
   16. КЛАВИАТУРНЫЕ СОКРАЩЕНИЯ
   ========================================================= */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeCartPanel();
    closeFavPanel();
    document.getElementById('accountOverlay').classList.remove('show');
    closeProduct();
  }
});

/* =========================================================
   17. ЗАПУСК
   ========================================================= */
document.addEventListener('DOMContentLoaded', init);
