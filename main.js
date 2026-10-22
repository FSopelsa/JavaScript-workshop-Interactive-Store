let cart = [];
let notificationTimeout;

const productGrid = document.getElementById('product-grid');
const searchInput = document.getElementById('search-input');
const cartCount = document.getElementById('cart-count');
const cartNotification = document.getElementById('cart-notification');
const categoryFilters = document.querySelectorAll('.category-filter');

// 3. Create and Render Product Cards
/**
 * Build one product card and return its <article> element without adding it to the page.
 * Keeping card creation separate means every product uses the same HTML and styling.
 * The template literal below holds the shared design; textContent fills in product
 * text without interpreting characters such as < or & as HTML. The image properties
 * supply its source and accessible description, and toLocaleString formats the price
 * as Swedish kronor using the browser's locale. Both cart buttons use this product's
 * ID when clicked. Quick-view and favorite behavior belongs to later workshop tasks.
 */
function createProductCard(product) {
    const card = document.createElement('article');
    card.className = 'product-card border border-line rounded-[1.125rem] bg-surface p-3 transition-all duration-400 hover:border-brand hover:shadow-lg hover:-translate-y-0.5 group';
    card.innerHTML = `
        <div class="relative overflow-hidden rounded-2xl bg-inset">
            <img class="aspect-[4/5] w-full object-cover group-hover:scale-105 transition-transform duration-700"/>

            <!-- Product Overlay Actions -->
            <div class="product-overlay absolute inset-0 bg-canvas/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                <button type="button"
                        class="h-12 w-12 rounded-full bg-surface text-ink shadow-xl flex items-center justify-center translate-y-4 group-hover:translate-y-0 transition-transform duration-500 hover:bg-brand-hover hover:text-onbrand"
                        aria-label="Quick View">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                         fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                         stroke-linejoin="round">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                        <circle cx="12" cy="12" r="3"/>
                    </svg>
                </button>
                <button type="button"
                        class="h-12 w-12 rounded-full bg-surface text-ink shadow-xl flex items-center justify-center translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75 hover:bg-brand-hover hover:text-onbrand"
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
                    class="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-surface/90 text-muted backdrop-blur-md transition-all duration-300 hover:bg-surface hover:text-brand hover:shadow-lg group/heart"
                    aria-label="Add to favorites" title="Favorite">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                     fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                     stroke-linejoin="round"
                     class="transition-colors group-hover/heart:fill-brand group-hover/heart:stroke-brand">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                </svg>
            </button>
        </div>

        <div class="mt-4 px-1 pb-2 space-y-1">
            <p class="text-[10px] font-semibold uppercase tracking-[0.15em] text-brand"></p>
            <h3 class="text-sm font-bold text-ink group-hover:text-brand transition-colors"></h3>
            <p class="text-[11px] font-medium text-muted"></p>

            <div class="flex flex-col items-stretch gap-3 pt-3">
                <span class="text-lg font-semibold text-ink tracking-tight"></span>
                <button type="button"
                        class="inline-flex h-10 w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-brand px-5 text-xs font-bold text-onbrand transition-all duration-300 hover:bg-brand-hover hover:shadow-lg hover:shadow-black/20 active:scale-95 group/btn"
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

    // Attach listeners while creating the card so newly filtered cards work too.
    // Each callback remembers the product belonging to this particular card.
    card.querySelectorAll('[aria-label="Add to cart"]').forEach(button => {
        button.addEventListener('click', () => addToCart(product.id));
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
 * Category and search filtering pass their results to this same function.
 */
function renderProducts(productsToRender) {
    productGrid.textContent = '';
    productsToRender.forEach(product => {
        productGrid.appendChild(createProductCard(product));
    });
}

// 4. Add to Cart Function
/**
 * Find a product by its numeric ID and add one item to the cart. find returns
 * undefined for an unknown ID, so return before changing anything in that case.
 * push adds another entry even if the product is already present: cart.length
 * therefore counts items, not distinct products. Update the badge immediately.
 * localStorage stores text, so JSON.stringify converts the cart array to JSON.
 * A blocked or full storage area can throw; keep the in-memory cart usable and
 * tell the user if this addition could not be saved for a later page load.
 */
function addToCart(productId) {
    const product = products.find(product => product.id === productId);
    if (!product) {
        return;
    }

    cart.push(product);
    updateCartCount();

    let message = `${product.name} added to cart. Items in cart: ${cart.length}.`;
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
        console.warn('Cart changes could not be saved.', error);
        message += ' Cart changes could not be saved for reload.';
    }
    showCartNotification(message);
}

// 5. Update Cart Count UI
/**
 * Keep the badge and the cart button's accessible label in sync with cart.length.
 * Hide the badge when empty, then reveal it on the first addition. The button's
 * aria-label includes the count so assistive technology can read it as well.
 */
function updateCartCount() {
    cartCount.textContent = cart.length;
    cartCount.parentElement.setAttribute('aria-label', `Cart (${cart.length})`);
    if (cart.length === 0) {
        cartCount.classList.add('hidden');
    } else {
        cartCount.classList.remove('hidden');
    }
}

/**
 * Show plain text in the page's live status region without moving keyboard focus.
 * Cancel the previous timeout so an earlier addition cannot hide a newer message.
 * setTimeout runs the cleanup callback after 4000 milliseconds; assigning its ID
 * lets the next call cancel it with clearTimeout. Clear the text when hiding it.
 */
function showCartNotification(message) {
    clearTimeout(notificationTimeout);
    cartNotification.textContent = message;
    cartNotification.classList.remove('hidden');
    notificationTimeout = setTimeout(() => {
        cartNotification.classList.add('hidden');
        cartNotification.textContent = '';
    }, 4000);
}

/**
 * Restore the cart at startup, starting empty if storage is missing or unusable.
 * JSON.parse turns the saved text back into a JavaScript value. Array.isArray
 * checks its shape before calling array methods: valid JSON can also be a number,
 * string, object, or null. Keep only object entries, then use each saved ID to find
 * the current catalogue product. find returns undefined for removed or invalid IDs;
 * the final filter discards those entries while keeping valid repeated additions.
 * This uses current product names and prices instead of trusting stored copies.
 * Reading storage and parsing malformed JSON can throw, so catch both errors
 * without preventing the rest of the page from loading.
 */
function loadCart() {
    cart = [];
    try {
        const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
        if (Array.isArray(savedCart)) {
            cart = savedCart
                .filter(product => product !== null && typeof product === 'object')
                .map(savedProduct => products.find(product => product.id === savedProduct.id))
                .filter(product => product !== undefined);
        }
    } catch (error) {
        console.warn('The saved cart could not be restored.', error);
    }
}

// 6. Product Filtering and Event Listeners
/**
 * Show products matching both the current category selection and search text.
 * Search and category events use this same function so neither control resets
 * the other's results. Always start from products, not the previously visible
 * cards, so removing a restriction can bring matching products back.
 *
 * Array.from turns the checkbox NodeList into an array so filter can keep checked
 * boxes and map can collect their values, such as 'Outerwear' and 'Footwear'.
 * Here, includes checks whether an entire value appears in an array. Unlike the
 * string includes shown in the presentation, which looks for part of a string,
 * this array version requires an exact category value, including letter case.
 * Following the README, no selection or a checked 'all' box shows every product,
 * even when individual categories are also checked. This rule applies only to
 * categories: a non-empty search query still narrows the results.
 *
 * trim removes whitespace at either end of the query. toLowerCase normalizes the
 * query, name, and description so letter case does not affect matching. Here,
 * string includes checks whether the query appears anywhere in either field.
 * Every string includes the empty string, so clearing the query removes only the
 * search restriction. The final && requires both category and search to match.
 * filter returns a new array in source order; renderProducts displays it once.
 */
function filterProducts() {
    const checkedCategories = Array.from(categoryFilters)
        .filter(filter => filter.checked)
        .map(filter => filter.value);

    const showAll = checkedCategories.length === 0 || checkedCategories.includes('all');
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const productsToRender = products.filter(product => {
        const matchesCategory = showAll || checkedCategories.includes(product.category);
        const matchesSearch = product.name.toLowerCase().includes(query)
            || product.description.toLowerCase().includes(query);

        return matchesCategory && matchesSearch;
    });

    renderProducts(productsToRender);
}

// input runs for each edit, including typing, pasting, and clearing the search field.
if (searchInput) {
    searchInput.addEventListener('input', filterProducts);
}

// Every checkbox uses the same handler, which reads both controls each time.
categoryFilters.forEach(filter => {
    filter.addEventListener('change', filterProducts);
});

// 7. Initial Load
document.addEventListener('DOMContentLoaded', () => {
    // Restore once, then update the header even when no products are in the cart.
    loadCart();
    updateCartCount();
    // products.js loads before main.js, so its full array is available here.
    // Read both controls so the first list agrees with any initial filter values.
    filterProducts();
});
