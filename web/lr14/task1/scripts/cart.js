const cartBody = document.getElementById("cartBody");
const cartTotal = document.getElementById("cartTotal");
const cartTable = document.getElementById("cartTable");
const cartEmpty = document.getElementById("cartEmpty");

function createCell(content) {
    const td = document.createElement("td");
    td.append(content);
    return td;
}

function createLink(label, handler) {
    const link = document.createElement("a");
    link.href = "#";
    link.className = "cart-table__link";
    link.textContent = label;
    link.addEventListener("click", (event) => {
        event.preventDefault();
        handler();
    });
    return link;
}

function render() {
    const ids = getCartIds();
    let total = 0;

    cartBody.innerHTML = "";
    cartTable.hidden = ids.length === 0;
    cartEmpty.hidden = ids.length > 0;

    ids.forEach((id, index) => {
        const product = PRODUCTS[id];
        const qty = getQty(id);
        const sum = product.price * qty;
        total += sum;

        const qtyCell = createCell(qty + " ");
        qtyCell.append(createLink(translations.editQuantity, () => {
            askQuantity(qty, translations.save, (newQty) => {
                setQty(id, newQty);
                closeModal();
                render();
            });
        }));

        const deleteCell = createCell(createLink(translations.delete, () => {
            removeItem(id);
            render();
        }));

        const row = document.createElement("tr");
        row.append(
            createCell(index + 1),
            createCell(translations.products[id].name),
            createCell(product.price.toFixed(2)),
            qtyCell,
            createCell(sum.toFixed(2)),
            deleteCell
        );
        cartBody.append(row);
    });

    cartTotal.textContent = `${total.toFixed(2)} ${translations.currency}`;
}

document.getElementById("payLink").addEventListener("click", (event) => {
    event.preventDefault();
    const ids = getCartIds();
    if (ids.length === 0) {
        showEmptyCart();
        return;
    }

    ids.forEach(removeItem)
    render();
    showModal(translations.thanks, [
        {
            label: translations.continueShopping,
            primary: true,
            onClick: () => {
                location.href = "index.html";
            }
        }
    ]);
});

async function initCart() {
    await languageReady;
    await loadProducts();
    render();
}

document.addEventListener("languagechange", () => {
    if (Object.keys(PRODUCTS).length > 0) {
        render();
    }
});

initCart();
