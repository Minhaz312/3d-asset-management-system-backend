

const downloadGlbFile = {
    parameters:[
        {
            name:"Filename",
            required:true,
            in:"path",
            type:"string",
            description:"Use filename"
        },
        {
            name:"Resolution",
            required:true,
            in:"path",
            type:"number",
            description:"Resolution"
        }
    ],
    get:{
        tags:["Assets"],
        responses:{
            200:{
                description:"Ok",
                content:{
                    "application/octet-stream":{schema:{
                        example:"File is downloaded"
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

export default downloadGlbFile;