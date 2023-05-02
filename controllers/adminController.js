const admin=require('../models/adminModel')
const category=require('../models/categoryModel')
const bcrypt=require('bcrypt')
const product=require('../models/productModel')
const User=require('../models/userModel')
const Orders = require("../models/orderModel")
const mongoose = require('mongoose')
const {ObjectId} = mongoose.Types

const { findByIdAndUpdate } = require('../models/adminModel')


const loadAdmin=async(req,res)=>{
    try {
        console.log('loadAdmin');
        res.render('admin/adminLogin')
    } catch (error) {
        console.log(error.message);
    }
}




const adminVerify=async(req,res)=>{
    try {
        const email=req.body.email
        const password=req.body.password

    const adminData=await admin.findOne({email:email})
       if (adminData) {
           if(adminData.password===password){

            req.session.admin_id=adminData._id
            
            req.session.adminloggedIn=true
            res.redirect('/admin/adminHome')

           }else{
            res.render('admin/adminLogin',{message:'incorrect password'})
           }
       }else{
        res.render('admin/adminLogin',{message:'incorrect email'})
       }
    } catch (error) {
        console.log(error.message);
    }
}

const adminHome = async (req, res)=>{
    const proCount=await product.countDocuments()
    const userCount=await User.countDocuments()
    let revenue=await Orders.aggregate([{$group:{_id:null,total:{$sum:"$grandTotal"}}}])
    revenue=revenue[0]?.total
    const profit=revenue*1/5
    const orders=await Orders.find()
    let pending=0
    let cancelled=0
    let delivered=0
    orders.forEach(async(data)=>{
        if(data.orderStatus=="pending"){
            pending++
        }else if(data.orderStatus=="cancelled"){
            cancelled++
        }else if(data.orderStatus=="delivered"){
            delivered++
        } 
    }) 
    const data={
        products:proCount,
        delivered:delivered,
        cancelled:cancelled,
        pending:pending,
        totalUsers:userCount,
        totalProfit:profit,
        totalRevenue:revenue
    }
    res.render("admin/adminHome",{data});
}


const chartData=async(req,res)=>{
    try {
        const order=await Orders.aggregate([{$group:{_id:"$month",grandTotal:{$sum:"$grandTotal"}}}])
        res.json(order)
    } catch (error) {
        console.log(error)
    }
}



// const addProduct=async(req,res)=>{
//     try {
//         const product=new Product({
//             name:req.body.name,
//             product_id:req.body.product_id,
//             price:req.body.price,
//             image:req.body.image,
//             stock:req.body.stock
//         })
//     } catch (error) {
//         console.log(error.message);
//     }
// }


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



// const addNewcategory=async(req,res)=>{
//     try {
//         const category=await category.find()
//         if (category) {
//             res.redirect('admin/addCategory',{message:'category already exists'})
//         }else{
//             res.render('admin/category')
//         }
//     } catch (error) {
//         console.log(error);
//     }
// }

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
        const catData=await category.find()
        res.render('admin/addProduct',{catData})
        
    } catch (error) {
        console.log(error.message);
    }
    
    
    }



// const postProduct=async(req,res)=>{
//     try {
//         console.log(req.body);
//       const productCheck=await product.findOne({name:req.body.productName})
//       const catData = await category.find();
//        if(productCheck){
//         res.render('admin/addProduct',{catData,message:'The product is Already exists'})
//        }
//         else{
            
//                 const products=new product({
//                 name:req.body.productName,
//                 description:req.body.description,
//                 price:req.body.price,
//                 stock:req.body.stock,
//                 category:req.body.category,
//                 image:req.file.filename,
//                 })

//                 products.save().then(()=>{
//                     res.redirect('/admin/productList')
//                 })
//     }      
        
//     } catch (error) {
//         console.log(error);
//     }
// }



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
       const update = await product.findOneAndUpdate({_id:id},{$set:{name:req.body.name,description:req.body.description,category:req.body.category,price:req.body.price,image:req.body.image,stock:req.body.stock,}})
        
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





const userManage=async(req,res)=>{

    try {
        const userData=await User.find()
        res.render('admin/userManage',{user:userData})
        
    } catch (error) {
        console.log(error);
    }
    
    
    }

const blockUser=async(req,res)=>{
    try {
          const id=req.query.id
          const status=await User.findById({_id:id})
          if(status.status==true){
            const stat=await User.findByIdAndUpdate({_id:id},{$set:{status:false}})
          
          res.redirect('/admin/userManage')
          }
          else{
            const stat=await User.findByIdAndUpdate({_id:id},{$set:{status:true}})
            res.redirect('/admin/userManage')  
        }
    } catch (error) {
        console.log(error.message);
    }
}

const orderDetails=async(req,res)=>{
  try {
    
    const orders= await Orders.aggregate([{$unwind:"$products"},{$addFields:{orders:"$products"}},{ $project: {_id:1, orders:1, userId:1, deliveryAddress:1, grandTotal:1, paymentmethod:1, date:1, deliveryDate:1, orderStatus:1, "products.productId":{$convert:{input:{$toString:"$products.productId" },to:"objectId" }}}},{$lookup:{from:"products",localField:"products.productId",foreignField:"_id",as:"product_info"}}])


    res.render('admin/orderDetails',{orders})
  } catch (error) {
    console.log(error);
  }
}


const changestatus=async (req,res)=>{
      try {
        const id=req.body.id
        const value=req.body.value
        console.log(id,value);
        const orderDatas=await Orders.updateOne({_id:id},{$set:{orderStatus:value}})
        console.log(orderDatas);
        res.json({status:true})
      } catch (error) {
        console.log(error);
      }
}

const productOfferManagement=async(req,res)=>{
    try {
        const offer=await product.find()
         
  res.render('admin/productManagement',{offer})
    } catch (error) {
        console.log(error)
    }
}

const productOfferEdit=async(req,res)=>{
    try {
        const offers=await product.findOne({_id:new ObjectId(req.params.id)})
       
        
        res.render('admin/editProductManage',{offers})
    } catch (error) {
        console.log(error)
    }
}

const productOfferEditPost=async(req,res)=>{
    try {
        
        const products = await product.findOne({_id:new ObjectId(req.params.id)})
        const price = products?.originalPrice ?? products.price
        const disPer = Math.round((parseFloat(req.body.discountPrice)/price) * 100)
        let originalPrice=products?.originalPrice
        if(!originalPrice){

            originalPrice= products.price
        }
        const disPrice=(originalPrice - parseFloat(req.body.discountPrice)).toFixed(2)
        await product.updateOne({_id:new ObjectId(req.params.id)},{$set:{price:disPrice,originalPrice:originalPrice,discountPrice:req.body.discountPrice,discount:disPer}}) 
        res.redirect('/admin/productOffer')
    } catch (error) {
        console.log(error);
    }
}

const productOfferDelete=async(req,res)=>{
    try {
        const id=req.query.id;
        const status=await product.findById({_id:id})
        if(status.offerStatus==true){
           const stat=await product.findByIdAndUpdate({_id:id},{$set:{offerStatus:false}})
           res.redirect('/admin/productOffer')
        }else{
            const stat=await product.findByIdAndUpdate({_id:id},{$set:{offerStatus:true}})
           res.redirect('/admin/productOffer')
    } }catch (error) {
        console.log(error)
    }
}



const categoryOfferManagement=async(req,res)=>{
   try {
      const offers=await category.find()
         
     res.render('admin/categoryOfferManage',{offers})
   } catch (error) {
    console.log(error);
   }
}


const catOfferEdit=async(req,res)=>{
    try {
      const offers=await category.findOne({_id:new ObjectId(req.params.id)})
      console.log(offers)
          
       res.render('admin/catOfferEdit',{offers})
    } catch (error) {
        
    }
}

const catOfferEditPost=async(req,res)=>{
    try {
        const categories=await category.findOne({_id:new ObjectId(req.params.id)})
        await category.updateOne({_id:new ObjectId(req.params.id)},{$set:{discount:req.body.discount}})
        const products=await product.find({category:req.body.category})
        products.forEach(async (data)=>{
            const productId=data._id
            const price=data.price - (data.price*req.body.discount/100)
            await product.updateOne({_id:productId},{$set:{price:price}})
        })
        res.redirect('/admin/categoryOffer')
    } catch (error) {
        console.log(error)
    }
}

const catOfferDelete=async(req,res)=>{
    try {
        const id=req.query.id;
       
        const status=await category.findById({_id:id})
        if(status.offerStatus==true){
            const stat=await category.findByIdAndUpdate({_id:id},{$set:{offerStatus:false}})
            res.redirect('/admin/categoryOffer')
        }else{
            const stat=await category.findByIdAndUpdate({_id:id},{$set:{offerStatus:true}})
            res.redirect('/admin/categoryOffer')        
        }
    } catch (error) {
        console.log(error)
    }
}


const getDashboard=async(req,res)=>{
    try {
        const proDetails=await product.countDocuments()
        const orderDetails=await Orders.countDocuments()
        
        res.render('admin/adminHome',{proDetails,orderDetails})
    } catch (error) {
        console.log(error);
    }
}




const getSalesreport=async(req,res)=>{
    try {
       if(req.session.report){
        let salesData=req.session.report
        let orderInfo=req.session.report
        res.render('admin/salesReport',{salesData,orderInfo})
        req.session.report=null
       }else{
          const salesData= await Orders.aggregate([{$match:{orderStatus:"delivered"}},{$unwind:"$products"},{$addFields:{orders:"$products"}},{ $project: {_id:1, orders:1, userId:1, deliveryAddress:1, grandTotal:1, paymentmethod:1, date:1, deliveryDate:1, orderStatus:1, "products.productId":{$convert:{input:{$toString:"$products.productId" },to:"objectId" }}}},{$lookup:{from:"products",localField:"products.productId",foreignField:"_id",as:"product_info"}}])
        
         const userdata= await Orders.find({orderStatus:'delivered'}).populate('userId') 
         console.log(userdata,'wertyuiop')  
        res.render('admin/salesReport',{salesData,userdata})
    }
           
           
    
    } catch (error) {
        console.log(error);
    }
}



const salesReport=async(req,res)=>{
    try {
        const salesParams=req.query.name
        const startDate=req.query.startDate
        const endDate=req.query.endDate

 

        if(startDate&&endDate){
         const startDateObj=new Date(startDate)
         
         const endDateObj=new Date(endDate)
       
    // const salesData = await Orders.aggregate([
    //     { $match: { orderStatus: "delivered" } },
    //     { $unwind: "$products" },
    //     { $match: { deliveryDate: { $gte: startDateObj, $lte: endDateObj } } }
    //   ]);
        const salesData= await Orders.aggregate([{$match:{$and:[{orderStatus:"delivered"}, { deliveryDate: { $gte: startDateObj, $lte: endDateObj }}]}},{$unwind:"$products"},{$addFields:{orders:"$products"}},{ $project: {_id:1, orders:1, userId:1, deliveryAddress:1, grandTotal:1, paymentmethod:1, date:1, deliveryDate:1, orderStatus:1, "products.productId":{$convert:{input:{$toString:"$products.productId" },to:"objectId" }}}},{$lookup:{from:"products",localField:"products.productId",foreignField:"_id",as:"product_info"}}])
        console.log(salesData,"ooooo")
        res.render('admin/salesReport',{salesData})
        }else{
            const salesData= await Orders.aggregate([{$match:{orderStatus:"delivered"}},{$unwind:"$products"},{$addFields:{orders:"$products"}},{ $project: {_id:1, orders:1, userId:1, deliveryAddress:1, grandTotal:1, paymentmethod:1, date:1, deliveryDate:1, orderStatus:1, "products.productId":{$convert:{input:{$toString:"$products.productId" },to:"objectId" }}}},{$lookup:{from:"products",localField:"products.productId",foreignField:"_id",as:"product_info"}}])
            res.render('admin/salesReport',{salesData})
        }
    } catch (error) {
        console.log(error)
    }
}



// const getOrderManagement=async(req,res)=>{
//     try {
//     //   const OrderData = await Orders.find({products})
//     //   const OrderCount = await Orders.find({products}).count()
//     //   console.log(OrderCount);
//       res.render("admin/orderDetails")
//     } catch (error) {
//         console.log(error)
//     }
// }

// const postStatus=async(req,res)=>{
//     try {
//         const orderId=req.body.orderId;
//         const statusData=req.body.orderStatus;
//         const orderDatas=await Order.updateOne({_id:orderId},{$set:{orderStatus:"Delivered",paymentStatus:"paid"}}).then((data)=>{
//             res.send({success:true})
//         })
//     } catch (error) {
//         console.log(error);
//     }
// }







module.exports={
    loadAdmin,
    adminVerify,
    addProduct,
    
    getCategory,
    getProduct,
    // getAddcategory,
    // postCategory,
    // editCategory,
    // postEdit,
    // postProduct,
    // editProduct,
    // repost,
    // deleteProduct,
    // deleteCategory,
    userManage,
    blockUser,
    adminHome,
    orderDetails,
    changestatus,
    productOfferManagement,
    productOfferEdit,
    productOfferEditPost,
    productOfferDelete,
    categoryOfferManagement,
    catOfferEdit,
    catOfferEditPost,
    catOfferDelete,
    getDashboard,
    getSalesreport,
    salesReport,
    chartData
    
}







