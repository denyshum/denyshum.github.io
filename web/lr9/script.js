const loader = document.getElementById("loader");
const result = document.getElementById("result");
const buttons = document.querySelectorAll("button");

function showLoader() {
    result.textContent = "";
    loader.style.display = "block";
    buttons.forEach(button => {
        button.disabled = true;
    });
}

function hideLoader() {
    loader.style.display = "none";
    buttons.forEach(button => {
        button.disabled = false;
    });
}

function compareNumbers(num1, num2) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (num1 > num2) {
                resolve("Перше число більше");
            } else if (num1 < num2) {
                resolve("Друге число більше");
            } else {
                reject("Числа рівні");
            }
        }, 1000);
    });
}

document.getElementById("compareBtn").addEventListener("click", () => {
    const num1 = parseFloat(document.getElementById("num1").value);
    const num2 = parseFloat(document.getElementById("num2").value);

    if (isNaN(num1) || isNaN(num2)) {
        result.textContent = "Введіть обидва числа";
        return;
    }

    showLoader();
    compareNumbers(num1, num2)
        .then((message) => {
            result.textContent = message;
        })
        .catch((error) => {
            result.textContent = `Помилка: ${error}`;
        })
        .finally(hideLoader);
});

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function delayedRandom(seconds) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(randomInt(1, 10));
        }, seconds * 1000);
    });
}

document.getElementById("allBtn").addEventListener("click", () => {
    const promises = [delayedRandom(1), delayedRandom(2), delayedRandom(3)];

    showLoader();
    Promise.all(promises)
        .then((values) => {
            const sum = values.reduce((total, n) => {
                return total + n;
            }, 0);
            result.textContent = `Сума всіх значень: ${values.join(" + ")} = ${sum}`;
        })
        .catch((error) => {
            result.textContent = `Помилка: ${error}`;
        })
        .finally(hideLoader);
});