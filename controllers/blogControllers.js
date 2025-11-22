const Blog = require("../models/blogModel")
const Comment = require("../models/commentModel")


const handleAddNewBlog = async (req, res) => {
    const { title, body } = req.body;

    try {
        if (!req.file) {
            return res.render("addBlog", {
                error: "Cover image is required.",
                user: req.user,
                title,
                body
            });
        }
        if (!req.user) {
             return res.redirect("/user/signin");
        }

        const blog = await Blog.create({
            title,
            body,
            createdBy: req.user._id,
            coverImageURL: `/uploads/${req.file.filename}`
        });

        return res.redirect(`/blog/${blog._id}`);

    } catch (error) {
        console.error("Blog Creation Error:", error);
        
        // Render the page again with a generic error
        return res.render("addBlog", {
            error: "Error creating blog. Please try again.",
            user: req.user,
            title,
            body
        });
    }
};


const getAllBlogAndComments = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate('createdBy');
        if (!blog) {
            return res.status(404).render("404", { 
                error: "Blog not found",
                user: req.user 
            });
        }
        const comments = await Comment.find({ blogId: req.params.id }).populate('createdBy');
        return res.render("blog", {
            user: req.user,
            blog,
            comments
        });

    } catch (error) {
        console.error("Error fetching blog:", error);
        return res.redirect("/"); 
    }
}

const handleCreateComments = async (req, res) => {
    try {
        const { content } = req.body;
        const { blogId } = req.params;
        if (!content || content.trim() === "") {
            return res.redirect(`/blog/${blogId}`);
        }
        if (!req.user) {
            return res.redirect("/user/signin");
        }

        await Comment.create({
            content,
            blogId, 
            createdBy: req.user._id
        });

        return res.redirect(`/blog/${blogId}`);

    } catch (error) {
        console.error("Error creating comment:", error);
        return res.redirect(`/blog/${req.params.blogId}`);
    }
}



module.exports = { handleAddNewBlog, getAllBlogAndComments, handleCreateComments }