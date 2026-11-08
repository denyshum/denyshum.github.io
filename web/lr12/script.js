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
const nameInput = document.getElementById("name");
const categoryInput = document.getElementById("category");
const descriptionInput = document.getElementById("description");
const submitButton = projectForm.querySelector('button[type="submit"]');
const formStatus = document.getElementById("form-status");
const categories = ["Фінанси", "Здоров’я", "Освіта", "Подорожі"];

let projects = null;

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

// Створює елемент списку проєктів
function createProjectItem(project) {
    const item = document.createElement("li");
    item.textContent = `${project.name} — ${project.category}. ${project.description}`;
    return item;
}

// Застосовує пошук, фільтрацію та сортування до отриманих записів
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

// Додає проєкт і повторно завантажує список без перезавантаження сторінки
async function addProject(event) {
    event.preventDefault();
    if (submitButton.disabled) {
        return;
    }

    const name = nameInput.value.trim();
    const category = categoryInput.value;
    const description = descriptionInput.value.trim();

    if (name.length === 0 || name.length > 150 || description.length === 0 || description.length > 500) {
        formStatus.textContent = "Введіть назву до 150 символів та опис до 500 символів. Поля не можуть бути порожніми.";
        return;
    }
    if (!categories.includes(category)) {
        formStatus.textContent = "Оберіть категорію проєкту.";
        return;
    }

    submitButton.disabled = true;
    formStatus.textContent = "Додавання проєкту...";

    try {
        const { error } = await db
            .from("projects")
            .insert({ name, category, description });

        if (error) {
            throw error;
        }

        projectForm.reset();
        formStatus.textContent = "Проєкт успішно додано.";
        await loadProjects();
    } catch (error) {
        console.error("Помилка додавання:", error);
        formStatus.textContent = "Не вдалося додати проєкт. Перевірте з’єднання та спробуйте ще раз.";
    } finally {
        submitButton.disabled = false;
    }
}

searchInput.addEventListener("input", renderProjects);
categoryFilter.addEventListener("change", renderProjects);
sortSelect.addEventListener("change", renderProjects);
projectForm.addEventListener("submit", addProject);

loadProjects();
