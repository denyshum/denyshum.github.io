const TASKS_KEY = "todo-tasks";
const FILTER_KEY = "todo-filter";
const SORT_KEY = "todo-sort";

const input = document.getElementById("newTask");
const list = document.getElementById("list");
const filterButtons = document.querySelectorAll("#filters button");
const sortButtons = document.querySelectorAll("#sorting button");

let tasks = loadTasks();
let filter = localStorage.getItem(FILTER_KEY) || "all";
let sort = localStorage.getItem(SORT_KEY) || "new";

function loadTasks() {
    try {
        return JSON.parse(localStorage.getItem(TASKS_KEY)) || [];
    } catch (e) {
        return [];
    }
}

function save() {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    localStorage.setItem(FILTER_KEY, filter);
    localStorage.setItem(SORT_KEY, sort);
}

function formatDate(timestamp) {
    const d = new Date(timestamp);
    const p = n => String(n).padStart(2, "0");
    const year = String(d.getFullYear()).slice(-2);
    return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${year}, ${p(d.getHours())}:${p(d.getMinutes())}`
}

input.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") {
        return;
    }

    const text = input.value.trim();
    if (!text) {
        return;
    }

    tasks.unshift({ id: crypto.randomUUID(), text: text, done: false, date: Date.now()});
    input.value = "";
    save();
    render();
})

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        filter = button.dataset.filter;
        save();
        render();
    });
});

sortButtons.forEach(button => {
    button.addEventListener("click", () => {
        sort = button.dataset.sort;
        save();
        render();
    });
});

function isVisible(task) {
    if (filter === "done") {
        return task.done;
    }
    if (filter === "active") {
        return !task.done;
    }
    return true;
}

function render() {
    list.innerHTML = "";

    filterButtons.forEach(button => {
        button.classList.toggle("active", button.dataset.filter === filter);
    });

    sortButtons.forEach(button => {
        button.classList.toggle("active", button.dataset.sort === sort);
    });

    const visibleTasks = tasks.filter(isVisible);

    visibleTasks.sort((a, b) => {
        if (sort === "active") {
            return Number(a.done) - Number(b.done);
        }

        if (sort === "done") {
            return Number(b.done) - Number(a.done);
        }

        return b.date - a.date;
    });

    visibleTasks.forEach(task => {
        list.append(createItem(task));
    });
}

function createItem(task) {
    const li = document.createElement("li");
    if (task.done) {
        li.classList.add("done");
    }

    const check = document.createElement("input");
    check.type = "checkbox";
    check.checked = task.done;
    check.addEventListener("change", () => {
        task.done = check.checked;
        save();
        render();
    });

    const body = document.createElement("div");
    body.className = "body";
    const text = document.createElement("span");
    text.className = "text";
    text.textContent = task.text;
    const date = document.createElement("small");
    date.className = "date";
    date.textContent = formatDate(task.date);
    body.append(text, date);

    body.addEventListener("dblclick", () => {
        startEdit(task, text);
    });

    const del = document.createElement("button");
    del.type = "button";
    del.className = "del";
    del.textContent = "×";
    del.title = "Видалити";
    del.addEventListener("click", () => {
        tasks = tasks.filter((t) => {
            return t.id !== task.id;
        });
        save();
        render();
    });

    li.append(check, body, del);
    return li;
}

function startEdit(task, textEl) {
    const edit = document.createElement("input");
    edit.type = "text";
    edit.className = "edit";
    edit.value = task.text;
    textEl.replaceWith(edit);
    edit.focus();

    function finish(saveChanges) {
        const value = edit.value.trim();

        if (saveChanges && value) {
            task.text = value;
            save();
        }
        render();
    }

    edit.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            finish(true);
        }
        if (event.key === "Escape") {
            finish(false);
        }
    });

    edit.addEventListener("blur", () => {
        finish(false);
    });
}

render();