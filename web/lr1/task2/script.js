const ul = document.getElementById("students-list");

function askStudent() {
    const userInput = prompt("Введіть прізвище та ім'я (або 'Відміна' для завершення):");

    if (userInput === null) {
        return;
    }

    const cleanInput = userInput.trim();

    if (cleanInput === "") {
        alert("Ви нічого не ввели! Спробуйте ще раз.");
        setTimeout(askStudent, 10);
        return;
    }

    const words = cleanInput.split(/\s+/);
    if (words.length < 2) {
        alert("Будь ласка, введіть прізвище та ім'я (мінімум два слова)!");
        setTimeout(askStudent, 10);
        return;
    }

    const isValidLetters = /^[а-яА-ЯєЄіІїЇґҐa-zA-Z\s'-]+$/.test(cleanInput);
    if (!isValidLetters) {
        alert("Помилка! Прізвище та ім'я не можуть містити цифри або спецсимволи.");
        setTimeout(askStudent, 10);
        return;
    }

    const li = document.createElement("li");
    li.textContent = userInput;
    ul.append(li);

    setTimeout(askStudent, 10);
}

setTimeout(askStudent, 100);