# Nümtema Face

Plateforme SaaS de création de funnels interactifs propulsée par l'IA.

## Description

Nümtema Face permet de créer des funnels de vente et de génération de leads avec vidéos interactives. L'IA génère automatiquement des parcours complets à partir de simples descriptions.

## Fonctionnalités

- **Éditeur de funnels** - Créez des parcours multi-étapes (Welcome, Questions, Messages, Lead Capture, Calendar)
- **Génération IA** - Générez des funnels complets à partir d'un prompt
- **Lead Management** - Capturez et gérez vos leads en temps réel
- **Analytics** - Suivez les conversions, sessions et sources de trafic
- **Templates** - Utilisez des modèles pré-construits

## Technologies

- React 18 + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Supabase (PostgreSQL, Auth, Edge Functions)
- Stripe (Paiements)

## Installation

```sh
# Cloner le repository
git clone <YOUR_GIT_URL>

# Aller dans le dossier
cd video-funnel-ai

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

## Scripts disponibles

- `npm run dev` - Serveur de développement
- `npm run build` - Build de production
- `npm run lint` - Vérification ESLint
- `npm run preview` - Prévisualiser le build

## Variables d'environnement

Créez un fichier `.env` avec :

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

## Licence

Propriétaire - Tous droits réservés
