import * as dotevn from 'dotenv'
dotevn.config()
import express from "express";
import cors from 'cors';
import bodyParser from "body-parser";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import swaggerUi from 'swagger-ui-express'

import assetRouter from "./router/assetRoute.js";
import typeRouter from "./router/typeRouter.js";

import { getSingleModelFromGridfsByFileId } from './controller/ModelController.js';
import Auth from './middleware/AuthMiddleware.js';
import userRouter from './router/userRoute.js';
import documentation from './doc/documentation.js';


const app = express()

app.use(cors());
app.use(bodyParser.json({limit: "30mb"}));
app.use(express.json());
app.use(rateLimit({
  windowMs: 1*60*1000,
  max: 1000,
  standardHeaders:false,
  legacyHeaders:false
}));

app.use("/docs", swaggerUi.serve);
app.use("/docs", swaggerUi.setup(documentation));

const url = process.env.MONGODB_CONNECTION_STRIN;
mongoose.connect(url).then(res => {}).catch(err => {
  console.log(err);
});

// 3d ams api service
app.use("/3d-models", express.static("3d-models"));
app.use("/api/asset", assetRouter);
app.use("/api/type", typeRouter);
app.use("/api/user", userRouter);

// 3d ams file viewer
app.get("/storage/3d-model/:fileId",(req,res)=>{
    getSingleModelFromGridfsByFileId(req,res)
})

// 3d ams ui service
// app.use("/map", express.static("dist/map"));
app.use("/", express.static("dist"));

export default app;
