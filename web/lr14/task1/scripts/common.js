const PRODUCTS = {};

// Завантажує дані каталогу для сторінки товарів і корзини
async function loadProducts() {
    const response = await fetch("https://denyshum.github.io/web/lr13/products.json");
    const catalog = await response.json();

    catalog.products.forEach(product => {
        PRODUCTS[product.id] = product;
    });

    return catalog;
}

const modal = document.getElementById("modal");

function getQty(id) {
    return Number(localStorage.getItem(`cart_${id}`)) || 0;
}

function setQty(id, qty) {
    localStorage.setItem(`cart_${id}`, qty);
}

function removeItem(id) {
    localStorage.removeItem(`cart_${id}`);
}

function getCartIds() {
    return Object.keys(PRODUCTS).filter((id) => getQty(id) > 0);
}

function closeModal() {
    modal.close();
}

modal.addEventListener("click", (event) => {
    if (event.target === modal) {
        closeModal();
    }
});

function showModal(message, buttons, extras = []) {
    const box = document.createElement("div");
    box.className = "modal__box";

    const text = document.createElement("p");
    text.className = "modal__text";
    text.textContent = message;

    const actions = document.createElement("div");
    actions.className = "modal__actions";
    buttons.forEach((item) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = item.primary ? "button button--primary" : "button button--secondary";
        button.textContent = item.label;
        button.addEventListener("click", item.onClick);
        actions.append(button);
    });

    box.append(text, ...extras, actions);
    modal.replaceChildren(box);
    if (!modal.open) {
        modal.showModal();
    }
}

function showEmptyCart() {
    showModal(translations.emptyCart, [{label: translations.close, onClick: closeModal}]);
}

function askQuantity(initial, confirmLabel, onConfirm) {
    const field = document.createElement("input");
    field.type = "number";
    field.className = "modal__field";
    field.min = "1";
    field.value = initial;

    const error = document.createElement("p");
    error.className = "modal__error";

    showModal(translations.quantityPrompt, [
        { label: translations.cancel, onClick: closeModal },
        {
            label: confirmLabel,
            primary: true,
            onClick: () => {
                const qty = Number(field.value);
                if (!Number.isInteger(qty) || qty < 1) {
                    error.textContent = translations.quantityError;
                    return;
                }
                onConfirm(qty);
            }
        }
    ], [field, error]);

    field.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            modal.querySelector(".button--primary").click();
        }
    });
    field.select();
}
