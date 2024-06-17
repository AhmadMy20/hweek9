// routes/movies.js
import { Router } from 'express';
const router = Router();

/**
 * @swagger
 * /movies:
 *   get:
 *     summary: Mendapatkan daftar semua film
 *     description: Mengembalikan daftar film yang tersedia
 *     responses:
 *       200:
 *         description: Daftar film berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   genre:
 *                     type: string
 *                   year:
 *                     type: integer
 
 */
 
router.get('/movies', (req, res) => {
    const movies = [
        { id: 1, title: 'Inception', genre: 'Christopher Nolan', year: 2010 },
        { id: 2, title: 'The Matrix', genre: 'Lana Wachowski, Lilly Wachowski', year: 1999 },
    ];
    res.json(movies);
});

export default router;
