import React from 'react';
import { TemplateId } from '../types';
import { TEMPLATES } from '../constants';

interface TemplateSelectorProps {
  selected: TemplateId;
  onSelect: (id: TemplateId) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ selected, onSelect }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2 text-gray-700">Select a Template</h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-4">
        {TEMPLATES.map(template => (
          <button
            key={template.id}
            onClick={() => onSelect(template.id)}
            className={`w-full text-center p-2 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              selected === template.id
                ? 'border-blue-600 bg-blue-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-blue-400'
            }`}
          >
            <img 
              src={template.imageUrl} 
              alt={`${template.name} template preview`} 
              className="w-full h-24 sm:h-32 object-cover object-top rounded-md mb-2 border border-gray-300"
            />
            <span className={`font-medium text-sm ${selected === template.id ? 'text-blue-700' : 'text-gray-800'}`}>
              {template.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;
