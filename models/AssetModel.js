import mongoose from "mongoose";

const AssetSchema = new mongoose.Schema({
    complex: {type: Number,min:[1,"Complex is allowed minimum 1"],max:[4,"Complex is allowed maximum 4"],required:true},
    numberAddr: {type:String},
    fileMeta: {
        fileId: {type:mongoose.SchemaTypes.ObjectId,required:true},
        fileNm: {type:String,required:true},
        fileNm2: {type:String},
        mapDiv:{type:String,default:""},
        origin:[Number],
        loc: {
            type:{ type: String, default:"Point" },
            coordinates: [Number]
        },
        altitude: {type: Number,required:true},
        orientation: {
            heading: {type: Number,required:true},
            pitch: {type: Number,required:true},
            roll: {type: Number,required:true}
        },
        scale: {type: Number,required:true},
        height: {type: Number,required:true},
    },
    userId:{type:mongoose.SchemaTypes.ObjectId,required:true},
    modelNm: [[{type: String,required:true}]],
    resolution:{type:Number,enum:{values:[256,512,1024,2048],message:"{VALUE} is not acceptable"},required:true},
    modelType: {type: String,required:true},
    unique:{type:Boolean,required:true},
    createId: String,
    createDt: {type: Date, default: Date.now()},
    createTs: String,
    updateId: String,
    updateDt: {type: Date, default: Date.now()},
    updateTs: String
})





const AssetModel = mongoose.model("models",AssetSchema);

export default AssetModel;