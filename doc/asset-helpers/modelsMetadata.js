const modelsMetadata = {
    get:{
    tags:["Assets"],  
    summary:"models.files metadata",
    description:"models.files metadata",          
    parameters: [
        { 
           name: "modelType", in:"query", type:'string', description:"modelType", required: true, example:"Building"
        },
        {
          name: "resolution", in:"query",type:'number', description:"resolution", required: true, example:"512"
        },
        {
          name: "from", in:"query", type:'number', description:"from", required: true, example:"0"
        },
        {
          name: "to", in:"query", type:'number', description:"to", required: true, example:"100"
        }
    ],  
    responses:{
            200:{
                description:"Ok",
                content:{
                    "application/json":{
                        schema:{
                            example:{
                                    success:true,
                                    data:[]
                            }
                    }
                    }
                }
            }
        }
    }
}

export default modelsMetadata;