const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
    },
    email:{
        type:String,
        required:true,
        lowecase:true,
        unique:true,    
        trim:true,
    },
    password:{
        type:String,
        required:true,
    },
    age:{
        type: Number,
        min:18,
    },
    gender:{
        type: String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                return new Error("Gender is invalid"); 
            }
        }
    },
    photourl:{
        type: String,
        default: ".com"
    },
    about:{
        type: String,
        default: "Hey there! I am using Social Media App",
    },
    skills:{
        type: [String],
    }
},
{
    timestamps:true,
});  

module.exports = mongoose.model('User', userSchema);