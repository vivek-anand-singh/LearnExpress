const express = require('express');
const userRouter = express.Router();
const {userAuth} = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');

userRouter.get("/user/requests/received",userAuth, async (req,res) =>{
    try{
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({toUserId: loggedInUser.id, status:'interested'}).
        populate('fromUserId',['firstName','lastName','photoUrl', 'age', 'about']);
        res.json({
            message: "Connection requests",
            connectionRequests
        })
    } catch (e){
        return res.status(400).send(e.message);
    }
});


module.exports = {userRouter};