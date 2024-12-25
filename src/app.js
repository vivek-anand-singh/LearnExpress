const express = require('express');

const app  = express();

app.get("/user", (req,res) =>{
    res.send({name: 'John', age: 30});
})

app.post("/user", (req,res) =>{
    res.send("Added the user")
})

app.delete("/user", (req,res) =>{
    res.send("Deleted the user")
})


app.listen(3000, ()=>{
    console.log('http://localhost:3000');
});

