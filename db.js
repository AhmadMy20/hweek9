const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',       
  host: 'localhost',      
  database: 'hweek9', 
  password: 'ahmad123',   
  port: 5433,             
});

module.exports = pool;
