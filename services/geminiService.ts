import { Type } from '@google/genai';
import { Experience, Skill, KeywordAnalysis, ResumeData } from '../types';

const MISSING_KEY_MSG = "AI service unavailable. Please ensure the API_KEY is set in your Vercel project settings.";

async function callGeminiApi(prompt: string, config?: any, model?: string): Promise<string> {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model || 'gemini-2.5-flash',
        contents: prompt,
        config: config
      })
    });

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
         const errorData = await response.json();
         console.error("API Error:", errorData);
         throw new Error(errorData.error || 'Failed to fetch from AI service');
      } else {
         const text = await response.text();
         console.error("API returned non-JSON response:", text);
         throw new Error("Server returned an unexpected response. Please check the Vercel logs.");
      }
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("Gemini Service Error:", error);
    throw error;
  }
}

export async function generateSummary(jobTitle: string, experience: Experience[], skills: Skill[], customInstruction?: string): Promise<string> {
  const skillsList = skills.map(s => s.name).join(', ');
  // Provide more details including descriptions and dates to the AI
  const experienceSummary = experience.map(e => 
    `Role: ${e.jobTitle} at ${e.company} (${e.startDate} - ${e.endDate}).\nDetails/Achievements: ${e.description}`
  ).join('\n\n');
  
  const prompt = `
    You are an expert professional resume writer with extensive experience in HR and Talent Acquisition.
    
    TASK: Write a powerful, high-impact professional summary (3-5 sentences) for a candidate applying for the role of "${jobTitle}".

    CANDIDATE PROFILE:
    
    TOP SKILLS: ${skillsList}

    EXPERIENCE HISTORY:
    ${experienceSummary}

    ${customInstruction ? `USER CUSTOM INSTRUCTIONS (PRIORITIZE THESE): ${customInstruction}` : ''}

    WRITING INSTRUCTIONS:
    1.  **Start Strong:** Begin with a powerful adjective and the candidate's current professional identity (e.g., "Dynamic Senior Product Manager...").
    2.  **Infer Seniority:** Analyze the dates in the experience history to mention the approximate years of experience (e.g., "with over 7 years of proven expertise...").
    3.  **Quantify & Verify:** Identify specific achievements, metrics, or major responsibilities from the experience descriptions and weave the most impressive ones into the summary.
    4.  **Keyword Integration:** Naturally incorporate the top skills listed above to optimize for ATS (Applicant Tracking Systems).
    5.  **Tone:** Authoritative, results-oriented, and professional. Avoid generic buzzwords like "hard-working" or "synergy" unless substantiated.
    6.  **Format:** Return a single, cohesive paragraph of plain text. Do not use Markdown, bolding, or bullet points.
  `;

  try {
    // Limit tokens to speed up response
    return await callGeminiApi(prompt, { maxOutputTokens: 500 });
  } catch (error) {
    return "Failed to generate summary. Please try again later.";
  }
}

export async function generateBulletPoints(jobTitle: string, company: string, description: string, customInstruction?: string): Promise<string> {
    const prompt = `
    You are an expert resume strategist. Your task is to transform the user's rough input into 3-5 sharp, results-oriented bullet points that demonstrate value.

    CONTEXT:
    - Role: "${jobTitle}"
    - Company: "${company}"
    - User Input: "${description}"

    ${customInstruction ? `USER CUSTOM INSTRUCTIONS: ${customInstruction}` : ''}

    INSTRUCTIONS:
    1.  **Prioritize Impact (The 'So What?'):** Do not just list duties. Every bullet point must explain the result or impact of the action. Use the "Action + Context + Result" structure.
    2.  **Quantify Aggressively:** 
        - If the user provides numbers, highlight them.
        - If numbers are missing, use quantitative phrasing to imply scale and efficiency (e.g., "Driving revenue growth," "Reducing operational bottlenecks," "Accelerating project timelines," "Serving a diverse client base").
    3.  **Strong Action Verbs:** Start every bullet with a specific, high-level power verb (e.g., Spearheaded, Orchestrated, Engineered, Revitalized) rather than weak ones (e.g., Helped, Worked on).
    4.  **Specifics:** If the input is vague (e.g., "Did coding"), infer likely specific high-value tasks for a "${jobTitle}" (e.g., "Developed scalable microservices," "Optimized legacy codebase").
    5.  **Format:** 
        - Strictly return 3 to 5 bullet points.
        - Start each line with '• '.
        - Separate points with a newline.
        - Do not use Markdown or bold text.
    `;
    
    try {
        // Limit tokens to speed up response
        return await callGeminiApi(prompt, { maxOutputTokens: 500 });
    } catch (error) {
        return "• Failed to generate bullet points.";
    }
}

export async function generateCoverLetter(resumeData: ResumeData, recipientName: string, recipientCompany: string, customInstruction?: string): Promise<string> {
  const prompt = `
    Write a professional and compelling cover letter body based on the following resume.
    The letter is for a position at "${recipientCompany}" and is addressed to "${recipientName || 'Hiring Manager'}".

    ${customInstruction ? `USER CUSTOM INSTRUCTIONS: ${customInstruction}` : ''}

    The candidate's resume details are:
    - Name: ${resumeData.personalInfo.fullName}
    - Role: ${resumeData.personalInfo.jobTitle}
    - Summary: ${resumeData.summary}
    - Experience: ${resumeData.experience.map(e => `${e.jobTitle} at ${e.company}: ${e.description.replace(/\n/g, ' ')}`).join('; ')}
    - Skills: ${resumeData.skills.map(s => s.name).join(', ')}

    The cover letter should have three paragraphs:
    1. Introduction: State the purpose of the letter and the position being applied for.
    2. Body: Highlight relevant skills and experiences from the resume that match a potential role at ${recipientCompany}.
    3. Conclusion: Express enthusiasm for the opportunity and a call to action for an interview.

    Only generate the letter's main content. Start with "Dear ${recipientName || 'Hiring Manager'}," and end with the final paragraph, without any closing like "Sincerely,".
    Do not use markdown.
  `;

  try {
    // Limit tokens to speed up response
    return await callGeminiApi(prompt, { maxOutputTokens: 1000 });
  } catch (error) {
    return "Failed to generate cover letter.";
  }
}


export async function analyzeKeywords(resumeText: string, jobDescription: string): Promise<KeywordAnalysis> {
    const prompt = `
    Analyze the following resume and job description.
    Identify important keywords from the job description.
    Compare the resume against these keywords.
    Return a JSON object with two arrays: 'presentKeywords' (keywords found in both) and 'missingKeywords' (keywords in the job description but not the resume).

    Job Description:
    ---
    ${jobDescription}
    ---

    Resume:
    ---
    ${resumeText}
    ---
    `;

    const config = {
        responseMimeType: 'application/json',
        maxOutputTokens: 1000, // Limit response size
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                presentKeywords: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                },
                missingKeywords: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                },
            },
        },
    };

    try {
        const text = await callGeminiApi(prompt, config);
        const jsonText = text ? text.trim() : "{}";
        return JSON.parse(jsonText) as KeywordAnalysis;

    } catch (error) {
        console.error("Error analyzing keywords:", error);
        return { presentKeywords: [], missingKeywords: [] };
    }
}