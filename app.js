require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
const userRoute = require("./routes/userRoutes");
const blogRoute = require("./routes/blogRoutes");
const cookieParser = require("cookie-parser");
const Blog = require('./models/blogModel');

const { checkForAuthenticationCookie } = require("./middleware/authentication"); 

const app = express();


connectDB();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));


app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.get('/', async (req, res) => {
    try {
        const allblogs = await Blog.find({});
        res.render("homepage", { user: req.user, blogs: allblogs });
    } catch (error) {
        console.log(error);
        res.render("homepage", { user: req.user, blogs: [] });
    }
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

module.exports = app;