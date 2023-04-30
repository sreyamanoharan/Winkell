const isLogin = async(req,res,next)=>{
    try {
        console.log(req.session)
        if(req.session.user){
            next()
        }else{
            res.redirect("/login")
        }
    } catch (error) {
        console.log(error);
    }
}
module.exports=isLogin