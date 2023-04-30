const express=require('express')
const user_route=express()
user_route.set('view engine','ejs')
user_route.set('views','./views/users')

const bodyParser=require('body-parser');
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({extended:true}))
// const storage=multer.diskStorage({
//     destination:function(req,file,cb){
//         cb(null,path.join());
//     },
//     filename
// })


const userController=require('../controllers/userController');
const productController=require('../controllers/productController')
const couponController=require('../controllers/couponController')
const wishlistController=require('../controllers/wishlistController')


const multer = require('multer');
const isLogin= require('../middleware/userAuth')


user_route.get('/register',userController.loadRegister);
user_route.post('/register',userController.insertUser);
user_route.get('/home',userController.loadHome);
user_route.post('/verifyUser',userController.verifyLogin)
user_route.get('/login',userController.loginLoad);


// user_route.get('/orderedProducts',userController.orders)





user_route.get('/',userController.loadHome)
user_route.get('/shop',isLogin,userController.loadShop)
user_route.get('/singleProduct/:id',productController.viewsingleProduct)


user_route.get('/profile',userController.loadProfile)

// user_route.get('/verify',userController.verifyMail)




// user_route.get('/order',userController.loadOrder)

user_route.get('/address',isLogin,userController.getUserAddress)
user_route.get('/newAddress',isLogin,userController.addnewAddress)
user_route.post('/updatedAddress',userController.addAddress)
user_route.get('/deleteAddress',userController.deleteAddress)
user_route.get('/editAddress',userController.editAddress)
user_route.post('/repostAddress/:id',userController.postAddress)

    
user_route.post('/addTocart',userController.addTocart)
user_route.get('/cart',userController.loadCart)
user_route.post('/removecartItem',userController.removecartItems)



// user_route.get("/view-orders", userController.viewOrderProducts);
user_route.post('/proceed', userController.proceed);
user_route.get("/orderPlaced", userController.orderPlaced);


// user_route.get('/placeOrder',userController.placeOrder)


user_route.post('/change-product-quantity',userController.changeProQnty)
user_route.get('/orderDetails',userController.orders)
user_route.get('/details/:id',userController.viewDetails)

// user_route.get('/forgetPassword', userController.forgetPasswordLoad)
// user_route.post('/forgetPassword',userController.resetPassword)


user_route.get('/loginwithOtp',userController.loginotpLoad)
user_route.post('/loginwithOtp',userController.verifyPhone)
user_route.post ('/otp',userController.verifyOtp)
user_route.post('/otpResend',userController.resendOtp)


user_route.get('/verify',userController.verifyMail)
// user_route.get('/sendVerifyMail',userController.sendVerifyMail)
user_route.get('/forget',userController.forgetLoad);
user_route.post('/forget',userController.forgetVerify);

user_route.get('/forget-password',userController.forgetPasswordLoad);
user_route.post('/forget-password',userController.resetPassword);


user_route.get('/wishlist',wishlistController.wishlist)
// user_route.get('/addwishlist',wishlistController.addtowishlist)
// user_route.get('/removewishlist',wishlistController.removewishlist)



// user_route.get('/log',(req,res)=>{
//     const num = 8137093584
//         res.render('otpLogin',{num})
// })

user_route.get('/checkOut',userController.checkOutPage)
user_route.post('/verify-payment',userController.verifyPayment)
user_route.post('/applyCoupon',couponController.applyCoupon)




user_route.get("/userLogout",userController.userLogout)



module.exports = user_route;