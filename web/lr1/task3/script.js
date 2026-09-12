const mySurname = "Гуменюк";
const btn = document.getElementById("toggle-btn");
const container = document.getElementById("letters");

btn.addEventListener("click", () => {
    if (container.children.length > 0) {
        container.innerHTML = "";
        btn.textContent = "Показати блоки";
    } else {
        for (const letter of mySurname) {
            const div = document.createElement("div");
            div.textContent = letter;
            div.classList.add("letter-block");
            div.addEventListener("mouseenter", () => {
                alert(`Це літера [ ${letter} ]`);
            });
            
            container.append(div);
        }
        
        btn.textContent = "Очистити контейнер";
    }
})