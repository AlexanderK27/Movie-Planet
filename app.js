const express = require('express')
const path = require('path')
const mongoose = require('mongoose')

const app = express()

app.use(express.json())

app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/user', require('./routes/user.routes'))
app.use('/api/tickets', require('./routes/tickets.routes'))
app.use('/api/movies', require('./routes/movies.routes'))

if (process.env.NODE_ENV === 'production') {
	app.use('/', express.static(path.join(__dirname, 'client', 'build')))

	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
	})
}

const PORT = process.env.PORT

async function start() {
	try {
		await mongoose.connect(process.env.MONGODB_URL, {
			useNewUrlParser: true,
			useCreateIndex: true,
			useUnifiedTopology: true,
		})
		app.listen(PORT, () =>
			console.log(`Server is running on port ${PORT}...`)
		)
	} catch (e) {
		console.log('Server Error:', e.message)
		process.exit(1)
	}
}

start()
