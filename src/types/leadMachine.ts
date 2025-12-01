export interface LeadMachineWorkbook {
  // Hook Attention
  hookAttention: {
    avatarCurrentSituation: string; // Pain
    avatarDesiredSituation: string; // Outcome
    blockers: string[]; // 2-3 blockers
    quizConcept: string; // Hook phrase
  };

  // Build Trust
  buildTrust: {
    outcome: string; // Dream outcome
    pain: string; // How customers describe problem
    empathy: string; // Your personal experience
    authority: string; // How you solved it
  };

  // Shift Beliefs
  shiftBeliefs: {
    oldWay: string; // Outdated approaches
    newWay: string; // Better way of solving
    costOfOldWay: string; // Hidden costs
    benefitOfNewWay: string; // Key benefits
  };

  // Make An Offer
  makeOffer: {
    dreamOutcome: string;
    perceivedLikelihood: string; // How to make success more likely
    timeDelay: string; // Fastest timeline for results
    effortAndSacrifice: string; // Required effort
  };

  // Questions
  questions: {
    intro: string;
    questionList: Array<{
      question: string;
      options: string[];
      duration: number; // seconds
    }>;
    outro: string;
  };

  // Business Context
  businessContext: {
    businessType: string; // coach, consultant, agency, etc.
    targetAudience: string;
    mainOffer: string;
    pricePoint: string;
  };
}

export interface GeneratedLeadMachineFunnel {
  config: any; // Full QuizConfig
  scripts: {
    getAttention: string;
    shiftBeliefs: string;
    makeOffer: string;
    questions: Array<{
      intro: string;
      question: string;
      transition: string;
    }>;
    outcomes: Record<string, string>; // outcome_id -> full script
  };
}
