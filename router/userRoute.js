import { Router } from "express";
import {approveUser, deleteUser, getAllUser, getUserById, Login,signUp, updateUser} from "../controller/userController.js";
import Auth from "../middleware/AuthMiddleware.js";


const userRouter = Router();


userRouter.post("/create",(req,res)=> {
    signUp(req,res)
})
userRouter.get("/get/all",Auth,(req,res)=> {
    getAllUser(req,res)
})
userRouter.get("/get/:id",Auth,(req,res)=> {
    getUserById(req,res)
})
userRouter.put("/update",Auth,(req,res)=> {
    updateUser(req,res)
})
userRouter.put("/approve",Auth,(req,res)=> {
    approveUser(req,res)
})
userRouter.delete("/delete/:id",(req,res)=> {
    deleteUser(req,res)
})
userRouter.post("/login",(req,res)=> {
    Login(req,res)
})





export default userRouter