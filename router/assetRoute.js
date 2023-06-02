import { Router } from 'express'
import fs from 'fs'
import { checkMultipleModelExist, checkSingleModelExist, downloadByName, uploadFileToLoacalPublicStorage } from '../controller/ModelController.js';
import Auth from '../middleware/AuthMiddleware.js';

import 
{   
    ResgisterSignleModel,  
    DeleteSingleModel, 
    RetrieveSigleModelById, 
    ResgisterMultipleModel, 
    DeleteMultipleModel,
    RetrieveMultipleModel,
    RetrieveMultipleModelByType,
    searchModelByKeyword,
    GetModelByPagination,
    storeModelInDb,
    registerWithGlbFile,
    updateModelWithNoFile,
    updateModelWithFile,
    GetModelCreatedByPagination,
    CreateModel,
    getModelsMetadata
} from './../controller/AssetController.js'



const assetRouter = Router();


assetRouter.get("/modelsMetadata",(req,res)=>{
    getModelsMetadata(req,res);
})

assetRouter.get("/get-all-model",(req,res)=>{
    RetrieveMultipleModel(req,res);
})

assetRouter.get("/get-single-model-by/:id",(req,res)=> {
    RetrieveSigleModelById(req,res);
})
assetRouter.get("/get-model-by/:page/:rowPerPage/:currentType",(req,res)=> {
    GetModelByPagination(req,res);
})
assetRouter.get("/created/get-model-by/:page/:rowPerPage/:currentType",(req,res)=> {
    GetModelCreatedByPagination(req,res);
})
assetRouter.get("/get-multiple-model-by/:type",(req,res)=> {
    RetrieveMultipleModelByType(req,res);
})
assetRouter.get("/search-by-keyword/:keyword/:page/:rowPerPage",(req,res)=> {
    searchModelByKeyword(req,res);
})
assetRouter.post("/register-single-model",Auth,(req,res)=> {
    ResgisterSignleModel(req,res);
})


assetRouter.post("/register/single",Auth,(req,res)=> {
    if(!fs.existsSync("./public/")){
        fs.mkdirSync("./public/")
    }
    if(!fs.existsSync("./public/templates/")){
        fs.mkdirSync("./public/templates/")
    }
    registerWithGlbFile(req,res);
})


assetRouter.post("/register-multiple-model",Auth,(req,res)=> {
    if(!fs.existsSync("./public/")){
        fs.mkdirSync("./public/")
    }
    // uploadFileToLoacalPublicStorage(req,res)
    ResgisterMultipleModel(req,res)
})
assetRouter.post("/create-model",Auth,(req,res)=> {
    CreateModel(req,res);
})
assetRouter.post("/delete-model/single",Auth,(req,res)=> {
    DeleteSingleModel(req,res);
})
assetRouter.post("/delete-model/multiple",Auth,(req,res)=> {
    DeleteMultipleModel(req,res);
})
assetRouter.post("/update-model/single",Auth,(req,res)=> {
    uploadFileToLoacalPublicStorage(req,res);
})


assetRouter.post("/store-model-in-db",Auth,(req,res)=> {
    storeModelInDb(req,res)
})




// models routes

assetRouter.post("/upload-model/single",Auth,(req,res)=> {
    if(!fs.existsSync("./public/")){
        fs.mkdirSync("./public/")
    }
    uploadFileToLoacalPublicStorage(req,res)
    res.status(200).send("suceess")
})
assetRouter.post("/upload-model/multiple",Auth,(req,res)=> {
    if(!fs.existsSync("./public/")){
        fs.mkdirSync("./public/")
    }
    uploadFileToLoacalPublicStorage(req,res)
    res.status(200).send("suceess")
})


assetRouter.get("/check-single-model-exist/:filename",(req,res)=>{
    checkSingleModelExist(req,res)
})
assetRouter.post("/check-gridfs-model-exist/multiple",(req,res)=>{
    checkMultipleModelExist(req,res);
})



// GridFs upload routes


assetRouter.post("/update-model-with-nofile/single",Auth,(req,res)=> {
    updateModelWithNoFile(req,res);
})
assetRouter.post("/update-model-with-file/single",Auth,(req,res)=> {
    uploadFileToLoacalPublicStorage(req,res)
    updateModelWithFile(req,res);
})



// gridfs file download

assetRouter.get("/download/:resolution/:filename",(req,res)=> {
    downloadByName(req,res)
})






export default assetRouter;
