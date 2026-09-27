function* passwordGenerator() {
    let password = "";

    while (true) {
        const char = yield;

        if (char === "done") {
            return password;
        }

        if (char) {
            password += char;
        }
    }
}

const generator = passwordGenerator();

generator.next();

while (true) {
    const input = prompt("Введіть один символ для пароля (або напишіть 'done' для завершення):");

    if (input === null) {
        alert("Генерацію пароля скасовано");
        break;
    }

    if (input !== 'done' && input.length > 1) {
        alert("Будь ласка, вводьте лише по одному символу!");
        continue;
    }

    const result = generator.next(input);

    if (result.done) {
        alert(`Ваш згенерований пароль: ${result.value}`);
        break;
    }
}