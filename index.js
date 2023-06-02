import app from './app.js'

app.listen(process.env.PORT,()=> {
    console.log("3D AMS API Service on port " + process.env.PORT);
})