"use client";

import React, { useCallback, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { OptimizationParameters } from "@/app/(dashboard)/dashboard/optimize/[id]/page";

interface OptimizationParametersPopupProps {
  isOpen: boolean;
  onClose: () => void;
  handleOptimize: (improvements?: string) => void;
  parameters: OptimizationParameters;
  onParameterChange: (
    param: keyof OptimizationParameters,
    value: number,
  ) => void;
}

// Improved Slider Component with better performance and no glitching
const OptimizationSlider = ({ 
  label, 
  value, 
  onChange, 
  leftLabel, 
  centerLabel, 
  rightLabel,
  id 
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  leftLabel: string;
  centerLabel: string;
  rightLabel: string;
  id: string;
}) => {
  const handleSliderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue)) {
      onChange(newValue);
    }
  }, [onChange]);

  const progressPercentage = useMemo(() => ((value - 1) / 9) * 100, [value]);

  return (
    <div className="space-y-1 sm:space-y-2 slider-container">
      <div className="flex justify-between items-center mb-1 sm:mb-2">
        <label htmlFor={id} className="text-xs sm:text-sm font-medium cursor-pointer">
          {label}
        </label>
        <span className="text-xs sm:text-sm text-muted-foreground font-mono">
          {value}/10
        </span>
      </div>
      <div className="relative">
        <input
          id={id}
          type="range"
          min="1"
          max="10"
          value={value}
          onChange={handleSliderChange}
          className="slider w-full h-1.5 sm:h-2 rounded-lg appearance-none cursor-pointer bg-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 focus:ring-offset-background transition-all duration-150"
          style={{
            background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${progressPercentage}%, hsl(var(--muted)) ${progressPercentage}%, hsl(var(--muted)) 100%)`
          }}
        />
      </div>
      <div className="flex justify-between text-[10px] sm:text-xs text-muted-foreground">
        <span className="flex-1 text-left">{leftLabel}</span>
        <span className="flex-1 text-center">{centerLabel}</span>
        <span className="flex-1 text-right">{rightLabel}</span>
      </div>
    </div>
  );
};

export const OptimizationParametersPopup: React.FC<
  OptimizationParametersPopupProps
> = ({ isOpen, onClose, handleOptimize, parameters, onParameterChange }) => {
  const [improvements, setImprovements] = useState("");

  const handleChange = useCallback(
    (param: keyof OptimizationParameters, value: number) => {
      onParameterChange(param, value);
    },
    [onParameterChange],
  );

  const handleApply = useCallback(() => {
    handleOptimize(improvements);
  }, [handleOptimize, improvements]);

  const handleExampleClick = useCallback((example: string) => {
    setImprovements(example);
  }, []);

  const handleImprovementsChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setImprovements(e.target.value);
  }, []);

  const examples = [
    "Tailor my experience section to highlight leadership and team management skills",
    "Add quantifiable metrics and achievements to make my accomplishments more impactful",
    "Optimize for software engineering roles at tech companies like Google or Microsoft",
    "Include more keywords relevant to data science and machine learning positions",
    "Restructure to emphasize technical skills and reduce focus on soft skills",
    "Make the format more modern and visually appealing for creative industry roles",
    "Highlight certifications and continuous learning efforts more prominently",
    "Adjust language to be more formal and suitable for traditional corporate environments",
    "Add a reference: [Name], [Designation], [Phone], [Email], [Company].",
    "Translate my resume from [English] to [Target Language].",
    "Add more measurable achievements in my experience section.",
    "Make my resume emphasize leadership and team management more.",
    "Highlight my customer service skills more clearly.",
    "Make my resume more results-driven — focus on impact over tasks."
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl w-[95%] max-h-[90vh] bg-background border-border overflow-auto p-3 sm:p-6 grid grid-cols-1 gap-4 sm:gap-6">
        <DialogHeader className="text-left">
          <DialogTitle className="text-xl sm:text-2xl">Optimization Parameters</DialogTitle>
          <p className="text-muted-foreground text-sm sm:text-base mt-1 sm:mt-2">
            Fine-tune your resume optimization settings and add custom improvements
          </p>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Left column - Custom Improvements */}
          <div className="space-y-3 sm:space-y-4">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Custom Improvements</h3>
              <Textarea
                value={improvements}
                onChange={handleImprovementsChange}
                placeholder="Describe how you'd like to improve your resume..."
                className="min-h-[120px] sm:min-h-[150px] bg-muted/50 text-sm sm:text-base resize-none"
              />
            </div>

            <div className="space-y-1 sm:space-y-2">
              <p className="text-xs sm:text-sm font-medium">Examples:</p>
              <div className="space-y-1 sm:space-y-2 h-full pr-1 sm:pr-2 overflow-y-auto max-h-[400px]">
                {examples.map((example, index) => (
                  <div
                    key={index}
                    className="p-1.5 sm:p-2 rounded border border-border bg-muted/50 hover:bg-muted/70 transition-colors cursor-pointer"
                    onClick={() => handleExampleClick(example)}
                  >
                    <p className="text-xs sm:text-sm text-foreground/80">&quot;{example}&quot;</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column - Optimization Parameters */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-lg sm:text-xl font-semibold">Parameter Settings</h3>

            <OptimizationSlider
              id="keyword-emphasis"
              label="Keyword Emphasis"
              value={parameters.keywordEmphasis}
              onChange={(value) => handleChange('keywordEmphasis', value)}
              leftLabel="Subtle"
              centerLabel="Balanced"
              rightLabel="Prominent"
            />

            <OptimizationSlider
              id="content-length"
              label="Content Length"
              value={parameters.contentLength}
              onChange={(value) => handleChange('contentLength', value)}
              leftLabel="Concise"
              centerLabel="Balanced"
              rightLabel="Detailed"
            />

            <OptimizationSlider
              id="technical-detail"
              label="Technical Detail"
              value={parameters.technicalDetail}
              onChange={(value) => handleChange('technicalDetail', value)}
              leftLabel="Basic"
              centerLabel="Balanced"
              rightLabel="Advanced"
            />

            <OptimizationSlider
              id="experience-vs-skills"
              label="Experience vs Skills"
              value={parameters.experienceVsSkills}
              onChange={(value) => handleChange('experienceVsSkills', value)}
              leftLabel="Skills"
              centerLabel="Balanced"
              rightLabel="Experience"
            />

            <OptimizationSlider
              id="skills-emphasis"
              label="Skills Emphasis"
              value={parameters.skillsEmphasis}
              onChange={(value) => handleChange('skillsEmphasis', value)}
              leftLabel="Core Skills"
              centerLabel="Balanced"
              rightLabel="All Skills"
            />

            <OptimizationSlider
              id="role-emphasis"
              label="Role Emphasis"
              value={parameters.roleEmphasis}
              onChange={(value) => handleChange('roleEmphasis', value)}
              leftLabel="Generic"
              centerLabel="Balanced"
              rightLabel="Specific"
            />
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button 
            onClick={handleApply} 
            className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
          >
            Apply Parameters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
