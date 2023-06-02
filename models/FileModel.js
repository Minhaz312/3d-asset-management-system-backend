import mongoose from "mongoose";

const schema = new mongoose.Schema({
    file:String
})

const FileModel = mongoose.model("FileModel",schema)


export default FileModel