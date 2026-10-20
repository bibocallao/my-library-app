const express = require('express');
const pool = require('./db');

const app = express();
const PORT = 3001;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use('/bootstrap', express.static('node_modules/bootstrap/dist'));

app.get('/', (req, res) => {
    res.render('index');
});

//READ
app.get('/books', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM books ORDER BY title');
  res.render('books', { books: rows });
});

app.get('/books/new', async(req, res) => {
    res.render('add');
})

//READ
app.get('/edit-books', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM books ORDER by title');
  res.render('edit-books', { books: rows });
});


//READ
app.get('/books/:id/edit', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM books WHERE id = ?', [req.params.id]);

  if (rows.length === 0) {
    return res.status(404).send('Student not found');
  }

  res.render('edit', { book: rows[0] });
});


//CREATE
app.post('/books', async (req, res) => {
  const { title, author } = req.body;
  await pool.query(
    'INSERT INTO books (title, author) VALUES (?, ?)',
    [title, author]
  );
  res.redirect('/books');
});


//UPDATE
app.post('/books/:id/update', async (req, res) => {
  const { title, author } = req.body;

  const [result] = await pool.query(
    'UPDATE books SET title = ?, author = ? WHERE id = ?',
    [title, author, req.params.id]
  );

  if (result.affectedRows === 0) {
    return res.status(404).send('Student not found');
  }

  res.redirect('/books');
});


//READ
app.get('/delete-books', async(req, res) => {
  const[rows] = await pool.query('SELECT * FROM books ORDER BY title');
  res.render('delete-books', { books: rows });
});


//DELETE
app.post('/books/:id/delete', async (req, res) => {
  await pool.query('DELETE FROM books WHERE id = ?', [req.params.id]);
  res.redirect('/delete-books');
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});