const secretNumber = 3 % 10;
let isValid = false;
let userNumber;

while (!isValid) {
    const userInput = prompt("Введіть число від 0 до 9");

    if (userInput === null || userInput.trim() === "") {
        alert("Ввід скасовано або нічого не введено.");
        break;
    } else {
        userNumber = +userInput;

        if (Number.isNaN(userNumber) || userNumber < 0 || userNumber > 9) {
            alert("Помилка! Будь ласка, введіть саме число від 0 до 9.");
        } else {
            isValid = true;
        }
    }
    
}

if (isValid) {
    if (userNumber === secretNumber) {
        alert("Correct!");
    } else {
        alert("Wrong!");
    }
}