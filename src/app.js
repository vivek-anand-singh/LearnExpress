const express = require('express');

const app  = express();

app.use("/",(err,req,res,next) =>{
    if(err){
        res.status(500).send("Something went wrong");   
    }
    else{
        next();
    }
});

const {adminAuth, userAuth} = require('./middlewares/auth');


app.use("/admin/getAllData", (req,res) =>{
    console.log("Sent the complete data")
    res.send("Sent the complete data");
})

app.use("/admin",adminAuth);

app.use("/admin/deleteUser", (req,res) =>{
    console.log("Deleted the user");
    res.send("Deleted the user");x``
})


app.use("/user",(req,res) =>{
        console.log("Inside the second function");
        res.send("From the second function");
});

app.use("/user", (req,res,next) =>{
    console.log("Inside the first function");
    next();
});



app.listen(3000, ()=>{    
    console.log('http://localhost:3000');
});

 