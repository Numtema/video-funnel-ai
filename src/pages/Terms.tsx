import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileText } from 'lucide-react';
import numtemaLogo from '@/assets/numtema-face-logo.png';

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <img src={numtemaLogo} alt="Nümtema Face" className="h-10 md:h-12" />
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate('/auth')}>Connexion</Button>
            <Button onClick={() => navigate('/auth')} className="shadow-elegant">
              Commencer
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-background via-primary/5 to-accent/10">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <FileText className="h-12 w-12 text-primary mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Conditions Générales d'Utilisation</h1>
          <p className="text-muted-foreground">Dernière mise à jour : 1er décembre 2025</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold mb-4">1. Objet</h2>
            <p className="text-muted-foreground mb-6">
              Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation de la plateforme Nümtema Face, éditée par Nümtema AI Foundry. En utilisant nos services, vous acceptez ces conditions dans leur intégralité.
            </p>

            <h2 className="text-2xl font-bold mb-4">2. Description du service</h2>
            <p className="text-muted-foreground mb-6">
              Nümtema Face est une plateforme SaaS permettant de créer des funnels vidéo interactifs pour la génération de leads. Le service inclut un éditeur de funnels, des fonctionnalités d'IA générative, des analytics, et des outils d'intégration.
            </p>

            <h2 className="text-2xl font-bold mb-4">3. Inscription et compte</h2>
            <p className="text-muted-foreground mb-4">Pour utiliser Nümtema Face, vous devez :</p>
            <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-2">
              <li>Être âgé d'au moins 18 ans ou avoir l'autorisation d'un représentant légal</li>
              <li>Fournir des informations exactes et à jour lors de l'inscription</li>
              <li>Maintenir la confidentialité de vos identifiants de connexion</li>
              <li>Nous informer immédiatement de toute utilisation non autorisée de votre compte</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4">4. Abonnements et paiements</h2>
            <p className="text-muted-foreground mb-4">Nümtema Face propose plusieurs plans d'abonnement :</p>
            <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-2">
              <li><strong>Free</strong> : Gratuit, avec des fonctionnalités limitées</li>
              <li><strong>Starter</strong> : 29€/mois, facturation mensuelle</li>
              <li><strong>Pro</strong> : 79€/mois, facturation mensuelle</li>
            </ul>
            <p className="text-muted-foreground mb-6">
              Les paiements sont traités par Stripe. Vous pouvez annuler votre abonnement à tout moment depuis les paramètres de votre compte. L'annulation prend effet à la fin de la période de facturation en cours.
            </p>

            <h2 className="text-2xl font-bold mb-4">5. Utilisation acceptable</h2>
            <p className="text-muted-foreground mb-4">Vous vous engagez à ne pas utiliser Nümtema Face pour :</p>
            <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-2">
              <li>Diffuser du contenu illégal, diffamatoire, ou portant atteinte aux droits d'autrui</li>
              <li>Collecter des données personnelles sans consentement approprié</li>
              <li>Envoyer du spam ou du contenu non sollicité</li>
              <li>Tenter de contourner les mesures de sécurité ou les limitations du service</li>
              <li>Utiliser le service d'une manière qui pourrait endommager ou surcharger nos systèmes</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4">6. Propriété intellectuelle</h2>
            <p className="text-muted-foreground mb-6">
              Le contenu que vous créez via Nümtema Face vous appartient. Vous nous accordez une licence limitée pour héberger et afficher ce contenu dans le cadre du service. Nümtema AI Foundry conserve tous les droits sur la plateforme, son code, son design et sa documentation.
            </p>

            <h2 className="text-2xl font-bold mb-4">7. Données et confidentialité</h2>
            <p className="text-muted-foreground mb-6">
              Le traitement de vos données personnelles est régi par notre <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/privacy')}>Politique de Confidentialité</Button>. Vous êtes responsable de la collecte et du traitement des données de vos leads conformément au RGPD.
            </p>

            <h2 className="text-2xl font-bold mb-4">8. Limitation de responsabilité</h2>
            <p className="text-muted-foreground mb-6">
              Nümtema Face est fourni "tel quel". Nous ne garantissons pas que le service sera ininterrompu ou exempt d'erreurs. Notre responsabilité est limitée au montant des frais d'abonnement payés au cours des 12 derniers mois.
            </p>

            <h2 className="text-2xl font-bold mb-4">9. Résiliation</h2>
            <p className="text-muted-foreground mb-6">
              Nous nous réservons le droit de suspendre ou résilier votre compte en cas de violation de ces CGU. Vous pouvez supprimer votre compte à tout moment depuis les paramètres. La résiliation entraîne la suppression de vos données dans un délai de 30 jours.
            </p>

            <h2 className="text-2xl font-bold mb-4">10. Modifications</h2>
            <p className="text-muted-foreground mb-6">
              Nous pouvons modifier ces CGU à tout moment. Les modifications importantes vous seront notifiées par email ou via la plateforme. La poursuite de l'utilisation du service après notification vaut acceptation des nouvelles conditions.
            </p>

            <h2 className="text-2xl font-bold mb-4">11. Droit applicable</h2>
            <p className="text-muted-foreground mb-6">
              Ces CGU sont régies par le droit français. Tout litige sera soumis à la compétence exclusive des tribunaux de Paris.
            </p>

            <h2 className="text-2xl font-bold mb-4">12. Contact</h2>
            <p className="text-muted-foreground mb-6">
              Pour toute question relative à ces CGU : <a href="mailto:legal@numtema.com" className="text-primary hover:underline">legal@numtema.com</a>
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background py-8">
        <div className="container mx-auto px-4 lg:px-8 text-center text-sm text-muted-foreground">
          <p>© 2025 Nümtema AI Foundry • Tous droits réservés</p>
        </div>
      </footer>
    </div>
  );
};

export default Terms;
