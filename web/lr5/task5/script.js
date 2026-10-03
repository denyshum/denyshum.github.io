// Елементи капчі
const captchaDisplay = document.getElementById("captchaDisplay");
const captchaInput = document.getElementById("captchaInput");
const captchaMessage = document.getElementById("captchaMessage");

// Піксельні шаблони цифр 0-9 (3 колонки, 5 рядків): 1 - зафарбований піксель
const DIGIT_PATTERNS = [
    ["111", "101", "101", "101", "111"],
    ["010", "110", "010", "010", "111"],
    ["111", "001", "111", "100", "111"],
    ["111", "001", "111", "001", "111"],
    ["101", "101", "111", "001", "001"],
    ["111", "100", "111", "001", "111"],
    ["111", "100", "111", "101", "111"],
    ["111", "001", "001", "001", "001"],
    ["111", "101", "111", "101", "111"],
    ["111", "101", "111", "001", "111"]
];

// Число, яке зараз показано в капчі (рядок цифр)
let captchaNumber = "";

// Повертає випадкове ціле число від min до max включно
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Генерує випадкове число із заданою кількістю цифр (перша цифра не нуль)
function generateNumber(digitsCount) {
    let result = String(randomInt(1, 9));

    for (let i = 1; i < digitsCount; i++) {
        result += randomInt(0, 9);
    }

    return result;
}

// Створює блок однієї цифри з span-пікселів
function createDigit(digit) {
    const digitBlock = document.createElement("div");
    digitBlock.className = "captcha-digit";

    DIGIT_PATTERNS[digit].forEach(row => {
        for (const cell of row) {
            const pixel = document.createElement("span");
            pixel.className = "captcha-pixel";

            if (cell === "1") {
                pixel.classList.add("captcha-pixel-on");
            }

            digitBlock.append(pixel);
        }
    });

    return digitBlock;
}

// Малює число у вигляді набору пікселів
function showNumber(number) {
    const digitBlocks = [...number].map(char => createDigit(+char));
    captchaDisplay.replaceChildren(...digitBlocks);
}

// Виводить повідомлення з потрібним кольором
function showMessage(text, className) {
    captchaMessage.textContent = text;
    captchaMessage.className = className;
}

// Перевіряє введене число і показує результат
function checkCaptcha() {
    const text = captchaInput.value.trim();

    if (text === captchaNumber) {
        showMessage("Правильно!", "captcha-ok");
    } else if (text.length >= captchaNumber.length) {
        showMessage("Помилка", "captcha-error");
    } else {
        showMessage("", "");
    }
}

// Ініціалізує капчу з вказаною кількістю цифр
function initCaptcha(digitsCount) {
    if (!Number.isInteger(digitsCount) || digitsCount < 1) {
        return;
    }

    captchaNumber = generateNumber(digitsCount);
    captchaInput.maxLength = digitsCount;
    captchaInput.value = "";
    showMessage("", "");
    showNumber(captchaNumber);
}

// Перевірка при кожній зміні тексту в полі
captchaInput.addEventListener("input", checkCaptcha);

initCaptcha(4);