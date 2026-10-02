/* ============================================================================
 * JAN MOMO'S & CHICKEN SOUP — script.js
 * Premium restaurant ordering website (vanilla JavaScript, no frameworks)
 *
 * SECTION MAP
 *   01  Configuration
 *   02  Product data
 *   03  DOM elements
 *   04  Helpers & formatting
 *   05  Image system
 *   06  Product rendering
 *   07  Static section rendering (features / why / deals / socials)
 *   08  Category filtering
 *   09  Search
 *   10  Cart state + localStorage
 *   11  Cart rendering
 *   12  Quantity controls
 *   13  Product modal
 *   14  Cart drawer
 *   15  Checkout + validation
 *   16  WhatsApp order generation
 *   17  Order success
 *   18  Toast notifications
 *   19  Navigation (navbar, mobile menu, scroll spy)
 *   20  Scroll reveal (IntersectionObserver)
 *   21  Initialization
 * ========================================================================= */


/* ==========================================================================
   01. CONFIGURATION
   --------------------------------------------------------------------------
   Everything you may want to change lives here.
   ========================================================================== */

/** Flat delivery fee added to every order (Rs.). */
const DELIVERY_FEE = 100;

/** Restaurant contact details. */
const RESTAURANT = {
  name: "JAN MOMO'S & CHICKEN SOUP",
  shortName: "JAN MOMO'S",
  tagline: "The Name Of Real Taste",
  owner: "Junaid Sheikh",
  phoneDisplay: "0321-9997989",
  phoneDigits: "03219997899",
    /** International format used by wa.me / api.whatsapp.com (92 + number). */
    whatsapp: "923219997989",
    /** Prefix used for on-site order references (JAN-1042). */
    orderPrefix: "JAN",
    hours: "4:00 PM - 12:00 AM"
  };

/** localStorage keys (namespaced + versioned). */
const STORAGE_KEYS = {
  cart: "janmomos_cart_v1",
  customer: "janmomos_customer_v1",
  orders: "janmomos_orders_v1"
};

/** How many placed orders to keep on this device. */
const ORDERS_HISTORY_LIMIT = 20;

/** Short month names for receipt timestamps. */
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

/** How long a toast stays on screen (ms). */
const TOAST_DURATION = 2500;

/** Loading screen is hidden this soon after the page is ready (max ms). */
const LOADER_MAX_DELAY = 700;

/**
 * Social media links.
 * Leave a value as "" (empty string) and the icon renders as a
 * "coming soon" placeholder — no fake URLs are ever used.
 */
const SOCIAL_LINKS = [
  { id: "facebook",  label: "Facebook",  url: "" },
  { id: "instagram", label: "Instagram", url: "" },
  { id: "tiktok",    label: "TikTok",    url: "" },
  { id: "whatsapp",  label: "WhatsApp",  url: "https://wa.me/" + RESTAURANT.whatsapp }
];

/** Extra sauce options offered inside the product modal. */
const SAUCE_OPTIONS = [
  { id: "none",     name: "No Extra Sauce",   price: 0   },
  { id: "chilli",   name: "Chilli Oil",       price: 100 },
  { id: "dynamite", name: "Dynamite Sauce",   price: 150 }
];

/** Product ids shown in the "Customer Favorites" section. */
const FEATURED_IDS = ["fry-4", "steam-6", "dynamite-momos", "korean-corn-dog"];

/** Promotional deal placeholders. */
const DEALS = [
  {
    icon: "🥟",
    name: "Momo Combo",
    desc: "Fry Momo's + Sauce — a quick, satisfying meal for one."
  },
  {
    icon: "🍗",
    name: "Family Feast",
    desc: "Perfect for sharing. Large portions of momos and sides."
  },
  {
    icon: "🌶️",
    name: "Dynamite Night",
    desc: "Spicy chicken momos with our signature dynamite sauce."
  }
];


/* ==========================================================================
   02. PRODUCT DATA
   --------------------------------------------------------------------------
   The single source of truth. Every card in the website is generated
   from this array — never duplicate product information in the HTML.
   ========================================================================== */

const products = [
  {
    id: "fry-2",
    name: "Fry Momo's",
    variant: "2 Piece",
    category: "momos",
    categoryLabel: "Momo's",
    price: 150,
    image: "fryMomos",
    badge: "",
    featured: true,
    tags: ["fry", "fried", "crispy", "momos", "momo"],
    description: "Crispy golden fried momos served hot with delicious sauces."
  },
  {
    id: "fry-4",
    name: "Fry Momo's",
    variant: "4 Piece",
    category: "momos",
    categoryLabel: "Momo's",
    price: 250,
    image: "fryMomos",
    badge: "popular",
    featured: true,
    tags: ["fry", "fried", "crispy", "momos", "momo", "specials"],
    description: "Crispy golden fried momos served hot with delicious sauces."
  },
  {
    id: "fry-12",
    name: "Fry Momo's",
    variant: "12 Piece",
    category: "momos",
    categoryLabel: "Momo's",
    price: 750,
    image: "fryMomos",
    badge: "",
    featured: true,
    tags: ["fry", "fried", "crispy", "momos", "momo", "family", "party"],
    description: "Crispy golden fried momos served hot with delicious sauces."
  },
  {
    id: "steam-3",
    name: "Steam Momo's",
    variant: "3 Piece",
    category: "momos",
    categoryLabel: "Momo's",
    price: 150,
    image: "steamMomos",
    badge: "",
    featured: true,
    tags: ["steam", "steamed", "momos", "momo", "soft"],
    description:
      "Soft and juicy steamed momos prepared fresh and served with flavorful sauces."
  },
  {
    id: "steam-6",
    name: "Steam Momo's",
    variant: "6 Piece",
    category: "momos",
    categoryLabel: "Momo's",
    price: 250,
    image: "steamMomos",
    badge: "popular",
    featured: true,
    tags: ["steam", "steamed", "momos", "momo", "soft", "specials"],
    description:
      "Soft and juicy steamed momos prepared fresh and served with flavorful sauces."
  },
  {
    id: "steam-12",
    name: "Steam Momo's",
    variant: "12 Piece",
    category: "momos",
    categoryLabel: "Momo's",
    price: 500,
    image: "steamMomos",
    badge: "",
    featured: true,
    tags: ["steam", "steamed", "momos", "momo", "soft", "family", "party"],
    description:
      "Soft and juicy steamed momos prepared fresh and served with flavorful sauces."
  },
  {
    id: "korean-corn-dog",
    name: "Korean Cheese Corn Dog",
    variant: "1 Serving",
    category: "new",
    categoryLabel: "New Item",
    price: 300,
    image: "koreanCornDog",
    badge: "new",
    featured: true,
    tags: ["corn", "korean", "cheese", "snack", "new", "specials"],
    description:
      "Crispy Korean-style corn dog topped with delicious cheese and signature sauces."
  },
  {
    id: "dynamite-momos",
    name: "Chicken Dynamite Momo's",
    variant: "12 Piece",
    category: "new",
    categoryLabel: "New Item",
    price: 650,
    image: "dynamiteMomos",
    badge: "new-item",
    featured: true,
    tags: ["chicken", "dynamite", "spicy", "creamy", "new", "specials", "hot"],
    description: "12 delicious chicken momos coated with creamy and spicy dynamite sauce."
  },
  {
    id: "chilli-oil",
    name: "Chilli Oil",
    variant: "Extra Sauce",
    category: "sauces",
    categoryLabel: "Sauces",
    price: 100,
    image: "chilliOil",
    badge: "",
    featured: true,
    tags: ["sauce", "chilli", "oil", "spicy", "extra"],
    description: "Our signature fiery chilli oil — an extra serving of pure heat."
  },
  {
    id: "dynamite-sauce",
    name: "Dynamite Sauce",
    variant: "Extra Sauce",
    category: "sauces",
    categoryLabel: "Sauces",
    price: 150,
    image: "dynamiteSauce",
    badge: "",
    featured: true,
    tags: ["sauce", "dynamite", "creamy", "spicy", "extra"],
    description: "Creamy, bold and explosive — our legendary dynamite sauce."
  }
];

/** Fast lookup by id. */
const productById = Object.create(null);
products.forEach(function (p) { productById[p.id] = p; });


/* ==========================================================================
   03. DOM ELEMENTS
   ========================================================================== */

const $ = function (sel, root) { return (root || document).querySelector(sel); };
const $$ = function (sel, root) {
  return Array.prototype.slice.call((root || document).querySelectorAll(sel));
};

const el = {
  // Loader
  loader: $("#loader"),

  // Header
  header: $("#header"),
  navlinks: $("#navlinks"),
  navIndicator: $("#navIndicator"),
  burgerBtn: $("#burgerBtn"),
  mobileMenuWrap: $("#mobileMenuWrap"),
  mobileMenu: $("#mobileMenu"),
  mobileMenuClose: $("#mobileMenuClose"),
  navBackdrop: $("#navBackdrop"),
  cartOpenBtn: $("#cartOpenBtn"),
  navCartBadge: $("#navCartBadge"),

  // Section hosts
  featureGrid: $("#featureGrid"),
  featuredGrid: $("#featuredGrid"),
  menuGrid: $("#menuGrid"),
  menuCount: $("#menuCount"),
  noResults: $("#noResults"),
  resetFilters: $("#resetFilters"),
  dealsGrid: $("#dealsGrid"),
  whyGrid: $("#whyGrid"),
  socialList: $("#socialList"),
  socialListFooter: $("#socialListFooter"),
  heroImage: $("#heroImage"),

  // Filters
  categoryBar: $("#categoryBar"),
  searchInput: $("#searchInput"),
  searchClear: $("#searchClear"),

  // Cart drawer
  cartDrawer: $("#cartDrawer"),
  cartBody: $("#cartBody"),
  cartFoot: $("#cartFoot"),
  cartSubtotal: $("#cartSubtotal"),
  cartDelivery: $("#cartDelivery"),
  cartTotal: $("#cartTotal"),
  checkoutBtn: $("#checkoutBtn"),
  clearCartBtn: $("#clearCartBtn"),
  stickyCartBtn: $("#stickyCartBtn"),
  stickyCartCount: $("#stickyCartCount"),
  stickyCartTotal: $("#stickyCartTotal"),

  // Product modal
  productModal: $("#productModal"),
  pmImage: $("#pmImage"),
  pmBadge: $("#pmBadge"),
  pmCategory: $("#pmCategory"),
  pmName: $("#pmName"),
  pmVariant: $("#pmVariant"),
  pmDesc: $("#pmDesc"),
  pmPrice: $("#pmPrice"),
  pmQty: $("#pmQty"),
  pmQtyMinus: $("#pmQtyMinus"),
  pmQtyPlus: $("#pmQtyPlus"),
  pmSauceField: $("#pmSauceField"),
  pmSauceList: $("#pmSauceList"),
  pmNotes: $("#pmNotes"),
  pmAdd: $("#pmAdd"),

  // Checkout
  checkoutModal: $("#checkoutModal"),
  checkoutForm: $("#checkoutForm"),
  coItems: $("#coItems"),
  coSubtotal: $("#coSubtotal"),
  coDelivery: $("#coDelivery"),
  coTotal: $("#coTotal"),
  placeOrderBtn: $("#placeOrderBtn"),
  coName: $("#coName"),
  coPhone: $("#coPhone"),
  coAddress: $("#coAddress"),
  coLandmark: $("#coLandmark"),
  coNotes: $("#coNotes"),
  errName: $("#errName"),
  errPhone: $("#errPhone"),
  errAddress: $("#errAddress"),

  // Order receipt
  successModal: $("#successModal"),
  successOrderId: $("#successOrderId"),
  successStatus: $("#successStatus"),
  successDate: $("#successDate"),
  successEta: $("#successEta"),
  successTotal: $("#successTotal"),
  receiptItems: $("#receiptItems"),
  receiptTotals: $("#receiptTotals"),
  receiptCustomer: $("#receiptCustomer"),
  successPrint: $("#successPrint"),
  successBack: $("#successBack"),

  // Toasts
  toasts: $("#toasts")
};


/* ==========================================================================
   04. HELPERS & FORMATTING
   ========================================================================== */

/** "150" -> "Rs. 150", 1000 -> "Rs. 1,000" */
function formatPrice(value) {
  const n = Number(value) || 0;
  const withCommas = String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return "Rs. " + withCommas;
}

/** 150 -> "150" (number only, for tight spots) */
function formatAmount(value) {
  const n = Number(value) || 0;
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function escapeHtml(str) {
  return String(str == null ? "" : str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Pakistani mobile numbers: 03XXXXXXXXX, 923XXXXXXXXX, +92 3XX... */
const PK_PHONE_RE = /^(?:\+?92|0)3\d{9}$/;

function normalisePhone(raw) {
  return String(raw || "").replace(/[\s\-()]/g, "");
}

function isValidPkPhone(raw) {
  return PK_PHONE_RE.test(normalisePhone(raw));
}

/** Clamp a quantity to a safe integer >= 1. */
function clampQty(value) {
  const n = parseInt(value, 10);
  if (!isFinite(n) || n < 1) return 1;
  return Math.min(n, 99);
}

/** Trailing-edge debounce. */
function debounce(fn, wait) {
  let t = 0;
  return function () {
    const args = arguments;
    const ctx = this;
    clearTimeout(t);
    t = setTimeout(function () { fn.apply(ctx, args); }, wait);
  };
}

/** Restore the browser's default focus outline after a pointer click. */
function isKeyboardNav() {
  try { return document.matches(":focus-visible"); }
  catch (err) { return false; }
}

/** Read one field out of a form. */
function fieldValue(id) {
  const node = el[id];
  return node ? node.value.trim() : "";
}

/** Show / hide a validation message. */
function setFieldError(inputId, errorId, message) {
  const input = el[inputId];
  const error = el[errorId];
  if (input) {
    const field = input.closest(".field");
    if (field) field.classList.toggle("is-invalid", Boolean(message));
  }
  if (error) {
    error.textContent = message || "";
    error.hidden = !message;
  }
}


/* ==========================================================================
   05. IMAGE SYSTEM
   --------------------------------------------------------------------------
   Replace the URLs below with your own files (the exact filenames are
   already wired up). Every product references an IMAGES key, so swapping
   a file only ever means editing this one object.
   ========================================================================== */

/**
 * Toggle: true  -> use the local files in assets/images/
 *           false -> use the temporary online photos below
 */
const USE_LOCAL_IMAGES = false;

/** Temporary online photos. Set USE_LOCAL_IMAGES = true once you add the real files. */
const REMOTE_IMAGES = {
  hero: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=900&q=80",
  fryMomos: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80",
  steamMomos: "https://images.unsplash.com/photo-1563245370-9ba30d13d9d3?auto=format&fit=crop&w=800&q=80",
  koreanCornDog: "https://images.unsplash.com/photo-1619740455993-9e612b1af08a?auto=format&fit=crop&w=800&q=80",
  dynamiteMomos: "https://images.unsplash.com/photo-1604909052743-94e838986d24?auto=format&fit=crop&w=800&q=80",
  chilliOil: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
  dynamiteSauce: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=800&q=80"
};

/** The real project files (used when USE_LOCAL_IMAGES = true). */
const LOCAL_IMAGES = {
  hero: "assets/images/fry-momos.jpg",
  fryMomos: "assets/images/fry-momos.jpg",
  steamMomos: "assets/images/steam-momos.jpg",
  koreanCornDog: "assets/images/korean-corn-dog.jpg",
  dynamiteMomos: "assets/images/chicken-dynamite-momos.jpg",
  chilliOil: "assets/images/chilli-oil.jpg",
  dynamiteSauce: "assets/images/dynamite-sauce.jpg"
};

const IMAGES = USE_LOCAL_IMAGES ? LOCAL_IMAGES : REMOTE_IMAGES;

/** Clean illustrated placeholder used whenever a photo fails to load. */
const FALLBACK_SVG = (function () {
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">' +
    '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
    '<stop offset="0" stop-color="#241012"/><stop offset="1" stop-color="#0d0d0d"/>' +
    "</linearGradient></defs>" +
    '<rect width="400" height="300" fill="url(#g)"/>' +
    '<circle cx="200" cy="150" r="74" fill="none" stroke="#D90000" stroke-width="2" opacity=".45"/>' +
    '<path d="M200 96c30 0 52 20 52 45 0 30-23 65-36 82a18 18 0 0 1-32 0c-13-17-36-52-36-82 0-25 22-45 52-45Z" fill="#D90000" opacity=".85"/>' +
    '<path d="M172 136c10 6 20 9 28 9s18-3 28-9M176 116c8 5 16 7 24 7s16-2 24-7" stroke="#FFC400" stroke-width="3" fill="none" stroke-linecap="round"/>' +
    "</svg>";
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
})();

/** Resolve an image key (or raw path) to a usable URL. */
function imageSrc(key) {
  return IMAGES[key] || key || FALLBACK_SVG;
}

/** Swap in the clean placeholder for any image that fails to load. */
function attachImageFallback() {
  document.addEventListener(
    "error",
    function (event) {
      const node = event.target;
      if (!node || node.tagName !== "IMG") return;
      if (node.dataset.fallbackApplied === "1") return;
      node.dataset.fallbackApplied = "1";
      node.src = FALLBACK_SVG;
      node.classList.add("is-fallback");
    },
    true
  );
}

/** Fill any <img data-img-for="key"> placeholder in the static HTML. */
function bindStaticImages() {
  $$("img[data-img-for]").forEach(function (img) {
    img.src = imageSrc(img.getAttribute("data-img-for"));
  });
  if (el.heroImage) el.heroImage.src = imageSrc("hero");
}


/* ==========================================================================
   06. PRODUCT RENDERING
   ========================================================================== */

/** Badge markup for a product. */
function badgeMarkup(product) {
  if (product.badge === "new") {
    return '<span class="badge badge--new">New</span>';
  }
  if (product.badge === "new-item") {
    return '<span class="badge badge--new">New Item</span>';
  }
  if (product.badge === "popular") {
    return '<span class="badge badge--popular">&#128293; Popular</span>';
  }
  return "";
}

/** Build one product card. */
function productCardHTML(product) {
  const alt = product.name + " — " + product.variant + ", " + product.description;
  return (
    '<article class="card" data-product="' + product.id + '">' +
      '<button class="card__media" type="button" data-open-product="' + product.id + '" ' +
        'aria-label="View details for ' + escapeHtml(product.name + ", " + product.variant) + '">' +
        '<img class="card__img" src="' + imageSrc(product.image) + '" alt="' + escapeHtml(alt) + '" ' +
          'loading="lazy" decoding="async" width="640" height="480">' +
        badgeMarkup(product) +
        '<span class="card__pricebadge"><small>Rs.</small><b>' + formatAmount(product.price) + "</b></span>" +
        '<span class="card__quick">View Details</span>' +
      "</button>" +
      '<div class="card__body">' +
        '<p class="card__cat">' + escapeHtml(product.categoryLabel) + "</p>" +
        '<h3 class="card__name">' + escapeHtml(product.name) + "</h3>" +
        '<span class="card__variant">' + escapeHtml(product.variant) + "</span>" +
        '<p class="card__desc">' + escapeHtml(product.description) + "</p>" +
        '<div class="card__foot">' +
          '<div class="qty" role="group" aria-label="Quantity for ' + escapeHtml(product.name) + '">' +
            '<button class="qty__btn" type="button" data-qty-step="-1" data-qty-for="' + product.id + '" ' +
              'aria-label="Decrease quantity of ' + escapeHtml(product.variant) + '">&minus;</button>' +
            '<input class="qty__value" type="number" min="1" max="99" step="1" value="1" inputmode="numeric" ' +
              'data-qty-for="' + product.id + '" aria-label="Quantity of ' + escapeHtml(product.variant) + '">' +
            '<button class="qty__btn" type="button" data-qty-step="1" data-qty-for="' + product.id + '" ' +
              'aria-label="Increase quantity of ' + escapeHtml(product.variant) + '">+</button>' +
          "</div>" +
          '<button class="card__add" type="button" data-add="' + product.id + '">Add To Cart</button>' +
        "</div>" +
      "</div>" +
    "</article>"
  );
}

/** Fill a grid with a list of products (staggered entry animation). */
function fillGrid(target, list) {
  if (!target) return;
  if (!list.length) {
    target.innerHTML = "";
    return;
  }
  let html = "";
  for (let i = 0; i < list.length; i++) {
    html += productCardHTML(list[i]).replace(
      '<article class="card"',
      '<article class="card" style="animation-delay:' + Math.min(i * 55, 400) + 'ms"'
    );
  }
  target.innerHTML = html;
}

function renderFeaturedProducts() {
  const list = FEATURED_IDS.map(function (id) { return productById[id]; }).filter(Boolean);
  fillGrid(el.featuredGrid, list);
}

function renderProducts() {
  const list = getFilteredProducts();
  fillGrid(el.menuGrid, list);

  if (el.menuCount) {
    el.menuCount.textContent =
      list.length + (list.length === 1 ? " item" : " items") +
      (state.category !== "all" || state.query ? " found" : " on the menu");
  }
  if (el.noResults) el.noResults.hidden = list.length !== 0;
}


/* ==========================================================================
   07. STATIC SECTION RENDERING
   ========================================================================== */

const FEATURES = [
  { icon: "⚡", title: "Fast Service", text: "Quick & Reliable" },
  { icon: "🌿", title: "Hygienic & Fresh", text: "Clean & Healthy" },
  { icon: "🛵", title: "Safe Delivery", text: "On Time, Every Time" }
];

const WHY_US = [
  { icon: "🔥", title: "Fresh Taste", text: "Prepared fresh for every order." },
  { icon: "🌿", title: "Hygienic", text: "Clean ingredients and preparation." },
  { icon: "⚡", title: "Fast Service", text: "Quick and reliable service." },
  { icon: "🛵", title: "Safe Delivery", text: "Your food delivered safely and on time." }
];

function renderFeatures() {
  if (!el.featureGrid) return;
  el.featureGrid.innerHTML = FEATURES.map(function (f) {
    return (
      '<li class="feature">' +
        '<span class="feature__icon" aria-hidden="true">' + f.icon + "</span>" +
        '<span><span class="feature__title">' + f.title + "</span>" +
        '<span class="feature__text">' + f.text + "</span></span>" +
      "</li>"
    );
  }).join("");
}

function renderWhyUs() {
  if (!el.whyGrid) return;
  el.whyGrid.innerHTML = WHY_US.map(function (w) {
    return (
      '<article class="whycard">' +
        '<span class="whycard__icon" aria-hidden="true">' + w.icon + "</span>" +
        '<h3 class="whycard__title">' + w.title + "</h3>" +
        '<p class="whycard__text">' + w.text + "</p>" +
      "</article>"
    );
  }).join("");
}

function renderDeals() {
  if (!el.dealsGrid) return;
  el.dealsGrid.innerHTML = DEALS.map(function (d) {
    return (
      '<article class="deal">' +
        '<span class="deal__glow" aria-hidden="true"></span>' +
        '<span class="deal__icon" aria-hidden="true">' + d.icon + "</span>" +
        '<h3 class="deal__name">' + d.name + "</h3>" +
        '<p class="deal__desc">' + d.desc + "</p>" +
        '<span class="deal__soon">Coming Soon</span>' +
        '<p class="deal__note">Price will be announced on our social pages.</p>' +
      "</article>"
    );
  }).join("");
}

/** Stroke-based social icons. */
const SOCIAL_ICONS = {
  facebook: '<path d="M14.6 8.4h2.6V5.2h-2.6a3.9 3.9 0 0 0-3.9 3.9v2.1H8.2v3.2h2.5v6.4h3.3v-6.4h2.6l.5-3.2h-3.1V9.1a.7.7 0 0 1 .6-.7Z"/>',
  instagram:
    '<rect x="3.4" y="3.4" width="17.2" height="17.2" rx="5"/>' +
    '<circle cx="12" cy="12" r="4.1"/>' +
    '<circle cx="16.9" cy="7.1" r="1.1" fill="currentColor" stroke="none"/>',
  tiktok: '<path d="M14.2 3.4v9.9a3.6 3.6 0 1 1-3.1-3.5"/><path d="M14.2 3.4c.5 2.6 2.2 4.3 4.9 4.5"/>',
  whatsapp:
    '<path d="M3.6 20.4 5.2 16.3A7.9 7.9 0 1 1 8.2 19.2Z"/>' +
    '<path d="M9.1 8.4c.2-.5.5-.5.8-.5h.5c.2 0 .4 0 .6.5l.7 1.8c.1.3 0 .5-.1.6l-.5.6c-.1.2-.2.4 0 .6a6.6 6.6 0 0 0 3 2.7c.3.1.5 0 .6-.1l.6-.6c.2-.2.3-.2.6-.1l1.7.8c.2.1.4.3.4.5a2 2 0 0 1-1.3 1.7c-.6.2-1.3.2-2.1-.1a11.5 11.5 0 0 1-5.7-5.3c-.5-1-.5-1.8-.2-2.4Z"/>'
};

function socialMarkup(target) {
  if (!target) return;
  target.innerHTML = SOCIAL_LINKS.map(function (s) {
    const icon = SOCIAL_ICONS[s.id] || "";
    if (s.url) {
      return (
        '<a class="social" href="' + escapeHtml(s.url) + '" target="_blank" rel="noopener noreferrer" ' +
          'aria-label="' + s.label + ' (opens in a new tab)"><svg viewBox="0 0 24 24" aria-hidden="true">' + icon + "</svg></a>"
      );
    }
    return (
      '<span class="social social--pending" role="img" aria-label="' + s.label + ' — link coming soon" ' +
        'title="' + s.label + ' — link coming soon"><svg viewBox="0 0 24 24" aria-hidden="true">' + icon + "</svg></span>"
    );
  }).join("");
}

/** Generic WhatsApp deep links (contact cards, footer). */
function bindWhatsAppLinks() {
  $$("[data-wa]").forEach(function (link) {
    const kind = link.getAttribute("data-wa");
    const text =
      kind === "general"
        ? encodeURIComponent(
            "Assalam-o-Alaikum! I would like to place an order at JAN MOMO'S & CHICKEN SOUP."
          )
        : encodeURIComponent("Assalam-o-Alaikum! I have an enquiry for JAN MOMO'S & CHICKEN SOUP.");
    link.href = "https://wa.me/" + RESTAURANT.whatsapp + "?text=" + text;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });
}


/* ==========================================================================
   08. CATEGORY FILTERING  +  09. SEARCH
   ========================================================================== */

/** Current filter state. */
const state = {
  category: "all",
  query: ""
};

/** A product matches a category if its category or any tag matches. */
function matchesCategory(product, category) {
  if (category === "all") return true;
  return product.category === category || product.tags.indexOf(category) !== -1;
}

/**
 * Searchable text, split into two tiers:
 *   primary   -> name, variant, category and tags (the product itself)
 *   secondary -> the description (only used when nothing in tier 1 matches)
 * This keeps "sauce" pointing at the sauces, not at every dish whose
 * description happens to mention sauces.
 */
function searchText(product) {
  return (
    product.name + " " + product.variant + " " + product.categoryLabel + " " + product.tags.join(" ")
  ).toLowerCase();
}

function getFilteredProducts() {
  const inCategory = products.filter(function (p) {
    return matchesCategory(p, state.category);
  });

  if (!state.query) return inCategory;

  const primary = inCategory.filter(function (p) {
    return searchText(p).indexOf(state.query) !== -1;
  });
  if (primary.length) return primary;

  return inCategory.filter(function (p) {
    return p.description.toLowerCase().indexOf(state.query) !== -1;
  });
}

/** Apply both filters and repaint the menu grid. */
function filterProducts() {
  renderProducts();
}

function setCategory(category) {
  state.category = category;
  if (el.categoryBar) {
    $$(".chip", el.categoryBar).forEach(function (chip) {
      const active = chip.getAttribute("data-category") === category;
      chip.classList.toggle("is-active", active);
      chip.setAttribute("aria-selected", active ? "true" : "false");
    });
  }
  filterProducts();
}

function searchProducts(term) {
  state.query = String(term || "").trim().toLowerCase();
  if (el.searchClear) el.searchClear.hidden = !state.query;
  filterProducts();
}

function initFilters() {
  if (el.categoryBar) {
    el.categoryBar.addEventListener("click", function (event) {
      const chip = event.target.closest(".chip");
      if (!chip) return;
      setCategory(chip.getAttribute("data-category"));
    });
  }

  if (el.searchInput) {
    const run = debounce(function () { searchProducts(el.searchInput.value); }, 160);
    el.searchInput.addEventListener("input", run);
    el.searchInput.addEventListener("search", run);
    el.searchInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter") { event.preventDefault(); searchProducts(el.searchInput.value); }
    });
  }

  if (el.searchClear) {
    el.searchClear.addEventListener("click", function () {
      if (el.searchInput) { el.searchInput.value = ""; el.searchInput.focus(); }
      searchProducts("");
    });
  }

  if (el.resetFilters) {
    el.resetFilters.addEventListener("click", function () {
      if (el.searchInput) el.searchInput.value = "";
      searchProducts("");
      setCategory("all");
    });
  }
}


/* ==========================================================================
   10. CART STATE + LOCAL STORAGE
   --------------------------------------------------------------------------
   If localStorage is unavailable (private mode, disabled, file:// edge
   cases) the site keeps working for the current session in memory.
   ========================================================================== */

const storage = (function () {
  let usable = true;
  try {
    const probe = "__jan_probe__";
    window.localStorage.setItem(probe, "1");
    window.localStorage.removeItem(probe);
  } catch (err) {
    usable = false;
  }

  const memory = Object.create(null);

  return {
    available: usable,
    get: function (key, fallback) {
      try {
        const raw = usable ? window.localStorage.getItem(key) : memory[key];
        return raw ? JSON.parse(raw) : fallback;
      } catch (err) {
        return fallback;
      }
    },
    set: function (key, value) {
      const raw = JSON.stringify(value);
      try {
        if (usable) window.localStorage.setItem(key, raw);
        else memory[key] = raw;
        return true;
      } catch (err) {
        memory[key] = raw;
        return false;
      }
    },
    remove: function (key) {
      try {
        if (usable) window.localStorage.removeItem(key);
      } catch (err) { /* ignore */ }
      delete memory[key];
    }
  };
})();

/** In-memory cart: array of line items. */
let cart = [];

/** Cached product snapshot per line (so renames still display). */
function buildLine(product, options) {
  const opts = options || {};
  const sauce = SAUCE_OPTIONS.filter(function (s) { return s.id === opts.sauceId; })[0] || SAUCE_OPTIONS[0];
  const notes = String(opts.notes || "").trim();
  const lineId =
    product.id + "|" + sauce.id + "|" + notes.toLowerCase();

  return {
    lineId: lineId,
    productId: product.id,
    name: product.name,
    variant: product.variant,
    image: product.image,
    basePrice: product.price,
    sauceId: sauce.id,
    sauceName: sauce.name,
    saucePrice: sauce.price,
    notes: notes,
    qty: clampQty(opts.qty)
  };
}

/** Unit price of a line (product + extra sauce). */
function lineUnitPrice(line) {
  return Number(line.basePrice || 0) + Number(line.saucePrice || 0);
}

/** Line total. */
function lineTotal(line) {
  return lineUnitPrice(line) * line.qty;
}

/** Rebuild cart entries from storage, dropping anything unknown. */
function loadCart() {
  const stored = storage.get(STORAGE_KEYS.cart, []);
  if (!Array.isArray(stored)) { cart = []; return; }

  const seen = Object.create(null);
  cart = [];
  stored.forEach(function (raw) {
    if (!raw || !productById[raw.productId]) return;
    const line = buildLine(productById[raw.productId], {
      sauceId: raw.sauceId,
      notes: raw.notes,
      qty: raw.qty
    });
    if (seen[line.lineId]) {
      // Merge duplicates that were stored separately.
      const existing = cart.filter(function (c) { return c.lineId === line.lineId; })[0];
      if (existing) existing.qty = Math.min(99, existing.qty + line.qty);
      return;
    }
    seen[line.lineId] = true;
    cart.push(line);
  });
}

function saveCart() {
  storage.set(STORAGE_KEYS.cart, cart);
}

function loadCustomer() {
  const data = storage.get(STORAGE_KEYS.customer, {});
  if (!data || typeof data !== "object") return;
  if (el.coName && data.name) el.coName.value = data.name;
  if (el.coPhone && data.phone) el.coPhone.value = data.phone;
  if (el.coAddress && data.address) el.coAddress.value = data.address;
  if (el.coLandmark && data.landmark) el.coLandmark.value = data.landmark;
  if (el.coNotes && data.notes) el.coNotes.value = data.notes;
}

function saveCustomer(data) {
  storage.set(STORAGE_KEYS.customer, data);
}

/* --- Cart operations --- */

function addToCart(productId, options) {
  const product = productById[productId];
  if (!product) return;

  const line = buildLine(product, options);
  const existing = cart.filter(function (c) { return c.lineId === line.lineId; })[0];

  if (existing) {
    existing.qty = Math.min(99, existing.qty + line.qty);
  } else {
    cart.push(line);
  }

  saveCart();
  updateCart();
  showToast(
    "✓ Added to cart",
    line.qty > 1
      ? line.qty + " × " + line.name + " (" + line.variant + ") added successfully."
      : line.name + " added successfully."
  );
}

function removeFromCart(lineId) {
  const index = cart.findIndex(function (c) { return c.lineId === lineId; });
  if (index === -1) return;
  const removed = cart.splice(index, 1)[0];
  saveCart();
  updateCart();
  showToast("Removed", removed.name + " (" + removed.variant + ") removed from your cart.");
}

function updateQuantity(lineId, qty) {
  const line = cart.filter(function (c) { return c.lineId === lineId; })[0];
  if (!line) return;
  const next = clampQty(qty);
  if (next === line.qty) return;
  line.qty = next;
  saveCart();
  updateCart();
}

function clearCart(announce) {
  if (!cart.length) return;
  cart = [];
  saveCart();
  updateCart();
  if (announce) showToast("Cart cleared", "All items were removed from your order.", "error");
}

/* --- Totals --- */

function calculateTotals() {
  const subtotal = cart.reduce(function (sum, line) { return sum + lineTotal(line); }, 0);
  const delivery = cart.length ? DELIVERY_FEE : 0;
  return {
    subtotal: subtotal,
    delivery: delivery,
    total: subtotal + delivery,
    count: cart.reduce(function (sum, line) { return sum + line.qty; }, 0)
  };
}


/* ==========================================================================
   11. CART RENDERING
   ========================================================================== */

function cartItemHTML(line) {
  const extras = [];
  if (line.sauceId !== "none") extras.push("+ " + line.sauceName + " (" + formatPrice(line.saucePrice) + ")");
  if (line.notes) extras.push("Note: " + line.notes);

  return (
    '<article class="cartitem" data-line="' + escapeHtml(line.lineId) + '">' +
      '<div class="cartitem__imgwrap">' +
        '<img class="cartitem__img" src="' + imageSrc(line.image) + '" alt="' + escapeHtml(line.name) + '" loading="lazy" decoding="async">' +
      "</div>" +
      '<div class="cartitem__main">' +
        '<div class="cartitem__top">' +
          '<div>' +
            '<h3 class="cartitem__name">' + escapeHtml(line.name) + "</h3>" +
            '<p class="cartitem__variant">' + escapeHtml(line.variant) + "</p>" +
          "</div>" +
          '<button class="cartitem__remove" type="button" data-remove-line="' + escapeHtml(line.lineId) + '" ' +
            'aria-label="Remove ' + escapeHtml(line.name + ", " + line.variant) + ' from cart">&times;</button>' +
        "</div>" +
        (extras.length
          ? '<p class="cartitem__extras">' + escapeHtml(extras.join(" · ")) + "</p>"
          : "") +
        '<div class="cartitem__bot">' +
          '<div class="qty" role="group" aria-label="Quantity for ' + escapeHtml(line.variant) + '">' +
            '<button class="qty__btn" type="button" data-line-step="-1" data-line="' + escapeHtml(line.lineId) + '" ' +
              'aria-label="Decrease quantity">&minus;</button>' +
            '<input class="qty__value" type="number" min="1" max="99" step="1" value="' + line.qty + '" inputmode="numeric" ' +
              'data-line-qty="' + escapeHtml(line.lineId) + '" aria-label="Quantity">' +
            '<button class="qty__btn" type="button" data-line-step="1" data-line="' + escapeHtml(line.lineId) + '" ' +
              'aria-label="Increase quantity">+</button>' +
          "</div>" +
          '<p class="cartitem__price">' + formatPrice(lineTotal(line)) + "</p>" +
        "</div>" +
      "</div>" +
    "</article>"
  );
}

function renderCart() {
  if (!el.cartBody) return;

  if (!cart.length) {
    el.cartBody.innerHTML =
      '<div class="cartempty">' +
        '<p class="cartempty__icon" aria-hidden="true">&#128722;</p>' +
        '<p class="cartempty__title">Your cart is empty</p>' +
        '<p class="cartempty__text">Add something delicious!</p>' +
        '<button class="btn btn--ghost" type="button" data-close-cart>View Menu</button>' +
      "</div>";
    if (el.cartFoot) el.cartFoot.hidden = true;
    return;
  }

  el.cartBody.innerHTML = cart.map(cartItemHTML).join("");
  if (el.cartFoot) el.cartFoot.hidden = false;
}

/** Repaint cart UI + every badge. */
function updateCart() {
  const totals = calculateTotals();
  renderCart();

  if (el.cartSubtotal) el.cartSubtotal.textContent = formatPrice(totals.subtotal);
  if (el.cartDelivery) el.cartDelivery.textContent = formatPrice(totals.delivery);
  if (el.cartTotal) el.cartTotal.textContent = formatPrice(totals.total);
  if (el.coSubtotal) el.coSubtotal.textContent = formatPrice(totals.subtotal);
  if (el.coDelivery) el.coDelivery.textContent = formatPrice(totals.delivery);
  if (el.coTotal) el.coTotal.textContent = formatPrice(totals.total);

    [el.navCartBadge].forEach(function (badge) {
    if (!badge) return;
    badge.textContent = totals.count > 99 ? "99+" : String(totals.count);
    badge.hidden = totals.count === 0;
  });

  if (el.stickyCartBtn) {
    const show = totals.count > 0;
    if (el.stickyCartBtn.hidden === show) el.stickyCartBtn.hidden = !show;
    if (show) {
      if (el.stickyCartCount) {
        el.stickyCartCount.textContent = totals.count + (totals.count === 1 ? " item" : " items");
      }
      if (el.stickyCartTotal) el.stickyCartTotal.textContent = formatPrice(totals.total);
    }
  }

  if (el.checkoutBtn) el.checkoutBtn.disabled = cart.length === 0;
  if (el.placeOrderBtn) el.placeOrderBtn.disabled = cart.length === 0;

  if (el.checkoutModal && !el.checkoutModal.classList.contains("is-open")) {
    renderCheckoutSummary();
  }
}


/* ==========================================================================
   12. QUANTITY CONTROLS
   ========================================================================== */

/** Read the qty currently shown on a product card. */
function readCardQty(productId) {
  const input = $('[data-qty-for="' + productId + '"].qty__value', el.menuGrid) ||
                $('[data-qty-for="' + productId + '"].qty__value', el.featuredGrid);
  return input ? clampQty(input.value) : 1;
}

function writeCardQty(productId, qty) {
  $$('[data-qty-for="' + productId + '"].qty__value').forEach(function (input) {
    input.value = String(qty);
  });
}

/** Brief "added" confirmation on a card's button. */
function flashAdded(button) {
  if (!button) return;
  const original = button.getAttribute("data-original-label") || button.textContent;
  button.setAttribute("data-original-label", original);
  button.textContent = "Added ✓";
  button.classList.add("is-added");
  setTimeout(function () {
    button.textContent = button.getAttribute("data-original-label") || original;
    button.classList.remove("is-added");
  }, 1200);
}

function initQuantityControls() {
  /* --- Product cards: steppers + add button --- */
  document.addEventListener("click", function (event) {
    const stepper = event.target.closest("[data-qty-step]");
    if (stepper) {
      const id = stepper.getAttribute("data-qty-for");
      const step = parseInt(stepper.getAttribute("data-qty-step"), 10) || 0;
      writeCardQty(id, clampQty(readCardQty(id) + step));
      return;
    }

    const addBtn = event.target.closest("[data-add]");
    if (addBtn) {
      const id = addBtn.getAttribute("data-add");
      const qty = readCardQty(id);
      addToCart(id, { qty: qty, sauceId: "none", notes: "" });
      writeCardQty(id, 1);
      flashAdded(addBtn);
      return;
    }

    const quickAdd = event.target.closest("[data-quick-add]");
    if (quickAdd) {
      openProductModal(quickAdd.getAttribute("data-quick-add"));
      return;
    }

    const openBtn = event.target.closest("[data-open-product]");
    if (openBtn) {
      openProductModal(openBtn.getAttribute("data-open-product"));
    }
  });

  /* --- Manual qty typing on cards --- */
  document.addEventListener("change", function (event) {
    const input = event.target.closest('.qty__value[data-qty-for]');
    if (!input) return;
    const id = input.getAttribute("data-qty-for");
    input.value = String(clampQty(input.value));
    writeCardQty(id, clampQty(input.value));
  });

  /* --- Cart drawer: steppers, typing, remove --- */
  document.addEventListener("click", function (event) {
    const stepper = event.target.closest("[data-line-step]");
    if (stepper) {
      const lineId = stepper.getAttribute("data-line");
      const line = cart.filter(function (c) { return c.lineId === lineId; })[0];
      if (!line) return;
      updateQuantity(lineId, line.qty + (parseInt(stepper.getAttribute("data-line-step"), 10) || 0));
      return;
    }

    const removeBtn = event.target.closest("[data-remove-line]");
    if (removeBtn) {
      removeFromCart(removeBtn.getAttribute("data-remove-line"));
    }
  });

  document.addEventListener("change", function (event) {
    const input = event.target.closest("[data-line-qty]");
    if (!input) return;
    updateQuantity(input.getAttribute("data-line-qty"), input.value);
  });
}


/* ==========================================================================
   OVERLAY HELPERS (shared by the cart drawer and every modal)
   ========================================================================== */

let lastFocused = null;
const openOverlays = [];

function isOverlayActive(node) {
  return openOverlays.indexOf(node) !== -1;
}

function openOverlay(node, focusTarget) {
  if (!node) return;
  if (!isOverlayActive(node)) {
    lastFocused = document.activeElement;
    openOverlays.push(node);
  }
  node.classList.add("is-open");
  node.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-locked");

  const target = focusTarget || node.querySelector("[autofocus]") ||
    node.querySelector("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])");
  if (target) setTimeout(function () { target.focus({ preventScroll: true }); }, 60);
}

function closeOverlay(node) {
  if (!node) return;
  node.classList.remove("is-open");
  node.setAttribute("aria-hidden", "true");
  const index = openOverlays.indexOf(node);
  if (index !== -1) openOverlays.splice(index, 1);
  if (!openOverlays.length) document.body.classList.remove("is-locked");
  if (lastFocused && typeof lastFocused.focus === "function") {
    lastFocused.focus({ preventScroll: true });
  }
  lastFocused = null;
}

function closeTopOverlay() {
  if (openOverlays.length) closeOverlay(openOverlays[openOverlays.length - 1]);
}

/** Keep Tab inside the topmost overlay. */
document.addEventListener("keydown", function (event) {
  if (!openOverlays.length) return;

  if (event.key === "Escape") {
    event.preventDefault();
    closeTopOverlay();
    return;
  }

  if (event.key !== "Tab") return;

  const node = openOverlays[openOverlays.length - 1];
  const focusables = $$(
    'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), ' +
    'select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    node
  ).filter(function (item) { return item.offsetParent !== null; });

  if (!focusables.length) return;

  const first = focusables[0];
  const last = focusables[focusables.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

/* --- Close buttons / backdrop clicks --- */
document.addEventListener("click", function (event) {
  if (!event.target.closest("[data-close-cart]")) return;
  closeCart();
});
document.addEventListener("click", function (event) {
  if (!event.target.closest("[data-close-product]")) return;
  closeProductModal();
});
document.addEventListener("click", function (event) {
  if (!event.target.closest("[data-close-checkout]")) return;
  closeCheckout();
});
document.addEventListener("click", function (event) {
  if (!event.target.closest("[data-close-success]")) return;
  closeSuccess();
});


/* ==========================================================================
   13. PRODUCT MODAL
   ========================================================================== */

let modalProduct = null;

function buildSauceOptions(selected) {
  return SAUCE_OPTIONS.map(function (s) {
    const priceLabel = s.price ? "+ " + formatPrice(s.price) : "Included";
    return (
      '<label class="radioopt">' +
        '<input type="radio" name="pmSauce" value="' + s.id + '"' +
          (s.id === selected ? " checked" : "") + ">" +
        '<span class="radioopt__dot" aria-hidden="true"></span>' +
        '<span class="radioopt__label">' + s.name + "</span>" +
        '<span class="radioopt__price">' + priceLabel + "</span>" +
      "</label>"
    );
  }).join("");
}

function selectedSauce() {
  const checked = el.pmSauceList ? el.pmSauceList.querySelector('input[name="pmSauce"]:checked') : null;
  const id = checked ? checked.value : "none";
  return SAUCE_OPTIONS.filter(function (s) { return s.id === id; })[0] || SAUCE_OPTIONS[0];
}

/** Keep the big price in sync with the chosen sauce. */
function refreshModalPrice() {
  if (!modalProduct || !el.pmPrice) return;
  const sauce = selectedSauce();
  el.pmPrice.innerHTML = '<span class="price__cur">Rs.</span> ' + formatAmount(modalProduct.price + sauce.price);
  if (el.pmAdd) {
    el.pmAdd.textContent =
      "Add To Cart • " + formatPrice((modalProduct.price + sauce.price) * clampQty(el.pmQty.value));
  }
}

function openProductModal(productId) {
  const product = productById[productId];
  if (!product || !el.productModal) return;

  modalProduct = product;

  el.pmImage.src = imageSrc(product.image);
  el.pmImage.alt = product.name + " — " + product.variant;
  el.pmCategory.textContent = product.categoryLabel;
  el.pmName.textContent = product.name;
  el.pmVariant.textContent = product.variant;
  el.pmDesc.textContent = product.description;
  el.pmQty.value = "1";
  if (el.pmNotes) el.pmNotes.value = "";

  if (product.badge) {
    el.pmBadge.hidden = false;
    el.pmBadge.className = "badge pm__badge " +
      (product.badge === "popular" ? "badge--popular" : "badge--new");
    el.pmBadge.innerHTML =
      product.badge === "popular" ? "&#128293; Popular" :
      product.badge === "new-item" ? "New Item" : "New";
  } else {
    el.pmBadge.hidden = true;
  }

  // Extra sauce makes no sense when the product *is* a sauce.
  const isSauce = product.category === "sauces";
  if (el.pmSauceField) el.pmSauceField.hidden = isSauce;
  if (el.pmSauceList) el.pmSauceList.innerHTML = isSauce ? "" : buildSauceOptions("none");

  refreshModalPrice();
  openOverlay(el.productModal, el.pmAdd);
}

function closeProductModal() {
  closeOverlay(el.productModal);
  modalProduct = null;
}

function initProductModal() {
  if (!el.productModal) return;

  el.pmQtyMinus.addEventListener("click", function () {
    el.pmQty.value = String(clampQty(Number(el.pmQty.value) - 1));
    refreshModalPrice();
  });
  el.pmQtyPlus.addEventListener("click", function () {
    el.pmQty.value = String(clampQty(Number(el.pmQty.value) + 1));
    refreshModalPrice();
  });
  el.pmQty.addEventListener("change", function () {
    el.pmQty.value = String(clampQty(el.pmQty.value));
    refreshModalPrice();
  });

  if (el.pmSauceList) {
    el.pmSauceList.addEventListener("change", refreshModalPrice);
  }

  el.pmAdd.addEventListener("click", function () {
    if (!modalProduct) return;
    const sauce = selectedSauce();
    addToCart(modalProduct.id, {
      qty: clampQty(el.pmQty.value),
      sauceId: sauce.id,
      notes: el.pmNotes ? el.pmNotes.value : ""
    });
    closeProductModal();
    openCart();
  });

  el.productModal.addEventListener("keydown", function (event) {
    if (event.key !== "Enter") return;
    const target = event.target;
    if (target && target.tagName === "BUTTON") return;
    if (target && target.tagName === "TEXTAREA") return;
    event.preventDefault();
    el.pmAdd.click();
  });
}


/* ==========================================================================
   14. CART DRAWER
   ========================================================================== */

function openCart() {
  if (!el.cartDrawer) return;
  renderCart();
  openOverlay(el.cartDrawer, el.cartBody.querySelector("[data-close-cart]") || el.cartBody);
}

function closeCart() {
  closeOverlay(el.cartDrawer);
}

function initCart() {
    [el.cartOpenBtn, el.stickyCartBtn].forEach(function (btn) {
    if (!btn) return;
    btn.addEventListener("click", function () {
      // The "View Menu" button inside the empty state closes the drawer.
      openCart();
    });
  });

  if (el.clearCartBtn) {
    el.clearCartBtn.addEventListener("click", function () { clearCart(true); });
  }
}


/* ==========================================================================
   15. CHECKOUT + VALIDATION
   ========================================================================== */

function renderCheckoutSummary() {
  if (!el.coItems) return;
  if (!cart.length) {
    el.coItems.innerHTML = '<li class="co__item"><em>Your cart is empty.</em></li>';
    return;
  }
  el.coItems.innerHTML = cart.map(function (line) {
    const extras = [];
    if (line.sauceId !== "none") extras.push("+ " + line.sauceName);
    if (line.notes) extras.push("(note: " + line.notes + ")");
    return (
      '<li class="co__item">' +
        "<b>" + escapeHtml(line.name) + "</b>" +
        '<span>' + escapeHtml(line.variant) + (extras.length ? " " + escapeHtml(extras.join(" ")) : "") +
          " &times; " + line.qty + "</span>" +
        "<span>" + formatPrice(lineTotal(line)) + "</span>" +
      "</li>"
    );
  }).join("");
}

function openCheckout() {
  if (!cart.length) {
    showToast("Cart is empty", "Add something delicious first!", "error");
    return;
  }
  closeCart();
  renderCheckoutSummary();
  clearFieldErrors();
  openOverlay(el.checkoutModal, el.coName);
}

function closeCheckout() {
  closeOverlay(el.checkoutModal);
}

function clearFieldErrors() {
  setFieldError("coName", "errName", "");
  setFieldError("coPhone", "errPhone", "");
  setFieldError("coAddress", "errAddress", "");
}

function validateCheckout() {
  const name = fieldValue("coName");
  const phone = fieldValue("coPhone");
  const address = fieldValue("coAddress");

  clearFieldErrors();

  let firstBad = null;
  if (!name) {
    setFieldError("coName", "errName", "Please enter your full name.");
    firstBad = firstBad || el.coName;
  }
  if (!phone) {
    setFieldError("coPhone", "errPhone", "Phone number is required.");
    firstBad = firstBad || el.coPhone;
  } else if (!isValidPkPhone(phone)) {
    setFieldError("coPhone", "errPhone", "Enter a valid Pakistani number, e.g. 03219997899");
    firstBad = firstBad || el.coPhone;
  }
  if (!address) {
    setFieldError("coAddress", "errAddress", "Please enter your delivery address.");
    firstBad = firstBad || el.coAddress;
  }

  if (firstBad) {
    firstBad.focus();
    firstBad.scrollIntoView({ block: "center", behavior: "smooth" });
    return false;
  }
  return true;
}

function collectCustomer() {
  return {
    name: fieldValue("coName"),
    phone: normalisePhone(fieldValue("coPhone")),
    address: fieldValue("coAddress"),
    landmark: fieldValue("coLandmark"),
    notes: fieldValue("coNotes"),
    payment: "Cash on Delivery"
  };
}

function initCheckout() {
  if (el.checkoutBtn) el.checkoutBtn.addEventListener("click", openCheckout);

  // Clear an error as soon as the visitor starts fixing the field.
  [el.coName, el.coPhone, el.coAddress].forEach(function (input) {
    if (!input) return;
    input.addEventListener("input", function () {
      const error = input.closest(".field").querySelector(".field__error");
      if (error && !error.hidden) clearFieldErrors();
    });
  });

  if (!el.checkoutForm) return;
  el.checkoutForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!validateCheckout()) {
      showToast("Check your details", "Name, phone and address are required.", "error");
      return;
    }
    placeOrder();
  });
}


/* ==========================================================================
   16. ON-SITE ORDER SYSTEM
   ========================================================================== */

/** Sequential, human-friendly order reference, e.g. JAN-1042. */
function generateOrderId() {
  const stored = storage.get(STORAGE_KEYS.orders, []);
  const count = Array.isArray(stored) ? stored.length : 0;
  const seq = String(1001 + count).slice(-4);
  const jitter = String(Math.floor(Math.random() * 90) + 10);
  return RESTAURANT.orderPrefix + "-" + seq + jitter;
}

/** "2 Oct 2026, 7:42 pm" */
function formatOrderDate(value) {
  const date = value instanceof Date ? value : new Date(value);
  if (isNaN(date.getTime())) return "";
  let hours = date.getHours();
  const suffix = hours >= 12 ? "pm" : "am";
  hours = hours % 12 || 12;
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return (
    date.getDate() + " " + MONTHS[date.getMonth()] + " " + date.getFullYear() +
    ", " + hours + ":" + minutes + " " + suffix
  );
}

/** Estimated hand-over window shown on the receipt. */
function estimateDelivery() {
  const now = new Date();
  const from = new Date(now.getTime() + 30 * 60000);
  const to = new Date(now.getTime() + 50 * 60000);
  const sameDay =
    from.getDate() === to.getDate() &&
    from.getMonth() === to.getMonth() &&
    from.getFullYear() === to.getFullYear();

  const timeOnly = formatOrderDate(to).split(", ").pop();
  return sameDay
    ? formatOrderDate(from).split(", ").pop() + " - " + timeOnly
    : formatOrderDate(from) + " - " + formatOrderDate(to);
}

/** Snapshot the cart into plain receipt lines. */
function buildReceiptItems() {
  return cart.map(function (line) {
    return {
      name: line.name,
      variant: line.variant,
      sauceName: line.sauceId === "none" ? "" : line.sauceName,
      notes: line.notes || "",
      qty: line.qty,
      unitPrice: lineUnitPrice(line),
      total: lineTotal(line)
    };
  });
}

/** Persist the order on this device and return the saved record. */
function saveOrder(order) {
  const stored = storage.get(STORAGE_KEYS.orders, []);
  const list = Array.isArray(stored) ? stored.slice() : [];
  list.unshift(order);
  storage.set(STORAGE_KEYS.orders, list.slice(0, ORDERS_HISTORY_LIMIT));
  return order;
}

/** Every order placed from this device (newest first). */
function loadOrders() {
  const stored = storage.get(STORAGE_KEYS.orders, []);
  return Array.isArray(stored) ? stored : [];
}

function placeOrder() {
  const customer = collectCustomer();
  saveCustomer(customer);

  const totals = calculateTotals();
  const order = saveOrder({
    id: generateOrderId(),
    placedAt: new Date().toISOString(),
    status: "received",
    eta: estimateDelivery(),
    customer: customer,
    items: buildReceiptItems(),
    subtotal: totals.subtotal,
    delivery: totals.delivery,
    total: totals.total,
    payment: "Cash on Delivery"
  });

  closeCheckout();
  openSuccess(order);

  clearCart(false);
  if (el.checkoutForm) el.checkoutForm.reset();
  loadCustomer();
}


/* ==========================================================================
   17. ORDER RECEIPT
   ========================================================================== */

const STATUS_LABELS = {
  received: "Order Received",
  preparing: "Preparing",
  out: "Out For Delivery",
  completed: "Completed"
};

/** Render the saved order into the on-site receipt. */
function renderReceipt(order) {
  if (el.successOrderId) el.successOrderId.textContent = order.id;
  if (el.successStatus) el.successStatus.textContent = STATUS_LABELS[order.status] || STATUS_LABELS.received;
  if (el.successTotal) el.successTotal.textContent = formatPrice(order.total);
  if (el.successDate) el.successDate.textContent = formatOrderDate(order.placedAt);
  if (el.successEta) el.successEta.textContent = order.eta || "";

  if (el.receiptItems) {
    el.receiptItems.innerHTML = order.items.map(function (item) {
      const extras = [];
      if (item.sauceName) extras.push(item.sauceName);
      if (item.notes) extras.push("Note: " + item.notes);
      return (
        '<li class="receipt__item">' +
          '<div class="receipt__row">' +
            '<span class="receipt__qty">' + item.qty + "&times;</span>" +
            '<span class="receipt__name">' + escapeHtml(item.name) +
              (item.variant ? ' <span class="receipt__variant">' + escapeHtml(item.variant) + "</span>" : "") +
            "</span>" +
            '<span class="receipt__amount">' + formatPrice(item.total) + "</span>" +
          "</div>" +
          (extras.length ? '<p class="receipt__extras">' + escapeHtml(extras.join(" \u00b7 ")) + "</p>" : "") +
        "</li>"
      );
    }).join("");
  }

  if (el.receiptTotals) {
    el.receiptTotals.innerHTML =
      '<div class="receipt__row"><span>Subtotal</span><span>' + formatPrice(order.subtotal) + "</span></div>" +
      '<div class="receipt__row"><span>Delivery</span><span>' + formatPrice(order.delivery) + "</span></div>" +
      '<div class="receipt__row receipt__row--total"><span>Total</span><span>' + formatPrice(order.total) + "</span></div>";
  }

  if (el.receiptCustomer) {
    const c = order.customer;
    el.receiptCustomer.innerHTML =
      '<div class="receipt__row"><span>Name</span><span>' + escapeHtml(c.name) + "</span></div>" +
      '<div class="receipt__row"><span>Phone</span><span>' + escapeHtml(c.phone) + "</span></div>" +
      '<div class="receipt__row"><span>Address</span><span>' + escapeHtml(c.address) + "</span></div>" +
      (c.landmark ? '<div class="receipt__row"><span>Landmark</span><span>' + escapeHtml(c.landmark) + "</span></div>" : "") +
      '<div class="receipt__row"><span>Payment</span><span>' + escapeHtml(order.payment) + "</span></div>";
  }
}

function openSuccess(order) {
  renderReceipt(order);
  openOverlay(el.successModal, el.successPrint || el.successBack);
}

function closeSuccess() {
  closeOverlay(el.successModal);
}

function initSuccess() {
  if (el.successPrint) {
    el.successPrint.addEventListener("click", function () {
      window.print();
    });
  }

  if (el.successBack) {
    el.successBack.addEventListener("click", function () {
      closeSuccess();
      const menu = document.getElementById("menu");
      if (menu) menu.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
}


/* ==========================================================================
   18. TOAST NOTIFICATIONS
   ========================================================================== */

function showToast(title, message, kind) {
  if (!el.toasts) return;

  const type = kind || "success";
  const node = document.createElement("div");
  node.className = "toast toast--" + type;
  node.innerHTML =
    '<span class="toast__icon" aria-hidden="true">' + (type === "error" ? "!" : "✓") + "</span>" +
    '<span class="toast__text">' +
      '<span class="toast__title">' + escapeHtml(title) + "</span>" +
      '<span class="toast__msg">' + escapeHtml(message) + "</span>" +
    "</span>";

  el.toasts.appendChild(node);

  const remove = function () {
    node.classList.add("is-out");
    setTimeout(function () {
      if (node.parentNode) node.parentNode.removeChild(node);
    }, 300);
  };

  setTimeout(remove, TOAST_DURATION);
  node.addEventListener("click", remove);
}


/* ==========================================================================
   19. NAVIGATION
   ========================================================================== */

/* --- Sticky header state --- */
function initHeaderScroll() {
  if (!el.header) return;
  let ticking = false;

  const update = function () {
    el.header.classList.toggle("is-stuck", window.scrollY > 12);
    ticking = false;
  };

  window.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  }, { passive: true });

  update();
}

/* --- Mobile menu ---
   Routed through openOverlay/closeOverlay so the drawer shares the site's
   overlay stack, which gives it the body scroll lock, focus return to the
   burger, the Tab focus trap and the global Escape handler for free. */
function applyMobileMenuState(open) {
  if (!el.mobileMenu) return;

  el.mobileMenu.setAttribute("aria-hidden", open ? "false" : "true");
  if (el.burgerBtn) {
    el.burgerBtn.setAttribute("aria-expanded", open ? "true" : "false");
    el.burgerBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  if (el.navBackdrop) {
    if (open) {
      el.navBackdrop.hidden = false;
      window.requestAnimationFrame(function () { el.navBackdrop.classList.add("is-open"); });
    } else {
      el.navBackdrop.classList.remove("is-open");
      setTimeout(function () { el.navBackdrop.hidden = true; }, 320);
    }
  }

  $$("[data-mnav]").forEach(function (link) {
    link.classList.toggle("is-active", link.getAttribute("data-mnav") === state.activeSection);
  });

  /* closeOverlay() restores focus to whatever was focused when the drawer
     opened, but iOS/Safari does not focus a <button> on tap, so that is
     usually <body> and focus is simply lost. The trigger is always the
     burger, so hand focus back to it explicitly. */
  if (!open && el.burgerBtn) el.burgerBtn.focus({ preventScroll: true });
}

function setMobileMenu(open) {
  if (!el.mobileMenu || !el.burgerBtn || !el.mobileMenuWrap) return;

  const isOpen = el.mobileMenuWrap.classList.contains("is-open");
  if (open === isOpen) return;
  if (open) openOverlay(el.mobileMenuWrap, el.mobileMenuClose);
  else closeOverlay(el.mobileMenuWrap);
}

function initMobileMenu() {
  /* closeOverlay() drops .is-open without running the rest of the teardown,
     and the global Escape handler calls it directly, so the backdrop and ARIA
     state would otherwise be stranded on screen. Watching the class keeps
     them in sync no matter who closed the drawer. */
  if (el.mobileMenuWrap && typeof MutationObserver !== "undefined") {
    new MutationObserver(function () {
      applyMobileMenuState(el.mobileMenuWrap.classList.contains("is-open"));
    }).observe(el.mobileMenuWrap, { attributes: true, attributeFilter: ["class"] });
  }

  if (el.burgerBtn) {
    el.burgerBtn.addEventListener("click", function () {
      setMobileMenu(!el.mobileMenuWrap.classList.contains("is-open"));
    });
  }
  if (el.mobileMenuClose) {
    el.mobileMenuClose.addEventListener("click", function () { setMobileMenu(false); });
  }
  if (el.navBackdrop) el.navBackdrop.addEventListener("click", function () { setMobileMenu(false); });

  $$("[data-mnav]").forEach(function (link) {
    link.addEventListener("click", function () { setMobileMenu(false); });
  });

  window.addEventListener("resize", debounce(function () {
    if (window.innerWidth > 1023) setMobileMenu(false);
  }, 150));
}

/* --- Scroll spy + active indicator --- */
state.activeSection = "home";

const SPY_SECTIONS = ["home", "menu", "deals", "about", "contact"];

function positionIndicator() {
  if (!el.navIndicator || !el.navlinks) return;

  const activeLink = $(".navlink.is-active", el.navlinks);
  if (!activeLink || window.innerWidth <= 1023) {
    el.navIndicator.style.opacity = "0";
    return;
  }

  const linkBox = activeLink.getBoundingClientRect();
  const parentBox = el.navlinks.getBoundingClientRect();

  el.navIndicator.style.width = linkBox.width + "px";
  el.navIndicator.style.transform = "translateX(" + (linkBox.left - parentBox.left) + "px)";
  el.navIndicator.style.opacity = "1";
}

function setActiveSection(id) {
  if (state.activeSection === id) return;
  state.activeSection = id;

  $$(".navlink").forEach(function (link) {
    link.classList.toggle("is-active", link.getAttribute("data-nav") === id);
  });
  $$("[data-mnav]").forEach(function (link) {
    link.classList.toggle("is-active", link.getAttribute("data-mnav") === id);
  });

  positionIndicator();
}

function initScrollSpy() {
  if (!("IntersectionObserver" in window)) return;

  const sections = SPY_SECTIONS
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  if (!sections.length) return;

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActiveSection(entry.target.id);
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach(function (section) { observer.observe(section); });

  window.addEventListener("resize", debounce(positionIndicator, 120));
  window.addEventListener("load", positionIndicator);
}

function initNavInitialState() {
  setTimeout(positionIndicator, 60);
  if (el.header) el.header.classList.add("is-ready");
}


/* ==========================================================================
   20. SCROLL REVEAL
   ========================================================================== */

const REDUCED_MOTION = (function () {
  try { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; }
  catch (err) { return false; }
})();

const REVEAL_TARGETS = [
  [".hero__content", "left"],
  [".hero__visual", "zoom"],
  [".sechead", ""],
  [".feature", ""],
  [".about__visual", "left"],
  [".about__body", "right"],
  [".whycard", ""],
  [".infocard", ""],
  [".contact__card", "left"],
  [".contact__map", "right"],
  [".deal", ""],
  [".footer__grid > *", ""]
];

function initReveal() {
  if (REDUCED_MOTION || !("IntersectionObserver" in window)) return;

  REVEAL_TARGETS.forEach(function (pair) {
    const sel = pair[0];
    const dir = pair[1];
    $$(sel).forEach(function (node, index) {
      node.setAttribute("data-reveal", dir);
      node.style.transitionDelay = Math.min(index * 60, 300) + "ms";
    });
  });

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
  );

  $$("[data-reveal]").forEach(function (node) { observer.observe(node); });
}


/* ==========================================================================
   21. INITIALIZATION
   ========================================================================== */

function hideLoader() {
  if (!el.loader) return;
  el.loader.classList.add("is-hidden");
  setTimeout(function () { if (el.loader.parentNode) el.loader.parentNode.removeChild(el.loader); }, 600);
}

function initLoader() {
  let hidden = false;
  const done = function () {
    if (hidden) return;
    hidden = true;
    hideLoader();
  };

  if (document.readyState === "complete") {
    setTimeout(done, 220);
  } else {
    window.addEventListener("load", function () { setTimeout(done, 220); });
    // Hard stop: never trap the visitor on the loader.
    setTimeout(done, LOADER_MAX_DELAY);
  }
}

function initializeWebsite() {
  attachImageFallback();
  bindStaticImages();

  renderFeatures();
  renderWhyUs();
  renderDeals();
  socialMarkup(el.socialList);
  socialMarkup(el.socialListFooter);
  bindWhatsAppLinks();

  renderFeaturedProducts();
  renderProducts();

  initFilters();
  initQuantityControls();
  initProductModal();
  initCart();
  initCheckout();
  initSuccess();

  loadCart();
  loadCustomer();
  updateCart();

  initHeaderScroll();
  initMobileMenu();
  initScrollSpy();
  initNavInitialState();
  initReveal();
  initLoader();

  if (!storage.available) {
    showToast(
      "Session only",
      "Local storage is unavailable, so your cart will not survive a refresh.",
      "error"
    );
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeWebsite);
} else {
  initializeWebsite();
}
