import React, { useState, useCallback } from 'react';
import { ResumeData, AtsAnalysis } from '../types';
import { analyzeAtsCompatibility } from '../services/geminiService';
import { CheckCircleIcon, LightBulbIcon, ShieldCheckIcon } from './icons';

interface AtsCheckerProps {
  resumeData: ResumeData;
}

const AtsChecker: React.FC<AtsCheckerProps> = ({ resumeData }) => {
  const [analysis, setAnalysis] = useState<AtsAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    try {
      const result = await analyzeAtsCompatibility(resumeData);
      setAnalysis(result);
    } catch (err) {
      setError('Failed to analyze resume for ATS. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [resumeData]);

  const getScoreColorClasses = (score: AtsAnalysis['score']): string => {
    switch (score) {
      case 'Good':
        return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      case 'Fair':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      case 'Needs Improvement':
        return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mt-6">
      <div className="flex items-center mb-4">
        <ShieldCheckIcon className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 ml-3">ATS Compatibility Check</h2>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Check if your resume is optimized for automated screening systems (ATS). This tool analyzes formatting, keywords, and structure.
      </p>
      <button
        onClick={handleAnalyze}
        disabled={isLoading}
        className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 disabled:opacity-50 disabled:bg-blue-400 transition-colors"
      >
        {isLoading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
        ) : (
          'Analyze for ATS Friendliness'
        )}
      </button>

      {error && <p className="text-red-500 dark:text-red-400 mt-4">{error}</p>}
      
      {analysis && (
        <div className="mt-6 space-y-6">
          <div className="text-center">
            <span className={`px-4 py-1 text-sm font-bold rounded-full ${getScoreColorClasses(analysis.score)}`}>
              Compatibility Score: {analysis.score}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2 flex items-center">
                <CheckCircleIcon className="h-5 w-5 mr-2 text-green-500" />
                Checks Passed
              </h3>
              <ul className="space-y-2">
                {analysis.passedChecks.map((item, i) => (
                  <li key={i} className="text-sm text-gray-700 dark:text-gray-300 flex items-start">
                    <span className="text-green-500 mr-2 mt-1">&#10003;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2 flex items-center">
                <LightBulbIcon className="h-5 w-5 mr-2 text-yellow-500" />
                Suggestions for Improvement
              </h3>
              <ul className="space-y-2">
                {analysis.suggestions.map((item, i) => (
                  <li key={i} className="text-sm text-gray-700 dark:text-gray-300 flex items-start">
                     <span className="text-yellow-500 mr-2 mt-1">&#8226;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AtsChecker;