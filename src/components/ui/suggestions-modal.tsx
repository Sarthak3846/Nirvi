import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";

export interface JobSuggestion {
  title: string;
  also_known_as: string[];
  potential_match_percent: number;
  description: string;
  common_industries: string[];
  tips_to_increase_odds: string[];
}

export interface SuggestionsResponse {
  success: true;
  [key: string]: JobSuggestion | boolean; // numbered keys (0, 1, 2, etc.) plus success
}

export const getSuggestionsArray = (suggestions: SuggestionsResponse): JobSuggestion[] => {
  return Object.entries(suggestions)
    .filter(([key]) => key !== 'success')
    .map(([, value]) => value as JobSuggestion)
    .filter((job) => {
      // Filter out invalid/empty suggestions
      return job &&
             job.title &&
             job.title.trim() !== '' &&
             job.description &&
             job.description.trim() !== '' &&
             typeof job.potential_match_percent === 'number' &&
             job.potential_match_percent > 0;
    })
    .sort((a, b) => b.potential_match_percent - a.potential_match_percent); // Sort by match percentage (highest first)
};

interface SuggestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  suggestions: SuggestionsResponse | null;
  isLoading: boolean;
  resumeId: string;
  onGenerateNew: () => void;
}

export function SuggestionsModal({
  isOpen,
  onClose,
  suggestions,
  isLoading,
  resumeId,
  onGenerateNew,
}: SuggestionsModalProps) {
  const router = useRouter();

  const handleUseRole = (job: JobSuggestion) => {
    const searchParams = new URLSearchParams({
      role: job.title,
      description: job.description,
      industries: job.common_industries.join(",")
    });

    router.push(`/dashboard/optimize/${resumeId}?${searchParams.toString()}`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Suggested Roles for You
            {suggestions && (
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({getSuggestionsArray(suggestions).length} suggestions)
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-purple-600/50 border-t-purple-600 rounded-full animate-spin"></div>
                <span>Loading suggestions...</span>
              </div>
            </div>
          ) : suggestions ? (
            <div className="space-y-6">
              {/* Job Suggestions */}
              {getSuggestionsArray(suggestions).map((job, index) => {
                  return (
                    <div key={index} className="p-6 bg-card border border-border rounded-lg shadow-sm">
                      <div className="space-y-4">
                        {/* Job Header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <h3 className="text-xl font-semibold text-card-foreground">{job.title}</h3>
                            <Button
                              onClick={() => handleUseRole(job)}
                              variant="outline"
                              size="sm"
                              className="gap-1 text-sm text-purple-600 border-purple-600 hover:bg-purple-100 hover:text-purple-700"
                            >
                              Use This Role
                              <ArrowUpRight className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Match:</span>
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-semibold text-purple-600 dark:text-purple-400">{job.potential_match_percent}%</span>
                              <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-300"
                                  style={{ width: `${job.potential_match_percent}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Also Known As */}
                        {job.also_known_as && job.also_known_as.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-card-foreground mb-2">Also known as:</h4>
                            <div className="flex flex-wrap gap-2">
                              {job.also_known_as.map((alias, index) => (
                                <span key={index} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full border border-blue-200 dark:border-blue-800">
                                  {alias}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Description */}
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-card-foreground mb-2">Description:</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">{job.description}</p>
                        </div>

                        {/* Common Industries */}
                        {job.common_industries && job.common_industries.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-card-foreground mb-2">Common Industries:</h4>
                            <div className="flex flex-wrap gap-2">
                              {job.common_industries.map((industry, index) => (
                                <span key={index} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full border border-blue-200 dark:border-blue-800">
                                  {industry}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Tips to Increase Odds */}
                        {job.tips_to_increase_odds && job.tips_to_increase_odds.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-card-foreground mb-3">Tips to Increase Your Odds:</h4>
                            <div className="space-y-3">
                              {job.tips_to_increase_odds.map((tip, index) => (
                                <div key={index} className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800/30">
                                  <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2" />
                                  <p className="text-sm text-black leading-relaxed">{tip}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No suggestions available. Please try again.</p>
            </div>
          )}

          {/* Load More Button */}
          {suggestions && getSuggestionsArray(suggestions).length > 0 && (
            <div className="flex justify-center pt-6 border-t border-border mt-6">
              <Button
                onClick={onGenerateNew}
                disabled={isLoading}
                className="gap-1 text-sm bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isLoading ? "Generating..." : "Generate More Suggestions"}
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
