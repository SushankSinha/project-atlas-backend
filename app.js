import dotenv from 'dotenv'
import express from 'express'
import auth from './router/authentication.js'
import cors from 'cors';
import calendarController from './calendar/calendarController.js'
import task from './Task/task.js';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

const app = express();

dotenv.config({path : './.env'}); //need to declare only once

const PORT = process.env.PORT;

const dataBase = process.env.DATABASE;

mongoose.connect(dataBase, {useUnifiedTopology : true,
    useNewUrlParser : true}).then(() => {
    console.log ("Mongoose connection started")
}).catch((err)=> console.log("Mongoose connection refused", err))

app.use(
    cors({
      origin: ["https://atlas-tool.netlify.app"],
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    })
  );

  app.listen(PORT, () => {
    console.log('server running at port no.', PORT)
})


app.use(cookieParser());
app.use(express.json());

app.use(auth);
app.use(express.urlencoded({extended: true}));
app.use(calendarController)
app.use(task)

app.get('/',  (req, res)=> {
    res.send('home')
});
app.get('/dashboard',  (req, res)=> {
    res.send('dashboard')
});
app.get('/charts',  (req, res)=> {
    res.send('charts')
});
app.get('/logs',  (req, res)=> {
    res.send('logs')
});
app.get('/calendar', (req, res)=> {
    res.send('calendar')
});

app.get('/task', (req, res)=> {
    res.send("I'm task!")
});

app.get('/login', (req, res)=> {
    res.send("I am Login")
});
app.get('/register', (req, res)=> {
    res.send("I'm register!")
});

app.get('/logout', (req, res)=> {
    res.send("I'm logout!")
});


