# Immo Gestion

Gestion locative pour petits propriétaires : les biens, les locataires, les
loyers et les quittances, sans tableur.

Deux espaces distincts, avec deux jeux de droits :

- **Propriétaire** — biens, baux, locataires, suivi des loyers, quittances en PDF
- **Locataire** — son bail, ses quittances, ses documents

L'inscription est **réservée aux locataires, sur code d'invitation** : un compte
propriétaire n'existe pas parce que quelqu'un s'est inscrit.

## Stack

Next.js (App Router) · TypeScript · Supabase (Postgres, authentification,
stockage) · Tailwind · shadcn/ui · React Hook Form + Zod · jsPDF

## Démarrer

```bash
npm install
cp .env.example .env.local   # renseigner les clés Supabase
npm run dev
```

Le schéma est dans `supabase/` : quatre migrations, à appliquer dans l'ordre.

## Ce qu'il faut savoir avant de toucher au code

- **Chaque table a ses règles de sécurité au niveau des lignes.** Un propriétaire
  ne voit que ses biens, un locataire que son bail. C'est la base qui l'impose,
  pas l'interface.
- **Les routes locataire sont filtrées dans le middleware** par correspondance
  exacte ou suivie d'une barre. Un `startsWith("/tenant")` laisserait passer
  toute adresse commençant par ces sept caractères.
- **Les quittances sont générées à la demande**, jamais stockées : un document
  produit une fois se retrouve périmé le mois suivant.
