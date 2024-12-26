const express = require('express');
const connectDB =  require('./config/database');
const app  = express();
const User = require('./models/user');

app.use(express.json());

app.post("/signup", async (req,res) =>{
    const user = new User(req.body);
    try{
        await user.save();
        res.send("User saved successfully");
    }catch(e){
        res.status(400).send("Error saving the user"+e.message);
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
