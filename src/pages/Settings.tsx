import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, CreditCard, Bell, Sparkles, Upload } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const profileSchema = z.object({
  full_name: z.string().min(2, 'Minimum 2 caractères').max(100),
  company_name: z.string().max(100).optional(),
  phone: z.string().max(20).optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const Settings = () => {
  const { user, profile, updateProfile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profile?.full_name || '',
      company_name: profile?.company_name || '',
      phone: profile?.phone || '',
    },
  });

  const handleUpdateProfile = async (data: ProfileFormData) => {
    setLoading(true);
    const { error } = await updateProfile(data);
    setLoading(false);

    if (!error) {
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été sauvegardées",
      });
    }
  };

  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return user?.email?.slice(0, 2).toUpperCase() || 'U';
  };

  const getPlanBadge = () => {
    const plan = profile?.plan || 'free';
    const colors = {
      free: 'bg-muted',
      starter: 'bg-primary',
      pro: 'bg-accent',
      enterprise: 'bg-success',
    };
    return (
      <Badge className={colors[plan as keyof typeof colors]}>
        {plan.toUpperCase()}
      </Badge>
    );
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-8 max-w-5xl mx-auto">
        <div>
          <h1 className="text-4xl font-bold">Paramètres</h1>
          <p className="text-muted-foreground mt-2">
            Gérez votre compte et vos préférences
          </p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">
              <User className="mr-2 h-4 w-4" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="plan">
              <CreditCard className="mr-2 h-4 w-4" />
              Plan
            </TabsTrigger>
            <TabsTrigger value="ai">
              <Sparkles className="mr-2 h-4 w-4" />
              IA
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
                <CardDescription>
                  Mettez à jour vos informations de profil
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" size="sm">
                      <Upload className="mr-2 h-4 w-4" />
                      Changer la photo
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      JPG, PNG ou GIF. Max 2MB.
                    </p>
                  </div>
                </div>

                <form onSubmit={form.handleSubmit(handleUpdateProfile)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">
                      L'email ne peut pas être modifié
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="full_name">Nom complet *</Label>
                    <Input
                      id="full_name"
                      {...form.register('full_name')}
                    />
                    {form.formState.errors.full_name && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.full_name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company_name">Entreprise</Label>
                    <Input
                      id="company_name"
                      {...form.register('company_name')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      {...form.register('phone')}
                    />
                  </div>

                  <Button type="submit" disabled={loading}>
                    {loading ? 'Enregistrement...' : 'Sauvegarder'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Plan Tab */}
          <TabsContent value="plan" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Plan actuel</CardTitle>
                    <CardDescription>
                      Gérez votre abonnement et facturation
                    </CardDescription>
                  </div>
                  {getPlanBadge()}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div className="flex justify-between items-center pb-4 border-b">
                    <div>
                      <p className="font-medium">Funnels actifs</p>
                      <p className="text-sm text-muted-foreground">
                        0 / {profile?.max_funnels || 3}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">Crédits IA</p>
                      <p className="text-sm text-muted-foreground">
                        {profile?.current_month_ai_count || 0} / {profile?.max_ai_generations_monthly || 50}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm font-medium mb-2">Besoin de plus ?</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Passez à un plan supérieur pour débloquer plus de funnels et de crédits IA
                  </p>
                  <Button>Voir les plans</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Tab */}
          <TabsContent value="ai" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Utilisation de l'IA</CardTitle>
                <CardDescription>
                  Gérez vos crédits et préférences IA
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Crédits utilisés ce mois</p>
                      <p className="text-sm text-muted-foreground">
                        Réinitialisation le {new Date(profile?.ai_count_reset_at || new Date()).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <p className="text-2xl font-bold">
                      {profile?.current_month_ai_count || 0} / {profile?.max_ai_generations_monthly || 50}
                    </p>
                  </div>

                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-accent transition-all"
                      style={{ 
                        width: `${((profile?.current_month_ai_count || 0) / (profile?.max_ai_generations_monthly || 50)) * 100}%` 
                      }}
                    />
                  </div>
                </div>

                <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-accent mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium mb-1">Optimisez votre utilisation</p>
                      <p className="text-muted-foreground">
                        Les crédits IA sont utilisés pour générer des images, vidéos, audio et contenu texte.
                        Planifiez vos générations pour maximiser votre quota mensuel.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Préférences de notification</CardTitle>
                <CardDescription>
                  Gérez comment vous recevez les notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">
                    Préférences de notification à venir
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Settings;
