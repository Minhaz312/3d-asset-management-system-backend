import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {type: String, unique: true,maxLength:[30,"PLease enter name within 30 characters!"], required: true},
    mail:{type:String, unique:true,maxLength:[40,"PLease enter mail within 40 characters!"], require:true},
    password:{type:String, unique:true, require:true},
    approved:{type:Boolean, require:true, default:false},
    createdAt: {type: Date, default: Date.now()},
    updatedAt: {type: Date, default: Date.now()},
})

const UserModel = mongoose.model("User",userSchema);


export default UserModel;