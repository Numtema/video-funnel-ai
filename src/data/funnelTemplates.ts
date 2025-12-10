import { QuizConfig, StepType } from '@/types/funnel';

export interface FunnelTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  categoryIcon: string;
  thumbnail: string;
  color: string;
  config: QuizConfig;
}

export const FUNNEL_TEMPLATES: FunnelTemplate[] = [
  // 1. Lead Generation
  {
    id: 'tpl-lead-gen',
    name: 'Génération de Leads',
    description: 'Capturez des leads qualifiés avec une séquence vidéo engageante et un formulaire optimisé.',
    category: 'Marketing',
    categoryIcon: 'Target',
    thumbnail: '/templates/lead-gen.png',
    color: '#3B82F6',
    config: {
      steps: [
        {
          id: 'welcome-1',
          type: StepType.Welcome,
          title: 'Découvrez Comment Doubler Vos Ventes en 30 Jours',
          description: 'Une méthode éprouvée par plus de 10 000 entrepreneurs. Regardez cette courte vidéo pour comprendre comment.',
          media: { type: 'video', url: '' },
          buttonText: 'Voir la méthode →',
        },
        {
          id: 'question-1',
          type: StepType.Question,
          title: 'Quel est votre principal défi actuellement ?',
          description: 'Sélectionnez le défi qui vous correspond le plus.',
          media: { type: 'none', url: '' },
          options: [
            { id: 'opt-1', text: 'Générer plus de leads', score: 3 },
            { id: 'opt-2', text: 'Convertir mes visiteurs', score: 2 },
            { id: 'opt-3', text: 'Fidéliser mes clients', score: 1 },
            { id: 'opt-4', text: 'Automatiser mon business', score: 2 },
          ],
        },
        {
          id: 'question-2',
          type: StepType.Question,
          title: 'Quel est votre chiffre d\'affaires mensuel ?',
          description: 'Cette information nous aide à personnaliser nos conseils.',
          media: { type: 'none', url: '' },
          options: [
            { id: 'opt-5', text: 'Moins de 5 000€', score: 1 },
            { id: 'opt-6', text: '5 000€ - 20 000€', score: 2 },
            { id: 'opt-7', text: '20 000€ - 50 000€', score: 3 },
            { id: 'opt-8', text: 'Plus de 50 000€', score: 4 },
          ],
        },
        {
          id: 'lead-capture',
          type: StepType.LeadCapture,
          title: 'Recevez votre stratégie personnalisée',
          description: 'Entrez vos coordonnées pour recevoir immédiatement votre plan d\'action sur mesure.',
          media: { type: 'none', url: '' },
          fields: ['name', 'email', 'phone'],
          buttonText: 'Recevoir ma stratégie →',
        },
        {
          id: 'message-final',
          type: StepType.Message,
          title: 'Merci ! Votre stratégie arrive...',
          description: 'Vérifiez votre boîte mail dans les prochaines minutes. En attendant, réservez un appel stratégique gratuit avec notre équipe.',
          media: { type: 'video', url: '' },
          buttonText: 'Réserver mon appel gratuit',
        },
      ],
      theme: {
        font: 'Inter',
        colors: {
          background: '#0F172A',
          primary: '#3B82F6',
          accent: '#60A5FA',
          text: '#F8FAFC',
          buttonText: '#FFFFFF',
        },
      },
      scoring: {
        enabled: true,
        threshold: 5,
        segments: [
          {
            id: 'seg-1',
            name: 'starter',
            label: 'Débutant',
            minScore: 0,
            maxScore: 4,
            color: '#F59E0B',
          },
          {
            id: 'seg-2',
            name: 'growth',
            label: 'En Croissance',
            minScore: 5,
            maxScore: 7,
            color: '#10B981',
          },
          {
            id: 'seg-3',
            name: 'scale',
            label: 'Prêt à Scaler',
            minScore: 8,
            maxScore: 10,
            color: '#8B5CF6',
          },
        ],
      },
    },
  },

  // 2. Quiz Assessment
  {
    id: 'tpl-quiz',
    name: 'Quiz d\'Évaluation',
    description: 'Qualifiez vos prospects avec un quiz interactif et orientez-les vers l\'offre adaptée à leur profil.',
    category: 'Quiz',
    categoryIcon: 'ClipboardList',
    thumbnail: '/templates/quiz.png',
    color: '#8B5CF6',
    config: {
      steps: [
        {
          id: 'welcome-quiz',
          type: StepType.Welcome,
          title: 'Découvrez Votre Niveau en Marketing Digital',
          description: 'Répondez à 5 questions rapides et recevez un diagnostic personnalisé avec des recommandations adaptées à votre niveau.',
          media: { type: 'image', url: '' },
          buttonText: 'Commencer le quiz →',
        },
        {
          id: 'q1',
          type: StepType.Question,
          title: 'Comment gérez-vous actuellement vos réseaux sociaux ?',
          media: { type: 'none', url: '' },
          options: [
            { id: 'q1-a', text: 'Je ne publie pas régulièrement', score: 1 },
            { id: 'q1-b', text: 'Je publie quand j\'y pense', score: 2 },
            { id: 'q1-c', text: 'J\'ai un calendrier éditorial', score: 3 },
            { id: 'q1-d', text: 'J\'ai une stratégie complète avec analytics', score: 4 },
          ],
        },
        {
          id: 'q2',
          type: StepType.Question,
          title: 'Utilisez-vous l\'email marketing ?',
          media: { type: 'none', url: '' },
          options: [
            { id: 'q2-a', text: 'Non, pas du tout', score: 1 },
            { id: 'q2-b', text: 'J\'envoie des newsletters occasionnelles', score: 2 },
            { id: 'q2-c', text: 'J\'ai des séquences automatisées', score: 3 },
            { id: 'q2-d', text: 'J\'ai un système de segmentation avancé', score: 4 },
          ],
        },
        {
          id: 'q3',
          type: StepType.Question,
          title: 'Comment mesurez-vous vos résultats marketing ?',
          media: { type: 'none', url: '' },
          options: [
            { id: 'q3-a', text: 'Je ne mesure pas vraiment', score: 1 },
            { id: 'q3-b', text: 'Je regarde les likes et followers', score: 2 },
            { id: 'q3-c', text: 'Je suis le trafic et les conversions', score: 3 },
            { id: 'q3-d', text: 'J\'ai des KPIs précis et des dashboards', score: 4 },
          ],
        },
        {
          id: 'q4',
          type: StepType.Question,
          title: 'Avez-vous un tunnel de vente ?',
          media: { type: 'none', url: '' },
          options: [
            { id: 'q4-a', text: 'Non, qu\'est-ce que c\'est ?', score: 1 },
            { id: 'q4-b', text: 'J\'ai une landing page basique', score: 2 },
            { id: 'q4-c', text: 'J\'ai un tunnel avec plusieurs étapes', score: 3 },
            { id: 'q4-d', text: 'J\'ai plusieurs tunnels optimisés', score: 4 },
          ],
        },
        {
          id: 'q5',
          type: StepType.Question,
          title: 'Quel est votre budget marketing mensuel ?',
          media: { type: 'none', url: '' },
          options: [
            { id: 'q5-a', text: 'Moins de 500€', score: 1 },
            { id: 'q5-b', text: '500€ - 2000€', score: 2 },
            { id: 'q5-c', text: '2000€ - 5000€', score: 3 },
            { id: 'q5-d', text: 'Plus de 5000€', score: 4 },
          ],
        },
        {
          id: 'lead-quiz',
          type: StepType.LeadCapture,
          title: 'Découvrez votre résultat !',
          description: 'Entrez votre email pour recevoir votre diagnostic complet avec des recommandations personnalisées.',
          media: { type: 'none', url: '' },
          fields: ['name', 'email'],
          buttonText: 'Voir mon résultat →',
        },
        {
          id: 'result-beginner',
          type: StepType.Message,
          title: '🌱 Niveau Débutant',
          description: 'Vous êtes au début de votre parcours marketing digital. C\'est le moment parfait pour poser des bases solides ! Nous avons préparé un guide gratuit pour vous aider à démarrer.',
          media: { type: 'none', url: '' },
          buttonText: 'Télécharger le guide débutant',
        },
        {
          id: 'result-intermediate',
          type: StepType.Message,
          title: '🚀 Niveau Intermédiaire',
          description: 'Vous avez de bonnes bases mais il reste du potentiel à exploiter ! Notre formation accélérée peut vous faire passer au niveau supérieur.',
          media: { type: 'none', url: '' },
          buttonText: 'Découvrir la formation',
        },
        {
          id: 'result-expert',
          type: StepType.Message,
          title: '⭐ Niveau Expert',
          description: 'Bravo ! Vous maîtrisez les fondamentaux du marketing digital. Pour aller encore plus loin, découvrez nos stratégies avancées réservées aux experts.',
          media: { type: 'none', url: '' },
          buttonText: 'Accéder aux stratégies avancées',
        },
      ],
      theme: {
        font: 'Inter',
        colors: {
          background: '#1E1B4B',
          primary: '#8B5CF6',
          accent: '#A78BFA',
          text: '#F8FAFC',
          buttonText: '#FFFFFF',
        },
      },
      scoring: {
        enabled: true,
        threshold: 10,
        showSegmentResult: true,
        segments: [
          {
            id: 'seg-beginner',
            name: 'beginner',
            label: 'Débutant',
            minScore: 0,
            maxScore: 8,
            color: '#F59E0B',
            nextStepId: 'result-beginner',
          },
          {
            id: 'seg-intermediate',
            name: 'intermediate',
            label: 'Intermédiaire',
            minScore: 9,
            maxScore: 14,
            color: '#10B981',
            nextStepId: 'result-intermediate',
          },
          {
            id: 'seg-expert',
            name: 'expert',
            label: 'Expert',
            minScore: 15,
            maxScore: 20,
            color: '#8B5CF6',
            nextStepId: 'result-expert',
          },
        ],
      },
    },
  },

  // 3. Webinar Registration
  {
    id: 'tpl-webinar',
    name: 'Inscription Webinaire',
    description: 'Maximisez les inscriptions à vos webinaires avec une page optimisée et des rappels automatiques.',
    category: 'Événement',
    categoryIcon: 'Video',
    thumbnail: '/templates/webinar.png',
    color: '#10B981',
    config: {
      steps: [
        {
          id: 'webinar-welcome',
          type: StepType.Welcome,
          title: 'Masterclass Gratuite : Les 7 Secrets du Marketing Automation',
          description: 'Rejoignez-nous le Jeudi 15 à 14h pour découvrir comment automatiser votre business et générer des revenus passifs. Places limitées à 100 participants.',
          media: { type: 'video', url: '' },
          buttonText: 'Réserver ma place gratuite →',
        },
        {
          id: 'webinar-q1',
          type: StepType.Question,
          title: 'Quelle session préférez-vous ?',
          description: 'Choisissez le créneau qui vous convient le mieux.',
          media: { type: 'none', url: '' },
          options: [
            { id: 'session-1', text: 'Jeudi 15 à 14h (Paris)', score: 1 },
            { id: 'session-2', text: 'Jeudi 15 à 19h (Paris)', score: 1 },
            { id: 'session-3', text: 'Samedi 17 à 10h (Paris)', score: 1 },
          ],
        },
        {
          id: 'webinar-q2',
          type: StepType.Question,
          title: 'Quel est votre objectif principal ?',
          description: 'Cela nous aide à personnaliser le contenu du webinaire.',
          media: { type: 'none', url: '' },
          options: [
            { id: 'goal-1', text: 'Automatiser mes ventes', score: 2 },
            { id: 'goal-2', text: 'Gagner du temps', score: 2 },
            { id: 'goal-3', text: 'Augmenter mes revenus', score: 2 },
            { id: 'goal-4', text: 'Tout cela à la fois !', score: 3 },
          ],
        },
        {
          id: 'webinar-lead',
          type: StepType.LeadCapture,
          title: 'Finalisez votre inscription',
          description: 'Remplissez le formulaire pour recevoir votre lien de connexion et les bonus exclusifs.',
          media: { type: 'none', url: '' },
          fields: ['name', 'email', 'phone'],
          buttonText: 'Confirmer mon inscription →',
        },
        {
          id: 'webinar-confirm',
          type: StepType.Message,
          title: '✅ Inscription confirmée !',
          description: 'Votre place est réservée. Vérifiez votre boîte mail pour le lien de connexion. Ajoutez l\'événement à votre calendrier pour ne pas oublier !',
          media: { type: 'none', url: '' },
          buttonText: 'Ajouter au calendrier',
        },
      ],
      theme: {
        font: 'Inter',
        colors: {
          background: '#064E3B',
          primary: '#10B981',
          accent: '#34D399',
          text: '#F0FDF4',
          buttonText: '#FFFFFF',
        },
      },
    },
  },

  // 4. Product Launch
  {
    id: 'tpl-product-launch',
    name: 'Lancement de Produit',
    description: 'Créez l\'engouement autour de votre nouveau produit avec une séquence de teasing et pré-lancement.',
    category: 'E-commerce',
    categoryIcon: 'Rocket',
    thumbnail: '/templates/product-launch.png',
    color: '#EF4444',
    config: {
      steps: [
        {
          id: 'launch-teaser',
          type: StepType.Welcome,
          title: 'Quelque chose d\'incroyable arrive...',
          description: 'Soyez parmi les premiers à découvrir notre nouvelle innovation qui va révolutionner votre quotidien. Accès VIP réservé aux inscrits.',
          media: { type: 'video', url: '' },
          buttonText: 'Je veux en savoir plus →',
        },
        {
          id: 'launch-q1',
          type: StepType.Question,
          title: 'Qu\'est-ce qui compte le plus pour vous ?',
          description: 'Aidez-nous à personnaliser votre expérience.',
          media: { type: 'none', url: '' },
          options: [
            { id: 'prio-1', text: 'La qualité premium', score: 3 },
            { id: 'prio-2', text: 'Le meilleur rapport qualité-prix', score: 2 },
            { id: 'prio-3', text: 'L\'innovation et les nouvelles technologies', score: 3 },
            { id: 'prio-4', text: 'Un service client exceptionnel', score: 2 },
          ],
        },
        {
          id: 'launch-q2',
          type: StepType.Question,
          title: 'Quand seriez-vous prêt(e) à acheter ?',
          media: { type: 'none', url: '' },
          options: [
            { id: 'timing-1', text: 'Dès que c\'est disponible !', score: 4 },
            { id: 'timing-2', text: 'Dans les 30 prochains jours', score: 3 },
            { id: 'timing-3', text: 'Je veux d\'abord voir les avis', score: 2 },
            { id: 'timing-4', text: 'Je suis juste curieux(se)', score: 1 },
          ],
        },
        {
          id: 'launch-reveal',
          type: StepType.Message,
          title: '🎁 Avant-première exclusive',
          description: 'Découvrez en avant-première notre nouveau produit. Les premiers inscrits bénéficieront d\'une remise exclusive de 30% au lancement.',
          media: { type: 'video', url: '' },
          buttonText: 'Continuer →',
        },
        {
          id: 'launch-lead',
          type: StepType.LeadCapture,
          title: 'Rejoignez la liste VIP',
          description: 'Inscrivez-vous pour être notifié en premier du lancement et bénéficier de votre remise exclusive de 30%.',
          media: { type: 'none', url: '' },
          fields: ['name', 'email'],
          buttonText: 'Rejoindre la liste VIP →',
        },
        {
          id: 'launch-thank',
          type: StepType.Message,
          title: '🎉 Bienvenue dans le club VIP !',
          description: 'Vous êtes maintenant sur notre liste prioritaire. Surveillez votre boîte mail, le lancement arrive très bientôt ! En attendant, partagez avec vos amis pour débloquer des bonus supplémentaires.',
          media: { type: 'none', url: '' },
          buttonText: 'Partager avec mes amis',
        },
      ],
      theme: {
        font: 'Inter',
        colors: {
          background: '#18181B',
          primary: '#EF4444',
          accent: '#F87171',
          text: '#FAFAFA',
          buttonText: '#FFFFFF',
        },
      },
      scoring: {
        enabled: true,
        threshold: 5,
        segments: [
          {
            id: 'seg-curious',
            name: 'curious',
            label: 'Curieux',
            minScore: 0,
            maxScore: 4,
            color: '#6B7280',
          },
          {
            id: 'seg-interested',
            name: 'interested',
            label: 'Intéressé',
            minScore: 5,
            maxScore: 6,
            color: '#F59E0B',
          },
          {
            id: 'seg-hot',
            name: 'hot',
            label: 'Acheteur Potentiel',
            minScore: 7,
            maxScore: 10,
            color: '#EF4444',
          },
        ],
      },
    },
  },
];

export const TEMPLATE_CATEGORIES = [
  { id: 'marketing', name: 'Marketing', icon: 'Target' },
  { id: 'quiz', name: 'Quiz', icon: 'ClipboardList' },
  { id: 'event', name: 'Événement', icon: 'Video' },
  { id: 'ecommerce', name: 'E-commerce', icon: 'Rocket' },
];
