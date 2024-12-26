const adminAuth= (req,res,next) =>{
    console.log("Inside the adminAuth function"); 
    const random = Math.floor(Math.random() * 10) + 1;
    if(random > 5){
        next();
    }
    else{
        res.send("Not Authenticated");
    }
}

const userAuth= (req,res,next) =>{
    const random = Math.floor(Math.random() * 10) + 1;
    if(random > 5){
        console.log("User Authenticated");
        next();
    }
    else{
        res.send("Not Authenticated");
    }
}

module.exports = {adminAuth, userAuth};