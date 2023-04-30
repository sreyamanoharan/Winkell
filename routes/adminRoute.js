const express=require('express')
const adminRoute=express()
const multer= require('multer')
const path=require('path')
const adminhelp=require('../middleware/adminAuth')
const nocache=require('nocache')
// adminRoute.set('view engine','ejs')
// adminRoute.set('views','./views/admin')

const bodyParser=require('body-parser');
adminRoute.use(express.json());
adminRoute.use(express.urlencoded({extended:true}))

const storage=multer.diskStorage({
    destination:function(req,file,cb){
     cb(null,path.join(__dirname,'../public/imagess'));
    },
    filename:function(req,file,cb){
    const name=Date.now()+'-'+file.originalname;
    cb(null,name)
    }
});
const upload=multer({storage:storage})
const adminController=require('../controllers/adminController')
const couponController=require('../controllers/couponController')
const categoryController=require('../controllers/categoryController')
const productController=require('../controllers/productController')



adminRoute.get('/',nocache(),adminhelp.isAdminLogined,adminController.loadAdmin)
adminRoute.post('/',adminController.adminVerify)


adminRoute.get('/adminHome',nocache(),adminhelp.isLogin,adminController.adminHome)


adminRoute.get('/addProduct',adminhelp.isLogin,productController.addProduct)
adminRoute.post('/postProduct',upload.single('image'),productController.postProduct)
adminRoute.get('/productList',adminhelp.isLogin,productController.getProduct)
adminRoute.get('/editProduct',nocache(),adminhelp.isLogin,productController.editProduct)
adminRoute.post('/repost',upload.single('image'),productController.repost)
adminRoute.get('/deleteProduct',adminhelp.isLogin,productController.deleteProduct)



adminRoute.get('/category',adminhelp.isLogin,categoryController.getCategory)
adminRoute.get('/addCategory',nocache(),adminhelp.isLogin,categoryController.getAddcategory)
adminRoute.post('/addCategory',categoryController.postCategory)
adminRoute.get('/editCategory',nocache(),adminhelp.isLogin,categoryController.editCategory)
adminRoute.post('/postEdit',categoryController.postEdit)
adminRoute.get('/deleteCategory',adminhelp.isLogin,categoryController.deleteCategory)



adminRoute.get('/userManage',adminhelp.isLogin,adminController.userManage)
adminRoute.get('/blockUser',adminhelp.isLogin,adminController.blockUser)



// adminRoute.get("/orderManagement",adminController.getOrderManagement);
// adminRoute.post("/changeOrderStatus",verifyAdmin,orderController.postStatusChanges)



adminRoute.get('/orderDetails',adminController.orderDetails)
// adminRoute.post("/changeOrderStatus",adminController.postStatus)
adminRoute.post('/changestatus',adminController.changestatus)



adminRoute.get('/couponmanagement',couponController.getCoupon);
adminRoute.get('/addcoupon',couponController.getAddCoupon)
adminRoute.get('/editCoupon',couponController.geteditcoupon);
adminRoute.post("/submitCoupon",couponController.addCoupon);
adminRoute.post("/editedCoupon",couponController.submitEditCoupon);
adminRoute.post("/deleteCoupon",couponController.deleteCoupon)


adminRoute.get('/productOffer',adminController.productOfferManagement);
adminRoute.get('/editProOffer/:id',adminController.productOfferEdit);
adminRoute.post('/editProOffer/:id',adminController.productOfferEditPost);
adminRoute.get('/deleteProOffer',adminController.productOfferDelete)



adminRoute.get('/categoryOffer',adminController.categoryOfferManagement)
adminRoute.get('/editcatOffer/:id',adminController.catOfferEdit);
adminRoute.post('/catOfferPost/:id',adminController.catOfferEditPost)
adminRoute.get('/deleteCatOffer',adminController.catOfferDelete)



adminRoute.get('/salesReport',adminController.getSalesreport)
adminRoute.get('/allsalesReport',adminController.salesReport)

adminRoute.get('/chartData',adminController.chartData)

module.exports=adminRoute;