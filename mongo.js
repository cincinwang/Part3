const mongoose = require('mongoose');

if(process.argv.length<3){
    process.exit(1)
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];


const url =`mongodb+srv://fullstack:${password}@cluster0.45d30.mongodb.net/person-app?retryWrites=true&w=majority`;

mongoose.connect(url,{useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true});

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
});

const Person = mongoose.model('Person', personSchema);

const person = new Person({
    name: name,
    number: number
});

person.save().then(result=>{
    console.log(`Added ${result.name} ${result.number} to phonebook`);
    mongoose.connection.close()
    });