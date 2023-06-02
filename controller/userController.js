import Jwt from "jsonwebtoken"
import UserModel from "../models/UserModel.js"
import bcrypt from 'bcrypt'
import AssetModel from "../models/AssetModel.js"

const getAllUser = (req,res) => {
    UserModel.find().then(result=> {
        let reqUser = []
        let approvedUser = []
        result.map(user=>{
            if(user.approved===true){
                approvedUser.push(user)
            }else{
                reqUser.push(user)
            }
        })

        AssetModel.countDocuments().exec().then(totalModel=>{
            res.status(200).send({success:true,data:{totalModel:totalModel,approvedUser:approvedUser, requestedUser:reqUser}})
        }).catch(err=>{
            res.status(500).send({success:false,data:null})
        })

    }).catch(error=>{
        console.log(error)
        res.status(500).send({success:false,data:null})
    })
}
const approveUser = (req,res) => {
    try {
        const {id, mail} = req.body.data
        UserModel.updateOne({_id:id,mail:mail},{approved:true}).then(result=> {
            res.status(200).send({success:true,message:"Account approved"})
        }).catch(error=>{
            res.status(500).send({success:false,data:"Failed to approve"})
        })
    } catch (error) {
        res.status(500).send({success:false,data:"Failed to approve"})
    }
}
const getUserById = (req,res) => {
    const {id} = req.params;
    UserModel.findById(id).then(result=> {
        if(result){
            res.status(200).send({success:true,data:result})
        }else{
            res.status(200).send({success:false,data:null})
        }
    }).catch(error=>{
        res.status(500).send({success:false,data:null})
    })
}


const signUp = (req,res) => {
    try {
        const {name,mail,password} = JSON.parse(JSON.stringify(req.body));
        if(name==="" || mail==="" || password==="" || name===null || mail===null || password===null || name===undefined || mail===undefined || password===undefined, name.length>31 || mail.length>41){
            res.status(400).send({success:false, message:"Enter all values following rules!"})
        }else{
            UserModel.findOne({$or:[{name:name},{mail:mail}]}).then(result=>{
                if(result) {
                    res.status(409).send({success:false, message:"A user already exist with the mail or name"})
                }else{
                    bcrypt.hash(password,10).then(hashedPassword=>{
                        UserModel.count().exec().then(count=>{
                            if(count>0){
                                UserModel.create({name:name,mail:mail,password:hashedPassword,approved:false}).then(result=>{
                                    res.status(200).send({success:true, message:"User created"})
                                }).catch(error=>{
                                    res.status(500).send({success:false, message:"Failed to create user"})
                                })
                            }else{
                                UserModel.create({name:name,mail:mail,password:hashedPassword,approved:true}).then(result=>{
                                    res.status(200).send({success:true, message:"User created"})
                                }).catch(error=>{
                                    res.status(500).send({success:false, message:"Failed to create user"})
                                })
                            }
                        })
                    });
                }
            }).catch(err=>{
                res.status(500).send({success:false, message:"Failed to create user"})
            })
        }
    } catch (error) {
        res.status(500).send({error: "failed to register user"})
    }
}
const updateUser = (req,res) => {
    try {
        const {newName,newMail,newPassword,oldPassword,oldMail,userId} = JSON.parse(JSON.stringify(req.body));
        if(newName!==undefined && newMail!==undefined && oldMail!==undefined && userId!==undefined && newName!==undefined && newMail!==null && oldMail!==null && userId!==null && newName!=="" && newMail!=="" && oldMail!=="" && userId!==""){
            UserModel.find({_id:userId,mail:oldMail}).then(result=> {
                if(result.length>0){
                    bcrypt.compare(oldPassword,result[0].password).then(isValidPass=>{
                        if(isValidPass===true) {
                            if(newPassword!=="" && newPassword!==undefined && newPassword!==null && newPassword!=="null") {
                                bcrypt.hash(newPassword,10).then(hashedPassword=>{
                                    UserModel.updateOne({_id:userId,mail:oldMail},{name:newName,mail:newMail,password:hashedPassword}).then(result=>{
                                        UserModel.findOne({id:userId,mail:newMail}).then(updateUser=>{
                                            console.log('updated user: ',updateUser)
                                            res.status(200).send({success:true,data:{id:updateUser._id,name:updateUser.name,mail:updateUser.mail}, message:"User updated"})
                                        })
                                    }).catch(error=>{
                                        console.log('err 98: ',error)
                                        res.status(400).send({success:true, message:"Failed to update user"})
                                    })
                                });
                            }else{
                                UserModel.updateOne({_id:userId,mail:oldMail},{name:newName,mail:newMail}).then(result=>{
                                    UserModel.findOne({id:userId,mail:newMail}).then(updateUser=>{
                                        console.log('updated user: ',updateUser)
                                        res.status(200).send({success:true,data:{id:updateUser._id,name:updateUser.name,mail:updateUser.mail}, message:"User updated"})
                                    })
                                }).catch(error=>{
                                    console.log('err 106: ',error)
                                    res.status(400).send({success:true, message:"Failed to update user"})
                                })
                            }
                        }else{
                            console.log('err 110: ')
                            res.status(400).send({success:false, message:"failed to update"})            
                        }
                    }).catch(error=>{
                        console.log('err 113: ',error)
                        res.status(400).send({success:false, message:"failed to update"})            
                    })
                }else{
                    res.status(404).send({success:false, message:"user not found"})            
                }
            }).catch(error=> {
                console.log('err 119: ',error)
                res.status(400).send({success:false, message:"user not found"})
            })
        }else{
            console.log('err 123: ')
            res.status(400).send({success:false, message:"Failed"})
        }
    } catch (error) {
        console.log('err 125: ',error)
        res.status(400).send({error: "failed to register user"})
    }
}


const Login = (req,res) => {

try {
    const {mail,password} = req.body;
    UserModel.findOne({mail:mail}).then(result=> {
        if(result==null){
            res.status(404).send({success:false, message:"User not found!",token:null})            
        }else{
            if(result.approved==true){
                bcrypt.compare(password,result.password).then(isValidPass=>{
                    if(isValidPass===true) {
                        const token = Jwt.sign({loggedin:true,id:result._id,username:result.name},process.env.AUTH_PRIVATE_KEY)
                        res.status(200).send({success:true,data:{id:result._id,username:result.name,mail:result.mail}, message:"Logged in successfully",token:token})            
                    }else{
                        res.status(401).send({success:false, message:"Unauthorized, please enter valid credentials!",token:null})            
                    }
                }).catch(error=>{
                    console.log('err in 146: ',error)
                    res.status(401).send({success:false, message:"Unauthorized, please enter valid credentials!",token:null})            
                })
            }else{
                res.status(401).send({success:false, message:"Unauthorized, account is not approved!",token:null})            
            }
        }
    }).catch(error=> {
        console.log('err in 154: ',error)
        res.status(500).send({success:false, message:"Logged in failed!",token:null})
    })
    
} catch (error) {
    res.status(500).send({success:false, token:null})
}

}

const deleteUser = (req,res) => {
    try {
        let id = req.params.id
        UserModel.findByIdAndDelete(id).then(result=>{
            if(result){
                res.status(200).send({success:true, messag: "User deleted successfully"});
            }else{
                res.status(200).send({success:true, messag: "Failed to delete user"});
            }
        }).catch(error=>{
            res.status(500).send({success:true, messag: "Failed to delete user"});
        })
        
    } catch (error) {
        res.status(500).send({success:true, messag: "Failed to delete user"});
    }
}




export {getAllUser,approveUser, Login,signUp,updateUser,deleteUser,getUserById}
