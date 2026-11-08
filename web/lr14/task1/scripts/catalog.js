const cartLink = document.getElementById("cartLink");
const cartCount = document.getElementById("cartCount");
const catalogTitle = document.querySelector(".catalog__title");
const catalogList = document.getElementById("product-container");
let catalogData = null;
let firstIndex = 0;

function updateCount() {
    cartCount.textContent = getCartIds().length;
}

function createElementWithClass(tag, className, text = "") {
    const element = document.createElement(tag);
    element.className = className;
    element.textContent = text;
    return element;
}

function createProductLink(className, url, text = "") {
    const link = createElementWithClass("a", className, text);
    link.href = url;
    link.hreflang = "uk";
    link.title = text;
    return link;
}

// Створює картку товару на основі даних із JSON
function createProductCard(product) {
    const name = translations.products[product.id].name;
    const categoryName = translations.products[product.id].category;
    const card = createElementWithClass("div", "product-card");
    card.dataset.id = product.id;

    if (product.badge) {
        const badge = createElementWithClass("div", `product-card__badge product-card__badge--${product.badgeType}`, translations[product.badgeType]);
        card.append(badge);
    }

    const category = createProductLink("product-card__category", product.categoryUrl, categoryName);
    const imageLink = createProductLink("product-card__image-link", product.url);
    imageLink.title = `${translations.viewBook} ${name}`;
    const image = createElementWithClass("img", "product-card__image");
    image.src = "../" + product.image;
    image.alt = `${translations.book} ${name}`;
    imageLink.append(image);

    const title = createElementWithClass("h3", "product-card__title");
    title.append(createProductLink("product-card__title-link", product.url, name));

    const price = createElementWithClass("div", "product-card__price");
    if (product.oldPrice) {
        price.append(createElementWithClass("span", "product-card__price-old", `${product.oldPrice} ${translations.currency}`));
    }
    if (product.available) {
        price.append(createElementWithClass("span", "product-card__price-value", product.price), ` ${translations.currency}`);
    }

    const actions = createElementWithClass("div", "product-card__actions");
    if (product.available) {
        actions.append(createProductLink("button button--primary", "#", translations.addToCart));
    } else {
        actions.append(createElementWithClass("span", "button button--unavailable", translations.unavailable));
    }

    card.append(category, imageLink, title, price, actions);
    return card;
}

cartLink.addEventListener("click", (event) => {
    if (getCartIds().length > 0) {
        return;
    }
    event.preventDefault();
    showEmptyCart();
});

// Делегування події для динамічно створених кнопок
catalogList.addEventListener("click", (event) => {
    const link = event.target.closest(".button--primary");
    if (!link) {
        return;
    }
    event.preventDefault();
    const id = link.closest(".product-card").dataset.id;

    askQuantity(1, translations.confirmAdd, (qty) => {
        setQty(id, getQty(id) + qty);
        updateCount();
        showModal(translations.added, [
            {
                label: translations.goToCart,
                primary: true,
                onClick: () => {
                    location.href = "cart.html";
                }
            },
            { label: translations.continueShopping, onClick: closeModal }
        ]);
    });
});

function renderCatalog() {
    if (!catalogData) {
        return;
    }
    catalogList.replaceChildren();
    catalogTitle.textContent = translations.catalogTitle;

    const prevArrow = createElementWithClass("div", "catalog__arrow catalog__arrow--prev", "<");
    const nextArrow = createElementWithClass("div", "catalog__arrow catalog__arrow--next", ">");
    catalogList.append(prevArrow, nextArrow);

    const cards = catalogData.products.map(createProductCard);
    catalogList.append(...cards);
    const visibleCount = 4;

    function showProducts() {
        cards.forEach((card, index) => {
            card.hidden = index < firstIndex || index >= firstIndex + visibleCount;
        });
        prevArrow.hidden = firstIndex === 0;
        nextArrow.hidden = firstIndex + visibleCount >= cards.length;
    }

    prevArrow.addEventListener("click", () => {
        if (firstIndex > 0) {
            firstIndex--;
            showProducts();
        }
    });

    nextArrow.addEventListener("click", () => {
        if (firstIndex + visibleCount < cards.length) {
            firstIndex++;
            showProducts();
        }
    });

    showProducts();
    updateCount();
}

async function initCatalog() {
    await languageReady;
    catalogData = await loadProducts();
    renderCatalog();
}

document.addEventListener("languagechange", renderCatalog);
window.addEventListener("pageshow", updateCount);
initCatalog();
