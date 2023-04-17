const { BlogModel} = require("../models/blog.model");
const { Router } = require("express");
const {auth} = require("../middlewares/auth");

const blogRouter= Router();

blogRouter.get("/all", async (req,res)=>{
    try{
        const blog = await BlogModel.find();
        res.send({ blog })
    }
    catch(error){
        res.status(500).send({msg:error.message});
    }
});

blogRouter.post("/addBlog",  async(req,res) =>{
    try{
        const blog = new BlogModel(req.body);
        await blog.save();
      
    }catch(error){
        res.status(500).send({msg:error.message});
    }
}
);

blogRouter.post("/deleteBlog/:blogId",   auth('moderator'),async (req,res) =>{
    try{
        const { blogid} = req.params;

    const blog = await BlogModel.find({blogid});
    if(blog.moderatorid == req.body.userId){
        await BlogModel.deleteMany({blogid});
        res.send({msg: "blog deleted"})
    }
    else {
        res.status(403).send({msg: "not autherized"});
    }
    }
    catch(error){
        res.status(500).send({msg:error.message});
    }
});

module.exports = { blogRouter}