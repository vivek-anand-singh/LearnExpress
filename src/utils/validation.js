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

const validateEditProfileData = (req) => {
    const allowedEditFields = ["firstName", "lastName", "email", "password", "photoUrl", "gender", "age", "about","skills" ];

    const isEditAllowed = Object.keys(req.body).every((field) => allowedEditFields.includes(field));
    return isEditAllowed;
} 

const validatePassword = (req) => {
    const password = req.body.password;
    console.log(password)
    if(!validator.isStrongPassword(password)){
        throw new Error("Enter a Strong Password");
    }

    return true;
}

module.exports = {validateSignUpData, validateEditProfileData,validatePassword};  