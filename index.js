import express from 'express';
import pg from 'pg';
import axios from 'axios';
import ejs from 'ejs';

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

const client = new pg.Client({
    user: 'postgres',
    host: 'localhost',
    database: 'books',
    password: '19111991',
    port: 5432,
});

client.connect();

async function getCoverImage(bookName) {
    try {
        const response = await axios.get(`https://openlibrary.org/search.json?q=${bookName}`);
        const cover = response.data.docs[0].cover_i;
        return `http://covers.openlibrary.org/b/id/${cover}-M.jpg`;
    } catch (err) {
        console.error(err);
        return null;
    }
}

// create a route to get the cover image of the book
app.get('/cover/:bookName', async (req, res) => {
    const { bookName } = req.params;
    const cover = await getCoverImage(bookName);
    console.log(cover);
    res.send(`<img src="${cover}" alt="${bookName}">`);
});


app.get('/', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM items');
        // get the cover image of the book from the Open Library API
        for (const item of result.rows) {
            item.cover = await getCoverImage(item.name);
        }

        res.render('index.ejs', { items: result.rows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create
app.post('/items', async (req, res) => {
    const bookName = req.body.bookName; // Get the book name from the form
  
    try {
      // Search for the book using the Open Library API
      const response = await axios.get(`https://openlibrary.org/search.json?q=${bookName}`);
      const firstBook = response.data.docs[0];
  
      // Extract the book title from the API response
      const title = firstBook.title;
  
      // Insert the book into the database
      const result = await client.query(
        'INSERT INTO items (name) VALUES ($1) RETURNING *',
        [title]
      );
  
      res.status(201).json(result.rows[0]);
      res.redirect('/');
    } catch (err) {
      res.status(500).json({ error: err.message });
      res.redirect('/');
    }
  });

  app.post('/description', async (req, res) => {
    const { description } = req.body; 
    const itemId = req.body.itemId; // Assuming you have a way to get the item ID
  console.log(description);
  console.log(itemId);
    try {
      // Update the item in the database
      await client.query(
        'UPDATE items SET description = $1 WHERE id = $2 RETURNING *',
        [description, itemId]
      );
      res.redirect('/');
    } catch (err) {
      console.error("Erro ao atualizar a descrição do item:", err);
    res.redirect('/');
    }
  });

// Read
app.get('/items', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM items');
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update
app.put('/items/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    try {
        const result = await client.query('UPDATE items SET name = $1, description = $2 WHERE id = $3 RETURNING *', [name, description, id]);
        res.status(200).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete
app.delete('/items/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await client.query('DELETE FROM items WHERE id = $1', [id]);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});