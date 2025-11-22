const {Router}=require("express");
const { handleUserSignUp,handleUserSignin,handelUserLogout,handleUserSigninGet } = require("../controllers/userControllers");


const router =Router()


router.get("/signin",handleUserSigninGet);

router.get("/signup",(req,res)=>{
    return res.render("signup");
});

router.post("/signup",handleUserSignUp)

router.post("/signin",handleUserSignin)

router.get("/logout",handelUserLogout)



module.exports = router;

