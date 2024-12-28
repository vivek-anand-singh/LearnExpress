const express = require("express");
const profileRouter = express.Router();
const {validateEditProfileData,validatePassword} = require('../utils/validation');
const {userAuth} = require('../middlewares/auth');
const User = require('../models/user')
const bcrypt = require('bcrypt')

profileRouter.get("/profile/view",userAuth, async (req,res) =>{
    try{
        const user = req.user;
        res.send(user);
    } catch(e){
        return res.status(401).send(e.message);
    }
})

profileRouter.patch("/profile/edit", userAuth, async (req,res) =>{
    try{
        if(!validateEditProfileData(req)){
            throw new Error("Invalid Edit Request");
        }
        const user = req.user;
        Object.keys(req.body).forEach(key =>{
            user[key] = req.body[key];
        })
        await user.save();
        res.json({
            message: "Profile updated successfully",
            user : user
        });
    } catch (e){
        return res.status(400).send(e.message);
    }
})

profileRouter.patch("/profile/password", async (req,res) => {
    try {
        const email = req.body.email;
        const user = await User.findOne({email:email});
        if(!user) {
            throw new Error("No user found");
        }
        if(!validatePassword(req)){
            throw new Error("Failed in validating the password");
        }
        const password = await bcrypt.hash(req.body.password,10);
        user["password"] = password
        res.json({
            message: "Updated the password succesfully",
            user: user
        })
    } catch (e){
        res.status(400).send(e.message);
    }
})

module.exports = {profileRouter};