//DATABASE CONFIG
if (app.get('env') === 'production') {
    const { Pool, Client } = require('pg')
    const connectionString = 'postgresql://dbuser:secretpassword@database.server.com:3211/mydb'
    
    const pool = new Pool({
      connectionString: connectionString,
    })
    
    pool.query('SELECT NOW()', (err, res) => {
      console.log(err, res)
      pool.end()
    })
    
    const client = new Client({
      connectionString: connectionString,
    })
    client.connect()
    
    client.query('SELECT NOW()', (err, res) => {
      console.log(err, res)
      client.end()
    })
      }
      else{
        const { Pool, Client } = require('pg')
    
    const pool = new Pool({
      user: 'postgres',
      host: 'localhost',
      database: 'stargarnet',
      password: 'password',
      port: 5432,
    })
    pool.query('SELECT NOW()', (err, res) => {
      console.log(err, res)
      pool.end()
    });
    
    const client = new Client({
      user: 'postgres',
      host: 'localhost',
      database: 'stargarnet',
      password: 'password',
      port: 5432,
    })
    client.connect()
    client.query('SELECT NOW()', (err, res) => {
      console.log(err, res)
      client.end()
    })
      }