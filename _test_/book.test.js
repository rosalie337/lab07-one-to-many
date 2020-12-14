const fs = require('fs');
const pool = require('../lib/utils/pool');
const app = require('../lib/app');
const request = require('supertest');
const Book = require('../lib/models/Book');
const Author = require('../lib/models/Author');

describe('CRUD routes for Book model', () => {

  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });
    
  afterAll(() => {
    return pool.end();
  });

  it('Adds a book via POST', async() => {
    const author = await Author.insert({
      name: 'Ta-Nehisi Coates',
      genre: 'Non-fiction'
    });
    
    const res = await request(app)
      .post('/api/v1/books')
      .send({
        title: 'Between the World and Me',
        publisher: 'One World',
        author_id: author.id
      });

    expect(res.body).toEqual({
      id: '1',
      title: 'Between the World and Me',
      publisher: 'One World',
      author_id: author.id
    });
  });

  it('Returns all books via GET', async() => {
    const author = await Author.insert({
      name: 'Ta-Nehisi Coates',
      genre: 'Non-fiction'
    });
  
    const books = await Promise.all([
      {
        title: 'Between the World and Me',
        publisher: 'One World',
        author_id: author.id
      },
      {
        title: 'The Water Dancer: A Novel',
        publisher: 'One World',
        author_id: author.id
      },
      {
        title: 'We Were Eight Years in Power: An American Tragedy',
        publisher: 'One World',
        author_id: author.id
      },
    ].map(book => Book.insert(book)));
    
    const res = await request(app)
      .get('/api/v1/books');
    
    expect(res.body).toEqual(expect.arrayContaining(books));
    expect(res.body).toHaveLength(books.length);
  });
  
  it('Finds a book by id via GET', async() => {
    const author = await Author.insert({
      name: 'Ta-Nehisi Coates',
      genre: 'Non-fiction'
    });

    const book = await Book.insert({
      title: 'Between the World and Me',
      publisher: 'One World',
      author_id: author.id
    });

    const res = await request(app)
      .get(`/api/v1/books/${book.id}`);
          
    expect(res.body).toEqual({
      id: '1',
      title: 'Between the World and Me',
      publisher: 'One World',
      author_id: author.id
    });
  });

  it('Updates a book by id via PUT', async() => {
    const author = await Author.insert({
      name: 'Ta-Nehisi Coates',
      genre: 'Non-fiction'
    });
      
    const book = await Book.insert({
      title: 'Between the World and Me',
      publisher: '1 World',
    });
      
    const res = await request(app)
      .put(`/api/v1/books/${book.id}`)
      .send({
        id: book.id,
        title: 'Between the World and Me',
        publisher: '1 World',
        author_id: author.id
      });

    expect(res.body).toEqual({
      id: book.id,
      title: 'Between the World and Me',
      publisher: 'One World',
      author_id: author.id
    });
  });

  it('Deletes a book by id via DELETE', async() => {
    const author = await Author.insert({
      name: 'Ta-Nehisi Coates',
      genre: 'Non-fiction'
    });
      
    const book = await Book.insert({
      title: 'Between the World and Me',
      publisher: 'One World',
      author_id: author.id
    });
      
    const res = await request(app)
      .put(`/api/v1/books/${book.id}`)
      .send({
        title: 'Between the World and Me',
        publisher: 'One World',
        author_id: author.id
      });

    expect(res.body).toEqual({
      id: book.id,
      title: 'Between the World and Me',
      publisher: 'One World',
      author_id: author.id
    });
  });
});
