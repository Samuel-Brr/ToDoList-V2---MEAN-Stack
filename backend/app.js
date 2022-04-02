const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { mongoose } = require('./database/mongoose')
const { Task } = require('./database/models/task.model')
const session = require("express-session")
const MongoDBStore = require("connect-mongodb-session")(session)
require("dotenv").config()
const Utilisateur = require('./database/models/utilisateur.model')


const app = express() //App starts here

const store = new MongoDBStore({  // Création d'une nouvelle instance d'un store pour nos sessions utilisateurs
    uri: process.env.DB_STRING, // Parametrez votre connexion a la dB dans le fichier .env
    collection: 'sessions' 
  });

/* START MIDDLEWARE ⬇ */

app.use(bodyParser.json())
app.use(cors())

app.use(session({          //Parametrage de la session utilisateur
    secret: process.env.SECRET, //Parametrez le secret dans votre fichier .env
    resave: false, 
    saveUninitialized: false, 
    store: store})
)

/* END MIDDLEWARE ⬆ */


app.get('/tasks', (req,res)=>{
    Task.find()
        .then(tasks =>{
            res.status(200).send(tasks)
        })
        .catch(e=>{
            res.status(500).send(e)
        })
})

app.post('/tasks', (req,res)=>{
    const content = req.body.content

    const newTask = new Task({
        content
    })

    newTask.save()
        .then(taskDoc =>{
            res.status(201).send(taskDoc)
        })
        .catch(e =>{
            res.status(500).send(e)
        })

})

app.put('/tasks/:taskId', (req,res)=>{
    const taskId = req.params.taskId
    
    Task.findOneAndUpdate({_id: taskId},{$set:req.body})
        .then(() => res.status(204).send("Task updated !"))
        .catch((e)=>res.status(500).send(e))
})

app.delete('/tasks/:taskId', (req,res)=>{
    const taskId = req.params.taskId
    
    Task.findOneAndRemove({_id: taskId})
        .then(() => res.status(204).send("Task deleted !"))
        .catch((e)=>res.status(500).send(e))
})


app.listen(3000, ()=>{
    console.log("App listening on port 3000...")
})