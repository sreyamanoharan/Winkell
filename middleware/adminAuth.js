const isLogin = async(req,res,next)=>{
    try {
        if(req.session.adminloggedIn){
            next()
        }else{
            res.redirect("/admin")
        }
    } catch (error) {
        console.log(error);
    }
}


const isAdminLogined = async(req,res,next)=>{
    try{
        if(req.session.adminloggedIn){
            res.redirect("/admin/adminHome")
        }else{
            res.render("admin/adminLogin")
        }
    }catch (error) {
        console.log(error);
    }
}

module.exports= {isLogin,
    isAdminLogined
}