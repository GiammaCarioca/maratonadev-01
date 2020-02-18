require('dotenv').config()
const express = require('express')
const server = express()
const nunjucks = require('nunjucks')

server.use(express.static('public'))
server.use(express.urlencoded({ extended: true }))

const Pool = require('pg').Pool
const db = new Pool({
	user: process.env.PGUSER,
	password: process.env.PGPASSWORD,
	host: 'localhost',
	port: 5432,
	database: process.env.PGDATABASE
})

nunjucks.configure('./', {
	express: server,
	noCache: true
})

server.get('/', function(req, res) {
	db.query('SELECT * FROM donors', function(err, result) {
		if (err) return res.send('Erro no banco de dados.')

		const donors = result.rows

		return res.render('index.html', { donors })
	})
})

server.post('/', function(req, res) {
	const { name, email, blood } = req.body

	const query = `
		INSERT INTO donors ("name", "email", "blood")
		VALUES ($1, $2, $3)`

	const values = [name, email, blood]

	if (name == '' || email == '' || blood == '')
		return res.send('Todos os campos são obrigatórios.')

	db.query(query, values, function(err) {
		if (err) return res.send('Erro no banco de dados.')

		return res.redirect('/')
	})
})

server.listen(3000, function() {
	console.log('server is running')
})
