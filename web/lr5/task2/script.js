// Елементи сторінки
const scoreText = document.getElementById("score");
const nextButton = document.getElementById("nextButton");
const taskText = document.getElementById("task");
const answerInput = document.getElementById("answer");
const checkButton = document.getElementById("checkButton");
const resultText = document.getElementById("result");

// Лічильники відповідей і правильна відповідь поточного завдання
let correctCount = 0;
let totalCount = 0;
let currentAnswer = 0;

// Повертає випадкове ціле число від min до max включно
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Перевіряє, що введений текст є числом
function isNumberText(text) {
    return text.trim() !== "" && !isNaN(+text);
}

// Виводить загальний рахунок у відсотках
function updateScore() {
    const percent = totalCount === 0 ? 0 : Math.round((correctCount / totalCount) * 100);
    scoreText.textContent = `Загальний рахунок ${percent}% (${correctCount} правильних відповідей з ${totalCount})`;
}

// Генерує нове випадкове завдання і готує поля до відповіді
function generateTask() {
    const a = randomInt(2, 10);
    const b = randomInt(2, 10);
    currentAnswer = a * b;

    taskText.textContent = `${a} × ${b} =`;
    answerInput.value = "";
    answerInput.disabled = false;
    checkButton.disabled = false;
    resultText.textContent = "";
    answerInput.focus();
}

// Перевіряє відповідь користувача, на одне завдання дається одна спроба
function checkAnswer() {
    const text = answerInput.value;

    if (!isNumberText(text)) {
        resultText.textContent = "Введіть число";
        return;
    }

    totalCount++;

    if (+text === currentAnswer) {
        correctCount++;
        resultText.textContent = "Правильно!";
    } else {
        resultText.textContent = `Помилка, правильна відповідь «${currentAnswer}»`;
    }

    answerInput.disabled = true;
    checkButton.disabled = true;
    updateScore();
}

// Підключення обробників подій до кнопок
nextButton.addEventListener("click", generateTask);
checkButton.addEventListener("click", checkAnswer);

// Початковий стан: рахунок і перше завдання
updateScore();
generateTask();