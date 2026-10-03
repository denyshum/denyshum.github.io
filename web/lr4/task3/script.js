// Перевіряє дані картини: повертає true, якщо всі значення коректні
function isValidPainting(title, artist, year, style, isExhibited) {
    if (typeof title !== "string" || title.trim() === "") {
        return false;
    }
    if (typeof artist !== "string" || artist.trim() === "") {
        return false;
    }
    if (!Number.isInteger(year) || year <= 0 || year > new Date().getFullYear()) {
        return false;
    }
    if (typeof style !== "string" || style.trim() === "") {
        return false;
    }
    return typeof isExhibited === "boolean";
}

// Конструктор картини: перевіряє дані; якщо вони некоректні, об'єкт лишається порожнім
function Painting(title, artist, year, style, isExhibited) {
    if (!isValidPainting(title, artist, year, style, isExhibited)) {
        console.log("Некоректні дані картини, об'єкт не заповнено");
        return;
    }

    this.title = title.trim();
    this.artist = artist.trim();
    this.year = year;
    this.style = style.trim();
    this.isExhibited = isExhibited;

    // Виводить інформацію про картину в консоль
    this.paintingInfo = function () {
        console.log(
            `Назва: ${this.title}, Художник: ${this.artist}, Рік створення: ${this.year}, Стиль: ${this.style}, Виставлена в музеї: ${this.isExhibited ? "Так" : "Ні"}`
        );
    };

    // Позначає картину як виставлену в музеї; повертає true, якщо статус змінився
    this.markAsExhibited = function () {
        if (this.isExhibited) {
            console.log(`Картина "${this.title}" уже виставлена в музеї`);
            return false;
        }
        this.isExhibited = true;
        return true;
    };
}

// Окремий об'єкт картини та зміна її статусу
let painting = new Painting("Mona Lisa", "Leonardo da Vinci", 1503, "Renaissance", true);
painting.paintingInfo();
painting.isExhibited = !painting.isExhibited;
painting.paintingInfo();

// Масив картин
let collection = [
    new Painting("Mona Lisa", "Leonardo da Vinci", 1503, "Renaissance", true),
    new Painting("The Starry Night", "Vincent van Gogh", 1889, "Post-Impressionism", true),
    new Painting("The Scream", "Edvard Munch", 1893, "Expressionism", false)
];

// Виводить інформацію про всі картини з масиву collection
function displayCollection() {
    collection.forEach(p => p.paintingInfo());
}

displayCollection();

// Додавання нової картини в кінець масиву
collection.push(new Painting("Guernica", "Pablo Picasso", 1937, "Cubism", false));
displayCollection();

// Сортування картин за роком створення (за зростанням)
collection.sort((a, b) => a.year - b.year);
console.log("Відсортовані картини за роком створення:", collection);

// Масив картин, які не виставлені в музеї
let notExhibited = collection.filter(p => !p.isExhibited);
console.log("Картини, не виставлені в музеї:", notExhibited);

// Пошук картини за художником
let vanGoghPainting = collection.find(p => p.artist === "Vincent van Gogh");
console.log("Картина Ван Гога:", vanGoghPainting);

// Позначення знайденої картини як виставленої (якщо вона знайдена)
let munchPainting = collection.find(p => p.artist === "Edvard Munch");
if (munchPainting) {
    munchPainting.markAsExhibited();
    munchPainting.paintingInfo();
    munchPainting.markAsExhibited();
} else {
    console.log("Картину Мунка не знайдено");
}

// Обчислює середній рік створення всіх картин у collection
function calculateAverageYear() {
    if (collection.length === 0) {
        console.log("Колекція порожня, середній рік обчислити неможливо");
        return null;
    }

    const sum = collection.reduce((total, p) => total + p.year, 0);
    return sum / collection.length;
}

const avg = calculateAverageYear();
if (avg !== null) {
    console.log("Середній рік створення:", avg);
    console.log("Середній рік (округлено):", Math.round(avg));
}

// Запитує дані нової картини в користувача і додає її в collection, якщо дані коректні
function addPaintingToCollection() {
    let title = prompt("Введіть назву картини:");
    let artist = prompt("Введіть художника:");
    let year = +prompt("Введіть рік створення:");
    let style = prompt("Введіть стиль:");
    let isExhibited = confirm("Чи виставлена картина в музеї?");

    if (isValidPainting(title, artist, year, style, isExhibited)) {
        collection.push(new Painting(title, artist, year, style, isExhibited));
        displayCollection();
    } else {
        console.log("Картину не додано");
    }
}

addPaintingToCollection();