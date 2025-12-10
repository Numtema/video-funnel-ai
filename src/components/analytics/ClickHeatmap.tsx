import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MousePointerClick, Flame, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OptionClickData {
  optionId: string;
  optionText: string;
  clicks: number;
  percentage: number;
}

interface StepClickData {
  stepId: string;
  stepName: string;
  stepType: string;
  totalClicks: number;
  options?: OptionClickData[];
  buttonClicks?: number;
}

interface ClickHeatmapProps {
  data: StepClickData[];
  loading?: boolean;
}

function getHeatColor(percentage: number): string {
  if (percentage >= 50) return 'bg-red-500';
  if (percentage >= 35) return 'bg-orange-500';
  if (percentage >= 20) return 'bg-yellow-500';
  if (percentage >= 10) return 'bg-green-500';
  return 'bg-blue-500';
}

function getHeatIntensity(percentage: number): string {
  if (percentage >= 50) return 'shadow-red-500/50';
  if (percentage >= 35) return 'shadow-orange-500/50';
  if (percentage >= 20) return 'shadow-yellow-500/50';
  return 'shadow-green-500/50';
}

export function ClickHeatmap({ data, loading }: ClickHeatmapProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <MousePointerClick className="w-4 h-4 sm:w-5 sm:h-5" />
            Heatmap des clics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <MousePointerClick className="w-4 h-4 sm:w-5 sm:h-5" />
            Heatmap des clics
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Visualisez où cliquent vos visiteurs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            Pas assez de données pour afficher la heatmap
          </p>
        </CardContent>
      </Card>
    );
  }

  const questionSteps = data.filter(d => d.stepType === 'question' && d.options);
  const totalClicks = data.reduce((sum, d) => sum + d.totalClicks, 0);

  // Find most clicked option overall
  let mostClickedOption: { step: string; option: string; clicks: number } | null = null;
  questionSteps.forEach(step => {
    step.options?.forEach(opt => {
      if (!mostClickedOption || opt.clicks > mostClickedOption.clicks) {
        mostClickedOption = { step: step.stepName, option: opt.optionText, clicks: opt.clicks };
      }
    });
  });

  return (
    <Card>
      <CardHeader className="pb-2 sm:pb-4">
        <CardTitle className="text-base sm:text-lg flex items-center gap-2">
          <MousePointerClick className="w-4 h-4 sm:w-5 sm:h-5" />
          Heatmap des clics
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Visualisez où cliquent vos visiteurs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 p-2 sm:p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <MousePointerClick className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">{totalClicks} clics totaux</span>
          </div>
          {mostClickedOption && (
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-red-500" />
              <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                Top: "{mostClickedOption.option}"
              </span>
            </div>
          )}
        </div>

        {/* Question Steps with Heatmap */}
        <div className="space-y-4">
          {questionSteps.map((step, stepIndex) => (
            <div key={step.stepId} className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium shrink-0">
                  {stepIndex + 1}
                </span>
                <span className="text-sm font-medium truncate">{step.stepName}</span>
                <Badge variant="outline" className="text-[10px] ml-auto shrink-0">
                  {step.totalClicks} clics
                </Badge>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-7 sm:pl-8">
                {step.options?.map((option) => {
                  const heatColor = getHeatColor(option.percentage);
                  const heatIntensity = getHeatIntensity(option.percentage);

                  return (
                    <div
                      key={option.optionId}
                      className={cn(
                        "relative p-2 sm:p-3 rounded-lg border transition-all",
                        option.percentage >= 30 && "shadow-lg",
                        heatIntensity
                      )}
                    >
                      {/* Heat indicator */}
                      <div
                        className={cn(
                          "absolute inset-0 rounded-lg opacity-20 transition-opacity",
                          heatColor
                        )}
                        style={{ opacity: Math.min(option.percentage / 100, 0.4) }}
                      />

                      <div className="relative flex items-start justify-between gap-2">
                        <p className="text-xs sm:text-sm line-clamp-2 leading-snug flex-1 break-words">
                          {option.optionText}
                        </p>
                        <div className="flex flex-col items-end shrink-0">
                          <span className={cn(
                            "text-sm sm:text-base font-bold",
                            option.percentage >= 50 ? "text-red-500" :
                            option.percentage >= 35 ? "text-orange-500" :
                            option.percentage >= 20 ? "text-yellow-600" :
                            "text-green-500"
                          )}>
                            {option.percentage}%
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {option.clicks} clics
                          </span>
                        </div>
                      </div>

                      {/* Heat bar */}
                      <div className="relative mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={cn("h-full rounded-full transition-all", heatColor)}
                          style={{ width: `${option.percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-3 text-xs text-muted-foreground border-t">
          <span className="font-medium">Intensité:</span>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-blue-500" />
            <span>&lt;10%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-green-500" />
            <span>10-20%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-yellow-500" />
            <span>20-35%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-orange-500" />
            <span>35-50%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-red-500" />
            <span>&gt;50%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
