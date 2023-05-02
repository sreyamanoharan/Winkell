const Coupon=require("../models/couponModel")
const User=require('../models/userModel')

const getCoupon=async(req,res)=>{
    try {
        const couponData=await Coupon.find()
        res.render('admin/couponmanagement',{couponData})
    } catch (error) {
        console.log(error);
    }
}

const getAddCoupon=async(req,res)=>{
    try {
        res.render('admin/addcoupon')
    } catch (error) {
        console.log(error);
    }
}

const addCoupon = async(req,res)=>{
    try {
      const couponcode = req.body.couponcode;
      const couponData = new Coupon({
        code:req.body.couponcode,
        available:req.body.available,
        amount:req.body.amount,
        minAmount:req.body.minAmount,
        expiry:req.body.expiryDate,
        status:req.body.couponstatus
      })
      const coupdata = await Coupon.findOne({code:couponcode});
      if(!coupdata){
        couponData.save().then((data)=>{
          res.redirect('/admin/couponmanagement')
        })
      }else{
        res.render('admin/addcoupon',{message:"This coupon already Applied"})
        
      }
     
    } catch (error) {
    
      console.log(error);
    }
  }


const geteditcoupon = async(req,res)=>{
    try {
      const id = req.query.id;
      console.log(id);
      const coupondata = await Coupon.findOne({_id:id})
       res.render('admin/editcoupon',{coupondata})
     
    } catch (error) {
      console.log(error);
    }
  }
  // !!!! Submit Edit coupon
const submitEditCoupon = async(req,res)=>{
    try {
      const id = req.query.id;
      
      const data = {
        code:req.body.eidtedcode,
        available:req.body.editedavail,
        amount:req.body.editedamount,
        minAmount:req.body.editedMinAmount,
        expiry:req.body.editedexpiry,
        status:req.body.editedstatus
      };
    
      const updated = await Coupon.updateOne({_id:id},{$set:{code:data.code,available:data.available,amount:data.amount, minAmount:data.minAmount,expiry:data.expiry,status:data.status}}).then((data)=>{
        res.redirect("/admin/couponmanagement")
      })
      
    } catch (error) {
      console.log(error);
    }
  }
  // !!!  Delete Coupon
const deleteCoupon = async(req,res)=>{

    try {
      const id = req.body.couponid;
      const coupondata = await Coupon.deleteOne({_id:id}).then((data)=>{
        res.json({success:true})
      })
      
    } catch (error) {
      console.log(error);
    }
  }

  const applyCoupon=async(req,res)=>{
    try {
      let obj={}
      let price=req.body.price
      const couponDetails=await Coupon.findOne({code:req.body.coupon})
      const userData = await User.findOne({_id:req.session.user._id})
      let original = userData.cart.originalPrice ?? userData.cart.totalPrice
     
      if(!couponDetails){
        obj.status=false
        obj.response="coupon does not exist"
      }else if(couponDetails.status!="Active"){
        obj.status=false
        obj.response="coupon is not active"
        }else if(couponDetails.available<=0){
          obj.status=false
          obj.response="no enough quantity"
        }else if(couponDetails.minAmount>price){
          obj.status=false
          obj.response="min purchase amount ₹"+couponDetails.minAmount
        }else if(userData.cart.applied==req.body.coupon){
            obj.status=false
            obj.response="Coupon already in use"
        }else{
          obj.status=true
          obj.response="coupon Applied"
          obj.disprice=original-couponDetails.amount
          req.session.discAmt=obj.disprice
          await Coupon.updateOne({code:req.body.coupon},{$inc:{"available":-1}})
          await User.updateOne({_id:req.session.user._id},{$set:{"cart.applied":req.body.coupon,"cart.originalPrice":original,"cart.totalPrice":obj.disprice}})
        }
        console.log(userData.cart.applied, req.body.coupon, original);
      res.json(obj)
    } catch (error) {
      console.log(error);
    }
  }



module.exports={
    getCoupon,
    getAddCoupon,
    addCoupon,
    geteditcoupon,
    submitEditCoupon,
    deleteCoupon,
    applyCoupon
}