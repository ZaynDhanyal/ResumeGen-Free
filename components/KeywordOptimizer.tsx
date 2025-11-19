
import React, { useState, useCallback } from 'react';
import { ResumeData, KeywordAnalysis } from '../types';
import { analyzeKeywords } from '../services/geminiService';
import { CheckCircleIcon, XCircleIcon, SearchIcon, DocumentSearchIcon } from './icons';

interface KeywordOptimizerProps {
  resumeData: ResumeData;
}

const KeywordOptimizer: React.FC<KeywordOptimizerProps> = ({ resumeData }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState<KeywordAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(async () => {
    if (!jobDescription) {
      setError('Please paste a job description to analyze.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    try {
      const resumeText = JSON.stringify(resumeData);
      const result = await analyzeKeywords(resumeText, jobDescription);
      setAnalysis(result);
    } catch (err) {
      setError('Failed to analyze keywords. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [jobDescription, resumeData]);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mt-6">
      <div className="flex items-center mb-4">
        <DocumentSearchIcon className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 ml-3">Keyword Optimizer</h2>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Paste a job description below to see how well your resume matches. The AI will identify key skills and suggest ones you might be missing.
      </p>
      <textarea
        className="w-full h-40 p-3 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700/50 dark:border-gray-600 dark:text-gray-50 dark:placeholder:text-gray-400"
        placeholder="Paste job description here..."
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />
      <button
        onClick={handleAnalyze}
        disabled={isLoading}
        className="mt-4 w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 disabled:opacity-50 disabled:bg-blue-400 transition-colors"
      >
        {isLoading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
        ) : (
          <>
            <SearchIcon className="h-5 w-5 mr-2" />
            Analyze
          </>
        )}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}
      
      {analysis && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center">
              <CheckCircleIcon className="h-5 w-5 mr-2 text-green-500" />
              Keywords Found
            </h3>
            <div className="flex flex-wrap gap-2">
              {analysis.presentKeywords.map((kw, i) => (
                <span key={i} className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900/50 dark:text-green-300">{kw}</span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center">
              <XCircleIcon className="h-5 w-5 mr-2 text-red-500" />
              Missing Keywords
            </h3>
            <div className="flex flex-wrap gap-2">
              {analysis.missingKeywords.map((kw, i) => (
                <span key={i} className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-red-900/50 dark:text-red-300">{kw}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KeywordOptimizer;