const User = require("../models/userModel");

const handleUserSignUp = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        await User.create({ fullName, email, password });
        return res.redirect("/user/signin");
        
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            return res.render("signup", {
                error: "Email already exists. Please use a different email or sign in.",
                oldInput: { fullName, email }
            });
        }
        return res.render("signup", {
            error: "Something went wrong during registration."
        });
    }
}

const handleUserSignin = async (req, res) => {
    const { email, password } = req.body
    try {
        const token = await User.matchPasswordAndGenerateToken(email, password)
        return res.cookie("token", token).redirect("/")
    } catch (error) {

        return res.render("signin", {
            error: "Incorrect Email or Password"
        })
    }
}

const handelUserLogout=(req,res)=>{
        res.clearCookie("token").redirect("/")
}


module.exports={handleUserSignUp,handleUserSignin,handelUserLogout}