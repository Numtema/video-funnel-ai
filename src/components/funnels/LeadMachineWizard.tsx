import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Loader2, Sparkles } from "lucide-react";
import { LeadMachineWorkbook } from "@/types/leadMachine";
import { toast } from "sonner";

interface LeadMachineWizardProps {
  onComplete: (workbook: LeadMachineWorkbook) => void;
  onBack: () => void;
}

export function LeadMachineWizard({ onComplete, onBack }: LeadMachineWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  
  const [workbook, setWorkbook] = useState<LeadMachineWorkbook>({
    hookAttention: {
      avatarCurrentSituation: "",
      avatarDesiredSituation: "",
      blockers: ["", "", ""],
      quizConcept: ""
    },
    buildTrust: {
      outcome: "",
      pain: "",
      empathy: "",
      authority: ""
    },
    shiftBeliefs: {
      oldWay: "",
      newWay: "",
      costOfOldWay: "",
      benefitOfNewWay: ""
    },
    makeOffer: {
      dreamOutcome: "",
      perceivedLikelihood: "",
      timeDelay: "",
      effortAndSacrifice: ""
    },
    questions: {
      intro: "",
      questionList: [
        { question: "", options: ["", "", "", ""], duration: 15 },
        { question: "", options: ["", "", "", ""], duration: 15 },
        { question: "", options: ["", "", "", ""], duration: 15 },
        { question: "", options: ["", "", "", ""], duration: 15 }
      ],
      outro: ""
    },
    businessContext: {
      businessType: "",
      targetAudience: "",
      mainOffer: "",
      pricePoint: ""
    }
  });

  const updateWorkbook = (section: keyof LeadMachineWorkbook, data: any) => {
    setWorkbook(prev => ({ ...prev, [section]: data }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete(workbook);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      onBack();
    }
  };

  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            Lead Generation Machine
          </h2>
          <span className="text-sm text-muted-foreground">
            Étape {currentStep} sur {totalSteps}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {currentStep === 1 && "Contexte Business"}
            {currentStep === 2 && "Hook Attention"}
            {currentStep === 3 && "Build Trust"}
            {currentStep === 4 && "Shift Beliefs"}
            {currentStep === 5 && "Make An Offer"}
          </CardTitle>
          <CardDescription>
            {currentStep === 1 && "Commençons par comprendre votre business et votre audience"}
            {currentStep === 2 && "Définissons votre avatar et son problème"}
            {currentStep === 3 && "Construisez la confiance avec votre histoire"}
            {currentStep === 4 && "Montrez la différence entre l'ancienne et la nouvelle méthode"}
            {currentStep === 5 && "Créez une offre irrésistible"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Step 1: Business Context */}
          {currentStep === 1 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="businessType">Type de Business *</Label>
                <Input
                  id="businessType"
                  placeholder="ex: Coach en développement personnel, Consultant marketing, Agence digitale..."
                  value={workbook.businessContext.businessType}
                  onChange={(e) => updateWorkbook("businessContext", { ...workbook.businessContext, businessType: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetAudience">Audience Cible *</Label>
                <Textarea
                  id="targetAudience"
                  placeholder="Décrivez votre client idéal (problèmes, objectifs, démographie...)"
                  value={workbook.businessContext.targetAudience}
                  onChange={(e) => updateWorkbook("businessContext", { ...workbook.businessContext, targetAudience: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mainOffer">Offre Principale *</Label>
                <Textarea
                  id="mainOffer"
                  placeholder="Décrivez votre offre principale (programme, service, produit...)"
                  value={workbook.businessContext.mainOffer}
                  onChange={(e) => updateWorkbook("businessContext", { ...workbook.businessContext, mainOffer: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pricePoint">Prix de l'Offre</Label>
                <Input
                  id="pricePoint"
                  placeholder="ex: 497€, 2000€, Appel gratuit..."
                  value={workbook.businessContext.pricePoint}
                  onChange={(e) => updateWorkbook("businessContext", { ...workbook.businessContext, pricePoint: e.target.value })}
                />
              </div>
            </>
          )}

          {/* Step 2: Hook Attention */}
          {currentStep === 2 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="avatarCurrentSituation">Situation Actuelle de l'Avatar (Pain) *</Label>
                <Textarea
                  id="avatarCurrentSituation"
                  placeholder="Dans quelle situation problématique se trouve votre client idéal ?"
                  value={workbook.hookAttention.avatarCurrentSituation}
                  onChange={(e) => updateWorkbook("hookAttention", { ...workbook.hookAttention, avatarCurrentSituation: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="avatarDesiredSituation">Situation Désirée de l'Avatar (Outcome) *</Label>
                <Textarea
                  id="avatarDesiredSituation"
                  placeholder="Quel résultat #1 veut votre client ?"
                  value={workbook.hookAttention.avatarDesiredSituation}
                  onChange={(e) => updateWorkbook("hookAttention", { ...workbook.hookAttention, avatarDesiredSituation: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>3 Blockers principaux *</Label>
                {workbook.hookAttention.blockers.map((blocker, idx) => (
                  <Input
                    key={idx}
                    placeholder={`Blocker ${idx + 1}`}
                    value={blocker}
                    onChange={(e) => {
                      const newBlockers = [...workbook.hookAttention.blockers];
                      newBlockers[idx] = e.target.value;
                      updateWorkbook("hookAttention", { ...workbook.hookAttention, blockers: newBlockers });
                    }}
                  />
                ))}
              </div>
              <div className="space-y-2">
                <Label htmlFor="quizConcept">Concept/Hook du Quiz *</Label>
                <Input
                  id="quizConcept"
                  placeholder="ex: Découvrez, Révélez, Débloquez..."
                  value={workbook.hookAttention.quizConcept}
                  onChange={(e) => updateWorkbook("hookAttention", { ...workbook.hookAttention, quizConcept: e.target.value })}
                />
              </div>
            </>
          )}

          {/* Step 3: Build Trust */}
          {currentStep === 3 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="outcome">Dream Outcome *</Label>
                <Textarea
                  id="outcome"
                  placeholder="Quel est le résultat de rêve pour votre client ?"
                  value={workbook.buildTrust.outcome}
                  onChange={(e) => updateWorkbook("buildTrust", { ...workbook.buildTrust, outcome: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pain">Pain (Comment ils décrivent le problème) *</Label>
                <Textarea
                  id="pain"
                  placeholder="Comment vos clients décrivent-ils leur problème ?"
                  value={workbook.buildTrust.pain}
                  onChange={(e) => updateWorkbook("buildTrust", { ...workbook.buildTrust, pain: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="empathy">Empathy (Votre expérience personnelle) *</Label>
                <Textarea
                  id="empathy"
                  placeholder="Avez-vous été dans cette situation ? Décrivez ce que c'était..."
                  value={workbook.buildTrust.empathy}
                  onChange={(e) => updateWorkbook("buildTrust", { ...workbook.buildTrust, empathy: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="authority">Authority (Comment vous l'avez résolu) *</Label>
                <Textarea
                  id="authority"
                  placeholder="Comment avez-vous résolu ce problème ? Où êtes-vous maintenant ?"
                  value={workbook.buildTrust.authority}
                  onChange={(e) => updateWorkbook("buildTrust", { ...workbook.buildTrust, authority: e.target.value })}
                  rows={2}
                />
              </div>
            </>
          )}

          {/* Step 4: Shift Beliefs */}
          {currentStep === 4 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="oldWay">The Old Way (Ancienne approche) *</Label>
                <Textarea
                  id="oldWay"
                  placeholder="Quelles approches et croyances obsolètes retiennent vos clients ?"
                  value={workbook.shiftBeliefs.oldWay}
                  onChange={(e) => updateWorkbook("shiftBeliefs", { ...workbook.shiftBeliefs, oldWay: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newWay">The New Way (Nouvelle méthode) *</Label>
                <Textarea
                  id="newWay"
                  placeholder="Quelle est une meilleure façon de résoudre le problème ?"
                  value={workbook.shiftBeliefs.newWay}
                  onChange={(e) => updateWorkbook("shiftBeliefs", { ...workbook.shiftBeliefs, newWay: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="costOfOldWay">Cost of Old Way (Coûts cachés) *</Label>
                <Textarea
                  id="costOfOldWay"
                  placeholder="Quels sont les coûts cachés (émotionnels/physiques/financiers) de continuer l'ancienne méthode ?"
                  value={workbook.shiftBeliefs.costOfOldWay}
                  onChange={(e) => updateWorkbook("shiftBeliefs", { ...workbook.shiftBeliefs, costOfOldWay: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="benefitOfNewWay">Benefit of New Way (Bénéfices clés) *</Label>
                <Textarea
                  id="benefitOfNewWay"
                  placeholder="Quels sont les bénéfices clés de suivre la nouvelle méthode ?"
                  value={workbook.shiftBeliefs.benefitOfNewWay}
                  onChange={(e) => updateWorkbook("shiftBeliefs", { ...workbook.shiftBeliefs, benefitOfNewWay: e.target.value })}
                  rows={3}
                />
              </div>
            </>
          )}

          {/* Step 5: Make An Offer */}
          {currentStep === 5 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="dreamOutcome">Dream Outcome *</Label>
                <Textarea
                  id="dreamOutcome"
                  placeholder="Quel est le résultat de rêve que votre client veut atteindre ?"
                  value={workbook.makeOffer.dreamOutcome}
                  onChange={(e) => updateWorkbook("makeOffer", { ...workbook.makeOffer, dreamOutcome: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="perceivedLikelihood">Perceived Likelihood (Comment rendre le succès plus probable) *</Label>
                <Textarea
                  id="perceivedLikelihood"
                  placeholder="Comment pouvez-vous rendre plus probable qu'ils atteignent le succès ? (méthode unique, garantie, cas d'études...)"
                  value={workbook.makeOffer.perceivedLikelihood}
                  onChange={(e) => updateWorkbook("makeOffer", { ...workbook.makeOffer, perceivedLikelihood: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timeDelay">Time Delay (Timeline la plus rapide) *</Label>
                <Input
                  id="timeDelay"
                  placeholder="ex: 14 jours, 30 jours, 90 jours..."
                  value={workbook.makeOffer.timeDelay}
                  onChange={(e) => updateWorkbook("makeOffer", { ...workbook.makeOffer, timeDelay: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="effortAndSacrifice">Effort & Sacrifice (Solutions faciles) *</Label>
                <Textarea
                  id="effortAndSacrifice"
                  placeholder="Quel est l'effort requis et comment pouvez-vous le contrer avec des solutions faciles ?"
                  value={workbook.makeOffer.effortAndSacrifice}
                  onChange={(e) => updateWorkbook("makeOffer", { ...workbook.makeOffer, effortAndSacrifice: e.target.value })}
                  rows={3}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handlePrevious}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          {currentStep === 1 ? "Retour" : "Précédent"}
        </Button>
        <Button onClick={handleNext}>
          {currentStep === totalSteps ? (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Générer le Funnel
            </>
          ) : (
            <>
              Suivant
              <ChevronRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
