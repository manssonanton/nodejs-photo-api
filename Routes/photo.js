const router = require('express').Router();
const verify = require('./tokenVerify');
const multer = require('multer');
const Image = require('../Model/Image');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
});

// Filter for multer, block any files which are not jpeg or png
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

// Settings for multer, including the filter, where the files are stored and limit the file size to 10mb
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 10 },
    fileFilter: fileFilter
});

// Get all photos and keywords in DB
router.get('/', async (req, res) => {
    const image = await Image.find();
    try {
        res.send({ image })
    } catch (error) {
        res.status(400).send(error);
    }
});

// Get a specific photo
router.get('/:id', async (req, res) => {
    const image = await Image.find({ "_id": req.params.id });
    try {
        res.send({ image })
    } catch (error) {
        res.status(400).send(error);
    }
});

// Get photos based on keywords
router.get('/search', async (req, res) => {
    const word = req.body.keywords;
    Image.find(
        { "keywords": { "$regex": word, "$options": "i" } },    // find keywords in string 
        function (err, images) {
            if (err) {
                res.status(400).send(err);
            } else {
                res.send({ images })
            }
        }
    );
});

// Upload a photo to the DB
router.post('/upload', verify, upload.single('image'), async (req, res) => {

    const image = new Image({
        keywords: req.body.keywords,
        image: req.file.path
    });
    try {
        const savedImage = await image.save();
        res.send('Image saved')
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router