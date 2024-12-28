const express = require("express");
const profileRouter = express.Router();
const {validateEditProfileData} = require('../utils/validation');
const {userAuth} = require('../middlewares/auth');

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

module.exports = {profileRouter};