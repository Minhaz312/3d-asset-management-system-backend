const updateUser = {
    put:{
        tags:["Users"],
        requestBody:{
            required:true,
            content:{
                "application/json":{
                    schema:{
                        type:"array",
                        properties:{
                            name:{
                                type:"string",
                                description:"User name",
                            },
                            mail:{
                                type:"string",
                                description:"User name",
                            },
                            password:{
                                type:"string",
                                description:"User name",
                            }
                        }
                    }
                }
            }
        },
        responses:{
            200:{
                description:"Ok",
                content:{
                    "application/json":{
                        schema:{
                            type:"array",
                            example: {name:"username",mail:"user@example.com",password:"123"}
                    }
                    }
                }
            }
        }
    }
}

export default updateUser;