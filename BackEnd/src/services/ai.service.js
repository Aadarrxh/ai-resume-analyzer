const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

const interviewReportZod = z.object({
    matchScore: z.number(),
    technicalQuestions: z.array(z.object({
        question: z.string(),
        intention: z.string(),
        answer: z.string()
    })),
    behavioralQuestions: z.array(z.object({
        question: z.string(),
        intention: z.string(),
        answer: z.string()
    })),
    skillGaps: z.array(z.object({
        skill: z.string(),
        severity: z.enum([ "low", "medium", "high" ])
    })),
    preparationPlan: z.array(z.object({
        day: z.number(),
        focus: z.string(),
        tasks: z.array(z.string())
    })),
    title: z.string(),
});

const nativeGeminiSchema = {
    type: "OBJECT",
    properties: {
        matchScore: { type: "INTEGER", description: "Score between 0 and 100 indicating job fit." },
        title: { type: "STRING", description: "The target job title." },
        skillGaps: {
            type: "ARRAY",
            items: {
                type: "OBJECT",
                properties: {
                    skill: { type: "STRING" },
                    severity: { type: "STRING", enum: ["low", "medium", "high"] }
                },
                required: ["skill", "severity"]
            }
        },
        technicalQuestions: {
            type: "ARRAY",
            items: {
                type: "OBJECT",
                properties: {
                    question: { type: "STRING", description: "In-depth technical question" },
                    intention: { type: "STRING", description: "What the interviewer is looking for" },
                    answer: { type: "STRING", description: "Detailed guide, code points, or approach to answer" }
                },
                required: ["question", "intention", "answer"]
            }
        },
        behavioralQuestions: {
            type: "ARRAY",
            items: {
                type: "OBJECT",
                properties: {
                    question: { type: "STRING", description: "Behavioral core question" },
                    intention: { type: "STRING", description: "What soft skills are being tested" },
                    answer: { type: "STRING", description: "How to apply the STAR structure to answer" }
                },
                required: ["question", "intention", "answer"]
            }
        },
        preparationPlan: {
            type: "ARRAY",
            items: {
                type: "OBJECT",
                properties: {
                    day: { type: "INTEGER", description: "Day milestone number, sequential from 1 to 10" },
                    focus: { type: "STRING", description: "Main theme of the study day" },
                    tasks: { type: "ARRAY", items: { type: "STRING" }, description: "Specific steps to execute" }
                },
                required: ["day", "focus", "tasks"]
            }
        }
    },
    required: ["matchScore", "title", "skillGaps", "technicalQuestions", "behavioralQuestions", "preparationPlan"]
};

async function generateInterviewReport({
    resume,
    selfDescription,
    jobDescription
}) {
    const prompt = `
You are an expert technical interviewer and executive talent recruiter. Your job is to output a comprehensive preparation data payload for a candidate.

CRITICAL POPULATION CONSTRAINTS:
1. "technicalQuestions": You must generate an array containing exactly 8 highly-specific questions.
2. "behavioralQuestions": You must generate an array containing exactly 7 highly-specific questions.
3. "preparationPlan": You must populate exactly 10 day entries inside this array (Day 1 through Day 10). Provide actionable, distinct tasks for each day.

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
            config: {
                responseMimeType: "application/json",
                responseSchema: nativeGeminiSchema, 
                maxOutputTokens: 25000, 
                temperature: 0.6
            }
        });

        const rawText = response.text;

        if (!rawText) {
            throw new Error("No payload returned from Gemini engine");
        }

        const parsed = JSON.parse(rawText);
        
        const result = interviewReportZod.parse(parsed);
        return result;

    } catch (error) {
        console.error("❌ Error generating interview report:", error);
        throw error;
    }
}

module.exports = generateInterviewReport;