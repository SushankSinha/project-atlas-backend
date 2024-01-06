import dotenv from 'dotenv'
import express from 'express'
import auth from './router/authentication.js'
import cors from 'cors';
import calendarController from './calendar/calendarController.js'
import task from './Task/task.js';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
// import https from 'https';
// import http from 'http';
// import {Server, Socket} from 'socket.io'

const app = express();

// const server = http.createServer(app);
// const io = new Server(server, {
//   cors : {
//     origin : "http://localhost : 3000",
//     methods : ["GET", "POST"]
//   }
// });

app.use(cookieParser());

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

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(auth);
app.use(calendarController)
app.use(task);

// io.on("connection", (socket)=>{
  
//   socket.emit("me", socket.id);

//   socket.on("disconnect", ()=>{
//     socket.broadcast.emit("callEnded")
//   })

//   socket.on("callUser", (data)=>{
//     io.to(data.userToCall).emit("callUser", {signal : data.signalData, from : data.from, name : data.name})
//   })

// })

app.listen(PORT, () => {
  console.log('server running at port no.', PORT);
});
