import dotenv from 'dotenv'   //1
import express from 'express' //2
import cors from 'cors'

const chat = express();    //3

dotenv.config({path : '../.env'});  //4

chat.use(express.json());  //5

const PORT = 7000; //optional 6

chat.use(cors({ origin: true }));

chat.get("/", async (req, res) => {
    res.send('I am Live! Use Chat')
});

chat.post("/authenticate", async (req, res) => {
  const { username } = req.body;
  try {
    const userData = await axios.put(
      "https://api.chatengine.io/users/",
      { username: username, secret: username, first_name: username },
      { headers: { "Private-Key": "25c82dd7-3973-4023-8359-6c69e1ad006c" } }
    );
    return res.status(userData.status).json(userData.data);
  } catch (err) {
    return res.status(err.response.status).json(err.response.data);
  }
});



chat.listen(PORT, ()=>{
    console.log('Chat is working on port', PORT)
});