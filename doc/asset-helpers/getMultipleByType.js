const getMultipleByType = {
    parameters: [
        {
          name: "type",
          required: true,
          in: "path",
          type: "string",
          description: "model type"
        }
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
                                    success:true,
                                    data:[{"fileMeta":{"loc":{"type":"Point","coordinates":[128.4071672,36.1262866]},"orientation":{"heading":270,"pitch":0,"roll":0},"fileNm":"Gupodong_642.glb","altitude":40,"scale":1,"height":50},"_id":"631c60b6fb513c9fcabab362","numberAddr":"구포동 642","complex":2,"modelType":"F0","modelNm":[["에어프로덕츠코리아 구미공장, 한국산업가스"]],"createId":"SYSTEM","createDt":"2022-09-10T10:02:30.020Z","createTs":"1658306564","updateId":"SYSTEM","updateDt":"2022-09-10T10:02:30.020Z","updateTs":"1658306564","__v":0}]
                            }
                    }
                    }
                }
            }
        }
    }
}

export default getMultipleByType;