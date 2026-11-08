const header = document.querySelector("header");
const section = document.querySelector("section");
const requestURL = "https://semegenkep.github.io/json/example.json";
const request = new XMLHttpRequest();

// Заповнює заголовок сторінки даними команди
function populateHeader(superHeroes) {
    const title = document.createElement("h1");
    title.textContent = superHeroes.squadName;

    const info = document.createElement("p");
    info.textContent = `Hometown: ${superHeroes.homeTown} // Formed: ${superHeroes.formed}`;

    header.append(title, info);
}

// Створює картку кожного героя та список його суперздібностей
function showHeroes(superHeroes) {
    superHeroes.members.forEach(hero => {
        const article = document.createElement("article");
        const name = document.createElement("h2");
        const identity = document.createElement("p");
        const age = document.createElement("p");
        const powersTitle = document.createElement("p");
        const powersList = document.createElement("ul");

        name.textContent = hero.name;
        identity.textContent = `Secret identity: ${hero.secretIdentity}`;
        age.textContent = `Age: ${hero.age}`;
        powersTitle.textContent = "Superpowers:";

        hero.powers.forEach(power => {
            const item = document.createElement("li");
            item.textContent = power;
            powersList.append(item);
        });

        article.append(name, identity, age, powersTitle, powersList);
        section.append(article);
    });
}

request.open("GET", requestURL);
request.responseType = "json";

request.onload = function () {
    const superHeroes = request.response;
    console.log(superHeroes);
    populateHeader(superHeroes);
    showHeroes(superHeroes);
};

request.send();
