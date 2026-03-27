import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { AiModule } from './ai/ai.module';
import { NotesModule } from './notes/notes.module';
import { CollectionsModule } from './collections/collections.module';
import { SharedModule } from './shared/shared.module';
import { NoteSchema } from './schemas/note.schema';
import { CollectionSchema } from './schemas/collection.schema';
import { CommentSchema } from './schemas/comment.schema';

function sanitizeMongoUri(rawUri: string): string {
  return rawUri.trim().replace(/^['"]|['"]$/g, '');
}

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
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 2. Connexion MongoDB Atlas
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const rawMongoUri =
          configService.get<string>('MONGODB_URI') ||
          configService.get<string>('MONGO_URI') ||
          configService.get<string>('DATABASE_URL') ||
          '';
        const mongoUri = sanitizeMongoUri(rawMongoUri);

        if (!mongoUri) {
          throw new Error(
            'Missing MongoDB URI. Set MONGODB_URI (or MONGO_URI / DATABASE_URL).',
          );
        }

        if (
          !mongoUri.startsWith('mongodb://') &&
          !mongoUri.startsWith('mongodb+srv://')
        ) {
          throw new Error(
            `Invalid MongoDB URI scheme for value "${mongoUri.slice(0, 32)}...". Expected "mongodb://" or "mongodb+srv://".`,
          );
        }

        return { uri: mongoUri };
      },
    }),

    // 3. Modèles MongoDB (MindVault)
    MongooseModule.forFeature([
      { name: 'Note', schema: NoteSchema },
      { name: 'Collection', schema: CollectionSchema },
      { name: 'Comment', schema: CommentSchema },
    ]),

    // 4. Modules fournis
    AuthModule,
    AiModule,
    NotesModule,
    CollectionsModule,
    SharedModule,

    // 5. Vos modules métier — ajoutez-les ici :
    // EquipmentModule,    // SportLink
    // ReservationsModule, // SportLink
    // NotesModule,        // MindVault
    // CollectionsModule,  // MindVault
  ],
})
export class AppModule {}
