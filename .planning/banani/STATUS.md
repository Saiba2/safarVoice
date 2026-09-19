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
- [x] **Authentication — Connexion** — `app/auth/{connexion,inscription,verification}/page.tsx`
      + `components/auth/{AuthLayout,AuthField,GoogleSignIn}.tsx` — câblé sur
      `/api/auth/{login,signup,verify-email,resend-verification}` et `oauth/google/start`.
      Les 3 pages répondent 200 et sont prérendues en statique au build.

- [x] **Paramètres du profil** — `app/settings/profil/page.tsx` + `app/settings/mot-de-passe/page.tsx`
      + `components/ui/{Toggle,InitialsAvatar}.tsx` + `lib/countries.ts`.
      Backend ajouté : `PATCH /api/auth/me`, champs Prisma `country` et
      `preferredLanguage`, migration `5_user_profile_fields` appliquée sur Neon.
      7 nouveaux tests (577 au total).

- [x] **Terms of Service** — `app/conditions/page.tsx`. Le marqueur
      `[Juridiction applicable]` de la maquette est rendu tel quel, à trancher.
- [x] **Paramètres généraux** — `app/settings/page.tsx` + palette sombre conçue
      (`globals.css`), `lib/preferences.ts`, `contexts/PreferencesContext.tsx`,
      `components/ui/{SegmentedControl,RangeField}.tsx`. Thème et densité réels.
- [x] **Notifications (Dropdown)** — `components/notifications/NotificationsBell.tsx`,
      câblé sur `/api/notifications`, `/count` et le `PATCH` de lecture.
- [x] **Hors maquette, exigés par l'API** — `app/auth/mot-de-passe-oublie/` et
      `app/auth/reinitialisation/`, liés depuis la connexion.

## GROUPE A TERMINÉ — 6 écrans de la maquette + 5 écrans hors maquette

## In progress
- [ ] Rien en cours. Prochaine étape : groupe B (modèles métier + moteur TTS).

## Reste à faire — groupe B
Aucun de ces écrans n'a de backend. Ils exigent des modèles Prisma, des
migrations, des routes, et pour la plupart le moteur ElevenLabs.

| Écran | Modèles manquants |
|---|---|
| Synthèse Vocale | `TtsJob`, `Voice`, crédits |
| Bibliothèque de voix | `Voice` |
| Voix premium | `Voice` (premium), droits d'accès |
| Mes fichiers audio | `AudioFile` (+ Cloudinary) |
| Utilisation et facturation | `UsageLedger`, achats de crédits |
| Plans de prix | `CreditPack` (+ Bictorys) |

Rappel du risque consigné plus haut : **ElevenLabs ne documente ni le wolof,
ni le swahili, ni le lingala**. Sur les six langues annoncées en page
d'accueil, trois seulement sont confirmées. À vérifier avant de bâtir le
groupe B dessus.

## Écarts relevés sur les paramètres du profil (2026-09-18)
Sur ~14 contrôles de la maquette, 3 seulement avaient un backend. Décision
utilisateur : construire ce qui manque pour le cœur, écarter le reste.

**Construit** : nom, pays, langue préférée, photo de profil (via `/api/upload`
puis `PATCH /api/auth/me`), changement/définition de mot de passe, bascule des
notifications par e-mail.

**Écartés, chacun étant une fonctionnalité à part entière** : authentification à
deux facteurs, liste des sessions actives, export des données personnelles,
suppression de compte. Ces sections ne sont pas affichées — plutôt que dessinées
et inertes.

**Deux champs fusionnés en un.** La maquette sépare « Prénom » et « Nom ». Le
modèle de données n'a qu'un champ `name`. Découper puis recoller sur le premier
espace mutile les prénoms composés, fréquents ici (« Mouhamadou Lamine Fall »).
Un seul champ « Nom complet » conserve exactement ce que l'utilisateur saisit.

**« Partage des données » et « Thème sombre »** retirés de cet écran : le premier
n'a aucun champ, le second relève des paramètres généraux.

**Les notifications** sont modélisées par type d'événement côté API, alors que la
maquette offre une bascule globale. Celle-ci écrit donc la même valeur pour tous
les types connus (`WELCOME`, `PAYMENT_RECEIVED`) — à compléter quand de nouveaux
gabarits seront ajoutés.

## Écarts relevés sur l'écran de connexion (2026-09-18)
- **Photo du panneau gauche** : la maquette la génère via `<Image prompt="...">`, un
  composant propriétaire Banani. Aucun fichier correspondant n'existe. Remplacé par un
  dégradé de marque portant le même texte — un vrai visuel reste à choisir.
- **Bouton Apple** : retiré. Le kit ne fournit qu'un seul fournisseur OAuth (Google).
  Un bouton Apple serait un contrôle inopérant.
- **« Se souvenir de moi »** : retiré. Le cookie de rafraîchissement dure 7 jours dans
  tous les cas ; la case à cocher n'aurait piloté aucun comportement réel.
- **« +32 000 créateurs »** et les témoignages de la landing sont des affirmations
  commerciales fournies par le design, non vérifiées. Reproduites telles quelles —
  elles engagent le produit, pas le code.
- **`© 2024`** codé en dur → rendu dynamique, comme sur la landing.

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
