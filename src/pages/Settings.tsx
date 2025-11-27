import { useState, useRef } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { User, CreditCard, Bell, Sparkles, Upload, Lock, AlertTriangle } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { PlansDialog } from '@/components/settings/PlansDialog';

const profileSchema = z.object({
  full_name: z.string().min(2, 'Minimum 2 caractères').max(100),
  company_name: z.string().max(100).optional(),
  phone: z.string().max(20).optional(),
  website: z.string().url('URL invalide').optional().or(z.literal('')),
});

const passwordSchema = z.object({
  newPassword: z.string().min(8, 'Minimum 8 caractères'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

const Settings = () => {
  const { user, profile, updateProfile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [plansDialogOpen, setPlansDialogOpen] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profile?.full_name || '',
      company_name: profile?.company_name || '',
      phone: profile?.phone || '',
      website: profile?.website || '',
    },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
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

  const handlePasswordReset = async (data: PasswordFormData) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword
      });

      if (error) throw error;

      toast({
        title: "Mot de passe modifié",
        description: "Votre mot de passe a été mis à jour avec succès",
      });
      
      passwordForm.reset();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      '⚠️ ATTENTION: Cette action est irréversible!\n\n' +
      'Êtes-vous absolument certain de vouloir supprimer votre compte?\n\n' +
      'Toutes vos données seront définitivement perdues:\n' +
      '• Tous vos funnels\n' +
      '• Tous vos leads\n' +
      '• Toutes vos analytics\n' +
      '• Votre profil et paramètres\n\n' +
      'Tapez "SUPPRIMER" pour confirmer.'
    );

    if (!confirmed) return;

    const doubleConfirm = window.prompt(
      'Tapez "SUPPRIMER" en majuscules pour confirmer définitivement:'
    );

    if (doubleConfirm !== 'SUPPRIMER') {
      toast({
        title: 'Suppression annulée',
        description: 'Votre compte n\'a pas été supprimé',
      });
      return;
    }

    try {
      setDeletingAccount(true);

      // Soft delete by marking funnels as deleted
      const { error: funnelsError } = await supabase
        .from('funnels')
        .update({ deleted_at: new Date().toISOString() })
        .eq('user_id', user?.id);
      
      if (funnelsError) throw funnelsError;

      toast({
        title: 'Compte désactivé',
        description: 'Votre compte et toutes vos données ont été désactivés. Contactez le support pour une suppression définitive.',
      });

      // Sign out
      await supabase.auth.signOut();
      window.location.href = '/';
    } catch (error: any) {
      console.error('Delete account error:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de désactiver le compte. Contactez le support.',
        variant: 'destructive',
      });
    } finally {
      setDeletingAccount(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "Fichier trop volumineux",
          description: "La taille maximale est de 2MB",
          variant: "destructive",
        });
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Format invalide",
          description: "Seules les images sont acceptées",
          variant: "destructive",
        });
        return;
      }

      setUploading(true);

      // Delete old avatar if exists
      if (profile?.avatar_url) {
        const oldPath = profile.avatar_url.split('/').pop();
        if (oldPath) {
          await supabase.storage.from('avatars').remove([`${user?.id}/${oldPath}`]);
        }
      }

      // Upload new avatar
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user?.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile with new avatar URL
      const { error: updateError } = await updateProfile({
        avatar_url: publicUrl,
      });

      if (updateError) throw updateError;

      await refreshProfile();

      toast({
        title: "Photo mise à jour",
        description: "Votre photo de profil a été mise à jour",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
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
      <div className="p-4 sm:p-6 space-y-6 sm:space-y-8 max-w-5xl mx-auto">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Paramètres</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2">
            Gérez votre compte et vos préférences
          </p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1">
            <TabsTrigger value="profile" className="text-xs sm:text-sm">
              <User className="mr-0 sm:mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Profil</span>
            </TabsTrigger>
            <TabsTrigger value="plan" className="text-xs sm:text-sm">
              <CreditCard className="mr-0 sm:mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Plan</span>
            </TabsTrigger>
            <TabsTrigger value="ai" className="text-xs sm:text-sm">
              <Sparkles className="mr-0 sm:mr-2 h-4 w-4" />
              <span className="hidden sm:inline">IA</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="text-xs sm:text-sm">
              <Bell className="mr-0 sm:mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
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
                    {profile?.avatar_url && (
                      <AvatarImage src={profile.avatar_url} alt={profile.full_name || 'Avatar'} />
                    )}
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {uploading ? 'Téléchargement...' : 'Changer la photo'}
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

                  <div className="space-y-2">
                    <Label htmlFor="website">Site web</Label>
                    <Input
                      id="website"
                      type="url"
                      placeholder="https://example.com"
                      {...form.register('website')}
                    />
                    {form.formState.errors.website && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.website.message}
                      </p>
                    )}
                  </div>

                  <Button type="submit" disabled={loading}>
                    {loading ? 'Enregistrement...' : 'Sauvegarder'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sécurité</CardTitle>
                <CardDescription>
                  Changez votre mot de passe
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={passwordForm.handleSubmit(handlePasswordReset)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      {...passwordForm.register('newPassword')}
                    />
                    {passwordForm.formState.errors.newPassword && (
                      <p className="text-sm text-destructive">
                        {passwordForm.formState.errors.newPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      {...passwordForm.register('confirmPassword')}
                    />
                    {passwordForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-destructive">
                        {passwordForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  <Button type="submit" disabled={loading}>
                    <Lock className="mr-2 h-4 w-4" />
                    {loading ? 'Modification...' : 'Changer le mot de passe'}
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
                  <Button onClick={() => setPlansDialogOpen(true)}>Voir les plans</Button>
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
                    <div className="text-sm flex-1">
                      <p className="font-medium mb-1">Optimisez votre utilisation</p>
                      <p className="text-muted-foreground mb-3">
                        Les crédits IA sont utilisés pour générer des images, vidéos, audio et contenu texte.
                        Planifiez vos générations pour maximiser votre quota mensuel.
                      </p>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setPlansDialogOpen(true)}
                      >
                        Acheter plus de crédits
                      </Button>
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
              <CardContent className="space-y-6">
                {/* Sound Notifications */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sound-enabled" className="text-base">Sons de notification</Label>
                    <p className="text-sm text-muted-foreground">
                      Jouer un son lors de nouvelles notifications
                    </p>
                  </div>
                  <Switch
                    id="sound-enabled"
                    defaultChecked={localStorage.getItem('notification_sound_enabled') !== 'false'}
                    onCheckedChange={(checked) => {
                      localStorage.setItem('notification_sound_enabled', String(checked));
                      toast({
                        title: checked ? "Sons activés" : "Sons désactivés",
                        description: checked 
                          ? "Vous recevrez des notifications sonores" 
                          : "Les sons de notification sont désactivés",
                      });
                    }}
                  />
                </div>

                <Separator />

                {/* Sound Type Selection */}
                <div className="space-y-3">
                  <Label className="text-base">Type de son</Label>
                  <p className="text-sm text-muted-foreground">
                    Choisissez le son de notification qui vous convient
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                    {[
                      { value: 'beep', label: 'Bip', icon: '🔔' },
                      { value: 'bell', label: 'Cloche', icon: '🔊' },
                      { value: 'pop', label: 'Pop', icon: '✨' },
                    ].map((sound) => (
                      <Button
                        key={sound.value}
                        variant={localStorage.getItem('notification_sound') === sound.value || (!localStorage.getItem('notification_sound') && sound.value === 'beep') ? 'default' : 'outline'}
                        className="h-auto py-4 flex flex-col gap-2"
                        onClick={() => {
                          localStorage.setItem('notification_sound', sound.value);
                          // Play preview
                          const audio = new Audio();
                          const sounds = {
                            beep: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBCl+zPLTgjMGHm7A7+OZUQ0NVKnn77JfGAg+ltryxnMnBSyBzvLYiTcIGWi77eefTRAMUKfj8LZjHAY4ktfyzHksBSR3x/DdkEAKFF605+uoVRQKRp/g8r5sIQQpfszyxHksBSR3x/DdkEAKFF605+uoVRQKRp/g8r5sIQQpfszyxHksBSR3x/DdkEAKFF605+uoVRQKRp/g8r5sIQQpfszyxHksBSR3x/DdkEAKFF605+uoVRQKRp/g8r5sIQQpfszyxHksBSR3x/DdkEAKFF605+uoVRQKRp/g8r5sIQQpfszyxHksBSR3x/DdkEAKFF605+uoVRQKRp/g8r5sIQQpfszyxHksBSR3x/DdkEAKFF605+uoVRQKRp/g8r5sIQQpfszyxHksBSR3x/DdkEAKFF605+uoVRQKRp/g8r5sIQQpfszyxHksBSR3x/DdkEAKFF605+uoVRQKRp/g8r5sIQQpfszyxHksBSR3x/DdkEAKFF605+uoVRQKRp/g8r5sIQQpfszyxHksBSR3x/DdkEAKFF605+uoVRQKRp/g8r5sIQQpfszyxHksBSR3x/DdkEAKFF605+uoVRQKRp/g8r5sIQQpfszyxHksBSR3x/DdkEAKFF605+uoVRQKRp/g8r5sIQQpfszyxHksBSR3x/DdkEAKFF605+uoVRQKRp/g8r5sIQQpfszyxHksBSR3x/DdkEAKFF605+uoVRQKRp/g8r5sIQQpfszyxHksBSR3x/DdkEAKFF605+uoVRQKRp/g8r5sIQQpfszyxHksBSR3x/DdkEAKFF605+uoVRQKRp/g8r5sIQQpfszyxHksBSR3x/DdkEAKFF605+uoVRQKRp/g8r5sIQQpfszyxHksBSR3x/DdkEAKFF605+uoVRQKRp/g8r5sIQQpfszyxHksBSR3x/DdkEAKFF605+uoVRQKRp/g8r5sIQQpfszyxHksBSR3x/DdkEAKFF605+uoVRQKRp/g8r5sIQQpfszyxHksBSR3x/DdkEAK',
                            bell: 'data:audio/wav;base64,UklGRnQFAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YVAFAACAD4SQiI+NjYuJhYV/fn17eXd1c3Fvbm1sa2ppaWdmZWRjYmBfXl1cW1pZWFdWVVRTUlFQT05NTEtKSUhHRkVEQ0JBQEBAQEBBQUJDREVGSElKTE1PUFFTVFZXWV1eYGJkZmhqa21vcXN2eXt+gISHjJCUmZ6ipq2ytLm8wsTIy87Q0tbZ3N/j5unr7u/w8/T09fb29/j4+fn5+vn5+fn5+fn4+Pf39vX19PT08vHv7err6unk4t/c2dbT0M7LyMXCv7y5trKupqKdmZSQi4eEgH57eHVzcG5sa2lnZmRjYWBfXl1bWllYV1ZVVFNSU1JRUVBQUFBQUFBQUFFRUlJTU1RVVVZXWFLAAA8AAEAfAQAAABAA',
                            pop: 'data:audio/wav;base64,UklGRpQEAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YXAEAACAP4iYoKiwtLi8v8DBwsLCwsHBwL+9vLq4trSysa+trKqqp6WjoJ+cm5iWlJKPjYuJhoSCgH17eXd1c3FvbW1ra2lpaGdmZWRjYmJhYGBfXl5dXV1cW1taWllZWVhYWFhYWFhYWFhYWVlaWltcXF1eX2Bhm5iViYeEgoB+fHp4dnRycG5samlnZWRiYF9dXFpZWFZVU1JRUFBOTk5MTExMTEzMy8vLy8vMzM7Oz9DR0tPU1dbX2drb3d7g4uTm6Oru7/Dy9PX29/j5+vv7/P39/f39/v3+/v7+/v7+/v39/fz8+/v6+fn4+Pb19PPy8O/t7Orq6Ofm5OPh4N7d3NrY19XU0dDP',
                          };
                          audio.src = sounds[sound.value as keyof typeof sounds];
                          audio.play().catch(() => {});
                          
                          toast({
                            title: "Son modifié",
                            description: `Son "${sound.label}" sélectionné`,
                          });
                        }}
                      >
                        <span className="text-2xl">{sound.icon}</span>
                        <span className="text-sm font-medium">{sound.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Zone de danger
                </CardTitle>
                <CardDescription>
                  Actions irréversibles sur votre compte
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-semibold text-destructive mb-1">
                        Supprimer mon compte
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Cette action est définitive et irréversible. Toutes vos données seront perdues : funnels, leads, analytics, profil.
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      onClick={handleDeleteAccount}
                      disabled={deletingAccount}
                      className="w-full sm:w-auto"
                    >
                      {deletingAccount ? 'Suppression...' : 'Supprimer mon compte'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <PlansDialog open={plansDialogOpen} onOpenChange={setPlansDialogOpen} />
    </MainLayout>
  );
};

export default Settings;
