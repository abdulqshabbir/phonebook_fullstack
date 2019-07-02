const mongoose = require('mongoose')

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

// transform toJSON method so the front-end and back-end have a similar shape
PersonSchema.set('toJSON', {
	transform: (document, returnedDocument) => {
		returnedDocument.id = returnedDocument._id
		delete returnedDocument._id
		delete returnedDocument.__v
		return returnedDocument
	}
})

const Person = mongoose.model('Person', PersonSchema)

module.exports = Person