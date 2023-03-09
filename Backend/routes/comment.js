const router = require("express").Router();
const Comment = require("../models/Comment");


//post a comment 
router.post('/', async(req,res)=>{

    
    const newComment = new Comment(req.body);

    try{
        const savedComment = await newComment.save();
        res.status(200).json(savedComment);
    }catch(err){
        res.status(500).json(err);
    }
});

//get comments of a movie
router.get('/:id/comments', async(req,res)=>{

    try{
    const comments = await Comment.findById(req.params.id);
         res.status(200).json(comments);
    } catch (err) {
        res.status(500).json(err);
    }
});

//get comments

router.get('/all', async(req,res)=>{

     Comment.find().then((comments)=>{
         res.json(comments)
     }).catch((err)=>{
         console.log(err)
     })

})


//get comments of a movie
router.get("/movie/:movieid", async(req,res)=>{
 
    try{
        //const movie = await Movie.findOne({movieId:req.params.movieid})
        const comments = await Comment.find({ movieId: req.params.movieid})
        res.status(200).json(comments);
    }catch(err){
        res.status(500).json(err);
    }
});

//delete comment
router.delete("/delete/:id", async(req,res)=>{
    try{
        const comment = await Comment.findById(req.params.id);
        
            await comment.deleteOne();
            res.status(200).json("The comment has been deleted")
        
    }catch(err){
        res.status(500).json(err);
    }
})

//update comment
router.put("/edit/:id", async(req,res)=>{

    try{
        const comment = await Comment.findById(req.params.id);

        await comment.updateOne({ $set:req.body});
        res.status(200).json("comment has been updated");

   }catch(err){
       res.status(500).json(err);
   }
})


module.exports = router;