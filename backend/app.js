const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { mongoose } = require('./database/mongoose')
const { Task } = require('./database/models/task.model')
const session = require("express-session")
const MongoDBStore = require("connect-mongodb-session")(session)
require("dotenv").config()
const Utilisateur = require('./database/models/utilisateur.model')
const bcrypt = require('bcrypt')


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

app.use((req, res, next) => {
    if (!req.session.user) {   //Si il n y a pas de session en cours continuer sans rien faire
      return next();
    }
    Utilisateur.findById(req.session.user._id)
      .then(user => {
        req.user = user;   // Si il y a une session en cours l'utilisateur de la session devient un model mongoose
        next();
      })
      .catch(err => console.log(err));
});

/* END MIDDLEWARE ⬆ */

//auth routes

app.post('/inscription', (req,res,next) => {
    const email = req.body.email
    const password = req.body.password
    // const errors = validationResult(req)
  
    // if(!errors.isEmpty()){
    //   return res.status(422).render('auth/inscription', {
    //     pageTitle: 'Inscription',
    //     path: '/auth/inscription',
    //     errorMessage: errors.array()[0].msg
    //   });
    // }
  
    bcrypt.hash(password,12)
      .then(hashedPassword => {
        const utilisateur = new Utilisateur({
          email: email,
          password: hashedPassword
        })
      
        utilisateur.save()
        res.status(201).send(utilisateur)
      })
  
})

app.post('/connexion',(req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
  
    // const errors = validationResult(req)
  
    // if(!errors.isEmpty()){
    //   return res.status(422).render('auth/connexion', {
    //     pageTitle: 'Connexion',
    //     path: '/auth/connexion',
    //     errorMessage: errors.array()[0].msg
    //   });
    // }
  
    Utilisateur.findOne({ email: email })
        .then(user => {
          if (!user) {
            return res.status(422).send("Impossible de trouver l'utilisateur")
          }
          bcrypt
            .compare(password, user.password)
            .then(doMatch => {
              if (doMatch) {
                console.log("çA Match ! 🥳")
                req.session.isLoggedIn = true;
                req.session.user = user;
                return req.session.save(err => {
                  console.log(err);
                  res.status(200).send("Utilisateur connecté")
                });
              }
              console.log(user)
              return res.status(422).send("MdP ou mail faux")
            })
            .catch(err => {
              console.log(err);
              res.status(422).send(`Erreur serveur: ${err}`);
            });
        })
        .catch(err => console.log(err));
    })



//task routes
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