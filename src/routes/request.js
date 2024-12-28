const express = require('express');
const {userAuth} = require('../middlewares/auth');
const requestRouter = express.Router();

requestRouter.get("/sendConnectionRequest",userAuth , async (req,res) =>{
    const user = req.user;
    console.log("Connection Request Sent");
    res.send(user.firstName + " sent a connection request");
})

module.exports = {requestRouter};

