const registerSingle = {
    post:{
        tags:["Assets"],
        requestBody:{
            required:true,
            content:{
                "multipart/form-data":{
                    schema:{
                        type:"object",
                        properties:{
                            data:{
                                type:"object",
                                required:true,
                                example:{
                                    user:"user",
                                    address:"address",
                                    complexNumber:"1 to 4",
                                    latitude:"37.0",
                                    longitude:"128.0",
                                    altitude:"0",
                                    heading:"90",
                                    pitch:"0",
                                    roll:"0",
                                    height:"0",
                                    scale:"1",
                                    type:"enter registered type",
                                    mapDiv:"",
                                    filename2:"",
                                    origin:[128.3733621, 36.1102223, 0],
                                    resolution:"256 or 512 or 1024 or 2048",
                                    unique:"true or false",
                                    modelNames:["example 1","example 2"]
                                }
                            },
                            singleModel:{
                                type:"string",
                                required:true,
                                format:"binary"
                            },
                            
                        }
                    }
                }
            }
        },
        
        responses:{
            200:{
                description:"Ok",
                content:{
                    "multipart/form-data":{
                        schema:{
                            type:"object",
                            example:{success: true, message: 'Successfully registered'}
                        }
                    }
                }
            }
        }
    }
}

export default registerSingle;