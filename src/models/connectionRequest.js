const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId : {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User", // reference to the user model
        required: true
    },
    toUserId :{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status : {
        type: String,
        enum: {
            values : ['ignored', 'interested', 'accepted', 'rejected'],
            message: '{VALUE} is not a valid status'
        },
        default: 'pending',
        required: true
    }
}, {
    timestamps: true
});

connectionRequestSchema.index({fromUserId: 1, toUserId: 1}, {unique: true});

connectionRequestSchema.pre("save", function(next){
    const connectionRequest = this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("You can't send request to yourself");
    }
    next();
})

const ConnectionRequestModel = mongoose.model('ConnectionRequest', connectionRequestSchema);

module.exports = ConnectionRequestModel;