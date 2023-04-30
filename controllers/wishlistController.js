const User = require('../models/userModel')
const productSchema = require('../models/productModel')


// wishlist------------------>

const wishlist = async(req,res)=>{
    try {
       res.render('wishlist')
    } catch (error) {
        console.log(error);
    }
}

module.exports={
    wishlist,
    // addtowishlist,
    // removewishlist,
}