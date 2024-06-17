var express = require('express');
var router = express.Router();
var pool = require('./db');

router.use(express.json());


// GET untuk mendapatkan semua film dengan pagination
router.get('/', function (req, res) {
    
    const limit = parseInt(req.query.limit) || 10; 
    const offset = parseInt(req.query.offset) || 0; 

    // Validasi limit dan offset
    if (isNaN(limit) || limit <= 0) {
        return res.status(400).json({ message: 'Invalid limit' });
    }
    if (isNaN(offset) || offset < 0) {
        return res.status(400).json({ message: 'Invalid offset' });
    }
   
    const query = 'SELECT * FROM movies LIMIT $1 OFFSET $2';
    const params = [limit, offset];

    pool.query(query, params, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        res.json(result.rows);
    });
});

// GET untuk mendapatkan film berdasarkan ID
router.get('/:id([0-9]+)', function (req, res) {
    const filmId = parseInt(req.params.id);
    if (isNaN(filmId)) {
        return res.status(400).send('Invalid ID');
    }
    pool.query('SELECT * FROM movies WHERE id = $1', [filmId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        if (result.rows.length === 0) {
            return res.status(404).send('Movie not found');
        }
        res.json(result.rows[0]);
    });
});

// POST untuk menambahkan film baru
router.post('/', function (req, res) {
    const {id, title, genres, year } = req.body;
    if (!id || !title || !genres || !year) {
        return res.status(400).send('Missing fields');
    }
    pool.query('INSERT INTO movies (id,title, genres, year) VALUES ($1, $2, $3, $4) RETURNING *', 
    [id,title, genres, year], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        res.status(201).json(result.rows[0]);
    });
});

// PUT untuk memperbarui film berdasarkan ID
router.put('/:id', function (req, res) {
    const filmId = parseInt(req.params.id);
    const { id, title, genres, year } = req.body;
    if (isNaN(filmId) || !title || !genres || !year) {
        return res.status(400).send('Invalid request');
    }
    pool.query('UPDATE movies SET id = $1, title = $2, genres = $3, year = $4 WHERE id = $5 RETURNING *',
    [id, title, genres, year, filmId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        if (result.rows.length === 0) {
            return res.status(404).send('Movie not found');
        }
        res.json(result.rows[0]);
    });
});

// DELETE untuk menghapus film berdasarkan ID
router.delete('/:id', function (req, res) {
    const filmId = parseInt(req.params.id);
    if (isNaN(filmId)) {
        return res.status(400).send('Invalid ID');
    }
    pool.query('DELETE FROM movies WHERE id = $1 RETURNING *', [filmId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        if (result.rows.length === 0) {
            return res.status(404).send('Movie not found');
        }
        res.json(result.rows[0]);
    });
});

module.exports = router;
