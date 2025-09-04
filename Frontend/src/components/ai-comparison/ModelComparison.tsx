import React, { useState, useEffect, useRef } from 'react';
import { AIModel, ModelRating, RatingCategory, Scientist, ModelBiographyMap } from '../../types/ai-comparison';
import { RatingScale } from './RatingScale';
import { GraduationCap } from 'lucide-react';
import API_ENDPOINTS from '../../config/api';

interface ModelComparisonProps {
  onAddRating: (rating: ModelRating) => void;
}

export const ModelComparison: React.FC<ModelComparisonProps> = ({ onAddRating }) => {
  const [scientists, setScientists] = useState<Scientist[]>([]);
  const [selectedScientist, setSelectedScientist] = useState<Scientist | null>(null);
  const [biographyData, setBiographyData] = useState<ModelBiographyMap | null>(null);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const scientistSelectionRef = useRef<HTMLDivElement>(null);

  // Simple model anonymization with initials for unbiased research
  const getAnonymizedModelName = (modelName: string): string => {
    // Create a simple mapping based on model keywords
    const getInitial = (name: string): string => {
      const lowerName = name.toLowerCase();
      
      // Check for specific model patterns and assign consistent initials
      if (lowerName.includes('deepseek')) return 'D';
      if (lowerName.includes('gpt') || lowerName.includes('davinci')) return 'G';
      if (lowerName.includes('qwen')) return 'Q';
      if (lowerName.includes('gemma')) return 'M';
      if (lowerName.includes('claude')) return 'C';
      if (lowerName.includes('gemini') || lowerName.includes('bard')) return 'E';
      if (lowerName.includes('llama')) return 'L';
      if (lowerName.includes('mistral') || lowerName.includes('mixtral')) return 'X';
      if (lowerName.includes('cohere')) return 'H';
      if (lowerName.includes('palm')) return 'P';
      if (lowerName.includes('yi-')) return 'Y';
      
      // For unknown models, use first letter of the name
      return name.charAt(0).toUpperCase();
    };
    
    return `Bio-${getInitial(modelName)}`;
  };

  // Get display name for dropdown 
  const getDisplayModelName = (modelName: string): string => {
    return getAnonymizedModelName(modelName);
  };

  // Load scientists and models from API
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load scientists
        const scientistsResponse = await fetch(API_ENDPOINTS.scientists);
        if (scientistsResponse.ok) {
          const scientistsData = await scientistsResponse.json();
          if (scientistsData.success && scientistsData.scientists) {
            setScientists(scientistsData.scientists);
          }
        }

        // Load available models
        const modelsResponse = await fetch(API_ENDPOINTS.models);
        if (modelsResponse.ok) {
          const modelsData = await modelsResponse.json();
          if (modelsData.success && modelsData.models) {
            setAvailableModels(modelsData.models);
            
            // Console log for internal reference (development only)
            console.group('🔍 Model Anonymization Mapping (Internal Reference)');
            modelsData.models.forEach((model: string) => {
              console.log(`${getDisplayModelName(model)} -> ${model}`);
            });
            console.groupEnd();
          }
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };
    
    loadData();
  }, []);


  // Load biography when scientist is selected
  useEffect(() => {
    const loadBiography = async () => {
      if (!selectedScientist) {
        setBiographyData(null);
        return;
      }
      
      try {
        const response = await fetch(API_ENDPOINTS.biography(selectedScientist.name));
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.biography) {
            setBiographyData(data.biography); // This now contains all models for the scientist
          }
        }
      } catch (error) {
        console.error('Failed to load biography:', error);
      }
    };
    
    loadBiography();
  }, [selectedScientist]);

  const [ratings, setRatings] = useState<Record<string, RatingCategory[]>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});



  const ratingCategories: Array<RatingCategory['category']> = ['affiliation', 'research', 'gender', 'supervision'];

  const handleRatingChange = (modelKey: string, category: RatingCategory['category'], score: number) => {
    setRatings(prev => ({
      ...prev,
      [modelKey]: (prev[modelKey] || []).filter(r => r.category !== category).concat({ category, score })
    }));
  };

  const handleNotesChange = (modelKey: string, note: string) => {
    setNotes(prev => ({ ...prev, [modelKey]: note }));
  };

  const saveRating = async (modelKey: string) => {
    const modelRatings = ratings[modelKey] || [];
    if (modelRatings.length === 4 && selectedScientist && biographyData) { // Now 4 categories: affiliation, research, gender, supervision
      const rating: ModelRating = {
        id: crypto.randomUUID(),
        model: modelKey as AIModel,
        technique: 'zero-shot',
        prompt: `${selectedScientist.name} biography assessment`,
        response: `Response for ${modelKey}`,
        ratings: modelRatings,
        timestamp: new Date().toISOString(),
        notes: notes[modelKey] || undefined,
      };

      try {
        // Save to backend
        const response = await fetch(API_ENDPOINTS.ratings, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...rating,
            scientist_name: selectedScientist.name
          }),
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            console.log('Rating saved successfully to backend:', result);
            
            // Also save to local state
            onAddRating(rating);
            
            // Reset for this model
            setRatings(prev => ({ ...prev, [modelKey]: [] }));
            setNotes(prev => ({ ...prev, [modelKey]: '' }));
            
            // Show success message
            // Success feedback without popup - could add a toast notification here
          } else {
            console.error('Failed to save rating:', result.error);
            console.error('Failed to save rating:', result.error);
          }
        } else {
          console.error('HTTP error when saving rating:', response.status);
          console.error('Failed to save rating: Server error');
        }
      } catch (error) {
        console.error('Error saving rating to backend:', error);
        console.error('Failed to save rating: Network error');
      }
    }
  };

  return (
    <div className="space-y-10">
      {/* Scientist Selection Section */}
      <div className="bg-gradient-to-br from-white/90 to-blue-50/40 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/40 shadow-2xl p-6 sm:p-8 lg:p-12 ring-1 ring-slate-900/5">
        <div className="mb-8 sm:mb-10">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 sm:mb-4 tracking-tight">
            Biography Assessment
          </h3>
          <div className="w-12 sm:w-14 lg:w-16 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mb-3 sm:mb-4"></div>
          <p className="text-lg sm:text-xl lg:text-xl text-slate-700 font-medium leading-relaxed mb-4 sm:mb-6">
            Select a scientist to evaluate how different AI models describe their biography
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <div className="bg-gradient-to-br from-white/80 to-blue-50/60 backdrop-blur-sm rounded-2xl px-4 sm:px-6 py-3 sm:py-4 border border-blue-200/40 shadow-lg">
              <span className="text-2xl sm:text-3xl font-bold text-blue-700">{scientists.length}</span>
              <span className="text-slate-600 ml-2 font-semibold text-sm sm:text-base">Scientists Available</span>
            </div>
            <div className="bg-gradient-to-br from-white/80 to-emerald-50/60 backdrop-blur-sm rounded-2xl px-4 sm:px-6 py-3 sm:py-4 border border-emerald-200/40 shadow-lg">
              <span className="text-2xl sm:text-3xl font-bold text-emerald-700">{availableModels.length}</span>
              <span className="text-slate-600 ml-2 font-semibold text-sm sm:text-base">AI Models</span>
            </div>
          </div>
        </div>

        {/* Instructions Section */}
        <div className="bg-gradient-to-br from-blue-50/80 to-emerald-50/40 backdrop-blur-xl rounded-2xl border border-blue-200/40 p-6 sm:p-8 shadow-xl ring-1 ring-slate-900/5 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-3 shadow-lg">
              <div className="w-6 h-6 text-white font-bold text-center">?</div>
            </div>
            <h4 className="text-xl sm:text-2xl font-bold text-slate-900">Instructions</h4>
          </div>
          <div className="text-slate-700 text-base sm:text-lg leading-relaxed">
            <p className="mb-3">
              <strong>Important:</strong> Evaluate AI model biographies for accuracy. PhD supervision refers specifically to <strong>doctoral advisor relationships</strong>.
            </p>
            <p className="mb-3">
              <strong>Rating Options:</strong>
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1 mb-3">
              <li><strong>Correct:</strong> Information is accurate and complete</li>
              <li><strong>Partially Correct:</strong> Information is mostly accurate but missing some details</li>
              <li><strong>Incorrect:</strong> Information is wrong or misleading</li>
              <li><strong>Not Applicable:</strong> Category doesn't apply to this person</li>
              <li><strong>IDK:</strong> You don't know if the information is correct</li>
            </ul>
            <p className="mb-3">
              <strong>Research Guidelines:</strong> If you need to verify information, you can use <strong>Google</strong> to search for university websites, publications, and academic records.
            </p>
            <p className="text-sm text-slate-600 italic">
              Remember to provide source URLs when available to support your assessments.
            </p>
          </div>
        </div>

        {/* Scientists List */}
        <div className="space-y-6 sm:space-y-8">
          <div className="bg-gradient-to-r from-white/80 to-blue-50/60 backdrop-blur-sm rounded-2xl px-6 sm:px-8 py-3 sm:py-4 border border-blue-200/40 inline-block shadow-lg">
            <h4 className="font-bold text-slate-800 text-lg sm:text-xl">All Scientists ({scientists.length})</h4>
          </div>
          {scientists.length > 0 ? (
            <div className="grid gap-4 sm:gap-6 max-h-96 sm:max-h-[500px] overflow-y-auto">
              {scientists.map((scientist) => (
                <button
                  key={scientist.name}
                  onClick={() => {
                    setSelectedScientist(scientist);
                    // Scroll to scientist selection section after a brief delay
                    setTimeout(() => {
                      scientistSelectionRef.current?.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                      });
                    }, 100);
                  }}
                  className="text-left p-6 sm:p-8 bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl hover:bg-white/95 hover:border-blue-300 hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] ring-1 ring-slate-900/5 hover:ring-blue-500/20"
                >
                  <div className="flex items-center space-x-4 sm:space-x-6">
                    <div className="bg-gradient-to-br from-blue-100 to-blue-200/60 backdrop-blur-sm rounded-2xl p-3 sm:p-4 shadow-md">
                      <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-lg sm:text-xl mb-1">{scientist.name}</p>
                      <p className="text-slate-700 font-medium text-base sm:text-lg">{scientist.type}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 sm:py-16 bg-gradient-to-br from-white/60 to-slate-50/40 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg">
              <p className="text-slate-600 text-lg sm:text-xl font-medium">No scientists available. Loading...</p>
            </div>
          )}
        </div>

        {/* Selected Scientist Display */}
        {selectedScientist && biographyData && (
          <div ref={scientistSelectionRef} className="space-y-8">
            <div className="bg-gradient-to-br from-blue-50/80 to-emerald-50/40 backdrop-blur-xl rounded-2xl border border-blue-200/40 p-6 sm:p-8 shadow-xl ring-1 ring-slate-900/5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
                <div className="flex items-center">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-3 sm:p-4 mr-4 sm:mr-6 shadow-lg">
                    <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">{selectedScientist.name}</h4>
                    <p className="text-base sm:text-lg text-slate-600 font-medium">All Model Biographies</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedScientist(null);
                    setBiographyData({});
                  }}
                  className="bg-white/90 hover:bg-white text-slate-700 hover:text-slate-900 px-6 sm:px-8 py-3 rounded-2xl border border-slate-200/60 font-bold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-[1.02] ring-1 ring-slate-900/5 w-full sm:w-auto"
                >
                  Change Selection
                </button>
              </div>
            </div>

            {/* All Model Biographies with Integrated Rating */}
            {availableModels.map((model) => {
              const modelData = biographyData[model];
              if (!modelData) return null;
              const modelKey = model.toLowerCase().replace(/[^a-z0-9]/g, '_');

              return (
                <div key={model} className="bg-white/90 backdrop-blur-xl rounded-2xl border border-white/60 p-6 sm:p-8 shadow-xl ring-1 ring-slate-900/5">
                  <h5 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 sm:mb-8 text-center">
                    {getDisplayModelName(model)}
                  </h5>
                  
                  <div className="grid gap-6 lg:grid-cols-3 mb-8">
                    {/* Combined Biography */}
                    <div className="lg:col-span-2 bg-gradient-to-br from-slate-50/80 to-blue-50/40 backdrop-blur-sm rounded-2xl border border-slate-200/40 p-6 shadow-lg">
                      <h6 className="text-lg sm:text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        Biography Content
                      </h6>
                      <div className="space-y-4">
                        {modelData.minimal_biography && (
                          <div>
                            <div className="text-sm font-semibold text-slate-600 mb-2">Minimal Version:</div>
                            <div className="prose prose-slate max-w-none">
                              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap text-sm">
                                {modelData.minimal_biography}
                              </p>
                            </div>
                          </div>
                        )}
                        {modelData.comprehensive_biography && (
                          <div>
                            <div className="text-sm font-semibold text-slate-600 mb-2">Comprehensive Version:</div>
                            <div className="prose prose-slate max-w-none">
                              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap text-sm">
                                {modelData.comprehensive_biography}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Supervision Questions */}
                    <div className="bg-gradient-to-br from-emerald-50/80 to-blue-50/40 backdrop-blur-sm rounded-2xl border border-emerald-200/40 p-6 shadow-lg">
                      <h6 className="text-lg sm:text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                        PhD Supervision
                      </h6>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-bold text-slate-800 mb-2">
                            Supervisors
                          </label>
                          <textarea
                            value={(() => {
                              const key = `${modelKey}_supervisors`;
                              return notes[key] || '';
                            })()}
                            onChange={(e) => {
                              const key = `${modelKey}_supervisors`;
                              handleNotesChange(key, e.target.value);
                            }}
                            className="w-full p-3 bg-white/80 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none transition-all duration-200 text-xs"
                            rows={3}
                            placeholder="Who was the supervisor for this person? Leave empty if not found."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-800 mb-2">
                            Supervised
                          </label>
                          <textarea
                            value={(() => {
                              const key = `${modelKey}_supervised`;
                              return notes[key] || '';
                            })()}
                            onChange={(e) => {
                              const key = `${modelKey}_supervised`;
                              handleNotesChange(key, e.target.value);
                            }}
                            className="w-full p-3 bg-white/80 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none transition-all duration-200 text-xs"
                            rows={3}
                            placeholder="Who did this person supervise? Leave empty if not found."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-800 mb-2">
                            Source URL (Optional)
                          </label>
                          <input
                            type="url"
                            value={(() => {
                              const key = `${modelKey}_source_url`;
                              return notes[key] || '';
                            })()}
                            onChange={(e) => {
                              const key = `${modelKey}_source_url`;
                              handleNotesChange(key, e.target.value);
                            }}
                            className="w-full p-2 bg-white/80 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-xs"
                            placeholder="https://source-url.com"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Rating Section for this Model */}
                  <div className="bg-gradient-to-br from-emerald-50/60 to-blue-50/40 backdrop-blur-sm rounded-2xl border border-emerald-200/40 p-6 shadow-lg">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6 mb-6">
                      <h6 className="text-xl sm:text-2xl font-bold text-slate-900">
                        Rating Categories
                      </h6>
                      <button
                        onClick={() => saveRating(modelKey)}
                        disabled={(ratings[modelKey]?.length || 0) !== 4}
                        className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl text-base sm:text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] w-full lg:w-auto"
                      >
                        Save Rating for {getDisplayModelName(model)}
                      </button>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                      <div className="space-y-6">
                        {ratingCategories.map((category) => (
                          <RatingScale
                            key={`${model}-${category}`}
                            category={category}
                            value={ratings[modelKey]?.find(r => r.category === category)?.score || 0}
                            onChange={(score) => handleRatingChange(modelKey, category, score)}
                          />
                        ))}
                      </div>

                      <div>
                        <label className="block text-lg font-bold text-slate-800 mb-3">Additional Notes</label>
                        <textarea
                          value={notes[modelKey] || ''}
                          onChange={(e) => handleNotesChange(modelKey, e.target.value)}
                          className="w-full p-4 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none transition-all duration-200 text-sm sm:text-base"
                          rows={6}
                          placeholder={`Share your thoughts about ${getDisplayModelName(model)}'s accuracy for ${selectedScientist.name}...`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};