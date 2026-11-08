const users = [
    {
        id: 1,
        name: "Humeniuk Denys",
        email: "humeniuk.denys@gmail.com",
    },
    {
        id: 2,
        name: "Haliuk Ivan",
        email: "haliuk.ivan@gmail.com",
    },
];

const router = app => {
    app.get('/', (request, response) => {
        response.send({
            message: 'Node.js and Express REST API'
        });
    });

    app.get('/users', (request, response) => {
        response.send(users);
    });
};

// Export the router
module.exports = router;
