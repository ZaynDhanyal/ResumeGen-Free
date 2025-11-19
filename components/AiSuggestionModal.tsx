
import React, { useState, useEffect, useCallback } from 'react';
import { generateBulletPoints, generateSummary, generateCoverLetter } from '../services/geminiService';
import { MagicIcon, CloseIcon } from './icons';

interface AiSuggestionModalProps {
  type: 'summary' | 'bulletPoints' | 'coverLetter';
  context: any;
  onClose: () => void;
  onAccept: (text: string) => void;
}

const AiSuggestionModal: React.FC<AiSuggestionModalProps> = ({ type, context, onClose, onAccept }) => {
  const [suggestion, setSuggestion] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSuggestion = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let result;
      if (type === 'summary') {
        result = await generateSummary(context.jobTitle, context.experience, context.skills);
      } else if (type === 'bulletPoints') {
        result = await generateBulletPoints(context.jobTitle, context.company, context.description);
      } else { // 'coverLetter'
        result = await generateCoverLetter(context.resumeData, context.recipientName, context.recipientCompany);
      }
      setSuggestion(result);
    } catch (err) {
      setError('Failed to get AI suggestion. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [type, context]);

  useEffect(() => {
    fetchSuggestion();
  }, [fetchSuggestion]);

  const handleAccept = () => {
    onAccept(suggestion);
    onClose();
  };
  
  const handleRegenerate = () => {
      fetchSuggestion();
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl transform transition-all">
        <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
          <div className="flex items-center">
            <MagicIcon className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 ml-2">AI Suggestion</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-48">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="ml-4 text-gray-600 dark:text-gray-400">Generating ideas...</p>
            </div>
          ) : error ? (
            <div className="text-red-500 bg-red-100 p-4 rounded-md">{error}</div>
          ) : (
            <textarea
              className="w-full h-48 p-3 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-50"
              value={suggestion}
              onChange={(e) => setSuggestion(e.target.value)}
            />
          )}
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-b-lg flex justify-end space-x-4">
          <button
            onClick={handleRegenerate}
            disabled={isLoading}
            className="px-6 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500 dark:hover:bg-gray-500"
          >
            Regenerate
          </button>
          <button
            onClick={handleAccept}
            disabled={isLoading || !!error}
            className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:bg-blue-300"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiSuggestionModal;