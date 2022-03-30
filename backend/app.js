const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { mongoose } = require('./database/mongoose')
const { Task } = require('./database/models/task.model')



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
            res.status(400).send(e)
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
            res.status(400).send(e)
        })

})



app.listen(3000, ()=>{
    console.log("App listening on port 3000...")
})