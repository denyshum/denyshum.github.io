let validName = "Guest";

while (true) {
    const inputName = prompt("Введіть ваше ім'я:");

    if (inputName === null) {
        alert("Дію скасовано. Буде використано ім'я 'Guest'.");
        break;
    }

    const cleanInput = inputName.trim();

    if (cleanInput === "") {
        alert("Ви нічого не ввели! Спробуйте ще раз.");
        continue;
    }

    const isValidLetters = /^[а-яА-ЯєЄіІїЇґҐa-zA-Z\s'-]+$/.test(cleanInput);
    if (!isValidLetters) {
        alert("Помилка! Ім'я не може містити цифри або спецсимволи.");
        continue;
    }

    validName = cleanInput;
    break;
}

const user = {
    name: validName,
    say() {
        alert(`Hello, ${this.name}`);
    }
}

const button = document.getElementById("hello");

// При простому присвоєнні функції (наприклад, button.addEventListener("click", user.say))
// контекст this втрачається
// Це стається тому, що addEventListener() бере посилання на функцію і викликає її
// від імені самого DOM-елемента (кнопки), на якому відбувся клік
// Оскільки у кнопки немає властивості name, this.name поверне undefined або порожнечу
//
// Щоб метод завжди бачив правильний this, ми використовуємо метод .bind(user)
// Він створює нову функцію, всередині якої this назавжди жорстко прив'язаний до об'єкта user

button.addEventListener("click", user.say.bind(user));