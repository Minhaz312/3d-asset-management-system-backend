const getModelsMetadata = {
    parameters: [
        {
          name: "from",
          required: true,
          in: "query",
          type: "string",
          description: "fetch start from"
        },
        {
          name: "to",
          required: true,
          in: "query",
          type: "string",
          description: "fetch start to"
        },
        {
          name: "modelType",
          required: true,
          in: "query",
          type: "string",
          description: "model type"
        },
        {
          name: "resolution",
          required: true,
          in: "query",
          type: "string",
          description: "resolution"
        },
      ],
    get:{
        tags:["Assets"],
        responses:{
            200:{
                description:"Ok",
                content:{
                    "application/json":{
                        schema:{
                            type:"array",
                            example:{
                                "success": true,
                                "data": [{
                                  "fileId": "6353f5bdec8a0c70762dd5ff",  
                                  "author" : "6353f17e6d5b37ea517aa9a2",
                                  "blockName" : "경상북도 구미시 공단동 215",
                                  "complex" : 1,
                                  "height" : 14,
                                  "modelType" : "T-Test-1",
                                  "modelOwners" : [ "ToPrint" ],
                                  "orientation" : {
                                    "heading" : 90,
                                    "pitch" : 0,
                                     "roll" : 0
                                  },
                                  "position" : {
                                    "longitude" : 128.3769731,
                                    "latitude" : 36.1069828,
                                    "altitude" : 35
                                  },
                                  "filename" : "gongdan_dong_215_1.glb",
                                  "resolution" : 1024,
                                  "scale" : 1,
                                  "unique" : false,
                                  "firstTime" : 1666446781092,
                                  "lastTime" : 1666446781092,
                                  "createdAt" : "2022-10-22T13:53:01.092Z",
                                  "updatedAt" : "2022-10-22T13:53:01.092Z",
                                  "use" : true
                                }, ]
                              }
                    }
                    }
                }
            }
        }
    }
}

export default getModelsMetadata;