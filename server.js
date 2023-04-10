const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')
const userRouter = require("./Router/userRouter");
require('dotenv').config();
const mongoose = require('mongoose');

const {PORT, MONGODB_URL} = process.env;

mongoose.connect(MONGODB_URL)
.then(()=>{
    console.log("DB is connected");
}).catch((err)=>{
  console.log(err);
})


app.use(cookieParser());
app.use(express.json());

app.use("/api", userRouter );
app.use((err,req,res,next)=>{
    const status  = err.status || 500;
    const message = err.message || "server error";
    return res.status(status).json({
        status,message
    })
})

app.listen(process.env.PORT, ()=>{
    console.log(`server runs on ${PORT}`);
})