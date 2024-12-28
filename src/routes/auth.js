const express = require('express');
const {validateSignUpData} = require('../utils/validation');
const authRouter = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

authRouter.post("/signup", async (req,res) =>{
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


authRouter.post("/login", async (req,res) =>{
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


module.exports = {authRouter}; 