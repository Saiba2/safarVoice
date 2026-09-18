# Banani implementation status — SafarVoice

Flow: **SafarVoice Final** — https://app.banani.co/flow/GqulRkGd1ju8
Fetched: 2026-09-18 (12 screens, 16 shared files, ~137 000 chars)
Stack cible: Next.js 16 App Router · React 19 · Tailwind v4 · Prisma 5 / Neon

## Done
- [x] **Fondations** — `globals.css` (@theme Banani), `layout.tsx` (DM Sans, métadonnées FR),
      `components/layout/{SidebarNav,TopBar,AppShell}.tsx`, `components/ui/InitialsAvatar.tsx`,
      `lib/navigation.ts` — commit `241b643`
- [x] **Landing Page** — `app/page.tsx` + `components/landing/` (9 sections) — vérifié à
      l'exécution (HTTP 200, 96 Ko, contenus présents, aucune erreur)

## In progress
- [ ] Groupe A, écrans restants : AuthPage, ProfileSettings, GeneralSettings,
      NotificationsDropdown, TermsOfService

## Pending — écrans récupérés, non planifiés

### Groupe A — câblables sur l'API existante (aucun modèle à créer)
| Écran | Source Banani | Route cible | API existante |
|---|---|---|---|
| Authentication — Connexion | `AuthPage.jsx` | `/auth/login`, `/auth/signup` | `/api/auth/login`, `/signup`, `/verify-email`, `/forgot-password`, `/oauth/google/start` |
| Paramètres du profil | `ProfileSettings.jsx` | `/settings/profil` | `/api/auth/me`, `/change-password`, `/withdrawal-pin` |
| Paramètres généraux | `GeneralSettings.jsx` | `/settings` | `/api/notifications/prefs` |
| Notifications (Dropdown) | `NotificationsDropdown.jsx` | composant global | `/api/notifications`, `/notifications/count` |
| ~~Landing Page~~ ✅ | `LandingPage.jsx` | `/` | aucune (statique) |
| Terms of Service | `TermsOfService.jsx` | `/conditions` | aucune (statique) |

### Groupe B — nécessitent de nouveaux modèles Prisma + routes API
| Écran | Source Banani | Modèles manquants |
|---|---|---|
| Synthèse Vocale | `SyntheseVocale.jsx` | `TtsJob`, `Voice`, crédits |
| Bibliothèque de voix | `VoiceLibrary.jsx` | `Voice` |
| Voix premium | `PremiumVoices.jsx` | `Voice` (premium), entitlements |
| Mes fichiers audio | `MyAudioFiles.jsx` | `AudioFile` (+ Cloudinary) |
| Utilisation et facturation | `UsageAndBilling.jsx` | `UsageLedger`, `Subscription` |
| Plans de prix | `PricingPlans.jsx` | `Plan`, `Subscription` (+ Bictorys) |

## Composants partagés Banani (16)
`style.css` (tokens `@theme`) · `SidebarNav` · `TopBar` · `AudioPlayer` · `VoiceCard` ·
`VoiceLibraryCard` · `VoiceSettings` · `LandingHeader` · `LandingHero` · `LandingFooter` ·
`FeaturesSection` · `HowItWorksSection` · `LanguagesSection` · `UseCasesSection` ·
`TestimonialsSection` · `CTASection`

## Contraintes relevées dans les sources Banani
- **Design desktop uniquement** (`screenSize = 'desktop'`, `minHeight: 900px`, sidebar `w-56` fixe,
  panneau droit `w-80`). Le mobile est à concevoir — obligation du skill, mobile-first 375px.
- **Inline styles** présents (`style={{ minHeight: '900px' }}`) → à traduire en classes.
- **`@global/Icon`** = Lucide. `lucide-react` **n'est pas installé** dans le projet.
- **`@global/UserAvatar`** = composant propriétaire Banani, à remplacer.
- **`t()`** = helper i18n factice de Banani, non défini. L'app est monolingue FR →
  chaînes à externaliser dans `frontend/src/lib/constants.ts`.
- Devise **FCFA** (entier, sans décimale — invariant CLAUDE.md).
- Paiement évoqué : **Wave** + carte bancaire → couvert par Bictorys.
- Langues de synthèse : **Wolof, Français, Anglais, Arabe, Swahili**.

## Écart majeur — à trancher avec l'utilisateur
Le starter ne contient **aucun** modèle métier de SafarVoice. Prisma expose `User`, `Order`,
`Withdrawal`, `Organization`, `AdminAction`, `OAuthAccount`, `Notification`,
`VerificationCode`, `WebhookLog`, `OutboxEvent`, `EmailJob` — rien pour les voix, les
fichiers audio, les travaux de synthèse, les crédits ou les abonnements.

Il n'existe par ailleurs **aucun moteur de synthèse vocale** dans le projet. C'est une
décision produit (fournisseur, coût, langues africaines supportées) que seul l'utilisateur
peut prendre.

## Open design questions
- Fournisseur TTS ? — posée 2026-09-18, en attente
- Modèle de monétisation : abonnement récurrent ou packs de crédits ? — posée 2026-09-18, en attente
- Ordre d'implémentation (groupe A d'abord, ou verticale complète) ? — posée 2026-09-18, en attente
- Adaptations mobile (sidebar → menu, panneau droit → tiroir) ? — posée 2026-09-18, en attente

## Décisions produit prises avec l'utilisateur (2026-09-18)
- **Ordre** : fondations + groupe A d'abord.
- **Moteur TTS** : ElevenLabs — à câbler derrière une abstraction `TtsProvider`
  calquée sur `PaymentProvider`, quand le groupe B démarrera.
- **Monétisation** : packs de crédits (achat ponctuel via Bictorys/Wave), pas d'abonnement.
- **Mobile** : sidebar → tiroir coulissant, panneau droit → feuille modale,
  colonne unique, zones tactiles ≥ 44 px.

## Écarts relevés dans le design, à arbitrer
- **Langues incohérentes.** La landing annonce Français, Anglais, Espagnol, Allemand,
  Chinois, Arabe, Hindi « +30 autres ». Les écrans produit listent Wolof, Français,
  Anglais, Arabe, Swahili. Le wolof — l'argument différenciant — est absent de la landing.
- **`Math.random()` dans le rendu** du `LandingHero` Banani : casserait l'hydratation SSR.
  Remplacé par une liste fixe.
- **`© 2024` codé en dur** dans le footer Banani → rendu dynamique.
- **Crédits et notifications** : la maquette affiche « 12 500 FCFA » et une pastille rouge
  permanente. Aucun modèle ne peut les alimenter → placeholder « — » et pastille
  conditionnelle, plutôt que des valeurs inventées.
