const admin=require('../models/adminModel')
const category=require('../models/categoryModel')
const bcrypt=require('bcrypt')
const product=require('../models/productModel')
const User=require('../models/userModel')
const Orders = require("../models/orderModel")
const mongoose = require('mongoose')
const {ObjectId} = mongoose.Types

const { findByIdAndUpdate } = require('../models/adminModel')

const getCategory=async(req,res)=>{
    try {
        const catData=await category.find()
        res.render('admin/category',{catData})

    } catch (error) {
        console.log(error.message);
    }
}

const getAddcategory=async(req,res)=>{
    try {
        res.render('admin/addCategory')
    } catch (error) {
        console.log(error);
    }
}


const postCategory=async(req,res)=>{
    try {
        
        const categorycheck=await category.findOne({name:req.body.categoryName})
        if(categorycheck){
            
            res.render('admin/addCategory', { message: "Already exists" })
        }else{
        const cat = new category({
            name:req.body.categoryName,
            description:req.body.description
        })
        cat.save().then(()=>[
            res.redirect("/admin/category")
        ])
    }
    } catch (error) {
        console.log(error);
    }
}


const editCategory=async(req,res)=>{
    try {
        const id=req.query.id;
        const catData=await category.findOne({_id:id})
        res.render('admin/editCategory',{catData})
    } catch (error) {
        console.log(error);
    }
}


const deleteCategory=async(req,res)=>{
    try {
        const id=req.query.id;
        console.log(id);
        const status=await category.findById({_id:id})
        if(status.status==true){

            const stat=await category.findByIdAndUpdate({_id:id},{$set:{status:false}})
            res.redirect('/admin/category')
        }else{
            const stat=await category.findByIdAndUpdate({_id:id},{$set:{status:true}})
            res.redirect('/admin/category')
        }
    } catch (error) {
        console.log(error);
    }
}


const postEdit=async(req,res)=>{

    try {
         const id=req.query.id;
         const name=req.body.categoryName;
         const description=req.body.description;
        const catData=await category.updateOne({_id:id},{name:name,description:description}).then(()=>{
            res.redirect('/admin/category')
        })
        console.log(catData);
    
    } catch (error) {
        console.log(error);
        
    }
}


module.exports={
    getCategory,
    getAddcategory,
    postCategory,
    editCategory,
    postEdit,
    deleteCategory


}