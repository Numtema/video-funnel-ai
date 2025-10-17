import { QuizStep, StepType } from '@/types/funnel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Plus,
  MessageSquare,
  HelpCircle,
  Mail,
  Calendar,
  Home,
  GripVertical,
  Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

interface StepNavigatorProps {
  steps: QuizStep[];
  selectedStepId: string | null;
  onSelectStep: (stepId: string) => void;
  onAddStep: (type: StepType) => void;
  onDeleteStep: (stepId: string) => void;
  onReorder: (steps: QuizStep[]) => void;
}

export function StepNavigator({
  steps,
  selectedStepId,
  onSelectStep,
  onAddStep,
  onDeleteStep,
  onReorder,
}: StepNavigatorProps) {
  const getStepIcon = (type: StepType) => {
    const icons = {
      [StepType.Welcome]: Home,
      [StepType.Question]: HelpCircle,
      [StepType.Message]: MessageSquare,
      [StepType.LeadCapture]: Mail,
      [StepType.CalendarEmbed]: Calendar,
    };
    const Icon = icons[type];
    return <Icon className="w-4 h-4" />;
  };

  const getStepTypeLabel = (type: StepType): string => {
    const labels = {
      [StepType.Welcome]: 'Bienvenue',
      [StepType.Question]: 'Question',
      [StepType.Message]: 'Message',
      [StepType.LeadCapture]: 'Capture Lead',
      [StepType.CalendarEmbed]: 'Calendrier',
    };
    return labels[type];
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(steps);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onReorder(items);
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">Étapes ({steps.length})</h2>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="steps">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {steps.map((step, index) => (
                <Draggable key={step.id} draggableId={step.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={cn(
                        'group relative flex items-center gap-2 p-3 rounded-lg border bg-card cursor-pointer transition-all',
                        selectedStepId === step.id && 'bg-primary/10 border-primary',
                        snapshot.isDragging && 'shadow-lg'
                      )}
                      onClick={() => onSelectStep(step.id)}
                    >
                      <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                      
                      <div className="flex items-center gap-2 flex-1">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          {getStepIcon(step.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-muted-foreground">
                              #{index + 1}
                            </span>
                            <span className="text-sm font-medium truncate">
                              {step.title}
                            </span>
                          </div>
                          <Badge variant="secondary" className="mt-1 text-xs">
                            {getStepTypeLabel(step.type)}
                          </Badge>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteStep(step.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="w-full mt-4" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter une étape
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuItem onClick={() => onAddStep(StepType.Welcome)}>
            <Home className="w-4 h-4 mr-2" />
            Écran de Bienvenue
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAddStep(StepType.Question)}>
            <HelpCircle className="w-4 h-4 mr-2" />
            Question
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAddStep(StepType.Message)}>
            <MessageSquare className="w-4 h-4 mr-2" />
            Message
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAddStep(StepType.LeadCapture)}>
            <Mail className="w-4 h-4 mr-2" />
            Capture de Lead
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAddStep(StepType.CalendarEmbed)}>
            <Calendar className="w-4 h-4 mr-2" />
            Calendrier Intégré
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}