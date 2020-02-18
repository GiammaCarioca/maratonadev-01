const express = require('express')
const server = express()
const nunjucks = require('nunjucks')
let donors = require('./data')

server.use(express.urlencoded({ extended: true }))
server.use(express.static('public'))

nunjucks.configure('./', {
	express: server,
	noCache: true
})

server.get('/', function(req, res) {
	return res.render('index.html', { donors })
})

server.post('/', function(req, res) {
	const { name, email, blood } = req.body

	donors = [...donors, { name, email, blood }]

	return res.redirect('/')
})

server.listen(3000, function() {
	console.log('server is running')
})
