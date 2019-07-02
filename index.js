const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const mongoose = require('mongoose')
const MONGO_PASSWORD = 'fullstack'
const MONGODB_URI = `mongodb+srv://fullstack:${MONGO_PASSWORD}@phonebook-ajaa7.mongodb.net/test?retryWrites=true&w=majority`

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
    .then((result) => console.log('connected to database!'))
    .catch((error) => console.log(error))

// create person schema...
const PersonSchema = new mongoose.Schema({
    name: String,
    number: String
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
        if (!docs) return res.status(404).json({error: 'no documents in database'})

        // Format people and serve them to front-end
        const people = docs.map(person => person.toJSON())
        res.json(people)
    })
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    Person.findById(id, 
        (error, doc) => {
            // error searching thorugh database
            if (error) return res.status(500).json(error)

            // database could not find matching document
            if (!doc) return res.status(404).json({error: 'document cannot be found'})
            
            // serve matching document
            res.json(doc.toJSON())
    })
})

// -------------   POST route  ---------------------------//

// Note all requests are prefixed with http://localhost:5000
app.post('/api/persons', (req, res) => {
    const {number, name} = req.body
    
    // Bad request errors
    if (!number) return res.status(400).json({error: 'number missing'})
    if(!name) return res.status(400).json({error: 'name missing'})

    // Instantiate new DB document using model
    const newPerson = new Person({
        name: name,
        number: number
    })

    // Save document to DB
    newPerson.save((error, savedPerson) => {
        if (error) console.log(error)

        Person.find({}, (error, docs) => {
            docs = docs.map(person => person.toJSON())
            res.json(docs)
        })
    })
})

// -------------   PUT route  ---------------------------//

app.put('/api/persons/:id', (req, res) => {
    const {number, id} = req.body

    Person.findByIdAndUpdate(
        // find this object...
        id, 
        // update only the number - DB will copy remaining fields...
        {
            number: number, 
        }, 
        (error, doc) => {
            // DB error
            if (error) return res.status(500).json(error)
            if (!doc) return res.status(400).json({error: 'Document to update does not exist in database'})
            
            res.json(doc.toJSON())
        })
})

// -------------   DELETE route  ---------------------------//

app.delete('/api/persons/:id', (req, res) => {
    const { id  } = req.params

    Person.findByIdAndDelete(id, 
        (error, doc) => {
            if (error) return res.status(500).json(error)
            if (!doc) return res.status(400).json({error: 'Document to delete does not exist in databse'})

            res.json(doc.toJSON())
        }
    )
})



const PORT = 5000

app.listen(PORT, () =>{
    console.log(`server is listening on port ${PORT}`)
})