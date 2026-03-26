import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from '../schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    // 1. Vérifier que l'email n'existe pas déjà
    const exists = await this.userModel.findOne({ email: dto.email });
    if (exists) {
      throw new ConflictException('Email déjà utilisé');
    }

    // 2. Hasher le mot de passe (JAMAIS stocker en clair)
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // 3. Créer l'utilisateur en base
    const user = await this.userModel.create({
      email: dto.email,
      password: hashedPassword,
    });

    // 4. Générer et retourner le token JWT
    const payload = { sub: user._id, email: user.email, role: user.role };
    return { access_token: this.jwtService.sign(payload) };
  }

  async login(dto: LoginDto) {
    // 1. Chercher l'utilisateur par email
    const user = await this.userModel.findOne({ email: dto.email });
    if (!user) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    // 2. Comparer le mot de passe
    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    // 3. Générer et retourner le token
    const payload = { sub: user._id, email: user.email, role: user.role };
    return { access_token: this.jwtService.sign(payload) };
  }
}
