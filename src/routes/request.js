const express = require('express');
const {userAuth} = require('../middlewares/auth');
const requestRouter = express.Router();
const ConnectionRequest = require('../models/connectionRequest');

requestRouter.post("/request/sent/:status/:toUserId",userAuth , async (req,res) =>{
    try{
        const fromUserId = req.user.id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });

        const data = await connectionRequest.save();
        res.json({
            message: "Connection request sent successfully",
            data
        });

    } catch (e){
        return res.status(400).send(e.message);
    }
})

module.exports = {requestRouter};

