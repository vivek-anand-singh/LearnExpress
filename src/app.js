const express = require('express');
const connectDB =  require('./config/database');
const app  = express();
const {validateSignUpData} = require('./utils/validation');
const User = require('./models/user');
const bcrypt = require('bcrypt');
 
app.use(express.json());

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
