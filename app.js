require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
const userRoute=require("./routes/userRoutes")
const blogRoute=require("./routes/blogRoutes")
const cookieParser=require("cookie-parser")
const {checkForAuthenticationCookie}=require("./middlewares/authMiddleware"); 
const Blog = require('./models/blogModel');

connectDB();

const app = express();


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Static assets
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"))
app.use(express.static(path.resolve("./public")))

app.use("/user",userRoute)
app.use("/blog",blogRoute)

app.get('/', async(req, res) => {
    const allblogs=await Blog.find({})
	res.render("homepage",{user:req.user,blogs:allblogs})
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));