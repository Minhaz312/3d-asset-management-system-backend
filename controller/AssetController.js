import AssetModel from "../models/AssetModel.js"

import fs from 'fs'
import multer from 'multer';
import { checkModelExistInGridfs, deleteSingleModelFromGridfsByName, gridfsMultipleUploader, gridfsSingleUpdateUploader, gridfsSingleUploader } from "./ModelController.js";
import mongoose from "mongoose";
import UserModel from "../models/UserModel.js";
import ModelsFilesModel from "../models/ModelsFilesModel.js";


const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, '3d-models/')
    },
    filename: function(req,file,cb){
        cb(null,file.originalname);
    }
})

const registerWithGlbFile = (req,res) => {
    gridfsSingleUploader(req,res,err=> {
        if(err) {
            console.log('25 line: ',err)
            res.status(400).send({success:false,message:err})
        }else{
            try {
                const {
                    user,
                    address,
                    complexNumber,
                    latitude,
                    longitude,
                    altitude,
                    heading,
                    pitch,
                    roll,
                    height,
                    scale,
                    type,
                    resolution,
                    unique,
                    modelNames,
                    mapDiv,
                    origin,
                    filename2
                } = JSON.parse(req.body.data)
                

                if(user!=="" && complexNumber!=="" && latitude!=="" && longitude!=="" && altitude!=="" 
                && heading!=="" && pitch!=="" && roll!=="" && height!=="" && scale!=="" && type!=="" && modelNames!==""
                && address!==null && complexNumber!==null && (Number(complexNumber)>=1 || Number(complexNumber)<=5) 
                && latitude!==null && longitude!==null && altitude!==null && heading!==null && pitch!==null && roll!==null 
                && height!==null && scale!==null && type!==null && modelNames!==null && resolution!==null && resolution!=="" 
                && resolution!==null && (resolution==256 || resolution==512 || resolution==1024 || resolution==2048)){

                    let createdAt = new Date(Date.now()).toISOString()
                    let updatedAt = new Date(Date.now()).toISOString()

                    const ModelsFilesModel = mongoose.connection.db.collection("models.files")
                    const ModelsChunksModel = mongoose.connection.db.collection("models.chunks")

                    const uploadData = (uploadedFilename,fileId) => {  
                        let formatedType = type.charAt(0).toUpperCase()+type.slice(1);
                        const modelData = {
                                numberAddr: `${address}`,
                                complex: Number(complexNumber),
                                fileMeta: {
                                    fileId:fileId,
                                    fileNm: uploadedFilename,
                                    fileNm2: filename2?? "",                                   
                                    mapDiv : mapDiv?? "",
                                    origin :origin?? [],
                                    loc: {
                                        type: "Point",
                                        coordinates: [
                                            longitude,
                                            latitude
                                        ]
                                    },
                                    altitude: Number(altitude),
                                    orientation: {
                                        heading,
                                        pitch,
                                        roll
                                    },
                                    scale: Number(scale),
                                    height: Number(height)
                                },
                                userId:mongoose.Types.ObjectId(user), 
                                modelType: `${formatedType}`,
                                resolution:resolution,
                                modelNm: modelNames,
                                
                                unique:unique,
                                createId: "SYSTEM",
                                createDt: createdAt,
                                createTs: Date.now(),
                                updateId: "SYSTEM",
                                updateDt: updatedAt,
                                updateTs: Date.now(),
                            }
                        AssetModel.create(modelData).then(result=>{
                            res.status(200).send({success: true, message: 'Successfully registered'})
                        }).catch(error=>{
                            ModelsFilesModel.deleteOne({_id:fileId},(err)=>{
                                if(err){
                                    //res.status(400).send({success: false, message: Object.values(error.errors).map(val=>val.message)[0]})
                                    res.status(400).send({success: false, message: error.message})
                                }else{
                                ModelsChunksModel.deleteMany({files_id:fileId}).then(deleted=>{
                                    //res.status(400).send({success: false, message: Object.values(error.errors).map(val=>val.message)[0]})
                                    res.status(400).send({success: false, message: error.message})
                                }).catch(err=>{
                                    //res.status(400).send({success: false, message: Object.values(error.errors).map(val=>val.message)[0]})
                                    res.status(400).send({success: false, message: error.message})
                                })
                            }
                        })
                        }) 
                    }
                    let fileName = req.file.filename;
                    let originalFilename = req.file.originalname
                    let fileNameArr = fileName.split("_");
                    let fileMainName = fileNameArr.slice(1).join("_")
                    ModelsFilesModel.findOne({"filename":fileMainName}).then(foundFile=>{
                        if(foundFile!=null){
                            const id = foundFile._id;
                            let fileId = mongoose.Types.ObjectId(req.file.id)
                            ModelsChunksModel.findOne({files_id:id}).then(binary=>{
                                ModelsChunksModel.findOne({files_id:fileId,data:binary.data}).then(currentFileBinary=>{
                                    if(currentFileBinary!=null){
                                        console.log('binary is matched')
                                        deleteSingleModelFromGridfsByName(mongoose.Types.ObjectId(req.file.id));
                                        res.status(200).send({success:false, message:"File already exist!"})
                                    }else{
                                        ModelsFilesModel.deleteOne({_id:mongoose.Types.ObjectId(id)},(err)=>{
                                                if(err){
                                                }else{
                                                ModelsChunksModel.deleteMany({files_id:mongoose.Types.ObjectId(id)}).then(deleted=>{
                                                    AssetModel.updateMany({"fileMeta.fileId":mongoose.Types.ObjectId(id)},{$set:{"fileMeta.fileId":fileId}}).then(updatedAsset=>{
                                                        ModelsFilesModel.updateOne({_id:fileId},{$set:{filename:fileNameArr.slice(1).join("_"),"metadata.fileId":fileId}}).then(updated=>{
                                                            console.log('binary is not matched')
                                                            let uploadedFilename = fileNameArr.slice(1).join("_");
                                                            uploadData(uploadedFilename,fileId)
                                                        })
                                                    }).catch(err=>{
                                                        ModelsFilesModel.updateOne({_id:fileId},{$set:{filename:fileNameArr.slice(1).join("_"),"metadata.fileId":fileId}}).then(updated=>{
                                                            console.log('binary is not matched')
                                                            let uploadedFilename = fileNameArr.slice(1).join("_");
                                                            uploadData(uploadedFilename,fileId)
                                                        })
                                                    })
                                                })
                                            }
                                        })
                                    }
                                })
                            })
                        }else{
                            console.log('no file found')
                            let uploadedFilename = fileNameArr.slice(1).join("_");
                            let fileId = mongoose.Types.ObjectId(req.file.id)
                            ModelsFilesModel.updateOne({_id:req.file.id},{$set:{filename:fileNameArr.slice(1).join("_"),"metadata.fileId":fileId}}).then(updatedFile=>{
                                uploadData(uploadedFilename,fileId)
                            }).catch(err=>{
                                ModelsFilesModel.deleteOne({_id:fileId},(err)=>{
                                        if(err){
                                        }else{
                                        ModelsChunksModel.deleteMany({files_id:files._id}).then(deleted=>{
                                            res.status(400).send({success:false,message:"failed to register!"})
                                        })
                                    }
                                })
                            })
                        }
                    }).catch(err=>{
                        console.log("err: ",err)
                    })
                }else{
                    console.log('data are undefined line 106')
                    res.status(400).send({success: false, message: 'All fields are required.'})
                }
            
            } catch (error) {
                console.log('err in  123: ',error)
                res.status(500).send({success: false, message: 'Failed to register'})
            }
        }
    })
}

const getModelsMetadata = async (req, res) =>
{
    try {

        let {modelType, resolution, from, to} = req.query;   

        console.log(`# params : ${modelType}/${resolution}/${from}/${to}`)

        const modelsMetadata = mongoose.connection.model("models.files", ModelsFilesModel)      

        let searchCond = {"metadata.modelType" : modelType, "metadata.resolution": Number(resolution)}

        const rangeCond = [Number(from), Number(to)];

        const result = await modelsMetadata.find(searchCond).skip(rangeCond[0]).limit(rangeCond[1]);
        const arrData = result.map(ele =>{
            ele.metadata.fileId = ele._id; 
            return ele.metadata;
        })
        
        res.status(200).send({success:true, data:arrData});
    }
    catch(ex)
    {
        res.status(500).send({success:false, data:ex.message}); 
    }

}

// Single model functinalities
const ResgisterSignleModel = async (req,res) => {
    try {
        const {
            address,
            complexNumber,
            filename,
            latitude,
            longitude,
            altitude,
            heading,
            pitch,
            roll,
            height,
            scale,
            type,
            resolution,
            unique,
            modelNames,
            mapDiv,
            origin,
            filename2
        } = req.body

        if(address!=="" && complexNumber!=="" && filename!=="" && latitude!=="" && longitude!=="" && altitude!=="" && heading!=="" && pitch!=="" && roll!=="" && height!=="" && scale!=="" && type!=="" && modelNames!=="" && address!==null && complexNumber!==null && filename!==null && latitude!==null && longitude!==null && altitude!==null && heading!==null && pitch!==null && roll!==null && height!==null && scale!==null && type!==null && modelNames!==null && resolution!==null && resolution!=="" && resolution!==null){

            const createDate = new Date(Date.now()).toISOString()

            const modelData = {
                numberAddr: `${address}`,
                complex: Number(complexNumber),
                fileMeta: {
                    fileId: req.file.id,
                    fileNm: filename,
                    fileNm2: filename2?? "",
                    mapDiv : mapDiv?? "",
                    origin :origin?? [],
                    loc: {
                        type: "Point",
                        coordinates: [
                            longitude,
                            latitude
                        ]
                    },
                    altitude: Number(altitude),
                    orientation: {
                        heading,
                        pitch,
                        roll
                    },
                    scale: Number(scale),
                    height: Number(height)
                },
                resolution:resolution,
                modelType: `${type}`,                
                modelNm: modelNames,
                unique:unique,
                createId: "SYSTEM",
                createDt: createDate,
                createTs: "1658306564",
                updateId: "SYSTEM",
                updateDt: createDate,
                updateTs: "1658306564",
                
            }

        
            const exist = await checkModelExistInGridfs(filename)
            if(exist){
                const result = await AssetModel.create(modelData);
                res.status(200).send({success: true, message: 'Successfully registered'})
            }else{
                res.status(500).send({success: false, message: 'Failed to register'})
                console.log("doesn't exist")
            }    
            
        }else{
            console.log('value is missing')
            res.status(500).send({success: false, message: 'Failed to register'})
        }
    
    } catch (error) {
        console.log(error)
        res.status(500).send({success: false, message: 'Failed to register'})
    }

}
const DeleteSingleModel = (req,res) => {
    try {
        const data = req.body.data;
    if(data!==undefined && data!==null) {
        const { id, filename, fileId } = data;


        const ObjectFileId = mongoose.Types.ObjectId(fileId.toString());
        AssetModel.countDocuments({"fileMeta.fileId":ObjectFileId}).then(result=>{
            if(Number(result)<=1){
                fs.unlink(`./3d-models/${filename}`,(err)=>{
        
                })
                
                deleteSingleModelFromGridfsByName(ObjectFileId)
            }
            AssetModel.findOneAndDelete({_id:id}).then(deletedItem=>{
                res.status(200).send({success: true, message: "Deleted successfully"})
            }).catch(error=>{
                console.log(error)
                res.status(500).send({success: false, message: "Failed to delete"})
            })
        }).catch(error=>{
            console.log(error)
        })
    }else{
        res.status(400).send({success: false, message: "Failed to delete"})
        console.log("error in 228")
    }
} catch (error) {
        console.log(error)
        res.status(500).send({success: false, message: "Failed to delete"})
    }
}

const updateModelWithFile = (req,res) => {
    gridfsSingleUpdateUploader(req,res,err=>{
        if(err){
            console.log("error in 216",err)
            res.status(500).send({success:false, message: "Failed to update"});
        }else{
            try {
                const {user,modelId,modelFileId,complexNumber,address,latitude,longitude,height,heading,pitch,
                       roll,modelNames,type,resolution,unique,altitude,scale,filename,previousFilename,mapDiv, origin} = JSON.parse(req.body.data[0]);
                
                
                if(user!=="" && address!=="" && complexNumber!=="" && filename!=="" && latitude!=="" && longitude!=="" && altitude!=="" && heading!=="" && pitch!=="" && roll!=="" && height!=="" && scale!=="" && type!=="" && modelNames!=="" && address!==null && complexNumber!==null && filename!==null && latitude!==null && longitude!==null && altitude!==null && heading!==null && pitch!==null && roll!==null && height!==null && scale!==null && type!==null && modelNames!==null && resolution!==null && resolution!=="" && resolution!==null && unique!=="" && unique!==null){
                    let createdAt = new Date(Date.now()).toISOString()
                    let updatedAt = new Date(Date.now()).toISOString()
                    const ModelsFilesModel = mongoose.connection.db.collection("models.files")
                    const ModelsChunksModel = mongoose.connection.db.collection("models.chunks")

                    const updateData = (uploadedFilename,originalFilename,modelsId,fileId) => {  
                        let formatedType = type.charAt(0).toUpperCase()+type.slice(1);
                        const modelData = {
                                numberAddr: `${address}`,
                                complex: Number(complexNumber),
                                fileMeta: {
                                    fileId:fileId,
                                    fileNm: uploadedFilename,
                                    mapDiv : mapDiv?? "",
                                    origin :origin?? [],
                                    loc: {
                                        type: "Point",
                                        coordinates: [
                                            longitude,
                                            latitude
                                        ]
                                    },
                                    altitude: Number(altitude),
                                    orientation: {
                                        heading,
                                        pitch,
                                        roll
                                    },
                                    scale: Number(scale),
                                    height: Number(height)
                                },
                                userId:mongoose.Types.ObjectId(user),
                                modelType: `${formatedType}`,                              
                                resolution:resolution,
                                modelNm: modelNames,
                                unique:unique,
                                createId: "SYSTEM",
                                createDt: createdAt,
                                createTs: Date.now(),
                                updateId: "SYSTEM",
                                updateDt: updatedAt,
                                updateTs: Date.now(),
                        }
                        let glbMetadata = {
                            "fileId":fileId,
                            "author" : user,
                            "blockName" : address,
                            "complex" : Number(complexNumber),
                            "height" : Number(height),
                            "modelType": formatedType,
                            "modelOwners": modelNames,
                            "orientation" : {
                            "heading" : Number(heading),
                            "pitch" : Number(pitch),
                            "roll" : Number(roll)
                            },
                            "position" : {
                                "longitude" : Number(longitude),
                                "latitude" : Number(latitude),
                                "altitude" : Number(altitude)
                            },
                            "filename":originalFilename,
                            "mapDiv" : mapDiv?? "",
                            "origin" : origin?? [],
                            "resolution" : Number(resolution),
                            "scale" : Number(scale),
                            "unique" : unique,
                            "use" : true,
                            "createdAt":new Date(Date.now()).toISOString(),
                            "updatedAt" : new Date(Date.now()).toISOString(),
                            "lastTime" : Date.now()
                        }
                        ModelsFilesModel.updateOne({_id:fileId},{$set:{"metadata":glbMetadata}}).then(updatedMetadata=>{
                            AssetModel.updateOne({_id:modelsId},modelData).then(result=>{
                                res.status(200).send({success: true, message: 'Successfully registered'})
                            }).catch(error=>{
                                ModelsFilesModel.deleteOne({_id:fileId},(err)=>{
                                    if(err){
                                        res.status(400).send({success: false, message: Object.values(error.errors).map(val=>val.message)[0]})
                                    }else{
                                       ModelsChunksModel.deleteMany({files_id:fileId}).then(deleted=>{
                                           res.status(400).send({success: false, message: Object.values(error.errors).map(val=>val.message)[0]})
                                    }).catch(err=>{
                                        res.status(400).send({success: false, message: Object.values(error.errors).map(val=>val.message)[0]})
                                    })
                                }
                            })
                            })
                        })
                    }
                    let fileName = req.file.filename;
                    let originalFilename = req.file.originalname
                    let fileNameArr = fileName.split("_");
                    let fileMainName = fileNameArr.slice(1).join("_")
                    let fileId = mongoose.Types.ObjectId(req.file.id)
                    // ModelsChunksModel.findOne({files_id:req.file.id},{data:1}).then(tmpFileBin=>{})
                    
                    ModelsFilesModel.findOne({"filename":fileMainName}).then(foundFile=>{
                        console.log('foundFile: ',foundFile)
                        if(foundFile!=null){
                            const id = foundFile._id;
                            ModelsChunksModel.findOne({files_id:id}).then(binary=>{
                                console.log("binary length: ",binary.files_id)
                                ModelsChunksModel.findOne({files_id:fileId,data:binary.data}).then(currentFileBinary=>{
                                    if(currentFileBinary!=null){
                                        console.log('binary is matched')
                                        deleteSingleModelFromGridfsByName(fileId);
                                        res.status(200).send({success:false, message:"File already exist!"})
                                    }else{
                                        ModelsFilesModel.findOne({_id:id},(err,files)=>{
                                            if(err){
                                            }
                                            if(files){
                                                ModelsFilesModel.deleteOne({_id:id},(err)=>{
                                                    if(err){
                                                    }else{
                                                       ModelsChunksModel.deleteMany({files_id:files._id}).then(deleted=>{
                                                        AssetModel.updateMany({"fileMeta.fileId":mongoose.Types.ObjectId(id)},{$set:{"fileMeta.fileId":fileId}}).then(updatedAsset=>{
                                                            ModelsFilesModel.updateOne({_id:fileId},{$set:{filename:fileNameArr.slice(1).join("_")}}).then(updated=>{
                                                                console.log('binary is not matched')
                                                                let uploadedFilename = fileNameArr.slice(1).join("_");
                                                                updateData(uploadedFilename,originalFilename,mongoose.Types.ObjectId(modelId),fileId)
                                                            })
                                                        })
                                                    })
                                                }
                                            })
                                        }else{
                                                AssetModel.updateMany({"fileMeta.fileId":mongoose.Types.ObjectId(id)},{$set:{"fileMeta.fileId":fileId}}).then(updatedAsset=>{
                                                    ModelsFilesModel.updateOne({_id:fileId},{$set:{filename:fileNameArr.slice(1).join("_")}}).then(updated=>{
                                                        console.log('binary is not matched')
                                                        let uploadedFilename = fileNameArr.slice(1).join("_");
                                                        updateData(uploadedFilename,originalFilename,mongoose.Types.ObjectId(modelId),fileId)
                                                    })
                                                })
                                            }
                                        })
                                    }
                                })
                            })
                        }else{
                            console.log('no file found')
                            ModelsFilesModel.updateOne({_id:req.file.id},{$set:{filename:fileNameArr.slice(1).join("_")}}).then(updated=>{
                                let uploadedFilename = fileNameArr.slice(1).join("_");
                                AssetModel.countDocuments({"fileMeta.fileId":mongoose.Types.ObjectId(modelFileId)}).exec().then(totalAvailable=>{
                                    console.log('prev file has ',totalAvailable, " model")
                                    if(totalAvailable==1){
                                        ModelsFilesModel.deleteOne({_id:mongoose.Types.ObjectId(modelFileId)},(err)=>{
                                            if(err){
                                            }else{
                                               ModelsChunksModel.deleteMany({files_id:mongoose.Types.ObjectId(modelFileId)}).then(result=>{
                                                    console.log('updating after deleting')
                                                   updateData(uploadedFilename,originalFilename,mongoose.Types.ObjectId(modelId),fileId)
                                               })
                                            }
                                        })
                                    }else{
                                        console.log('not deleted prev glb')
                                        updateData(uploadedFilename,originalFilename,mongoose.Types.ObjectId(modelId),fileId)
                                    }
                                })
                            })
                        }
                    }).catch(err=>{
                        console.log("err: ",err)
                    })
                }
            } catch (error) {
                res.status(500).send({success:false, message: "Failed to update"});
            }


        }
    })

}
const updateModelWithNoFile = (req,res) => {
    try {
        const {user, modelId,modelFileId,complexNumber,address,latitude,longitude,height,heading,pitch,roll,modelNames,
               type,resolution,unique,altitude,scale,filename,previousFilename,mapDiv, filename2, origin} = JSON.parse(JSON.stringify(req.body.data));
        
        if(mongoose.Types.ObjectId.isValid(user)){
            UserModel.find({_id:mongoose.Types.ObjectId(user)}).then(userFound=>{
                if(userFound.length>0){
                    const formatedFileId = mongoose.Types.ObjectId(modelFileId.toString())
                    let formatedFilename=null;
                    let filenameArr = filename.split("_");
                    let originalFilename = filenameArr.slice(1).join("_");

                    if(Number(resolution)==256){
                        formatedFilename = `R0_${originalFilename}`
                    }else if(Number(resolution)==512){
                        formatedFilename = `R1_${originalFilename}`
                    }else if(Number(resolution)==1024){
                        formatedFilename = `R2_${originalFilename}`
                    }else if(Number(resolution)==2048){
                        formatedFilename = `R3_${originalFilename}`
                    }else{
                        cb(null,false)
                    }
                    console.log('update body: ',req.body)
                    mongoose.connection.db.collection("models.files").findOne({_id:mongoose.Types.ObjectId(modelFileId)}).then(fileInfo=>{
                        if(fileInfo.filename==formatedFilename){
                            let glbMetadata = {
                                "fileId":mongoose.Types.ObjectId(modelFileId),
                                "author" : user,
                                "blockName" : address,
                                "complex" : Number(complexNumber),
                                "createdAt" : Date.now(),
                                "firstTime" : Date.now(),
                                "height" : Number(height),
                                "lastTime" : Date.now(),
                                "modelType": type,
                                "modelOwners": modelNames,
                                "orientation" : {
                                "heading" : Number(heading),
                                "pitch" : Number(pitch),
                                "roll" : Number(roll)
                                },
                                "position" : {
                                    "longitude" : Number(longitude),
                                    "latitude" : Number(latitude),
                                    "altitude" : Number(altitude)
                                },
                                "filename":filename.split("_").slice(1).join("_"),
                                "filename2": filename2?? "",
                                "mapDiv" : mapDiv?? "",
                                "origin" : origin?? [],
                                "resolution" : Number(resolution),
                                "scale" : Number(scale),
                                "unique" : true,
                                "updatedAt" :Date.now(),
                                "use" : true
                                }
                            mongoose.connection.db.collection("models.files").updateOne({_id:formatedFileId},{$set:{metadata:glbMetadata}})
                            const formatedData = {
                                numberAddr: address,
                                complex: complexNumber,
                                fileMeta: {
                                    fileId:formatedFileId,
                                    fileNm: formatedFilename,
                                    fileNm2: filename2?? "",
                                    mapDiv : mapDiv?? "",
                                    origin :origin?? [],
                                    loc: {
                                        type: "point",
                                        coordinates: [
                                            longitude,
                                            latitude
                                        ]
                                    },
                                    altitude: altitude,
                                    orientation: {
                                        heading: heading,
                                        pitch: pitch,
                                        roll: roll
                                    },
                                    scale: scale,
                                    height: height
                                },
                                userId:mongoose.Types.ObjectId(user),
                                resolution:resolution,
                                modelType: type,                                
                                modelNm: modelNames,
                                unique:unique,
                                updateId: "SYSTEM",
                                updateTs: Date.now(),
                                updateDt: new Date(Date.now()).toISOString()
                                }
                                AssetModel.updateOne({_id:modelId},{$set:formatedData}).then(result=>{
                                res.status(200).send({success:true, message: "Updated successfully"});
                            }).catch(error=>{
                                console.log('error from asset update 343: ',error)
                                res.status(400).send({success:false, message: "Failed to update"});
                            })
                        }else{
                            mongoose.connection.db.collection("models.files").findOne({filename:formatedFilename}).then(foundFile=>{
                                if(foundFile!=null){
                                    console.log('exist already file: ',foundFile)
                                    res.status(200).send({success:false, message: `File ${formatedFilename} already exist!`});
                                }else{
                                    let glbMetadata = {
                                        "author" : user,
                                        "blockName" : address,
                                        "complex" : Number(complexNumber),
                                        "createdAt" : Date.now(),
                                        "firstTime" : Date.now(),
                                        "height" : Number(height),
                                        "lastTime" : Date.now(),
                                        "modelType": type,
                                        "modelOwners": modelNames,
                                        "orientation" : {
                                        "heading" : Number(heading),
                                        "pitch" : Number(pitch),
                                        "roll" : Number(roll)
                                        },
                                        "position" : {
                                            "longitude" : Number(longitude),
                                            "latitude" : Number(latitude),
                                            "altitude" : Number(altitude)
                                        },
                                        "filename":filename.split("_").slice(1).join("_"),
                                        "filename2" : filename2?? "",
                                        "mapDiv" : mapDiv?? "",
                                        "origin" : origin?? [],
                                        "resolution" : Number(resolution),
                                        "scale" : Number(scale),
                                        "unique" : unique,
                                        "updatedAt" :Date.now(),
                                        "use" : true
                                        }
                                    mongoose.connection.db.collection("models.files").updateOne({_id:formatedFileId},{$set:{filename:formatedFilename,metadata:glbMetadata}})
                                    
                
                                    const formatedData = {
                                        numberAddr: address,
                                        complex: complexNumber,
                                        fileMeta: {
                                            fileId:formatedFileId,
                                            fileNm: formatedFilename,
                                            fileNm2: filename2?? "",
                                            mapDiv : mapDiv?? "",
                                            origin :origin?? [],
                                            loc: {
                                                type: "point",
                                                coordinates: [
                                                    longitude,
                                                    latitude
                                                ]
                                            },
                                            altitude: altitude,
                                            orientation: {
                                                heading: heading,
                                                pitch: pitch,
                                                roll: roll
                                            },
                                            scale: scale,
                                            height: height
                                        },
                                        userId:mongoose.Types.ObjectId(user),
                                        resolution:resolution,
                                        modelType: type,                                       
                                        modelNm: modelNames,
                                        unique:unique,
                                        updateId: "SYSTEM",
                                        updateTs: Date.now(),
                                        updateDt: new Date(Date.now()).toISOString()
                                        }
                                    AssetModel.updateOne({_id:modelId},formatedData).then(result=>{
                                        AssetModel.updateMany({"fileMeta.fileId":mongoose.Types.ObjectId(modelFileId)},{$set:{"fileMeta.fileNm":formatedFilename,resolution:Number(resolution)}}).then(updatedFlies=>{
                                            res.status(200).send({success:true, message: "Updated successfully"});
                                        })
                                    }).catch(error=>{
                                        console.log('error from asset update 343: ',error)
                                        res.status(400).send({success:false, message: "Failed to update"});
                                    })  
                                }
                            }).catch(err=>{
        
                            })
                        }
                    })
                }else{
                    res.status(400).send({success:false, message: "User not found"})
                }
            }).catch(err=>{
                res.status(400).send({success:false, message: "Failed to find user"})
            })
        }else{
            res.status(400).send({success:false, message: "User id is not valid"})
        }
        } catch (error) {
            console.log('error from asset update 346: ',error)
        res.status(500).send({success:false, message: "Failed to update"});
    }

}
const RetrieveSigleModelById = (req,res) => {
    const id = req.params.id;
    AssetModel.find({_id:id}).then(result=> {
        res.status(200).send({success:true,data:result});
    }).catch(error=> {
        res.status(200).send({success:false,data:[]});
    })
}


// Multiple Model functionalities

const RetrieveMultipleModel = (req,res) => {
    
    AssetModel.find().sort({_id:-1}).then(result=>{
        res.status(200).send({success:true, data:result});
    }).catch(error=>{
        res.status(200).send({success:false, data:[]});
    })
}
const RetrieveMultipleModelByType = (req,res) => {
    const type = req.params.type;
    const formatedType = type.charAt(0).toUpperCase()+type.slice(1)
    AssetModel.find({modelType:formatedType}).sort({_id:-1}).then(result=>{
        res.status(200).send({success:true, data:result});
    }).catch(error=>{
        res.status(200).send({success:false, data:[]});
    })
}


const ResgisterMultipleModel = (req,res) => {
    gridfsMultipleUploader(req,res,err=>{
        if(err){
            console.log("multiple register new function err line 629: ",err)
        }else{
            try {
                const data = JSON.parse(req.body.data);
                const uploadedFiles = req.files;
                const ModelsFilesModel = mongoose.connection.db.collection("models.files")
                const ModelsChunksModel = mongoose.connection.db.collection("models.chunks")
                let formatedModelList = []
                let fileAlreadyExist = []
                let itr = 0;
                uploadedFiles.map((uploadedFile)=>{
                    let fileName = uploadedFile.filename;
                    let originalFilename = uploadedFile.originalname
                    let fileNameArr = fileName.split("_");
                    let fileMainName = fileNameArr.slice(1).join("_")
                    ModelsFilesModel.findOne({"filename":fileMainName}).then(foundFile=>{
                        const modelInfo = data.filter(item=>{
                            if(item.fileNm==originalFilename){
                                return item;
                            }
                        })
                        const item = modelInfo[0]
                        if(foundFile!=null){
                            const id = foundFile._id;
                            let fileId = mongoose.Types.ObjectId(uploadedFile.id)
                            ModelsChunksModel.findOne({files_id:id}).then(binary=>{
                                ModelsChunksModel.findOne({$and:[{files_id:fileId},{data:binary.data}]}).then(currentFileBinary=>{
                                    if(currentFileBinary!=null){
                                        const dataFormated = {
                                            numberAddr: item.address,
                                            complex: item.complex,
                                            fileMeta: {
                                                fileId:fileId,
                                                fileNm: uploadedFile.originalname,
                                                fileNm2: item?.filename2 ?? "",
                                                mapDiv : item?.mapDiv ?? "",
                                                origin :item?.origin?? [],                                            
                                                loc: {
                                                    type: "point",
                                                    coordinates: [
                                                        item.longitude,
                                                        item.latitude
                                                    ]
                                                },
                                                altitude: item.altitude,
                                                orientation: {
                                                    heading: item.heading,
                                                    pitch: item.pitch,
                                                    roll: item.roll
                                                },
                                                scale: Number(item.scale),
                                                height: item.height
                                            },
                                            userId:mongoose.Types.ObjectId(item.user),
                                            resolution: item.resulationList,
                                            modelType: item.type.charAt(0).toUpperCase()+item.type.slice(1),                                            
                                            modelNm: item.modelNm,
                                            unique:item.unique,
                                            createDt: new Date(Date.now()).toISOString(),
                                            updateDt: new Date(Date.now()).toISOString(),
                                            createId: "SYSTEM",
                                            createTs: Date.now(),
                                            updateId: "SYSTEM",
                                            updateTs: Date.now()
                                        }
                                        fileAlreadyExist.push(dataFormated)
                                        ModelsFilesModel.findOne({_id:fileId},(err,files)=>{
                                            if(err){
                                            }
                                            if(files){
                                                ModelsFilesModel.deleteOne({_id:fileId},(err)=>{
                                                    if(err){
                                                    }else{
                                                       ModelsChunksModel.deleteMany({files_id:files._id}).then(deleted=>{
                                                        itr++;
                                                        console.log('binary is matched',itr)
                                                        if((itr)==uploadedFiles.length){
                                                            AssetModel.insertMany(formatedModelList).then(finalCreation=>{
                                                                res.status(200).send({success:false,existFile:fileAlreadyExist, message: "File already Exist"})
                                                            }).catch(err=>{
                                                                let deletedCount = 0;
                                                                formatedModelList.map((item,i)=>{
                                                                    ModelsFilesModel.deleteOne({_id:item.fileMeta.fileId},(err)=>{
                                                                        if(err){
                                                                            res.status(400).send({success:false,existFile:[], message: "Mass registration failed!"})
                                                                        }else{
                                                                           ModelsChunksModel.deleteMany({files_id:item.fileMeta.fileId}).then(deleted=>{
                                                                            deletedCount++
                                                                            if(i+1==deletedCount){
                                                                                res.status(400).send({success:false,existFile:[], message: "Mass registration failed!"})
                                                                            }
                                                                        })
                                                                    }
                                                                })
                                                                })
                                                            })
                                                            
                                                        }
                                                       })
                                                    }
                                                })
                                            }else{
                                            }
                                        })
                                    }else{
                                        ModelsFilesModel.updateOne({_id:fileId},{$set:{filename:fileNameArr.slice(1).join("_"),"metadata.fileId":fileId}}).then(updated=>{
                                            let uploadedFilename = fileNameArr.slice(1).join("_");
                                            const dataFormated = {
                                                numberAddr: item.address,
                                                complex: item.complex,
                                                fileMeta: {
                                                    fileId:fileId,
                                                    fileNm: uploadedFilename,
                                                    fileNm2: item?.filename2 ?? "", 
                                                    mapDiv : item?.mapDiv ?? "",
                                                    origin : item?.origin?? [], 
                                                    loc: {
                                                        type: "point",
                                                        coordinates: [
                                                            item.longitude,
                                                            item.latitude
                                                        ]
                                                    },
                                                    altitude: item.altitude,
                                                    orientation: {
                                                        heading: item.heading,
                                                        pitch: item.pitch,
                                                        roll: item.roll
                                                    },
                                                    scale: Number(item.scale),
                                                    height: item.height
                                                },
                                                userId:mongoose.Types.ObjectId(item.user),
                                                resolution: item.resulationList,
                                                modelType: item.type.charAt(0).toUpperCase()+item.type.slice(1),                                                
                                                modelNm: item.modelNm,
                                                unique:item.unique,
                                                createDt: new Date(Date.now()).toISOString(),
                                                updateDt: new Date(Date.now()).toISOString(),
                                                createId: "SYSTEM",
                                                createTs: Date.now(),
                                                updateId: "SYSTEM",
                                                updateTs: Date.now()
                                            }
                                            formatedModelList.push(dataFormated)
                                            itr++;
                                            console.log('binary is matched',itr)
                                            if((itr)==uploadedFiles.length){
                                                AssetModel.insertMany(formatedModelList).then(finalCreation=>{
                                                    res.status(200).send({success:true,existFile:fileAlreadyExist, message: "Mass registration completed"})
                                                }).catch(err=>{
                                                    let deletedCount = 0;
                                                    formatedModelList.map((item,i)=>{
                                                        ModelsFilesModel.deleteOne({_id:item.fileMeta.fileId},(err)=>{
                                                            if(err){
                                                                res.status(400).send({success:false,existFile:[], message: "Mass registration failed!"})
                                                            }else{
                                                                ModelsChunksModel.deleteMany({files_id:item.fileMeta.fileId}).then(deleted=>{
                                                                deletedCount++
                                                                if(i+1==deletedCount){
                                                                    res.status(400).send({success:false,existFile:[], message: "Mass registration failed!"})
                                                                }
                                                            })
                                                        }
                                                    })
                                                    })
                                                })
                                            }
                                        })
                                    }
                                })
                            })
                        }else{
                            
                            let uploadedFilename = fileNameArr.slice(1).join("_");
                            let fileId = mongoose.Types.ObjectId(uploadedFile.id)
                            ModelsFilesModel.updateOne({_id:uploadedFile.id},{$set:{filename:fileNameArr.slice(1).join("_"),"metadata.fileId":fileId}}).then(updated=>{
                                const dataFormated = {
                                    numberAddr: item.address,
                                    complex: item.complex,
                                    fileMeta: {
                                        fileId:fileId,
                                        fileNm: uploadedFilename,
                                        fileNm2: item?.filename2 ?? "", 
                                        mapDiv : item?.mapDiv ?? "",
                                        origin :item?.origin?? [], 
                                        loc: {
                                            type: "point",
                                            coordinates: [
                                                item.longitude,
                                                item.latitude
                                            ]
                                        },
                                        altitude: item.altitude,
                                        orientation: {
                                            heading: item.heading,
                                            pitch: item.pitch,
                                            roll: item.roll
                                        },
                                        scale: Number(item.scale),
                                        height: item.height
                                    },
                                    userId:mongoose.Types.ObjectId(item.user),
                                    resolution: item.resulationList,
                                    modelType: item.type.charAt(0).toUpperCase()+item.type.slice(1),                                     
                                    modelNm: item.modelNm,
                                    unique:item.unique,
                                    createDt: new Date(Date.now()).toISOString(),
                                    updateDt: new Date(Date.now()).toISOString(),
                                    createId: "SYSTEM",
                                    createTs: Date.now(),
                                    updateId: "SYSTEM",
                                    updateTs: Date.now()
                                }
                                formatedModelList.push(dataFormated)
                                itr++;
                                if((itr)==uploadedFiles.length){
                                    AssetModel.insertMany(formatedModelList).then(finalCreation=>{
                                        res.status(200).send({success:true,existFile:fileAlreadyExist, message: "Mass registration completed"})
                                    }).catch(err=>{
                                        let deletedCount = 0;
                                        formatedModelList.map((item,i)=>{
                                            ModelsFilesModel.deleteOne({_id:item.fileMeta.fileId},(err)=>{
                                                if(err){
                                                    res.status(400).send({success:false,existFile:[], message: "Mass registration failed!"})
                                                }else{
                                                    ModelsChunksModel.deleteMany({files_id:item.fileMeta.fileId}).then(deleted=>{
                                                    deletedCount++
                                                    if(i+1==deletedCount){
                                                        res.status(400).send({success:false,existFile:[], message: "Mass registration failed!"})
                                                    }
                                                })
                                            }
                                        })
                                        })
                                    })
                                }
                            })
                        }
                        
                    }).catch(err=>{
                        res.status(400).send({success:false,existFile:[], message: "Mass registration failed!"})
                        console.log("err: ",err)
                    })
                })
            } catch (error) {
                res.status(400).send({success:false,existFile:[], message: "Mass registration failed!"})
                console.log("new multipleregister function catch err line 637: ",error)
            }
        }
    })
}

const CreateModel = (req,res) => {
    try {
                
        const data = JSON.parse(req.body.data);
    
        let formatedData = [];
        let notRegistered = []

        data.map((item)=>{
            let modelNames = item.modelNm
            let createdAt = new Date(Date.now()).toISOString()
            let updatedAt = new Date(Date.now()).toISOString()
            const dataFormate = {
            numberAddr: item.address,
            complex: item.complex,
            fileMeta: {
                fileId:item.fileId,
                fileNm: item.fileNm,
                fileNm2: item?.filename2 ?? "",
                mapDiv : item?.mapDiv ?? "",
                origin : item?.origin?? [],  
                loc: {
                    type: "point",
                    coordinates: [
                        item.longitude,
                        item.latitude
                    ]
                },
                altitude: item.altitude,
                orientation: {
                    heading: item.heading,
                    pitch: item.pitch,
                    roll: item.roll
                },
                scale: Number(item.scale),
                height: item.height
            },
            userId:mongoose.Types.ObjectId(item.user),
            resolution: item.resulationList,
            modelType: item.type,           
            modelNm: modelNames,
            unique:item.unique,
            createDt:createdAt,
            updateDt:updatedAt,
            createId: "SYSTEM",
            createTs: Date.now(),
            updateId: "SYSTEM",
            updateTs: Date.now()
            }
            formatedData.push(dataFormate)                           
        })
        AssetModel.insertMany(formatedData).then(result=> {
            res.status(200).send({success:true,notRegistered:notRegistered, message: "mass registration completed"})
        }).catch(error=> {
            console.log(error)
            res.status(400).send({success:false,notRegistered:[], message: "Mass registration failed"})
        });

    } catch (error) {
        console.log("line 438: ",error)
        res.status(400).send({success:false, message: "Mass registration failed"})
    }
}

const storeModelInDb = (req,res) => {
    const file = req;
    res.send("balnk")
    // FileModel.create({file:file})
}


const searchModelByKeyword = (req,res) => {
    const keyword = req.params.keyword;
    const page = req.params.page;
    const rowPerPage = req.params.rowPerPage;
    if(keyword!==undefined && page!==undefined && rowPerPage!==undefined && keyword!=="" && page!=="" && rowPerPage!==""){
        const skip = Number(rowPerPage)*Number(page);
        const take = Number(rowPerPage);
        console.log("skip & take: ",skip, take)
        console.log("keyword: ",keyword)
        try {
            AssetModel.find( 
                { $or:[
                    {"modelType": { $regex:`${keyword}`, $options:"i"} },
                    {"numberAddr": { $regex:`${keyword}`, $options:"i"} },
                    {"fileMeta.fileNm": { $regex:`${keyword}`, $options:"i"} },
                ] 
            } ).sort({_id:-1,}).skip(skip).limit(take).exec().then(response=>{
                AssetModel.count( 
                    { $or:[
                        {"modelType": { $regex:`${keyword}`, $options:"i"} },
                        {"numberAddr": { $regex:`${keyword}`, $options:"i"} },
                        {"fileMeta.fileNm": { $regex:`${keyword}`, $options:"i"} },
                    ] 
                } ).then(count=>{
                    console.log("found count: ",count)
                    console.log("found model: ",response.length)
                    res.status(200).send({success:true,totalModel:count, data:response})
                }).catch(error=>{
                    console.log("search catch err line 1190: ",error)
                    res.status(500).send({success:false,totalModel:0, data:[]})
                })
            }).catch(error=>{
                console.log("search catch err line 1193: ",error)
                res.status(500).send({success:false,totalModel:0, data:[]})
            })
        } catch (error) {
            console.log("search catch err: ",error)
            res.status(500).send({success:false,totalModel:0, data:[]})
        }
    }else{
        res.status(500).send({success:false,totalModel:0, data:[]})
    }

    // AssetModel.find({$text:{$search:keyword}}).then(result=>{
    //     res.status(200).send({seccess:true, data:result});
    // }).catch(err=>{
    //     res.status(200).send({seccess:false, data:[]});
    // })
}


const DeleteMultipleModel = (req,res) => {
    const {deleteRows} = req.body;
    let glbFileIdList  = []
    deleteRows.map(item=>glbFileIdList.push(item.fileId))
    deleteRows.map((item,i)=>{
        const ObjectFileId = mongoose.Types.ObjectId(item.fileId.toString());
        let totalDuplicate = 0;
        AssetModel.countDocuments({"fileMeta.fileId":ObjectFileId}).then(result=>{
            glbFileIdList.map(glbFileId=>{
                if(glbFileId.toString()==item.fileId.toString()){
                    totalDuplicate++
                }
            })
            if(Number(result)==totalDuplicate){
                deleteSingleModelFromGridfsByName(ObjectFileId)
            }
            AssetModel.deleteOne({_id:item.id}).then(result=> {
            
            }).catch(error=> {
                console.log('error in 613: ',error)
            })
            if(i+1==deleteRows.length){
                res.status(200).send({success:true, message: "Models deleted successfully", result: result})
            }
        }).catch(error=>{
            console.log(error)
        })
    })
}

const GetModelByPagination = (req,res) => {
    const {page, rowPerPage,currentType} = req.params;
    const skip = Number(page)*Number(rowPerPage);
    const take = Number(rowPerPage);
    let lowerType = currentType.toLowerCase()
    if(lowerType==="all"){
        AssetModel.find().sort({_id:-1}).skip(skip).limit(take).exec().then(result=>{
            AssetModel.count().exec().then(count=>{
                res.status(200).send({success:true,totalModel:count, data:result})
            }).catch(error=>{
                res.status(500).send({success:false,totalModel:0, data:[]})
            })
        }).catch(error=>{
            res.status(500).send({success:false,totalModel:0, data:[]})
        })
    }else{
        AssetModel.find({modelType:currentType}).sort({_id:-1}).skip(skip).limit(take).exec().then(result=>{
            AssetModel.count({modelType:currentType}).exec().then(count=>{
                res.status(200).send({success:true,totalModel:count, data:result})
            }).catch(error=>{
                res.status(500).send({success:false,totalModel:0, data:[]})
            })
        }).catch(error=>{
            res.status(500).send({success:false,totalModel:0, data:[]})
        })
    }
}
const GetModelCreatedByPagination = (req,res) => {
    const {page, rowPerPage,currentType} = req.params;
    const skip = Number(page)*Number(rowPerPage);
    const take = Number(rowPerPage);
    let lowerType = currentType.toLowerCase()
    if(lowerType==="all"){
        AssetModel.find().where({unique:false}).sort({_id:-1}).skip(skip).limit(take).exec().then(result=>{
            AssetModel.count().where({unique:false}).exec().then(count=>{
                res.status(200).send({success:true,totalModel:count, data:result})
            }).catch(error=>{
                res.status(500).send({success:false,totalModel:0, data:[]})
            })
        }).catch(error=>{
            res.status(500).send({success:false,totalModel:0, data:[]})
        })
    }else{
        AssetModel.find({modelType:currentType}).where({unique:false}).sort({_id:-1}).skip(skip).limit(take).exec().then(result=>{
            AssetModel.count({modelType:currentType}).where({unique:false}).exec().then(count=>{
                res.status(200).send({success:true,totalModel:count, data:result})
            }).catch(error=>{
                res.status(500).send({success:false,totalModel:0, data:[]})
            })
        }).catch(error=>{
            res.status(500).send({success:false,totalModel:0, data:[]})
        })
    }
}

// multiple model update is not available

export {getModelsMetadata,storeModelInDb,registerWithGlbFile, RetrieveMultipleModel, GetModelByPagination,GetModelCreatedByPagination,searchModelByKeyword, RetrieveMultipleModelByType, ResgisterSignleModel,ResgisterMultipleModel,CreateModel,DeleteSingleModel,updateModelWithFile,updateModelWithNoFile,RetrieveSigleModelById, DeleteMultipleModel}
