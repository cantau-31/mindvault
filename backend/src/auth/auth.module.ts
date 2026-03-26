import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { User, UserSchema } from '../schemas/user.schema';

@Module({
  imports: [
    // Modèle User pour accéder à la collection users
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),

    // Machine à fabriquer les tokens JWT
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-secret-change-me',
      signOptions: { expiresIn: '24h' },
    }),

    // Système Passport (obligatoire pour que JwtStrategy fonctionne)
    PassportModule,
  ],

  controllers: [AuthController],

  providers: [
    AuthService,
    JwtStrategy, // le lecteur de badges — s'enregistre sous le nom 'jwt'
  ],

  exports: [
    JwtStrategy,
    PassportModule,
    // Exportés pour que BooksModule puisse utiliser @UseGuards(JwtAuthGuard)
  ],
})
export class AuthModule {}
