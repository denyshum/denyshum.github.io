function Product(productId, name, price) {
    this.productId = productId;
    this.name = name;
    this.price = price;
}

function Purchase(purchaseId, productId, quantity) {
    this.purchaseId = purchaseId;
    this.productId = productId;
    this.quantity = quantity;
}

const products = [
    new Product(1, "Ноутбук", 45000),
    new Product(2, "Мишка", 1200),
    new Product(3, "Клавіатура", 2500)
];

const purchases = [
    new Purchase(1, 1, 2),
    new Purchase(2, 2, 5),
    new Purchase(3, 1, 1),
    new Purchase(4, 3, 3),
    new Purchase(5, 2, 2)
];

function getTotalSales(products, purchases) {
    return purchases.reduce((acc, purchase) => {
        const product = products.find(p => p.productId === purchase.productId);

        if (product) {
            const income = product.price * purchase.quantity;

            if (acc[product.name]) {
                acc[product.name] += income;
            } else {
                acc[product.name] = income;
            }
        }

        return acc;
    }, {});
}

console.log("Завдання 2:");
const salesReport = getTotalSales(products, purchases);
console.log(salesReport);