const cartLink = document.getElementById("cartLink");
const cartCount = document.getElementById("cartCount");
const catalogTitle = document.querySelector(".catalog__title");
const catalogList = document.getElementById("product-container");

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
    const card = createElementWithClass("div", "product-card");
    card.dataset.id = product.id;

    if (product.badge) {
        const badge = createElementWithClass("div", `product-card__badge product-card__badge--${product.badgeType}`, product.badge);
        card.append(badge);
    }

    const category = createProductLink("product-card__category", product.categoryUrl, product.category);
    const imageLink = createProductLink("product-card__image-link", product.url);
    imageLink.title = `Переглянути книгу ${product.name}`;
    const image = createElementWithClass("img", "product-card__image");
    image.src = product.image;
    image.alt = `Книга ${product.name}`;
    imageLink.append(image);

    const title = createElementWithClass("h3", "product-card__title");
    title.append(createProductLink("product-card__title-link", product.url, product.name));

    const price = createElementWithClass("div", "product-card__price");
    if (product.oldPrice) {
        price.append(createElementWithClass("span", "product-card__price-old", `${product.oldPrice} грн`));
    }
    if (product.available) {
        price.append(createElementWithClass("span", "product-card__price-value", product.price), " грн");
    }

    const actions = createElementWithClass("div", "product-card__actions");
    if (product.available) {
        actions.append(createProductLink("button button--primary", "#", "У корзину"));
    } else {
        actions.append(createElementWithClass("span", "button button--unavailable", "Незабаром у продажі"));
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

    askQuantity(1, "Додати до корзини", (qty) => {
        setQty(id, getQty(id) + qty);
        updateCount();
        showModal("Товар додано", [
            {
                label: "Перейти у корзину",
                primary: true,
                onClick: () => {
                    location.href = "cart.html";
                }
            },
            { label: "Повернутись до покупок", onClick: closeModal }
        ]);
    });
});

async function initCatalog() {
    const catalog = await loadProducts();
    catalogTitle.textContent = catalog.title;

    const prevArrow = createElementWithClass("div", "catalog__arrow catalog__arrow--prev", "<");
    const nextArrow = createElementWithClass("div", "catalog__arrow catalog__arrow--next", ">");
    catalogList.append(prevArrow, nextArrow);

    const cards = catalog.products.map(createProductCard);
    catalogList.append(...cards);
    let firstIndex = 0;
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

window.addEventListener("pageshow", updateCount);
initCatalog();
