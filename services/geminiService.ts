

import { GoogleGenAI, Type } from '@google/genai';
import { Experience, Skill, KeywordAnalysis, ResumeData, AtsAnalysis } from '../types';

let ai: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!process.env.API_KEY) {
    // This error will only be thrown when an AI function is called, not on app load.
    console.error("API_KEY environment variable not set. Gemini API calls will fail.");
    throw new Error("Gemini API key is not configured. Please set the API_KEY environment variable.");
  }
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
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
    const client = getAiClient();
    const response = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating summary:", error);
    throw new Error("Failed to communicate with the AI model.");
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
        const client = getAiClient();
        const response = await client.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating bullet points:", error);
        throw new Error("Failed to communicate with the AI model.");
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
    const client = getAiClient();
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating cover letter:", error);
    throw new Error("Failed to communicate with the AI model.");
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

    try {
        const client = getAiClient();
        const response = await client.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
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
            },
        });
        
        // The response text is a string that needs to be parsed into JSON.
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as KeywordAnalysis;

    } catch (error) {
        console.error("Error analyzing keywords:", error);
        throw new Error("Failed to communicate with the AI model for keyword analysis.");
    }
}

export async function analyzeAtsCompatibility(resumeData: ResumeData): Promise<AtsAnalysis> {
    const prompt = `
      As an expert ATS resume checker, analyze the following resume data for compatibility with Applicant Tracking Systems.
      Based on the data, evaluate these ATS best practices:
      1.  **Contact Information**: Is the name, email, and phone number present and clear?
      2.  **Standard Section Headings**: Does it use common headings like "Experience", "Education", "Skills"?
      3.  **Job Experience Format**: Are job titles, companies, and dates clearly listed for each role?
      4.  **Date Formatting**: Are dates written in a simple, consistent format (e.g., "Jan 2020" or "01/2020")?
      5.  **Skill Section**: Is there a dedicated section for skills?
      6.  **File Type & Formatting**: Assume the output will be plain text. Are there any complex elements like tables or graphics implied by the data structure that would fail parsing? (e.g., skill ratings like 'Expert' are parsable).
  
      Provide a "score" of 'Good', 'Fair', or 'Needs Improvement'.
      List the specific checks that passed in a "passedChecks" array.
      List actionable suggestions for improvement in a "suggestions" array. If no issues, provide general tips.
  
      Resume Data:
      ---
      ${JSON.stringify(resumeData)}
      ---
    `;
  
    try {
      const client = getAiClient();
      const response = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.STRING },
              passedChecks: { type: Type.ARRAY, items: { type: Type.STRING } },
              suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
          },
        },
      });
  
      const jsonText = response.text.trim();
      return JSON.parse(jsonText) as AtsAnalysis;
  
    } catch (error) {
      console.error("Error analyzing ATS compatibility:", error);
      throw new Error("Failed to communicate with the AI model for ATS analysis.");
    }
  }