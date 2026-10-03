// Елементи сторінки
const scoreText = document.getElementById("score");
const nextButton = document.getElementById("nextButton");
const taskText = document.getElementById("task");
const optionsBlock = document.getElementById("options");
const resultText = document.getElementById("result");

// Кількість варіантів відповіді
const OPTIONS_COUNT = 4;

// Лічильники відповідей і правильна відповідь поточного завдання
let correctCount = 0;
let totalCount = 0;
let currentAnswer = 0;

// Повертає випадкове ціле число від min до max включно
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Випадково перемішує масив
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = randomInt(0, i);
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Генерує масив унікальних варіантів: правильна відповідь і близькі неправильні
function generateOptions(correct) {
    const options = [correct];

    while (options.length < OPTIONS_COUNT) {
        const candidate = correct + randomInt(-10, 10);
        if (candidate > 0 && !options.includes(candidate)) {
            options.push(candidate);
        }
    }

    return shuffle(options);
}

// Виводить загальний рахунок у відсотках
function updateScore() {
    const percent = totalCount === 0 ? 0 : Math.round((correctCount / totalCount) * 100);
    scoreText.textContent = `Загальний рахунок ${percent}% (${correctCount} правильних відповідей з ${totalCount})`;
}

// Блокує всі радіокнопки, щоб залишилась лише одна спроба
function disableOptions() {
    const radios = optionsBlock.querySelectorAll("input");
    radios.forEach(radio => {
        radio.disabled = true;
    });
}

// Обробляє вибір варіанта: перевіряє відповідь і оновлює рахунок
function checkChoice(event) {
    const chosen = +event.target.value;

    totalCount++;

    if (chosen === currentAnswer) {
        correctCount++;
        resultText.textContent = "Правильно!";
    } else {
        resultText.textContent = `Помилка, правильна відповідь «${currentAnswer}»`;
    }

    disableOptions();
    updateScore();
}

// Створює радіокнопку з підписом для одного варіанта
function createOption(value) {
    const label = document.createElement("label");
    const radio = document.createElement("input");

    radio.type = "radio";
    radio.name = "answer";
    radio.value = value;
    radio.addEventListener("change", checkChoice);

    label.append(radio, String(value));
    return label;
}

// Генерує нове випадкове завдання з варіантами відповіді
function generateTask() {
    const a = randomInt(2, 10);
    const b = randomInt(2, 10);
    currentAnswer = a * b;

    taskText.textContent = `${a} × ${b} =`;
    resultText.textContent = "";

    const options = generateOptions(currentAnswer);
    optionsBlock.replaceChildren(...options.map(createOption));
}

// Підключення обробника до кнопки
nextButton.addEventListener("click", generateTask);

// Початковий стан: рахунок і перше завдання
updateScore();
generateTask();