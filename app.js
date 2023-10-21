import dotenv from 'dotenv'
import express from 'express'
import auth from './router/authentication.js'
import cors from 'cors';
import calendarController from './calendar/calendarController.js'
import task from './Task/task.js';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

const app = express();

dotenv.config({path : './.env'}); 

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

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.use(auth);
app.use(calendarController)
app.use(task)




