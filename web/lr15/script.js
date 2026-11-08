import { createClient } from "https://esm.sh/@supabase/supabase-js@2.119.0";

const supabaseUrl = "https://xhdxlrykpuhgqjmovgno.supabase.co";
const supabaseKey = "sb_publishable_BSR1ARUP0Qs8ZUSoEtdLiQ_EdqGaUhC";
const db = createClient(supabaseUrl, supabaseKey);

const status = document.getElementById("status");
const list = document.getElementById("projects-list");
const searchInput = document.getElementById("search");
const categoryFilter = document.getElementById("category-filter");
const sortSelect = document.getElementById("sort");
const projectForm = document.getElementById("project-form");
const projectIdInput = document.getElementById("project-id");
const nameInput = document.getElementById("name");
const categoryInput = document.getElementById("category");
const descriptionInput = document.getElementById("description");
const saveButton = document.getElementById("save-button");
const cancelButton = document.getElementById("cancel-button");
const formStatus = document.getElementById("form-status");
const authStatus = document.getElementById("auth-status");
const authForms = document.getElementById("auth-forms");
const userPanel = document.getElementById("user-panel");
const userInfo = document.getElementById("user-info");
const adminPanel = document.getElementById("admin-panel");
const registerForm = document.getElementById("register-form");
const loginForm = document.getElementById("login-form");
const logoutButton = document.getElementById("logout-button");
const categories = ["Фінанси", "Здоров’я", "Освіта", "Подорожі"];

let projects = null;
let isAdmin = false;
let isBusy = false;

// Блокує елементи керування на час запиту
function setBusy(value) {
    isBusy = value;
    document.querySelectorAll("input, select, textarea, button").forEach(element => {
        element.disabled = value;
    });
}

function resetProjectForm() {
    projectForm.reset();
    projectIdInput.value = "";
    saveButton.textContent = "Додати проєкт";
    cancelButton.hidden = true;
}

// Перевіряє сеанс і роль користувача через RPC
async function updateAuthState() {
    isAdmin = false;
    adminPanel.hidden = true;
    userPanel.hidden = true;
    authForms.hidden = false;
    userInfo.textContent = "";
    formStatus.textContent = "";
    resetProjectForm();

    try {
        const { data, error } = await db.auth.getUser();
        if (error && error.name !== "AuthSessionMissingError") {
            throw error;
        }

        if (!data.user) {
            authStatus.textContent = "Ви переглядаєте каталог як відвідувач.";
            return;
        }

        authForms.hidden = true;
        userPanel.hidden = false;
        userInfo.textContent = data.user.email;

        const { data: admin, error: roleError } = await db.rpc("check_admin");
        if (roleError) {
            throw roleError;
        }

        isAdmin = admin === true;
        adminPanel.hidden = !isAdmin;
        userInfo.textContent = `${data.user.email} — ${isAdmin ? "адміністратор" : "користувач"}`;
        authStatus.textContent = isAdmin
            ? "Вам доступні додавання, редагування та видалення проєктів."
            : "Вам доступний перегляд каталогу.";
    } catch (error) {
        console.error("Помилка перевірки сеансу або ролі:", error);
        authStatus.textContent = "Не вдалося перевірити сеанс або права доступу. Адміністративні дії недоступні.";
    } finally {
        await loadProjects();
    }
}

// Отримує проєкти з навчальної бази даних
async function loadProjects() {
    status.textContent = "Завантаження проєктів...";
    list.replaceChildren();
    projects = null;

    try {
        const { data, error } = await db
            .from("projects")
            .select("id, name, category, description, created_at")
            .order("id", { ascending: false });

        if (error) {
            throw error;
        }

        projects = data;
        renderProjects();
    } catch (error) {
        console.error("Помилка завантаження:", error);
        status.textContent = "Не вдалося завантажити проєкти. Перевірте з’єднання та оновіть сторінку.";
    }
}

function createActionButton(text, handler) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = text;
    button.disabled = isBusy;
    button.addEventListener("click", handler);
    return button;
}

// Створює елемент списку; адміністративні кнопки доступні лише адміністратору
function createProjectItem(project) {
    const item = document.createElement("li");
    item.textContent = `${project.name} — ${project.category}. ${project.description}`;

    if (isAdmin) {
        const actions = document.createElement("div");
        actions.className = "project-actions";
        actions.append(
            createActionButton("Редагувати", () => startEditing(project)),
            createActionButton("Видалити", () => deleteProject(project.id))
        );
        item.append(actions);
    }
    return item;
}

// Застосовує пошук, фільтрацію та сортування
function renderProjects() {
    if (projects === null) {
        return;
    }

    const search = searchInput.value.trim().toLocaleLowerCase("uk-UA");
    const category = categoryFilter.value;
    const visibleProjects = projects.filter(project => {
        const matchesName = project.name.toLocaleLowerCase("uk-UA").includes(search);
        const matchesCategory = category === "all" || project.category === category;
        return matchesName && matchesCategory;
    });

    visibleProjects.sort((a, b) => {
        if (sortSelect.value === "name-asc") {
            return a.name.localeCompare(b.name, "uk");
        }
        if (sortSelect.value === "name-desc") {
            return b.name.localeCompare(a.name, "uk");
        }
        const dateDifference = new Date(b.created_at) - new Date(a.created_at) || b.id - a.id;
        return sortSelect.value === "old" ? -dateDifference : dateDifference;
    });

    list.replaceChildren();
    visibleProjects.forEach(project => {
        list.append(createProjectItem(project));
    });

    if (projects.length === 0) {
        status.textContent = "У базі ще немає проєктів.";
    } else if (visibleProjects.length === 0) {
        status.textContent = "За вашим запитом проєктів не знайдено.";
    } else {
        status.textContent = `Знайдено проєктів: ${visibleProjects.length} із ${projects.length}`;
    }
}

registerForm.addEventListener("submit", async event => {
    event.preventDefault();
    if (isBusy) return;
    setBusy(true);
    authStatus.textContent = "Реєстрація...";

    try {
        const { data, error } = await db.auth.signUp({
            email: document.getElementById("register-email").value.trim(),
            password: document.getElementById("register-password").value
        });
        if (error) throw error;
        registerForm.reset();
        if (data.session) {
            await updateAuthState();
        } else {
            authStatus.textContent = "Перевірте електронну пошту для підтвердження реєстрації, а потім увійдіть.";
        }
    } catch (error) {
        console.error("Помилка реєстрації:", error);
        authStatus.textContent = "Не вдалося зареєструвати користувача. Перевірте дані та з’єднання.";
    } finally {
        setBusy(false);
    }
});

loginForm.addEventListener("submit", async event => {
    event.preventDefault();
    if (isBusy) return;
    setBusy(true);
    authStatus.textContent = "Виконується вхід...";

    try {
        const { error } = await db.auth.signInWithPassword({
            email: document.getElementById("login-email").value.trim(),
            password: document.getElementById("login-password").value
        });
        if (error) throw error;
        loginForm.reset();
        await updateAuthState();
    } catch (error) {
        console.error("Помилка входу:", error);
        authStatus.textContent = "Не вдалося увійти. Перевірте електронну адресу, пароль і з’єднання.";
    } finally {
        setBusy(false);
    }
});

logoutButton.addEventListener("click", async () => {
    if (isBusy) return;
    setBusy(true);
    try {
        const { error } = await db.auth.signOut();
        if (error) throw error;
        await updateAuthState();
    } catch (error) {
        console.error("Помилка виходу:", error);
        authStatus.textContent = "Не вдалося завершити сеанс. Спробуйте ще раз.";
    } finally {
        setBusy(false);
    }
});

function startEditing(project) {
    if (!isAdmin || isBusy) return;
    projectIdInput.value = project.id;
    nameInput.value = project.name;
    categoryInput.value = project.category;
    descriptionInput.value = project.description;
    saveButton.textContent = "Зберегти зміни";
    cancelButton.hidden = false;
    formStatus.textContent = `Редагування проєкту №${project.id}`;
}

cancelButton.addEventListener("click", () => {
    if (isBusy) return;
    resetProjectForm();
    formStatus.textContent = "";
});

// Створює новий проєкт або змінює лише вибраний запис за його ID
projectForm.addEventListener("submit", async event => {
    event.preventDefault();
    if (!isAdmin || isBusy) return;

    const id = projectIdInput.value;
    const name = nameInput.value.trim();
    const category = categoryInput.value;
    const description = descriptionInput.value.trim();
    if (!name || name.length > 150 || !description || description.length > 500) {
        formStatus.textContent = "Введіть назву до 150 символів та опис до 500 символів. Поля не можуть бути порожніми.";
        return;
    }
    if (!categories.includes(category)) {
        formStatus.textContent = "Оберіть категорію проєкту.";
        return;
    }

    setBusy(true);
    formStatus.textContent = "Збереження проєкту...";
    try {
        const query = id
            ? db.from("projects").update({ name, category, description }).eq("id", Number(id)).select("id")
            : db.from("projects").insert({ name, category, description }).select("id");
        const { data, error } = await query;
        if (error) throw error;
        if (data.length === 0) throw new Error("Запис не збережено або немає прав доступу");
        resetProjectForm();
        await loadProjects();
        formStatus.textContent = id ? "Зміни збережено." : "Проєкт додано.";
    } catch (error) {
        console.error("Помилка збереження:", error);
        formStatus.textContent = "Не вдалося зберегти проєкт. Перевірте з’єднання та права доступу.";
    } finally {
        setBusy(false);
    }
});

async function deleteProject(id) {
    if (!isAdmin || isBusy || !confirm("Видалити вибраний проєкт?")) return;
    setBusy(true);
    formStatus.textContent = "Видалення проєкту...";
    try {
        const { data, error } = await db.from("projects").delete().eq("id", id).select("id");
        if (error) throw error;
        if (data.length === 0) throw new Error("Запис не видалено або немає прав доступу");
        if (projectIdInput.value === String(id)) resetProjectForm();
        await loadProjects();
        formStatus.textContent = "Проєкт видалено.";
    } catch (error) {
        console.error("Помилка видалення:", error);
        formStatus.textContent = "Не вдалося видалити проєкт. Перевірте з’єднання та права доступу.";
    } finally {
        setBusy(false);
    }
}

searchInput.addEventListener("input", renderProjects);
categoryFilter.addEventListener("change", renderProjects);
sortSelect.addEventListener("change", renderProjects);

setBusy(true);
await updateAuthState();
setBusy(false);
