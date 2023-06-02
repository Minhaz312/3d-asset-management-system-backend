import downloadGlbFile from "./asset-helpers/downloadGlbFile.js";
import getModelsMetadata from "./asset-helpers/getModelsMetadata.js";
import getMultipleByType from "./asset-helpers/getMultipleByType.js";
import getPaginated from "./asset-helpers/getPaginated.js";
import readGlb from "./asset-helpers/readGlb.js";
import registerSingle from "./asset-helpers/registerSingle.js";
import single from "./asset-helpers/single.js";
import deleteById from "./type-helper/delete.js";
import getAll from "./type-helper/getAll.js";
import register from "./type-helper/register.js";
import updateById from "./type-helper/updateById.js";
import deleteUser from "./user-helper/deleteUser.js";
import login from "./user-helper/login.js";
import signup from "./user-helper/signup.js";
import updateUser from "./user-helper/update.js";
import modelsMetadata from "./asset-helpers/modelsMetadata.js";

const documentation = {
    openapi:"3.0.0",
    info:{
        title:"3D AMS APIs",
        version:"1.0.0"
    },
    components:{
        securitySchemes:{
            bearerAuth:{
                type: "apiKey",
                in: "header",
                name: "Authorization"
            }
        }
    },
    security:[
        {bearerAuth:[]}
    ],
    consumes: [
        "application/json",
        "multipart/form-data"
    ],
    produces: [
        "application/json",
        "multipart/form-data"
    ],
    servers:[
        {
            url:`http://220.118.147.52:46120`,
            description:"TEST Server"
        },
        {
            url:`http://220.118.147.52:31200`,
            description:"DEV Server"
        },
        {
            url:`http://220.118.147.52:41200`,
            description:"STG Server"
        },
        {
            url:`http://220.118.147.52:51200`,
            description:"OPS Server"
        },
        {
            url:`http://172.50.1.60:51200`,
            description:"OPS Gumi 1"
        },
        {
            url:`http://172.50.1.61:51200`,
            description:"OPS Gumi 2"
        },
        {
            url:`http://172.50.3.69:51200`,
            description:"OPS Gumi LB"
        },
        {
            url:`http://localhost:${process.env.PORT}`,
            description:"Local Server"
        },
    ],

    tags:[
        {
            name:"Assets",
            description:"Asset query routes"
        },
        {
            name:"Asset Groups",
            description:"Type query routes"
        },
        {
            name:"Users",
            description:"User query routes"
        },
    ],
    paths:{
        "/api/asset/modelsMetadata" : modelsMetadata,
        "/api/asset/get-single-model-by/{id}":single,
        "/api/asset/get-model-by/{page}/{rowPerPage}/{currentType}":getPaginated,
        "/api/asset/modelsMetadata":getModelsMetadata,
        "/api/type/get/all":getAll,
        "/api/type/register":register,
        "/api/type/delete/{type}/{id}":deleteById,
        "/api/type/update/{id}":updateById,
        "/api/user/create":signup,
        "/api/user/login":login,
        // "/api/user/update":updateUser,
        "/api/user/delete/{id}":deleteUser,
        "/api/asset/register/single":registerSingle,
        "/api/asset/download/{Resolution}/{Filename}":downloadGlbFile,
        "/storage/3d-model/{fileId}":readGlb,
    }
}

export default documentation;