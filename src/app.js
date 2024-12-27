const express = require('express');
const connectDB =  require('./config/database');
const app  = express();
const User = require('./models/user');

app.use(express.json());

app.post("/signup", async (req,res) =>{
    const user = new User(req.body);
    try{
        await user.save();
        res.send("User saved successfully");
    }catch(e){
        res.status(400).send("Error saving the user"+e.message);
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
