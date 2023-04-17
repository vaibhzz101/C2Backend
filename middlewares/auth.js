const auth = (role) =>  async (req,res,next) =>{
const userRole = req.body.role;
if(role.includes(userRole)){
    next();
}else{
    res.status(403).send({msg:"not authporised"})
}

};
module.exports= {auth}