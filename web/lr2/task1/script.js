function calculate() {
    let result = 10;
    console.log(`До блоку if: result = ${result}`);

    if (true) {
        let result = 999;
        console.log(`Всередині блоку if: result = ${result}`);
    }

    console.log(`Після блоку if: result = ${result}`);
}

calculate();