const express = require('express');
const {userAuth} = require('../middlewares/auth');
const requestRouter = express.Router();
const User = require('../models/user');
const ConnectionRequest = require('../models/connectionRequest');

requestRouter.post("/request/sent/:status/:toUserId",userAuth , async (req,res) =>{
    try{
        const fromUserId = req.user.id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["ignored", "interested"];

        if(!allowedStatus.includes(status)){
            throw new Error("Invalid status");
        }

        const toUser = await User.findById(toUserId);

        if(!toUser){
            throw new Error("To user does not exist");
        }

        //If there is existing request 
        const existingRequest = await ConnectionRequest.findOne({
            $or: [
                {fromUserId:fromUserId , toUserId: toUserId},
                {fromUserId: toUserId, toUserId: fromUserId}
            ]
        });

        if(existingRequest){
            throw new Error("Connection request already exists");
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });

        const data = await connectionRequest.save();
        res.json({
            message: req.user.firstName + " sent a " + status + " request to " + toUser.firstName,
            data
        });

    } catch (e){
        return res.status(400).send(e.message);
    }
})

requestRouter.post("/request/review/:status/:requestId",userAuth , async (req,res) =>{
    try{
        const loggedInUser = req.user;
        const {status, requestId} = req.params;

        const allowedStatus = ['accepted','rejected'];
        if(!allowedStatus.includes(status)){
            throw new Error("Status not allowed")
        }

        // res.send({
        //     fromUserId:requestId,
        //     toUserId:loggedInUser.id,
        //     status:"interested"
        // });

        const connectionRequest = await ConnectionRequest.findOne({
            fromUserId:requestId,
            toUserId:loggedInUser.id,
            status:"interested"
        });

        if(!connectionRequest){
            throw new Error("Connection Request Not Found");
        }

        connectionRequest.status = status;
        const data = await connectionRequest.save();
        res.json({
            message: "Connection request " + status,
            data
        });
    } catch (e){
        return res.status(400).send(e.message);
    }
})



module.exports = {requestRouter};

