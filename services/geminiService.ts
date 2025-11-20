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
      const errorData = await response.json().catch(() => ({}));
      console.error("API Error:", errorData);
      throw new Error(errorData.error || 'Failed to fetch from AI service');
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("Gemini Service Error:", error);
    throw error;
  }
}

export async function generateSummary(jobTitle: string, experience: Experience[], skills: Skill[]): Promise<string> {
  const skillsList = skills.map(s => s.name).join(', ');
  const experienceSummary = experience.map(e => `Worked as ${e.jobTitle} at ${e.company}.`).join(' ');
  
  const prompt = `
    Generate a professional and concise resume summary for a "${jobTitle}".
    The candidate has the following experience: ${experienceSummary}.
    Key skills include: ${skillsList}.
    The summary should be 3-4 sentences long, highlighting key strengths and career goals.
    Do not use markdown.
  `;

  try {
    return await callGeminiApi(prompt);
  } catch (error) {
    return "Failed to generate summary. Please try again later.";
  }
}

export async function generateBulletPoints(jobTitle: string, company: string, description: string): Promise<string> {
    const prompt = `
    Based on the role of "${jobTitle}" at "${company}" with the following context: "${description}", 
    generate 3-5 impactful, professional resume bullet points.
    Use the STAR method (Situation, Task, Action, Result) and quantify achievements where possible.
    Start each bullet point with '• '.
    Separate each bullet point with a newline character.
    Do not use markdown.
    `;
    
    try {
        return await callGeminiApi(prompt);
    } catch (error) {
        return "• Failed to generate bullet points.";
    }
}

export async function generateCoverLetter(resumeData: ResumeData, recipientName: string, recipientCompany: string): Promise<string> {
  const prompt = `
    Write a professional and compelling cover letter body based on the following resume.
    The letter is for a position at "${recipientCompany}" and is addressed to "${recipientName || 'Hiring Manager'}".

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
    return await callGeminiApi(prompt);
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
