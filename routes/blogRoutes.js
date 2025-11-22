const {Router}=require("express");
const path =require("path");
const { handleAddNewBlog,getAllBlogAndComments,handleCreateComments } = require("../controllers/blogControllers");
const upload = require("../middleware/multerMiddleware");
const router =Router()



router.get("/addNew",(req,res)=>{
    return res.render("addBlog",{
        user:req.user
    })
})


router.get("/:id",getAllBlogAndComments)

router.post("/comment/:blogId",handleCreateComments)

router.post("/",upload.single("coverImage"),handleAddNewBlog)

module.exports = router;