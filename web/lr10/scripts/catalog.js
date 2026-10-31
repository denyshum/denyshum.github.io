const cartLink = document.getElementById("cartLink");
const cartCount = document.getElementById("cartCount");

function updateCount() {
    cartCount.textContent = getCartIds().length;
}

cartLink.addEventListener("click", (event) => {
    if (getCartIds().length > 0) {
        return;
    }
    event.preventDefault();
    showEmptyCart();
});

document.querySelectorAll(".product-card .button--primary").forEach((link) => {
    link.addEventListener("click", (event) => {
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
});

window.addEventListener("pageshow", updateCount);