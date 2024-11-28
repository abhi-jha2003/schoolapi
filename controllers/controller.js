const express=require('express');
const { v4: uuidv4 } = require('uuid');
const connectToDatabase=require("../db/server.js");

const  addSchool=async(req,res)=>{
    const connection=await connectToDatabase();
    try {
        const {name,address,latitude,longitude}=req.body;
if(!name || !address || !latitude || !longitude){
   return res.status(400).json({message:"something is missing",success:false})
}
if (isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({ message: "Latitude and Longitude must be valid numbers", success: false });
}
if (latitude < -90 || latitude > 90) {
    return res.status(400).json({ message: "Latitude must be between -90 and 90", success: false });
}

if (longitude < -180 || longitude > 180) {
    return res.status(400).json({ message: "Longitude must be between -180 and 180", success: false });
}
const checkQuery = `SELECT * FROM schools WHERE latitude BETWEEN ? AND ? AND longitude BETWEEN ? AND ?`;
        const latitudeRangeStart = latitude - 0.0001;
        const latitudeRangeEnd = latitude + 0.0001;
        const longitudeRangeStart = longitude - 0.0001;
        const longitudeRangeEnd = longitude + 0.0001;

        const [existingSchool] = await connection.execute(checkQuery, [
            latitudeRangeStart, latitudeRangeEnd, longitudeRangeStart, longitudeRangeEnd
        ]);

if (existingSchool.length > 0) {
  return res.status(400).json({ message: "A school with these coordinates already exists", success: false });
}

const q=`INSERT INTO schools(name,address,latitude,longitude) VALUES(?,?,?,?)`;
let [result]=await connection.execute(q,[name,address,latitude,longitude]);
const newSchoolId = result?.insertId;
if(result.affectedRows>0){
   return  res.status(200).json({message:"school added successfully",newSchoolId,success:true})
}else{
    console.log("data not added");
}
    } catch (error) {
        console.log(error);
    }
    finally{
       await connection.end();
    }





}


const listSchools=async(req,res)=>{
const {longitude,latitude}=req.query;
if(!longitude || !longitude){
    return res.status(400).json({message:"something is missing",success:false});
}
if (isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({ message: "Latitude and Longitude must be valid numbers", success: false });
}
if (latitude < -90 || latitude > 90) {
    return res.status(400).json({ message: "Latitude must be between -90 and 90", success: false });
}

if (longitude < -180 || longitude > 180) {
    return res.status(400).json({ message: "Longitude must be between -180 and 180", success: false });
}
try {
    

const connection=await connectToDatabase();
const query = `
SELECT 
    id, 
    name, 
    address, 
    latitude, 
    longitude,
    (6371 * ACOS(
        COS(RADIANS(?)) * COS(RADIANS(latitude)) * 
        COS(RADIANS(longitude) - RADIANS(?)) + 
        SIN(RADIANS(?)) * SIN(RADIANS(latitude))
    )) AS distance
FROM 
    schools
ORDER BY 
    distance ASC;
`;

const [results] = await connection.execute(query, [latitude, longitude, latitude]);
return res.status(200).json({success: true,data:results});
} catch (error) {
    console.log("Error: " , error);
}
finally{
    await connection.end();
}

}



module.exports = {addSchool,listSchools};
