import mongoose from "mongoose";

const typeSchema = new mongoose.Schema({
    name: {type: String, unique: true, required: true},
    createdAt: {type: Date, default: Date.now()},
    updatedAt: {type: Date, default: Date.now()},
})

const TypeModel = mongoose.model("Type",typeSchema, "types");


export default TypeModel;