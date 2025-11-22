const {Router}=require("express");
const { handleUserSignUp,handleUserSignin,handelUserLogout } = require("../controllers/userControllers");


const router =Router()


router.get("/signin",(req,res)=>{
    res.render("signin");
});

router.get("/signup",(req,res)=>{
    return res.render("signup");
});

router.post("/signup",handleUserSignUp)

router.post("/signin",handleUserSignin)

router.get("/logout",handelUserLogout)



module.exports = router;

