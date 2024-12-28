const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userAuth = async (req,res,next) =>{
    try{
        // Read the token form the req cookies 
        const {token} = req.cookies;    
        if(!token){
            throw new Error("No token found");
        }
        const decodedMessage = jwt.verify(token, process.env.JWT_SECRET);
        const {id} = decodedMessage; 
        const user = await User.findById(id);
        if(!user){
            throw new Error("User not found");
        }
        req.user = user;
        next();
    } catch (err) {
        return res.status(401).send(err.message);
    }
}

module.exports = {userAuth}; 