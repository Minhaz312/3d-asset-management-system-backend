const login = {
    post:{
        tags:["Users"],
        requestBody:{
            required:true,
            content:{
                "application/json":{
                    schema:{
                        type:"object",
                        properties:{
                            mail:{
                                type:"string",
                                description:"User name",
                            },
                            password:{
                                type:"string",
                                description:"User name",
                            }
                        },
                        example:{
                            mail:"user@example.com",
                            password:"password"
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
                            example: {mail:"user@example.com",password:"123"}
                    }
                    }
                }
            }
        }
    }
}

export default login;