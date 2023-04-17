const jwt = require("jsonwebtoken");
const { BlacklistModel } = require("../models/blacklist.model");
const {User }= require("../models/user.model")
require('dotenv').config();

const authentication = async (req,res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];

        const isBlacklisted = await BlacklistModel.findOne({token});
        if(isBlacklisted){
            return res.status(401).send("token is Blacklisted");

        }
        const decoded = jwt.verify(token, JWT_SECRET_KEY)
        const { userID } = decoded;

        const user = await User.findById(userId);
        if(!user){
            return res.status(401).json({message: "unauthorised"});

        }
        req.user = user;
        next()
    } 
    catch(error){
        if(error.name === 'TokenExpiredError'){
            return res.status(401).send("Access token expired")
        }
        return res.status(401).json({message: "unauthorised"})

    }
}
module.exports = { authentication}