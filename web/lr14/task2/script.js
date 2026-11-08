// Завантажує ресурси та налаштовує бібліотеку i18next
async function loadLanguage(selectedLanguage) {
    if (!i18next.isInitialized) {
        const [ukResponse, enResponse] = await Promise.all([
            fetch("../locales/uk.json"),
            fetch("../locales/en.json")
        ]);
        const resources = {
            uk: { translation: await ukResponse.json() },
            en: { translation: await enResponse.json() }
        };

        await i18next.init({
            lng: selectedLanguage,
            fallbackLng: "uk",
            resources
        });
    } else {
        await i18next.changeLanguage(selectedLanguage);
    }
}

const LANGUAGE_KEY = "lr14-language";
const languageSelector = document.getElementById("language-selector");
const languageModal = document.getElementById("language-modal");
let language;

// Оновлює статичні тексти та повідомляє каталог або корзину про зміну мови
function updateLanguage() {
    document.documentElement.lang = language;
    languageSelector.value = language;

    document.querySelectorAll("[data-i18n]").forEach(element => {
        element.textContent = i18next.t(element.dataset.i18n);
    });
    document.querySelectorAll("[data-i18n-title]").forEach(element => {
        element.title = i18next.t(element.dataset.i18nTitle);
    });
    document.querySelectorAll("[data-i18n-alt]").forEach(element => {
        element.alt = i18next.t(element.dataset.i18nAlt);
    });

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
