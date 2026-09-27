function* randomGenerator(min, max) {
    while (true) {
        yield Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

while (true) {
    const minInput = prompt("Введіть мінімальну межу: ", "1");

    if (minInput === null) {
        alert("Дію скасовано.");
        break;
    }

    const maxInput = prompt("Введіть максимальну межу: ", "100");

    if (maxInput === null) {
        alert("Дію скасовано.");
        break;
    }

    const minVal = +minInput;
    const maxVal = +maxInput;

    if (!isNaN(minVal) && !isNaN(maxVal) && minVal <= maxVal) {
        const generator = randomGenerator(minVal, maxVal);

        const button = document.getElementById("next");
        const outputDiv = document.getElementById("out");

        button.addEventListener("click", function () {
            const nextNumber = generator.next().value;
            outputDiv.textContent = `Випадкове число: ${nextNumber}`;
        });
        break;
    } else {
        alert("Будь ласка, введіть коректні числові значення (мінімальна межа має бути меншою або дорівнювати максимальній)!");
    }
}