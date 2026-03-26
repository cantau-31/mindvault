# Starter Kit — Projet IPSSI MERN & TypeScript

## Ce qui est prêt

- **AuthModule** : register, login, JWT, guards (JwtAuthGuard), rôles (ADMIN/MEMBER)
- **AiModule** : appel LLM via LiteLLM (proxy) avec le SDK OpenAI
- **ConfigModule** : lecture automatique du fichier `.env`
- **MongooseModule** : connexion MongoDB Atlas configurée
- **ValidationPipe** : validation globale des DTOs activée
- **CORS** : activé pour le frontend React
- **SWC** : compilation rapide activée

## Démarrage rapide

```bash
# 1. Installer les dépendances
pnpm install

# 2. Configurer l'environnement
cp .env.example .env
# Remplir les valeurs dans .env

# 3. Lancer
pnpm start:dev

# 4. Tester
# POST http://localhost:3000/auth/register
# POST http://localhost:3000/auth/login
```

## Ce que VOUS devez créer

### SportLink
- `src/schemas/equipment.schema.ts`
- `src/schemas/reservation.schema.ts`
- `src/equipment/` (module, service, controller, DTOs)
- `src/reservations/` (module, service, controller, DTOs)
- Adapter `AiService` pour les recommandations de matériel

### MindVault
- `src/schemas/note.schema.ts`
- `src/schemas/collection.schema.ts`
- `src/schemas/comment.schema.ts`
- `src/notes/` (module, service, controller, DTOs)
- `src/collections/` (module, service, controller, DTOs)
- `src/shared/` (lecture publique + commentaires)
- Adapter `AiService` pour summarize, suggest-tags, ask

## Commandes utiles

```bash
# Générer un module complet avec le CLI NestJS
nest g resource equipment  # pour SportLink
nest g resource notes      # pour MindVault

# Lancer en mode debug
pnpm start:debug
```

## Structure

```
src/
├── main.ts              # Point d'entrée (ValidationPipe + CORS)
├── app.module.ts        # Module racine (ajoutez vos modules ici)
├── schemas/
│   └── user.schema.ts   # Schéma User (prêt)
├── auth/                # Auth JWT complète (prêt)
│   ├── auth.module.ts
│   ├── auth.service.ts
│   ├── auth.controller.ts
│   ├── jwt.strategy.ts
│   ├── jwt-auth.guard.ts
│   └── dto/
└── ai/                  # Module IA LiteLLM (prêt)
    ├── ai.module.ts
    └── ai.service.ts
```
