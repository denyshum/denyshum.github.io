function greetAndSum() {
    let userName, num1, num2;
    let namePattern = /^[a-zA-Zа-яА-ЯіІїЇєЄґҐ\s'-]+$/;
    
    while (true) {
        let input = prompt("Введіть ваше ім'я:");
        if (input === null) {
            alert("Операцію скасовано користувачем.");
            return;
        }
        if (input.trim() === "") {
            alert("Ім'я не може бути порожнім. Спробуйте ще раз.");
            continue;
        }
        if (!namePattern.test(input.trim())) {
            alert("Помилка! Ім'я має містити лише літери. Спробуйте ще раз.");
            continue;
        }
        userName = input.trim();
        break;
    }

    while (true) {
        let input = prompt("Введіть перше число:");
        if (input === null) {
            alert("Операцію скасовано користувачем.");
            return;
        }
        if (input.trim() === "" || Number.isNaN(+input)) {
            alert("Помилка! Потрібно ввести саме число. Спробуйте ще раз.");
            continue;
        }
        num1 = +input;
        break;
    }

    while (true) {
        let input = prompt("Введіть друге число:");
        if (input === null) {
            alert("Операцію скасовано користувачем.");
            return;
        }
        if (input.trim() === "" || Number.isNaN(+input)) {
            alert("Помилка! Потрібно ввести саме число. Спробуйте ще раз.");
            continue;
        }
        num2 = +input;
        break;
    }

    let sum = num1 + num2;
    let message = "Hello, " + userName + "! The sum of " + num1 + " and " + num2 + " is " + sum + ".";

    console.log(message);
}

greetAndSum();