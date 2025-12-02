import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, Mail, Book, Clock, ArrowRight, HelpCircle, Zap, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import numtemaLogo from '@/assets/numtema-face-logo.png';

const Support = () => {
  const navigate = useNavigate();

  const faqs = [
    { q: 'Comment créer mon premier funnel ?', a: 'Rendez-vous sur votre dashboard, cliquez sur "Nouveau funnel" et choisissez entre un template, Lead Machine ou création libre.' },
    { q: 'Comment fonctionne le scoring des leads ?', a: 'Chaque réponse peut avoir un score. Le score total du lead est calculé automatiquement en fonction de ses réponses.' },
    { q: 'Puis-je personnaliser l\'apparence de mes funnels ?', a: 'Oui, vous pouvez ajouter votre logo, choisir vos couleurs et personnaliser chaque étape.' },
    { q: 'Comment recevoir les notifications de nouveaux leads ?', a: 'Les notifications email sont activées automatiquement pour tous vos funnels publiés.' },
    { q: 'Puis-je exporter mes données ?', a: 'Oui, vous pouvez exporter vos leads et analytics au format CSV depuis le dashboard.' },
    { q: 'Comment intégrer Calendly ?', a: 'Ajoutez une étape "Calendrier" dans votre funnel et collez votre lien Calendly.' },
  ];

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
      <section className="py-16 md:py-20 bg-gradient-to-br from-background via-primary/5 to-accent/10">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <HelpCircle className="h-12 w-12 text-primary mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Comment pouvons-nous <span className="text-primary">vous aider</span> ?
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Notre équipe est là pour répondre à toutes vos questions.
          </p>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="text-center hover:shadow-elegant transition-all duration-300 border-border/50">
              <CardContent className="pt-8 pb-6">
                <div className="h-14 w-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Book className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">Documentation</h3>
                <p className="text-muted-foreground text-sm mb-4">Guides et tutoriels détaillés</p>
                <Button variant="outline" onClick={() => navigate('/docs')}>
                  Consulter
                </Button>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-elegant transition-all duration-300 border-border/50">
              <CardContent className="pt-8 pb-6">
                <div className="h-14 w-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">Email</h3>
                <p className="text-muted-foreground text-sm mb-4">Réponse sous 24h</p>
                <Button variant="outline" asChild>
                  <a href="mailto:support@numtema.com">Écrire</a>
                </Button>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-elegant transition-all duration-300 border-border/50">
              <CardContent className="pt-8 pb-6">
                <div className="h-14 w-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">Horaires</h3>
                <p className="text-muted-foreground text-sm mb-4">Lun-Ven, 9h-18h (CET)</p>
                <Button variant="outline" disabled>
                  En ligne
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Questions fréquentes</h2>
            <p className="text-muted-foreground">Les réponses aux questions les plus posées</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {faqs.map((faq, i) => (
              <Card key={i} className="border-border/50">
                <CardContent className="pt-5 pb-4">
                  <h3 className="font-semibold mb-2">{faq.q}</h3>
                  <p className="text-muted-foreground text-sm">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button variant="link" onClick={() => navigate('/')}>
              Voir toutes les FAQ
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-4">Nous contacter</h2>
              <p className="text-muted-foreground">Envoyez-nous un message et nous vous répondrons rapidement.</p>
            </div>
            <Card className="border-border/50">
              <CardContent className="pt-6">
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Nom</label>
                      <Input placeholder="Votre nom" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Email</label>
                      <Input type="email" placeholder="votre@email.com" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Sujet</label>
                    <Input placeholder="De quoi s'agit-il ?" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Message</label>
                    <Textarea placeholder="Décrivez votre question ou problème..." rows={5} />
                  </div>
                  <Button className="w-full shadow-elegant">
                    Envoyer le message
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
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

export default Support;
