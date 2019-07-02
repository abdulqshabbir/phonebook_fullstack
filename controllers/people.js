const peopleRouter = require('express').Router()
const Person = require('./../models/Person')

// -------------   GET routes  ---------------------------//

// Note all get requests are prefixed with http://localhost:5000
peopleRouter.get('/persons', (req, res) => {
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

peopleRouter.get('/persons/:id', (req, res) => {
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
peopleRouter.post('/persons', (req, res) => {
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

peopleRouter.put('/persons/:id', (req, res) => {
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

peopleRouter.delete('/persons/:id', (req, res) => {
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

module.exports = peopleRouter