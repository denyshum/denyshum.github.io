// Масив зображень
let imagesArray = [
    {
        path: 'images/001.jpg',
        title: 'Лабрадор-ретривер',
        description: 'Дружелюбна порода, яку часто навчають як собаку-поводиря'
    },
    {
        path: 'images/002.jpg',
        title: 'Німецька вівчарка',
        description: 'Розумна та витривала службова порода'
    },
    {
        path: 'images/003.jpg',
        title: 'Сибірський хаскі',
        description: 'Енергійна їздова собака з виразними блакитними очима'
    },
    {
        path: 'images/004.jpg',
        title: 'Золотистий ретривер',
        description: 'Лагідна та слухняна порода з густою золотистою шерстю'
    },
    {
        path: 'images/005.jpg',
        title: 'Французький бульдог',
        description: 'Компактна порода з великими вухами-кажанами'
    },
    {
        path: 'images/006.jpg',
        title: 'Пудель',
        description: 'Кучерява та дуже кмітлива порода'
    },
    {
        path: 'images/007.jpg',
        title: 'Бігль',
        description: 'Невелика мисливська собака з чудовим нюхом'
    },
    {
        path: 'images/008.jpg',
        title: 'Далматин',
        description: 'Білий собака з характерними чорними плямами'
    },
    {
        path: 'images/009.jpg',
        title: 'Ротвейлер',
        description: 'Сильна та віддана порода, що потребує досвідченого власника'
    },
    {
        path: 'images/010.jpg',
        title: 'Вельш-коргі',
        description: 'Низькоросла пастуша собака з веселим характером'
    }
];

// Створює елемент із заданим тегом і класом
function createElementWithClass(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

// Створює ротатор фотографій у блоці з вказаним ідентифікатором
function initPhotoRotator(containerId, images) {
    const container = document.getElementById(containerId);

    if (!container || images.length === 0) {
        return;
    }

    let currentIndex = 0;

    // Створення елементів ротатора
    const box = createElementWithClass("div", "rotator-box");
    const prevLink = createElementWithClass("a", "rotator-link");
    const nextLink = createElementWithClass("a", "rotator-link");
    const main = createElementWithClass("div", "rotator-main");
    const counter = createElementWithClass("div", "rotator-counter");
    const imageBox = createElementWithClass("div", "rotator-image-box");
    const image = document.createElement("img");
    const caption = createElementWithClass("div", "rotator-caption");
    const title = createElementWithClass("div", "rotator-title");
    const description = createElementWithClass("div", "rotator-description");

    prevLink.href = "#";
    prevLink.textContent = "Назад";
    nextLink.href = "#";
    nextLink.textContent = "Вперед";

    // Показує поточне зображення, підпис і потрібні посилання
    function showImage() {
        const current = images[currentIndex];

        counter.textContent = `Фотографія ${currentIndex + 1} з ${images.length}`;
        image.src = current.path;
        image.alt = current.title;
        title.textContent = current.title;
        description.textContent = current.description;

        // Посилання ховаємо через visibility, щоб розмітка не зсувалась
        prevLink.classList.toggle("rotator-link-hidden", currentIndex === 0);
        nextLink.classList.toggle("rotator-link-hidden", currentIndex === images.length - 1);
    }

    // Перехід до попереднього зображення
    function showPrev(event) {
        event.preventDefault();
        if (currentIndex > 0) {
            currentIndex--;
            showImage();
        }
    }

    // Перехід до наступного зображення
    function showNext(event) {
        event.preventDefault();
        if (currentIndex < images.length - 1) {
            currentIndex++;
            showImage();
        }
    }

    prevLink.addEventListener("click", showPrev);
    nextLink.addEventListener("click", showNext);

    // Збирання елементів у єдину структуру
    imageBox.append(image);
    caption.append(title, description);
    main.append(counter, imageBox, caption);
    box.append(prevLink, main, nextLink);
    container.append(box);

    showImage();
}

initPhotoRotator('rotator', imagesArray);