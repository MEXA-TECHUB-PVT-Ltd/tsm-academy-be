
const express = require('express');
const router = express.Router();
const controller = require("../../controllers/Review/review")

router.post("/createReview" , controller.createReview);
router.post("/updateReview" , controller.updateReview);
router.post("/deleteReview" , controller.deleteReview);
router.post("/deleteAllReview" , controller.deleteAllReview);
router.get("/getAllReviews" , controller.getAllReviews);
router.post("/getReviewDetails" , controller.getReviewDetails);

module.exports = router;