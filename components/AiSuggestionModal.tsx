
import React, { useState, useCallback } from 'react';
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
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);

  const fetchSuggestion = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let result;
      if (type === 'summary') {
        result = await generateSummary(context.jobTitle, context.experience, context.skills, customPrompt);
      } else if (type === 'bulletPoints') {
        result = await generateBulletPoints(context.jobTitle, context.company, context.description, customPrompt);
      } else { // 'coverLetter'
        result = await generateCoverLetter(context.resumeData, context.recipientName, context.recipientCompany, customPrompt);
      }
      setSuggestion(result);
      setHasGenerated(true);
    } catch (err) {
      setError('Failed to get AI suggestion. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [type, context, customPrompt]);

  const handleAccept = () => {
    onAccept(suggestion);
    onClose();
  };
  
  const handleRegenerate = () => {
      fetchSuggestion();
  }

  const getPlaceholder = () => {
      if (type === 'summary') return "e.g., Focus on my leadership skills and experience in agile environments...";
      if (type === 'bulletPoints') return "e.g., Emphasize the 20% revenue growth and team management...";
      return "e.g., Mention my passion for sustainability and specific interest in their new project...";
  }

  const getTitle = () => {
      if (type === 'summary') return "Generate Professional Summary";
      if (type === 'bulletPoints') return "Enhance Experience Bullets";
      return "Generate Cover Letter";
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl transform transition-all flex flex-col max-h-[90vh]">
        <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
          <div className="flex items-center">
            <MagicIcon className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 ml-2">{getTitle()}</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
           {/* Input Section */}
           <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Custom Instructions (Optional)
                </label>
                <textarea
                    className="w-full p-3 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-50"
                    rows={3}
                    placeholder={getPlaceholder()}
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Use this to guide the AI tone (e.g., "Make it authoritative", "Focus on soft skills") or to mention specific achievements you want highlighted.
                </p>
                <button
                    onClick={fetchSuggestion}
                    disabled={isLoading}
                    className="mt-3 w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                    {isLoading ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Generating...
                        </>
                    ) : (
                        <>
                            <MagicIcon className="h-4 w-4 mr-2" />
                            {hasGenerated ? 'Regenerate' : 'Generate'}
                        </>
                    )}
                </button>
           </div>

           {/* Error Message */}
           {error && (
             <div className="text-red-500 bg-red-100 p-4 rounded-md mb-4 dark:bg-red-900/30 dark:text-red-300">{error}</div>
           )}

           {/* Result Section */}
           {hasGenerated && !isLoading && (
             <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    AI Suggestion
                </label>
                <textarea
                  className="w-full h-48 p-3 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-50"
                  value={suggestion}
                  onChange={(e) => setSuggestion(e.target.value)}
                />
             </div>
           )}
        </div>

        {hasGenerated && (
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-b-lg flex justify-end space-x-4 border-t dark:border-gray-700">
              <button
                onClick={onClose}
                className="px-6 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500 dark:hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleAccept}
                disabled={isLoading || !!error}
                className="px-6 py-2 text-sm font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:bg-green-300"
              >
                Accept & Use
              </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default AiSuggestionModal;
