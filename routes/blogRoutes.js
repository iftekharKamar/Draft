const {Router}=require("express");
const multer=require("multer");
const path =require("path");
const { handleAddNewBlog,getAllBlogAndComments,handleCreateComments } = require("../controllers/blogControllers");

const router =Router()

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`)); 
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  }
});

const upload = multer({ storage: storage })

router.get("/addNew",(req,res)=>{
    return res.render("addBlog",{
        user:req.user
    })
})


router.get("/:id",getAllBlogAndComments)

router.post("/comment/:blogId",handleCreateComments)

router.post("/",upload.single("coverImage"),handleAddNewBlog)

module.exports = router;