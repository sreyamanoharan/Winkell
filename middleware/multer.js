const multer = require("multer")
const path = require("path")
const Banner = require("../models/bannermodel");

const storage= multer.diskStorage({
        destination:function(req,file,cb){
         cb(null,path.join(__dirname,'../public/banner'));
        },
        filename:function(req,file,cb){
        const name=Date.now()+'-'+file.originalname;
        cb(null,name)
        }
    });

module.exports = {storage};