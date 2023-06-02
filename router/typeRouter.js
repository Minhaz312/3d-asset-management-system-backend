import { Router } from "express";
import Auth from "../middleware/AuthMiddleware.js";


import { registerType, updateType, deleteType, retrieveType } from "./../controller/TypeController.js";



const typeRouter = Router();


typeRouter.get("/get/all",Auth,(req,res)=> {
    retrieveType(req,res);
})
typeRouter.post("/register",Auth,(req,res)=> {
    registerType(req,res);
})
typeRouter.delete("/delete/:type/:id",Auth,(req,res)=> {
    deleteType(req,res);
})
typeRouter.put("/update/:id",Auth,(req,res)=> {
    updateType(req,res);
})


export default typeRouter;