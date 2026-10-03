// Поля введення температури
const fahrenheitInput = document.getElementById("fahrenheit");
const celsiusInput = document.getElementById("celsius");

// Переводить градуси Фаренгейта в градуси Цельсія
function fahrenheitToCelsius(f) {
    return (5 / 9) * (f - 32);
}

// Переводить градуси Цельсія в градуси Фаренгейта
function celsiusToFahrenheit(c) {
    return (c * 9) / 5 + 32;
}

// Перевіряє, що текст у полі є числом
function isNumber(text) {
    return text.trim() !== "" && !isNaN(+text);
}

// Округлює число до двох знаків після коми
function roundToTwo(number) {
    return Math.round(number * 100) / 100;
}

// Обробник зміни поля Фаренгейта: оновлює поле Цельсія
function onFahrenheitInput() {
    const text = fahrenheitInput.value;

    if (!isNumber(text)) {
        celsiusInput.value = "";
        return;
    }

    celsiusInput.value = roundToTwo(fahrenheitToCelsius(+text));
}

// Обробник зміни поля Цельсія: оновлює поле Фаренгейта
function onCelsiusInput() {
    const text = celsiusInput.value;

    if (!isNumber(text)) {
        fahrenheitInput.value = "";
        return;
    }

    fahrenheitInput.value = roundToTwo(celsiusToFahrenheit(+text));
}

// Підключення обробників подій до полів
fahrenheitInput.addEventListener("input", onFahrenheitInput);
celsiusInput.addEventListener("input", onCelsiusInput);