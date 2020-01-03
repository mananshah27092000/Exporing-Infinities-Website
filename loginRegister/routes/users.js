const router = require('express').Router();
const check =  (req,res,next) =>{
    if(req.user){
        next();
    }else{
        res.redirect('/loginUser/signIn');
    }
}



router.get('/',check,(req,res)=>{
    console.log(req.user.username);
    res.render('userProfile',{user:req.user.username});
})

module.exports = router;