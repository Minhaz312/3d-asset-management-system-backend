import Jwt from "jsonwebtoken"
const PassResetAuth = (req,res,next) => {
    const token = req.headers.authorization;
    if(token === undefined) {
        next("Unathorized")
    }else{
        try {
            Jwt.verify(token,process.env.AUTH_PRIVATE_KEY,(err,decoded)=>{
                if(decoded===undefined){
                    res.status(401)
                    next("unauthorized action")
                }
                next()
            })
        } catch (error) {
            res.status(401)
            next("unauthorized action")
        }
    }
}

export default PassResetAuth;
