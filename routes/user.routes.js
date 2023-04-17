const { Router} = require("express");
const BlacklistModel = require("../models/blacklist.model")

const {User} = require("../models/user.model");


const jwt = require("jsonwebtoken");

const bcrypt = require('bcrypt');

const userRouter = Router();

userRouter.post("/signup", async(req,res)=>{
    try{
      const { name, email, password,role} = req.body;
      const isUserPresent = await User.findOne({email});
      if(isUserPresent){
        return res.send("user already present.. please login")
      };

      const hash = await bcrypt.hashSync(password,6);
      const newUser = new User({name, email, password: hash, role});
      await newUser.save();
      res.send("sign-up success!!");
     
    } 
    catch(error){
  res.send(error.message)
    }

});

userRouter.post("/login", async(req,res)=>{
    try{
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(401).send({msg: "incorrect email"})
        }
        const isUserPresent = await User.findOne({email});

        if(!isUserPresent){
            return res.send("user is not present.. please signup !")
        };
        const isPasswordCorrect = await bcrypt.compareSync(
            password, isUserPresent.password
        );
        if(!isPasswordCorrect){
            return res.send("wrong password")
        };

        const token = await jwt.sign(
            {email, userId: isUserPresent._id, role: isUserPresent.role},
            process.env.JWT_SECRET_KEY,
            {expiresIn: "1m"}
        );
    const refreshToken = await jwt.sign(
        {email, userId: isUserPresent._id },
        process.env.JWT_REFRESH_KEY,
        {expiresIn: "3m"}
    );

    res.send({msg: "login success !! ", token, refreshToken });

    } catch(error){
        res.send(error.message)
    }
    
});

userRouter.post("/getToken", async(req,res)=>{
    const refreshToken = req.headers.authorization.split(" ")[1];

    if(!refreshToken){
        return res.send({msg: "please login !!"});   
    };
    jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, decoded)=>{
        if(err){
            return res.send({msg: "please login again !"});
        }
        else{
            const token = jwt.sign(
                { userId: decoded.userId, email: decoded.email},
                process.env.JWT_SECRET_KEY,
                {expiresIn: "1m"}
            );
            res.send({msg: "log-in successful", token})
        }
    })

    
});

userRouter.post("/logout", async(req,res)=>{

    try{
        const token = req.headers.authorization.split(" ")[1];

        const blacklistedToken = new BlacklistModel({token});
        await blacklistedToken.save();

        res.status(200).send("logged out successfully");
    } 
    catch(error){
        console.log(error);
        res.status(500).send("server error")
    }
});

module.exports = { userRouter};