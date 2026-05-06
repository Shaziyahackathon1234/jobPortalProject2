import OpenAI from "openai";

export const getMatchScore = async (req, res) => {
    try {
        const { resumeSkills, jobDescription } = req.body;

        // 1. Validation
        if (!resumeSkills || !jobDescription) {
            return res.status(400).json({
                message: "Missing skills or job description",
                success: false
            });
        }

        // 2. Check for the new Groq API Key
        if (!process.env.GROQ_API_KEY) {
            console.error("AI CONFIG ERROR: GROQ_API_KEY is missing from Render environment.");
            return res.status(500).json({
                message: "Server configuration error: AI Key missing.",
                success: false
            });
        }

        // 3. Initialize Groq (OpenAI-compatible)
        const groq = new OpenAI({
            apiKey: process.env.GROQ_API_KEY,
            baseURL: "https://api.groq.com/openai/v1", 
        });

        // 4. Request Analysis with strict scoring rules
        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: `You are a Technical Recruiter expert in the MERN stack. 
                    Evaluate the overlap between the resume and job description.
                    SCORING RULES:
                    - Provide an integer score from 0 to 100.
                    - 100 means a perfect match of technical skills.
                    - Do NOT penalize the candidate if their experience exceeds the job level.
                    - Return ONLY a JSON object.`
                },
                {
                    role: "user",
                    content: `Resume Skills: ${resumeSkills}\n\nJob Description: ${jobDescription}\n\nReturn JSON: {"score": number, "feedback": string, "missingSkills": array}`
                }
            ],
            // This is the CRITICAL line that ensures perfect JSON output
            response_format: { type: "json_object" }
        });

        // 5. Parse and return
        const result = JSON.parse(response.choices[0].message.content);

        return res.status(200).json({
            data: result,
            success: true
        });

    } catch (error) {
        console.error("AI Error:", error.message);
        return res.status(500).json({ 
            message: "AI Analysis failed to process.", 
            error: error.message,
            success: false 
        });
    }
};