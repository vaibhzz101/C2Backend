const express = require('express');

const {connection} = require("./config/db");
require('dotenv').config();
const { authentication } = require("./middlewares/authentication")

const {userRouter} = require("./routes/user.routes")
const {blogRouter} = require("./routes/blog.routes")


const port = process.env.port || 9090;

const app = express();
app.use(express.json());

app.get('/', (req,res)=>{
    res.send("Welcome to blogApp")
})

app.use("/user", userRouter);

app.use(authentication);

app.use("/blog", blogRouter );

app.listen(port, async() => {
    try{
await connection;
console.log("connected to DB and running on"+ port)
    }
    catch(err){
       console.log(err)
    }
})
