![Lexicon Logo](https://lexicongruppen.se/media/wi5hphtd/lexicon-logo.svg)

# JavaScript Workshop: Building an Interactive Store

In this workshop, you will transform parts of a static HTML product listing into a dynamic and interactive e-commerce page. You will use the `products.js` file as your data source.

## Prerequisites
- Link `products.js` and a new `main.js` file in your `JS_Workshop.html`.
- Ensure you have the `products` array available in your global scope.

---

## Task 1: Dynamic Product Listing
Instead of having hardcoded products in your HTML, you will generate them using JavaScript.

### Steps:
1. Select the product grid container in `JS_Workshop.html` (add an `id="product-grid"` to the container if it doesn't have one).
2. Create a function `renderProducts(productsToRender)` that:
    - Clears the current content of the grid.
    - Loops through the provided array.
    - Creates a product card for each item using template literals or `document.createElement`.
    - Appends the card to the grid.

### Hint:
```javascript
function createProductCard(product) {
    return `
        <article
            class="border border-slate-200 rounded-[1.25rem] bg-white p-3 transition-all duration-400 hover:border-blue-400 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 group">
            <!-- Image Container -->
            <div class="relative overflow-hidden rounded-2xl bg-slate-100">
                <img src="${product.image}" alt="${product.name}"
                     class="aspect-[4/5] w-full object-cover group-hover:scale-110 transition-transform duration-700"/>
            </div>

            <!-- Info Details -->
            <div class="mt-4 px-1 pb-2 space-y-1">
                <p class="text-[10px] font-black uppercase tracking-[0.15em] text-blue-600/70">
                    ${product.category}</p>
                <h3 class="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    ${product.name}</h3>
                <p class="text-[11px] font-medium text-slate-500">${product.availability}</p>

                <div class="flex items-center justify-between gap-3 pt-3">
                    <span class="text-lg font-black text-slate-900 tracking-tight">${product.price.toLocaleString(undefined, { style: "currency", currency: "SEK" })}</span>

                    <button type="button" onclick="addToCart(${product.id})"
                            class="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-xs font-bold text-white transition-all duration-300 hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-200 active:scale-95 group/btn"
                            aria-label="Add to cart">
                        Add to cart
                    </button>
                </div>
            </div>
        </article>
    `;
}
```

---

## Task 2: Filtering by Category
Make the sidebar checkboxes functional so users can filter products by their category.

### Steps:
1. Add `id` or `class` to the category checkboxes (e.g., `class="category-filter"`).
2. Attach a `change` event listener to all checkboxes.
3. When a checkbox changes:
    - Collect all checked categories.
    - If "All Products" is checked (or nothing is checked), show everything.
    - Otherwise, filter the `products` array to include only matching categories.
    - Call `renderProducts()` with the filtered list.

---

## Task 3: Real-time Search
Implement the search bar functionality to filter products by name or description.

### Steps:
1. Select the search input field.
2. Add an `input` event listener.
3. As the user types, filter the product array based on whether the `name` or `description` includes the search string (case-insensitive).
4. Update the UI using `renderProducts()`.

---

## Task 4: (Optional) Shopping Cart Logic
Keep track of products added to the cart and update the cart counter in the header.

### Steps:
1. Initialize an empty `cart` array.
2. Create the `addToCart(productId)` function:
    - Find the product in the `products` array by ID.
    - Add it to the `cart` array.
    - Update the number shown on the cart icon in the header.
    -  Show a small notification or "toast" when an item is added.

---

## Task 5: (Optional) Persistent Cart (Local Storage)
Make sure the cart items stay there even if the page is refreshed.

### Steps:
1. Every time `addToCart` is called, save the `cart` array to `localStorage` using `JSON.stringify()`.
2. When the page loads, check `localStorage` for any saved cart data using `JSON.parse()`.
3. Update the cart counter immediately on page load.


---

## Task 6: (Optional) Enhance with Additional Features

Review the static HTML design and implement more interactive features to improve the user experience.

### Suggested Features:

1. **Sort Products**: Add sorting functionality (e.g., by price, name, or category) using a dropdown or button group.
2. **Price Range Filter**: If there are price filter inputs in the design, make them functional by filtering products
   within a min/max price range.
3. **Product Details Modal**: Create a modal or overlay that shows detailed product information when clicking on a
   product card.
4. **View Cart**: Implement a cart sidebar or modal that displays all items added to the cart with the ability to remove
   items or update quantities.
5. **Favorites/Wishlist**: Add a heart icon to each product card and allow users to save favorite products to a separate
   list.
6. **Loading States**: Add loading indicators or skeleton screens while products are being "fetched" or filtered.
7. **Empty States**: Show friendly messages when no products match the current filters or when the cart is empty.
8. **Animations**: Add smooth transitions when products appear, disappear, or when switching between views.

### Tips:

- Look at your static HTML for any UI elements that aren't yet interactive (buttons, inputs, icons).
- Consider user feedback - use visual cues like disabled states, hover effects, and success messages.
- Test edge cases like empty results, full cart, and multiple simultaneous filters.

## Store styling

The page loads `store.css` locally, so the layout does not depend on the browser
loading Tailwind from a CDN. The generated stylesheet is included in the project;
opening the page with Live Server does not require a build.

After changing Tailwind classes, colors in `tailwind.config.js`, or custom CSS in
`styles.css`, run this command from the workshop folder to regenerate `store.css`:

```shell
npx --yes tailwindcss@3.4.19 --config ./tailwind.config.js --input ./styles.css --output ./store.css --minify
```

Edit the source files rather than the generated `store.css` file.
