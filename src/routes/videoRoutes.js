// const express = require("express");
// const router = express.Router();

// const upload = require("../middleware/uploadMiddleware");
// const videocontroller = require('../controllers/videocontroller');
// // Existing POST is good: router.post('/', upload.single('video'), videocontroller.uploadVideo);


// router.post(
//   "/upload",
//   upload.single("video"),
//   videocontroller.uploadVideo
// );

// router.get('/all', videocontroller.getAllVideos);
// router.get('/course/:courseid', videocontroller.getVideosByCourse);

// module.exports = router;
const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const videoController = require('../controllers/videocontroller');  // ✅ Fixed

// ROOT POST - NOT /upload
router.post('/', upload.single("video"), videocontroller.uploadVideo);  // ← ROOT '/'

router.get('/all', videocontroller.getAllVideos);
router.get('/course/:course_id', videocontroller.getVideosByCourse);  // course_id fix

module.exports = router;
