let cart = [];
let notificationTimeout;

const productGrid = document.getElementById('product-grid');
const searchInput = document.getElementById('search-input');
const cartCount = document.getElementById('cart-count');
const cartNotification = document.getElementById('cart-notification');
const categoryFilters = document.querySelectorAll('.category-filter');
const cartButton = document.getElementById('cart-button');
const cartDialog = document.getElementById('cart-dialog');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const closeCartButton = document.getElementById('close-cart');
const cartFeedback = document.getElementById('cart-feedback');

// 3. Create and Render Product Cards
/** Build a card for one product and wire its Add to cart buttons to that product ID. */
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

    // Bind during creation so re-rendered cards keep working.
    card.querySelectorAll('[aria-label="Add to cart"]').forEach(button => {
        button.addEventListener('click', () => addToCart(product.id));
    });

    return card;
}

/** Replace the current cards with the supplied products; filtering stays in filterProducts. */
function renderProducts(productsToRender) {
    productGrid.textContent = '';
    productsToRender.forEach(product => {
        productGrid.appendChild(createProductCard(product));
    });
}

// 4. Add to Cart Function
/** Add one catalogue item. Repeated additions stay as separate entries in the cart. */
function addToCart(productId) {
    const product = products.find(product => product.id === productId);
    if (!product) {
        return;
    }

    cart.push(product);
    updateCartCount();

    let message = `${product.name} added to cart. Items in cart: ${cart.length}.`;
    if (!saveCart()) {
        message += ' Cart changes could not be saved for reload.';
    }
    showCartNotification(message);
}

// 5. Update Cart Count UI
/** Update the accessible item count and refresh the cart display if it is open. */
function updateCartCount() {
    cartCount.textContent = cart.length;
    cartCount.parentElement.setAttribute('aria-label', `Cart (${cart.length})`);
    if (cart.length === 0) {
        cartCount.classList.add('hidden');
    } else {
        cartCount.classList.remove('hidden');
    }
    if (cartDialog.open) {
        renderCart();
    }
}

/** Save the current cart and report failure without discarding its in-memory state. */
function saveCart() {
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
        return true;
    } catch (error) {
        console.warn('Cart changes could not be saved.', error);
        return false;
    }
}

/** Group repeated cart entries for display while preserving the stored array format. */
function renderCart() {
    cartItems.textContent = '';
    const items = [];
    cart.forEach(product => {
        const item = items.find(item => item.product.id === product.id);
        if (item) {
            item.quantity += 1;
        } else {
            items.push({ product, quantity: 1 });
        }
    });

    let total = 0;
    items.forEach(item => {
        const row = document.createElement('li');
        row.className = 'flex items-center justify-between gap-4 py-4';
        row.innerHTML = `
            <div class="min-w-0">
                <h3 class="font-semibold break-words"></h3>
                <p class="mt-1 text-sm text-muted"></p>
                <p class="mt-1 text-sm font-semibold"></p>
            </div>
            <button type="button" class="shrink-0 rounded-xl border border-line bg-inset px-3 py-2 text-sm hover:text-brand">Remove</button>
        `;
        const linePrice = item.product.price * item.quantity;
        total += linePrice;
        row.querySelector('h3').textContent = item.product.name;
        row.querySelector('h3 + p').textContent = `Quantity: ${item.quantity}`;
        row.querySelector('p + p').textContent = linePrice.toLocaleString(undefined, {
            style: 'currency', currency: 'SEK'
        });
        const removeButton = row.querySelector('button');
        removeButton.setAttribute('aria-label', `Remove all ${item.product.name} from cart`);
        removeButton.addEventListener('click', () => removeFromCart(item.product.id));
        cartItems.appendChild(row);
    });

    if (items.length === 0) {
        const emptyMessage = document.createElement('li');
        emptyMessage.className = 'py-4 text-muted';
        emptyMessage.textContent = 'Your cart is empty.';
        cartItems.appendChild(emptyMessage);
    }
    cartTotal.textContent = total.toLocaleString(undefined, { style: 'currency', currency: 'SEK' });
}

/** Remove all copies of one product, save the change, and keep focus in the modal. */
function removeFromCart(productId) {
    const product = cart.find(product => product.id === productId);
    if (!product) return;
    cart = cart.filter(product => product.id !== productId);
    updateCartCount();
    let message = `${product.name} removed from cart. Items in cart: ${cart.length}.`;
    if (!saveCart()) {
        message += ' Cart changes could not be saved for reload.';
    }
    showCartNotification(message);
    if (cartDialog.open) {
        (cartItems.querySelector('button') || closeCartButton).focus();
    }
}

/** Announce cart changes accessibly and let newer messages replace older ones. */
function showCartNotification(message) {
    clearTimeout(notificationTimeout);
    cartNotification.textContent = message;
    cartNotification.classList.remove('hidden');
    // The page behind the modal is inert, so repeat feedback inside it.
    cartFeedback.textContent = message;
    notificationTimeout = setTimeout(() => {
        cartNotification.classList.add('hidden');
        cartNotification.textContent = '';
    }, 4000);
}

/** Restore valid product IDs from storage, using current catalogue data. */
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
/** Apply category and case-insensitive name/description filters together. */
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

if (searchInput) {
    searchInput.addEventListener('input', filterProducts);
}

categoryFilters.forEach(filter => {
    filter.addEventListener('change', filterProducts);
});

// Native dialog behavior provides Escape dismissal and returns focus to the opener.
cartButton.addEventListener('click', () => {
    renderCart();
    cartFeedback.textContent = '';
    cartDialog.showModal();
});
closeCartButton.addEventListener('click', () => cartDialog.close());

document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    updateCartCount();
    filterProducts();
});
