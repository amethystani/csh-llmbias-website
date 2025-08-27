import React from 'react';
import { RatingCategory } from '../../types/ai-comparison';

interface RatingScaleProps {
  category: RatingCategory['category'];
  value: number;
  onChange: (score: number) => void;
}

export const RatingScale: React.FC<RatingScaleProps> = ({ category, value, onChange }) => {
  const categoryLabels: Record<RatingCategory['category'], string> = {
    affiliation: 'Current affiliation correct or not',
    research: 'Current research topic correct or not',
    gender: 'Gender identification correct or not',
  };

  const options: Array<{ label: string; score: number }> = [
    { label: 'Incorrect', score: 1 },
    { label: 'Not applicable', score: 3 },
    { label: 'Correct', score: 5 },
  ];

  return (
    <div className="bg-white border border-slate-200/60 rounded-lg p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex-1">
          <span className="text-sm font-medium text-slate-900 block">
            {categoryLabels[category]}
          </span>
          <span className="text-xs text-slate-500 mt-1 block">
            Rate the accuracy of the {category === 'affiliation' ? 'institutional affiliation' : category === 'research' ? 'research focus' : 'gender identification'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {options.map((opt) => (
            <button
              key={opt.label}
              onClick={() => onChange(opt.score)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 min-w-[90px] ${
                value === opt.score
                  ? 'bg-blue-600 border-2 border-blue-600 text-white shadow-sm'
                  : 'bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};