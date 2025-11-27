import { QuizStep, StepType, QuestionOption } from '@/types/funnel';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';

interface ContentTabProps {
  step: QuizStep;
  onUpdate: (step: QuizStep) => void;
  allSteps: QuizStep[];
}

export function ContentTab({ step, onUpdate, allSteps }: ContentTabProps) {
  if (step.type === StepType.Question) {
    return <QuestionContent step={step} onUpdate={onUpdate} allSteps={allSteps} />;
  }

  if (step.type === StepType.LeadCapture) {
    return <LeadCaptureContent step={step} onUpdate={onUpdate} allSteps={allSteps} />;
  }

  if (step.type === StepType.CalendarEmbed) {
    return <CalendarContent step={step} onUpdate={onUpdate} allSteps={allSteps} />;
  }

  return (
    <div className="text-center text-muted-foreground py-8">
      <p>Pas de contenu supplémentaire pour ce type d'étape</p>
    </div>
  );
}

function QuestionContent({ step, onUpdate, allSteps }: ContentTabProps) {
  const options = step.options || [];
  const availableSteps = allSteps.filter(s => s.id !== step.id);

  const handleAddOption = () => {
    const newOption: QuestionOption = {
      id: `option-${Date.now()}`,
      text: '',
      score: 0,
    };

    onUpdate({
      ...step,
      options: [...options, newOption],
    });
  };

  const handleUpdateOption = (index: number, updates: Partial<QuestionOption>) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], ...updates };
    
    onUpdate({
      ...step,
      options: newOptions,
    });
  };

  const handleDeleteOption = (index: number) => {
    onUpdate({
      ...step,
      options: options.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="mb-2">Routage par défaut</Label>
        <Select 
          value={step.nextStepId || 'next'}
          onValueChange={(value) => onUpdate({ ...step, nextStepId: value === 'next' ? undefined : value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Étape suivante" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="next">Étape suivante automatique</SelectItem>
            {availableSteps.map(s => (
              <SelectItem key={s.id} value={s.id}>
                {s.title || 'Sans titre'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground mt-1">
          Étape par défaut si aucune condition spécifique
        </p>
      </div>

      <div>
        <Label className="mb-2">Options de réponse</Label>
        <div className="space-y-3">
          {options.map((option, index) => (
            <div key={option.id} className="space-y-2 p-3 border rounded-lg">
              <div className="flex gap-2">
                <Input
                  value={option.text}
                  onChange={(e) => handleUpdateOption(index, { text: e.target.value })}
                  placeholder={`Option ${index + 1}`}
                  className="flex-1"
                />
                <Input
                  type="number"
                  value={option.score || 0}
                  onChange={(e) => handleUpdateOption(index, { score: parseInt(e.target.value) || 0 })}
                  placeholder="Score"
                  className="w-20"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteOption(index)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
              <div>
                <Label className="text-xs">Routage conditionnel (optionnel)</Label>
                <Select 
                  value={option.nextStepId || 'default'}
                  onValueChange={(value) => handleUpdateOption(index, { nextStepId: value === 'default' ? undefined : value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Utiliser routage par défaut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Utiliser routage par défaut</SelectItem>
                    {availableSteps.map(s => (
                      <SelectItem key={s.id} value={s.id}>
                        → {s.title || 'Sans titre'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button onClick={handleAddOption} variant="outline" className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Ajouter une option
      </Button>
    </div>
  );
}

function LeadCaptureContent({ step, onUpdate }: ContentTabProps) {
  const fields = step.fields || [];

  const handleToggleField = (field: string) => {
    const newFields = fields.includes(field)
      ? fields.filter(f => f !== field)
      : [...fields, field];

    onUpdate({
      ...step,
      fields: newFields,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="mb-3">Champs à afficher</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="field-name"
              checked={fields.includes('name')}
              onCheckedChange={() => handleToggleField('name')}
            />
            <label htmlFor="field-name" className="text-sm font-medium">
              Nom complet
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="field-email"
              checked={fields.includes('email')}
              onCheckedChange={() => handleToggleField('email')}
            />
            <label htmlFor="field-email" className="text-sm font-medium">
              Email (requis)
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="field-phone"
              checked={fields.includes('phone')}
              onCheckedChange={() => handleToggleField('phone')}
            />
            <label htmlFor="field-phone" className="text-sm font-medium">
              Téléphone
            </label>
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="webhook-url">Webhook URL (optionnel)</Label>
        <Input
          id="webhook-url"
          value={step.webhookUrl || ''}
          onChange={(e) => onUpdate({ ...step, webhookUrl: e.target.value })}
          placeholder="https://..."
          className="mt-2"
        />
      </div>
    </div>
  );
}

function CalendarContent({ step, onUpdate }: ContentTabProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="embed-code">Code d'intégration</Label>
        <Textarea
          id="embed-code"
          value={step.embedCode || ''}
          onChange={(e) => onUpdate({ ...step, embedCode: e.target.value })}
          placeholder="Collez votre code d'intégration Calendly, Cal.com, etc..."
          rows={10}
          className="font-mono text-xs mt-2"
        />
        <p className="text-xs text-muted-foreground mt-2">
          Exemple: &lt;iframe src="https://calendly.com/..."&gt;&lt;/iframe&gt;
        </p>
      </div>
    </div>
  );
}