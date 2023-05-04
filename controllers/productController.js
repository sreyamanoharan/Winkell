const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const product = require('../models/productModel')
const Category = require('../models/categoryModel')
const Order = require('../models/orderModel')
const nodemailer = require('nodemailer')
const randomstring= require('randomstring')
const mongoose = require('mongoose')
const {ObjectId} = mongoose.Types
const config=require('../config/config')



const getProduct=async(req,res)=>{
    try {
      const productData=await product.find()
      res.render('admin/productList',{productData})
    } catch (error) {
        console.log(error.message);
    }
}



const addProduct=async(req,res)=>{

    try {
        const catData=await Category.find()
        res.render('admin/addProduct',{catData})
        
    } catch (error) {
        console.log(error.message);
    }
    
    
    }



const postProduct=async(req,res)=>{
    try {
        
      const productCheck=await product.findOne({name:req.body.productName})
      const catData = await Category.find();
       if(productCheck){
        res.render('admin/addProduct',{catData,message:'The product is Already exists'})
       }
        else{
                const products=new product({
                name:req.body.productName,
                description:req.body.description,
                price:req.body.price,
                originalPrice:req.body.price,
                stock:req.body.stock,
                category:req.body.category,
                image:req.file.filename,
                })

                products.save().then(()=>{
                    res.redirect('/admin/productList')
                })
    }      
        
    } catch (error) {
        console.log(error);
    }
}



const editProduct=async(req,res)=>{
    try {
        const id=req.query.id;
        console.log( );
        const productData=await product.findOne({_id:id})
        res.render('admin/editProduct',{productData})
        console.log(editProduct);
    } catch (error) {
        console.log(error);
    }
}



const repost=async(req,res)=>{
    try {
        const id=req.query.id
        console.log(id)
       const update = await product.findOneAndUpdate({_id:id},{$set:{name:req.body.name,description:req.body.description,Category:req.body.Category,price:req.body.price,image:req.body.image,stock:req.body.stock,}})
        
        if(update){
        res.redirect('/admin/productList')
        }
    } catch (error) {
        console.log(error.message);
    }
}



const deleteProduct=async(req,res)=>{
    try {
        const id=req.query.id
     console.log(id);
     const status=await product.findById({_id:id})
     if(status.status==true){

     const stat=await product.findByIdAndUpdate({_id:id},{$set:{status:false}}) 
     res.redirect('/admin/productList')
     }else{
        const stat=await product.findByIdAndUpdate({_id:id},{$set:{status:true}}) 
        res.redirect('/admin/productList')
     }

    } catch (error) {

        console.log(error.message);
    }
}







module.exports = { 
  
    getProduct,
    addProduct,
    postProduct,
    editProduct,
    repost,
    deleteProduct

}