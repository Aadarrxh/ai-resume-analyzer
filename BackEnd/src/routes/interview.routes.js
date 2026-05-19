const express=require("express");

const authMiddleWare=require('../middlewares/auth.middleware');
const upload=require('../middlewares/file.middleware');
const interviewController=require('../controllers/interview.controller');

const interViewRouter=express.Router();

interViewRouter.post("/",authMiddleWare.authUser,upload.single("resume"),interviewController.generateInterViewReportController)


module.exports=interViewRouter;