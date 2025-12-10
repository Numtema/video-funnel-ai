import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingDown, Users, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepData {
  stepId: string;
  stepName: string;
  stepType: string;
  visitors: number;
  dropoffs: number;
  dropoffRate: number;
}

interface StepDropoffChartProps {
  data: StepData[];
  loading?: boolean;
}

export function StepDropoffChart({ data, loading }: StepDropoffChartProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5" />
            Drop-off par étape
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
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
            <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5" />
            Drop-off par étape
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Où perdez-vous vos visiteurs ?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            Pas assez de données pour afficher le drop-off
          </p>
        </CardContent>
      </Card>
    );
  }

  const maxVisitors = Math.max(...data.map(d => d.visitors));
  const worstStep = data.reduce((worst, current) =>
    current.dropoffRate > worst.dropoffRate ? current : worst
  , data[0]);

  return (
    <Card>
      <CardHeader className="pb-2 sm:pb-4">
        <CardTitle className="text-base sm:text-lg flex items-center gap-2">
          <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5" />
          Drop-off par étape
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Où perdez-vous vos visiteurs ?
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Warning for worst step */}
        {worstStep.dropoffRate > 30 && (
          <div className="flex items-start gap-2 p-2 sm:p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-medium text-yellow-600 dark:text-yellow-400">
                Point critique détecté
              </p>
              <p className="text-xs text-muted-foreground truncate">
                "{worstStep.stepName}" perd {worstStep.dropoffRate}% des visiteurs
              </p>
            </div>
          </div>
        )}

        {/* Funnel Visualization */}
        <div className="space-y-2 sm:space-y-3">
          {data.map((step, index) => {
            const widthPercent = (step.visitors / maxVisitors) * 100;
            const isWorst = step.stepId === worstStep.stepId && step.dropoffRate > 20;

            return (
              <div key={step.stepId} className="space-y-1">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium shrink-0">
                      {index + 1}
                    </span>
                    <span className="font-medium truncate">{step.stepName}</span>
                    <Badge variant="outline" className="text-[10px] sm:text-xs hidden sm:inline-flex shrink-0">
                      {step.stepType}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {step.visitors}
                    </span>
                    {step.dropoffRate > 0 && (
                      <span className={cn(
                        "font-medium",
                        step.dropoffRate > 30 ? "text-red-500" :
                        step.dropoffRate > 15 ? "text-yellow-500" :
                        "text-green-500"
                      )}>
                        -{step.dropoffRate}%
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="relative h-6 sm:h-8 bg-muted rounded-lg overflow-hidden">
                  <div
                    className={cn(
                      "h-full transition-all duration-500 rounded-lg",
                      isWorst ? "bg-red-500/80" : "bg-primary/80"
                    )}
                    style={{ width: `${widthPercent}%` }}
                  />
                  {step.dropoffs > 0 && (
                    <div
                      className="absolute right-0 top-0 h-full bg-red-500/30 flex items-center justify-end pr-2"
                      style={{ width: `${(step.dropoffs / maxVisitors) * 100}%` }}
                    >
                      <span className="text-[10px] sm:text-xs text-red-600 dark:text-red-400 font-medium">
                        -{step.dropoffs}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2 text-xs text-muted-foreground border-t">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-primary/80" />
            <span>Visiteurs restants</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-red-500/30" />
            <span>Abandons</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
