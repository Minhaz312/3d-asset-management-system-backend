import mongoose from "mongoose"


const ModelsChunksModel = mongoose.connection.db.collection("models.chunks")

export default ModelsChunksModel