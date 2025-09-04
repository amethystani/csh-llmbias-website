import React, { useState } from 'react';
import { Person } from '../../types/genealogy';
import { Users } from 'lucide-react';
import API_ENDPOINTS from '../../config/api';

interface SupervisionQuestionnaireProps {
  selectedProfessor?: Person;
  onClearSelection?: () => void;
}

export const SupervisionQuestionnaire: React.FC<SupervisionQuestionnaireProps> = ({
  selectedProfessor,
  onClearSelection,
}) => {
  const [supervisors, setSupervisors] = useState('');
  const [supervisees, setSupervisees] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');



  


  const handleSubmitAnswers = () => {
    if (!selectedProfessor) {
      return;
    }

    setSaveStatus('saving');

    // Prepare the assessment data with the new format
    const assessmentData = {
      id: crypto.randomUUID(),
      person_name: selectedProfessor.name,
      supervisors: supervisors.trim(),
      supervisees: supervisees.trim(),
      source_url: sourceUrl.trim(),
      timestamp: new Date().toISOString(),
      notes: `Assessment for ${selectedProfessor.name}'s genealogy`
    };

    // Save to backend asynchronously
    fetch(API_ENDPOINTS.genealogyAssessments, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(assessmentData),
    })
    .then(response => {
      if (response.ok) {
        console.log('Assessment saved successfully');
        setSaveStatus('success');
        
        // Reset form after a delay
        setTimeout(() => {
          setSupervisors('');
          setSupervisees('');
          setSourceUrl('');
          setSaveStatus('idle');
        }, 2000);
      } else {
        console.error('Failed to save assessment:', response.status);
        setSaveStatus('error');
        
        // Reset status after delay
        setTimeout(() => {
          setSaveStatus('idle');
        }, 3000);
      }
    })
    .catch(error => {
      console.error('Error saving assessment:', error);
      setSaveStatus('error');
      
      // Reset status after delay
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    });
  };

  // Return null if no professor is selected
  if (!selectedProfessor) {
    return null;
  }

  // Show assessment form
  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 sm:p-8">
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 sm:mb-6">
          <div className="mb-4 lg:mb-0">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">
              Genealogy Assessment
            </h3>
            <p className="text-base sm:text-lg text-slate-700">
              Assessing supervision relationships for: <span className="font-bold text-emerald-700 bg-emerald-100/50 px-2 sm:px-3 py-1 rounded-full">{selectedProfessor.name}</span>
            </p>
          </div>
          <button
            onClick={onClearSelection}
            className="text-sm text-emerald-600 hover:text-emerald-800 font-medium hover:underline transition-all duration-200"
          >
            Change Selection
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-50/80 to-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 mb-6 sm:mb-8 border border-white/30">
        <div className="flex flex-col sm:flex-row items-center justify-center mb-6 sm:mb-8 gap-4">
          <div className="bg-white/60 backdrop-blur-sm rounded-full p-3">
            <Users className="w-8 h-8 sm:w-10 sm:h-10 text-slate-700" />
          </div>
          <h4 className="text-xl sm:text-2xl font-bold text-slate-800 text-center">
            Academic Supervision Information for {selectedProfessor.name}
          </h4>
        </div>

        <div className="space-y-6">
          {/* Supervisors Question */}
          <div>
            <label className="block text-lg sm:text-xl font-bold text-slate-800 mb-3">
              Supervisors
            </label>
            <textarea
              value={supervisors}
              onChange={(e) => setSupervisors(e.target.value)}
              className="w-full p-4 sm:p-5 bg-white/90 backdrop-blur-sm border border-white/60 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 text-base sm:text-lg resize-none shadow-lg hover:shadow-xl transition-all duration-500 ring-1 ring-slate-900/5"
              rows={3}
              placeholder="Enter the names of supervisors (e.g., Dr. John Smith, Prof. Jane Doe). If none or unknown, write 'None' or 'Unknown'."
            />
          </div>

          {/* Supervisees Question */}
          <div>
            <label className="block text-lg sm:text-xl font-bold text-slate-800 mb-3">
              Supervised
            </label>
            <textarea
              value={supervisees}
              onChange={(e) => setSupervisees(e.target.value)}
              className="w-full p-4 sm:p-5 bg-white/90 backdrop-blur-sm border border-white/60 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 text-base sm:text-lg resize-none shadow-lg hover:shadow-xl transition-all duration-500 ring-1 ring-slate-900/5"
              rows={3}
              placeholder="Enter the names of people supervised by this person (e.g., Dr. Alice Brown, Prof. Bob Wilson). If none or unknown, write 'None' or 'Unknown'."
            />
          </div>

          {/* Source URL */}
          <div>
            <label className="block text-lg sm:text-xl font-bold text-slate-800 mb-3">
              Source URL (Optional)
            </label>
            <p className="text-sm text-slate-600 mb-3 italic">
              Please provide the URL from where you got the information
            </p>
            <input
              type="url"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              className="w-full p-4 sm:p-5 bg-white/90 backdrop-blur-sm border border-white/60 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-500 ring-1 ring-slate-900/5"
              placeholder="https://example.com/source-of-information"
            />
          </div>

          {/* Save Status Indicator */}
          {saveStatus !== 'idle' && (
            <div className={`p-4 rounded-2xl text-center font-semibold text-lg transition-all duration-500 ${
              saveStatus === 'saving' ? 'bg-blue-100 text-blue-800' :
              saveStatus === 'success' ? 'bg-emerald-100 text-emerald-800' :
              'bg-red-100 text-red-800'
            }`}>
              {saveStatus === 'saving' && (
                <div className="flex items-center justify-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  Saving assessment...
                </div>
              )}
              {saveStatus === 'success' && (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 bg-emerald-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  Assessment saved successfully!
                </div>
              )}
              {saveStatus === 'error' && (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✕</span>
                  </div>
                  Failed to save assessment. Please try again.
                </div>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmitAnswers}
            disabled={(!supervisors.trim() && !supervisees.trim()) || saveStatus === 'saving'}
            className={`w-full py-5 sm:py-6 px-6 sm:px-8 rounded-2xl transition-all duration-300 text-lg sm:text-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] border ${
              saveStatus === 'saving' 
                ? 'bg-blue-500 text-white border-blue-400/30 cursor-not-allowed'
                : saveStatus === 'success'
                ? 'bg-emerald-500 text-white border-emerald-400/30'
                : (!supervisors.trim() && !supervisees.trim())
                ? 'bg-slate-300 text-slate-500 border-slate-200/30 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white border-emerald-400/30'
            }`}
          >
            {saveStatus === 'saving' ? 'Saving...' : 'Save Assessment'}
          </button>
        </div>
      </div>
    </div>
  );
};