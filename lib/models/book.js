const pool = require('../utils/pool');

module.exports = class Book {
    id;
    title;
    publisher;
    author_id;

    constructor(row) {
      this.id = row.id;
      this.title = row.title;
      this.publisher = row.publisher;
      this.author_id = row.author_id;
    }

    static async insert({ title, publisher, author_id }) {
      const { rows } = await pool.query('INSERT INTO books (title, publisher, author_id) VALUES ($1, $2, $3) RETURNING *',
        [title, publisher, author_id]);

      return new Book(rows[0]);
    }

    static async find() {
      const { rows } = await pool.query('SELECT * FROM books');

      return rows.map(row => new Book(row));
    }

    static async findById(id) {
      const { rows } = await pool.query('SELECT * FROM books WHERE id=$1',
        [id]);

      return new Book(rows[0]);
    }

    static async update(id, { title, publisher, author_Id }) {
      const { rows } = await pool.query(
        `UPDATE books
            SET title=$1,
                publisher=$2,
                author_id=$3
            WHERE id=$4
            RETURNING *`,
        [title, publisher, author_Id, id]);

      return new Book(rows[0]);
    }

    static async delete(id) {
      const { rows } = await pool.query('DELETE FROM books WHERE id=$ RETURNING *',
        [id]);

      return new Book(rows[0]);
    }

};
