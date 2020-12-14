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

  it('Adds an book via POST', async() => {
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
});
