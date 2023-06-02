import * as dotevn from 'dotenv'
dotevn.config()

import fs from 'fs'
import mongoose from 'mongoose';
import multer from "multer";
import Grid from 'gridfs-stream';
import { GridFsStorage } from 'multer-gridfs-storage';

const conn = mongoose.connection

let gfs,gfsChunks,gridfsBucket,ModelsFilesModel;
conn.once("open",()=>{
    ModelsFilesModel = mongoose.connection.db.collection("models.files");
    gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'models',
    });
     gfs = Grid(conn.db, mongoose.mongo);
     gfs.collection("models")
    
})

const url = process.env.MONGODB_CONNECTION_STRIN

const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        if(!fs.existsSync("./public/3d-models/")){
            fs.mkdirSync("./public/3d-models/")
        }
        cb(null,'./public/3d-models/');
    },
    fileFilter:(req,file,cb) => {
        console.log('body &&& file: ',file.buffer)
        cb(null, file.originalname)
    },
    filename: (req,file,cb) => {
        cb(null, file.originalname)
    }
})



const gridfsSingleStorage = new GridFsStorage({
    url:`${process.env.MONGODB_CONNECTION_STRIN}`,
    file:(req,file)=> {
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
                filename2,
                origin
            } = JSON.parse(req.body.data)


            const formatedType = type.charAt(0).toUpperCase()+type.slice(1);
            let glbMetadata = {
                "fileId":null,
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
            "filename":file.originalname,
            "filename2": filename2?? "", 
            "mapDiv" : mapDiv?? "",
            "origin" : origin?? [],
            "resolution" : Number(resolution),
            "scale" : Number(scale),
            "unique" : unique,
            "firstTime" : Date.now(),
            "lastTime" : Date.now(),
            "createdAt" :new Date(Date.now()).toISOString(),
            "updatedAt" :new Date(Date.now()).toISOString(),
            "use" : true
                }
            
            let formatedFileName = null;

            if(Number(resolution)==256){
                formatedFileName = `temp_R0_${file.originalname}`
            }else if(Number(resolution)==512){
                formatedFileName = `temp_R1_${file.originalname}`
            }else if(Number(resolution)==1024){
                formatedFileName = `temp_R2_${file.originalname}`
            }else if(Number(resolution)==2048){
                formatedFileName = `temp_R3_${file.originalname}`
            }else {
                formatedFileName = `temp_R1_${file.originalname}`
            }


            return {
                metadata: glbMetadata,
                filename:formatedFileName,
                bucketName:"models",
            }
        } catch (error) {
            console.log('erro from modelCon 101: ',error)
            return null
        }
    },
    
})
const gridfsSingleUpdateStorage = new GridFsStorage({
    url:`${process.env.MONGODB_CONNECTION_STRIN}`,
    file:(req,file)=> {
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
                filename2,
                origin
            } = JSON.parse(req.body.data[0])


            const formatedType = type.charAt(0).toUpperCase()+type.slice(1);
            let glbMetadata = {
                "fileId":null,
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
            "filename":file.originalname,
            "filename2": filename2?? "",
            "mapDiv" : mapDiv?? "",
            "origin" : origin?? [],
            "resolution" : Number(resolution),
            "scale" : Number(scale),
            "unique" : unique,
            "firstTime" : Date.now(),
            "lastTime" : Date.now(),
            "createdAt" :new Date(Date.now()).toISOString(),
            "updatedAt" :new Date(Date.now()).toISOString(),
            "use" : true
                }
            
            let formatedFileName = null;
            
            if(Number(resolution)==256){
                formatedFileName = `temp_R0_${file.originalname}`
            }else if(Number(resolution)==512){
                formatedFileName = `temp_R1_${file.originalname}`
            }else if(Number(resolution)==1024){
                formatedFileName = `temp_R2_${file.originalname}`
            }else if(Number(resolution)==2048){
                formatedFileName = `temp_R3_${file.originalname}`
            }else {
                formatedFileName = `temp_R1_${file.originalname}`
            }


            return {
                metadata: glbMetadata,
                filename:formatedFileName,
                bucketName:"models",
            }
        } catch (error) {
            console.log('erro from modelCon 101: ',error)
            return null
        }
    },
    
})
const gridfsMultipleStorage = new GridFsStorage({
    url:`${process.env.MONGODB_CONNECTION_STRIN}`,
    file:(req,file)=> {
        try {

            const data = JSON.parse(req.body.data);
                        
            
            let metadata = data.filter(item=>{
                if(item.fileNm==file.originalname){
                    return item;
                }
            })
            const {
                user,
                complex,
                address,
                modelNm,
                fileNm,
                latitude,
                longitude,
                altitude,
                height,
                heading,
                pitch,
                roll,
                scale,
                type,
                unique,
                resulationList,
                mapDiv,
                filename2,
                origin
            } = metadata[0]

            const formatedType = type.charAt(0).toUpperCase()+type.slice(1);

            let glbMetadata = {
                "fileId":null,
                "author" : user,
                "blockName" : address,
                "complex" : Number(complex),
                "height" : Number(height),
                "modelType": formatedType,
                "modelOwners": modelNm,
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
                "filename":file.originalname,
                "filename2": filename2?? "",
                "mapDiv" : mapDiv?? "",
                "origin" : origin?? [],
                "resolution" : Number(resulationList),
                "scale" : Number(scale),
                "unique" : unique,
                "use" : true,
                "createdAt" : new Date(Date.now()).toISOString(),
                "updatedAt" : new Date(Date.now()).toISOString(),
                "firstTime" : Date.now(),
                "lastTime" : Date.now()
            }


            let formatedFileName = null;
            
            if(Number(resulationList)==256){
                formatedFileName = `temp_R0_${file.originalname}`
            }else
            if(Number(resulationList)==512){
                formatedFileName = `temp_R1_${file.originalname}`
            }else if(Number(resulationList)==1024){
                formatedFileName = `temp_R2_${file.originalname}`
            }else if(Number(resulationList)==2048){
                formatedFileName = `temp_R3_${file.originalname}`
            }else {
                return `R1_${file.originalname}`;
            }

            return {
                metadata: glbMetadata,
                filename:formatedFileName,
                bucketName:"models",
                disableMD5:false
            }
        } catch (error) {
            console.log('error in modelCon 198: ',error)
            return null;
        }
    },
    
})



const gridfsMultipleUploader = multer({storage:gridfsMultipleStorage,fileFilter:(req,file,cb)=>{
    cb(null,true)
}}).array("multipleModel",{maxCount:3000})

const gridfsSingleUploader = multer({storage:gridfsSingleStorage,fileFilter:(req,file,cb)=>{
    cb(null,true)
}}).single("singleModel")
const gridfsSingleUpdateUploader = multer({storage:gridfsSingleUpdateStorage,fileFilter:(req,file,cb)=>{
    cb(null,true)
    
}}).single("singleModel")



const modelUploader = multer({storage: storage,fileFilter:(req,file,cb) => {
    cb(null, file.originalname)
}}).fields([{name:"singleModel",maxCount:1},{name: "multipleModel"}])


const uploadMultipleGridfs = (req,res) => {
    gridfsMultipleUploader(req,res,err=>{
        if(err){
            res.status(500).send({success:false,message:"Failed to upload model"})
        }else{ 
            res.status(200).send({success:true,message:"Model uploaded"})
        }
    })
}


const getSingleModelFromGridfsByFileId = (req,res) => {
    try {
        const fileId = mongoose.Types.ObjectId(req.params.fileId.toString().trim())
        if(gfs) {
            gfs.files.findOne({ _id: fileId },(err, files)=> {
                if (err){
                    res.status(404).send(err)
                }else{
                    if(err){
                        res.status(404).send("File not found")
                    }else{
                        if(files){
                            const readstream = gridfsBucket.openDownloadStream(files._id);

                            readstream.on("error",(err)=>{
                                console.log("download file found error",err)
                                return res.status(404).send("file not found")
                            })
                            
                            readstream.on("end",(data)=>{
                                console.log("download file found end")
                                return res.status(200).send()
                            })

                            console.log("download file found",files)
                            
                            res.set('Content-Disposition', 'attachment; filename="' + files.metadata.filename2 + '"');
                            res.set("Content-Type",files.contentType)
                            readstream.pipe(res);
                       
                        }else{
                            res.status(404).send("File not found")
                        }
                    }
                }
            })
        }else{
            res.status(404).send("file not found")
        }
    } catch (error) {
        console.log('from catch in 169',error)
        res.status(500).send({message:"failed"})
    }
}

const deleteSingleModelFromGridfsByName = (fileId) => {
    let res = false;
    if(gfs){
        gfs.files.findOne({_id:fileId},(err,files)=>{
            if(err){
                res = false;
            }
            if(files){
                gfs.files.deleteOne({_id:fileId},(err)=>{
                    if(err){
                        res = false
                    }else{
                       res = true
                       conn.db.collection("models.chunks").deleteMany({files_id:files._id})
                    }
                })
            }else{
                res = false;
            }
        })
    }
    return res;
}

const existModelFileInGridfs = async filename => {
    let notExistInGridfsList = []
}

const uploadFileToLoacalPublicStorage = (req,res) => {
    modelUploader(req,res,err=> {
        if(err){
            
        }else{
            
        }
    })
}

const checkModelExist = (req,res) => {
    try {
        const filename = req.params.filename
    
        const result = fs.existsSync(`./public/3d-models/${filename}`)
    
        res.status(200).send({success:result, existFile:result})
            
    } catch (error) {
        res.status(400).send("Maybe filename is not given")
    }
}
const checkMultipleModelExist = async (req,res) => {
    const filenames = req.body.list

    let existInGridFs = [];
    let notExistInGridfsList=[]

    let count = 0;

    filenames.map(filename=>{
        mongoose.connection.db.collection("models.files").findOne({filename:filename},(err,files)=>{
            count++
            if(files===null) {
                notExistInGridfsList.push({filename})
            }else{
                existInGridFs.push({filename})
            }
            if(count==filenames.length){
                res.status(200).send({success:true,notExistInGridfsList:notExistInGridfsList,existInGridFs:existInGridFs})
            }
        })
    })
}

const checkSingleModelExist = async (req,res) => {

    try {
        const filename = req.params.filename
        const file = await gfs.files.findOne({filename:filename})
        if(file){
            res.status(200).send({success:true,exist:true,message:"exist model file"})
        }else{
            res.status(200).send({success:true,exist:false,message:"exist model file"})
        }
    } catch (error) {
        res.status(400).send({success:true,exist:false,message:"exist model file"})
    }

}
const checkModelExistInGridfs = async (filename) => {

    try {
        return await gfs.files.findOne({filename:filename})
    } catch (error) {
        return false
    }

}
const downloadByName = (req,res) => {
    let filename = req.params.filename
    let resolution = req.params.resolution
    if(gfs) {
        gfs.files.findOne({ "metadata.filename": filename,"metadata.resolution":Number(resolution) },(err, files)=> {
            if (err){
                console.log('file found err',err)
                res.status(404).send(err)
            }else{
                if(files!=null){
                    const readstream = gridfsBucket.openDownloadStreamByName(files.filename);
                    readstream.on("error",(err)=>{
                        console.log("download file found error",err)
                        return res.status(404).send("file not found")
                    })
                    console.log("download file found",files)
                    readstream.on("end",(data)=>{
                        console.log("download file found end")
                        return res.status(200).send()
                    })
                    res.set('Content-Disposition', 'attachment; filename="' + filename + '"');
                    res.set("Content-Type",files.contentType)
                    readstream.pipe(res)
                }else{
                    res.status(404).send({message:"File is not found"})
                }
            }
        })
    }else{
        res.status(404).send("file not found")
    }

}


export {gfs,uploadMultipleGridfs,gridfsSingleUpdateUploader,gridfsSingleUploader,gridfsMultipleUploader,checkSingleModelExist,checkModelExistInGridfs, existModelFileInGridfs, getSingleModelFromGridfsByFileId, deleteSingleModelFromGridfsByName, uploadFileToLoacalPublicStorage, checkModelExist,checkMultipleModelExist,downloadByName}
