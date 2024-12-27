const express = require('express');
const connectDB =  require('./config/database');
const app  = express();
const {validateSignUpData} = require('./utils/validation');
const User = require('./models/user');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
 
app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req,res) =>{
    // Validation of the data
    try{
        validateSignUpData(req);
        const {firstName, lastName,email, password }= req.body;
    
        // Encryting the password
        const passwordHash = await bcrypt.hash(password, 10);

        // Creating the instance of the user
        const user = new User({
            firstName,
            lastName,
            email,
            password: passwordHash
        });
        await user.save();
        res.send("User saved successfully");
    } catch(e){
        return res.status(400).send(e.message);
    }
})

app.post("/login", async (req,res) =>{
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email:email});
        if(!user){
            return res.status(404).send("Invalid Credentials");
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid){
            return res.status(404).send("Invalid Credentials");
        }
        //create JWT token
        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET);

        //Add token to the cookie and send the response back to the user
        res.cookie("token", token)

        res.send("User logged in successfully");
    } catch(e){
        return res.status(400).send(e.message);
    }
})

app.get("/profile", async (req,res) =>{
    try{
        const {token} = req.cookies;

        if(!token){
            throw new Error("Unauthenticated");
        }
        
        const decodedMessage = jwt.verify(token, process.env.JWT_SECRET);
        //Validate the token
        const {id} = decodedMessage;
        const user = await User.findById(id);
        if(!user){
            throw new Error("User not found");
        }
        res.send(user);
    } catch(e){
        return res.status(401).send(e.message);
    }
})

//get user by email
app.get("/user", async (req,res)=>{
    const email = req.body.email;

    try{
        const users = await User.findOne({email:email})
        if(!users){
            return res.status(404).send("User not found");
        }  
        res.send(users);   
    } catch(e){
        res.status(400).send(e.message);
    }

})

// get all users
app.get("/feed", async (req,res) =>{
    try{
        const users = await User.find({});
        res.send(users);
    } catch(e){
        res.status(400).send(e.message);
    }
})

// delete the user by ID
app.delete("/users", async (req,res) =>{
    try{
        const user = await User.findByIdAndDelete(req.body.id);
        if(!user){
            return res.status(404).send("User not found");
        }
        res.send(user);
    } catch(e){
        res.status(500).send(e.message);
    }
});


//update the user by ID
app.patch("/users", async (req,res) =>{
    try{
        const user = await User.findByIdAndUpdate(req.body.id, req.body);
        res.send("Succesfully updated the user");
    } catch(e){
        res.status(400).send(e.message);
    }
}
) 

app.patch("/usersemail", async (req,res) =>{
    try{
        const user = await User.findOneAndUpdate({email:req.body.email}, req.body);
        res.send("Succesfully updated the user");
    } catch(e){
        res.status(400).send(e.message);
    }
});


connectDB().then(() => {
    console.log('Connected to MongoDB');
    app.listen(3000, () => {
        console.log('Server is running on port http://localhost:3000');
    })}
).catch((err) => {
    console.log(err); 
});
