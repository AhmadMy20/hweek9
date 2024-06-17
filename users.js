var express = require('express');
var router = express.Router();
var pool = require('./db');
var jwt = require('jsonwebtoken');
var morgan = require('morgan');

router.use(morgan('common'));

router.get('/', function (req, res) {
    
    const limit = parseInt(req.query.limit) || 10; 
    const offset = parseInt(req.query.offset) || 0; 

    if (isNaN(limit) || limit <= 0) {
        return res.status(400).json({ message: 'Invalid limit' });
    }
    if (isNaN(offset) || offset < 0) {
        return res.status(400).json({ message: 'Invalid offset' });
    }
   
    const query = 'SELECT * FROM users LIMIT $1 OFFSET $2';
    const params = [limit, offset];

    pool.query(query, params, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        res.json(result.rows);
    });

});

router.get('/login', (req, res) => {
    const token = jwt.sign(
        {
            id: 1,
            email: "oainger0@craigslist.org",
            gender: "Female",
            password: "KcAk6Mrg7DRM",
            role: "Construction Worker",
        },
        'koderahasia',
        { expiresIn: '1h' }
    );
    res.json({
        token: token,
    });
});

router.get('/login/verify/:token', (req, res) => {
    const token = req.params.token;
    try {
        const data = jwt.verify(token, 'koderahasia');
        res.json({
            data: data,
        });
    } catch (err) {
        res.status(400).json({
            error: 'Token tidak valid atau telah kedaluwarsa',
        });
    }
});

router.post('/register', function (req, res) {
    const {id, email, gender, password, role } = req.body;
    if (!id || !email || !gender || !password || !role) {
        return res.status(400).send('Missing fields');
    }
    pool.query('INSERT INTO users (id, email, gender, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING *', 
    [id, email, gender, password, role], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        res.status(201).json(result.rows[0]);
    });
});
module.exports = router;
