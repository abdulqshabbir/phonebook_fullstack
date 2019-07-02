// load environment variables
require('dotenv').config()


// import modules
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const mongoose = require('mongoose')
const MONGO_PASSWORD = process.env.MONGO_PASSWORD
const MONGODB_URI = `mongodb+srv://fullstack:${MONGO_PASSWORD}@phonebook-ajaa7.mongodb.net/test?retryWrites=true&w=majority`
const path = require('path')

app.use(cors())
app.use(bodyParser.json())

// custom morgan 'token' to be displayed in terminal
morgan.token('req-body', (req) => {
	return JSON.stringify(req.body)
})

// morgan message to be displayed anytime a request is made
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'))

// ---------------------- DATABASE -----------------------------------//

// connect to database...
mongoose
	.connect(MONGODB_URI,{ useNewUrlParser: true })
	.then(() => console.log('connected to database!'))
	.catch((error) => console.log(error))

// create person schema...
const PersonSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	number: {
		type: String,
		required: true
	}
})

// transform toJSON method so 'IDs' on the front-end match backend
PersonSchema.set('toJSON', {
	transform: (document, returnedDocument) => {
		returnedDocument.id = returnedDocument._id
		delete returnedDocument._id
		delete returnedDocument.__v
		return returnedDocument
	}
})

const Person = mongoose.model('Person', PersonSchema)

// -------------   GET routes  ---------------------------//

// Note all get requests are prefixed with http://localhost:5000
app.get('/api/persons', (req, res) => {
	// Find all people in database
	Person.find({}, (error, docs) => {
		// error searching through database
		if (error) return res.status(500).json(error)

		// no documents found
		if (!docs) return res.status(404).json({ error: 'no documents in database' })

		// Format people and serve them to front-end
		const people = docs.map(person => person.toJSON())
		res.json(people)
	})
})

app.get('/api/persons/:id', (req, res) => {
	const id = req.params.id
	Person
		.findById(id)
		.then(doc => {
			if (doc) {
				res.json(doc.toJSON())
			}
			else {
				res.json({ error: 'No document with given id found in database' })
			}
		})
		.catch(error => {
			console.log(error)
			res.status(400).json({ error: 'malformatted id' })
		})
})

// -------------   POST route  ---------------------------//

// Note all requests are prefixed with http://localhost:5000
app.post('/api/persons', (req, res) => {
	const { number, name } = req.body
	// Bad request errors
	if (!number) return res.status(400).json({ error: 'number missing' })
	if(!name) return res.status(400).json({ error: 'name missing' })

	// Instantiate new DB document using model
	const newPerson = new Person({
		name: name,
		number: number
	})

	// Save document to DB
	newPerson
		.save()
		.then(savedPerson => savedPerson.toJSON())
		.then(savedFormattedPerson => res.json(savedFormattedPerson))
		.catch(error => {
			console.log(error)
			res.status(500).end()
		})
})

// -------------   PUT route  ---------------------------//

app.put('/api/persons/:id', (req, res) => {
	const { number, id } = req.body

	Person.findByIdAndUpdate(
		// find this object...
		id,
		{ number: number }, 
		(error, doc) => {
			// DB searching error
			if (error) return res.status(500).json(error)
			// Document not found error
			if (!doc) return res.status(400).json({ error: 'Document to update does not exist in database' })
			res.json(doc.toJSON())
		})
})

// -------------   DELETE route  ---------------------------//

app.delete('/api/persons/:id', (req, res) => {
	const { id  } = req.params

	Person
		.findByIdAndDelete(id)
		.then(doc => {
			if (doc) {
				// respond with status code 204 - 'no content'
				res.status(204).end()
			}
			else {
				res.status(400).json({ error: 'Document to delete does not exist in database' })
			}
		})
		.catch(error => {
			console.log(error)
			res.status(500).end()
		})
})

// serve static assets if in production
if (process.env.node_env === 'production') {
	// set static folder
	app.use(express.static('client/build'))
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
	})
}

const PORT = process.env.PORT

app.listen(PORT, () => {
	console.log(`server is listening on port ${PORT}`)
})