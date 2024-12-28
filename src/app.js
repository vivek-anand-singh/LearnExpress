const express = require('express');
const connectDB =  require('./config/database');
const app  = express();
const {validateSignUpData} = require('./utils/validation');
const User = require('./models/user');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const {userAuth} = require('./middlewares/auth');
 
app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req,res) =>{
    // Validation of the data
    try{
        validateSignUpData(req);
        const {firstName, lastName,email, password }= req.body;
    
        // Encryting the password
        const passwordHash = await bcrypt.hash(password, 10);

        // Creating the instance of the user
        const user = new User({
            firstName,
            lastName,
            email,
            password: passwordHash
        });
        await user.save();
        res.send("User saved successfully");
    } catch(e){
        return res.status(400).send(e.message);
    }
})

app.post("/login", async (req,res) =>{
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email:email});
        if(!user){
            return res.status(404).send("Invalid Credentials");
        }
        const isPasswordValid = await user.validatePassword(password);

        if(!isPasswordValid){
            return res.status(404).send("Invalid Credentials");
        }
        //create JWT token
        const token = await user.getJWT();

        //Add token to the cookie and send the response back to the user
        res.cookie("token", token)

        res.send("User logged in successfully");
    } catch(e){
        return res.status(400).send(e.message);
    }
})

app.get("/profile",userAuth, async (req,res) =>{
    try{
        const user = req.user;
        res.send(user);
    } catch(e){
        return res.status(401).send(e.message);
    }
})

app.get("/sendConnectionRequest",userAuth , async (req,res) =>{
    const user = req.user;
    console.log("Connection Request Sent");
    res.send(user.firstName + " sent a connection request");
})

connectDB().then(() => {
    console.log('Connected to MongoDB');
    app.listen(3000, () => {
        console.log('Server is running on port http://localhost:3000');
    })}
).catch((err) => {
    console.log(err); 
});
