const Banner=require('../models/bannermodel')
const UUID=require('uuid')
const { default: mongoose } = require('mongoose')
const {ObjectId} = mongoose.Types
const insId = require("../middleware/multer").insId


const getBanner=async(req,res)=>{
    try{
        let bannerData=await Banner.find()
        
        res.render('admin/banners',{bannerData})
    }catch(err){
        console.log(err)
    }

}
const getEditBanner=async(req,res)=>{
    try{
        res.render('admin/editBanner')

    }catch(err){
        console.log(err)
    }

}
const getAddBanner=async(req,res)=>{
    try{
        res.render('admin/addBanner')
    }catch(err){
        console.log(err)
    }
}

const postBanner=async(req,res)=>{
    try{
        console.log(req.body);
        console.log(req.file)
        const data = {}
        data.main = req.body.main
        data.sub = req.body.sub
        data.bannerImg = req.file.filename
        Banner.insertMany(data)
        res.redirect('/admin/banner')
    }catch(err){
        console.log(err)
    }

}

const disableBanner=async(req,res)=>{
    try {
        const id=req.query.id;
        console.log(id)
        const status=await Banner.findById({_id:id})
        if(status.bannerStatus==true){
            const stat=await Banner.findByIdAndUpdate({_id:id},{set:{bannerStatus:false}})
            res.redirect('/admin/banner')
        }else{
            const stat=await Banner.findByIdAndUpdate({_id:id},{set:{bannerStatus:true}})
            res.redirect('/admin/banner') 
        }
    } catch (error) {
        
    }
}

module.exports={
    getBanner,
    getAddBanner,
    getEditBanner,
    postBanner,
    disableBanner
}

