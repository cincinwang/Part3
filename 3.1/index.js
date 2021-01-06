const express = require('express');
const app = express();
const morgan = require('morgan');


app.use(express.json());

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :POST"));
morgan.token("POST", (request, response)=>JSON.stringify(request.body));

let persons=[
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
        name: "Dan Abramov",
        number: "12-43-234345",
        id: 3
    },
    {
        name: "Mary Poppendieck",
        number: "39-23-6423122",
        id: 4
    },
    {
        name: "CinCin",
        number: "39-00-6423122",
        id: 5
    }
];

app.get('/api/persons', (request,response)=>{
    response.json(persons)
});

app.get('/info', (request,response)=>{
    response.send(`Phonebook has info for ${persons.length} people <br> <P>${new Date()}</P>`)
});

app.get('/api/persons/:id', (request, response)=>{
    const id = Number(request.params.id)
    const person = persons.find(person=>person.id === id)

    if(person){
        response.json(person)
    }else{
        response.status(404).send(`404 Not Found`).end()
    }

});

const generateId= ()=>{
    return Math.round(Math.random()*3000)
};

app.post('/api/persons',(request,response)=>{
    const body = request.body;
    console.log(request);
     if(!body.name || !body.number){
         return response.status(400).json({
             error: 'name or number is missing'
         })
     }
     if(persons.find(person=> person.name ===body.name)){
         return response.status(400).json({
             error:'name must be unique'
         })
     }

     const person ={
         name: body.name,
         number: body.number,
         id: generateId()
     };

     persons = persons.concat(person);

     response.json(person)

});

app.delete('/api/persons/:id', (request,response)=>{
    const id = Number(request.params.id);
    persons = persons.filter(person => person.id !== id);
    response.status(204).end()
});


const PORT = 3001;
app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`)
});