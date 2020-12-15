const fs = require('fs');
const pool = require('../lib/utils/pool');
const app = require('../lib/app');
const request = require('supertest');
const Author = require('../lib/models/Author');
const Book = require('../lib/models/Book');

describe('CRUD routes for Authors model', () => {

  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  afterAll(() => {
    return pool.end();
  });


  it('Adds an author via POST', async() => {
    const res = await request(app)
      .post('/api/v1/authors')
      .send({
        name: 'James Baldwin',
        genre: 'Non-fiction'
      });

    expect(res.body).toEqual({
      id: '1',
      name: 'James Baldwin',
      genre: 'Non-fiction'
    });

  });

  it('Returns all authors via GET', async() => {
    const authors = await Promise.all([
      {
        name: 'Ta-Nehisi Coates',
        genre: 'Non-fiction'
      },
      {
        name: 'James Baldwin',
        genre: 'Non-fiction'
      },
      {
        name: 'Toni Morrison',
        genre: 'Non-fiction'
      }
    ].map(author => Author.insert(author)));

    const res = await request(app)
      .get('/api/v1/authors');
    
    expect(res.body).toEqual(expect.arrayContaining(authors));
    expect(res.body).toHaveLength(authors.length);
  });

  it('Finds an author by id and associated books via GET', async() => {
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
      .get(`/api/v1/authors/${author.id}`);

    expect(res.body).toEqual({
      ...author,
      books: expect.arrayContaining(books)
    });
  });

  it('Updates an author by id via PUT', async() => {
    const author = await Author.insert({
      name: 'James Baldwin',
      genre: 'Non-fiction'
    });

    const res = await request(app)
      .put(`/api/v1/authors/${author.id}`)
      .send({
        name: 'James Baldwin',
        genre: 'Fiction'
      });

    expect(res.body).toEqual({
      id: author.id,
      name: 'James Baldwin',
      genre: 'Fiction'
    });
  });

  it('Removes an author by id via DELETE', async() => {
    const author = await Author.insert({
      name: 'Ta-Nehisi Coates',
      genre: 'Non-fiction'
    });

    const res = await request(app)
      .delete(`/api/v1/authors/${author.id}`)
      .send({
        name: 'Ta-Nehisi Coates',
        genre: 'Non-fiction'
      });

    expect(res.body).toEqual({
      id: author.id,
      name: 'Ta-Nehisi Coates',
      genre: 'Non-fiction'
    });
  });

});
