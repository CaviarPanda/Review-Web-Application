// creating our first server localhost:8000 

const express = require("express");
const userRouter = require('./routes/user');

const app = express();

//convert data coming from front end to json fomrat instead of chunk
app.use(express.json());

app.use('/api/user',userRouter);

app.get("/about", (req,res)=> {
    res.send("<h1>About this website: review app</h1>");
});

app.listen(8000,() => {
    console.log("the port is listening 8000 port");
});