import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield } from 'lucide-react';


const Privacy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <span className="text-xl md:text-2xl font-bold text-primary font-poppins">Nümtema Face</span>
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
          <Shield className="h-12 w-12 text-primary mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Politique de Confidentialité</h1>
          <p className="text-muted-foreground">Dernière mise à jour : 1er décembre 2025</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
            <p className="text-muted-foreground mb-6">
              Nümtema AI Foundry ("nous", "notre", "nos") s'engage à protéger la confidentialité des utilisateurs de notre plateforme Nümtema Face. Cette politique de confidentialité explique comment nous collectons, utilisons, stockons et protégeons vos informations personnelles.
            </p>

            <h2 className="text-2xl font-bold mb-4">2. Données collectées</h2>
            <p className="text-muted-foreground mb-4">Nous collectons les types de données suivants :</p>
            <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-2">
              <li><strong>Données d'inscription</strong> : nom, email, mot de passe (hashé)</li>
              <li><strong>Données de profil</strong> : nom d'entreprise, téléphone, site web, photo de profil</li>
              <li><strong>Données d'utilisation</strong> : funnels créés, analytics, logs de connexion</li>
              <li><strong>Données de paiement</strong> : traitées par Stripe, nous ne stockons pas vos coordonnées bancaires</li>
              <li><strong>Données des leads</strong> : informations collectées via vos funnels auprès de vos visiteurs</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4">3. Utilisation des données</h2>
            <p className="text-muted-foreground mb-4">Vos données sont utilisées pour :</p>
            <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-2">
              <li>Fournir et améliorer nos services</li>
              <li>Gérer votre compte et votre abonnement</li>
              <li>Envoyer des notifications relatives à votre compte</li>
              <li>Analyser l'utilisation pour améliorer la plateforme</li>
              <li>Répondre à vos demandes de support</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4">4. Partage des données</h2>
            <p className="text-muted-foreground mb-6">
              Nous ne vendons jamais vos données personnelles. Nous pouvons partager vos données avec des prestataires de services (hébergement, paiement, email) dans le strict cadre de la fourniture de nos services, et uniquement avec des partenaires conformes au RGPD.
            </p>

            <h2 className="text-2xl font-bold mb-4">5. Hébergement et sécurité</h2>
            <p className="text-muted-foreground mb-6">
              Toutes vos données sont hébergées sur des serveurs sécurisés situés dans l'Union Européenne. Nous utilisons le chiffrement SSL/TLS pour toutes les communications et le chiffrement au repos pour les données stockées.
            </p>

            <h2 className="text-2xl font-bold mb-4">6. Vos droits (RGPD)</h2>
            <p className="text-muted-foreground mb-4">Conformément au RGPD, vous disposez des droits suivants :</p>
            <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-2">
              <li><strong>Droit d'accès</strong> : obtenir une copie de vos données</li>
              <li><strong>Droit de rectification</strong> : corriger vos données inexactes</li>
              <li><strong>Droit à l'effacement</strong> : demander la suppression de vos données</li>
              <li><strong>Droit à la portabilité</strong> : recevoir vos données dans un format structuré</li>
              <li><strong>Droit d'opposition</strong> : vous opposer au traitement de vos données</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4">7. Cookies</h2>
            <p className="text-muted-foreground mb-6">
              Nous utilisons des cookies essentiels au fonctionnement de la plateforme (authentification, préférences). Nous n'utilisons pas de cookies de tracking publicitaire. Vous pouvez gérer vos préférences de cookies dans les paramètres de votre navigateur.
            </p>

            <h2 className="text-2xl font-bold mb-4">8. Conservation des données</h2>
            <p className="text-muted-foreground mb-6">
              Vos données sont conservées tant que votre compte est actif. En cas de suppression de compte, vos données personnelles sont supprimées dans un délai de 30 jours, sauf obligation légale de conservation.
            </p>

            <h2 className="text-2xl font-bold mb-4">9. Contact</h2>
            <p className="text-muted-foreground mb-6">
              Pour toute question relative à cette politique ou pour exercer vos droits, contactez-nous à : <a href="mailto:privacy@numtema.com" className="text-primary hover:underline">privacy@numtema.com</a>
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

export default Privacy;
