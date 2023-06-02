const register = {
    post:{
        tags:["Asset Groups"],
        requestBody:{
            required:true,
            content:{
                "application/json":{
                    schema:{
                        type:"object",
                        properties:{
                            type:{
                                type:"array",
                                items:{
                                    type:"object"
                                }
                            }
                        },
                        example:{type:[
                            {name:"type name"}
                        ]}
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
                            example: [{name:"typename"}]
                    }
                    }
                }
            }
        }
    }
}

export default register;