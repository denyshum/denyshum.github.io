const myName = "Денис";
const ul = document.getElementById("name-list");

for (const letter of myName) {
    const li = document.createElement("li");
    li.textContent = letter;
    li.addEventListener("mouseenter", () => {
        alert(`Ви навели на літеру: ${letter}`);
    })

    ul.append(li);
}