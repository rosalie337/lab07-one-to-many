const pool = require('../utils/pool');
const Book = require('./book');

module.exports = class Author {
    id;
    name;
    genre;

    constructor(row) {
      this.id = row.id;
      this.name = row.name;
      this.genre = row.genre;
    }

    static async find() {
      const { rows } = await pool.query('SELECT * FROM authors');

      return rows.map(row => new Author(row));
    }

    static async insert({ name, genre }) {
      const { rows } = await pool.query('INSERT INTO authors (name, genre) VALUES ($1, $2) RETURNING *',
        [name, genre]
      );

      return new Author(rows[0]);
    }

    static async findById(id) {
      const { rows } = await pool.query(
        `SELECT 
          authors.*,
          array_to_json(array_agg(books.*)) AS books
        FROM 
          authors 
        JOIN books
        ON authors.id = books.author_id
        WHERE authors.id=$1
        GROUP BY authors.id
        `,
        [id]);

      return {
        ...new Author(rows[0]),
        books: rows[0].books.map(book => new Book(book))
      };
    }

    static async update(id, { name, genre }) {
      const { rows } = await pool.query(
        `UPDATE authors
            SET name=$1,
                genre=$2
            WHERE id=$3
            RETURNING *
        `,
        [name, genre, id]);

      return new Author(rows[0]);
    }

    static async delete(id) {
      const { rows } = await pool.query('DELETE FROM authors WHERE id=$1 RETURNING *',
        [id]);

      return new Author(rows[0]);
    }
    
};
