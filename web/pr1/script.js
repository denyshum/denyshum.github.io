function Order(orderId, customerName, customerEmail, items, total) {
    this.orderId = orderId;
    this.customer = {
        name: customerName,
        email: customerEmail,
    };
    this.items = items;
    this.total = total;
}

const orders = [
    new Order(1, "Олександр", "oleksandr@gmail.com", ["Ноутбук", "Мишка"], 48450),
    new Order(2, "Марія", "maria@gmail.com", ["Клавіатура"], 1900),
    new Order(3, "Денис", "denys@gmail.com", ["Монітор", "Кабель HDMI"], 10000),
    new Order(4, "Іван", "ivan@gmail.com", ["Навушники"], 4510),
    new Order(5, "Олена", "olena@gmail.com", ["Смартфон", "Чохол"], 85000),
    new Order(6, "Олександр", "oleksandr@gmail.com", ["Флешка"], 800),
    new Order(7, "Марія", "maria@gmail.com", ["Вебкамера", "Мікрофон"], 9000),
    new Order(8, "Денис", "denys@gmail.com", ["Кронштейн для монітора"], 1500),
    new Order(9, "Олена", "olena@gmail.com", ["Павербанк"], 2800)
];

function getTotalSpentByCustomer(orders, customerName) {
    return orders.filter(order => order.customer.name === customerName).reduce((sum, order) => sum + order.total, 0);
}

console.log("Завдання 1:");
const oleksandrSpent = getTotalSpentByCustomer(orders, "Олександр");
console.log(`Олександр витратив загалом: ${oleksandrSpent} грн.`);

const mariaSpent = getTotalSpentByCustomer(orders, "Марія");
console.log(`Марія витратила загалом: ${mariaSpent} грн.`);

const ivanSpent = getTotalSpentByCustomer(orders, "Іван");
console.log(`Іван витратив загалом: ${ivanSpent} грн.`);
console.log("");