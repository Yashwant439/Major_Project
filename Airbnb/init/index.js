require("dotenv").config();

const mongoose = require("mongoose")
const initData = require("./data.js")
const Listing = require("../models/listing.js")

const dbUrl = process.env.ATLASDB_URL
// const dbUrl = "mongodb://127.0.0.1:27017/wanderlust"

main()
    .then(()=>{
        console.log("DB is connected")
    })
    .catch((err)=>{
        console.log("DB not connected",err)
    })
async function main() {
    mongoose.connect(dbUrl)
}

const initDB = async()=>{
    await Listing.deleteMany({})
    await Listing.insertMany(initData.data)
    console.log("Data was initialized")
//     const dbCount = await Listing.countDocuments();
//     console.log(`Database now contains ${dbCount} documents`);
}

initDB()