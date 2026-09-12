const ul = document.getElementById("students-list");

function askStudent() {
    const userInput = prompt("Введіть прізвище та ім'я (або 'Відміна' для завершення):");

    if (userInput === null) {
        return;
    }

    if (userInput.trim() !== "") {
        const li = document.createElement("li");
        li.textContent = userInput;
        ul.append(li);
    }

    setTimeout(askStudent, 10);
}

askStudent();