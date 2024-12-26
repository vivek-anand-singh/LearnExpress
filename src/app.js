const express = require('express');
const connectDB =  require('./config/database');
const app  = express();
const User = require('./models/user');

app.post("/signup", async (req,res) =>{
    const userObj = {
        firstName: "Akshay",
        lastName: "Saini",
        email: "akshay@gmail.com",
        password: "12",
    }
    // Creating a new instance of the user model
    const user = new User(userObj);

    try{
        await user.save(); // Saving the user to the database
        res.send("User Created");
    } catch(err){
        res.status(400).send("Error while creating the user", err.message); 
    }
})

connectDB().then(() => {
    console.log('Connected to MongoDB');
    app.listen(3000, () => {
        console.log('Server is running on port http://localhost:3000');
    })}
).catch((err) => {
    console.log(err); 
});
