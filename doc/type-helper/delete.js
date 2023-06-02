const deleteById = {
    parameters: [
        {
          name: "id",
          required: true,
          in: "path",
          type: "string",
          description: "type id"
        },
        {
          name: "type",
          required: true,
          in: "path",
          type: "string",
          description: "type name"
        }
      ],
    delete:{
        tags:["Asset Groups"],
        responses:{
            200:{
                description:"Ok",
                content:{
                    "application/json":{
                        schema:{
                            type:"array",
                            example:{
                                    success:true,
                                    data:[{
                                        name: "Test",
                                        createdAt: "2022-09-07T08:44:51.886+00:00",
                                        updatedAt: "2022-09-07T08:44:51.886+00:00",
                                    }]
                            }
                    }
                    }
                }
            }
        }
    }
}

export default deleteById;