import Jwt from "jsonwebtoken"
import UserModel from "../models/UserModel.js";
const Auth = (req,res,next) => {
    const token = req.headers.authorization;
    if(token === undefined) {
        res.status(401)
        next("Unathorized")
    }else{
        try {
            Jwt.verify(token,process.env.AUTH_PRIVATE_KEY,(err,decoded)=>{
                if(decoded===undefined){
                    res.status(401)
                    next("unauthorized action")
                }
                UserModel.findById(decoded.id).then(found=>{
                    UserModel.count().exec().then(user=>{
                        if(user<1){
                            next()
                        }else{
                            if(found.approved===false){
                                res.status(401)
                                next("Unauthorized user")
                            }else{
                                next()
                            }
                        }
                    }).catch(err=>{
                        res.status(401)
                        next("Unauthorized")
                    })
                })
            })
        } catch (error) {
            res.status(401)
            next("unauthorized action")
        }
    }
}


export default Auth