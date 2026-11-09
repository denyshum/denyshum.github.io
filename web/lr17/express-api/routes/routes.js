// Load the MySQL pool connection
const pool = require('../data/config');

const router = app => {
    app.get('/', (request, response) => {
        response.send({
            message: 'Node.js and Express REST API'
        });
    });

    // Display all users
    app.get('/users', (request, response) => {
        pool.query('SELECT * FROM users', (error, result) => {
            if (error) throw error;

            response.send(result);
        });
    });

    // Display a single user by ID
    app.get('/users/:id', (request, response) => {
        const id = request.params.id;

        pool.query('SELECT * FROM users WHERE id = ?', id, (error, result) => {
            if (error) throw error;

            response.send(result);
        });
    });

    // Add a new user
    app.post('/users', (request, response) => {
        pool.query('INSERT INTO users SET ?', request.body, (error, result) => {
            if (error) throw error;

            response.status(201).send(`User added with ID: ${result.insertId}`);
        });
    });

    // Update an existing user
    app.put('/users/:id', (request, response) => {
        const id = request.params.id;

        pool.query('UPDATE users SET ? WHERE id = ?', [request.body, id], (error, result) => {
            if (error) throw error;

            response.send('User updated successfully.');
        });
    });

    // Delete a user
    app.delete('/users/:id', (request, response) => {
        const id = request.params.id;

        pool.query('DELETE FROM users WHERE id = ?', id, (error, result) => {
            if (error) throw error;

            response.send('User deleted.');
        });
    });

    // Display all books
    app.get('/books', (request, response) => {
        pool.query('SELECT * FROM books ORDER BY display_order, id', (error, result) => {
            if (error) throw error;

            response.send(result);
        });
    });

    // Display a single book by ID
    app.get('/books/:id', (request, response) => {
        const id = request.params.id;

        pool.query('SELECT * FROM books WHERE id = ?', id, (error, result) => {
            if (error) throw error;

            response.send(result);
        });
    });

    // Add a new book
    app.post('/books', (request, response) => {
        pool.query('INSERT INTO books SET ?', request.body, (error, result) => {
            if (error) throw error;

            response.status(201).send(`Book added with ID: ${result.insertId}`);
        });
    });

    // Update an existing book
    app.put('/books/:id', (request, response) => {
        const id = request.params.id;

        pool.query('UPDATE books SET ? WHERE id = ?', [request.body, id], (error, result) => {
            if (error) throw error;

            response.send('Book updated successfully.');
        });
    });

    // Delete a book
    app.delete('/books/:id', (request, response) => {
        const id = request.params.id;

        pool.query('DELETE FROM books WHERE id = ?', id, (error, result) => {
            if (error) throw error;

            response.send('Book deleted.');
        });
    });
};

// Export the router
module.exports = router;
