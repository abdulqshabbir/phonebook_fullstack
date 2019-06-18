const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

let persons = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
    },
    {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: 2
    },
    {
        name: "Dan Abromov",
        number: "12-43-234345",
        id: 3
    },
    {
        name: "Mary Poppendieck",
        number: "39-23-6423122",
        id: 4
    }
]

app.use(cors())
app.use(bodyParser.json())


// custom morgan 'token' to be displayed in terminal
morgan.token('req-body', (req) => {
    return JSON.stringify(req.body)
})

// morgan message to be displayed anytime a request is made
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'))

app.get('/', (req, res) => {
    console.log('hello world') 
    res.send('please naviagate to /api/persons')
    res.end()
})

app.get('/api/persons', (req, res) => {
    res.send(persons)
    res.end()
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const note = persons.find(n => n.id === id)
    if (note) {
        res.json(note)
    }
    else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(n => n.id !== id)
    res.json(persons)
})


app.get('/api/persons/info', (req, res) => {
    const date = new Date(Date.now())
    res.set('Content-Type', 'text/html')
    res.write(`<p>Phonebook has info for ${persons.length} people</p> ${date.toString()}`)
    res.end()
})

app.post('/api/persons', (req, res) => {
    const generateUniqueId = () => Math.floor(Math.random()*1000000)

    if(!req.body.number) {
        return res.status(400).json({
            error: 'number missing'
        })
    }
    else if(!req.body.name) {
        return res.status(400).json({
            error: 'name missing'
        })
    }

    const matchingPerson = persons.find(person => person.name === req.body.name)
    if (matchingPerson) {
        return res.status(400).json({
            error: 'Name already exists in phonebook'
        })
    }
    
    const newPerson = {
        name: req.body.name,
        number: req.body.number,
        id: generateUniqueId()
    }
    persons = [...persons, newPerson]
    res.json([...persons,newPerson]
    )
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () =>{
    console.log(`listening on port ${PORT}`)
})