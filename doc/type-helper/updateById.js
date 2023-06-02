const updateById = {
    parameters: [
        {
          name: "id",
          required: true,
          in: "path",
          type: "string",
          description: "type id"
        }
      ],
    put:{
        tags:["Asset Groups"],
        requestBody:{
            required:true,
            content:{
                "application/json":{
                    schema:{
                        type:"array",
                        properties:{
                            name:{
                                type:"string",
                                description:"Type name",
                                
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
                            example: [{name:"typename"}]
                    }
                    }
                }
            }
        }
    }
}

export default updateById;