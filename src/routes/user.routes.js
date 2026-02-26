// const express = require("express");
// const auth = require("../middleware/auth.middleware");
// const userControllers = require("../controllers/user.controllers");
// const { upload, uploadImageToCloudinary } = require("../middleware/image.upload");
// const { upload, uploadMediaToCloudinary } = require("../middleware/media.upload");


// const router = express.Router();

// // Existing routes
// router.get("/me", auth, userControllers.getProfile);
// router.post("/me", auth, userControllers.createOrUpdateProfile);
// router.get("/", userControllers.searchBySkill);

// // Profile image upload (NEW)
// router.put("/profile-image", auth, 
//   upload.single("profileImage"), 
//   uploadImageToCloudinary, 
//   userControllers.updateProfileImage
// );


// // Create post (image/video)
// router.post("/data", [
//   auth,
//   upload.single("media"),  // Field name: media
//   uploadMediaToCloudinary,
//   userControllers.createUserPost
// ]);

// module.exports = router;
const express = require("express");
const auth = require("../middleware/auth.middleware");
const userControllers = require("../controllers/user.controllers");

// Image upload (profile)
const { upload: imageUpload, uploadImageToCloudinary } = require("../middleware/image.upload");

// Media upload (posts)
const { upload: mediaUpload, uploadMediaToCloudinary } = require("../middleware/media.upload");

const router = express.Router();

// Profile routes
router.get("/me", auth, userControllers.getProfile);
router.post("/me", auth, userControllers.createOrUpdateProfile);
router.get("/", userControllers.searchBySkill);

// Profile image upload
router.put("/profile-image", [
  auth,
  imageUpload.single("profileImage"),
  uploadImageToCloudinary,
  userControllers.updateProfileImage
]);

// NEW: Create post (image/video)
router.post("/data", [
  auth,
  mediaUpload.single("media"),
  uploadMediaToCloudinary,
  userControllers.createUserPost
]);
// GET /api/users/:id/skills - Get user skills
router.get("/:id/skills", auth, userControllers.getUserSkills);

// POST /api/users/skills - Update/Add user skills
router.post("/skills", auth, userControllers.updateUserSkills);


module.exports = router;
