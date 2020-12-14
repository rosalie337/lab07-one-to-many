const express = require('express');
const Author = require('./models/Author');
const Book = require('./models/Book');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Mic check, 1, 2, 1, 2....');
});

app.get('/api/v1/authors', (req, res, next) => {
  Author
    .find()
    .then(authors => res.send(authors))
    .catch(next);
});

app.get('/api/v1/books', (req, res, next) => {
  Book
    .find()
    .then(books => res.send(books))
    .catch(next);
});

app.post('/api/v1/authors', (req, res, next) => {
  Author
    .insert(req.body)
    .then(author => res.send(author))
    .catch(next);
});

app.post('/api/v1/books', (req, res, next) => {
  Book
    .insert(req.body)
    .then(book => res.send(book))
    .catch(next);
});

app.get('/api/v1/authors/:id', (req, res, next) => {
  Author
    .findById(req.params.id)
    .then(author => res.send(author))
    .catch(next);
});

app.get('/api/v1/books/:id', (req, res, next) => {
  Book
    .findById(req.params.id)
    .then(book => res.send(book))
    .catch(next);
});

app.put('/api/v1/authors/:id', (req, res, next) => {
  Author
    .update(req.params.id, req.body)
    .then(author => res.send(author))
    .catch(next);
});

app.put('/api/v1/books/:id', (req, res, next) => {
  Book
    .update(req.params.id, req.body)
    .then(book => res.send(book))
    .catch(next);
});

app.delete('/api/v1/authors/:id', (req, res, next) => {
  Author
    .delete(req.params.id)
    .then(author => res.send(author))
    .catch(next);
});

app.delete('/api/v1/books/:id', (req, res, next) => {
  Book
    .delete(req.params.id)
    .then(book => res.send(book))
    .catch(next);
});

module.exports = app;
