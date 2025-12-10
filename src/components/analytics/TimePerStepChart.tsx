import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, TrendingUp, TrendingDown, Timer } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepTimeData {
  stepId: string;
  stepName: string;
  stepType: string;
  avgTime: number; // in seconds
  minTime: number;
  maxTime: number;
  medianTime: number;
}

interface TimePerStepChartProps {
  data: StepTimeData[];
  loading?: boolean;
}

function formatTime(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
}

export function TimePerStepChart({ data, loading }: TimePerStepChartProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
            Temps par étape
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-muted animate-pulse rounded-lg" />
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
            <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
            Temps par étape
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Temps moyen passé sur chaque étape
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            Pas assez de données pour afficher les temps
          </p>
        </CardContent>
      </Card>
    );
  }

  const totalTime = data.reduce((sum, d) => sum + d.avgTime, 0);
  const maxTime = Math.max(...data.map(d => d.avgTime));
  const avgStepTime = totalTime / data.length;

  // Find slowest and fastest steps
  const slowestStep = data.reduce((max, d) => d.avgTime > max.avgTime ? d : max, data[0]);
  const fastestStep = data.reduce((min, d) => d.avgTime < min.avgTime ? d : min, data[0]);

  return (
    <Card>
      <CardHeader className="pb-2 sm:pb-4">
        <CardTitle className="text-base sm:text-lg flex items-center gap-2">
          <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
          Temps par étape
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Temps moyen passé sur chaque étape
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <div className="text-center p-2 sm:p-3 bg-muted/50 rounded-lg">
            <Timer className="w-4 h-4 mx-auto mb-1 text-primary" />
            <p className="text-base sm:text-lg font-bold">{formatTime(totalTime)}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Temps total</p>
          </div>
          <div className="text-center p-2 sm:p-3 bg-green-500/10 rounded-lg">
            <TrendingDown className="w-4 h-4 mx-auto mb-1 text-green-500" />
            <p className="text-base sm:text-lg font-bold text-green-600 dark:text-green-400">
              {formatTime(fastestStep.avgTime)}
            </p>
            <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
              {fastestStep.stepName}
            </p>
          </div>
          <div className="text-center p-2 sm:p-3 bg-orange-500/10 rounded-lg">
            <TrendingUp className="w-4 h-4 mx-auto mb-1 text-orange-500" />
            <p className="text-base sm:text-lg font-bold text-orange-600 dark:text-orange-400">
              {formatTime(slowestStep.avgTime)}
            </p>
            <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
              {slowestStep.stepName}
            </p>
          </div>
        </div>

        {/* Time Bars */}
        <div className="space-y-3">
          {data.map((step, index) => {
            const widthPercent = (step.avgTime / maxTime) * 100;
            const isAboveAvg = step.avgTime > avgStepTime * 1.5;
            const isBelowAvg = step.avgTime < avgStepTime * 0.5;

            return (
              <div key={step.stepId} className="space-y-1">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium shrink-0">
                      {index + 1}
                    </span>
                    <span className="font-medium truncate">{step.stepName}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={cn(
                      "font-medium",
                      isAboveAvg ? "text-orange-500" :
                      isBelowAvg ? "text-green-500" :
                      "text-foreground"
                    )}>
                      {formatTime(step.avgTime)}
                    </span>
                    {isAboveAvg && (
                      <Badge variant="outline" className="text-[10px] bg-orange-500/10 border-orange-500/20 text-orange-600">
                        Lent
                      </Badge>
                    )}
                    {isBelowAvg && (
                      <Badge variant="outline" className="text-[10px] bg-green-500/10 border-green-500/20 text-green-600">
                        Rapide
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Time Bar */}
                <div className="relative h-3 sm:h-4 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full transition-all duration-500 rounded-full",
                      isAboveAvg ? "bg-orange-500" :
                      isBelowAvg ? "bg-green-500" :
                      "bg-primary"
                    )}
                    style={{ width: `${widthPercent}%` }}
                  />
                </div>

                {/* Min/Max Range */}
                <div className="flex justify-between text-[10px] text-muted-foreground px-1">
                  <span>Min: {formatTime(step.minTime)}</span>
                  <span>Médiane: {formatTime(step.medianTime)}</span>
                  <span>Max: {formatTime(step.maxTime)}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Average Line Indicator */}
        <div className="flex items-center gap-2 pt-2 text-xs text-muted-foreground border-t">
          <div className="w-3 h-0.5 bg-primary/50" />
          <span>Moyenne par étape: {formatTime(avgStepTime)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
