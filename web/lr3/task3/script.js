function* chatBot() {
    const name = yield "Hi! What is your name?";

    yield `Nice to meet you, ${name}! How are you?`;

    return "Goodbye!";
}

const bot = chatBot();
let currentStep = bot.next();
let stepNumber = 1;

while (!currentStep.done) {
    const answer = prompt(currentStep.value);

    if (answer === null) {
        alert("Розмову перервано");
        break;
    }

    const cleanInput = answer.trim();
    
    if (cleanInput === "") {
        alert("Ви нічого не ввели! Спробуйте ще раз.");
        continue;
    }
    
    if (stepNumber === 1) {
        const isValidLetters = /^[а-яА-ЯєЄіІїЇґҐa-zA-Z\s'-]+$/.test(cleanInput);
        if (!isValidLetters) {
            alert("Помилка! Ім'я не може містити цифри або спецсимволи.");
            continue;
        }
    }

    currentStep = bot.next(cleanInput);
    stepNumber++;
}

if (currentStep.done && currentStep.value) {
    alert(currentStep.value);
}