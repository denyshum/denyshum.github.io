// Перевіряє дані книги: повертає true, якщо всі значення коректні
function isValidBook(title, author, year, isRead) {
    if (typeof title !== "string" || title.trim() === "") {
        return false;
    }
    if (typeof author !== "string" || author.trim() === "") {
        return false;
    }
    if (!Number.isInteger(year) || year <= 0 || year > new Date().getFullYear()) {
        return false;
    }
    return typeof isRead === "boolean";
}

// Конструктор книги: перевіряє дані; якщо вони некоректні, об'єкт лишається порожнім
function Book(title, author, year, isRead) {
    if (!isValidBook(title, author, year, isRead)) {
        console.log("Некоректні дані книги, об'єкт не заповнено");
        return;
    }

    this.title = title.trim();
    this.author = author.trim();
    this.year = year;
    this.isRead = isRead;

    // Виводить інформацію про книгу в консоль
    this.bookInfo = function () {
        console.log(
            `Назва: ${this.title}, Автор: ${this.author}, Рік видання: ${this.year}, Прочитана: ${this.isRead ? "Так" : "Ні"}`
        );
    };

    // Позначає книгу як прочитану; повертає true, якщо статус змінився
    this.markAsRead = function () {
        if (this.isRead) {
            console.log(`Книга "${this.title}" уже позначена як прочитана`);
            return false;
        }
        this.isRead = true;
        return true;
    };
}

// Окремий об'єкт книги та зміна його статусу
let book = new Book("Harry Potter and the Sorcerer's Stone", "J.K. Rowling", 1997, true);
book.bookInfo();
book.isRead = !book.isRead;
book.bookInfo();

// Масив книг
let library = [
    new Book("Harry Potter and the Sorcerer's Stone", "J.K. Rowling", 1997, true),
    new Book("The Hobbit", "J.R.R. Tolkien", 1937, false),
    new Book("1984", "George Orwell", 1949, true)
];

// Виводить інформацію про всі книги з масиву library
function displayLibrary() {
    library.forEach(b => b.bookInfo());
}

displayLibrary();

// Додавання нової книги в кінець масиву
library.push(new Book("The Great Gatsby", "F. Scott Fitzgerald", 1925, false));
displayLibrary();

// Сортування книг за роком видання (за зростанням)
library.sort((a, b) => a.year - b.year);
console.log("Відсортовані книги за роком видання:", library);

// Масив лише непрочитаних книг
let unreadBooks = library.filter(b => !b.isRead);
console.log("Непрочитані книги:", unreadBooks);

// Пошук книги за автором
let tolkienBook = library.find(b => b.author === "J.R.R. Tolkien");
console.log("Книга Толкіна:", tolkienBook);

// Позначення знайденої книги як прочитаної (якщо вона знайдена)
if (tolkienBook) {
    tolkienBook.markAsRead();
    tolkienBook.bookInfo();
    tolkienBook.markAsRead();
} else {
    console.log("Книгу Толкіна не знайдено");
}

// Обчислює середній рік видання всіх книг у library
function calculateAverageYear() {
    if (library.length === 0) {
        console.log("Бібліотека порожня, середній рік обчислити неможливо");
        return null;
    }

    const sum = library.reduce((total, b) => total + b.year, 0);
    return sum / library.length;
}

const avg = calculateAverageYear();
if (avg !== null) {
    console.log("Середній рік видання:", avg);
    console.log("Середній рік (округлено):", Math.round(avg));
}

// Запитує дані нової книги в користувача і додає її в library, якщо дані коректні
function addBookToLibrary() {
    let title = prompt("Введіть назву книги:");
    let author = prompt("Введіть автора книги:");
    let year = +prompt("Введіть рік видання книги:");
    let isRead = confirm("Чи прочитана книга?");

    if (isValidBook(title, author, year, isRead)) {
        library.push(new Book(title, author, year, isRead));
        displayLibrary();
    } else {
        console.log("Книгу не додано");
    }
}

addBookToLibrary();