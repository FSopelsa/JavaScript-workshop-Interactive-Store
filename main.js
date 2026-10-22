// main.js

// 1. Initialize State
let cart = [];

// 2. Select DOM Elements
const productGrid = document.getElementById('product-grid');
const searchInput = document.getElementById('search-input');
const cartCount = document.getElementById('cart-count');
const categoryFilters = document.querySelectorAll('.category-filter');

// 3. Create and Render Product Cards
/**
 * Build one product card and return its <article> element without adding it to the page.
 * Keeping card creation separate means every product uses the same HTML and styling.
 * The template literal below holds the shared design; textContent fills in product
 * text without interpreting characters such as < or & as HTML. The image properties
 * supply its source and accessible description, and toLocaleString formats the price
 * as Swedish kronor using the browser's locale. Cart, quick-view, and favorite buttons
 * keep their existing appearance; their behavior belongs to later workshop tasks.
 */
function createProductCard(product) {
    const card = document.createElement('article');
    card.className = 'border border-slate-200 rounded-[1.25rem] bg-white p-3 transition-all duration-400 hover:border-blue-400 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 group';
    card.innerHTML = `
        <div class="relative overflow-hidden rounded-2xl bg-slate-100">
            <img class="aspect-[4/5] w-full object-cover group-hover:scale-110 transition-transform duration-700"/>

            <!-- Product Overlay Actions -->
            <div class="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                <button type="button"
                        class="h-12 w-12 rounded-full bg-white text-slate-900 shadow-xl flex items-center justify-center translate-y-4 group-hover:translate-y-0 transition-transform duration-500 hover:bg-blue-600 hover:text-white"
                        aria-label="Quick View">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                         fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                         stroke-linejoin="round">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                        <circle cx="12" cy="12" r="3"/>
                    </svg>
                </button>
                <button type="button"
                        class="h-12 w-12 rounded-full bg-white text-slate-900 shadow-xl flex items-center justify-center translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75 hover:bg-blue-600 hover:text-white"
                        aria-label="Add to cart">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                         fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
                         stroke-linejoin="round">
                        <path d="M5 12h14"/>
                        <path d="M12 5v14"/>
                    </svg>
                </button>
            </div>

            <!-- Favorite -->
            <button type="button"
                    class="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/50 bg-white/70 text-slate-600 backdrop-blur-md transition-all duration-300 hover:bg-white hover:text-rose-500 hover:shadow-lg group/heart"
                    aria-label="Add to favorites" title="Favorite">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                     fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                     stroke-linejoin="round"
                     class="transition-colors group-hover/heart:fill-rose-500 group-hover/heart:stroke-rose-500">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                </svg>
            </button>
        </div>

        <div class="mt-4 px-1 pb-2 space-y-1">
            <p class="text-[10px] font-black uppercase tracking-[0.15em] text-blue-600/70"></p>
            <h3 class="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors"></h3>
            <p class="text-[11px] font-medium text-slate-500"></p>

            <div class="flex items-center justify-between gap-3 pt-3">
                <span class="text-lg font-black text-slate-900 tracking-tight"></span>
                <button type="button"
                        class="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-xs font-bold text-white transition-all duration-300 hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-200 active:scale-95 group/btn"
                        aria-label="Add to cart">
                    Add to cart
                </button>
            </div>
        </div>
    `;

    const image = card.querySelector('img');
    image.src = product.image;
    image.alt = product.name;
    card.querySelector('p').textContent = product.category;
    card.querySelector('h3').textContent = product.name;
    card.querySelector('h3 + p').textContent = product.availability;
    card.querySelector('span.text-lg').textContent = product.price.toLocaleString(undefined, {
        style: 'currency',
        currency: 'SEK'
    });

    return card;
}

/**
 * Replace the visible cards with the products supplied by the caller.
 * Setting the grid's textContent to an empty string removes all its child nodes,
 * including the previous cards. Repeated calls therefore never duplicate products,
 * and an empty array leaves an empty grid. forEach visits each
 * product in order, and appendChild adds the card returned by createProductCard.
 * This function only displays data: it does not change or filter the supplied array.
 * Later category and search tasks can pass their results to this same function.
 */
function renderProducts(productsToRender) {
    productGrid.textContent = '';
    productsToRender.forEach(product => {
        productGrid.appendChild(createProductCard(product));
    });
}

// 4. Add to Cart Function
function addToCart(productId) {
    // TODO: Find product by id
    // TODO: Add to cart array
    // TODO: Update cart count UI
    // TODO: Save to localStorage
}

// 5. Update Cart Count UI
function updateCartCount() {
    // TODO: Set textContent of cartCount
    // TODO: Show/hide cartCount based on items
}

// 6. Event Listeners
// Search
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        // TODO: Filter products by name or description
    });
}

// Category Filters
/**
 * Show products matching the categories currently checked in the sidebar.
 * Array.from turns the checkbox NodeList into an array so filter can keep checked
 * boxes and map can collect their values, such as 'Outerwear' and 'Footwear'.
 * Here, includes checks whether an entire value appears in an array. Unlike the
 * string includes shown in the presentation, which looks for part of a string,
 * this array version requires an exact category value, including letter case.
 * Following the README, no selection or a checked 'all' box shows every product,
 * even when individual categories are also checked. Otherwise, products.filter
 * keeps a product when its category appears in the selected values. That creates
 * a new array without changing products or its order, so later selections can
 * always start from the full catalogue. renderProducts replaces the visible cards.
 */
function filterProductsByCategory() {
    const checkedCategories = Array.from(categoryFilters)
        .filter(filter => filter.checked)
        .map(filter => filter.value);

    const showAll = checkedCategories.length === 0 || checkedCategories.includes('all');
    const productsToRender = showAll
        ? products
        : products.filter(product => checkedCategories.includes(product.category));

    renderProducts(productsToRender);
}

// Every checkbox uses the same handler, which reads the current selection each time.
categoryFilters.forEach(filter => {
    filter.addEventListener('change', filterProductsByCategory);
});

// 7. Initial Load
document.addEventListener('DOMContentLoaded', () => {
    // TODO: Load cart from localStorage
    // TODO: Update cart count UI
    // products.js loads before main.js, so its full array is available here.
    // Read the initial checkbox state so the first list agrees with the filters.
    filterProductsByCategory();
});
