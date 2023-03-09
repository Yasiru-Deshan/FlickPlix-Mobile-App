const router = require("express").Router();
const Movie = require("../models/Movie");
const PlayList = require("../models/Playlist");

//create a playlist
router.post('/new', async(req,res)=>{

    const newPlayList = new PlayList(req.body);

    try{
        const savedPlaylist = await newPlayList.save();
        res.status(200).json(savedPlaylist);
    }catch(err){
        res.status(500).json(err);
    }
});

//get playlists
router.get('/', async(req,res)=>{

    PlayList.find().then((list)=>{
        res.json(list)
    }).catch((err)=>{
        console.log(err)
    })
})

//delete playlist

router.delete('/delete/:id', async (req, res) => {
    try {
        await PlayList.findByIdAndDelete(req.params.id);
        res.status(200).json('The playlist has been deleted...');
    } catch (err) {
        res.status(500).json(err);
    }
});


//get one playlist
router.get('/find/:id', async (req, res) => {
    try {
        const playlist = await PlayList.findById(req.params.id);
        res.status(200).json(playlist);
    } catch (err) {
        res.status(500).json(err);
    }
});


//update playlist
router.put("/edit/:id", async(req,res)=>{

    try{
        const playlist = await PlayList.findById(req.params.id);

        await playlist.updateOne({ $set:req.body});
        res.status(200).json("Playlist has been updated");

   }catch(err){
       res.status(500).json(err);
   }
})

//add to playlist
router.put("/:id/addtoPlaylist", async( req,res)=>{

        try{
            
          const newItem = new Movie({
                 movieId: req.body.movieId,
                 title: req.body.title,
                 img: req.body.img,
                 year: req.body.year,
                 genre: req.body.genre
          })

             const playlist = await PlayList.findById(req.params.id);

                await playlist.updateOne({ $push :{movies: [newItem] }});
                return res.status(200).json("Movie has been added to Playlist");
            
        }catch(err){
            res.status(500).json(err)
        }
    
})






module.exports = router;