import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { AiModule } from './ai/ai.module';
import { NotesModule } from './notes/notes.module';
import { CollectionsModule } from './collections/collections.module';
import { SharedModule } from './shared/shared.module';

// ===================================================
// STARTER KIT — Projet IPSSI MERN & TypeScript
// ===================================================
// Ce qui est prêt :
//   - ConfigModule : charge le .env automatiquement
//   - MongooseModule : connexion MongoDB Atlas
//   - AuthModule : register, login, JWT, guards
//   - AiModule : appel LLM via LiteLLM
//
// Ce que VOUS devez ajouter :
//   - Vos modules métier (EquipmentModule, NotesModule, etc.)
//   - Vos schémas MongoDB dans src/schemas/
//   - Importez vos modules ici dans le tableau imports
// ===================================================

@Module({
  imports: [
    // 1. Variables d'environnement (.env)
    ConfigModule.forRoot(),

    // 2. Connexion MongoDB Atlas
    MongooseModule.forRoot(process.env.MONGODB_URI || ''),

    // 3. Modules fournis
    AuthModule,
    AiModule,
    NotesModule,
    CollectionsModule,
    SharedModule,

    // 4. Vos modules métier — ajoutez-les ici :
    // EquipmentModule,    // SportLink
    // ReservationsModule, // SportLink
    // NotesModule,        // MindVault
    // CollectionsModule,  // MindVault
  ],
})
export class AppModule {}
