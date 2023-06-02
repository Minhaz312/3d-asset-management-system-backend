import mongoose from 'mongoose';
const ModelsFilesModel = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId},
    length : Number,
    chunkSize : Number,
    uploadDate : Date,
    filename : String,
    contentType : String,
    metadata : {
		fileId :{ type: mongoose.Types.ObjectId},
		author : String,
		blockName : String,
		complex : Number,
		height : Number,
		modelType : String,
		modelOwners : [String],
		orientation : {
			heading : Number,
			pitch : Number,
			roll : Number
		},
		position : {
			longitude : Number,
			latitude : Number,
			altitude : Number
		},
		filename : String,
		filename2 : {type:String,default:""},		
		mapDiv : {type:String,default:""},	
		origin: [Number],	
		resolution : Number,
		scale : Number,
		unique : { type: Boolean },
		use : { type: Boolean },
		createdAt : String,
		updatedAt : String,
		firstTime : Number,
		lastTime : Number
      }
}, {
versionKey: false 
});
mongoose.pluralize(null);
export default ModelsFilesModel;