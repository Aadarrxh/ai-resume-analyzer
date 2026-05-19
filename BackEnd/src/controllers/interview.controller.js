const pdfParse = require("pdf-parse").default || require("pdf-parse");
const interviewReportModel=require('../models/intereviewReport.model')
const generateInterviewReport=require('../services/ai.service')

async function generateInterViewReportController(req,res){

    const resumeContent=await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText();
    const {selfDescription, jobDescription}=req.body;

    const interviewReportByAi= await generateInterviewReport({
        resume: resumeContent.text,
        selfDescription,
        jobDescription
    })

    const interviewReport = await interviewReportModel.create({
    user: req.user.id,
    resume: resumeContent.text,
    selfDescription,
    jobDescription,
    ...interviewReportByAi,
    title: interviewReportByAi.title || "MERN Full Stack Interview Report"
});

    res.status(201).json({
        message:"interview report genereated succesfully",
        interviewReport
    })
}

module.exports={generateInterViewReportController}