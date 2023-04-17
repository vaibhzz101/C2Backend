const mongoose = require("mongoose");

const BlogSchema = mongoose.Schema({
    title: String,
    body: String,
    
})

const BlogModel = mongoose.model("blog", BlogSchema);

module.exports = { BlogModel}