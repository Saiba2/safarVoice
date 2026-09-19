# Déploiement — notes

## Tâches planifiées : horaires dégradés pour le plan Hobby

`frontend/vercel.json` ne contient que la clé `crons`. Vercel valide ce fichier
contre un schéma strict et **rejette toute propriété inconnue à la racine** —
une tentative d'y documenter ces horaires avec une clé `$comment` a fait
échouer l'import du projet avec :

```
Invalid request: should NOT have additional property `$comment`. Please remove it.
```

JSON n'ayant pas de commentaires, la documentation vit donc ici.

### Horaires d'origine du starter

| Route | Horaire d'origine | Horaire actuel (Hobby) |
|---|---|---|
| `/api/cron/outbox-drain` | `*/1 * * * *` | `0 2 * * *` |
| `/api/cron/email-queue-drain` | `*/1 * * * *` | `10 2 * * *` |
| `/api/cron/verification-cleanup` | `0 * * * *` | `20 2 * * *` |
| `/api/cron/order-expiration` | `*/5 * * * *` | `30 2 * * *` |
| `/api/cron/webhook-log-purge` | `0 0 * * *` | `0 3 * * *` |
| `/api/cron/email-job-purge` | `0 0 * * *` | `15 3 * * *` |

### Pourquoi

Le plan Hobby n'accepte que des expressions se déclenchant une fois par jour :

```
Hobby accounts are limited to daily cron jobs.
This cron expression (*/1 * * * *) would run more than once per day.
```

Les horaires sont échelonnés de dix minutes pour éviter que les six tâches ne
se disputent le même créneau d'exécution.

### Ce que cette dégradation coûte réellement

`outbox-drain` et `email-queue-drain` sont ce qui **délivre** les e-mails et les
notifications. Les effets de bord des webhooks sont écrits dans l'outbox à
l'intérieur de la transaction et n'en sortent qu'au passage de la tâche. À une
exécution par jour, une confirmation de paiement peut attendre **jusqu'à 24
heures**. Un e-mail de vérification d'inscription également.

`order-expiration` passe de 5 minutes à 24 heures : des commandes en attente
survivent à leur fenêtre d'expiration pendant près d'une journée.

### Comment revenir à un fonctionnement correct

Deux voies, sans modifier une ligne de code applicatif :

1. **Planificateur externe** (gratuit). Les routes sont de simples points
   d'entrée HTTP protégés par `Authorization: Bearer ${CRON_SECRET}`. GitHub
   Actions, Upstash QStash ou tout service équivalent peut les appeler à la
   fréquence voulue. Seul l'appelant change.
2. **Vercel Pro**. Restaurer les horaires de la colonne « origine » ci-dessus.

## Variables d'environnement requises au build

`frontend/src/lib/server/env.ts` valide l'environnement **à l'import du
module**, et Next.js importe toutes les routes pendant l'étape « collect page
data ». Une variable obligatoire manquante fait donc échouer la **compilation**,
pas seulement l'exécution :

```
Error: JWT_SECRET is required. Set it in .env
> Build error occurred
Error: Failed to collect page data for /api/admin/orders
```

**Obligatoires** : `DATABASE_URL` (URL PostgreSQL valide), `JWT_SECRET`
(32 caractères minimum).

**Recommandées** : `DIRECT_URL`, `CRON_SECRET`, `ENCRYPTION_KEY`,
`COOKIE_PREFIX` (`app`), `NEXT_PUBLIC_COOKIE_PREFIX` (`app`), et `APP_URL` —
cette dernière devant recevoir l'URL de déploiement, jamais `localhost`.

## Réglages du projet Vercel

- **Root Directory** : `frontend`. Le dépôt est un espace de travail pnpm ; la
  racine ne contient pas d'application Next, seulement l'orchestrateur.
- **Framework** : Next.js (détecté automatiquement).
