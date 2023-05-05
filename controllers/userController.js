const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const productSchema = require('../models/productModel')
const Category = require('../models/categoryModel')
const Order = require('../models/orderModel')
const nodemailer = require('nodemailer')
const randomstring= require('randomstring')
const mongoose = require('mongoose')
const {ObjectId} = mongoose.Types
const config=require('../config/config')
const Razorpay=require('razorpay')
const crypto=require('crypto')
const Banner = require("../models/bannermodel")
const instance=new Razorpay({
    key_id:"rzp_test_RjzSIGSnQY9srl",
    key_secret:	"rGZgRo8zYXLxvTbjzMXxHNH3"

});




const accountId = process.env.TWILIO_ACCOUNT_SID
const authId = process.env.TWILIO_AUTH_TOKEN
const serviceId = process.env.TWILIO_SERVICE_SID
const client = require('twilio')(accountId, authId)


const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10)
        return passwordHash
    } catch (error) {
        console.log(error.message);
    }
}

const sendVerifyMail=async(name,email,user_id)=>{

    try {
        const transporter=nodemailer.createTransport({

            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:config.emailUser,
                pass:config.emailPassword
            }
        });
        const mailOptions={
            from:'sreyampk@gmail.com',
            to:email,
            subject:'for verifying mail',
            html:'<p>Hii'+ name+' ,please click here to <a href="http://localhost:3000/verify?id='+user_id+'">verify</a> your mail.</p>'

        }
        transporter.sendMail(mailOptions, function(error,info){

           if(error){
            console.log(error);
           }else{
            console.log("email hasbeen send :-,info.response ");
           }

        })
    } catch (error) {
        
        console.log(error);
    }


}


const sendResetPasswordMail = async(name,email,token)=>{

    try {
        console.log(token,"token")
        const transporter=nodemailer.createTransport({

            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:config.emailUser,
                pass:config.emailPassword
            }
        });
        const mailOptions={
            from:config.emailUser,
            to:email,
            subject:'for Reset Password',
            html:'<p>Hii'+ name+' ,please click here to <a href="http://localhost:3000/forget-password?id='+token+'">Reset</a> your password</p>'

        }
        transporter.sendMail(mailOptions, function(error,info){

           if(error){
            console.log(error);
           }else{
            console.log("email hasbeen send :-,info.response ");
           }

        })
    } catch (error) {
        
        console.log(error);
    }


}




const verifyMail=async(req,res)=>{
try {
    let login = false;
        if(req.session.user){
            login=true;
        }
   const updateInfo= await User.updateOne({_id:req.query.id},{$set:{is_verified:1}})
    console.log(updateInfo);
    res.render('email-verified',{login});

} catch (error) {
    console.log(error);
}

}


const loadRegister = async (req, res) => {
    try {
        let login = false;
        if(req.session.user){
            login=true;
        }
        res.render('registration',{login})

    } catch (error) {
        console.log(error);
    }
}

const insertUser = async (req, res) => {
   
    try {
        let login = false;
        if(req.session.user){
            login=true;
        }
        const mail=req.body.email; 
        const spassword = await securePassword(req.body.password)
        const userDatas=await User.find({email:mail})
console.log("hei",req.body)
console.log(userDatas);
if(userDatas.length<=0){
         
        console.log("hiiii");
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mno,
            password: spassword,
            is_admin:0,
          
        });

        console.log("hiiii",user)
    const userData = await user.save()
    // res.redirect('/');

// console.log("daata",userData)

        if (userData) {

            sendVerifyMail(req.body.name,req.body.email,userData._id)
            res.render('registration', { message: 'your registration has been successul verify your mail' ,login})
        }
        else {
           
            res.render('registration', { message: 'your registration hasbeen unsuccessul' ,login})
        }
    }
    else{
        res.render('registration', { message: 'this mail is already exist' ,login})
    }

    } catch (error) {

        console.log(error.message);
    }
}


//user login

const loginLoad = async (req, res) => {

    try {
        let login = false;
        if(req.session.user){
            login=true;
        }
        
        res.render('login',{login});
    } catch (error) {
        console.log(error.message);
    }
}

const verifyLogin = async (req, res) => {

    try {
        let login = false;
        if(req.session.user){
            login=true;
        }
        


        const email = req.body.email
        const password = req.body.password

        const userData = await User.findOne({ email: email });
        const banner = await Banner.find({})

      
        if (userData) {
            // console.log(userData.password);

            const passwordMatch =await bcrypt.compare(password, userData.password)
            if(passwordMatch){
                if(userData.is_verified === 0 ){
                    res.render('login',{message:"please verify your mail",login})
                }else{
                    req.session.user = userData
                    res.redirect('/home')
                }
            }else{
                res.render('login',{message:"email and password is inccorect",login})
            }

            
        } else {
            res.render('login',{message:"email and password is inccorect",login})
        }

    } catch (error) {
        console.log(error.message);
    }
}

const loadHome = async (req, res) => {

    try {
        let login = false;
        if(req.session.user){
            login=true;
        }
        const banner = await Banner.find({})
        console.log(banner);

        const products=await productSchema.find().sort({_id:-1}).limit(4)
        res.render('home',{login,banner,products});

    } catch (error) {
        console.log(error.message);
    }
}

const loadShop = async (req, res) => {

try{
    let login = false;
    if(req.session.user){
        login=true;
    }
     const category=req.query.category
     let categoryData=await Category.find()
     let user=req.session.user;
     let products;
     if(category){
      products=await productSchema.find({category:category,status:true})
     if(products.length==0){
         filtermsg='no result found'
      }
      }else{
        products=await productSchema.find({status:true})
      }
     console.log(products)
      res.render('shop',{products,user,categoryData,login})

    }
    catch(error){

          console.log(error);

    }


    



    // try {
    //    const data = await productSchema.find()
    //     res.render('shop', { product: data })
    // } catch (error) {
    //     console.log(error.message);
    //  }
}

const loginotpLoad = async (req, res) => {
    try {
        let login = false;
        if(req.session.user){
            login=true;
        }
        res.render('mobile',{login})
    } catch (error) {
        console.log(error.message);
    }
}

const verifyPhone = async (req, res) => {
    try {
        let login = false;
        if(req.session.user){
            login=true;
        }
        const num = req.body.num
        const check = await User.findOne({ mobile: num })
        console.log(check, "verify phoneeeee");
        if (check) {
            console.log(serviceId);
            client.verify.
                v2.services(serviceId)
                .verifications.create({
                    to: "+91" + num,
                    channel: "sms"
                }).then((verification) => {
                    console.log(verification.status)
                }).catch((err)=>{
                    console.log(err);
                })

            res.render('otpLogin', { num ,login})
        } else {
            res.render('mobile', { message: "did not register this mobile number" ,login})
        }


    } catch (error) {
        console.log(error.message);
    }
}








// const verifyMail=async(req,res)=>{
//     try {
//         const updateInfo= await User.updateOne(
//             {_id:req.query.id},
//             { $set: {is_verified:1}}
//         );

//         res.render('email verified')
//     } catch (error) {
//         console.log(error);
//     }
// }




const verifyOtp = async (req, res) => {
    try {
        let login = false;
        if(req.session.user){
            login=true;
        }
        
        const num = req.body.mno
        console.log(num)
        const otp = req.body.otp
        client.verify.
        v2.services(serviceId)
        .verificationChecks.create({
                to: "+91"+num,
                code: otp

            }).then((verification_check)=>{
            console.log(verification_check.status)
        if (verification_check.status == 'approved') {
            const login=true;
            res.render('home',{login});

        } else {

            res.render('otpLogin', { message: "otp is incorrect",num})
        }
    })
    } catch (error) {
        console.log(error.message);
    }
}


const forgetPasswordLoad=async(req,res)=>{

    try {
        let login = false;
        if(req.session.user){
            login=true;
        }
        const token=req.query.id;
        console.log(token,"1")
        const tokenData=await User.findOne({token:token})
        console.log(tokenData,"2");
        if(tokenData){
            res.render('forget-password',{userid:tokenData._id,login});
        }else{
            res.render('404',{message:'token is invalid',login})
        }

    } catch (error) {
        console.log(error);
    }
}







const loadProfile=async (req,res)=>{
    
try {
    let login = false;
        if(req.session.user){
            login=true;
        }
    const session=req.session.user._id
    console.log(session);
    if(req.session.user){
            const userData=await User.findOne({_id:session})
        res.render('userProfile',{userData,login})
    }else{
        res.redirect("/login")
    }
    
} catch (error) {
    console.log(error.message);
}

}



const forgetLoad=async(req,res)=>{

    try {
        let login = false;
        if(req.session.user){
            login=true;
        }
          res.render('forget',{login})
    } catch (error) {
        console.log(error);
    }
  
    // try {
    // const token=req.query.token;
    // const tokenData=await User.findOne({token:token})  

    // if(tokenData){
    //      res.render('forget',{user_id:tokenData._id})
    //     }
   

    // } catch (error) {
    //     console.log(error);
    // }
};

const forgetVerify=async(req,res)=>{
    try {
        let login = false;
        if(req.session.user){
            login=true;
        }
        const email=req.body.email
       const  userData= await User.findOne({email:email});
         
        if(userData){
             
              if(userData.is_verified ===0){

                res.render('forget',{message:'please verify your mail',login})
                console.log("wronggg");

              }else{
                const randomString=randomstring.generate();  
                console.log(randomString,"random")
                const updatedData=await User.updateOne({email:email},{$set:{token:randomString}})
                sendResetPasswordMail(userData.name,userData.email,randomString);
                res.render('forget',{message:'please check your mail to reset your password',login})
                console.log("truee");
            }


        }else{
             res.render('forget',{message:'Mail is incorrect',login})
        }


    } catch (error) {
        console.log(error);
    }
}


const resetPassword=async(req,res)=>{
    try {
        
        const password=req.body.password;
        console.log(password)
        const user_id=req.body.user_id;
        const secure_password=await securePassword(password)
       const updatedData= await User.findByIdAndUpdate({_id:user_id},{$set:{password:secure_password ,token:'' }})
           
       res.redirect('/')
    } catch (error) {
        console.log(error);
    }
}






const checkOutPage=async(req,res)=>{
                  
      try {
        let login = false;
        if(req.session.user){
            login=true;
        }
        const userId= req.session.user._id
        const user=await User.findOne({_id:userId})
        console.log(user);
        res.render('checkOut',{user,login})

      } catch (error) {
        console.log(error);
      }
              

}





// const checkOutPage=async(req,res)=>{

//     try {
//         let index=0
//         if(req.query.index){
//             index=req.query.index
//         }
//         const userId=req.session.user._id
//         const userData=await User.find({_id:userId});
//         console.log(userData);
//         let Cart=await cart
//         .findOne({_id:userId}).populate('cart.items.productId')
//         console.log(Cart);
//         if(cart&&cart.products.length==0){
//             cart=null
//         }
//         res.render('checkOut',{user:userData,index,Cart})

        
//     } catch (error) {
//         console.log(error);
//     }
// }


const loadCart=async(req,res)=>{
    try {
        let login = false;
        if(req.session.user){
            login=true;
        }
        if(req.session.user){
            const id = req.session.user._id; 
            const cartData = await User.findOne({_id:id}).populate("cart.items.productId")
            console.log(cartData.cart.items);
            res.render('cart',{cartData,id,login})
        }else{
            res.redirect("/login")
        }
       
    } catch (error) {
        console.log(error.message);
    }
}



 const addTocart=async(req,res)=>{
    try {

        const product_Id=req.body.productId
        const id=req.session.user._id
        const productData = await productSchema({_id:product_Id})
        const product=await productSchema.findOne({_id:product_Id})
        let user=await User.findOne({_id:id})
        const indexNumber = user.cart.items.findIndex((productItem) => {
           
            return (
              new String(productItem.productId).trim() ==
              new String(productData._id).trim()
        );
    });
        console.log(indexNumber,"index is here  ");
        if(indexNumber>=0){
            let result=await User.updateOne(
                {_id: id,"cart.items.productId":new ObjectId(product_Id)},
                    {$inc: {
                        "cart.totalPrice": product.price,
                        "cart.items.$.qty":1
                    }
                }
            );
            console.log(result)
            res.send(true)
        }else{
            
            console.log(product)
            const userData=await User.findOne({id})
            const result = await User.updateOne(
                {_id: id},
                {
                    $push: {
                        "cart.items": {
                            productId:new ObjectId(product._id) ,
                            
                            price: product.price,
                            productTotalprice:product.price
                        }
                    },
                    $inc: {
                        "cart.totalPrice": product.price
                        
                    }
                }
            );
            console.log(result)
            if(result){
                res.send(true)
            }
            else{
                console.log('not added to cart');
            }
        }
    } catch (error) {
        console.log(error);
    }
}


 const changeProQnty=async(req,res)=>{
    try {
        console.log(req.body);
        const userid=req.body.user
        const proid=req.body.product

        let count=parseInt(req.body.count);
        count=parseInt(req.body.count);
        total = parseFloat(req.body.price) * count
        if(req.session.user){
            console.log(proid);
            
            await User.updateOne({_id:userid, 'cart.items.productId':proid},
            {$inc:{'cart.items.$.qty':count,'cart.totalPrice':total}}
            );
            res.json({success:true});
         
        }else{
            res.redirect('/admin/cart')
        }
    } catch (error) {
        console.log(error);
    }
 }



const proceed=async(req,res)=>{

   try {
    let current=req.body.address.trim()
    let addressInfo=await User.aggregate([{$unwind:'$address'},{$match:{"address._id":new ObjectId(current)}}])
    addressInfo=addressInfo[0]
    user=req.session.user.name
    const orderId=crypto.randomBytes(16).toString('hex')
    let status='Pending'
    const id=req.session.user._id
    if(!req.body.paymentmethod){
        return
    }
    req.session.paymentmethod=req.body.paymentmethod

    let userData=await User.findOne({_id:id})
    let items = userData
    items.cart.items.forEach(async (data)=>{
     let qty=parseInt(data.qty)
    let product=productSchema.findOne({_id:data.productId})
    if(product.stock<=qty){
        console.log('edwdwqdwdwq');
     res.json({err:true,data:""+product.name+" no enough quantity"}) 
     return false
    }
})
    if(req.body.paymentmethod=="ONLINE"){
   req.session.delivery={
        name:addressInfo.address.name,
        housename:addressInfo.address.house,
        city:addressInfo.address.city,
        state:addressInfo.address.state,
        post:addressInfo.address.post,
        district:addressInfo.address.district,
        
        }

        var instance = new Razorpay({
            key_id:process.env.KEY_ID,
            key_secret:process.env.KEY_SECRET,
        });
        
        const userId=req.session.user._id
        const grandTotal= await User.findOne({_id:userId})
        
        gtotal=grandTotal.cart.totalPrice
        var options = {
            amount: gtotal*100,  // amount in the smallest currency unit
            currency: "INR",
            receipt: orderId
          };
        // let amount  = total
        // let grandTotal=await Order.findOne({})
        // instance.orders.create({
        //     options
        // },(err,order) => {
        //     console.log(order);
        //     res.json({status:false,order})
        // })
        
          instance.orders.create(options, function(err, order) {
            console.log(order);
            res.json({status:true,order:order})
          });
    }else if(req.body.paymentmethod="COD"){
        let userData=await User.findOne({_id:id})
    //   let 
        const products = userData.cart.items
     let orderDate=new Date().toISOString()
   let delDate=new Date()
  
    let deliveryDate=new Date(delDate.setDate(delDate.getDate()+7)).toLocaleDateString()
    
    // deliveryDate=deliveryDate.toISOString()
    let dd=deliveryDate.toString()
    dd=dd.split('T')
    dd=dd[0]
let month=parseInt(new Date().getMonth()) + 1
console.log(month)
    console.log("566784444444444444444444444444")
    let dataSave={
        userId:req.session.user._id,
         deliveryAddress:{
         name:addressInfo.address.name,
         housename:addressInfo.address.house,
         city:addressInfo.address.city,
         state:addressInfo.address.state,
         post:addressInfo.address.post,
         district:addressInfo.address.district,
         },
         products:products,
         grandTotal:userData.cart.totalPrice,
         originalPrice:userData.cart.originalPrice,
         paymentmethod:req.body.paymentmethod,
         date:new Date().toISOString(),
         deliveryDate:deliveryDate,
         orderStatus:'pending',
         month:month
         
    }
    console.log(dataSave)
    
   status=status
console.log(req.session.delivery);

await Order.create(dataSave)
   
   let items = userData
   items.cart.items.forEach(async (data)=>{
    let qty=parseInt(data.qty)
    await productSchema.updateOne({_id:data.productId},{$inc:{stock:-qty}})
    await User.updateOne(
        {_id: req.session.user._id},
        {
            $pull:{
                "cart.items":{
                    productId:data.productId
                }
            }
        }
    );
   })
   await User.updateOne(
    {_id: req.session.user._id},
    {
        $set:{
            "cart.totalPrice":0
        }
    }
);

res.json({cod:true})
    }
    
   } catch (error) {
     console.log(error);
   }


}


const verifyPayment=async(req,res)=>{
    try {
        console.log("12");
        const id= req.session.user._id;

        console.log(id);
        console.log(req.body);
        const hmac = crypto.createHmac('sha256','rGZgRo8zYXLxvTbjzMXxHNH3')
        .update(req.body.response.razorpay_order_id+'|'+req.body.response.razorpay_payment_id).digest('hex')
    
        if(hmac ==req.body.response.razorpay_signature){
          console.log("success");
          let userData=await User.findOne({_id:id})
      
        const products = userData.cart.items
     let orderDate=new Date().toISOString()
   let delDate=new Date()
    let deliveryDate=new Date(delDate.setDate(delDate.getDate()+7))
    let dd=deliveryDate.toString()
    dd=dd.split('T')
    dd=dd[0]
    
    let dataSave={
        userId:id,
         deliveryAddress:req.session.delivery,
         products:products,
         grandTotal:userData.cart.totalPrice,
         originalPrice:userData.cart.originalPrice,
         paymentmethod:req.session.paymentmethod,
         date:new Date().toISOString(),
         deliveryDate:deliveryDate,
         orderStatus:'pending',
         month:parseInt(new Date().getMonth()) + 1
         
    }

    console.log(dataSave);


   await Order.create(dataSave)
   .then(async(data)=>{
    const orderId = data._id.toString()
   })
   
   let items = userData
   items.cart.items.forEach(async (data)=>{
    let qty=parseInt(data.qty)
   
    product=await productSchema.updateOne({_id:data.productId},{$inc:{stock:-qty}})
    await User.updateOne(
        {_id: req.session.user._id},
        {
            $pull:{
                "cart.items":{
                    productId:data.productId
                }
            }
        }
    );
   })
   await User.updateOne(
    {_id: req.session.user._id},
    {
        $set:{
            "cart.totalPrice":0
        }
    }
);
          await Order.insertMany([{orderId:req.body.response.receipt,user_Id:req.session.user._id,paymentStatus:"Paid",paymentMethod:"Online Payment"}]).then((data)=>{
            res.json({success:true})
          })
        }else{
            res.json({success:false})
        }
    } catch (error) {
        console.log(error);
    }
}





// const viewOrderProducts = async (req, res) => {
//     try {
//       const cate = await Category.find();
//       const orderId = req.query.id;
//       console.log("order id : " + orderId);
//       const orderIdtemp = mongoose.Types.ObjectId(orderId)
//       console.log(orderIdtemp)
//       const orderData = await Order.findOne({_id:orderIdtemp}).populate("products.productId");
//       console.log(orderData);
   

//       const products = orderData.products;
//       res.render("view-order-products", { products, cate, orderData });
//     } catch (error) {
//       console.log(error.message);
//     }
//   };
   








  
  const orderPlaced = async (req, res) => {
    try {
      if (req.session.user._id) {
        res.render("orderPlaced");
      } else {
        res.redirect("/");
      }
    } catch (error) {
      console.log(error.message);
      res.redirect("/");
    }
  };




  const orders= async(req,res)=>{
    try {
        let login = false;
        if(req.session.user){
            login=true;
        }
        if(req.session.user){
            const userId = req.session.user._id;
            
            const orderData = await Order.find({userId:userId}).sort({date:-1}).populate({path:'products',populate:{path:'productId',model:'product'}})
            console.log(orderData,"1")
         //    const addReturnField=req.session.addReturnField
           
         //    const userOrders = await Order.aggregate([{ $match: { userId: orderId } }])
         //    const returnConfirmation=await orderin.find()
         console.log(orderData)
           res.render("orderedProducts",{orderData,login})  
        }else{
            res.redirect("/login")
        }
                  
    } catch (error) {
        console.log(error);
    }
  }

  const viewDetails=async (req,res)=>{
    try {
        let login = false;
        if(req.session.user){
            login=true;
        }
        if(req.session.user){
            const id=req.params.id;
            console.log(id);
            const products= await productSchema.find({_id:id})
            console.log(products);
            const orderData=await Order.find({"products.productId":id})
            console.log(orderData,"kkkkkkkk");
            res.render('orderDetails',{orderData,products,login})
    }
        
    }
    catch (error) {
        console.log(error);
    }
}




const getUserAddress = async(req,res)=>{
    try {
        let login = false;
        if(req.session.user){
            login=true;
        }
        if(req.session.user){
            const id=req.session.user._id;
            const userDetails = await User.findOne({_id:id})
  
      res.render("userAddress",{userDetails,login});
        }else{
            res.redirect('/login')
        }
      
    } catch (error) {
      console.log(error.message);
    }
  }
//   !!!! Add User Address

const addnewAddress= async(req,res)=>{
    try {
        let login = false;
        if(req.session.user){
            login=true;
        }
        res.render('addnewAddress',{login})
    } catch (error) {
        console.log(error);
    }
}

  const addAddress = async(req,res)=>{
    try {
       const userDetails = await User.updateOne({_id:req.session.user._id},{$push:{'address':
       {name:req.body.name,
        house:req.body.house,
        post:req.body.post,
        city:req.body.city,
        state:req.body.state,
        district:req.body.district,
        pin:req.body.pin}}});
        
      
      if(userDetails){
        
        res.redirect('/address')
    }
        
    
}catch(error){
    console.log(error);
}

}


const editAddress= async (req,res)=>{
    try {
        let login = false;
        if(req.session.user){
            login=true;
        }
        const id=req.query.id;
        let addressData=await User.aggregate([{$match:{_id:new ObjectId(req.session.user._id)}},{$unwind:"$address"},{$match:{"address._id":new ObjectId(id)}}])
        addressData = addressData ? addressData[0]?.address : null
        res.render('editAddress',{addressData,login})
    } catch (error) {
        console.log(error);
    }

}


const postAddress = async(req,res)=>{
    try {
        const id=req.params.id
        const data = {"address.$.name":req.body.name,"address.$.house":req.body.house,"address.$.post":req.body.post,"address.$.city":req.body.city,"address.$.district":req.body.district,"address.$.state":req.body.state,"address.$.pin":req.body.pin}
        await User.updateOne({_id:req.session.user._id,"address._id":id},{$set:data})
        res.redirect('/address')
    } catch (error) {
        console.log(error);
    }
}



const deleteAddress = async (req, res) => {
    try {
        const userId=req.session.user._id
        const id=req.query.id;
        console.log(id,"iddd")
        const userData = await User.findOne({_id:userId});
        
        const deleteAddress = await User.findByIdAndUpdate({_id:userId},{$pull:{address:{_id:id}}})
            res.redirect('/address')
        
    } catch (error) {
        console.log(error);
    }
}


        // const checkAddress = await User.findOne({_id:req.session.user._id,"address.house":address.house})
        // console.log(checkAddress,"this is your address");
        // if(!checkAddress){
//           const adressdata = await User.updateOne({_id:id},{$push:{address:{
//           name:req.body.name,
//           house:req.body.house,
//           post:req.body.post,
//           city:req.body.city,
//           state:req.body.state,
//           district:req.body.district,
//           pin:req.body.pin

//           }}}).then((data)=>{
//             res.redirect("/userAddress");
//             console.log("address added successfully");
//           })
//         // }else{
//         //   // res.render("users/userAddress",{message:"This Address is already exists,Do you want to Add address? Then Change Home Address",login,userDetails})
//         //     res.redirect("/userAddress")
  
//         // }
          
//       }else{
//         res.redirect("/signin")
//       }
      
//     } catch (error) {
//       console.log(error.message);
//     }
//   }



const removecartItems=async(req,res)=>{

    if(req.session.user){
    try {
        
        const productid=req.body.prodId;
        // let i=req.body.index
        const userData=req.session.user._id
        const result = await User.updateOne(
            {_id: userData},
            {
                $pull: {
                    "cart.items": {productId:productid}
                }
            }
        );
        //  User.updateOne(
        //     { _id: userData },
        //     { $pull: {"cart.item": {productId:productid} } }
        //   );
          res.redirect("/cart");
    }catch(error){
           console.log(error);
    }}};


// const wishlist=async(req,res)=>{
//     try {
//         res.render('wishlist')
//     } catch (error) {
//         console.log(error)
//     }
// }




 

const userLogout=async(req,res)=>{
    try {
        req.session.user=null

        res.redirect('/login')
    } catch (error) {
        console.log(error);
    }
}






module.exports = {
    loadRegister,
    insertUser,
    loginLoad,
    verifyLogin,
    loadHome,
    loadShop,
    loginotpLoad,
    securePassword,
    verifyPhone,
    verifyOtp,
    loadProfile,
    loadCart,
    getUserAddress,
    addAddress,
    addnewAddress,
    addTocart,
    removecartItems,
    changeProQnty,
    deleteAddress,
    checkOutPage,
  
    forgetLoad,
    forgetVerify,
    proceed,
    verifyMail,
    sendResetPasswordMail,
    forgetPasswordLoad,
    resetPassword,
    orderPlaced,
    verifyPayment,
    userLogout,
    editAddress,
    postAddress,
    orders,
    viewDetails,

}