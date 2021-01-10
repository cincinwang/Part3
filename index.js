require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors=require('cors');
const Person = require('./models/person');
// const mongoose = require('mongoose');


app.use(cors());
app.use(express.static('build'));
app.use(express.json());



app.use(morgan(":method :url :status :res[content-length] - :response-time ms :POST"));
morgan.token("POST", (request, response)=>JSON.stringify(request.body));


// const url =`mongodb+srv://fullstack:AAAA@cluster0.45d30.mongodb.net/person-app?retryWrites=true&w=majority`;
//
// mongoose.connect(url,{useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true});
//
// const personSchema = new mongoose.Schema({
//     name: String,
//     number: String,
// });
//
// const Person = mongoose.model('Person', personSchema);

//to remove id and __v that was shown in the person object
// personSchema.set('toJSON', {
//     transform: (document, returnedObject)=>{
//         returnedObject.id = returnedObject._id.toString();
//         delete returnedObject._id
//         delete returnedObject.__v
//     }
// });

//
// let persons=[
//     {
//         name: "Arto Hellas",
//         number: "040-123456",
//         id: 1
//     },
//     {
//         name: "Ada Lovelace",
//         number: "39-44-5323523",
//         id: 2
//     },
//     {
//         name: "Dan Abramov",
//         number: "12-43-234345",
//         id: 3
//     },
//     {
//         name: "Mary Poppendieck",
//         number: "39-23-6423122",
//         id: 4
//     },
//     {
//         name: "CinCin",
//         number: "39-00-6423122",
//         id: 5
//     }
// ];

// app.get('/', (request,response)=>{
//     return response.send("it's working!")
// });

app.get('/api/persons', (request,response, next)=>{
    // response.json(persons)
    // console.log(response);
    Person.find({})
        .then(persons =>{
        response.json(persons)
    })
        .catch(error=>next(error))
});

app.get('/info', (request,response, next)=>{
    Person.find({}).then(persons=>{
        response.send(`Phonebook has info for ${persons.length} people <br> <P>${new Date()}</P>`)
    })
        .catch(error=>next(error))

});


// using hardcoded data:
// app.get('/api/persons/:id', (request, response)=>{
//     const id = Number(request.params.id)
//     const person = persons.find(person=>person.id === id)
//
//     if(person){
//         response.json(person)
//     }else{
//         response.status(404).send(`404 Not Found`).end()
//     }
//
// });


//refactor the backend to use the database:
//The next function is passed to the handler as the third parameter
//If next was called without a parameter, then the execution would simply move onto the next route or middleware. If the next function is called with a parameter, then the execution will continue to the error handler middleware
app.get('/api/persons/:id', (request,response, next)=>{
    Person.findById(request.params.id)
        .then(person=> {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error =>{next(error)
            // console.log(error)
            // response.status(400).send({error:'malformatted Id'})
            })
});


// const generateId= ()=>{
//     return Math.round(Math.random()*3000)
// };

app.post('/api/persons',(request,response, next)=>{
    const body = request.body;

    // console.log(request);
    //
     if(!body.name || !body.number){
         return response.status(400).json({
             error: 'name or number is missing'
         })
     }
     // if(persons.find(person=> person.name ===body.name)){
     //     return response.status(400).json({
     //         error:'name must be unique'
     //     })
     // }


     // const person ={
     //     name: body.name,
     //     number: body.number,
     //     id: generateId()
     // };

    //refactor the backend to use database
    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save()
        .then(savedPerson=> {
            response.json(savedPerson)
        })
        .catch(error=> next(error))

     // persons = persons.concat(person);
     //
     // response.json(person)
});

app.put('/api/persons/:id', (request,response,next)=>{
    const body= request.body

    const person={
        name:body.name,
        number:body.number,
    }

    Person.findByIdAndUpdate(request.params.id,person,{new:true})
        .then(updatedPerson=>{
            response.json(updatedPerson)
        })
        .catch(error=> next(error))
})

app.delete('/api/persons/:id', (request,response)=>{
    // const id = Number(request.params.id);
    // persons = persons.filter(person => person.id !== id);

    //refactor backend to use database:
    Person.findByIdAndDelete(request.params.id)
        .then(result =>{response.status(204).end()})
        .catch(error => next(error))
});


const errorHandler = (error, request, response, next)=>{
    console.error(error.message);

    if(error.name==='CastError'){
        return response.status(400).send({error:'malformatter id'})
    }
    //expand the error handler to deal with these validation errors
    else if(error.name ==='ValidationError'){
        return response.status(400).json({error: error.message})
    }
    next(error)
};

app.use(errorHandler);

// const PORT = process.env.PORT || 3001;
//after adding PORT in .env:
const PORT = process.env.PORT;
app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`)
});
