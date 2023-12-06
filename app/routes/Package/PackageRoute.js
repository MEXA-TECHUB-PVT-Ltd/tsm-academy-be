
const express = require('express');
const router = express.Router();
const controller = require("../../controllers/PACKAGE/packageController")

router.post("/add" , controller.createPackage);
router.get("/getAllPackages" , controller.getAllPackages);
router.post("/getUserOtherCourses" , controller.getuserOtherCourses);

router.post("/getUserEnrolledCourses" , controller.getUserEnrolledCourses);



router.post("/update" , controller.updatePackage);
// router.post("/updatePackage" , controller.updatePackage);
router.post("/deletePackage" , controller.deletePackage);
router.post("/deleteAllPackage" , controller.deleteAllPackage);
router.post("/getByProgramId" , controller.getPackageByProductId);
router.post("/getPackageByPriceId" , controller.getPackageByPriceId);

router.get("/getAllVideos" , controller.getAllVideos);
router.post("/getByVideoId" , controller.getByVideoId);


module.exports = router;