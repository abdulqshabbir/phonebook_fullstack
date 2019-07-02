// import express and create app
const express = require('express')
const app = express()

// import port from config module
const { PORT } = require('./utils/config')

// import database-related stuff
const { MONGO_PASSWORD } = require('./utils/config')
const MONGODB_URI = `mongodb+srv://fullstack:${MONGO_PASSWORD}@phonebook-ajaa7.mongodb.net/test?retryWrites=true&w=majority`
const mongoose = require('mongoose')

// import middleware
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const peopleRouter = require('./controllers/people')

// Allow cross-origin resource sharing
app.use(cors())

// Parse request body into JSON
app.use(bodyParser.json())

// custom morgan 'token' to be displayed in terminal
morgan.token('req-body', (req) => {
	return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'))

// Handle all routes relating to the 'people' resource
app.use('/api', peopleRouter)

// connect to database...
mongoose
	.connect(MONGODB_URI,{ useNewUrlParser: true })
	.then(() => console.log('connected to database!'))
	.catch((error) => console.log(error))


app.listen(PORT, () => {
	console.log(`server is listening on port ${PORT}`)
})