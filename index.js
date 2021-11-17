const express = require('express')
var morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use((cors()))
app.use(express.json())

morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons',(req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.filter(person => person.id === id)
    if(person.length > 0 && person){
        res.json(person)
    }else{
        res.status(404).end()
    }
})

app.get('/info', (req, res) => {
    const countePeople = persons.length
    const requestDate = new Date()
    const reqDate = requestDate.toDateString()
    const reqTime = requestDate.toTimeString()
    res.send(`
            <div>
                <p>Phonebook has info for ${countePeople} people</p>
                <p>${reqDate} ${reqTime}</p>
            </div>
            `) 
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})


app.post('/api/persons', (req, res) => {
    const body = req.body
    const generateId = Math.floor(Math.random()*500)
    const duplicateName = persons.find(person => person.name.toLowerCase() === body.name.toLowerCase())
    const duplicateNumber = persons.find(person => person.number === body.number)

    if(!body.name || !body.number){
        return res.status(400).json({
            error: 'name or number missing'
          })
    }if(duplicateName){
        return res.status(401).json({
            error: 'name must be unique'
        })
    }if(duplicateNumber){
        return res.status(402).json({
            error: 'number must be unique'
        })
    }

    const person = {
        id: generateId,
        name: body.name,
        number: body.number,
    }
    persons = persons.concat(person)
    res.json(person)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})