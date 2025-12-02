import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Building } from 'lucide-react';
import numtemaLogo from '@/assets/numtema-face-logo.png';

const Legal = () => {
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
          <Building className="h-12 w-12 text-primary mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Mentions Légales</h1>
          <p className="text-muted-foreground">Informations légales et éditeur du site</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold mb-4">Éditeur du site</h2>
            <div className="bg-muted/30 rounded-lg p-6 mb-8">
              <p className="text-muted-foreground mb-2"><strong>Raison sociale :</strong> Nümtema AI Foundry</p>
              <p className="text-muted-foreground mb-2"><strong>Forme juridique :</strong> SAS (Société par Actions Simplifiée)</p>
              <p className="text-muted-foreground mb-2"><strong>Capital social :</strong> 10 000 €</p>
              <p className="text-muted-foreground mb-2"><strong>Siège social :</strong> 123 Avenue de l'Innovation, 75001 Paris, France</p>
              <p className="text-muted-foreground mb-2"><strong>RCS :</strong> Paris B 123 456 789</p>
              <p className="text-muted-foreground mb-2"><strong>N° TVA intracommunautaire :</strong> FR12345678901</p>
              <p className="text-muted-foreground mb-2"><strong>Email :</strong> <a href="mailto:contact@numtema.com" className="text-primary hover:underline">contact@numtema.com</a></p>
              <p className="text-muted-foreground"><strong>Téléphone :</strong> +33 1 23 45 67 89</p>
            </div>

            <h2 className="text-2xl font-bold mb-4">Directeur de la publication</h2>
            <p className="text-muted-foreground mb-8">
              Le directeur de la publication est le représentant légal de la société Nümtema AI Foundry.
            </p>

            <h2 className="text-2xl font-bold mb-4">Hébergement</h2>
            <div className="bg-muted/30 rounded-lg p-6 mb-8">
              <p className="text-muted-foreground mb-2"><strong>Hébergeur :</strong> Supabase Inc.</p>
              <p className="text-muted-foreground mb-2"><strong>Adresse :</strong> 970 Toa Payoh North #07-04, Singapore 318992</p>
              <p className="text-muted-foreground mb-2"><strong>Localisation des données :</strong> Union Européenne (Frankfurt, Allemagne)</p>
              <p className="text-muted-foreground"><strong>Site web :</strong> <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">supabase.com</a></p>
            </div>

            <h2 className="text-2xl font-bold mb-4">Propriété intellectuelle</h2>
            <p className="text-muted-foreground mb-6">
              L'ensemble du contenu de ce site (textes, images, logos, design, code source) est protégé par le droit de la propriété intellectuelle. Toute reproduction, représentation, modification ou adaptation, totale ou partielle, est strictement interdite sans autorisation écrite préalable de Nümtema AI Foundry.
            </p>
            <p className="text-muted-foreground mb-8">
              La marque "Nümtema" et le logo associé sont des marques déposées. Toute utilisation non autorisée constitue une contrefaçon sanctionnée par les articles L.335-2 et suivants du Code de la propriété intellectuelle.
            </p>

            <h2 className="text-2xl font-bold mb-4">Données personnelles</h2>
            <p className="text-muted-foreground mb-8">
              Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données. Pour plus d'informations, consultez notre <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/privacy')}>Politique de Confidentialité</Button>.
            </p>

            <h2 className="text-2xl font-bold mb-4">Délégué à la Protection des Données</h2>
            <p className="text-muted-foreground mb-8">
              Pour toute question relative à la protection de vos données personnelles, vous pouvez contacter notre DPO à l'adresse : <a href="mailto:dpo@numtema.com" className="text-primary hover:underline">dpo@numtema.com</a>
            </p>

            <h2 className="text-2xl font-bold mb-4">Cookies</h2>
            <p className="text-muted-foreground mb-8">
              Ce site utilise des cookies essentiels au fonctionnement du service. Pour plus d'informations sur l'utilisation des cookies, consultez notre <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/privacy')}>Politique de Confidentialité</Button>.
            </p>

            <h2 className="text-2xl font-bold mb-4">Litiges</h2>
            <p className="text-muted-foreground mb-8">
              Les présentes mentions légales sont soumises au droit français. En cas de litige, et après tentative de résolution amiable, les tribunaux de Paris seront seuls compétents.
            </p>

            <h2 className="text-2xl font-bold mb-4">Médiation</h2>
            <p className="text-muted-foreground mb-6">
              Conformément aux dispositions du Code de la consommation concernant le règlement amiable des litiges, le client peut recourir au service de médiation proposé par Nümtema AI Foundry. Le médiateur de la consommation peut être saisi de tout litige qui n'aurait pas été résolu directement avec notre service client.
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

export default Legal;
