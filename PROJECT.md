# Immo-Gestion — Plan du projet

## Vision

Plateforme web de gestion locative pour propriétaire. Permet de gérer ses biens, suivre les revenus/charges, et offrir un espace locataire pour les demandes et documents.

## Utilisateurs

### Propriétaire (admin)
- Dashboard global : revenus totaux, taux d'occupation, rendement par bien
- Liste des biens avec fiche détaillée par appartement :
  - Adresse, surface, nombre de pièces, photos
  - Loyer actuel, charges, taxe foncière
  - Historique des paiements (loyers reçus)
  - Rendement brut/net calculé automatiquement
  - Locataire actuel + historique des locataires
  - Documents (bail, état des lieux, quittances)
- Ajouter / modifier / archiver un bien
- Voir toutes les demandes locataires (maintenance, questions)
- Notifications (loyer en retard, demande en attente)

### Locataire (client)
- Inscription avec code d'invitation (lié à un bien)
- Dashboard personnel :
  - Son bien (adresse, infos)
  - Ses quittances de loyer
  - Historique des paiements
- Soumettre une demande (réparation, question, signalement)
- Suivre le statut de ses demandes
- Télécharger ses documents (bail, quittances)

## Stack technique

| Composant | Techno | Pourquoi |
|-----------|--------|----------|
| **Frontend** | Next.js 14 (App Router) | React, SSR, déploiement Vercel natif |
| **UI** | Tailwind CSS + shadcn/ui | Moderne, composants propres, customisable |
| **Backend / BDD** | Supabase | PostgreSQL + Auth + Storage + Realtime + Row Level Security |
| **Auth** | Supabase Auth | Email/password, magic link, gestion des rôles |
| **Hébergement** | Vercel (front) + Supabase (back) | Gratuit au démarrage, scalable |
| **Design** | Skill frontend-design | Pour un design distinctif, pas un template générique |

## Base de données (Supabase PostgreSQL)

### Tables principales

```
users
  - id (UUID, PK)
  - email
  - role (owner | tenant)
  - full_name
  - phone
  - created_at

properties
  - id (UUID, PK)
  - owner_id (FK -> users)
  - address
  - city
  - postal_code
  - surface_m2
  - rooms
  - property_type (apartment | house | studio | building)
  - floor
  - year_built
  - purchase_price
  - current_rent
  - charges_monthly
  - tax_annual
  - dpe
  - status (rented | vacant | maintenance)
  - photos (array URLs via Supabase Storage)
  - notes
  - created_at

tenancies
  - id (UUID, PK)
  - property_id (FK -> properties)
  - tenant_id (FK -> users)
  - start_date
  - end_date
  - rent_amount
  - deposit_amount
  - status (active | ended | pending)

payments
  - id (UUID, PK)
  - tenancy_id (FK -> tenancies)
  - amount
  - due_date
  - paid_date
  - status (paid | pending | late)
  - payment_method
  - notes

requests
  - id (UUID, PK)
  - tenancy_id (FK -> tenancies)
  - tenant_id (FK -> users)
  - property_id (FK -> properties)
  - type (repair | question | complaint | other)
  - title
  - description
  - photos (array URLs)
  - status (open | in_progress | resolved | closed)
  - priority (low | medium | high | urgent)
  - created_at
  - resolved_at

documents
  - id (UUID, PK)
  - property_id (FK -> properties)
  - tenancy_id (FK -> tenancies, nullable)
  - type (lease | inventory | receipt | insurance | other)
  - name
  - file_url (Supabase Storage)
  - uploaded_at
```

## Pages / Routes

### Propriétaire (admin)
```
/                          → Dashboard global
/properties                → Liste des biens
/properties/new            → Ajouter un bien
/properties/[id]           → Fiche détaillée d'un bien
/properties/[id]/edit      → Modifier un bien
/tenants                   → Liste des locataires
/tenants/[id]              → Fiche locataire
/payments                  → Vue globale des paiements
/requests                  → Toutes les demandes
/requests/[id]             → Détail d'une demande
/documents                 → Tous les documents
/settings                  → Paramètres du compte
```

### Locataire
```
/tenant                    → Dashboard locataire
/tenant/payments           → Historique paiements
/tenant/requests           → Mes demandes
/tenant/requests/new       → Nouvelle demande
/tenant/documents          → Mes documents
/tenant/settings           → Mon profil
```

### Auth
```
/login                     → Connexion
/register                  → Inscription (avec code invitation)
/forgot-password           → Mot de passe oublié
```

## Métriques affichées (Dashboard propriétaire)

- **Revenus mensuels** : somme des loyers encaissés ce mois
- **Revenus annuels** : total de l'année en cours
- **Taux d'occupation** : biens loués / total biens × 100
- **Rendement brut moyen** : (loyers annuels / valeur totale biens) × 100
- **Loyers en retard** : nombre et montant total
- **Demandes en cours** : nombre de demandes ouvertes
- **Rendement par bien** : rendement brut et net par propriété

## Phases de développement

### Phase 1 : MVP (session suivante)
- Auth (login/register avec rôles)
- CRUD propriétés (ajouter, voir, modifier)
- Dashboard propriétaire avec métriques basiques
- Fiche bien avec infos + rendement

### Phase 2 : Locataires
- Inscription locataire par code invitation
- Dashboard locataire
- Système de demandes (CRUD)
- Notifications

### Phase 3 : Paiements & Documents
- Suivi des paiements (marquer comme payé/en retard)
- Génération de quittances PDF
- Upload/download documents (Supabase Storage)

### Phase 4 : Polish & SaaS
- Design final avec frontend-design skill
- Multi-propriétaires (isolation des données)
- Facturation / Stripe
- App mobile (React Native ou PWA)

## Outils et plugins utiles

- **Supabase MCP** : si disponible, pour interagir avec la BDD directement
- **frontend-design skill** : pour le design UI distinctif
- **Canva plugin** : pour créer des assets visuels (logo, bannières)
- **shadcn/ui CLI** : pour ajouter les composants (`npx shadcn-ui@latest add`)

## Pour démarrer la prochaine session

Dire à Claude :
> "On reprend le projet immo-gestion. Le plan est dans PROJECT.md à la racine du repo. On attaque la Phase 1 : auth + CRUD propriétés + dashboard. Stack : Next.js + Supabase + Tailwind + shadcn/ui."
