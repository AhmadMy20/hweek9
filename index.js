var express = require('express');
var bodyParser = require('body-parser');
var moviesRouter = require('./movies');
var database = require('./db');
var usersRouter = require('./users');
var swaggerJsdoc = require('swagger-jsdoc');
var swaggerUi = require('swagger-ui-express');


var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var options = {
    swaggerDefinition: {
        openapi: '3.0.0', // Spesifikasi OpenAPI yang digunakan
        info: {
            title: 'Movie API', // Judul API
            version: '0.1.0', // Versi API
            description: 'API untuk mengelola data movies', // Deskripsi API
        },
        servers:[
            {
                url: 'http://localhost:3000',
            },
        ],
    },
    apis: ['./routes/movies.js'], // Path ke file yang berisi anotasi JSDoc
};
const specs =swaggerJsdoc(options);
app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(specs, {explorer: true})
);

app.use('/movies', moviesRouter);
app.use('/users', usersRouter);
app.use('/users/verify', usersRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
