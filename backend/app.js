const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { mongoose } = require('./database/mongoose')
const { Task } = require('./database/models/task.model')
const session = require("express-session")
const MongoDBStore = require("connect-mongodb-session")(session)


const app = express()

/* START MIDDLEWARE ⬇ */

app.use(bodyParser.json())
app.use(cors())

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