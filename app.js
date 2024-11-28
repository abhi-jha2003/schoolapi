const express=require('express');
const dotenv=require('dotenv');
const  schoolRoute=require("./route/school.route.js")
dotenv.config();
const app=express();
const port=process.env.PORT ||3000;
const connectToDatabase=require('./db/server.js');
const createSchoolTable=require("./models/school.js")

app.use(express.json());
createSchoolTable();
app.use("/api/v1/schoolmangament",schoolRoute);
app.listen(port,()=>{
connectToDatabase();
    console.log(`Server is running on port ${port}`);
});






app.get("*",(req, res)=>{
    res.send("oops This page doesn't exist");
})