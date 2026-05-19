const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});


const interviewReportZod = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
})


function cleanJSON(text) {
    return text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
}


function validateShape(obj) {
    return (
        obj &&
        typeof obj.matchScore === "number" &&
        Array.isArray(obj.technicalQuestions) &&
        Array.isArray(obj.behavioralQuestions) &&
        Array.isArray(obj.skillGaps) &&
        Array.isArray(obj.preparationPlan) &&
        typeof obj.title === "string"
    );
}

async function generateInterviewReport({
    resume,
    selfDescription,
    jobDescription
}) {
    const prompt = `
You are a STRICT JSON generator.

Return ONLY valid JSON. No markdown. No explanation.

You MUST include ALL fields exactly:

{
  "matchScore": number,
  "technicalQuestions": [
    {
      "question": string,
      "intention": string,
      "answer": string
    }
  ],
  "behavioralQuestions": [
    {
      "question": string,
      "intention": string,
      "answer": string
    }
  ],
  "skillGaps": [
    {
      "skill": string,
      "severity": "low" | "medium" | "high"
    }
  ],
  "preparationPlan": [
    {
      "day": number,
      "focus": string,
      "tasks": string[]
    }
  ],
  "title": string
}

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}
`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: [
                {
                    role: "user",
                    parts: [{ text: prompt }]
                }
            ],
            generationConfig: {
                response_mime_type: "application/json"
            }
        });


        const rawText =
            response.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!rawText) {
            console.error("FULL RESPONSE:", JSON.stringify(response, null, 2));
            throw new Error("Empty response from Gemini");
        }

        const cleaned = cleanJSON(rawText);

        let parsed;

        try {
            parsed = JSON.parse(cleaned);
        } catch (err) {
            console.error("RAW MODEL OUTPUT:\n", rawText);
            throw new Error("Invalid JSON returned by Gemini");
        }

        if (!validateShape(parsed)) {
            console.error("INVALID STRUCTURE:\n", parsed);
            throw new Error("Model returned incomplete structure");
        }

        const result = interviewReportZod.parse(parsed);

        return result;

    } catch (error) {
        console.error("❌ Error generating interview report:", error);
        throw error;
    }
}

module.exports = generateInterviewReport;