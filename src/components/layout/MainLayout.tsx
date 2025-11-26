import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useAIUsage } from '@/hooks/useAIUsage';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { LayoutDashboard, Video, BarChart3, Settings, LogOut, Sparkles, AlignJustify, X, ChevronLeft, ChevronRight, User, FileText, CreditCard } from 'lucide-react';
import numtemaBillsLogo from '@/assets/numtema-bills-logo.png';
import { useState } from 'react';
import { cn } from '@/lib/utils';
interface MainLayoutProps {
  children: ReactNode;
}
const MainLayout = ({
  children
}: MainLayoutProps) => {
  const {
    user,
    profile,
    signOut
  } = useAuth();
  const {
    usage,
    percentage
  } = useAIUsage();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navItems = [{
    icon: LayoutDashboard,
    label: 'Dashboard',
    path: '/dashboard'
  }, {
    icon: Video,
    label: 'Funnels',
    path: '/funnels'
  }, {
    icon: FileText,
    label: 'Templates',
    path: '/templates'
  }, {
    icon: BarChart3,
    label: 'Analytics',
    path: '/analytics'
  }, {
    icon: CreditCard,
    label: 'Tarifs',
    path: '/pricing'
  }, {
    icon: Settings,
    label: 'Paramètres',
    path: '/settings'
  }];
  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return user?.email?.slice(0, 2).toUpperCase() || 'U';
  };
  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };
  return <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <AlignJustify className="h-5 w-5" />}
          </Button>
          <img src={numtemaBillsLogo} alt="Nümtema Bills" className="h-8" />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{profile?.full_name || 'Utilisateur'}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <User className="mr-2 h-4 w-4" />
              Profil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Sidebar */}
      <aside className={cn('fixed top-0 left-0 z-40 h-screen transition-all duration-300 bg-card border-r', 'hidden lg:block', sidebarOpen ? 'w-64' : 'w-20')}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 flex items-center justify-between">
            {sidebarOpen ? <>
                <Link to="/dashboard" className="flex items-center gap-2">
                  <img src={numtemaBillsLogo} alt="Nümtema Bills" className="h-10" />
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="hidden lg:flex hover:bg-accent/10 transition-smooth">
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              </> : <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="mx-auto hover:bg-accent/10 transition-smooth">
                <ChevronRight className="h-5 w-5" />
              </Button>}
          </div>

          <Separator />

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return <Link key={item.path} to={item.path}>
                  <Button variant={isActive ? 'default' : 'ghost'} className={cn('w-full justify-start transition-smooth', !sidebarOpen && 'justify-center')}>
                    <Icon className={cn('h-5 w-5', sidebarOpen && 'mr-3')} />
                    {sidebarOpen && <span>{item.label}</span>}
                  </Button>
                </Link>;
          })}
          </nav>

          {/* AI Usage */}
          {sidebarOpen && <div className="p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-accent" />
                  <span className="font-medium">Crédits IA</span>
                </div>
                <span className="text-muted-foreground">
                  {usage.current}/{usage.max}
                </span>
              </div>
              <Progress value={percentage} className="h-2" />
            </div>}

          <Separator />

          {/* User Profile */}
          <div className="p-4">
            {sidebarOpen ? <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start">
                    <Avatar className="h-8 w-8 mr-3">
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start flex-1 min-w-0">
                      <span className="text-sm font-medium truncate">
                        {profile?.full_name || 'Utilisateur'}
                      </span>
                      <span className="text-xs text-muted-foreground truncate">
                        {user?.email}
                      </span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    Paramètres
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu> : <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="mx-auto">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    Paramètres
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>}
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && <div className="lg:hidden fixed inset-0 z-30 bg-background">
          <div className="pt-16 p-4 space-y-2">
            {navItems.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return <Link key={item.path} to={item.path} onClick={() => setMobileMenuOpen(false)}>
                  <Button variant={isActive ? 'default' : 'ghost'} className="w-full justify-start text-xs text-left border">
                    <Icon className="h-5 w-5 mr-3" />
                    <span>{item.label}</span>
                  </Button>
                </Link>;
        })}
            
            <Separator className="my-4" />
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm px-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-accent" />
                  <span className="font-medium">Crédits IA</span>
                </div>
                <span className="text-muted-foreground">
                  {usage.current}/{usage.max}
                </span>
              </div>
              <Progress value={percentage} className="h-2 mx-3" />
            </div>
          </div>
        </div>}

      {/* Main Content */}
      <main className={cn('transition-all duration-300', 'pt-16 lg:pt-0', sidebarOpen ? 'lg:ml-64' : 'lg:ml-20')}>
        {children}
      </main>
    </div>;
};
export default MainLayout;