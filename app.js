import dotenv from 'dotenv'
import express from 'express'
import auth from './router/authentication.js'
import cors from 'cors';
import calendarController from './calendar/calendarController.js'
import task from './Task/task.js'
import mongoose from 'mongoose'

const app = express();

dotenv.config({path : './.env'}); //need to declare only once

const PORT = process.env.PORT;

const dataBase = process.env.DATABASE;

mongoose.connect(dataBase, {useUnifiedTopology : true,
    useNewUrlParser : true}).then(() => {
    console.log ("Mongoose connection started")
}).catch((err)=> console.log("Mongoose connection refused", err))


app.use(express.json());
app.use(cors())
app.use(auth);
app.use(express.urlencoded({extended: true}));
app.use(calendarController)
app.use(task)

app.get('/', (req, res)=> {
    res.send("I'm home!")
});

app.get('/calendar', (req, res)=> {
    res.send("I'm calendar!")
});
app.get('/charts', (req, res)=> {
    res.send("I'm charts!")
});
app.get('/logs', (req, res)=> {
    res.send("I'm logs!")
});
app.get('/dashboard', (req, res)=> {
    res.send("I'm dashboard!")
});

app.get('/task', (req, res)=> {
    res.send("I'm task!")
});

app.get('/login', (req, res)=> {
    res.send("I am Login")
    res.set('Access-Control-Allow-origin', 'https://atlas-tool.netlify.app/')
});
app.get('/register', (req, res)=> {
    res.send("I'm register!")
});

app.get('/logout', (req, res)=> {
    res.send("I'm logout!")
});


app.listen(PORT, () => {
    console.log('server running at port no.', PORT)
})

