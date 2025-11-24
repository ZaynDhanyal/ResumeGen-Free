import { Experience, Skill, KeywordAnalysis, ResumeData } from '../types';

// AI features have been disabled. These functions are now stubs.

export async function generateSummary(jobTitle: string, experience: Experience[], skills: Skill[], customInstruction?: string): Promise<string> {
  return "";
}

export async function generateBulletPoints(jobTitle: string, company: string, description: string, customInstruction?: string): Promise<string> {
  return "";
}

export async function generateCoverLetter(resumeData: ResumeData, recipientName: string, recipientCompany: string, customInstruction?: string): Promise<string> {
  return "";
}

export async function analyzeKeywords(resumeText: string, jobDescription: string): Promise<KeywordAnalysis> {
    return { presentKeywords: [], missingKeywords: [] };
}