import mongoose from 'mongoose';
import AssetModel from "../models/AssetModel.js";
import TypeModel from "../models/TypeModel.js"


const registerType = (req,res) => {
    const typeList = req.body.type;
    if(typeList!==undefined && typeList!==null && typeList.length>0){
        try {
            let list = []
            let toInsertList = []
            let registeredTypes = []

            TypeModel.find().then(types=>{
                typeList.map((item,i)=>{
                    let type = item.name.charAt(0).toUpperCase()+item.name.slice(1);
                    if(types.filter(prevItem=>prevItem.name==type?false:true)){
                        toInsertList.push({name:type})
                    }

                    if(i+1==typeList.length){
                        TypeModel.insertMany(toInsertList).then((msg)=> {
                            TypeModel.find().then(allType=>{
                                res.status(200).send({success: true,data:allType, message: 'Registered successfully'});
                            }).catch(err=>{
                                res.status(500).send({success: false, message: 'Registration failed'});
                            })
                        }).catch(err=> {
                            console.log('err in 20: ',err)
                            res.status(500).send({success: false, message: 'Registration failed'});
                        })
                    }
                })
            }).catch(error=>{
                res.status(500).send({success: false, message: 'Registration failed'});
            })

        } catch (error) {
            console.log('err in 23: ',error)
            res.status(500).send({success: false, message: 'Registration failed'});
        }
    }else{
        console.log('err in 27: ')
        res.status(500).send({success: false, message: 'Registration failed'});
    }
}
const updateType = (req,res) => {
    const id = req.params.id
    const {newType,previousType} = req.body;
    let formatedNewType = newType.charAt(0).toUpperCase()+newType.slice(1);
    TypeModel.find({name:newType}).then(found=>{
        if(found.length>0){
            res.status(400).send({success: false, message: 'Failed to update'});
        }else{
            TypeModel.updateOne({_id:id},{
                name:formatedNewType,
                updatedAt: Date.now()
            }).then(result=> {
                AssetModel.updateMany({modelType:previousType},{$set:{modelType:formatedNewType}}).then(result=>{
                    TypeModel.find().then(allType=>{
                        res.status(200).send({success: true,data:allType, message: 'Updated successfully'});
                    }).catch(err=>{
                        res.status(500).send({success: true, message: 'Failed to update the corresponding models type'});
                    })
                }).catch(error=>{
                    res.status(500).send({success: true, message: 'Failed to update the corresponding models type'});
                })
            }).catch(error=> {
                res.status(400).send({success: false, message: 'Failed to update'});
            })
        }
    })
    
}
const deleteType = (req,res) => {
    const id = req.params.id;
    const type = req.params.type;
    TypeModel.deleteOne({_id:id}).then(result=> {
        AssetModel.find({modelType:type},{_id:1,"fileMeta.fileId":1}).then(allModel=>{
            if(allModel.length>0){
                let glbIdList = []
                let modelIdList = []
                allModel.map((model,id)=>{
                    modelIdList.push(model._id)
                    glbIdList.push(model.fileMeta.fileId)
                })
                console.log('deleting total',allModel.length,  " model of ", type, " type")
                let duplicate = {}
                glbIdList.forEach(function(i) { 
                    duplicate[i] = (duplicate[i]||0) + 1;
                });
                const totalUniqueGlbId = Object.entries(duplicate).length
                let count = 0
                console.log("totalUniqueGlbId: ",totalUniqueGlbId)
                for(const [key,value] of Object.entries(duplicate)){
                    let formatedFileId = mongoose.Types.ObjectId(key)
                    let fileId = formatedFileId;
                    AssetModel.countDocuments({"fileMeta.fileId":formatedFileId}).exec().then(result=>{
                        console.log("unique value: ",value, " count value: ",result)
                        if(Number(value)==Number(result)){
                           mongoose.connection.db.collection("models.files").findOne({_id:fileId},(err,files)=>{
                                if(err){
                                }
                                if(files){
                                   mongoose.connection.db.collection("models.files").deleteOne({_id:fileId},(err)=>{
                                        if(err){
                                        }else{
                                           mongoose.connection.db.collection("models.chunks").deleteMany({files_id:files._id}).then(result=>{
                                            count++
                                            if(count==totalUniqueGlbId){
                                                AssetModel.deleteMany({_id:{$in:modelIdList}}).then(result=>{
                                                    TypeModel.find().then(allType=>{
                                                        res.status(200).send({success:true,data:allType, message: "Type deleted successfully",})
                                                    }).catch(err=>{
                                                        res.status(200).send({success:true,data:allType, message: "Type deleted successfully",})
                                                    })
                                                }).catch(err=>{
                                                    console.log('err in 165: ',err)
                                                })
                                            }
                                           })
                                        }
                                    })
                                }else{
                                    TypeModel.find().then(allType=>{
                                        res.status(200).send({success:true,data:allType, message: "Type deleted successfully",})
                                    }).catch(err=>{
                                        res.status(200).send({success:true,data:[], message: "Type deleted successfully",})
                                    })
                                }
                            })
                            // deleteSingleModelFromGridfsByName(formatedFileId)
                        }else{
                            count++
                            if(count==totalUniqueGlbId){
                                AssetModel.deleteMany({_id:{$in:modelIdList}}).then(result=>{
                                    TypeModel.find().then(allType=>{
                                        res.status(200).send({success:true,data:allType, message: "Type deleted successfully",})
                                    }).catch(err=>{
                                        res.status(200).send({success:true,data:[], message: "Type deleted successfully",})
                                    })
                                }).catch(err=>{
                                    console.log('err in 165: ',err)
                                })
                            }
                        }
                    })
                }  
                
            }else{
                TypeModel.find().then(allType=>{
                    res.status(200).send({success:true,data:allType, message: "Type deleted successfully",})
                }).catch(err=>{
                    res.status(200).send({success:true,data:[], message: "Type deleted successfully",})
                })
            }
            
        })

    }).catch(error=> {
        res.status(400).send({success: false, message: 'Failed to delete'});

    })
}
const retrieveType = (req,res) => {
    TypeModel.find().then(data=>{
        res.status(200).send({success: true, data:data});
    }).catch(error=>{
        res.status(200).send({success: false, data:[]});
    })
}

export { registerType, updateType, deleteType, retrieveType }