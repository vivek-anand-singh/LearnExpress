const validator = require("validator");

const validateSignUpData = (req) => {
    const {firstName, lastName, email, password} = req.body;
     
    if(!firstName || !lastName || !email || !password){
        throw new Error("All fields are required");
    }

    else if(!validator.isEmail(email)){
        throw new Error("Invalid Email Address");
    }

    else if(!validator.isStrongPassword(password)){
        throw new Error("Enter a Strong Password");
    }
}

module.exports = {validateSignUpData};