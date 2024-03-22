const {Router} = require("express");
const {Blog} = require("../models/Blog");
const {User} = require("../models/User");
const {Comment} = require("../models/Comment");
const {default: mongoose} = require("mongoose");
const commentRouter = Router({mergeParams: true});

// /blog/:blogId/comment

commentRouter.post("/", async function (req, res) {
  try {
    const {blogId} = req.params;
    const {content, userId} = req.body;


    const [blog,user] = await Promise.all([
            Blog.findOne({_id: blogId}),
            User.findOne({_id: userId}),
        ]);


        //동기형태 작업
    // const blog = await Blog.findOne({_id: blogId});
    // const user = await User.findOne({_id: userId});


    if (!blog || !user) {
      return res
        .status(400)
        .send({err: "blog, user를 찾을수 없네요", blogId, userId, content});
    }

    const comment = new Comment ({content, user, blog})
    await comment.save()

    return res.send({comment});
  } catch (error) {
    return res.status(500).send({error: error.message});
  }
});

module.exports = {commentRouter};