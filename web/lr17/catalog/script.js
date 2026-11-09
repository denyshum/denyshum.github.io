let translations = {};

// Завантажує переклади без сторонніх бібліотек
async function loadLanguage(selectedLanguage) {
    const response = await fetch(`../locales/${selectedLanguage}.json`);
    translations = await response.json();
}

const LANGUAGE_KEY = "lr17-language";
const languageSelector = document.getElementById("language-selector");
const languageModal = document.getElementById("language-modal");
let language;

// Оновлює статичні тексти та повідомляє каталог або корзину про зміну мови
function updateLanguage() {
    document.documentElement.lang = language;
    languageSelector.value = language;

    document.getElementById("language-label").textContent = translations.language;

    const cartLink = document.getElementById("cartLink");
    if (cartLink) {
        document.getElementById("manage-link").textContent = translations.manageBooks;
        cartLink.title = translations.cart;
        cartLink.querySelector("img").alt = translations.cart;
    } else {
        document.getElementById("cart-heading").textContent = translations.selected;
        document.getElementById("column-number").textContent = translations.number;
        document.getElementById("column-name").textContent = translations.productName;
        document.getElementById("column-price").textContent = translations.unitPrice;
        document.getElementById("column-quantity").textContent = translations.quantity;
        document.getElementById("column-sum").textContent = translations.sum;
        document.getElementById("total-label").textContent = translations.total;
        document.getElementById("cartEmpty").textContent = translations.emptyCart;
        document.getElementById("payLink").textContent = translations.pay;
        document.getElementById("back-link").textContent = translations.continueShopping;
    }

    document.dispatchEvent(new Event("languagechange"));
}

async function changeLanguage(selectedLanguage) {
    await loadLanguage(selectedLanguage);
    language = selectedLanguage;
    localStorage.setItem(LANGUAGE_KEY, language);
    updateLanguage();
}

// Під час першого відвідування очікує вибору мови в модальному вікні
async function initLanguage() {
    let selectedLanguage = localStorage.getItem(LANGUAGE_KEY);

    if (selectedLanguage !== "uk" && selectedLanguage !== "en") {
        languageModal.showModal();
        selectedLanguage = await new Promise(resolve => {
            languageModal.querySelectorAll("[data-language]").forEach(button => {
                button.addEventListener("click", () => {
                    languageModal.close();
                    resolve(button.dataset.language);
                });
            });
        });
    }

    await changeLanguage(selectedLanguage);
    document.getElementById("page").hidden = false;
}

languageModal.addEventListener("cancel", event => {
    event.preventDefault();
});

languageSelector.addEventListener("change", async () => {
    languageSelector.disabled = true;
    try {
        await changeLanguage(languageSelector.value);
    } finally {
        languageSelector.disabled = false;
    }
});

// Відновлює актуальну мову після повернення кнопкою браузера «Назад»
window.addEventListener("pageshow", async event => {
    if (event.persisted) {
        const savedLanguage = localStorage.getItem(LANGUAGE_KEY);
        if (savedLanguage !== language && (savedLanguage === "uk" || savedLanguage === "en")) {
            await changeLanguage(savedLanguage);
        }
    }
});

const languageReady = initLanguage();
