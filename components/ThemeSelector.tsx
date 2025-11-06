import React from 'react';
import { ThemeId } from '../types';
import { THEMES } from '../constants';

interface ThemeSelectorProps {
  selectedTheme: ThemeId;
  onSelectTheme: (id: ThemeId) => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ selectedTheme, onSelectTheme }) => {
  return (
    <div className="flex items-center space-x-3">
      {THEMES.map(theme => (
        <button
          key={theme.id}
          title={theme.name}
          onClick={() => onSelectTheme(theme.id)}
          className={`w-8 h-8 rounded-full transition-transform transform hover:scale-110 focus:outline-none ${selectedTheme === theme.id ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
          style={{ backgroundColor: theme.colors.primary }}
        />
      ))}
    </div>
  );
};

export default ThemeSelector;
