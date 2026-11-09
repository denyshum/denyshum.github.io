// Require packages and set the port
const express = require('express');
const path = require('path');
const port = 3002;
const bodyParser = require('body-parser');
const routes = require('./routes/routes');
const app = express();

// Use Node.js body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));

// CORS middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
});

routes(app);

// Сторінки каталогу та його ресурси
app.use('/catalog', express.static(path.join(__dirname, '../catalog')));
app.use('/images', express.static(path.join(__dirname, '../images')));
app.use('/locales', express.static(path.join(__dirname, '../locales')));
app.get('/style.css', (request, response) => {
    response.sendFile(path.join(__dirname, '../style.css'));
});
app.get('/express-api/books.html', (request, response) => {
    response.sendFile(path.join(__dirname, 'books.html'));
});
app.get('/express-api/index.html', (request, response) => {
    response.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
const server = app.listen(port, (error) => {
    if (error) return console.log(`Error: ${error}`);
    console.log(`Server listening on port ${server.address().port}`);
});
