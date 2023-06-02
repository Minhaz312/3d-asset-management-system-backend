

const readGlb = {
    parameters:[
        {
            name:"fileId",
            required:true,
            in:"path",
            type:"string",
            description:"Use fileId"
        }
    ],
    get:{
        tags:["Assets"],
        responses:{
            200:{
                description:"Ok",
                content:{
                    "application/octet-stream":{schema:{
                        example:"File is can be shown in 3d viewer"
                    }
                }}
            },
            404:{
                content:{
                    schema:{
                        example:"File not found"
                    }
                }
            }
        }
    }
}

export default readGlb;